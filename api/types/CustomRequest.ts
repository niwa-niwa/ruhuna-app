import { Request } from "express";
import { User, Village } from "@prisma/client";

export type CustomRequest = Request & {
  currentUser?: User & { 
    villages: Village[] 
  };
};
