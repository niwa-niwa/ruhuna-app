import { useRouter } from "next/router";
import { useMemo } from "react";
import en from "../../locales/en";
import ja from "../../locales/ja";

export const useLocale = (): {
  local: string;
  txt: LocaleText;
} => {
  const { locale } = useRouter();

  const txt: LocaleText = useMemo((): LocaleText => {
    const langs: { [key: string]: LocaleText } = {
      en,
      ja,
    };

    const lang: LocaleText | undefined = langs[locale || "en"];

    if (!lang) return langs["en"];

    return lang;
  }, [locale]);

  const local = locale || "en";
  return { local, txt };
};

export type LocaleText = {
  app_name: string;
  st_create_account: string;
  signin_ruhuna: string;
  with_google: string;
  email: string;
  password: string;
  signin: string;
  signup: string;
};
