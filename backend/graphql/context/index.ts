import { CContext } from "../types/gql.types";
import { Request } from "express";
import { prismaClient } from "../../../backend/lib/prismaClient";
import { authentication } from "../middlewares/authentication";

export const context = async ({ req }: { req: Request }): Promise<CContext> => {
  const currentUser: CContext["currentUser"] = await authentication(req);
  return {
    prisma: prismaClient,
    currentUser: currentUser,
  };
};
