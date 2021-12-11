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
  res.status(200).json("from getMessageDetail");
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
  }
};

export const editMessage = async (req: CustomRequest, res: Response) => {
  res.status(200).json("from editMessage");
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
