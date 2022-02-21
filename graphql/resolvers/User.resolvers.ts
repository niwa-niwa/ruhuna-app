import { prismaClient } from "../../lib/prismaClient";
import { User } from "@prisma/client";
import { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";
import { ErrorObj } from "../../api/types/ErrorObj";
import { verifyToken } from "../../lib/firebaseAdmin";
import { UserInputError } from "apollo-server-express";

export const resolvers = {
  Query: {
    getMe: (parent: any, args: any, context: any, info: any): User => {
      return context.currentUser;
    },
    getUsers: async (): Promise<User[]> => {
      const users: User[] = await prismaClient.user.findMany({
        include: { messages: true, villages: true },
      });
      return users;
    },
    getUserDetail: async (
      parent: any,
      { id }: { id: string },
      context: any,
      info: any
    ): Promise<User> => {
      const user: User | null = await prismaClient.user.findUnique({
        where: { id },
        include: { messages: true, villages: true },
      });
      // throw an error if user is null
      if (!user) {
        throw new Error("bad parameter request");
      }
      return user;
    },
  },

  Mutation: {
    createUser: async (
      parent: any,
      args: any,
      context: any,
      info: any
    ): Promise<User> => {
      // get firebase user from firebase
      const firebaseUser: DecodedIdToken | ErrorObj = await verifyToken(
        args.firebaseToken
      );
      // throw an error if firebaseUser has an errorCode property
      if ("errorCode" in firebaseUser)
        throw new UserInputError(firebaseUser.errorMessage);

      // create a user by firebase account
      const createdUser: User = await prismaClient.user.create({
        data: {
          firebaseId: firebaseUser.uid,
          username: firebaseUser.name,
        },
      });

      return createdUser;
    },
  },
};
