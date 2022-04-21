import { CContext } from "./../../types/gql.types";
import { Request } from "express";
import { AuthenticationError } from "apollo-server-express";
import { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";
import { verifyToken } from "../../lib/firebaseAdmin";
import { prismaClient } from "../../lib/prismaClient";
import { ErrorObject } from "../../types/rest.types";

export async function authentication(
  req: Request
): Promise<CContext["currentUser"]> {
  // get token from request header
  const idToken: string | undefined = req.header("Authorization");

  // if headers had not a token
  if (!idToken) throw new AuthenticationError("You are wrong.");

  // verify token
  const firebaseUser: DecodedIdToken | ErrorObject = await verifyToken(
    idToken.replace("Bearer ", "")
  );

  // if the token is fraud
  if ("code" in firebaseUser)
    throw new AuthenticationError("You are wrong.");

  // get user
  const currentUser: CContext["currentUser"] | null =
    await prismaClient.user.findUnique({
      where: { firebaseId: firebaseUser.uid },
      include: { villages: true, messages: true },
    });

  // create a user with firebase token
  if (!currentUser) throw new AuthenticationError("You are wrong.");

  return currentUser;
}
