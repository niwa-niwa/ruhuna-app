import Head from "next/head";
import type { AppProps } from "next/app";
import { Theme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { CacheProvider, EmotionCache } from "@emotion/react";
import theme from "../frontend/mui-theme/theme";
import createEmotionCache from "../frontend/mui-theme/createEmotionCache";
import { useMemo, useState } from "react";

const clientSideEmotionCache = createEmotionCache();
interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

function MyApp(props: MyAppProps) {
  // TODO implement useThemeContext for dark mode
  const [mode, setMode] = useState<"light" | "dark">("dark");

  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  const customTheme: Theme = useMemo(() => theme(mode), [mode]);

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <ThemeProvider theme={customTheme}>
        <CssBaseline />
        <Component {...pageProps} />
      </ThemeProvider>
    </CacheProvider>
  );
}

export default MyApp;
