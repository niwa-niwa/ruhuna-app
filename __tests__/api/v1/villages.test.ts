import { prismaClient } from "./../../../api/lib/prismaClient";
import request from "supertest";
import { api } from "../../../api";
import { testTokens } from "../../test_config/testData";

const PREFIX_VILLAGES = "/api/v1/villages";

describe("/api/v1/villages TEST villageController ", () => {
  test("GET /api/v1/villages/ getVillages : TEST it should be total villages same as db data and has properties", async () => {
    const countVillages = await prismaClient.village.count();

    const { status, body } = await request(api)
      .get(PREFIX_VILLAGES)
      .set("Authorization", `Bearer ${testTokens.admin_user}`);

    expect(status).toBe(200);
    expect(body).toHaveProperty("villages");
    expect(body.villages.length).toBe(countVillages);
    expect(body.villages[0]).toHaveProperty("id");
    expect(body.villages[0]).toHaveProperty("name");
    expect(body.villages[0]).toHaveProperty("description");
    expect(body.villages[0]).toHaveProperty("users");
    expect(body.villages[0]).toHaveProperty("messages");
  });

  test("GET /api/v1/villages/:villageId getVillageDetail it should has properties", async () => {
    const dbVillages = await prismaClient.village.findMany({
      include: { users: true, messages: true },
    });

    const dbVillage = dbVillages[0];

    const { status, body } = await request(api)
      .get(PREFIX_VILLAGES + "/" + dbVillage?.id)
      .set("Authorization", `Bearer ${testTokens.admin_user}`);

    expect(status).toBe(200);
    expect(body).toHaveProperty("village");
    expect(body.village.id).toBe(dbVillage.id);
    expect(body.village.name).toBe(dbVillage.name);
    expect(body.village.description).toBe(dbVillage.description);
    expect(body.village.users.length).toBe(dbVillage.users.length);
    expect(body.village.messages.length).toBe(dbVillage.messages.length);
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
    expect(body).toHaveProperty("village");
    expect(body.village).toBeNull();
    expect(body).toHaveProperty("errorObj");
    expect(body.errorObj).toHaveProperty("errorCode");
    expect(body.errorObj).toHaveProperty("errorMessage");
  });

  test("POST /api/v1/villages/create createVillage : TEST Create a village", async () => {
    const { status, body } = await request(api)
      .post(PREFIX_VILLAGES + "/create")
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
    expect(body.village.users.length).toBe(dbVillage.users.length);
    expect(body.village.messages.length).toBe(dbVillage.messages.length);
  });

  test("POST /api/v1/villages/create createVillage : TEST error handling bad request by missing require properties", async () => {
    const { status, body } = await request(api)
      .post(PREFIX_VILLAGES + "/create")
      .set("Authorization", `Bearer ${testTokens.admin_user}`)
      .send({ description: "村の説明2" });

    expect(status).toBe(400);
    expect(body).toHaveProperty("village");
    expect(body.village).toBeNull();
    expect(body).toHaveProperty("errorObj");
    expect(body.errorObj).toHaveProperty("errorCode");
    expect(body.errorObj).toHaveProperty("errorMessage");
  });

  test("PUT /api/v1/villages/edit/:villageId editVillage : TEST edit a village data", async () => {
    const dbUsers = await prismaClient.user.findMany();
    const dbUser = dbUsers[0];

    expect(dbUser).not.toBeNull();

    if (!dbUser) return;

    const dbVillages = await prismaClient.village.findMany({
      include: { users: true, messages: true },
    });

    const dbVillage = dbVillages[0];

    const { status, body } = await request(api)
      .put(PREFIX_VILLAGES + "/edit/" + dbVillage.id)
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
    expect(body.village.users[0].id).toBe(dbVillage.users[0].id);
    expect(body.village.messages[0].id).toBe(dbVillage.messages[0].id);
  });

  test("PUT /api/v1/villages/edit/:villageId editVillage : TEST error handling  ", async () => {
    const wrong_id = "aaaa";

    const dbVillage = await prismaClient.village.findUnique({
      where: { id: wrong_id },
    });

    expect(dbVillage).toBeNull();

    const { status, body } = await request(api)
      .put(PREFIX_VILLAGES + "/edit/" + wrong_id)
      .set("Authorization", `Bearer ${testTokens.admin_user}`)
      .send({
        name: "happy",
        description: "desc happy",
        users: { connect: { id: "aaaa" } },
      });

    expect(status).toBe(400);
    expect(body).toHaveProperty("village");
    expect(body).toHaveProperty("errorObj");
    expect(body.village).toBeNull();
    expect(body.errorObj).toHaveProperty("errorCode");
    expect(body.errorObj).toHaveProperty("errorMessage");
  });

  test("DELETE /api/v1/villages/delete/:villageId deleteVillage TEST : delete a village", async () => {
    const dbVillages = await prismaClient.village.findMany();

    const dbVillage = dbVillages[0];

    const { status, body } = await request(api)
      .delete(PREFIX_VILLAGES + "/delete/" + dbVillage.id)
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
      .delete(PREFIX_VILLAGES + "/delete/" + wrong_id)
      .set("Authorization", `Bearer ${testTokens.admin_user}`);

    expect(status).toBe(400);
    expect(body.village).toBeNull();
    expect(body).toHaveProperty("errorObj");
    expect(body.errorObj).toHaveProperty("errorCode");
    expect(body.errorObj).toHaveProperty("errorMessage");
  });
});
