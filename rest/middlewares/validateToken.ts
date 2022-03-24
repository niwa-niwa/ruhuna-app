import { CustomRequest, ErrorObject } from "../../types/rest.types";
import { Response, NextFunction } from "express";
import { prismaClient } from "../../lib/prismaClient";
import { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";
import { Message, User, Village } from "@prisma/client";
import { verifyToken } from "../../lib/firebaseAdmin";
import { genErrorObj } from "../../lib/utilities";

/**
 * validate firebase token
 * @param req
 * @param res
 * @param next
 * @returns
 */
export async function validateToken(
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  // get token from request header
  const idToken: string | undefined = req.header("Authorization");

  // throw the error if headers didn't have a idToken and end
  if (!idToken) {
    const error = genErrorObj(400, "Headers has not token");
    res.status(error.code).json(error);
    return;
  }

  // verify token
  const firebaseUser: DecodedIdToken | ErrorObject = await verifyToken(
    idToken.replace("Bearer ", "")
  );

  // throw an error if token is invalid and end
  if ("code" in firebaseUser) {
    res.status(firebaseUser.code).json(firebaseUser);
    return;
  }

  // get User model based on firebase id
  let currentUser:
    | (User & { villages: Village[]; messages: Message[] })
    | null = await prismaClient.user.findUnique({
    where: { firebaseId: firebaseUser.uid },
    include: { villages: true, messages: true },
  });

  // currentUser were not found in DB, created a user with firebase token
  if (!currentUser) {
    currentUser = await prismaClient.user.create({
      data: {
        firebaseId: firebaseUser.uid,
        username: firebaseUser.email || "no name",
      },
      include: { villages: true, messages: true },
    });
  }

  // put the currentUser in req
  req.currentUser = currentUser;

  return next();
}
