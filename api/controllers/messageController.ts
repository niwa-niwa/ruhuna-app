import { Response } from "express";
import { Message, Prisma, Village } from "@prisma/client";
import { prismaClient } from "../../lib/prismaClient";
import { CustomRequest } from "../types/CustomRequest";
import { generateErrorObj } from "../../lib/generateErrorObj";
import { ioChatSocket, EV_CHAT_SOCKET } from "../../sockets/chatSocket";

/**
 * Get all messages
 * @param req
 * @param res
 */
async function getMessages(req: CustomRequest, res: Response): Promise<void> {
  const messages: Message[] = await prismaClient.message.findMany({
    include: { user: true, village: true },
  });

  res.status(200).json({ messages });

  return;
}

/**
 * Get a message detail
 * @param req
 * @param res
 * @returns
 */
async function getMessageDetail(
  req: CustomRequest,
  res: Response
): Promise<void> {
  // get message id from params
  const id: string = req.params.messageId;

  // get model of message from DB
  const message: Message | null = await prismaClient.message.findUnique({
    where: { id },
    include: { user: true, village: true },
  });

  // throw an error if the message is null
  if (message === null) {
    res.status(404).json({
      message: null,
      errorObj: generateErrorObj(404, "couldn't find the message"),
    });
    return;
  }

  // response the message
  res.status(200).json({ message });

  return;
}

/**
 * Create a message
 * @param req
 * @param res
 * @returns
 */
async function createMessage(req: CustomRequest, res: Response): Promise<void> {
  try {
    // get data from request body
    const { content, villageId }: Prisma.MessageCreateManyInput = req.body;

    // confirm the user join the village
    const isMember = req.currentUser?.villages.find(
      (village: Village) => village.id === villageId
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

/**
 * Edit a message
 * @param req
 * @param res
 */
async function editMessage(req: CustomRequest, res: Response): Promise<void> {
  try {
    // get message id from params
    const id: string = req.params.messageId;

    // confirm the user has the message id
    const isOwner = req.currentUser?.messages.find(
      (message: Message) => message.id === id
    );

    // throw an error if the user has not message id
    if (!isOwner) throw new Error("the user is not owner of the message");

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

/**
 * Delete a message
 * @param req
 * @param res
 */
async function deleteMessage(req: CustomRequest, res: Response): Promise<void> {
  try {
    // get message id from params
    const id: string = req.params.messageId;

    // confirm the user has the message id
    const isOwner = req.currentUser?.messages.find(
      (message: Message) => message.id === id
    );

    // throw an error if the user has not message id
    if (!isOwner) throw new Error("the user is not owner of the message");

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

const messageController : {
  getMessages : any,
  getMessageDetail : any,
  createMessage : any,
  editMessage : any,
  deleteMessage : any,
} = {
  getMessages,
  getMessageDetail,
  createMessage,
  editMessage,
  deleteMessage,
};

export default messageController;
