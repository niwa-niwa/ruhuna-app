import { villages } from './../../prisma/seeds';
import { Response } from "express";
import { Message, Prisma, Village } from "@prisma/client";
import { prismaClient } from "../../lib/prismaClient";
import { CustomRequest } from "../types/CustomRequest";
import { generateErrorObj } from "../../lib/generateErrorObj";
import { io } from "../../sockets";

export const getMessages = async (req: CustomRequest, res: Response) => {
  const messages: Message[] = await prismaClient.message.findMany({
    include: { user: true, village: true },
  });

  res.status(200).json({ messages });
};

export const getMessageDetail = async (req: CustomRequest, res: Response) => {
  const id: string = req.params.messageId;

  const message: Message | null = await prismaClient.message.findUnique({
    where: { id },
    include: { user: true, village: true },
  });

  if (message === null) {
    res.status(404).json({
      message: null,
      errorObj: generateErrorObj(404, "couldn't find the message"),
    });
    return;
  }
  res.status(200).json({ message });
};

export const createMessage = async (req: CustomRequest, res: Response) => {
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
    io.sockets.in(villageId).emit("message", { message });

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
};

export const editMessage = async (req: CustomRequest, res: Response) => {
  try {
    const id: string = req.params.messageId;
    const { content } = req.body;

    const message: Message = await prismaClient.message.update({
      where: { id },
      data: { content },
      include: { user: true, village: true },
    });

    res.status(200).json({ message });
  } catch (e) {
    console.error(e);

    res.status(404).json({
      message: null,
      errorObj: generateErrorObj(404, "Couldn't edit the message"),
    });
  }
};

export const deleteMessage = async (req: CustomRequest, res: Response) => {
  try {
    const id: string = req.params.messageId;

    const message: Message | null = await prismaClient.message.delete({
      where: { id },
    });

    res.status(200).json({ message });
  } catch (e) {
    console.error(e);

    res.status(404).json({
      message: null,
      errorObj: generateErrorObj(404, "the message is not found"),
    });
  }
};

const messageController = {
  getMessages,
  getMessageDetail,
  createMessage,
  editMessage,
  deleteMessage,
};

export default messageController;
