import { prismaClient } from "../../lib/prismaClient";
import { User } from "@prisma/client";

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
};
