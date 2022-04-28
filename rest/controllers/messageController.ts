import { Response } from "express";
import { Message, Prisma, User } from "@prisma/client";
import { prismaClient } from "../../lib/prismaClient";
import {
  CustomRequest,
  QArgs,
  QArgsAndPage,
  ResponseHeader,
} from "../../types/rest.types";
import { ioChatSocket, EV_CHAT_SOCKET } from "../../sockets/chatSocket";
import {
  genErrorObj,
  genLinksHeader,
  genQArgsAndPage,
  genResponseHeader,
  isMine,
  isVillager,
  parseFields,
  sendError,
} from "../../lib/utilities";
import { PARAMS } from "../../consts/url";
import { CustomError } from "../../classes/CustomError";

export const messageId: string = "messageId";

async function getMessages(req: CustomRequest, res: Response): Promise<void> {
  const { args, page }: QArgsAndPage<Prisma.MessageFindManyArgs> =
    genQArgsAndPage(req.query);

  try {
    const messages: Message[] = await prismaClient.message.findMany(args);

    // total count of message
    const count: number = await prismaClient.message.count({
      where: args.where,
    });

    // generate info of  the result
    const header: ResponseHeader = genResponseHeader(count, args.take);

    // generate pagination
    const links: ReturnType<typeof genLinksHeader> = genLinksHeader(
      page,
      header[PARAMS.X_TOTAL_PAGE_COUNT],
      req.url
    );

    res.status(200).set(header).links(links).json({ messages });
  } catch (e) {
    sendError(res, e);
  }
}

async function getMessageDetail(
  req: CustomRequest,
  res: Response
): Promise<void> {
  // get message id from params
  const id: string = req.params.messageId;

  // the fields used to select of query
  const select: QArgs["select"] = parseFields(req.query.fields);

  try {
    // get model of message from DB
    const message: Partial<Message> | null =
      await prismaClient.message.findUnique({
        where: { id },
        select,
      });

    // throw an error if the message is null
    if (message === null) {
      res.status(404).json(genErrorObj(404, "couldn't find the message"));
      return;
    }

    // response the message
    res.status(200).json({ message });
  } catch (e) {
    sendError(res, e);
  }
}

async function getMessageUser(req: CustomRequest, res: Response) {
  // the type for query argument
  const select: QArgs["select"] = parseFields(req.query.fields);

  try {
    // extract a user of the message
    const user: { userId: string | null } | null =
      await prismaClient.message.findUnique({
        where: { id: req.params[messageId] },
        select: { userId: true },
      });

    if (!user) throw new CustomError(400, "Not found the message");

    if (!user.userId) {
      res.status(200).json({ user: null });
      return;
    }

    const the_user: Partial<User> | null = await prismaClient.user.findUnique({
      where: { id: user.userId },
      select,
    });

    if (!the_user) {
      res.status(200).json({ user: null });
      return;
    }

    // response
    res.status(200).json({ user: the_user });

    return;
  } catch (e) {
    sendError(res, e);
  }
}

async function getMessageVillage(req: CustomRequest, res: Response) {
  // the type for query argument
  const select: QArgs["select"] = parseFields(req.query.fields);

  try {
    // extract a user of the message
    const village: { villageId: string | null } | null =
      await prismaClient.message.findUnique({
        where: { id: req.params[messageId] },
        select: { villageId: true },
      });

    if (!village) throw new CustomError(400, "Not found the message");

    if (!village.villageId) {
      res.status(200).json({ village: null });
      return;
    }

    const the_village: Partial<User> | null =
      await prismaClient.village.findUnique({
        where: { id: village.villageId },
        select,
      });

    if (!the_village) {
      res.status(200).json({ village: null });
      return;
    }

    // response
    res.status(200).json({ village: the_village });

    return;
  } catch (e) {
    sendError(res, e);
  }
}

async function createMessage(req: CustomRequest, res: Response): Promise<void> {
  try {
    if (!req.currentUser)
      throw new CustomError(500, "request current user is not found");

    // get data from request body
    const { content, villageId }: Prisma.MessageCreateManyInput = req.body;

    // the fields used to select of query
    const select: QArgs["select"] = parseFields(req.query.fields);

    // throw error if the currentUser is not a member
    if (!isVillager(req.currentUser, { id: villageId }))
      throw new CustomError(
        400,
        "the currentUser is not a member of the village"
      );

    // insert the message to DB
    const message: Partial<Message> = await prismaClient.message.create({
      data: { content, userId: req.currentUser?.id, villageId },
      select,
    });

    // send message in the village as room
    ioChatSocket.sockets
      .in(villageId)
      .emit(EV_CHAT_SOCKET.MESSAGE, { message });

    // response created the message
    res.status(200).json({ message });

    return;
  } catch (e) {
    sendError(res, e);
  }
}

async function editMessage(req: CustomRequest, res: Response): Promise<void> {
  try {
    if (!req.currentUser)
      throw new CustomError(500, "request current user is not found");

    // get message id from params
    const id: string = req.params.messageId;

    // the fields used to select of query
    const select: QArgs["select"] = parseFields(req.query.fields);

    // confirm the user has the message id
    const isOwner = isMine(req.currentUser, { id });

    // throw an error if the user has not message id
    if (!req.currentUser.isAdmin && !isOwner)
      throw new CustomError(403, "the user is not owner of the message");

    // get a content from request body
    const { content } = req.body;

    // get message model by the message id
    const message: Partial<Message> = await prismaClient.message.update({
      where: { id },
      data: { content },
      select,
    });

    // response updated the message
    res.status(200).json({ message });

    return;
  } catch (e) {
    sendError(res, e);
  }
}

async function deleteMessage(req: CustomRequest, res: Response): Promise<void> {
  try {
    if (!req.currentUser)
      throw new CustomError(500, "request current user is not found");

    // get message id from params
    const id: string = req.params.messageId;

    // confirm the user has the message id
    const isOwner = isMine(req.currentUser, { id });

    // throw an error if the user has not message id
    if (!req.currentUser.isAdmin && !isOwner)
      throw new CustomError(403, "the user is not owner of the message");

    // delete the message
    const message: Message | null = await prismaClient.message.delete({
      where: { id },
    });

    // response deleted the message
    res.status(200).json({ message });

    return;
  } catch (e) {
    sendError(res, e);
  }
}

const messageController = {
  messageId,
  getMessages,
  getMessageDetail,
  getMessageUser,
  getMessageVillage,
  createMessage,
  editMessage,
  deleteMessage,
};

export default messageController;
