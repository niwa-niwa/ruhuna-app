import { Box, Button, Container, css, TextField } from "@mui/material";
import type { NextPage } from "next";
import GuestHeader from "../../common/header/GuestHeader";
import OneColumn from "../../common/layout/OneColumn";
import { centering_vertical } from "../../../styles";

// TODO implement a page of login
const Login: NextPage = () => {
  const border_style = css`
    border-bottom: 1px solid #c0c0c0;
    width: 100%;
    margin: 0 12px;
  `;

  return (
    <OneColumn>
      <GuestHeader />

      <Container maxWidth="sm">
        <main css={centering_vertical}>
          <h2 css={css`margin:32px 0 24px;`}>Ruhunaにサインイン</h2>

          <Button
            variant="outlined"
            css={css`
              width: 100%;
              margin: 24px 0;
            `}
          >
            Googleでサインイン
          </Button>

          <Box
            css={css`
              display: flex;
              align-items: center;
              width: 100%;
            `}
          >
            <div css={border_style}></div>
            <span>OR</span>
            <div css={border_style}></div>
          </Box>

          <TextField
            id="outlined-basic"
            label="メールアドレス"
            variant="outlined"
            css={css`
              width: 100%;
              margin: 24px 0 0;
            `}
          />

          <TextField
            id="outlined-basic"
            label="パスワード"
            variant="outlined"
            css={css`
              width: 100%;
              margin: 24px 0 0;
            `}
          />

          <Button
            variant="contained"
            css={css`
              width: 100%;
              margin: 24px 0 0;
            `}
          >
            メールでサインイン
          </Button>
        </main>
      </Container>

      <footer></footer>
    </OneColumn>
  );
};
export default Login;
