import Head from "next/head";
import type { AppProps } from "next/app";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { CacheProvider, EmotionCache } from "@emotion/react";
import createEmotionCache from "../frontend/mui-theme/createEmotionCache";
import { useEffect, useMemo, useState } from "react";
import { VARS } from "../consts/vars";
import { ModalCircular } from "../frontend/components/common/loading/ModalCircular";
import { ThemeModeContext } from "../frontend/hooks/ThemeModeContext";
import { PaletteMode } from "@mui/material";

const clientSideEmotionCache = createEmotionCache();
interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

function MyApp(props: MyAppProps) {
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [mode, setMode] = useState<PaletteMode>("light");

  const themeMode = useMemo(
    () => ({
      toggleThemeMode: () => {
        setMode((prevMode: PaletteMode) =>
          prevMode === "light" ? "dark" : "light"
        );
      },
    }),
    []
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
      }),
    [mode]
  );

  useEffect(() => {
    localStorage.setItem(VARS.DARK_MODE, mode);
  }, [mode]);

  useEffect(() => {
    // do that after mounting
    if (typeof window !== "undefined") {
      const theme_mode: string =
        localStorage.getItem(VARS.DARK_MODE) || "light";

      if (theme_mode === "dark") setMode("dark");

      setIsLoading(false);
    }
  }, []);

  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  if (isLoading) {
    return <ModalCircular isOpen={isLoading} />;
  }

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <ThemeModeContext.Provider value={themeMode}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Component {...pageProps} />
        </ThemeProvider>
      </ThemeModeContext.Provider>
    </CacheProvider>
  );
}

export default MyApp;
