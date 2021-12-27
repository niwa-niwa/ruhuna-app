import { CustomRequest } from "../types/CustomRequest";
import { Response, NextFunction } from "express";
import { prismaClient } from "../../lib/prismaClient";
import { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";
import { Message, User, Village } from "@prisma/client";
import { ErrorObj } from "../types/ErrorObj";
import { generateErrorObj } from "../../lib/generateErrorObj";
import { verifyToken } from "../../lib/firebaseAdmin";

/**
 * validate firebase token
 * @param req 
 * @param res 
 * @param next 
 * @returns 
 */
export const validateToken = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  // get token from request header
  const idToken: string | undefined = req.header("Authorization");

  // throw the error if headers didn't have a idToken and end
  if (!idToken) {
    res
      .status(400)
      .json({ errorObj: generateErrorObj(400, "Headers has not token") });
    return;
  }

  // verify token
  const firebaseUser: DecodedIdToken | ErrorObj = await verifyToken(
    idToken.replace("Bearer ", "")
  );

  // throw an error if token is invalid and end
  if ("errorCode" in firebaseUser) {
    res
      .status(firebaseUser.errorCode)
      .json({ currentUser: null, errorObj: firebaseUser });
    return;
  }

  // get User model based on firebase id
  const currentUser: (User & { villages: Village[], messages:Message[] }) | null =
    await prismaClient.user.findUnique({
      where: { firebaseId: firebaseUser.uid },
      include: { villages: true, messages:true },
    });

  // throw an error if currentUser is nothing and end
  if (!currentUser) {
    // if it couldn't find a user who has the firebaseId, it would response error
    res.status(404).json({
      currentUser: null,
      errorObj: generateErrorObj(404, "The user by token is not found"),
    });
    return;
  }

  // put the currentUser in req
  req.currentUser = currentUser;

  return next();
};
