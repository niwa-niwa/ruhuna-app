import { CustomRequest } from "../../types/rest.types";
import { Response, NextFunction } from "express";
import { genErrorObj } from "../../lib/utilities";
import { validateToken } from "./validateToken";

export async function authorizeUser(
  req: CustomRequest,
  res: Response,
  next: NextFunction
) {
  let currentUser = req.currentUser;

  if (!currentUser) {
    const user = await validateToken(req.header("Authorization"));

    // send an error if token were invalided
    if ("code" in user) {
      res.status(user.code).json(user);
      return;
    }

    currentUser = user;
  }

  // send an error if currentUser were not admin
  if (!currentUser.isAdmin) {
    res.status(403).json(genErrorObj(403, "You are not allowed the request"));
  }

  next();
}
