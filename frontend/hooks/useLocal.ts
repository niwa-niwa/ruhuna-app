import { useRouter } from "next/router";
import en from "../../locales/en";
import ja from "../../locales/ja";

export const useLocale = (): {
  locale: string | undefined;
  txt: Locale;
} => {
  const langs: { [key: string]: Locale } = {
    en,
    ja,
  };
  const { locale } = useRouter();

  // english is default lang
  const txt: Locale = ((): Locale => {
    if (!locale) return langs["en"];

    const lang: Locale | undefined = langs[locale];

    if (!lang) return langs["en"];

    return lang;
  })();

  return { locale, txt };
};

export type Locale = {
  app_name: string;
  st_create_account: string;
  signin_ruhuna: string;
  with_google: string;
  email: string;
  password: string;
  signin: string;
  signup: string;
};
