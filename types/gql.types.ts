import { PClient } from "../lib/prismaClient";
import { UserIncludeRelations } from "./prisma.types";

export type CContext = {
  prisma: PClient;
  currentUser: UserIncludeRelations;
};
