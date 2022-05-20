import { CurrentUser, CustomRequest } from "../";
import { ErrorObject } from "../../lib/utilities";
import { Response, NextFunction } from "express";
import { genErrorObj } from "../../lib/utilities";
import { validateToken } from "./validateToken";

export async function authorization(
  req: CustomRequest,
  res: Response,
  next: NextFunction
) {
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

  // send an error if currentUser were not admin
  if (!req.currentUser.isAdmin) {
    res.status(403).json(genErrorObj(403, "You are not allowed the request"));
    return;
  }

  next();
}
