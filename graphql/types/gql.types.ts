import { Message, User, Village } from "@prisma/client";
import { PClient } from "../../lib/prismaClient";

export type UserIncludeRelations = User & {
  messages?: Message[];
  villages?: Village[];
};

export type CContext = {
  prisma: PClient;
  currentUser: UserIncludeRelations;
};
