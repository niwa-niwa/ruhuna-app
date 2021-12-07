import "../../lib/firebaseApp";
import {
  Auth,
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  GoogleAuthProvider,
  User,
  UserCredential,
  signInWithPopup,
  signInAnonymously,
  signOut,
} from "firebase/auth";

const auth: Auth = getAuth();
onAuthStateChanged(auth, (user) => {
  console.log(user);
});

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
              const user: User = result.user;
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
          signInAnonymously(auth)
            .then(() => {
              onAuthStateChanged(auth, (user: User | null) => {
                console.log(user);
              });
            })
            .catch((error) => {
              const errorCode = error.code;
              const errorMessage = error.message;
              console.error(errorCode, errorMessage);
            });
        }}
      >
        Sign In Anonymously
      </button>

      <br />
      <br />

      {/* E-Mail Sign up */}
      <button
        onClick={async () => {
          createUserWithEmailAndPassword(
            auth,
            email_login_info.email,
            email_login_info.password
          )
            .then((userCredential: UserCredential) => {
              console.log(userCredential);
            })
            .catch((error) => {
              const errorCode = error.code;
              const errorMessage = error.message;
              console.error(errorCode, errorMessage);
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
          signInWithEmailAndPassword(
            auth,
            email_login_info.email,
            email_login_info.password
          )
            .then((userCredential: UserCredential) => {
              console.log(userCredential);
            })
            .catch((error) => {
              const errorCode = error.code;
              const errorMessage = error.message;
              console.error(errorCode, errorMessage);
            });
        }}
      >
        Log In with Mail
      </button>

      <br />
      <br />

      {/* Sign out */}
      <button
        onClick={() => {
          signOut(auth);
        }}
      >
        Sign Out
      </button>

      <div></div>
    </div>
  );
}
