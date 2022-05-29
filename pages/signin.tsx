import Head from "next/head";
import { JP } from "../consts/texts";
import Login from "../frontend/components/pages/login";
import { EmotionJSX } from "@emotion/react/types/jsx-namespace";

export default function Signin(): EmotionJSX.Element {
  return (
    <>
      <Head>
        <title>Sign In | {JP.app_name}</title>
        <meta name="description" content={JP.app_name + " Sign In page"} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Login />
    </>
  );
}
