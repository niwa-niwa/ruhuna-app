import { prismaClient } from "./../../../backend/lib/prismaClient";
import { testTokens, sub_user } from "./../../test_config/testData";
import { PARAMS, V1 } from "./../../../consts/url";
import request from "supertest";
import { api } from "../../../backend/rest";

describe("TEST Middleware verifyAccessToken", () => {
  test("it should be success", async () => {
    const res = await request(api)
      .get(V1.ME)
      .set(PARAMS.HEADER_AUTH_KEY, "Bearer token_admin_user");

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("user");
    expect(res.body.user).toHaveProperty("id");
    expect(res.body.user).toHaveProperty("username");
    expect(res.body.user).toHaveProperty("firebaseId");
    expect(res.body.user).toHaveProperty("isAdmin");
    expect(res.body.user).toHaveProperty("isAdmin");
    expect(res.body.user).toHaveProperty("isActive");
    expect(res.body.user).toHaveProperty("isAnonymous");
    expect(res.body.user).not.toHaveProperty("password");
  });

  test("it should be fail request without token by firebase API", async () => {
    const res = await request(api).get(V1.ME);

    expect(res.status).toBe(400);
    expect(res.body.code).toBe(400);
    expect(res.body).toHaveProperty("message");
  });

  test("it should be fail by Prisma API", async () => {
    const res = await request(api)
      .get(V1.ME)
      .set(PARAMS.HEADER_AUTH_KEY, "Bearer 123450");

    expect(res.status).toBe(400);
    expect(res.body.user).toBeUndefined();
    expect(res.body.code).toBe(400);
    expect(res.body).toHaveProperty("message");
  });

  test("TEST Health check", async () => {
    const { status, body } = await request(api).get(V1.HEALTH);
    expect(status).toBe(200);
  });

  test("Success not authenticated user but request has a correct token", async () => {
    const dbUser = await prismaClient.user.findUnique({
      where: { firebaseId: sub_user.uid },
    });

    expect(dbUser).toBeNull();

    const { status, body, header } = await request(api)
      .get(V1.ME)
      .set(PARAMS.HEADER_AUTH_KEY, testTokens.sub_user);

    const dbUser2 = await prismaClient.user.findUnique({
      where: { firebaseId: sub_user.uid },
    });
    if (!dbUser2) return;

    expect(status).toBe(200);
    expect(dbUser2).not.toBeNull();
    expect(dbUser2.firebaseId).toBe(sub_user.uid);
    expect(body.user.firebaseId).toBe(sub_user.uid);
    expect(body.user.isAdmin).toBe(dbUser2.isAdmin);
    expect(body.user.isActive).toBe(dbUser2.isActive);
    expect(body.user.isAnonymous).toBe(dbUser2.isAnonymous);
    expect(body.user.username).toBe(dbUser2.username);
    expect(body.user.messages).toBeUndefined();
    expect(body.user.villages).toBeUndefined();
  });
});
