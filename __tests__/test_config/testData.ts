import { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";
import { users } from "../../prisma/seeds";

export const tokens: {
  firebase_user: string;
  admin_user: string;
  general_user: string;
  anonymous_user: string;
  nonactive_user: string;
} = {
  firebase_user: "token_firebase_user",
  admin_user: "token_admin_user",
  general_user: "token_general_user",
  anonymous_user: "token_anonymous_user",
  nonactive_user: "token_nonactive_user",
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

export const admin_user: DecodedIdToken = {
  name: users[0].username,
  picture: "https://lh3.googleusercontent.com/a-/A",
  iss: "https://securetoken.google.com/ruhuna-dev",
  aud: "ruhuna-dev",
  auth_time: 1636553085,
  user_id: users[0].firebaseId,
  sub: users[0].firebaseId,
  iat: 1637600494,
  exp: 1637604094,
  email: `${users[0].firebaseId}@example.com`,
  email_verified: true,
  firebase: {
    identities: {
      "google.com": ["102752955248904445131"],
      email: [`${users[0].firebaseId}@example.com`],
    },
    sign_in_provider: "google.com",
  },
  uid: users[0].firebaseId,
};

export const general_user: DecodedIdToken = {
  name: users[1].username,
  picture: "https://lh3.googleusercontent.com/a-/A",
  iss: "https://securetoken.google.com/ruhuna-dev",
  aud: "ruhuna-dev",
  auth_time: 1636553085,
  user_id: users[1].firebaseId,
  sub: users[1].firebaseId,
  iat: 1637600494,
  exp: 1637604094,
  email: `${users[1].firebaseId}@example.com`,
  email_verified: true,
  firebase: {
    identities: {
      "google.com": ["102752955248904445131"],
      email: [`${users[1].firebaseId}@example.com`],
    },
    sign_in_provider: "google.com",
  },
  uid: users[1].firebaseId,
};

export const anonymous_user: DecodedIdToken = {
  name: users[2].username,
  picture: "https://lh3.googleusercontent.com/a-/A",
  iss: "https://securetoken.google.com/ruhuna-dev",
  aud: "ruhuna-dev",
  auth_time: 1636553085,
  user_id: users[2].firebaseId,
  sub: users[2].firebaseId,
  iat: 1637600494,
  exp: 1637604094,
  email: `${users[2].firebaseId}@example.com`,
  email_verified: true,
  firebase: {
    identities: {
      "google.com": ["102752955248904445131"],
      email: [`${users[2].firebaseId}@example.com`],
    },
    sign_in_provider: "google.com",
  },
  uid: users[2].firebaseId,
};

export const nonactive_user: DecodedIdToken = {
  name: users[3].username,
  picture: "https://lh3.googleusercontent.com/a-/A",
  iss: "https://securetoken.google.com/ruhuna-dev",
  aud: "ruhuna-dev",
  auth_time: 1636553085,
  user_id: users[3].firebaseId,
  sub: users[3].firebaseId,
  iat: 1637600494,
  exp: 1637604094,
  email: `${users[2].firebaseId}@example.com`,
  email_verified: true,
  firebase: {
    identities: {
      "google.com": ["102752955248904445131"],
      email: [`${users[2].firebaseId}@example.com`],
    },
    sign_in_provider: "google.com",
  },
  uid: users[3].firebaseId,
};
