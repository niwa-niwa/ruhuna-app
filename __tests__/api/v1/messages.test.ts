import { Message, Village } from "@prisma/client";
import { prismaClient } from "./../../../api/lib/prismaClient";
import { User } from "@prisma/client";
import request from "supertest";
import { api } from "../../../api";
import { tokens } from "./../../test_config/testData";

const PREFIX_MESSAGES = "/api/v1/messages";

describe(`${PREFIX_MESSAGES} TEST messageController`, () => {
  test(`POST ${PREFIX_MESSAGES}/create createMessage`, async () => {
    const users: User[] = await prismaClient.user.findMany();
    const user: User = users[0];

    const villages: Village[] = await prismaClient.village.findMany();
    const village: Village = villages[0];

    const the_content = "story content 1";
    const { status, body } = await request(api)
      .post(PREFIX_MESSAGES + "/create")
      .set("Authorization", `Bearer ${tokens.admin_user}`)
      .send({ content: the_content, userId: user.id, villageId: village.id });

    expect(status).toBe(200);
    expect(body).toHaveProperty("message");

    const the_message: Message | null = await prismaClient.message.findUnique({
      where: {
        id: body.message.id,
      },
      include: { user: true, village: true },
    });

    /**
     * compare between db data and response data
     */
    if (the_message) {
      expect(body.message.id).toBe(the_message.id);
      expect(body.message.content).toBe(the_message.content);
      expect(body.message.villageId).toBe(the_message.villageId);
      expect(body.message.userId).toBe(the_message.userId);
    } else {
      expect(body.message).not.toBeNull();
    }
    /**
     * compare between res data and input data
     */
    expect(body.message.content).toBe(the_content);
    expect(body.message.villageId).toBe(village.id);
    expect(body.message.userId).toBe(user.id);
  });

  test(`GET ${PREFIX_MESSAGES} getMessages`, async () => {
    const { status, body } = await request(api)
      .get(PREFIX_MESSAGES)
      .set("Authorization", `Bearer ${tokens.admin_user}`);

    expect(status).toBe(200);
    expect(body).toHaveProperty("messages");
    expect(body.messages[0]).toHaveProperty("id");
    expect(body.messages[0]).toHaveProperty("content");
    expect(body.messages[0]).toHaveProperty("user");
    expect(body.messages[0]).toHaveProperty("village");
  });

  test(`GET ${PREFIX_MESSAGES}/:messageId getMessageDetail`, async () => {
    const { status, body } = await request(api)
      .get(PREFIX_MESSAGES + "/" + "mesID")
      .set("Authorization", `Bearer ${tokens.admin_user}`);

    expect(status).toBe(200);
  });

  test(`PUT ${PREFIX_MESSAGES}/edit/:messageId editMessage`, async () => {
    const { status, body } = await request(api)
      .put(PREFIX_MESSAGES + "/edit/" + "messId")
      .set("Authorization", `Bearer ${tokens.admin_user}`)
      .send({ content: "story2" });

    expect(status).toBe(200);
  });

  test(`Delete ${PREFIX_MESSAGES}/delete/:messageId deleteMessage`, async () => {
    const { status, body } = await request(api)
      .delete(PREFIX_MESSAGES + "/delete/" + "messId")
      .set("Authorization", `Bearer ${tokens.admin_user}`);

    expect(status).toBe(200);
  });
});
