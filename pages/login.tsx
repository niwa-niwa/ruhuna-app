import Head from "next/head";
import type { NextPage } from "next";
import { JP } from "../consts/texts";
import Login from "../frontend/components/pages/login";

const login: NextPage = () => {
  return (
    <>
      <Head>
        <title>Login | {JP.APP_NAME}</title>
        <meta name="description" content={JP.APP_NAME+" login page"} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Login />
    </>
  );
};
export default login;
