import { Request } from "express";
import { Message, User, Village } from "@prisma/client";

export type CustomRequest = Request & {
  currentUser?: User & { 
    villages: Village[] 
    messages: Message[]
  };
};

export type ErrorObject = {
  code:number
  message:string
}

export type ResponseHeader = {
  "X-Total-Count"?:number
  "X-TotalPages-Count"?:number
  "X-Current-Page"?:number
}