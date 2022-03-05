import { users } from "./../../prisma/seeds";
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
    const func: string = "getVillages";

    const dbVillages: VillageIncludeRelations[] =
      await prismaClient.village.findMany({
        include: { users: true, messages: true },
      });

    const {
      status,
      body: { data, errors },
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
    expect(data[func].length).toBe(dbVillages.length);
    expect(data[func][0]).toHaveProperty("id");
    expect(data[func][0]).toHaveProperty("name");
    expect(data[func][0]).toHaveProperty("isPublic");
    expect(data[func][0]).toHaveProperty("createdAt");
    expect(data[func][0]).toHaveProperty("updatedAt");
    expect(data[func][0]).toHaveProperty("messages");
    expect(data[func][0]).toHaveProperty("users");
  });

  test("TEST Query getVillageDetail", async () => {
    const func: string = "getVillageDetail";

    const dbVillage: VillageIncludeRelations | null =
      await prismaClient.village.findFirst({
        include: { users: true, messages: true },
      });

    const {
      status,
      body: { data, errors },
    } = await request(app)
      .post(gql_endpoint)
      .set("Authorization", `Bearer ${testTokens.admin_user}`)
      .send({
        query: `{
          ${func}(villageId:"${dbVillage?.id}"){
            id
            name
            description
            isPublic
            messages{
              id
              content
            }
            users{
              id
              username
            }
          }
        }`,
      });

    expect(status).toBe(200);
    expect(data).not.toBeNull();
    expect(errors).toBeUndefined();
    expect(data[func].id).toBe(dbVillage?.id);
    expect(data[func].name).toBe(dbVillage?.name);
    expect(data[func].description).toBe(dbVillage?.description);
    expect(data[func].isPublic).toBe(dbVillage?.isPublic);
    expect(data[func]).toHaveProperty("messages");
    expect(data[func]).toHaveProperty("users");
  });

  test("TEST Mutation createVillage", async () => {
    const func = "createVillage";

    const create_data = {
      name: "test crate",
      description: "test description",
    };

    const {
      status,
      body: { data, errors },
    } = await request(app)
      .post(gql_endpoint)
      .set("Authorization", `Bearer ${testTokens.admin_user}`)
      .send({
        query: `mutation{
          ${func}(name:"${create_data.name}", description:"${create_data.description}"){
            id
            name
            description
            isPublic
            users{
              id
            }
            messages{
              id
            }
            createdAt
            updatedAt
          }
        }`,
      });

    const dbVillage: VillageIncludeRelations | null =
      await prismaClient.village.findUnique({
        where: { id: data[func].id },
        include: { users: true, messages: true },
      });

    expect(status).toBe(200);
    expect(data).not.toBeNull();
    expect(errors).toBeUndefined();
    expect(data[func].id).toBe(dbVillage?.id);
    expect(data[func].name).toBe(dbVillage?.name);
    expect(data[func].description).toBe(dbVillage?.description);
    expect(data[func].isPublic).toBe(dbVillage?.isPublic);
    expect(data[func].isPublic).toBe(false);
    expect(data[func]).toHaveProperty("users");
    expect(data[func]).toHaveProperty("messages");
    expect(data[func]).toHaveProperty("updatedAt");
    expect(data[func]).toHaveProperty("createdAt");
  });
});
