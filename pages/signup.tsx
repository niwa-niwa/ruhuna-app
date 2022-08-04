import Head from "next/head";
import { EmotionJSX } from "@emotion/react/types/jsx-namespace";
import { useLocale, LocaleText } from "../frontend/hooks/Local/useLocal";
import SignUpBody from "../frontend/components/bodies/SignUpBody";

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

      <SignUpBody />
    </>
  );
}
