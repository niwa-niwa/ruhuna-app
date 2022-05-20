import { User as PUser } from "@prisma/client";
import { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";
import { verifyToken } from "../../../backend/lib/firebaseAdmin";
import { UserInputError } from "apollo-server-express";
import { CContext } from "../types/gql.types";
import {
  User,
  MutationCreateUserArgs,
  MutationEditUserArgs,
  MutationDeleteUserArgs,
  Connection,
  UserConnection,
  VillageConnection,
  MessageConnection,
  UserVillagesArgs,
  UserMessagesArgs,
  QueryUsersArgs,
  QueryUserArgs,
} from "../types/types";
import {
  QueryResolvers,
  MutationResolvers,
  UserResolvers,
} from "../types/resolvers-types";
import { Pagination } from "../lib/classes/Pagination";
import { ErrorObject } from "../../../backend/lib/utilities";

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

export async function user(
  parent: any,
  { id }: QueryUserArgs,
  { prisma, currentUser }: CContext,
  info: any
): Promise<User> {
  const user: PUser | null = await prisma.user.findUnique({
    where: { id },
  });

  // throw an error if user is null
  if (!user) {
    throw new UserInputError("bad parameter request");
  }

  return user as User;
}

async function me(
  parent: any,
  {},
  { prisma, currentUser }: CContext,
  info: any
): Promise<User> {
  const user: PUser | null = await prisma.user.findUnique({
    where: { id: currentUser.id },
  });

  if (!user) throw new Error("Internal Server Error");

  return user as User;
}

async function createUser(
  parent: any,
  { firebaseToken }: MutationCreateUserArgs,
  { prisma, currentUser }: CContext,
  info: any
): Promise<User> {
  // get firebase user from firebase
  const firebaseUser: DecodedIdToken | ErrorObject = await verifyToken(
    firebaseToken
  );
  // throw an error if firebaseUser has an errorCode property
  if ("code" in firebaseUser) throw new UserInputError(firebaseUser.message);

  // create a user by firebase account
  const createdUser: PUser = await prisma.user
    .create({
      data: {
        firebaseId: firebaseUser.uid,
        username: firebaseUser.name,
      },
    })
    .catch((e:any) => {
      console.error(e);
      throw new Error("Internal Server Error");
    });

  return createdUser as User;
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
  const editedUser: PUser = await prisma.user
    .update({
      where: { id },
      data: {
        isAdmin: isAdmin!,
        isActive: isActive!,
        isAnonymous: isAnonymous!,
        username: username || undefined,
      },
    })
    .catch((e:any) => {
      console.error(e);
      throw new Error("Internal Server Error");
    });

  return editedUser as User;
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
  const deletedUser: PUser = await prisma.user
    .delete({
      where: { id },
    })
    .catch((e:any) => {
      console.error(e);
      throw new Error("Internal Server Error");
    });

  return deletedUser as User;
}

const User:UserResolvers = {
  messages: async (
    user: User,
    args: UserMessagesArgs,
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

    const result: Connection = await new Pagination(
      prisma.message
    ).getConnection(args);

    return result as MessageConnection;
  },

  villages: async (
    user: User,
    args: UserVillagesArgs,
    { prisma, currentUser }: CContext
  ): Promise<VillageConnection> => {
    // added user.id because villages that the user belong to
    args.query = ((): string => {
      let result: object = {};

      if (args.query) {
        let query_obj = JSON.parse(args.query);

        if (query_obj.AND) {
          query_obj.AND[0].users = { id: { in: [user.id] } };

          result = query_obj;
        }

        if (!query_obj.AND) {
          query_obj = {
            AND: [query_obj, { users: { id: { in: [user.id] } } }],
          };

          result = query_obj;
        }
      }

      if (!args.query) result = { users: { id: { in: [user.id] } } };

      return JSON.stringify(result);
    })();

    const result: Connection = await new Pagination(
      prisma.village
    ).getConnection(args);

    return result as VillageConnection;
  },

  ownVillages: async (
    user: User,
    args: UserVillagesArgs,
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

    const result: Connection = await new Pagination(
      prisma.village
    ).getConnection(args);

    return result as VillageConnection;
  },
};

const userResolvers: {
  Query: {
    users: QueryResolvers["users"];
    user: QueryResolvers["user"];
    me: QueryResolvers["me"];
  };
  Mutation: {
    createUser: MutationResolvers["createUser"];
    editUser: MutationResolvers["editUser"];
    deleteUser: MutationResolvers["deleteUser"];
  };
  User: UserResolvers;
} = {
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
