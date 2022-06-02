import Head from "next/head";
import SignIn from "../frontend/components/pages/SignIn";
import { EmotionJSX } from "@emotion/react/types/jsx-namespace";
import { useLocale, Locale } from "../frontend/hooks/useLocal";

export default function Signin(): EmotionJSX.Element {
  const { txt }: { txt: Locale } = useLocale();

  return (
    <>
      <Head>
        <title>
          {txt.signin} | {txt.app_name}
        </title>
        <meta name="description" content={txt.app_name + txt.signin} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <SignIn />
    </>
  );
}
