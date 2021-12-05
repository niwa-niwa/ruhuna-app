import request from "supertest";
import app from "../../src/app";
import { firebase_user } from "../test_config/testData";
import { tokens } from "../test_config/testData";

export const PREFIX_USERS = "/api/v1/users";

describe("/api/v1/users/ TEST : userController ", () => {
  test("GET /api/v1/users/ TEST :getUsers has count 5", async () => {
    const response = await request(app)
      .get(PREFIX_USERS)
      .set("Authorization", `Bearer ${tokens.firebase_user}`);

    expect(response.status).toBe(200);
    expect(response.body.users.length).not.toBe(3);
    expect(response.body.users.length).toBe(5);
  });

  test("GET /api/v1/users/ TEST : getUsers has properties", async () => {
    const { status, body } = await request(app)
      .get(PREFIX_USERS)
      .set("Authorization", `Bearer ${tokens.firebase_user}`);

    expect(status).toBe(200);
    expect(body.users[0]).toHaveProperty("id");
    expect(body.users[0]).toHaveProperty("firebaseId");
    expect(body.users[0]).toHaveProperty("isAdmin");
    expect(body.users[0]).toHaveProperty("isActive");
    expect(body.users[0]).toHaveProperty("isAnonymous");
    expect(body.users[0]).toHaveProperty("username");
    expect(body.users[0]).toHaveProperty("createdAt");
    expect(body.users[0]).toHaveProperty("updatedAt");
    expect(body.users[0]).not.toHaveProperty("uid");
    expect(body.users[0]).not.toHaveProperty("password");
  });

  test("GET /api/v1/users/:userId TEST : getUser has properties", async () => {
    const res = await request(app)
      .get(PREFIX_USERS)
      .set("Authorization", `Bearer ${tokens.firebase_user}`);
    const user = res.body.users[0];

    const { status, body } = await request(app)
      .get(PREFIX_USERS + "/" + user.id)
      .set("Authorization", `Bearer ${tokens.firebase_user}`);
    expect(status).toBe(200);
    expect(body.user).toHaveProperty("id");
    expect(body.user).toHaveProperty("firebaseId");
    expect(body.user).toHaveProperty("isAdmin");
    expect(body.user).toHaveProperty("isActive");
    expect(body.user).toHaveProperty("isAnonymous");
    expect(body.user).toHaveProperty("username");
    expect(body.user).toHaveProperty("createdAt");
    expect(body.user).toHaveProperty("updatedAt");
    expect(body.user).not.toHaveProperty("uid");
    expect(body.user).not.toHaveProperty("password");
  });

  test("GET /api/v1/users/:userId TEST : getUserDetail has values", async () => {
    const res = await request(app)
      .get(PREFIX_USERS)
      .set("Authorization", `Bearer ${tokens.firebase_user}`);
    const user = res.body.users[0];

    const { status, body } = await request(app)
      .get(PREFIX_USERS + "/" + user.id)
      .set("Authorization", `Bearer ${tokens.firebase_user}`);

    expect(status).toBe(200);
    expect(user).toMatchObject(body.user);
    expect(res.body.users[1]).not.toMatchObject(body.user);
  });

  test("GET /api/v1/users/:userId TEST : it should receive error", async () => {
    const { status, body } = await request(app)
      .get(PREFIX_USERS + "/aaaaaaa")
      .set("Authorization", `Bearer ${tokens.firebase_user}`);

    expect(status).toBe(404);
    expect(body.user).toBeNull();
    expect(body.errorObj.errorCode).toBe(404);
    expect(body.errorObj).toHaveProperty("errorMessage");
  });

  test("POST /api/v1/users/create TEST : http status should be 200 and create a user ", async () => {
    const { status, body } = await request(app)
      .post(PREFIX_USERS + "/create")
      .send({ firebaseToken: "token_firebase_user" });

    expect(status).toBe(200);
    expect(body.user.username).toEqual(firebase_user.name);
    expect(body.user.firebaseId).toEqual(firebase_user.uid);
    expect(body.user).toHaveProperty("id");
    expect(body.user).toHaveProperty("isAdmin");
    expect(body.user).toHaveProperty("isActive");
    expect(body.user).toHaveProperty("isAnonymous");
    expect(body.user).not.toHaveProperty("password");
    expect(body.user).not.toHaveProperty("errorObj");
  });

  test("POST /api/v1/users/create TEST : should receive error", async () => {
    const { status, body } = await request(app).post(PREFIX_USERS + "/create");

    expect(status).toBe(400);
    expect(body.user).toBeNull();
    expect(body.errorObj.errorCode).toBe(400);
    expect(body.errorObj).toHaveProperty("errorMessage");
  });

  test("PUT /api/v1/users/:userId TEST : edit user by edit_data successfully", async () => {
    const res = await request(app)
      .get(PREFIX_USERS)
      .set("Authorization", `Bearer ${tokens.firebase_user}`);

    const userId = res.body.users[0].id;

    const edit_data = {
      username: "hello world",
      isAdmin: true,
      isActive: false,
      isAnonymous: true,
    };

    const { status, body } = await request(app)
      .put(PREFIX_USERS + "/edit/" + userId)
      .set("Authorization", `Bearer ${tokens.firebase_user}`)
      .send({ ...edit_data });

    expect(status).toBe(200);
    expect(body.user.id).toEqual(userId);
    expect(body.user.username).toEqual(edit_data.username);
    expect(body.user.isAdmin).toEqual(edit_data.isAdmin);
    expect(body.user.isActive).toEqual(edit_data.isActive);
    expect(body.user.isAnonymous).toEqual(edit_data.isAnonymous);
    expect(body.user).not.toHaveProperty("password");
    expect(body.user).not.toHaveProperty("errorObj");
  });

  test("PUT /api/v1/users/:userId TEST should receive errorObj because the user not found", async () => {
    const edit_data = {
      username: "hello world",
      isAdmin: true,
      isActive: false,
      isAnonymous: true,
    };

    const { status, body } = await request(app)
      .put(PREFIX_USERS + "/edit/asdf")
      .set("Authorization", `Bearer ${tokens.firebase_user}`)
      .send({ ...edit_data });

    expect(status).toBe(404);
    expect(body.user).toBeNull();
    expect(body.errorObj.errorCode).toBe(404);
    expect(body.errorObj).toHaveProperty("errorMessage");
  });

  test("DELETE /api/v1/users/:userId TEST it should receive error", async () => {
    const { status, body } = await request(app)
      .delete(PREFIX_USERS + "/delete/aaaaaa")
      .set("Authorization", `Bearer ${tokens.firebase_user}`);

    expect(status).toBe(404);
    expect(body.user).toBeNull();
    expect(body.errorObj.errorCode).toBe(404);
    expect(body.errorObj).toHaveProperty("errorMessage");
    expect(body.user).not.toBe("id");
  });

  test("DELETE /api/v1/users/:userId TEST the user by userId should be deleted", async () => {
    const res = await request(app)
      .get(PREFIX_USERS)
      .set("Authorization", `Bearer ${tokens.firebase_user}`);

    const userId = res.body.users[0].id;

    const { status, body } = await request(app)
      .delete(PREFIX_USERS + "/delete/" + userId)
      .set("Authorization", `Bearer ${tokens.firebase_user}`);

    const res2 = await request(app)
      .get(PREFIX_USERS)
      .set("Authorization", `Bearer ${tokens.firebase_user}`);

    expect(status).toBe(200);
    expect(body.user.id).toBe(userId);
    expect(res.body.users.length).toBe(5);
    expect(res2.body.users.length).toBe(4);
  });
});
