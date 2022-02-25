import { Request } from "express";
import { AuthenticationError } from "apollo-server-express";
import { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";
import { verifyToken } from "../../lib/firebaseAdmin";
import { ErrorObj } from "../../api/types/ErrorObj";
import { prismaClient } from "../../lib/prismaClient";
import { UserIncludeRelations } from "../gql_types";

export async function authentication(
  req: Request
): Promise<UserIncludeRelations> {
  // get token from request header
  const idToken: string | undefined = req.header("Authorization");

  // if headers had not a token
  if (!idToken) throw new AuthenticationError("You are wrong.");

  // verify token
  const firebaseUser: DecodedIdToken | ErrorObj = await verifyToken(
    idToken.replace("Bearer ", "")
  );

  // if the token is fraud
  if ("errorCode" in firebaseUser)
    throw new AuthenticationError("You are wrong.");

  // get user
  const currentUser: UserIncludeRelations | null =
    await prismaClient.user.findUnique({
      where: { firebaseId: firebaseUser.uid },
      include: { villages: true, messages: true },
    });

  // if it had not a user
  if (!currentUser) throw new AuthenticationError("You are wrong.");

  return currentUser;
}
