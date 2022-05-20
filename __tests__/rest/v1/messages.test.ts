import { userId } from "../../../backend/rest/controllers/userController";
import { join } from "path";
import { PARAMS, V1, PATH } from "./../../../consts/url";
import { Message, Village } from "@prisma/client";
import { prismaClient } from "../../../backend/lib/prismaClient";
import { User } from "@prisma/client";
import request from "supertest";
import { api } from "../../../backend/rest";
import { testTokens } from "../../test_config/testData";
import initDB from "../../test_config/initDB";

beforeEach(async () => await initDB());

const PREFIX_MESSAGES = V1.MESSAGES;

describe(`${PREFIX_MESSAGES} TEST messageController`, () => {
  test(`POST ${PREFIX_MESSAGES}/ createMessage`, async () => {
    const user: User | null = await prismaClient.user.findFirst();

    expect(user).not.toBeNull();

    const village: Village | null = await prismaClient.village.findFirst();

    expect(village).not.toBeNull();

    const the_content = "story content 1";

    const { status, body } = await request(api)
      .post(PREFIX_MESSAGES + "/")
      .set("Authorization", `Bearer ${testTokens.admin_user}`)
      .send({ content: the_content, userId: user?.id, villageId: village?.id });

    expect(status).toBe(200);
    expect(body).toHaveProperty("message");

    const the_message: Message | null = await prismaClient.message.findUnique({
      where: {
        id: body.message.id,
      },
      include: { user: true, village: true },
    });

    expect(body.message).not.toBeNull();

    expect(body.message.id).toBe(the_message?.id);
    expect(body.message.content).toBe(the_content);
    expect(body.message.villageId).toBe(village?.id);
    expect(body.message.userId).toBe(user?.id);

    expect(the_message?.content).toBe(the_content);
    expect(the_message?.villageId).toBe(village?.id);
    expect(the_message?.userId).toBe(user?.id);
  });

  test(`POST ${PREFIX_MESSAGES}/ createMessage TEST : handling error`, async () => {
    const { status, body } = await request(api)
      .post(PREFIX_MESSAGES + "/")
      .set("Authorization", `Bearer ${testTokens.admin_user}`)
      .send({ content: "aaa" });

    expect(status).toBe(400);
    expect(body).toHaveProperty("code");
    expect(body).toHaveProperty("message");
  });

  test(`GET ${PREFIX_MESSAGES} getMessages`, async () => {
    const { status, body, header } = await request(api)
      .get(PREFIX_MESSAGES)
      .set("Authorization", `Bearer ${testTokens.admin_user}`);

    expect(status).toBe(200);
    expect(body).toHaveProperty("messages");
    expect(body.messages[0]).toHaveProperty("id");
    expect(body.messages[0]).toHaveProperty("content");

    const countMessage: number = await prismaClient.message.count();

    expect(Number(header[PARAMS.X_TOTAL_COUNT])).toBe(countMessage);
  });

  test(`GET ${PREFIX_MESSAGES}/:messageId getMessageDetail`, async () => {
    const dbMessage: Message | null = await prismaClient.message.findFirst();

    expect(dbMessage).not.toBeNull();

    const { status, body } = await request(api)
      .get(PREFIX_MESSAGES + "/" + dbMessage?.id)
      .set("Authorization", `Bearer ${testTokens.admin_user}`);

    expect(status).toBe(200);
    expect(body.message.id).toBe(dbMessage?.id);
    expect(body.message.content).toBe(dbMessage?.content);
    expect(body.message.villageId).toBe(dbMessage?.villageId);
    expect(body.message.userId).toBe(dbMessage?.userId);
  });

  test(`GET ${PREFIX_MESSAGES}/:messageId getMessageDetail : TEST handling error cause wrong message id`, async () => {
    const wrong_id: string = "aaaa";

    const { status, body } = await request(api)
      .get(PREFIX_MESSAGES + "/" + wrong_id)
      .set("Authorization", `Bearer ${testTokens.admin_user}`);

    expect(status).toBe(404);
    expect(body).toHaveProperty("code");
    expect(body).toHaveProperty("message");
  });

  test(`PATCH ${PREFIX_MESSAGES}/:messageId editMessage`, async () => {
    const dbMessage: Message | null = await prismaClient.message.findFirst();

    expect(dbMessage).not.toBeNull();

    const the_content = "story 2";
    const { status, body } = await request(api)
      .patch(PREFIX_MESSAGES + "/" + dbMessage?.id)
      .set("Authorization", `Bearer ${testTokens.admin_user}`)
      .send({ content: the_content });

    expect(status).toBe(200);
    expect(body.message.id).toBe(dbMessage?.id);
    expect(body.message.content).not.toBe(dbMessage?.content);
    expect(body.message.content).toBe(the_content);
    expect(body.message.userId).toBe(dbMessage?.userId);
    expect(body.message.villageId).toBe(dbMessage?.villageId);
  });

  test(`PATCH ${PREFIX_MESSAGES}/:messageId editMessage : TEST error handling by wrong id`, async () => {
    const wrong_id = "aaa";
    const { status, body } = await request(api)
      .patch(PREFIX_MESSAGES + "/" + wrong_id)
      .set("Authorization", `Bearer ${testTokens.admin_user}`)
      .send({ content: "the_content" });

    expect(status).toBe(400);
    expect(body).toHaveProperty("code");
    expect(body).toHaveProperty("message");

    const dbMessage: Message | null = await prismaClient.message.findUnique({
      where: { id: wrong_id },
    });

    expect(dbMessage).toBeNull();
  });

  test(`Delete ${PREFIX_MESSAGES}/:messageId deleteMessage`, async () => {
    const dbMessage: Message | null = await prismaClient.message.findFirst();
    expect(dbMessage).not.toBeNull();

    const { status, body } = await request(api)
      .delete(PREFIX_MESSAGES + "/" + dbMessage?.id)
      .set("Authorization", `Bearer ${testTokens.admin_user}`);

    expect(status).toBe(200);
    expect(body.message.id).toBe(dbMessage?.id);
    expect(body.message.content).toBe(dbMessage?.content);

    const deletedMessage: Message | null =
      await prismaClient.message.findUnique({
        where: { id: dbMessage?.id },
      });
    expect(deletedMessage).toBeNull();
  });

  test(`Delete ${PREFIX_MESSAGES}/:messageId deleteMessage : TEST error handling`, async () => {
    const wrong_id = "aaa";

    const { status, body } = await request(api)
      .delete(PREFIX_MESSAGES + "/" + wrong_id)
      .set("Authorization", `Bearer ${testTokens.admin_user}`);

    expect(status).toBe(400);
    expect(body).toHaveProperty("code");
    expect(body).toHaveProperty("message");

    const dbMessage: Message | null = await prismaClient.message.findUnique({
      where: { id: wrong_id },
    });
    expect(dbMessage).toBeNull();
  });

  describe(`GET a user of message`, () => {
    test(`GET a user successfully`, async () => {
      const dbMessage = await prismaClient.message.findFirst({
        include: { user: true },
      });
      if (!dbMessage) return;

      const { status, body } = await request(api)
        .get(join(PREFIX_MESSAGES, dbMessage.id, PATH.USERS))
        .set(PARAMS.HEADER_AUTH_KEY, `Bearer ${testTokens.admin_user}`);

      expect(status).toBe(200);
      expect(dbMessage.user?.id).toBe(body.user.id);
    });
  });

  describe(`GET a village of message`, () => {
    test(`GET a village successfully`, async () => {
      const dbMessage = await prismaClient.message.findFirst({
        include: { village: true },
      });
      if (!dbMessage) return;

      const { status, body } = await request(api)
        .get(join(PREFIX_MESSAGES, dbMessage.id, PATH.VILLAGES))
        .set(PARAMS.HEADER_AUTH_KEY, `Bearer ${testTokens.admin_user}`);

      expect(status).toBe(200);
      expect(dbMessage.village.id).toBe(body.village.id);
    });
  });
});
