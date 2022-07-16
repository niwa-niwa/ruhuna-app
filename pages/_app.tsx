import Head from "next/head";
import type { AppProps } from "next/app";
import { Theme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { CacheProvider, EmotionCache } from "@emotion/react";
import theme from "../frontend/mui-theme/theme";
import createEmotionCache from "../frontend/mui-theme/createEmotionCache";
import { useEffect, useState } from "react";
import {
  ThemeModeProvider,
  useDarkMode,
} from "../frontend/hooks/ThemeModeContext";
import { VARS } from "../consts/vars";
import { ModalCircular } from "../frontend/components/common/loading/ModalCircular";

const clientSideEmotionCache = createEmotionCache();
interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

function MyApp(props: MyAppProps) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { state, dispatch } = useDarkMode(false);

  useEffect(() => {
    // do that after mounting
    if (typeof window !== "undefined") {
      const local_mode: string =
        localStorage.getItem(VARS.LOCAL_STORAGE_MODE) || "false";

      if (local_mode === "true") dispatch(true);

      setIsLoading(false);
    }
  }, [dispatch]);

  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  const customTheme: Theme = theme(state.mode);

  if (isLoading) {
    return <ModalCircular isOpen={isLoading} />;
  }

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <ThemeProvider theme={customTheme}>
        <CssBaseline />
        <ThemeModeProvider value={{ state, dispatch }}>
          <Component {...pageProps} />
        </ThemeModeProvider>
      </ThemeProvider>
    </CacheProvider>
  );
}

export default MyApp;
