import { css, SerializedStyles } from "@emotion/react";
import styled from "@emotion/styled";

export const centering: SerializedStyles = css`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

export const CenteringDiv = styled("div")`
  display: flex;
  align-items: center;
  justify-content: center;
`;
