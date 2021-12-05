import { Response } from "express";
import { Prisma, Village } from "@prisma/client";
import { prismaClient } from "../lib/Prisma";
import { CustomRequest } from "../types/CustomRequest";
import { generateErrorObj } from "../lib/generateErrorObj";

export const getMessages = async (req: CustomRequest, res: Response) => {
  res.status(200).json("from getMessage");
};

export const getMessageDetail = async (req: CustomRequest, res: Response) => {
  res.status(200).json("from getMessageDetail");
};

export const createMessage = async (req: CustomRequest, res: Response) => {
  res.status(200).json("from createMessage");
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
