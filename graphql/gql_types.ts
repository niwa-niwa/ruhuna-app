import { PClient } from "../lib/prismaClient";
import { User, Message, Village } from "@prisma/client";

export type UserIncludeRelations = User & {
  messages: Message[];
  villages: Village[];
};

export type TContext = {
  prisma: PClient;
  currentUser: UserIncludeRelations;
};
