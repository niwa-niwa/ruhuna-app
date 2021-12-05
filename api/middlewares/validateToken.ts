import { CustomRequest } from "../types/CustomRequest";
import { Response, NextFunction } from "express";
import { prismaClient } from "../lib/Prisma";
import { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";
import { User } from "@prisma/client";
import { ErrorObj } from "../types/ErrorObj";
import { generateErrorObj } from "../lib/generateErrorObj";
import { verifyToken } from "../lib/FirebaseAdmin";

export const validateToken = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const idToken: string | undefined = req.header("Authorization");

  if (!idToken) {
    // if headers didn't have a idToken, it response error
    res
      .status(400)
      .json({ errorObj: generateErrorObj(400, "Headers has not token") });
    return;
  }

  const firebaseUser: DecodedIdToken | ErrorObj = await verifyToken(
    idToken.replace("Bearer ", "")
  );

  if ("errorCode" in firebaseUser) {
    // if firebase API didn't response a user, it would response error.  firebaseUser has an errorObj
    res
      .status(firebaseUser.errorCode)
      .json({ currentUser: null, errorObj: firebaseUser });
    return;
  }

  const currentUser: User | null = await prismaClient.user.findUnique({
    where: { firebaseId: firebaseUser.uid },
  });

  if (!currentUser) {
    // if it couldn't find a user who has the firebaseId, it would response error
    res.status(404).json({
      currentUser: null,
      errorObj: generateErrorObj(404, "The user by token is not found"),
    });
    return;
  }

  req.currentUser = currentUser;

  return next();
};
