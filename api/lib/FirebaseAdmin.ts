import FirebaseAdmin from "firebase-admin";
import { readFileSync } from "fs";
import { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";
import { ErrorObj } from "../types/ErrorObj";
import { generateErrorObj } from "./generateErrorObj";

const serviceAccount = JSON.parse(
  readFileSync("./ruhuna-dev-firebase-adminsdk-zq7q5-af265266fa.json", "utf-8")
);

FirebaseAdmin.initializeApp({
  credential: FirebaseAdmin.credential.cert(serviceAccount),
});

export { FirebaseAdmin };

export const FirebaseAuth = FirebaseAdmin.auth();

export async function verifyToken(
  token: string
): Promise<DecodedIdToken | ErrorObj> {
  try {
    const currentUser: DecodedIdToken = await FirebaseAuth.verifyIdToken(token);

    return currentUser;
  } catch (e) {
    console.error(e);

    return generateErrorObj(400, "ID token has invalid signature");
  }
}
