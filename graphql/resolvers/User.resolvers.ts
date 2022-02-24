import { Prisma, User } from "@prisma/client";
import { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";
import { ErrorObj } from "../../api/types/ErrorObj";
import { verifyToken } from "../../lib/firebaseAdmin";
import { UserInputError } from "apollo-server-express";
import { TContext } from "../gql.types";

export const resolvers = {
  Query: {
    getMe: (parent: any, args: any, context: TContext, info: any): User => {
      return context.currentUser;
    },
    getUsers: async (
      parent: any,
      args: any,
      context: TContext,
      info: any
    ): Promise<User[]> => {
      const users: User[] = await context.prisma.user.findMany({
        include: { messages: true, villages: true },
      });
      return users;
    },
    getUserDetail: async (
      parent: any,
      { id }: { id: User["id"] },
      context: TContext,
      info: any
    ): Promise<User> => {
      const user: User | null = await context.prisma.user.findUnique({
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
      context: TContext,
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
      const createdUser: User = await context.prisma.user.create({
        data: {
          firebaseId: firebaseUser.uid,
          username: firebaseUser.name,
        },
      });

      return createdUser;
    },
    editUser: async (
      parent: any,
      { id, ...args }: { id: User["id"]; args: Prisma.UserUpdateInput },
      context: TContext,
      info: any
    ): Promise<User> => {
      // if the user who sent request is admin it would confirm params.userId
      if (!context.currentUser.isAdmin && context.currentUser.id !== id) {
        throw new Error("Not allowed to edit the user data");
      }

      // edit the user
      const editedUser: User = await context.prisma.user.update({
        where: { id },
        data: args,
      });

      return editedUser;
    },
  },
};
