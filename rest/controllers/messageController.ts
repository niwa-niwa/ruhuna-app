import { Response } from "express";
import { Message, Prisma } from "@prisma/client";
import { prismaClient } from "../../lib/prismaClient";
import { CustomRequest, QArgs, QArgsAndPage, ResponseHeader } from "../../types/rest.types";
import { generateErrorObj } from "../../lib/generateErrorObj";
import { ioChatSocket, EV_CHAT_SOCKET } from "../../sockets/chatSocket";
import { genErrorObj, genLinksHeader, genQArgsAndPage, genResponseHeader, parseFields, sendError } from "../../lib/utilities";
import { PARAMS } from "../../consts/url";

export const messageId:string = "messageId";

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

async function getMessageUser(req: CustomRequest, res: Response) {}

async function getMessageVillage(req:CustomRequest, res:Response){}

async function createMessage(req: CustomRequest, res: Response): Promise<void> {
  try {
    // get data from request body
    const { content, villageId }: Prisma.MessageCreateManyInput = req.body;

    // confirm the user join the village
    const isMember = req.currentUser?.villages.find(
      (village) => village.id === villageId
    );

    // throw error if the currentUser is not a member
    if (!isMember)
      throw new Error("the currentUser is not a member of the village");

    // insert the message to DB
    const message: Message = await prismaClient.message.create({
      data: { content, userId: req.currentUser?.id, villageId },
      include: { user: true, village: true },
    });

    // send message in the village as room
    ioChatSocket.sockets
      .in(villageId)
      .emit(EV_CHAT_SOCKET.MESSAGE, { message });

    // response created the message
    res.status(200).json({ message });

    return;
  } catch (e) {
    console.error(e);

    res.status(400).json({
      message: null,
      errorObj: generateErrorObj(400, "Couldn't create the message"),
    });
  }
}

async function editMessage(req: CustomRequest, res: Response): Promise<void> {
  try {
    // get message id from params
    const id: string = req.params.messageId;

    // confirm the user has the message id
    const isOwner = req.currentUser?.messages.find(
      (message) => message.id === id
    );

    // throw an error if the user has not message id
    if (!req.currentUser?.isAdmin && !isOwner)
      throw new Error("the user is not owner of the message");

    // get a content from request body
    const { content } = req.body;

    // get message model by the message id
    const message: Message = await prismaClient.message.update({
      where: { id },
      data: { content },
      include: { user: true, village: true },
    });

    // response updated the message
    res.status(200).json({ message });

    return;
  } catch (e) {
    console.error(e);

    res.status(404).json({
      message: null,
      errorObj: generateErrorObj(404, "Couldn't edit the message"),
    });
  }
}

async function deleteMessage(req: CustomRequest, res: Response): Promise<void> {
  try {
    // get message id from params
    const id: string = req.params.messageId;

    // confirm the user has the message id
    let isOwner = req.currentUser?.messages.find(
      (message) => message.id === id
    );

    // throw an error if the user has not message id
    if (!req.currentUser?.isAdmin && !isOwner)
      throw new Error("the user is not owner of the message");

    // delete the message
    const message: Message | null = await prismaClient.message.delete({
      where: { id },
    });

    // response deleted the message
    res.status(200).json({ message });

    return;
  } catch (e) {
    console.error(e);

    res.status(404).json({
      message: null,
      errorObj: generateErrorObj(404, "the message is not found"),
    });
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
