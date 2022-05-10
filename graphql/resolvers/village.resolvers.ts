import {
  Connection,
  MutationDeleteVillageArgs,
  MutationEditVillageArgs,
  QueryVillageArgs,
  QueryVillagesArgs,
  VillageConnection,
} from "../../types/types.d";
import {
  QueryResolvers,
  MutationResolvers,
  MutationCreateVillageArgs,
} from "../../types/resolvers-types.d";
import { UserInputError } from "apollo-server-express";
import { CContext } from "../../types/gql.types";
import { Pagination } from "../lib/classes/Pagination";

async function villages(
  parent: any,
  { after, before, first, last, query, reverse, sortKey }: QueryVillagesArgs,
  { prisma, currentUser }: CContext,
  info: any
): Promise<VillageConnection> {
  const result: Connection = await new Pagination(prisma.village).getConnection(
    {
      after,
      before,
      first,
      last,
      query,
      reverse,
      sortKey,
    }
  );

  return result as VillageConnection;
}

async function village(
  parent: any,
  { id }: QueryVillageArgs,
  { prisma, currentUser }: CContext,
  info: any
) {
  const village = await prisma.village.findUnique({
    where: { id },
  });

  // throw an error if village is null
  if (!village) {
    throw new UserInputError("bad parameter request");
  }

  return village;
}

async function createVillage(
  parent: any,
  { name, description, isPublic }: MutationCreateVillageArgs,
  { prisma, currentUser }: CContext,
  info: any
) {
  const village = await prisma.village
    .create({
      data: {
        name,
        description,
        isPublic: isPublic || undefined,
        users: { connect: { id: currentUser.id } },
        owner: { connect: { id: currentUser.id } },
      },
      include: { users: true, messages: true },
    })
    .catch((e) => {
      console.error(e);
      throw new Error("Internal Server Error");
    });

  return village;
}

async function editVillage(
  parent: any,
  { villageId, description, isPublic, name }: MutationEditVillageArgs,
  { prisma, currentUser }: CContext,
  info: any
) {
  const village = await prisma.village
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
      console.error(e);
      throw new Error("Internal Server Error");
    });

  return village;
}

async function deleteVillage(
  parent: any,
  { villageId }: MutationDeleteVillageArgs,
  { prisma, currentUser }: CContext,
  info: any
) {
  const village = await prisma.village
    .delete({
      where: { id: villageId },
    })
    .catch((e) => {
      console.error(e);
      throw new Error("Internal Server Error");
    });

  return village;
}

// const villageResolvers: {
//   Query: {
//     getVillages: QueryResolvers["getVillages"];
//     getVillageDetail: QueryResolvers["getVillageDetail"];
//   };
//   Mutation: {
//     createVillage: MutationResolvers["createVillage"];
//     editVillage: MutationResolvers["editVillage"];
//     deleteVillage:MutationResolvers["deleteVillage"]
//     // leaveVillage:MutationResolvers["leaveVillage"]
//   };
// }
const villageResolvers = {
  Query: {
    village,
    villages,
  },
  Mutation: {
    createVillage,
    editVillage,
    deleteVillage,
  },
};

export default villageResolvers;
