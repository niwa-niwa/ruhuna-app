import type { NextPage } from "next";
import GuestHeader from "../../common/header/GuestHeader";
import OneColumn from "../../common/layout/OneColumn";

// TODO implement a page of login
const Login: NextPage = () => {
  return (
    <OneColumn>
      <GuestHeader />

      <main>this is Login page</main>

      <footer></footer>
    </OneColumn>
  );
};
export default Login;
