import { PClient } from "../lib/prismaClient";
import { UserIncludeRelations } from "./prisma.types";

export type TContext = {
  prisma: PClient;
  currentUser: UserIncludeRelations;
};
