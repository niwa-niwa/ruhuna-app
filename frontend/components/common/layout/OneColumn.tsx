import type { NextPage } from "next";
import { ReactNode } from "react";

type OneColumnProps = {
  children: ReactNode;
};

// TODO implement a column layout for single
const OneColumn: NextPage<OneColumnProps> = ({ children }) => {
  return <div>{children}</div>;
};
export default OneColumn;
