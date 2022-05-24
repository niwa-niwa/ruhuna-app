import Head from "next/head";
import type { NextPage } from "next";
import { JP } from "../consts/texts";
import Login from "../frontend/components/pages/login";

const login: NextPage = () => {
  return (
    <>
      <Head>
        <title>Login | {JP.app_name}</title>
        <meta name="description" content={JP.app_name+" login page"} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Login />
    </>
  );
};
export default login;
