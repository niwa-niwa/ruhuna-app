import { Request } from "express";
import { Message, User, Village } from "@prisma/client";

export type CustomRequest = Request & {
  currentUser?: User & {
    villages: Village[];
    messages: Message[];
  };
};

export type ErrorObject = {
  code: number;
  message: string;
};

export type ResponseHeader = {
  "x-total-count": number;
  "x-total-page-count": number;
};
