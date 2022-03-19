import { Request, Response } from "express";
import { verifyToken } from "../../lib/firebaseAdmin";
import { Message, Prisma, User } from "@prisma/client";
import { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";
import { prismaClient } from "../../lib/prismaClient";
import { generateErrorObj } from "../../lib/generateErrorObj";
import { ErrorObj } from "../../types/error.types";
import { CustomRequest, ResponseHeader} from "../../types/rest.types";
import { getErrorObj, sendError, parseFields, parseSort, parseLimit, parseOffset, genResponseHeader, parsePage, genLinksHeader } from '../../lib/utilities'
import { off } from "process";

/**
 * Get user profile detail
 * @param req
 * @param res
 */
async function getUserDetail(req: CustomRequest, res: Response): Promise<void> {
  const id: string = req.params.userId;

  const fields: { [key: string]: boolean | {} } | undefined = parseFields(
    req.query.fields
  );

  // relations should have id
  // if (fields) {
  //   if ("villages" in fields) fields.villages = { select: { id: true } };
  //   if ("messages" in fields) fields.messages = { select: { id: true } };
  // }

  // get model of the user by user id
  try {
    const user: Partial<User> | null | void =
      await prismaClient.user.findUnique({
        where: { id },
        select: fields,
      });

    // throw an error if user is null
    if (!user) {
      res.status(404).json(getErrorObj(404, "The user is not found."));
      return;
    }

    // response the user
    res.status(200).json({ user });
  } catch (e) {
    sendError(res, e);
  }
}

async function getUserMessages(req: Request, res: Response): Promise<void> {
  console.log(req.url, req.query);

  let args: Prisma.MessageFindManyArgs = {};

  const userId: User["id"] = req.params.userId;

  args.where = { userId };

  args.select = parseFields(req.query.fields);

  args.orderBy = parseSort(req.query.sort);

  args.take = parseLimit(req.query.par_page);

  const page: number = args.take ? parsePage(req.query.page) : 1;

  args.skip = args.take ? args.take * (page - 1) : undefined;

  try {
    const messages: Partial<Message>[] = await prismaClient.message.findMany(
      args
    );

    const count: number = await prismaClient.message.count({
      where: { userId },
    });

    const header: ResponseHeader = genResponseHeader(count, args.take, page);

    const links: ReturnType<typeof genLinksHeader> = args.take
      ? genLinksHeader(req.query)
      : genLinksHeader();

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
  // get all users
  const users: User[] = await prismaClient.user.findMany();

  // response all user data
  res.status(200).json({ users: users });

  return;
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

  const header:ResponseHeader = {
    "X-Total-Count":1,
    "X-TotalPages-Count":1
  }

  res.status(200).set(header).links({next:"http://niwacan.com",prev:"http://niwacan.com/1"}).json({ user: editedUser });
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
