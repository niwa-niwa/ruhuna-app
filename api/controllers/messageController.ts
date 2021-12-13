import { Response } from "express";
import { Message, prisma, Prisma, Village } from "@prisma/client";
import { prismaClient } from "../lib/prismaClient";
import { CustomRequest } from "../types/CustomRequest";
import { generateErrorObj } from "../lib/generateErrorObj";

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
  const { content, userId, villageId }: Prisma.MessageCreateManyInput =
    req.body;

  try {
    const message: Message = await prismaClient.message.create({
      data: { content, userId, villageId },
      include: { user: true, village: true },
    });

    res.status(200).json({ message });
  } catch (e) {
    console.error(e);

    res.status(400).json({
      message: null,
      errorObj: generateErrorObj(400, "Couldn't create the message"),
    });
  }
};

export const editMessage = async (req: CustomRequest, res: Response) => {
  const id: string = req.params.messageId;
  const { content } = req.body;

  const message: Message = await prismaClient.message.update({
    where: { id },
    data: { content },
    include: { user: true, village: true },
  });
  res.status(200).json({ message });
};

export const deleteMessage = async (req: CustomRequest, res: Response) => {
  res.status(200).json("from deleteMessage");
};

const messageController = {
  getMessages,
  getMessageDetail,
  createMessage,
  editMessage,
  deleteMessage,
};

export default messageController;
