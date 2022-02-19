import request from "supertest";
import express, { Express } from "express";
import { apolloServer } from "../../graphql";
import { testTokens } from "../test_config/testData";

const gql_endpoint: string = "/graphql";

describe("TEST User of resolvers in GraphQL cases", () => {
  let app: Express;

  beforeAll(async () => {
    app = express();
    await apolloServer.start();
    apolloServer.applyMiddleware({ app, path: gql_endpoint });
  });

  test("TEST getMe in Query", async () => {
    const {
      status,
      body: {
        data: { getMe },
      },
    } = await request(app)
      .post(gql_endpoint)
      .set("Authorization", `Bearer ${testTokens.admin_user}`)
      .send({
        query: `{
          getMe{
            id
            firebaseId
            isAdmin
            isActive
            isAnonymous
            username
            messages{
              id
            }
            villages{
              id
            }
            createdAt
            updatedAt
          }
        }`,
      });

    expect(status).toBe(200);
    expect(getMe.firebaseId).toBe("firebaseId_A");
    expect(getMe.isAdmin).toBeTruthy();
    expect(getMe.isActive).toBeTruthy();
    expect(getMe.isAnonymous).not.toBeTruthy();
    expect(getMe.username).toBe("User_A");
    expect(getMe).toHaveProperty("messages");
    expect(getMe.messages[0]).toHaveProperty("id")
    expect(getMe).toHaveProperty("villages");
    expect(getMe.villages[0]).toHaveProperty("id")
    expect(getMe).toHaveProperty("createdAt");
    expect(getMe).toHaveProperty("updatedAt");
  });
});
