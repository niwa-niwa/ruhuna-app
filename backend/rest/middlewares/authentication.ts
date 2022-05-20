import { CurrentUser, CustomRequest } from "..";
import { ErrorObject } from "../../lib/utilities";
import { Response, NextFunction } from "express";
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
  if (!req.currentUser) {
    const currentUser: CurrentUser | ErrorObject = await validateToken(
      req.header("Authorization")
    );

    // send an error if token were invalided
    if ("code" in currentUser) {
      res.status(currentUser.code).json(currentUser);
      return;
    }

    req.currentUser = currentUser;
  }

  return next();
}
