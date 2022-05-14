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
    function prismaString(result: {}): { [key: string | number]: string }[] {
      /**
       * convert result of PrismaJS to {[key:string|number]:string} for compare graphql result
       * @param result
       * @returns {[key:string|number]:string}
       */
      return JSON.parse(JSON.stringify(result));
    }

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

    describe("users", () => {
      const func = "users";
      const alias = "result";

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
        const args = `first:3`;

        const query = `
        {
          ${alias}:${func}(${args}){
            totalCount
            nodes{
              id
              firebaseId
              isAdmin
              isActive
              isAnonymous
              username
              createdAt
              updatedAt
            }
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

        const {
          status,
          body: { data, errors },
        } = await client(query);

        const dbUsers: User[] = await prismaClient.user.findMany();

        const users_slice = prismaString(dbUsers.slice(0, 3));

        expect(status).toBe(200);
        expect(data.result.totalCount).toBe(5);
        expect(data.result.nodes.length).toBe(3);
        expect(data.result.edges.length).toBe(3);
        expect(data[alias].nodes).toEqual(users_slice);
        expect(data[alias].edges[0].node).toEqual(users_slice[0]);
        expect(data[alias].pageInfo.startCursor).not.toBe(users_slice[0].id);
        expect(data[alias].pageInfo.endCursor).not.toBe(
          users_slice[users_slice.length - 1].id
        );
        expect(data[alias].pageInfo.hasNextPage).toBeTruthy();
        expect(data[alias].pageInfo.hasPreviousPage).toBeFalsy();
      });

      test("OK users with relations", async () => {
        const query_str = JSON.stringify({
          name: {
            contains: "village_A",
          },
        }).replace(/\"/g, '\\"');

        const args = `first:3`;

        const query = `
        {
          ${alias}:${func}(${args}){
            totalCount
            nodes{
              id
              firebaseId
              isAdmin
              isActive
              isAnonymous
              villages(first:3 query:"${query_str}"){
                totalCount
                nodes{
                  id
                  name
                }
              }
              messages{
                totalCount
                nodes{
                  id
                  content
                  user{
                    id
                    username
                  }
                  village{
                    id
                    name
                  }
                }
              }
              username
              createdAt
              updatedAt
            }
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

        const {
          status,
          body: { data },
        } = await client(query);
        const dbUsers: User[] = await prismaClient.user.findMany();
        const users_slice = prismaString(dbUsers.slice(0, 3));

        expect(status).toBe(200);
        expect(data.result.totalCount).toBe(5);
        expect(data.result.nodes.length).toBe(3);
        expect(data.result.edges.length).toBe(3);
        expect(data[alias].edges[0].node).toEqual(users_slice[0]);
        expect(data[alias].pageInfo.startCursor).not.toBe(users_slice[0].id);
        expect(data[alias].pageInfo.endCursor).not.toBe(
          users_slice[users_slice.length - 1].id
        );
        expect(data[alias].pageInfo.hasNextPage).toBeTruthy();
        expect(data[alias].pageInfo.hasPreviousPage).toBeFalsy();
        expect(data[alias].nodes[0].villages.totalCount).toBe(1);
        expect(data[alias].nodes[0].villages.nodes[0].name).toBe("village_A");
        expect(data[alias].nodes[0].messages.nodes[0].content).toBe(
          "message_1 content"
        );
        expect(data[alias].nodes[0].messages.nodes[0]).toHaveProperty("user");
        expect(data[alias].nodes[0].messages.nodes[0]).toHaveProperty(
          "village"
        );
      });

      test("OK users with relations + AND", async () => {
        const query_str = JSON.stringify({
          AND: [
            {
              name: {
                contains: "village",
              },
              description: {
                contains: "desc_village_A",
              },
            },
          ],
        }).replace(/\"/g, '\\"');

        const args = `first:3`;

        const query = `
        {
          ${alias}:${func}(${args}){
            totalCount
            nodes{
              id
              firebaseId
              isAdmin
              isActive
              isAnonymous
              villages(first:3 query:"${query_str}"){
                totalCount
                nodes{
                  id
                  name
                  description
                }
              }
              messages{
                totalCount
              }
              username
              createdAt
              updatedAt
            }
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

        const {
          status,
          body: { data },
        } = await client(query);

        const dbUsers: User[] = await prismaClient.user.findMany();

        const users_slice = prismaString(dbUsers.slice(0, 3));

        expect(status).toBe(200);
        expect(data.result.totalCount).toBe(5);
        expect(data.result.nodes.length).toBe(3);
        expect(data.result.edges.length).toBe(3);
        expect(data[alias].edges[0].node).toEqual(users_slice[0]);
        expect(data[alias].pageInfo.startCursor).not.toBe(users_slice[0].id);
        expect(data[alias].pageInfo.endCursor).not.toBe(
          users_slice[users_slice.length - 1].id
        );
        expect(data[alias].pageInfo.hasNextPage).toBeTruthy();
        expect(data[alias].pageInfo.hasPreviousPage).toBeFalsy();
        expect(data[alias].nodes[0].villages.totalCount).toBe(1);
        expect(data[alias].nodes[0].villages.nodes[0].name).toBe("village_A");
        expect(data[alias].nodes[0].villages.nodes[0].description).toBe(
          "desc_village_A"
        );
      });

      test("OK users with after variable", async () => {
        let args = `first:3`;

        const pre_query = `
        {
          ${alias}:${func}(${args}){
            pageInfo{
                startCursor
                endCursor
                hasNextPage
                hasPreviousPage
            }
          }
        }`;

        const pre = await client(pre_query);

        expect(pre.status).toBe(200);

        const cursor = pre.body.data.result.pageInfo.endCursor;

        args = `first:3 after:"${cursor}"`;

        const query = `
        {
          ${alias}:${func}(${args}){
            totalCount
            nodes{
              id
              firebaseId
              isAdmin
              isActive
              isAnonymous
              username
              createdAt
              updatedAt
            }
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

        const {
          status,
          body: { data, errors },
        } = await client(query);
        const dbUsers: User[] = await prismaClient.user.findMany();
        dbUsers.splice(0, 3);
        const users_slice = prismaString(dbUsers);

        expect(status).toBe(200);
        expect(data[alias].totalCount).toBe(5);
        expect(data[alias].nodes.length).toBe(2);
        expect(data[alias].edges.length).toBe(2);
        expect(data[alias].nodes).toEqual(users_slice);
        expect(data[alias].edges[0].node).toEqual(users_slice[0]);
        expect(data[alias].pageInfo.startCursor).not.toBe(users_slice[0].id);
        expect(data[alias].pageInfo.endCursor).not.toBe(
          users_slice[users_slice.length - 1].id
        );
        expect(data[alias].pageInfo.hasNextPage).toBeFalsy();
        expect(data[alias].pageInfo.hasPreviousPage).toBeTruthy();
      });
    });
  });

  describe("User Mutations", () => {
    beforeEach(async () => await initDB());

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
