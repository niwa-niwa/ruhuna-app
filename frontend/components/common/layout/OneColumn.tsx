import type { NextPage } from "next";
import { ReactNode } from "react";
import { css, SerializedStyles } from "@emotion/react";

type OneColumnProps = {
  children: ReactNode;
};

const centering:SerializedStyles= css`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

// TODO implement a column layout for single
const OneColumn: NextPage<OneColumnProps> = ({ children }) => {
  return (
    <div
      css={centering}
    >
      {children}
    </div>
  );
};
export default OneColumn;
