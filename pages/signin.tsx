import Head from "next/head";
import SignInBody from "../frontend/components/bodies/SignInBody";
import { EmotionJSX } from "@emotion/react/types/jsx-namespace";
import { useLocale, LocaleText } from "../frontend/hooks/Local/useLocal";

export default function Signin(): EmotionJSX.Element {
  const { txt }: { txt: LocaleText } = useLocale();

  return (
    <>
      <Head>
        <title>
          {txt.signin} | {txt.app_name}
        </title>
        <meta name="description" content={txt.app_name + txt.signin} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <SignInBody />
    </>
  );
}
