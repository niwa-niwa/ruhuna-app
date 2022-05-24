import { Button, TextField } from "@mui/material";
import type { NextPage } from "next";
import GuestHeader from "../../common/header/GuestHeader";
import OneColumn from "../../common/layout/OneColumn";

// TODO implement a page of login
const Login: NextPage = () => {
  return (
    <OneColumn>
      <GuestHeader />

      <main>
        <h2>Ruhunaにサインインする</h2>

        <Button variant="outlined">Googleでサインイン</Button>

        <span>または</span>

        <TextField id="outlined-basic" label="メールアドレス" variant="outlined" />

        <Button variant="contained">メールでサインイン</Button>
      </main>

      <footer></footer>
    </OneColumn>
  );
};
export default Login;
