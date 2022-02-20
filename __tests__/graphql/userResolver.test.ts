import request from "supertest";
import express, { Express } from "express";
import { prismaClient } from "../../lib/prismaClient";
import { Prisma, User, Message, Village } from "@prisma/client";
import { apolloServer } from "../../graphql";
import { testTokens, admin_user } from "../test_config/testData";

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
              content
              createdAt
              updatedAt
            }
            villages{
              id
              name
              description
              isPublic
              createdAt
              updatedAt
            }
            createdAt
            updatedAt
          }
        }`,
      });

    const dbUser: (User & { messages: Message[]; villages: Village[] }) | null =
      await prismaClient.user.findFirst({
        where: { id: getMe.id },
        include: { messages: true, villages: true },
      });

    expect(status).toBe(200);
    expect(getMe.id).toBe(dbUser?.id);
    expect(getMe.firebaseId).toBe(dbUser?.firebaseId);
    expect(getMe.isAdmin).toBe(dbUser?.isAdmin);
    expect(getMe.isActive).toBe(dbUser?.isActive);
    expect(getMe.isAnonymous).toBe(dbUser?.isAnonymous);
    expect(getMe.username).toBe(dbUser?.username);
    expect(getMe).toHaveProperty("createdAt");
    expect(getMe).toHaveProperty("updatedAt");
    expect(getMe.messages.length).toBe(dbUser?.messages.length);
    expect(getMe.messages[0]).toHaveProperty("id");
    expect(getMe.messages[0]).toHaveProperty("content");
    expect(getMe.messages[0]).toHaveProperty("createdAt");
    expect(getMe.messages[0]).toHaveProperty("updatedAt");
    expect(getMe.villages.length).toBe(dbUser?.villages.length);
    expect(getMe.villages[0]).toHaveProperty("id");
    expect(getMe.villages[0]).toHaveProperty("name");
    expect(getMe.villages[0]).toHaveProperty("description");
    expect(getMe.villages[0]).toHaveProperty("isPublic");
    expect(getMe.villages[0]).toHaveProperty("createdAt");
    expect(getMe.villages[0]).toHaveProperty("updatedAt");
  });

  test("TEST getUsers ", async () => {
    const dbUsers: User[] = await prismaClient.user.findMany({
      include: { messages: true, villages: true },
    });

    const {
      status,
      body: {
        data: { getUsers },
      },
    } = await request(app)
      .post(gql_endpoint)
      .set("Authorization", `Bearer ${testTokens.admin_user}`)
      .send({
        query: `{
          getUsers{
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
    expect(getUsers.length).toBe(dbUsers.length);
  });

  test("TEST getUserDetail ", async () => {
    const dbUser: (User & { messages: Message[]; villages: Village[] }) | null =
      await prismaClient.user.findFirst({
        include: { messages: true, villages: true },
      });

    const {
      status,
      body: {
        data: { getUserDetail },
      },
    } = await request(app)
      .post(gql_endpoint)
      .set("Authorization", `Bearer ${testTokens.admin_user}`)
      .send({
        query: `{
          getUserDetail(id:"${dbUser?.id}"){
            id
            firebaseId
            isAdmin
            isActive
            isAnonymous
            username
            messages{
              id
              content
              createdAt
              updatedAt
            }
            villages{
              id
              name
              description
              isPublic
              createdAt
              updatedAt
            }
            createdAt
            updatedAt
          }
        }`,
      });
    expect(status).toBe(200);
    expect(getUserDetail.id).toBe(dbUser?.id);
    expect(getUserDetail.firebaseId).toBe(dbUser?.firebaseId);
    expect(getUserDetail.isAdmin).toBe(dbUser?.isAdmin);
    expect(getUserDetail.isActive).toBe(dbUser?.isActive);
    expect(getUserDetail.isAnonymous).toBe(dbUser?.isAnonymous);
    expect(getUserDetail.username).toBe(dbUser?.username);
    expect(getUserDetail).toHaveProperty("createdAt");
    expect(getUserDetail).toHaveProperty("updatedAt");
    expect(getUserDetail.messages.length).toBe(dbUser?.messages.length);
    expect(getUserDetail.messages[0]).toHaveProperty("id");
    expect(getUserDetail.messages[0]).toHaveProperty("content");
    expect(getUserDetail.messages[0]).toHaveProperty("createdAt");
    expect(getUserDetail.messages[0]).toHaveProperty("updatedAt");
    expect(getUserDetail.villages.length).toBe(dbUser?.villages.length);
    expect(getUserDetail.villages[0]).toHaveProperty("id");
    expect(getUserDetail.villages[0]).toHaveProperty("name");
    expect(getUserDetail.villages[0]).toHaveProperty("description");
    expect(getUserDetail.villages[0]).toHaveProperty("isPublic");
    expect(getUserDetail.villages[0]).toHaveProperty("createdAt");
    expect(getUserDetail.villages[0]).toHaveProperty("updatedAt");
  });
});
