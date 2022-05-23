import type { NextPage, NextPageContext } from "next";
import { FC } from "react";

type arg = {
  children: Element[];
}
const OneColumn: FC<arg> = ({children}) => {
  return (
    <div>
      children
    </div>
  );
};
export default OneColumn;
