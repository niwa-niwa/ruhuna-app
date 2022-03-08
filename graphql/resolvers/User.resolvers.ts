import { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";
import { ErrorObj } from "../../types/error.types";
import { verifyToken } from "../../lib/firebaseAdmin";
import { UserInputError } from "apollo-server-express";
import { CContext } from "../../types/gql.types";
import { User, Message, Village } from "../../types/types.d";
import {
  QueryResolvers,
  MutationResolvers,
} from "./../../types/resolvers-types.d";

function getMe(
  _parent: any,
  _args: any,
  { prisma, currentUser }: CContext,
  _info: any
): CContext["currentUser"] {
  return currentUser;
}

async function getUsers(
  parent: any,
  args: any,
  { prisma, currentUser }: CContext,
  info: any
): Promise<User[]> {
  const users: User[] | null = await prisma.user.findMany().catch((e) => {
    throw new Error("Internal Server Error");
  });

  return users;
}

async function getUserDetail(
  parent: any,
  { id }: { id: any },
  context: CContext,
  info: any
): Promise<User> {
  const user = await context.prisma.user
    .findUnique({
      where: { id },
    })
    .catch((e) => {
      console.error(e);
      throw new Error("Internal Server Error");
    });

  // throw an error if user is null
  if (!user) {
    throw new UserInputError("bad parameter request");
  }

  return user;
}

async function createUser(
  parent: any,
  args: any,
  context: CContext,
  info: any
): Promise<User> {
  // get firebase user from firebase
  const firebaseUser: DecodedIdToken | ErrorObj = await verifyToken(
    args.firebaseToken
  );
  // throw an error if firebaseUser has an errorCode property
  if ("errorCode" in firebaseUser)
    throw new UserInputError(firebaseUser.errorMessage);

  // create a user by firebase account
  const createdUser = await context.prisma.user
    .create({
      data: {
        firebaseId: firebaseUser.uid,
        username: firebaseUser.name,
      },
    })
    .catch((e) => {
      console.error(e);
      throw new Error("Internal Server Error");
    });

  return createdUser;
}

async function editUser(
  parent: any,
  args: any,
  context: CContext,
  info: any
): Promise<User> {
  // if the user who sent request is admin it would confirm params.userId
  if (!context.currentUser.isAdmin && context.currentUser.id !== args.id) {
    throw new Error("Not allowed to edit the user data");
  }

  // edit the user
  const editedUser = await context.prisma.user
    .update({
      where: { id: args.id },
      data: args,
    })
    .catch((e) => {
      console.error(e);
      throw new Error("Internal Server Error");
    });

  return editedUser;
}

async function deleteUser(
  parent: any,
  { id }: { id: any },
  context: CContext,
  info: any
): Promise<User> {
  // if the user who sent request is admin it would confirm params.userId
  if (!context.currentUser.isAdmin && context.currentUser.id !== id) {
    throw new Error("Not allowed to edit the user data");
  }

  // edit the user
  const deletedUser = await context.prisma.user.delete({
    where: { id },
  });

  return deletedUser;
}

const User = {
  messages: async (
    user: any,
    args: any,
    { prisma, currentUser }: CContext
  ): Promise<Message[] | undefined> => {
    const data = await prisma.message.findMany({
      where: { userId: user.id },
      include: { village: true },
    });
    return data;
  },

  villages: async (
    user: any,
    args: any,
    { prisma, currentUser }: CContext
  ): Promise<Village[] | undefined> => {
    const data = await prisma.user.findUnique({
      where: { id: user.id },
      include: { villages: true },
    });
    return data?.villages;
  },
};

const userResolvers: {
  Query: {
    getMe: any;
    getUsers: QueryResolvers["getUsers"];
    getUserDetail: QueryResolvers["getUserDetail"];
  };
  Mutation: {
    createUser: MutationResolvers["createUser"];
    editUser: MutationResolvers["editUser"];
    deleteUser: MutationResolvers["deleteUser"];
  };
  User: any;
} = {
  Query: {
    getMe,
    getUsers,
    getUserDetail,
  },
  Mutation: {
    createUser,
    editUser,
    deleteUser,
  },
  User,
};

export default userResolvers;
