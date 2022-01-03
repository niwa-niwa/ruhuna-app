import { Request } from "express";
import { Message, User, Village } from "@prisma/client";

export type CustomRequest = Request & {
  currentUser?: User & { 
    villages: Village[] 
    messages: Message[]
  };
};
