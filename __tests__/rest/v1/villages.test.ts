import { prismaClient } from "../../../backend/lib/prismaClient";
import request from "supertest";
import { api } from "../../../backend/rest";
import { testTokens} from "../../test_config/testData";
import { PARAMS, PATH, V1 } from "../../../consts/url";
import { join } from "path";
import initDB from "../../test_config/initDB";

beforeEach(async () => await initDB());


const PREFIX_VILLAGES = "/api/v1/villages";

describe("/api/v1/villages TEST villageController ", () => {
  test("GET /api/v1/villages/ getVillages : TEST it should be total villages same as db data and has properties", async () => {
    const countVillages = await prismaClient.village.count({
      where: { isPublic: true },
    });

    const { status, body } = await request(api)
      .get(PREFIX_VILLAGES)
      .set("Authorization", `Bearer ${testTokens.admin_user}`);

    expect(status).toBe(200);
    expect(body).toHaveProperty("villages");
    expect(body.villages.length).toBe(countVillages);
    expect(body.villages[0]).toHaveProperty("id");
    expect(body.villages[0]).toHaveProperty("name");
    expect(body.villages[0]).toHaveProperty("description");
  });

  test.each([
    testTokens.admin_user,
    testTokens.general_user,
    testTokens.sub_user,
  ])(`getVillageDetail request user = %s`, async (user) => {
    const dbVillage = await prismaClient.village.findFirst({
      where: { name: "village_B" },
    });
    if (!dbVillage) return;

    const { status, body } = await request(api)
      .get(PREFIX_VILLAGES + "/" + dbVillage.id)
      .set("Authorization", `Bearer ${user}`);

    if (user === testTokens.sub_user) {
      expect(status).toBe(404);
    } else {
      expect(status).toBe(200);
      expect(body).toHaveProperty("village");
      expect(body.village.id).toBe(dbVillage.id);
      expect(body.village.name).toBe(dbVillage.name);
      expect(body.village.description).toBe(dbVillage.description);
    }
  });

  test("GET /api/v1/villages/:villageId getVillageDetail : TEST error handling that the village is not found by wrong id", async () => {
    const wrong_id = "aaa";

    const dbVillage = await prismaClient.village.findUnique({
      where: { id: wrong_id },
    });

    expect(dbVillage).toBeNull();

    const { status, body } = await request(api)
      .get(PREFIX_VILLAGES + "/" + wrong_id)
      .set("Authorization", `Bearer ${testTokens.admin_user}`);

    expect(status).toBe(404);
    expect(body.village).toBeUndefined();
    expect(body).toHaveProperty("code");
    expect(body).toHaveProperty("message");
  });

  test("POST /api/v1/villages/create createVillage : TEST Create a village", async () => {
    const { status, body } = await request(api)
      .post(PREFIX_VILLAGES)
      .set("Authorization", `Bearer ${testTokens.admin_user}`)
      .send({ name: "HellO", description: "村の説明" });

    const dbVillage = await prismaClient.village.findUnique({
      where: { id: body.village.id },
      include: { users: true, messages: true },
    });

    expect(dbVillage).not.toBeNull();

    if (!dbVillage) return;

    expect(status).toBe(200);
    expect(body).toHaveProperty("village");
    expect(body.village.id).toBe(dbVillage.id);
    expect(body.village.name).toBe(dbVillage.name);
    expect(body.village.description).toBe(dbVillage.description);
  });

  test("POST /api/v1/villages/create createVillage : TEST error handling bad request by missing require properties", async () => {
    const { status, body } = await request(api)
      .post(PREFIX_VILLAGES)
      .set("Authorization", `Bearer ${testTokens.admin_user}`)
      .send({ description: "村の説明2" });

    expect(status).toBe(400);
    expect(body.village).toBeUndefined();
    expect(body).toHaveProperty("code");
    expect(body).toHaveProperty("message");
  });

  test("PUT /api/v1/villages/edit/:villageId editVillage : TEST edit a village data", async () => {
    const dbUsers = await prismaClient.user.findMany();
    const dbUser = dbUsers[0];

    expect(dbUser).not.toBeNull();

    if (!dbUser) return;

    const dbVillage = await prismaClient.village.findFirst({
      include: { users: true, messages: true },
    });

    if (!dbVillage) return;

    const { status, body } = await request(api)
      .patch(PREFIX_VILLAGES + "/" + dbVillage.id)
      .set("Authorization", `Bearer ${testTokens.admin_user}`)
      .send({
        name: "happy",
        description: "desc happy",
        users: { connect: { id: dbUser.id } },
      });

    expect(status).toBe(200);
    expect(body).toHaveProperty("village");
    expect(body.village.id).toBe(dbVillage.id);
    expect(body.village.name).not.toBe(dbVillage.name);
    expect(body.village.description).not.toBe(dbVillage.description);
  });

  test("PUT /api/v1/villages/edit/:villageId editVillage : TEST error handling  ", async () => {
    const wrong_id = "aaaa";

    const dbVillage = await prismaClient.village.findUnique({
      where: { id: wrong_id },
    });

    expect(dbVillage).toBeNull();

    const { status, body } = await request(api)
      .patch(PREFIX_VILLAGES + "/" + wrong_id)
      .set("Authorization", `Bearer ${testTokens.admin_user}`)
      .send({
        name: "happy",
        description: "desc happy",
        users: { connect: { id: "aaaa" } },
      });

    expect(status).toBe(404);
    expect(body.village).toBeUndefined();
    expect(body).toHaveProperty("code");
    expect(body).toHaveProperty("message");
  });

  test("DELETE /api/v1/villages/delete/:villageId deleteVillage TEST : delete a village", async () => {
    const dbVillages = await prismaClient.village.findMany();

    const dbVillage = dbVillages[0];

    const { status, body } = await request(api)
      .delete(PREFIX_VILLAGES + "/" + dbVillage.id)
      .set("Authorization", `Bearer ${testTokens.admin_user}`);

    const countVillages = await prismaClient.village.count();

    expect(status).toBe(200);
    expect(body.village.id).toBe(dbVillage.id);
    expect(dbVillages.length).not.toBe(countVillages);
    expect(dbVillages.length).toBe(countVillages + 1);
  });

  test("DELETE /api/v1/villages/delete/:villageId deleteVillage TEST : Error handling", async () => {
    const wrong_id = "aaaa";

    const dbVillage = await prismaClient.village.findUnique({
      where: { id: wrong_id },
    });

    expect(dbVillage).toBeNull();

    const { status, body } = await request(api)
      .delete(PREFIX_VILLAGES + "/" + wrong_id)
      .set("Authorization", `Bearer ${testTokens.admin_user}`);

    expect(status).toBe(404);
    expect(body).toHaveProperty("code");
    expect(body).toHaveProperty("message");
  });

  describe("GET /api/v1/villages/:villageId/users", () => {
    test("Success", async () => {
      const dbVillage = await prismaClient.village.findFirst({
        include: { users: true },
      });
      if (!dbVillage) return;

      const { status, body, headers } = await request(api)
        .get(join(PREFIX_VILLAGES, dbVillage.id, "users"))
        .query({ fields: "id,username" })
        .set(PARAMS.HEADER_AUTH_KEY, `Bearer ${testTokens.admin_user}`);

      expect(status).toBe(200);
      expect(dbVillage.users.length).toBe(body.users.length);
      expect(headers).toHaveProperty(PARAMS.X_TOTAL_COUNT);
      expect(headers).toHaveProperty(PARAMS.X_TOTAL_PAGE_COUNT);
      expect(headers).toHaveProperty("link");
    });
  });

  describe("GET /api/v1/villages/:villageId/messages", () => {
    test("Success", async () => {
      const dbVillage = await prismaClient.village.findFirst({
        include: { messages: true },
      });
      if (!dbVillage) return;

      const { status, body, headers } = await request(api)
        .get(join(V1.VILLAGES, dbVillage.id, PATH.MESSAGES))
        .query({ fields: "" })
        .set(PARAMS.HEADER_AUTH_KEY, `Bearer ${testTokens.admin_user}`);

      expect(status).toBe(200);
      expect(dbVillage.messages.length).toBe(body.messages.length);
      expect(headers).toHaveProperty(PARAMS.X_TOTAL_COUNT);
      expect(headers).toHaveProperty(PARAMS.X_TOTAL_PAGE_COUNT);
      expect(headers).toHaveProperty("link");
    });
  });
});
