import request from "supertest";
import express, { Express } from "express";
import { prismaClient } from "../../lib/prismaClient";
import { User, Message, Village, PrismaPromise } from "@prisma/client";
import { apolloServer } from "../../graphql/app";
import { testTokens } from "../test_config/testData";
import initDB from "../test_config/initDB";
import { PATH } from "../../consts/url";
import { Pagination } from "../../graphql/lib/classes/Pagination";

const gql_endpoint: string = PATH.GQL;

describe("TEST User of resolvers in GraphQL cases", () => {
  let app: Express;

  beforeAll(async () => {
    app = express();
    await apolloServer.start();
    apolloServer.applyMiddleware({ app, path: PATH.GQL });
  });

  describe("UserPagination", () => {
    beforeAll(async () => async () => await initDB());

    const user_pgn: Pagination = new Pagination(prismaClient.user);

    const users: () => PrismaPromise<User[]> = () =>
      prismaClient.user.findMany();

    test("OK Pagination : first:10 all users", async () => {
      const db_users = await users();
      const { totalCount, nodes, edges, pageInfo } =
        await user_pgn.getConnection({
          first: 10,
        });

      expect(totalCount).toBe(db_users.length);
      expect(nodes).toEqual(db_users);
      expect(nodes[0].id).toBe(edges[0].cursor);
      expect(db_users[0].id).toBe(pageInfo.startCursor);
      expect(db_users[db_users.length - 1].id).toBe(pageInfo.endCursor);
      expect(false).toBe(pageInfo.hasNextPage);
      expect(false).toBe(pageInfo.hasPreviousPage);
    });

    test("OK Pagination : last:10 all users", async () => {
      const db_users = await users();
      const { totalCount, nodes, edges, pageInfo } =
        await user_pgn.getConnection({
          first: 10,
        });

      expect(totalCount).toBe(db_users.length);
      expect(nodes).toEqual(db_users);
      expect(nodes[0].id).toBe(edges[0].cursor);
      expect(db_users[0].id).toBe(pageInfo.startCursor);
      expect(db_users[db_users.length - 1].id).toBe(pageInfo.endCursor);
      expect(false).toBe(pageInfo.hasNextPage);
      expect(false).toBe(pageInfo.hasPreviousPage);
    });

    test("OK Pagination : first:2", async () => {
      const db_users = await users();
      const { totalCount, nodes, edges, pageInfo } =
        await user_pgn.getConnection({
          first: 2,
        });
      expect(totalCount).toBe(db_users.length);
      expect(nodes[0]).toEqual(db_users.shift());
      expect(nodes[1]).toEqual(db_users.shift());

      expect(true).toBe(pageInfo.hasNextPage);
      expect(true).not.toBe(pageInfo.hasPreviousPage);
    });

    test("OK Pagination : last:2", async () => {
      const db_users = await users();
      const { totalCount, nodes, edges, pageInfo } =
        await user_pgn.getConnection({
          last: 2,
        });
      expect(totalCount).toBe(db_users.length);
      expect(nodes[1]).toEqual(db_users.pop());
      expect(nodes[0]).toEqual(db_users.pop());

      expect(true).toBe(pageInfo.hasNextPage);
      expect(true).not.toBe(pageInfo.hasPreviousPage);
    });

    test("OK Pagination : last:2", async () => {
      const db_users = await users();
      const { totalCount, nodes, edges, pageInfo } =
        await user_pgn.getConnection({
          last: 2,
        });
      expect(totalCount).toBe(db_users.length);
      expect(nodes[1]).toEqual(db_users.pop());
      expect(nodes[0]).toEqual(db_users.pop());
    });

    test("OK Pagination : first:10 with query id", async () => {
      const db_users = await users();
      const { totalCount, nodes, edges, pageInfo } =
        await user_pgn.getConnection({
          first: 10,
          query: `{"id":"${db_users[2].id}"}`,
        });

      expect(totalCount).toBe(1);
      expect(nodes[0]).toEqual(db_users[2]);
      expect(nodes[0].id).toBe(edges[0].cursor);
      expect(db_users[2].id).toBe(pageInfo.startCursor);
      expect(pageInfo.endCursor).toBe(db_users[2].id);
      expect(pageInfo.hasNextPage).toBeFalsy();
      expect(pageInfo.hasPreviousPage).toBeFalsy();
    });

    test("OK Pagination : last:10 with query id", async () => {
      const db_users = await users();
      const { totalCount, nodes, edges, pageInfo } =
        await user_pgn.getConnection({
          last: 10,
          query: `{"id":"${db_users[2].id}"}`,
        });

      expect(totalCount).toBe(1);
      expect(nodes[0]).toEqual(db_users[2]);
      expect(nodes[0].id).toBe(edges[0].cursor);
      expect(db_users[2].id).toBe(pageInfo.startCursor);
      expect(pageInfo.endCursor).toBe(db_users[2].id);
      expect(pageInfo.hasNextPage).toBeFalsy();
      expect(pageInfo.hasPreviousPage).toBeFalsy();
    });

    test("OK Pagination : first:10 with orderBy username and reverse", async () => {
      const db_users = await prismaClient.user.findMany({
        orderBy: { username: "desc" },
      });
      const users_slice = db_users.slice(0, 3);
      const { totalCount, nodes, edges, pageInfo } =
        await user_pgn.getConnection({
          first: 3,
          sortKey: "username",
          reverse: true,
        });

      expect(totalCount).toBe(5);
      expect(nodes).toEqual(users_slice);
      expect(pageInfo.startCursor).toBe(users_slice[0].id);
      expect(pageInfo.endCursor).toBe(users_slice[2].id);
      expect(pageInfo.hasNextPage).toBeTruthy();
      expect(pageInfo.hasPreviousPage).toBeFalsy();
    });

    test("OK Pagination : last:10 with orderBy username and reverse", async () => {
      const db_users = await prismaClient.user.findMany({
        orderBy: { username: "desc" },
      });
      const users_slice = db_users.slice(-3);
      const { totalCount, nodes, edges, pageInfo } =
        await user_pgn.getConnection({
          last: 3,
          sortKey: "username",
          reverse: true,
        });

      expect(totalCount).toBe(5);
      expect(nodes).toEqual(users_slice);
      expect(pageInfo.startCursor).toBe(users_slice[0].id);
      expect(pageInfo.endCursor).toBe(users_slice[2].id);
      expect(pageInfo.hasNextPage).toBeTruthy();
      expect(pageInfo.hasPreviousPage).toBeFalsy();
    });

    test("OK Pagination : first:10 after", async () => {
      const db_users = await users();
      const users_slice = db_users.slice(3);
      const { totalCount, nodes, edges, pageInfo } =
        await user_pgn.getConnection({
          first: 3,
          after: db_users[2].id,
        });
      expect(totalCount).toBe(5);
      expect(nodes).toEqual(users_slice);
      expect(pageInfo.startCursor).toBe(users_slice[0].id);
      expect(pageInfo.endCursor).toBe(users_slice[1].id);
      expect(pageInfo.hasNextPage).toBeFalsy();
      expect(pageInfo.hasPreviousPage).toBeTruthy();
    });

    test("OK Pagination : last:10 before", async () => {
      const db_users = await users();
      const users_slice = db_users.slice(0, 2);
      const { totalCount, nodes, edges, pageInfo } =
        await user_pgn.getConnection({
          last: 3,
          before: db_users[2].id,
        });
      expect(totalCount).toBe(5);
      expect(nodes).toEqual(users_slice);
      expect(pageInfo.startCursor).toBe(users_slice[0].id);
      expect(pageInfo.endCursor).toBe(users_slice[1].id);
      expect(pageInfo.hasNextPage).toBeFalsy();
      expect(pageInfo.hasPreviousPage).toBeTruthy();
    });

    test("OK Pagination : nothing argument but return first 10", async () => {
      const db_users = await users();
      const { totalCount, nodes, edges, pageInfo } =
        await user_pgn.getConnection({});

      expect(totalCount).toBe(db_users.length);
      expect(nodes).toEqual(db_users);
      expect(nodes[0].id).toBe(edges[0].cursor);
      expect(db_users[0].id).toBe(pageInfo.startCursor);
      expect(db_users[db_users.length - 1].id).toBe(pageInfo.endCursor);
      expect(false).toBe(pageInfo.hasNextPage);
      expect(false).toBe(pageInfo.hasPreviousPage);
    });

    test("NG Pagination : both argument first last ", async () => {
      await expect(
        user_pgn.getConnection({ first: 10, last: 10 })
      ).rejects.toThrowError(
        "Passing both `first` and `last` to paginate the connection is not supported."
      );
    });

    test("NG Pagination : both argument first:251 ", async () => {
      await expect(user_pgn.getConnection({ first: 251 })).rejects.toThrowError(
        "an array have a maximum size of 250"
      );
    });
  });

  describe("User Queries", () => {
    beforeAll(async () => async () => await initDB());

    test("OK me ", async () => {
      const func = "me";
      const args = "";
      const query = `{
      result:${func}${args}{
        id
        firebaseId
        isAdmin
        isActive
        isAnonymous
        username
        createdAt
        updatedAt
      }
    }`;

      const {
        status,
        body: {
          data: { result, errors },
        },
      } = await request(app)
        .post(PATH.GQL)
        .set("Authorization", `Bearer ${testTokens.admin_user}`)
        .send({ query });

      const dbUser:
        | (User & { messages: Message[]; villages: Village[] })
        | null = await prismaClient.user.findFirst({
        where: { id: result.id },
        include: { messages: true, villages: true },
      });

      expect(status).toBe(200);
      expect(result).not.toBeNull();
      expect(errors).toBeUndefined();
      expect(result.id).toBe(dbUser?.id);
      expect(result.firebaseId).toBe(dbUser?.firebaseId);
      expect(result.isAdmin).toBe(dbUser?.isAdmin);
      expect(result.isActive).toBe(dbUser?.isActive);
      expect(result.isAnonymous).toBe(dbUser?.isAnonymous);
      expect(result.username).toBe(dbUser?.username);
      expect(result).toHaveProperty("createdAt");
      expect(result).toHaveProperty("updatedAt");
    });

    // TODO implement test-case
    describe("users", () => {
      const func = "users";
      const args = `first:3`;

      const client = async (
        query: string,
        user_token = testTokens.admin_user
      ) => {
        const result = await request(app)
          .post(PATH.GQL)
          .set("Authorization", `Bearer ${user_token}`)
          .send({ query });

        return result;
      };

      test("OK users", async () => {
        const query = `{
        result:${func}(${args}){
          totalCount
          edges{
              node{
                  id
                  firebaseId
                  isAdmin
                  isActive
                  isAnonymous
                  username
                  createdAt
                  updatedAt
              }
              cursor
          }
          pageInfo{
              startCursor
              endCursor
              hasNextPage
              hasPreviousPage
          }
        }
      }`;

        const { status, body } = await client(query);

        const dbUser:
          | (User & { messages: Message[]; villages: Village[] })[]
          | null = await prismaClient.user.findMany({
          include: { messages: true, villages: true },
        });

        expect(status).toBe(200);
      });
    });
  });

  describe("test old user", () => {
    beforeEach(async () => await initDB());

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
      const func = "getMe";
      const args = "";
      const query = `{
      result:${func}${args}{
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
    }`;

      const {
        status,
        body: {
          data: { result, errors },
        },
      } = await request(app)
        .post(gql_endpoint)
        .set("Authorization", `Bearer ${testTokens.admin_user}`)
        .send({ query });

      const dbUser:
        | (User & { messages: Message[]; villages: Village[] })
        | null = await prismaClient.user.findFirst({
        where: { id: result.id },
        include: { messages: true, villages: true },
      });

      expect(status).toBe(200);
      expect(result).not.toBeNull();
      expect(errors).toBeUndefined();
      expect(result.id).toBe(dbUser?.id);
      expect(result.firebaseId).toBe(dbUser?.firebaseId);
      expect(result.isAdmin).toBe(dbUser?.isAdmin);
      expect(result.isActive).toBe(dbUser?.isActive);
      expect(result.isAnonymous).toBe(dbUser?.isAnonymous);
      expect(result.username).toBe(dbUser?.username);
      expect(result).toHaveProperty("createdAt");
      expect(result).toHaveProperty("updatedAt");
      expect(result.messages.length).toBe(dbUser?.messages.length);
      expect(result.messages[0]).toHaveProperty("id");
      expect(result.messages[0]).toHaveProperty("content");
      expect(result.messages[0]).toHaveProperty("createdAt");
      expect(result.messages[0]).toHaveProperty("updatedAt");
      expect(result.villages.length).toBe(dbUser?.villages.length);
      expect(result.villages[0]).toHaveProperty("id");
      expect(result.villages[0]).toHaveProperty("name");
      expect(result.villages[0]).toHaveProperty("description");
      expect(result.villages[0]).toHaveProperty("isPublic");
      expect(result.villages[0]).toHaveProperty("createdAt");
      expect(result.villages[0]).toHaveProperty("updatedAt");
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
      const dbUser:
        | (User & { messages: Message[]; villages: Village[] })
        | null = await prismaClient.user.findFirst({
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
          errors,
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
      expect(errors).toBeUndefined();
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
      const { status, body } = await request(app)
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
      expect(body.errors[0].message).toEqual(
        "Not allowed to edit the user data"
      );
    });

    test("TEST Success Mutation deleteUser ", async () => {
      const func: string = "deleteUser";

      const dbUser: User | null = await prismaClient.user.findFirst({});

      const {
        status,
        body: { data, errors },
      } = await request(app)
        .post(gql_endpoint)
        .set("Authorization", `Bearer ${testTokens.admin_user}`)
        .send({
          query: `mutation{
        ${func}(id:"${dbUser?.id}"){
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

      const deletedUser: User | null = await prismaClient.user.findFirst({
        where: { id: dbUser?.id },
      });

      expect(status).toBe(200);
      expect(errors).toBeUndefined();
      expect(data).not.toBeUndefined();
      expect(data[func].id).toBe(dbUser?.id);
      expect(deletedUser).toBeNull();
    });

    test("TEST Fail Mutation deleteUser because of a general user ", async () => {
      const func: string = "deleteUser";

      const dbUser: User | null = await prismaClient.user.findFirst({});

      const {
        status,
        body: { data, errors },
      } = await request(app)
        .post(gql_endpoint)
        .set("Authorization", `Bearer ${testTokens.general_user}`)
        .send({
          query: `mutation{
        ${func}(id:"${dbUser?.id}"){
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

      const deletedUser: User | null = await prismaClient.user.findFirst({
        where: { id: dbUser?.id },
      });

      expect(status).toBe(200);
      expect(errors).not.toBeUndefined();
      expect(errors[0].message).toBe("Not allowed to edit the user data");
      expect(data[func]).toBeNull();
      expect(deletedUser).not.toBeNull();
    });
  });
});
