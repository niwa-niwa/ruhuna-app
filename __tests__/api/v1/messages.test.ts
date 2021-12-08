import request from "supertest";
import { api } from "../../../api";
import { tokens } from "./../../test_config/testData";

const PREFIX_MESSAGES = "/api/v1/messages";

describe(`${PREFIX_MESSAGES} TEST messageController`, () => {
  test(`GET ${PREFIX_MESSAGES} getMessages`, async () => {
    const { status, body } = await request(api)
      .get(PREFIX_MESSAGES)
      .set("Authorization", `Bearer ${tokens.auth_user}`);

    expect(status).toBe(200);
  });

  test(`GET ${PREFIX_MESSAGES}/:messageId getMessageDetail`, async () => {
    const { status, body } = await request(api)
      .get(PREFIX_MESSAGES + "/" + "mesID")
      .set("Authorization", `Bearer ${tokens.auth_user}`);

    expect(status).toBe(200);
  });

  test(`POST ${PREFIX_MESSAGES}/create createMessage`, async () => {
    const { status, body } = await request(api)
      .post(PREFIX_MESSAGES + "/create")
      .set("Authorization", `Bearer ${tokens.auth_user}`)
      .send({ content: "story" });

    expect(status).toBe(200);
  });

  test(`PUT ${PREFIX_MESSAGES}/edit/:messageId editMessage`, async () => {
    const { status, body } = await request(api)
      .put(PREFIX_MESSAGES + "/edit/" + "messId")
      .set("Authorization", `Bearer ${tokens.auth_user}`)
      .send({ content: "story2" });

    expect(status).toBe(200);
  });

  test(`Delete ${PREFIX_MESSAGES}/delete/:messageId deleteMessage`, async () => {
    const { status, body } = await request(api)
      .delete(PREFIX_MESSAGES + "/delete/" + "messId")
      .set("Authorization", `Bearer ${tokens.auth_user}`);

    expect(status).toBe(200);
  });
});
