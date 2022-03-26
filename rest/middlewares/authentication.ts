import { CustomRequest, ErrorObject } from "../../types/rest.types";
import { Response, NextFunction } from "express";
import { Message, User, Village } from "@prisma/client";
import { validateToken } from "./validateToken";

/**
 * validate firebase token
 * @param req
 * @param res
 * @param next
 * @returns
 */
export async function authentication(
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  const user:
    | (User & { villages: Village[]; messages: Message[] })
    | ErrorObject = await validateToken(req.header("Authorization"));

  // send an error if token were invalided
  if ("code" in user) {
    res.status(user.code).json(user);
    return;
  }

  req.currentUser = user;

  return next();
}
