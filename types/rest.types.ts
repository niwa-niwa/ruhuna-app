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

export type QArgs = {
  select?: { [key: string]: boolean } | undefined;
  orderBy?: { [key: string]: string }[] | undefined;
  take?: number | undefined;
  skip?: number | undefined;
};

export type QArgsAndPage<T> = {
  args:T
  page:number
}