import { FirebaseApp, initializeApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";

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
