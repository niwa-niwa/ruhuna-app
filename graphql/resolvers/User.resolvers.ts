import { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";
import { ErrorObj } from "../../types/error.types";
import { verifyToken } from "../../lib/firebaseAdmin"
import { UserInputError } from "apollo-server-express";
import { CContext } from "../../types/gql.types";
import {
  User,
  Message,
  Village,
  QueryGetUserDetailArgs,
  MutationCreateUserArgs,
  MutationEditUserArgs,
  MutationDeleteUserArgs,
} from "../../types/types.d";
import {
  QueryResolvers,
  MutationResolvers,
  UserResolvers,
} from "../../types/resolvers-types.d";

async function getMe(
  obj: any,
  args: any,
  { prisma, currentUser }: CContext,
  info: any
): Promise<User | null> {
  const user: User | null = await prisma.user
    .findUnique({
      where: { id: currentUser.id },
    })
    .catch((e) => {
      console.error(e);
      throw new Error("Internal Server Error");
    });
  return user;
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
  { id }: QueryGetUserDetailArgs,
  { prisma, currentUser }: CContext,
  info: any
): Promise<User> {
  const user = await prisma.user
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
  { firebaseToken }: MutationCreateUserArgs,
  { prisma, currentUser }: CContext,
  info: any
): Promise<User> {
  // get firebase user from firebase
  const firebaseUser: DecodedIdToken | ErrorObj = await verifyToken(
    firebaseToken
  );
  // throw an error if firebaseUser has an errorCode property
  if ("errorCode" in firebaseUser)
    throw new UserInputError(firebaseUser.errorMessage);

  // create a user by firebase account
  const createdUser = await prisma.user
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
  { id, isAdmin, isActive, isAnonymous, username }: MutationEditUserArgs,
  { prisma, currentUser }: CContext,
  info: any
): Promise<User> {
  // if the user who sent request is admin it would confirm params.userId
  if (!currentUser.isAdmin && currentUser.id !== id) {
    throw new Error("Not allowed to edit the user data");
  }

  // edit the user
  const editedUser = await prisma.user
    .update({
      where: { id: id },
      data: {
        isAdmin: isAdmin!,
        isActive: isActive!,
        isAnonymous: isAnonymous!,
        username: username || undefined,
      },
    })
    .catch((e) => {
      console.error(e);
      throw new Error("Internal Server Error");
    });

  return editedUser;
}

async function deleteUser(
  parent: any,
  { id }: MutationDeleteUserArgs,
  { prisma, currentUser }: CContext,
  info: any
): Promise<User> {
  // if the user who sent request is admin it would confirm params.userId
  if (!currentUser.isAdmin && currentUser.id !== id) {
    throw new Error("Not allowed to edit the user data");
  }

  // edit the user
  const deletedUser = await prisma.user
    .delete({
      where: { id },
    })
    .catch((e) => {
      console.error(e);
      throw new Error("Internal Server Error");
    });

  return deletedUser;
}

const User = {
  messages: async (
    user: any,
    args: any,
    { prisma, currentUser }: CContext
  ): Promise<Message[]> => {
    const messages = await prisma.message
      .findMany({
        where: { userId: user.id },
        include: { village: true, user: true },
      })
      .catch((e) => {
        console.error(e);
        throw new Error("Internal Server Error");
      });

    return messages;
  },

  villages: async (
    user: any,
    args: any,
    { prisma, currentUser }: CContext
  ): Promise<Village[]> => {
    const villages = await prisma.village
      .findMany({
        where: {
          users: {
            some: {
              id: user.id,
            },
          },
        },
      })
      .catch((e) => {
        console.error(e);
        throw new Error("Internal Server Error");
      });

    return villages;
  },
};

const userResolvers: {
  Query: {
    getMe: QueryResolvers["getMe"];
    getUsers: QueryResolvers["getUsers"];
    getUserDetail: QueryResolvers["getUserDetail"];
  };
  Mutation: {
    createUser: MutationResolvers["createUser"];
    editUser: MutationResolvers["editUser"];
    deleteUser: MutationResolvers["deleteUser"];
  };
  User: Pick<UserResolvers, "messages" | "villages">;
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
