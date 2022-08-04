import type { NextPage } from "next";
import { ReactNode } from "react";
import { css, SerializedStyles } from "@emotion/react";

const centering: SerializedStyles = css`
  display: flex;
  height: 100vh;
  flex-flow: column;
  align-items: center;
`;

const OneColumn: NextPage<{
  children: ReactNode;
}> = ({ children }) => {
  return <div css={centering}>{children}</div>;
};
export default OneColumn;
