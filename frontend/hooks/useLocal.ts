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
  signup_ruhuna: string;
  signin_with_google: string;
  signup_with_google: string;
  email: string;
  password: string;
  signin: string;
  signup: string;
  email_is_required: string;
  enter_email_format: string;
  password_is_required: string;
};
