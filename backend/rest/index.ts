import express, { Express, Request } from "express";
import { router } from "./routers/router";
import { PATH } from "../../consts/url";
import { Message, User, Village } from "@prisma/client";

export type CurrentUser = User & {
  messages: { id: Message["id"] }[];
  villages: { id: Village["id"] }[];
  ownVillages: { id: Village["id"] }[];
};

export type CustomRequest = Request & {
  currentUser?: CurrentUser;
};

const api: Express = express();

api.use(PATH.REST, router);

export { api };
