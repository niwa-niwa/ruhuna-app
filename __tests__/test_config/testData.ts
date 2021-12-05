import { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";

export const tokens: {
  firebase_user: string;
  auth_user: string;
} = {
  firebase_user: "token_firebase_user",
  auth_user: "token_auth_user",
};

export const firebase_user: DecodedIdToken = {
  name: "fire user A",
  picture: "https://lh3.googleusercontent.com/a-/A",
  iss: "https://securetoken.google.com/ruhuna-dev",
  aud: "ruhuna-dev",
  auth_time: 1636553085,
  user_id: "this_is_a_firebase_user_id",
  sub: "this_is_a_firebase_user_id",
  iat: 1637600494,
  exp: 1637604094,
  email: "fireusera@example.com",
  email_verified: true,
  firebase: {
    identities: {
      "google.com": ["102752955248904445131"],
      email: ["fireusera@example.com"],
    },
    sign_in_provider: "google.com",
  },
  uid: "this_is_a_firebase_user_id",
};

export const auth_user: DecodedIdToken = {
  name: "User_A",
  picture: "https://lh3.googleusercontent.com/a-/A",
  iss: "https://securetoken.google.com/ruhuna-dev",
  aud: "ruhuna-dev",
  auth_time: 1636553085,
  user_id: "firebaseId_A",
  sub: "firebaseId_A",
  iat: 1637600494,
  exp: 1637604094,
  email: "authUsera@example.com",
  email_verified: true,
  firebase: {
    identities: {
      "google.com": ["102752955248904445131"],
      email: ["fireusera@example.com"],
    },
    sign_in_provider: "google.com",
  },
  uid: "firebaseId_A",
};
