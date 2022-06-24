import Head from "next/head";
import { EmotionJSX } from "@emotion/react/types/jsx-namespace";
import { useLocale, LocaleText } from "../frontend/hooks/useLocal";
import SignUp from "../frontend/components/pages/SignUp";

export default function Signup(): EmotionJSX.Element {
  const { txt }: { txt: LocaleText } = useLocale();

  return (
    <>
      <Head>
        <title>
          {txt.signup} | {txt.app_name}
        </title>
        <meta name="description" content={txt.app_name + txt.signup} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <SignUp />
    </>
  );
}
