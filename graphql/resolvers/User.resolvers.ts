import { prismaClient } from "./../../lib/prismaClient";
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
} from "../../types/types.d";
import {
  QueryResolvers,
  MutationResolvers,
  UserResolvers,
  UserConnection,
  QueryUsersArgs,
  QueryUserArgs,
} from "../../types/resolvers-types.d";
import { Pagination } from "../lib/classes/Pagination";
import { ErrorObject } from "../../types/rest.types";

async function users(
  parent: any,
  { after, before, first, last, query, reverse, sortKey }: QueryUsersArgs,
  { prisma, currentUser }: CContext,
  info: any
): Promise<UserConnection> {
  const result: Connection = await new Pagination(
    prismaClient.user
  ).getConnection({
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
    const result = await new Pagination(prismaClient.message).getConnection({});
    // console.log("message = ", result);
// TODO implement get message that the user has
    return result as MessageConnection;
  },

  villages: async (
    user: any,
    args: any,
    { prisma, currentUser }: CContext
  ): Promise<VillageConnection> => {
    console.log('user = ',user)
    console.log('args = ',args)

    args.query = (()=>{
      if(args.query){

        if(args.query.AND){}

        let q = JSON.parse(args.query)
        q = {AND:[q, {userId:user.id}]}
        
        return JSON.stringify(q)
      }
      return JSON.stringify({userId:user.id})
    })();
    console.log(args)

    const result = await new Pagination(prismaClient.village).getConnection(args);
    // console.log("village = ", result);
// TODO implement get villages that the user belong to 
    return result as VillageConnection;
  },
}

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
