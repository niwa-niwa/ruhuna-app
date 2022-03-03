import request from "supertest";
import express, { Express } from "express";
import { prismaClient } from "../../lib/prismaClient";
import { User, Message, Village } from "@prisma/client";
import { apolloServer } from "../../graphql/app";
import { testTokens } from "../test_config/testData";
import { VillageIncludeRelations } from "../../types/prisma.types";

const gql_endpoint: string = "/graphql";

describe("TEST Village of resolvers in GraphQL cases", () => {
  let app: Express;

  beforeAll(async () => {
    app = express();
    await apolloServer.start();
    apolloServer.applyMiddleware({ app, path: gql_endpoint });
  });

  test("TEST Query getVillages ", async () => {
    const func: string = "getVillages"

    const dbVillages: VillageIncludeRelations[] = await prismaClient.village.findMany({
      include: { users: true, messages: true },
    });

    const {
      status,
      body: {
        data,
        errors,
      },
    } = await request(app)
      .post(gql_endpoint)
      .set("Authorization", `Bearer ${testTokens.admin_user}`)
      .send({
        query: `{
          ${func}{
            id
            name
            description
            isPublic
            createdAt
            updatedAt
            messages{
              id
              content
              createdAt
              updatedAt
            }
            users{
              id
              username
              createdAt
              updatedAt
            }
          }
        }`,
      });

    expect(status).toBe(200);
    expect(data).not.toBeNull();
    expect(errors).toBeUndefined();
    expect(data[func].length).toBe(dbVillages.length)
    expect(data[func][0]).toHaveProperty("id")
    expect(data[func][0]).toHaveProperty("name")
    expect(data[func][0]).toHaveProperty("isPublic")
    expect(data[func][0]).toHaveProperty("createdAt")
    expect(data[func][0]).toHaveProperty("updatedAt")
    expect(data[func][0]).toHaveProperty("messages")
    expect(data[func][0]).toHaveProperty("users")

  });

  // test("TEST Query getUserDetail ", async () => {
  //   const dbUser: (User & { messages: Message[]; villages: Village[] }) | null =
  //     await prismaClient.user.findFirst({
  //       include: { messages: true, villages: true },
  //     });

  //   const {
  //     status,
  //     body: {
  //       data: { getUserDetail },
  //     },
  //   } = await request(app)
  //     .post(gql_endpoint)
  //     .set("Authorization", `Bearer ${testTokens.admin_user}`)
  //     .send({
  //       query: `{
  //         getUserDetail(id:"${dbUser?.id}"){
  //           id
  //           firebaseId
  //           isAdmin
  //           isActive
  //           isAnonymous
  //           username
  //           messages{
  //             id
  //             content
  //             createdAt
  //             updatedAt
  //           }
  //           villages{
  //             id
  //             name
  //             description
  //             isPublic
  //             createdAt
  //             updatedAt
  //           }
  //           createdAt
  //           updatedAt
  //         }
  //       }`,
  //     });
  //   expect(status).toBe(200);
  //   expect(getUserDetail.id).toBe(dbUser?.id);
  //   expect(getUserDetail.firebaseId).toBe(dbUser?.firebaseId);
  //   expect(getUserDetail.isAdmin).toBe(dbUser?.isAdmin);
  //   expect(getUserDetail.isActive).toBe(dbUser?.isActive);
  //   expect(getUserDetail.isAnonymous).toBe(dbUser?.isAnonymous);
  //   expect(getUserDetail.username).toBe(dbUser?.username);
  //   expect(getUserDetail).toHaveProperty("createdAt");
  //   expect(getUserDetail).toHaveProperty("updatedAt");
  //   expect(getUserDetail.messages.length).toBe(dbUser?.messages.length);
  //   expect(getUserDetail.messages[0]).toHaveProperty("id");
  //   expect(getUserDetail.messages[0]).toHaveProperty("content");
  //   expect(getUserDetail.messages[0]).toHaveProperty("createdAt");
  //   expect(getUserDetail.messages[0]).toHaveProperty("updatedAt");
  //   expect(getUserDetail.villages.length).toBe(dbUser?.villages.length);
  //   expect(getUserDetail.villages[0]).toHaveProperty("id");
  //   expect(getUserDetail.villages[0]).toHaveProperty("name");
  //   expect(getUserDetail.villages[0]).toHaveProperty("description");
  //   expect(getUserDetail.villages[0]).toHaveProperty("isPublic");
  //   expect(getUserDetail.villages[0]).toHaveProperty("createdAt");
  //   expect(getUserDetail.villages[0]).toHaveProperty("updatedAt");
  // });

  // test("TEST Mutation createUser", async () => {
  //   const {
  //     status,
  //     body: {
  //       data: { createUser },
  //     },
  //   } = await request(app)
  //     .post(gql_endpoint)
  //     .set("Authorization", `Bearer ${testTokens.admin_user}`)
  //     .send({
  //       query: `mutation{
  //         createUser(firebaseToken:"token_firebase_user"){
  //           id
  //           firebaseId
  //           isAdmin
  //           isActive
  //           isAnonymous
  //           username
  //           createdAt
  //           updatedAt
  //         }
  //       }`,
  //     });

  //   const dbUser: User | null = await prismaClient.user.findFirst({
  //     where: { id: createUser.id },
  //   });

  //   expect(status).toBe(200);
  //   expect(createUser.id).toBe(dbUser?.id);
  //   expect(createUser.firebaseId).toBe(dbUser?.firebaseId);
  //   expect(createUser.isAdmin).toBe(dbUser?.isAdmin);
  //   expect(createUser.isActive).toBe(dbUser?.isActive);
  //   expect(createUser.isAnonymous).toBe(dbUser?.isAnonymous);
  //   expect(createUser.username).toBe(dbUser?.username);
  //   expect(createUser).toHaveProperty("createdAt");
  //   expect(createUser).toHaveProperty("updatedAt");
  // });

  // test("TEST FAILED Mutation crateUser by wrong token", async () => {
  //   const { status, body } = await request(app)
  //     .post(gql_endpoint)
  //     .set("Authorization", `Bearer ${testTokens.admin_user}`)
  //     .send({
  //       query: `mutation{
  //         createUser(firebaseToken:"test_token"){
  //           id
  //           firebaseId
  //           isAdmin
  //           isActive
  //           isAnonymous
  //           username
  //           createdAt
  //           updatedAt
  //         }
  //       }`,
  //     });
  //   expect(status).toBe(200);
  //   expect(body.errors[0].message).toEqual("ID token has invalid signature");
  // });

  // test("TEST Mutation editUser", async () => {
  //   const dbUser: User | null = await prismaClient.user.findFirst({});

  //   const edit_data = {
  //     isAdmin: !dbUser?.isAdmin,
  //     username: "edited_user_name",
  //   };
  //   const {
  //     status,
  //     body: {
  //       data: { editUser },
  //       errors,
  //     },
  //   } = await request(app)
  //     .post(gql_endpoint)
  //     .set("Authorization", `Bearer ${testTokens.admin_user}`)
  //     .send({
  //       query: `mutation{
  //         editUser(id:"${dbUser?.id}", isAdmin:${edit_data.isAdmin},  username:"${edit_data.username}"){
  //           id
  //           firebaseId
  //           isAdmin
  //           isActive
  //           isAnonymous
  //           username
  //           createdAt
  //           updatedAt
  //         }
  //       }`,
  //     });
  //   expect(errors).toBeUndefined();
  //   expect(status).toBe(200);
  //   expect(editUser.id).toBe(dbUser?.id);
  //   expect(editUser.isAdmin).toBe(edit_data.isAdmin);
  //   expect(editUser.username).toBe(edit_data.username);
  // });

  // test("TEST FAIL Mutation editUser cause request from not admin user", async () => {
  //   const dbUser: User | null = await prismaClient.user.findFirst({});

  //   const edit_data = {
  //     isAdmin: !dbUser?.isAdmin,
  //     username: "edited_user_name",
  //   };
  //   const { status, body } = await request(app)
  //     .post(gql_endpoint)
  //     .set("Authorization", `Bearer ${testTokens.general_user}`)
  //     .send({
  //       query: `mutation{
  //         editUser(id:"${dbUser?.id}", isAdmin:${edit_data.isAdmin},  username:"${edit_data.username}"){
  //           id
  //           firebaseId
  //           isAdmin
  //           isActive
  //           isAnonymous
  //           username
  //           createdAt
  //           updatedAt
  //         }
  //       }`,
  //     });
  //   expect(status).toBe(200);
  //   expect(body.errors[0].message).toEqual("Not allowed to edit the user data");
  // });

  // test("TEST Success Mutation deleteUser ", async () => {
  //   const func: string = "deleteUser";

  //   const dbUser: User | null = await prismaClient.user.findFirst({});

  //   const {
  //     status,
  //     body: { data, errors },
  //   } = await request(app)
  //     .post(gql_endpoint)
  //     .set("Authorization", `Bearer ${testTokens.admin_user}`)
  //     .send({
  //       query: `mutation{
  //       ${func}(id:"${dbUser?.id}"){
  //         id
  //         firebaseId
  //         isAdmin
  //         isActive
  //         isAnonymous
  //         username
  //         createdAt
  //         updatedAt
  //       }
  //     }`,
  //     });

  //   const deletedUser: User | null = await prismaClient.user.findFirst({
  //     where: { id: dbUser?.id },
  //   });

  //   expect(status).toBe(200);
  //   expect(errors).toBeUndefined();
  //   expect(data).not.toBeUndefined();
  //   expect(data[func].id).toBe(dbUser?.id);
  //   expect(deletedUser).toBeNull();
  // });

  // test("TEST Fail Mutation deleteUser because of a general user ", async () => {
  //   const func: string = "deleteUser";

  //   const dbUser: User | null = await prismaClient.user.findFirst({});

  //   const {
  //     status,
  //     body: { data, errors },
  //   } = await request(app)
  //     .post(gql_endpoint)
  //     .set("Authorization", `Bearer ${testTokens.general_user}`)
  //     .send({
  //       query: `mutation{
  //       ${func}(id:"${dbUser?.id}"){
  //         id
  //         firebaseId
  //         isAdmin
  //         isActive
  //         isAnonymous
  //         username
  //         createdAt
  //         updatedAt
  //       }
  //     }`,
  //     });

  //   const deletedUser: User | null = await prismaClient.user.findFirst({
  //     where: { id: dbUser?.id },
  //   });

  //   expect(status).toBe(200);
  //   expect(errors).not.toBeUndefined();
  //   expect(errors[0].message).toBe("Not allowed to edit the user data");
  //   expect(data[func]).toBeNull();
  //   expect(deletedUser).not.toBeNull();
  // });
});
