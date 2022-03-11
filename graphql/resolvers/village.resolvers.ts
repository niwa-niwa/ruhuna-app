import { MutationDeleteVillageArgs, MutationEditVillageArgs } from "../../types/types.d";
import {
  QueryResolvers,
  MutationResolvers,
  MutationCreateVillageArgs,
} from "../../types/resolvers-types.d";
import { Message, Prisma, User, Village } from "@prisma/client";
import { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";
import { ErrorObj } from "../../types/error.types";
import { verifyToken } from "../../lib/firebaseAdmin";
import { UserInputError } from "apollo-server-express";
import { CContext } from "../../types/gql.types";
import { VillageIncludeRelations } from "../../types/prisma.types";

async function getVillages(
  parent: any,
  args: any,
  { prisma, currentUser }: CContext,
  info: any
): Promise<Village[]> {
  const villages: VillageIncludeRelations[] = await prisma.village
    .findMany({
      include: { users: true, messages: true },
    })
    .catch((e) => {
      console.error(e)
      throw new Error("Internal Server Error");
    });

  return villages;
}

async function getVillageDetail(
  parent: any,
  args: { villageId: Village["id"] },
  context: CContext,
  info: any
): Promise<Village> {
  const village: VillageIncludeRelations | null = await context.prisma.village
    .findUnique({
      where: { id: args.villageId },
      include: { users: true, messages: true },
    })
    .catch((e) => {
      console.error(e)
      throw new Error("Internal Server Error");
    });

  if (!village) throw new UserInputError("bad parameter request");

  return village;
}

async function createVillage(
  parent: any,
  { name, description, isPublic }: MutationCreateVillageArgs,
  { prisma, currentUser }: CContext,
  info: any
): Promise<Village> {
  const village: Village = await prisma.village
    .create({
      data: {
        name,
        description,
        isPublic: isPublic || undefined,
        users: { connect: { id: currentUser.id } },
      },
      include: { users: true, messages: true },
    })
    .catch((e) => {
      console.error(e)
      throw new Error("Internal Server Error");
    });

  return village;
}

async function editVillage(
  parent: any,
  { villageId, description, isPublic, name }: MutationEditVillageArgs,
  { prisma, currentUser }: CContext,
  info: any
): Promise<Village> {
  const village: Village = await prisma.village
    .update({
      where: { id: villageId },
      data: {
        name: name ?? undefined,
        description,
        isPublic: isPublic!,
      },
      include: { users: true, messages: true },
    })
    .catch((e) => {
      console.error(e)
      throw new Error("Internal Server Error");
    });

  return village;
}

async function deleteVillage(
  parent: any,
  { villageId }: MutationDeleteVillageArgs,
  { prisma, currentUser }: CContext,
  info: any
):Promise<Village> {
  const village: Village = await prisma.village.delete({
    where: { id:villageId  },
  })
  .catch((e) => {
    console.error(e)
    throw new Error("Internal Server Error");
  });

  return village
}

async function leaveVillage(
  parent: any,
  { villageId }: { villageId: Village["id"] },
  context: CContext,
  info: any
) {}

const villageResolvers: {
  Query: {
    getVillages: QueryResolvers["getVillages"];
    getVillageDetail: QueryResolvers["getVillageDetail"];
  };
  Mutation: {
    createVillage: MutationResolvers["createVillage"];
    editVillage: MutationResolvers["editVillage"];
    deleteVillage:MutationResolvers["deleteVillage"]
    // leaveVillage:MutationResolvers["leaveVillage"]
  };
} = {
  Query: {
    getVillages,
    getVillageDetail,
  },
  Mutation: {
    createVillage,
    editVillage,
    deleteVillage,
    // leaveVillage,
  },
};

export default villageResolvers;
