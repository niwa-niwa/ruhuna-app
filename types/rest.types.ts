import { Request } from "express";
import { Message, User, Village } from "@prisma/client";

export type CurrentUser = User & {
  messages: { id: Message["id"] }[];
  villages: { id: Village["id"] }[];
  ownVillages: { id: Village["id"] }[];
};

export type CustomRequest = Request & {
  currentUser?: CurrentUser;
};

export type ErrorObject = {
  code: number;
  message: string;
};

export type ResponseHeader = { [key: string]: number };

export type QArgs = {
  select?: { [key: string]: boolean } | undefined;
  orderBy?: { [key: string]: string }[] | undefined;
  take?: number | undefined;
  skip?: number | undefined;
};

export type QArgsAndPage<T> = {
  args: T;
  page: number;
};
