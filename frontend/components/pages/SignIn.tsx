import { Container } from "@mui/material";
import type { NextPage } from "next";
import GuestHeader from "../common/header/GuestHeader";
import OneColumn from "../common/layout/OneColumn";
import { centering_vertical } from "../../styles/common";
import {
  Sign_Title,
  Border_Or,
  Google_Button,
  Mail_Field,
  Password_Field,
  Sign_Submit,
} from "../../styles/sign-style";
import { Locale, useLocale } from "../../hooks/useLocal";
import { EmotionJSX } from "@emotion/react/types/jsx-namespace";

// TODO implement validation of fields

const SignIn: NextPage = (): EmotionJSX.Element => {
  const { txt }: { txt: Locale } = useLocale();

  return (
    <OneColumn>
      <GuestHeader />

      <Container maxWidth="sm">
        <main css={centering_vertical}>
          <Sign_Title>{txt.signin_ruhuna}</Sign_Title>

          <Google_Button>{txt.with_google}</Google_Button>

          <Border_Or />

          <Mail_Field label={txt.email} />
          <Password_Field label={txt.password} />

          <Sign_Submit>{txt.signin}</Sign_Submit>
        </main>
      </Container>

      <footer></footer>
    </OneColumn>
  );
};
export default SignIn;
