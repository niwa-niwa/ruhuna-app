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

const SignIn: NextPage = () => {
  return (
    <OneColumn>
      <GuestHeader />

      <Container maxWidth="sm">
        <main css={centering_vertical}>
          <Sign_Title text="Ruhunaにサインイン" />

          <Google_Button text="Googleでサインイン" />

          <Border_Or />

          <Mail_Field text="メールアドレス" />
          <Password_Field text="パスワード" />

          <Sign_Submit text="サインイン" />
        </main>
      </Container>

      <footer></footer>
    </OneColumn>
  );
};
export default SignIn;
