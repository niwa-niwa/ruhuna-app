import type { NextPage } from "next";
import { ReactNode } from "react";
import { css, SerializedStyles } from "@emotion/react";

type OneColumnProps = {
  children: ReactNode;
};

const centering: SerializedStyles = css`
  display: flex;
  height: 100vh;
  flex-flow: column;
  align-items: center;
  /* flex: 1; */
  /* justify-content: center; */
  /* text-align:center; */
`;

const OneColumn: NextPage<OneColumnProps> = ({ children }) => {
  return <div css={centering}>{children}</div>;
};
export default OneColumn;
