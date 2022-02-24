import { PClient } from "./../lib/prismaClient";
import { User } from "@prisma/client";

export type TContext = {
  prisma: PClient;
  currentUser: User;
};
