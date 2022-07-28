import type { NextPage } from "next";
import Router from "next/router";
import { ReactNode, useEffect, useState } from "react";
import { client_auth } from "../../../lib/firebaseApp";
import { ModalCircular } from "../loading/ModalCircular";

const AuthLayout: NextPage<{
  children: ReactNode;
}> = ({ children }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // after render window
    if (typeof window !== "undefined" && isLoading) {
      if (client_auth.currentUser) return setIsLoading(false);

      // if currentUser was null it should confirm auth state
      client_auth.onAuthStateChanged((user) => {
        if (user) return setIsLoading(false);

        // not auth it should redirect guest pafe
        Router.push("/");
      });
    }
  }, [isLoading]);

  if (isLoading) {
    return <ModalCircular isOpen={isLoading} />;
  }

  return <>{children}</>;
};

export default AuthLayout;
