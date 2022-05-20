import { CurrentUser } from "..";
import { prismaClient } from "../../lib/prismaClient";
import { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";
import { verifyToken } from "../../lib/firebaseAdmin";
import { genErrorObj, ErrorObject } from "../../lib/utilities";

export async function validateToken(
  idToken: string | undefined
): Promise<CurrentUser | ErrorObject> {
  // return error if headers does not have token
  if (!idToken) return genErrorObj(400, "Headers has not token");

  // verify token
  const firebaseUser: DecodedIdToken | ErrorObject = await verifyToken(
    idToken.replace("Bearer ", "")
  );

  // return an error if token is invalided
  if (!("uid" in firebaseUser)) {
    return firebaseUser;
  }

  try {
    // get User model based on firebase id
    let currentUser: CurrentUser | null = await prismaClient.user.findUnique({
      where: { firebaseId: firebaseUser.uid },
      include: {
        messages: { select: { id: true } },
        villages: { select: { id: true } },
        ownVillages: { select: { id: true } },
      },
    });

    // currentUser were not found, created a user with firebase token
    if (!currentUser) {
      currentUser = await prismaClient.user.create({
        data: {
          firebaseId: firebaseUser.uid,
          username: firebaseUser.name || "no name",
        },
        include: {
          messages: { select: { id: true } },
          villages: { select: { id: true } },
          ownVillages: { select: { id: true } },
        },
      });
    }

    return currentUser;
  } catch (e) {
    return genErrorObj(500, "Internal Server Error");
  }
}
