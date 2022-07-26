import Head from "next/head";
import type { AppProps } from "next/app";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { CacheProvider, EmotionCache } from "@emotion/react";
import createEmotionCache from "../frontend/mui-theme/createEmotionCache";
import { useEffect, useMemo, useState } from "react";
import { VARS } from "../consts/vars";
import { ModalCircular } from "../frontend/components/common/loading/ModalCircular";
import { ThemeModeContext } from "../frontend/hooks/ThemeMode/ThemeModeContext";
import { PaletteMode } from "@mui/material";
import { useThemeMode } from "../frontend/hooks/ThemeMode/useThemeMode";

const clientSideEmotionCache = createEmotionCache();
interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

function MyApp(props: MyAppProps) {
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const { mode, setThemeMode, toggleThemeMode } = useThemeMode("light");

  const themeMode = useMemo(
    () => ({
      toggleThemeMode,
    }),
    [toggleThemeMode]
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
    // do that after mounting
    if (typeof window !== "undefined") {
      const theme_mode: PaletteMode =
        localStorage.getItem(VARS.THEME_MODE) === "light" ? "light" : "dark";

      setThemeMode(theme_mode);

      setIsLoading(false);
    }
  }, [setThemeMode]);

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
