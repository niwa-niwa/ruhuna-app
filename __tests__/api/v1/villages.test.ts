import request from "supertest";
import { api } from "../../../api";
import { tokens } from "../../test_config/testData";

export const PREFIX_VILLAGES = "/api/v1/villages";

describe("/api/v1/villages TEST villageController ", () => {
  test("GET /api/v1/villages/ get villages", async () => {
    const { status, body } = await request(api)
      .get(PREFIX_VILLAGES)
      .set("Authorization", `Bearer ${tokens.admin_user}`);

    expect(status).toBe(200);
    expect(body).toHaveProperty("villages");
    // expect(body.villages.length).toBe(5);
    expect(body.villages[0]).toHaveProperty("id");
    expect(body.villages[0]).toHaveProperty("name");
    expect(body.villages[0]).toHaveProperty("description");
    expect(body.villages[0]).toHaveProperty("users");
    expect(body.villages[0]).toHaveProperty("messages");
  });

  test("GET /api/v1/villages/:villageId getVillageDetail", async () => {
    const res = await request(api)
      .get(PREFIX_VILLAGES)
      .set("Authorization", `Bearer ${tokens.admin_user}`);

    const { status, body } = await request(api)
      .get(PREFIX_VILLAGES + "/" + res.body.villages[0].id)
      .set("Authorization", `Bearer ${tokens.admin_user}`);

    expect(status).toBe(200);
    expect(body).toHaveProperty("village");
    expect(body.village.id).toBe(res.body.villages[0].id);
    expect(body.village.name).toBe(res.body.villages[0].name);
    expect(body.village.description).toBe(res.body.villages[0].description);
    expect(body.village.users).toStrictEqual(res.body.villages[0].users);
    expect(body.village.messages).toStrictEqual(res.body.villages[0].messages);
  });

  test("GET /api/v1/villages/:villageId getVillageDetail error handling that the village is not found", async () => {
    const { status, body } = await request(api)
      .get(PREFIX_VILLAGES + "/" + "aaa")
      .set("Authorization", `Bearer ${tokens.admin_user}`);

    expect(status).toBe(404);
    expect(body).toHaveProperty("village");
    expect(body.village).toBeNull();
    expect(body).toHaveProperty("errorObj");
    expect(body.errorObj).toHaveProperty("errorCode");
    expect(body.errorObj).toHaveProperty("errorMessage");
  });

  test("POST /api/v1/villages/create Create a village", async () => {
    const { status, body } = await request(api)
      .post(PREFIX_VILLAGES + "/create")
      .set("Authorization", `Bearer ${tokens.admin_user}`)
      .send({ name: "HellO", description: "村の説明" });

    expect(status).toBe(200);
    expect(body).toHaveProperty("village");
    expect(body.village).toHaveProperty("id");
    expect(body.village).toHaveProperty("name");
    expect(body.village).toHaveProperty("description");
    expect(body.village).toHaveProperty("users");
    expect(body.village).toHaveProperty("messages");
  });

  test("POST /api/v1/villages/create Create a village error handling bad request", async () => {
    const { status, body } = await request(api)
      .post(PREFIX_VILLAGES + "/create")
      .set("Authorization", `Bearer ${tokens.admin_user}`)
      .send({ description: "村の説明2" });

    expect(status).toBe(400);
    expect(body).toHaveProperty("village");
    expect(body.village).toBeNull();
    expect(body).toHaveProperty("errorObj");
    expect(body.errorObj).toHaveProperty("errorCode");
    expect(body.errorObj).toHaveProperty("errorMessage");
  });

  test("edit a village data", async () => {
    const res_users = await request(api)
      .get("/api/v1/users")
      .set("Authorization", `Bearer ${tokens.firebase_user}`);

    const res = await request(api)
      .get(PREFIX_VILLAGES)
      .set("Authorization", `Bearer ${tokens.admin_user}`);

    const { status, body } = await request(api)
      .put(PREFIX_VILLAGES + "/edit/" + res.body.villages[0].id)
      .set("Authorization", `Bearer ${tokens.admin_user}`)
      .send({
        name: "happy",
        description: "desc happy",
        users: { connect: { id: res_users.body.users[1].id } },
      });

    expect(status).toBe(200);
    expect(body).toHaveProperty("village");
    expect(body.village.id).toBe(res.body.villages[0].id);
    expect(body.village.name).not.toBe(res.body.villages[0].name);
    expect(body.village.description).not.toBe(res.body.villages[0].description);
    expect(body.village.users[1]).toEqual(res_users.body.users[1]);
    expect(body.village.messages).toStrictEqual(res.body.villages[0].messages);
  });

  test("edit a village data error handling ", async () => {
    const { status, body } = await request(api)
      .put(PREFIX_VILLAGES + "/edit/" + "aaaaa")
      .set("Authorization", `Bearer ${tokens.admin_user}`)
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

  test("delete a village", async () => {
    const res = await request(api)
      .get(PREFIX_VILLAGES)
      .set("Authorization", `Bearer ${tokens.admin_user}`);

    const { status, body } = await request(api)
      .delete(PREFIX_VILLAGES + "/delete/" + res.body.villages[0].id)
      .set("Authorization", `Bearer ${tokens.admin_user}`);

    const after_res = await request(api)
      .get(PREFIX_VILLAGES)
      .set("Authorization", `Bearer ${tokens.admin_user}`);

    expect(status).toBe(200);
    expect(body.village.id).toBe(res.body.villages[0].id);
    expect(res.body.villages.length).toBe(after_res.body.villages.length + 1);
  });

  test("delete a village : Error handling", async () => {
    const { status, body } = await request(api)
      .delete(PREFIX_VILLAGES + "/delete/" + "aaaa")
      .set("Authorization", `Bearer ${tokens.admin_user}`);

    expect(status).toBe(400);
    expect(body.village).toBeNull();
    expect(body).toHaveProperty("errorObj");
    expect(body.errorObj).toHaveProperty("errorCode");
    expect(body.errorObj).toHaveProperty("errorMessage");
  });
});
