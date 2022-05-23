import type { NextPage } from "next";
import { ReactNode } from "react";

type GuestLayoutProps = {
  children: ReactNode;
};

// TODO implement a layout for guest
const GuestLayout: NextPage<GuestLayoutProps> = ({ children }) => {
  return <>{children}</>;
};
export default GuestLayout;
