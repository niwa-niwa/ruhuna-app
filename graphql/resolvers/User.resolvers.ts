import { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";
import { verifyToken } from "../../lib/firebaseAdmin";
import { UserInputError } from "apollo-server-express";
import { CContext } from "../../types/gql.types";
import {
  User,
  MutationCreateUserArgs,
  MutationEditUserArgs,
  MutationDeleteUserArgs,
  Connection,
  VillageConnection,
  MessageConnection,
} from "../../types/types";
import {
  QueryResolvers,
  MutationResolvers,
  UserResolvers,
  UserConnection,
  QueryUsersArgs,
  QueryUserArgs,
} from "../../types/resolvers-types";
import { Pagination } from "../lib/classes/Pagination";
import { ErrorObject } from "../../types/rest.types";

async function users(
  parent: any,
  { after, before, first, last, query, reverse, sortKey }: QueryUsersArgs,
  { prisma, currentUser }: CContext,
  info: any
): Promise<UserConnection> {
  const result: Connection = await new Pagination(prisma.user).getConnection({
    after,
    before,
    first,
    last,
    query,
    reverse,
    sortKey,
  });

  return result as UserConnection;
}

async function user(
  parent: any,
  { id }: QueryUserArgs,
  { prisma, currentUser }: CContext,
  info: any
) {
  const user = await prisma.user.findUnique({
    where: { id },
  });

  // throw an error if user is null
  if (!user) {
    throw new UserInputError("bad parameter request");
  }

  return user;
}

async function me(
  parent: any,
  {},
  { prisma, currentUser }: CContext,
  info: any
) {
  const user = await prisma.user.findUnique({
    where: { id: currentUser.id },
  });

  if (!user) throw new Error("Internal Server Error");

  return user;
}

async function createUser(
  parent: any,
  { firebaseToken }: MutationCreateUserArgs,
  { prisma, currentUser }: CContext,
  info: any
) {
  // get firebase user from firebase
  const firebaseUser: DecodedIdToken | ErrorObject = await verifyToken(
    firebaseToken
  );
  // throw an error if firebaseUser has an errorCode property
  if ("code" in firebaseUser) throw new UserInputError(firebaseUser.message);

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
) {
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
) {
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
  ): Promise<MessageConnection> => {
    args.query = ((): string => {
      let result: object = {};

      if (args.query) {
        let query_obj = JSON.parse(args.query);

        if (query_obj.AND) {
          query_obj.AND[0].userId = user.id;

          result = query_obj;
        }

        if (!query_obj.AND) {
          query_obj = { AND: [query_obj, { userId: user.id }] };

          result = query_obj;
        }
      }

      if (!args.query) result = { userId: user.id };

      return JSON.stringify(result);
    })();

    const result = await new Pagination(prisma.message).getConnection(args);

    return result as MessageConnection;
  },

  villages: async (
    user: any,
    args: any,
    { prisma, currentUser }: CContext
  ): Promise<VillageConnection> => {
    // added user.id because villages that the user belong to
    args.query = ((): string => {
      let result: object = {};

      if (args.query) {
        let query_obj = JSON.parse(args.query);

        if (query_obj.AND) {
          query_obj.AND[0].userId = user.id;

          result = query_obj;
        }

        if (!query_obj.AND) {
          query_obj = { AND: [query_obj, { userId: user.id }] };

          result = query_obj;
        }
      }

      if (!args.query) result = { userId: user.id };

      return JSON.stringify(result);
    })();

    const result = await new Pagination(prisma.village).getConnection(args);

    return result as VillageConnection;
  },
};

const userResolvers = {
  Query: {
    users,
    user,
    me,
  },
  Mutation: {
    createUser,
    editUser,
    deleteUser,
  },
  User,
};

export default userResolvers;
