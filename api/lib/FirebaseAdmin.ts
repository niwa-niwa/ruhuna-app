import FirebaseAdmin from "firebase-admin";
import { readFileSync, existsSync } from "fs";
import { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";
import { ErrorObj } from "../types/ErrorObj";
import { generateErrorObj } from "./generateErrorObj";

let serviceAccount: object = {};

/**
 *  it try to read firebase admin file
 */
if (existsSync(process.env.FIREBASE_ADMIN_FILE_PATH || "")) {
  try {
    serviceAccount = JSON.parse(
      readFileSync(process.env.FIREBASE_ADMIN_FILE_PATH || "", "utf-8")
    );
  } catch (e) {
    console.error(e);
  }
} else {
  console.log("Firebase Admin file is nothing");
}

/**
 *  if firebase admin file ware nothing, it would read env variables
 */
if (!Object.keys(serviceAccount).length) {
  serviceAccount = {
    type: process.env.FIREBASE_TYPE,
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY,
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: process.env.FIREBASE_AUTH_URI,
    token_uri: process.env.FIREBASE_TOKEN_URI,
    auth_provider_x509_cert_url:
      process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
  };
}

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
