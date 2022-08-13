import type { NextPage } from "next";
import { ReactNode } from "react";

const GuestLayout: NextPage<{
  children: ReactNode;
}> = ({ children }) => {
  // TODO implement redirect home page , if users was signed in
  return <>{children}</>;
};
export default GuestLayout;
