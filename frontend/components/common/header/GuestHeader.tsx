import type { NextPage } from "next";
import { JP } from "../../../../consts/texts";
import { css } from "@emotion/react";
import { CenteringDiv, centering } from "../../../styles";

// TODO implement a header for guest
const GuestHeader: NextPage = () => {
  return (
    <CenteringDiv>
      <h2
        css={css`
          margin: 0;
        `}
      >
        {JP.app_name}
      </h2>
      <a href="/a">{JP.st_create_account}</a>
    </CenteringDiv>
  );
};
export default GuestHeader;
