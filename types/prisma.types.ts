import { PClient } from './../lib/prismaClient';
import { User, Message, Village } from "@prisma/client";

export type { PClient }

export type UserIncludeRelations = User & {
  messages: Message[];
  villages: Village[];
};

