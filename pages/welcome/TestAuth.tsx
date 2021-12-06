import firebase from "firebase/compat/app";
import { FirebaseApp, initializeApp } from "firebase/app";
import {
  Auth,
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import "firebase/compat/auth";
import {
  GoogleAuthProvider,
  User,
  UserCredential,
  signInWithPopup,
} from "firebase/auth";
import {
  FirebaseAuth,
  FirebaseAdmin,
  firebaseApp,
} from "../../api/lib/FirebaseAdmin";

const firebaseConfig: object = {
  // apiKey: process.env.REACT_APP_API_KEY,
  // authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  // projectId: process.env.REACT_APP_PROJECT_ID,
  // storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  // messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  // appId: process.env.REACT_APP_APP_ID,
  apiKey: "AIzaSyBrNDhrkQQSdmDwwVLEj0r_qNPOtEmS5fM",
  authDomain: "ruhuna-dev.firebaseapp.com",
  projectId: "ruhuna-dev",
  storageBucket: "ruhuna-dev.appspot.com",
  messagingSenderId: "223450110392",
  appId: "1:223450110392:web:32cfe5e3de951758fb174d",
  measurementId: "G-KZ9WW7EM6Y",
};
// const app = initializeApp(firebaseConfig);
const app = FirebaseAdmin.app();
const auth = getAuth(firebaseApp);
// TODO firebase auth doesn't work

const email_login_info = {
  email: "pass_mail39-fake@yahoo.co.jp",
  password: "password",
};

export default function TestAuth() {
  return (
    <div>
      {/* Google Sign in */}
      <button
        onClick={() => {
          signInWithPopup(auth, new GoogleAuthProvider())
            .then((result) => {
              // This gives you a Google Access Token. You can use it to access the Google API.
              const credential =
                GoogleAuthProvider.credentialFromResult(result);
              if (credential !== null) {
                const token = credential.accessToken;
                console.log("token = ", token);
              } else {
                console.log("credential is null");
              }
              // The signed-in user info.
              const user = result.user;
              console.log("user = ", user);
              // ...
            })
            .catch((error) => {
              // Handle Errors here.
              const errorCode = error.code;
              const errorMessage = error.message;
              // The email of the user's account used.
              const email = error.email;
              // The AuthCredential type that was used.
              const credential = GoogleAuthProvider.credentialFromError(error);
              // ...
              console.error(errorCode, errorMessage, email);
            });
        }}
      >
        Sign In with Google
      </button>
      <br />
      <br />
      {/* anonymously */}
      <button
        onClick={() => {
          firebase.auth().signInAnonymously();
        }}
      >
        Sign In Anonymously
      </button>

      <br />
      <br />

      {/* E-Mail Sign up */}
      <button
        onClick={async () => {
          const auth: any = getAuth();
          createUserWithEmailAndPassword(
            auth,
            email_login_info.email || "",
            email_login_info.password || ""
          ).then((userCredential) => {
            console.log(userCredential);
          });
        }}
      >
        Sign In with Mail
      </button>
      <br />
      <br />
      {/* E-Mail Sign in */}
      <button
        onClick={() => {
          const auth: any = getAuth();
          signInWithEmailAndPassword(
            auth,
            email_login_info.email || "",
            email_login_info.password || ""
          );
        }}
      >
        Log In with Mail
      </button>

      <br />
      <br />

      {/* Sign out */}
      <button
        onClick={() => {
          firebase.auth().signOut();
        }}
      >
        Sign Out
      </button>

      <div></div>
    </div>
  );
}
