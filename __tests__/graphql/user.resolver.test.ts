import request from "supertest";
import express, { Express } from "express";
import { prismaClient } from "../../lib/prismaClient";
import { User, Message, Village } from "@prisma/client";
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

  test("TEST failed getMe and authentication failed ", async () => {
    const { status, body } = await request(app)
      .post(gql_endpoint)
      .set("Authorization", `Bearer aaaaa`)
      .send({
        query: `{
        getMe{
          id
        }
      }`,
      });

    expect(status).toBe(400);
    expect(body).not.toHaveProperty("data");
    expect(body).toHaveProperty("errors");
    expect(body.errors[0].message).toEqual(
      expect.stringContaining("Context creation failed:")
    );
  });

  test("TEST Query getMe", async () => {
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

  test("TEST Query getUsers ", async () => {
    const dbUsers: User[] & { messages: Message[]; villages: Village[] }[] =
      await prismaClient.user.findMany({
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
    expect(getUsers.length).toBe(dbUsers.length);
    expect(getUsers[0].id).toBe(dbUsers[0]?.id);
    expect(getUsers[0].firebaseId).toBe(dbUsers[0]?.firebaseId);
    expect(getUsers[0].isAdmin).toBe(dbUsers[0]?.isAdmin);
    expect(getUsers[0].isActive).toBe(dbUsers[0]?.isActive);
    expect(getUsers[0].isAnonymous).toBe(dbUsers[0]?.isAnonymous);
    expect(getUsers[0].username).toBe(dbUsers[0]?.username);
    expect(getUsers[0]).toHaveProperty("createdAt");
    expect(getUsers[0]).toHaveProperty("updatedAt");
    expect(getUsers[0].messages.length).toBe(dbUsers[0]?.messages.length);
    expect(getUsers[0].messages[0]).toHaveProperty("id");
    expect(getUsers[0].messages[0]).toHaveProperty("content");
    expect(getUsers[0].messages[0]).toHaveProperty("createdAt");
    expect(getUsers[0].messages[0]).toHaveProperty("updatedAt");
    expect(getUsers[0].villages.length).toBe(dbUsers[0]?.villages.length);
    expect(getUsers[0].villages[0]).toHaveProperty("id");
    expect(getUsers[0].villages[0]).toHaveProperty("name");
    expect(getUsers[0].villages[0]).toHaveProperty("description");
    expect(getUsers[0].villages[0]).toHaveProperty("isPublic");
    expect(getUsers[0].villages[0]).toHaveProperty("createdAt");
    expect(getUsers[0].villages[0]).toHaveProperty("updatedAt");
  });

  test("TEST Query getUserDetail ", async () => {
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

  test("TEST Mutation createUser", async () => {
    const {
      status,
      body: {
        data: { createUser },
      },
    } = await request(app)
      .post(gql_endpoint)
      .set("Authorization", `Bearer ${testTokens.admin_user}`)
      .send({
        query: `mutation{
          createUser(firebaseToken:"token_firebase_user"){
            id
            firebaseId
            isAdmin
            isActive
            isAnonymous
            username
            createdAt
            updatedAt
          }
        }`,
      });

    const dbUser: User | null = await prismaClient.user.findFirst({
      where: { id: createUser.id },
    });

    expect(status).toBe(200);
    expect(createUser.id).toBe(dbUser?.id);
    expect(createUser.firebaseId).toBe(dbUser?.firebaseId);
    expect(createUser.isAdmin).toBe(dbUser?.isAdmin);
    expect(createUser.isActive).toBe(dbUser?.isActive);
    expect(createUser.isAnonymous).toBe(dbUser?.isAnonymous);
    expect(createUser.username).toBe(dbUser?.username);
    expect(createUser).toHaveProperty("createdAt");
    expect(createUser).toHaveProperty("updatedAt");
  });

  test("TEST FAILED Mutation crateUser by wrong token", async () => {
    const { status, body } = await request(app)
      .post(gql_endpoint)
      .set("Authorization", `Bearer ${testTokens.admin_user}`)
      .send({
        query: `mutation{
          createUser(firebaseToken:"test_token"){
            id
            firebaseId
            isAdmin
            isActive
            isAnonymous
            username
            createdAt
            updatedAt
          }
        }`,
      });
    expect(status).toBe(200);
    expect(body.errors[0].message).toEqual("ID token has invalid signature");
  });

  test("TEST Mutation editUser", async () => {
    const dbUser: User | null = await prismaClient.user.findFirst({});

    const edit_data = {
      isAdmin: !dbUser?.isAdmin,
      username: "edited_user_name",
    };
    const {
      status,
      body: {
        data: { editUser },
      },
    } = await request(app)
      .post(gql_endpoint)
      .set("Authorization", `Bearer ${testTokens.admin_user}`)
      .send({
        query: `mutation{
          editUser(id:"${dbUser?.id}", isAdmin:${edit_data.isAdmin},  username:"${edit_data.username}"){
            id
            firebaseId
            isAdmin
            isActive
            isAnonymous
            username
            createdAt
            updatedAt
          }
        }`,
      });
    expect(status).toBe(200);
    expect(editUser.id).toBe(dbUser?.id);
    expect(editUser.isAdmin).toBe(edit_data.isAdmin);
    expect(editUser.username).toBe(edit_data.username);
  });

  test("TEST FAIL Mutation editUser cause request from not admin user", async () => {
    const dbUser: User | null = await prismaClient.user.findFirst({});

    const edit_data = {
      isAdmin: !dbUser?.isAdmin,
      username: "edited_user_name",
    };
    const {
      status,
      body
    } = await request(app)
      .post(gql_endpoint)
      .set("Authorization", `Bearer ${testTokens.general_user}`)
      .send({
        query: `mutation{
          editUser(id:"${dbUser?.id}", isAdmin:${edit_data.isAdmin},  username:"${edit_data.username}"){
            id
            firebaseId
            isAdmin
            isActive
            isAnonymous
            username
            createdAt
            updatedAt
          }
        }`,
      });
    expect(status).toBe(200);
    expect(body.errors[0].message).toEqual("Not allowed to edit the user data");
  });
});
