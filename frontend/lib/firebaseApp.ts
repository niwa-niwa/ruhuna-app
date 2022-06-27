import { FirebaseApp, initializeApp } from "firebase/app";
import {
  getAuth,
  Auth,
  GoogleAuthProvider,
  signInWithPopup,
  OAuthCredential,
  createUserWithEmailAndPassword,
  UserCredential,
} from "firebase/auth";

const firebaseConfig: object = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_APP_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_APP_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_APP_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_APP_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_APP_MEASUREMENTID,
};

export const firebaseApp: FirebaseApp = initializeApp(firebaseConfig);

export const client_auth: Auth = getAuth();

export async function signupWithGoogle() {
  console.log("signupWithGoogle!");

  const google_provider = new GoogleAuthProvider();
  const result = await signInWithPopup(client_auth, google_provider);

  // TODO register the tokenId to backend
  const credential: OAuthCredential | null =
    GoogleAuthProvider.credentialFromResult(result);

  if (credential === null) throw new Error("credential is null !!");

  console.log("credential =", credential);
  console.log("idToken =", credential.idToken);
  console.log("token = ", credential.accessToken);
  console.log("user = ", result.user);
}

export type SignupValue = {
  email: string;
  password: string;
};

export async function signupWithEmail({ email, password }: SignupValue) {
  const result: UserCredential = await createUserWithEmailAndPassword(
    client_auth,
    email,
    password
  );

  // TODO register the tokenId to backend
  console.log("created user = ", result.user);
}
