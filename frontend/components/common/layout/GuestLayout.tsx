import type { NextPage } from "next";
import { ReactNode } from "react";

const GuestLayout: NextPage<{
  children: ReactNode;
}> = ({ children }) => {
  return <>{children}</>;
};
export default GuestLayout;
