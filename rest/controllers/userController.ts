import { Request, Response } from "express";
import { verifyToken } from "../../lib/firebaseAdmin";
import { Message, Prisma, User } from "@prisma/client";
import { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";
import { prismaClient } from "../../lib/prismaClient";
import { generateErrorObj } from "../../lib/generateErrorObj";
import { ErrorObj } from "../../types/error.types";
import { CustomRequest, ResponseHeader, QArgs, QArgsAndPage } from "../../types/rest.types";
import {
  genErrorObj,
  sendError,
  parseFields,
  genResponseHeader,
  genLinksHeader,
  genQArgsAndPage,
} from "../../lib/utilities";
import { params } from "../../consts/params";

/**
 * Get user profile detail
 * @param req
 * @param res
 */
async function getUserDetail(req: CustomRequest, res: Response): Promise<void> {
  const id: string = req.params.userId;

  // the fields used to select of query
  const fields: QArgs["select"] = parseFields(req.query.fields);

  // get model of the user by user id
  try {
    const user: Partial<User> | null | void =
      await prismaClient.user.findUnique({
        where: { id },
        select: fields,
      });

    // throw an error if user is null
    if (!user) {
      res.status(404).json(genErrorObj(404, "The user is not found."));
      return;
    }

    // response the user
    res.status(200).json({ user });
  } catch (e) {
    sendError(res, e);
  }
}

async function getUserMessages(req: Request, res: Response): Promise<void> {
  // the type for query argument
  const { args, page }: QArgsAndPage<Prisma.MessageFindManyArgs> =
    genQArgsAndPage(req.query);

  // the userId is searched to extract messages
  const userId: User["id"] = req.params.userId;

  args.where = { userId };

  try {
    // extract messages
    const messages: Partial<Message>[] = await prismaClient.message.findMany(
      args
    );

    // extract total records
    const count: number = await prismaClient.message.count({
      where: { userId },
    });

    // generate info of  the result
    const header: ResponseHeader = genResponseHeader(count, args.take);

    // generate pagination
    const links: ReturnType<typeof genLinksHeader> = genLinksHeader(
      page,
      header["x-total-page-count"],
      req.url
    );

    // response
    res.status(200).set(header).links(links).json({ messages });
  } catch (e) {
    sendError(res, e);
  }
}

/**
 * Get all users
 * @param req
 * @param res
 */
async function getUsers(req: Request, res: Response): Promise<void> {
  // generate args for query and page
  const { args, page }: QArgsAndPage<Prisma.UserFindManyArgs> =
    genQArgsAndPage(req.query);

  try {
    // get all users
    const users: Partial<User>[] = await prismaClient.user.findMany(args);

    // total count of users
    const count: number = await prismaClient.user.count();

    // generate info of  the result
    const header: ResponseHeader = genResponseHeader(count, args.take);

    // generate pagination
    const links: ReturnType<typeof genLinksHeader> = genLinksHeader(
      page,
      header["x-total-page-count"],
      req.url
    );

    // response all user data
    res.status(200).json({ users: users });
  } catch (e) {
    sendError(res, e);
  }
}

/**
 * Create user with firebase token
 * @param req
 * @param res
 */
async function createUser(req: Request, res: Response): Promise<void> {
  // get firebase token from body
  const firebaseToken: string = req.body.firebaseToken;

  try {
    // get firebase user from firebase
    const currentUser: DecodedIdToken | ErrorObj = await verifyToken(
      firebaseToken
    );

    // throw an error if currentUser has an errorCode property
    if ("errorCode" in currentUser) {
      // if the token were not authorized, it response error
      res.status(currentUser.errorCode).json({
        user: null,
        errorObj: currentUser,
      });
      return;
    }

    if ("uid" in currentUser) {
      // create user
      const createdUser: User = await prismaClient.user.create({
        data: {
          firebaseId: currentUser.uid,
          username: currentUser.name,
        },
      });

      // response created user data
      res.status(200).json({ user: createdUser });

      return;
    }
  } catch (e) {
    console.error(e);

    res
      .status(404)
      .json({ errorObj: generateErrorObj(404, "Couldn't create a user") });
  }
}

/**
 * edit a user with currentUser.id who sent request
 * @param req
 * @param res
 */
async function editUser(req: CustomRequest, res: Response): Promise<void> {
  const currentUser: CustomRequest["currentUser"] = req.currentUser!;

  const id: Prisma.UserWhereUniqueInput["id"] = req.params.userId;
  const data: Prisma.UserUpdateInput = req.body;

  // if the user who sent request is not admin, it would confirm params.userId
  if (!currentUser.isAdmin || id !== currentUser.id) {
    const error = {
      code: 403,
      message: "Not allowed to edit the user",
    };
    console.error(error);
    res.status(403).json(error);
    return;
  }

  const editedUser: User | void = await prismaClient.user
    .update({
      where: { id },
      data,
    })
    .catch((e) => {
      console.error(e);
      res.status(404).json({
        user: null,
        errorObj: generateErrorObj(404, "The User is not Found"),
      });
    });

  if (!editUser) {
    const error = {
      code: 404,
      message: "the user is not found",
    };
    console.error(error);
    res.status(404).json(error);
    return;
  }

  const header: ResponseHeader = {
    "x-total-count": 1,
    "x-total-page-count": 1,
  };

  res
    .status(200)
    .set(header)
    .links({ next: "http://niwacan.com", prev: "http://niwacan.com/1" })
    .json({ user: editedUser });
}

/**
 * delete a user with currentUser.id who sent request
 * @param req
 * @param res
 */
async function deleteUser(req: CustomRequest, res: Response): Promise<void> {
  try {
    let id: string | undefined = req.currentUser?.id;

    // if the user who sent request is admin it would confirm params.userId
    if (req.currentUser?.isAdmin) {
      id = req.params.userId || req.currentUser?.id;
    }

    const deletedUser: User = await prismaClient.user.delete({
      where: { id },
    });

    res.status(200).json({ user: deletedUser });

    return;
  } catch (e) {
    console.error(e);
    res.status(404).json({
      user: null,
      errorObj: generateErrorObj(404, "the user is not found"),
    });
  }
}

const userController: {
  getUsers: any;
  getUserDetail: any;
  getUserMessages: any;
  createUser: any;
  editUser: any;
  deleteUser: any;
} = {
  getUsers,
  getUserDetail,
  getUserMessages,
  createUser,
  editUser,
  deleteUser,
};

export default userController;
