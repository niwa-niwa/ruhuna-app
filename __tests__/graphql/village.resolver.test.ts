import { users } from "./../../prisma/seeds";
import request from "supertest";
import express, { Express } from "express";
import { prismaClient } from "../../lib/prismaClient";
import { User, Message, Village } from "@prisma/client";
import { apolloServer } from "../../graphql/app";
import { testTokens } from "../test_config/testData";
import { VillageIncludeRelations } from "../../types/prisma.types";
import {
  MutationDeleteVillageArgs,
  MutationEditVillageArgs,
} from "../../types/types.d";
import initDB from "../test_config/initDB";

beforeEach(async () => await initDB());

const gql_endpoint: string = "/graphql";

describe("TEST Village of resolvers in GraphQL cases", () => {
  let app: Express;

  beforeAll(async () => {
    app = express();
    await apolloServer.start();
    apolloServer.applyMiddleware({ app, path: gql_endpoint });
  });

  test("TEST Query getVillages ", async () => {
    const func: string = "villages";
    const args = `first:3`;

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
          ${func}(${args}){
            totalCount
            nodes{
              id
              name
              description
              isPublic
              createdAt
              updatedAt
            }
          }
        }`,
      });

    expect(status).toBe(200);
    expect(data).not.toBeNull();
    expect(errors).toBeUndefined();
    expect(data[func].totalCount).toBe(dbVillages.length);
    expect(data[func].nodes.length).toBe(3);
    // expect(data[func][0]).toHaveProperty("name");
    // expect(data[func][0]).toHaveProperty("isPublic");
    // expect(data[func][0]).toHaveProperty("createdAt");
    // expect(data[func][0]).toHaveProperty("updatedAt");
    // expect(data[func][0]).toHaveProperty("messages");
    // expect(data[func][0]).toHaveProperty("users");
  });

  test("TEST Query getVillageDetail", async () => {
    const func: string = "village";

    const dbVillage: VillageIncludeRelations | null =
      await prismaClient.village.findFirst({
        include: { users: true, messages: true },
      });

    const {
      status,
      body,
    } = await request(app)
      .post(gql_endpoint)
      .set("Authorization", `Bearer ${testTokens.admin_user}`)
      .send({
        query: `{
          ${func}(id:"${dbVillage?.id}"){
            id
            name
            description
            isPublic
          }
        }`,
      });

      expect(status).toBe(200);
    // expect(data).not.toBeNull();
    // expect(errors).toBeUndefined();
    // expect(data[func].id).toBe(dbVillage?.id);
    // expect(data[func].name).toBe(dbVillage?.name);
    // expect(data[func].description).toBe(dbVillage?.description);
    // expect(data[func].isPublic).toBe(dbVillage?.isPublic);
    // expect(data[func]).toHaveProperty("messages");
    // expect(data[func]).toHaveProperty("users");
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
    // expect(data).not.toBeNull();
    // expect(errors).toBeUndefined();
    // expect(data[func].id).toBe(dbVillage?.id);
    // expect(data[func].name).toBe(dbVillage?.name);
    // expect(data[func].description).toBe(dbVillage?.description);
    // expect(data[func].isPublic).toBe(dbVillage?.isPublic);
    // expect(data[func].isPublic).toBe(false);
    // expect(data[func]).toHaveProperty("users");
    // expect(data[func]).toHaveProperty("messages");
    // expect(data[func]).toHaveProperty("updatedAt");
    // expect(data[func]).toHaveProperty("createdAt");
  });

  test("TEST success Mutation editVillage", async () => {
    const func = "editVillage";

    const edit_data: MutationEditVillageArgs = {
      villageId: "",
      description: "edited description",
      isPublic: true,
      name: "edited name",
    };

    const dbVillage: VillageIncludeRelations | null =
      await prismaClient.village.findFirst({
        include: { users: true, messages: true },
      });
    edit_data.villageId = dbVillage?.id!;

    const {
      status,
      body: { data, errors },
    } = await request(app)
      .post(gql_endpoint)
      .set("Authorization", `Bearer ${testTokens.admin_user}`)
      .send({
        query: `mutation{
        ${func}(
          villageId:"${edit_data.villageId}",
          name:"${edit_data.name}",
          description:"${edit_data.description}",
          isPublic:${edit_data.isPublic}){
          id
          name
          description
          isPublic
          createdAt
          updatedAt
        }
      }`,
      });

    const editedDbVillage: VillageIncludeRelations | null =
      await prismaClient.village.findUnique({
        where: { id: edit_data.villageId },
        include: { users: true, messages: true },
      });

    expect(status).toBe(200);
    // expect(data[func]).not.toBeNull();
    // expect(errors).toBeUndefined();
    // expect(edit_data.villageId).toBe(editedDbVillage?.id);
    // expect(edit_data.name).toBe(editedDbVillage?.name);
    // expect(edit_data.description).toBe(editedDbVillage?.description);
    // expect(edit_data.isPublic).toBe(editedDbVillage?.isPublic);
    // expect(edit_data.villageId).toBe(data[func].id);
    // expect(edit_data.name).toBe(data[func].name);
    // expect(edit_data.description).toBe(data[func].description);
    // expect(edit_data.isPublic).toBe(data[func].isPublic);
  });

  test("TEST success Mutation deleteVillage", async () => {
    const func = "deleteVillage";

    const dbVillage: Village | null = await prismaClient.village.findFirst();

    const args: MutationDeleteVillageArgs = {
      villageId: dbVillage!.id,
    };

    const {
      status,
      body: { data, errors },
    } = await request(app)
      .post(gql_endpoint)
      .set("Authorization", `Bearer ${testTokens.admin_user}`)
      .send({
        query: `mutation{
        ${func}
        ( 
          villageId:"${args.villageId}"
        )
        {
          id
          name
          description
          isPublic
          createdAt
          updatedAt
        }
      }`,
      });

    const deletedDbVillage: Village | null =
      await prismaClient.village.findUnique({
        where: { id: args.villageId },
      });

    expect(status).toBe(200);
    // expect(data[func]).not.toBeNull();
    // expect(errors).toBeUndefined();
    // expect(deletedDbVillage).toBeNull();
    // expect(data[func].id).toBe(args.villageId)
  });
});
