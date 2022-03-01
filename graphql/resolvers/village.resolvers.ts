import { Message, Prisma, User, Village } from "@prisma/client";
import { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";
import { ErrorObj } from "../../types/error.types";
import { verifyToken } from "../../lib/firebaseAdmin";
import { UserInputError } from "apollo-server-express";
import { TContext } from "../../types/gql.types";
import { VillageIncludeRelations } from "../../types/prisma.types";
import { async } from "@firebase/util";

export const resolvers = {
  Query: {
    getVillages: async (
      parent: any,
      args: any,
      context: TContext,
      info: any
    ): Promise<VillageIncludeRelations[]> => {
      const villages: VillageIncludeRelations[] = await context.prisma.village.findMany({
        include: { users: true, messages: true },
      });
      return villages;
    },
  },
};
