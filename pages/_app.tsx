import Head from "next/head";
import type { AppProps } from "next/app";
import {
  createTheme,
  Theme,
  ThemeProvider,
  useTheme,
} from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { CacheProvider, EmotionCache } from "@emotion/react";
// import theme from "../frontend/mui-theme/theme";
import createEmotionCache from "../frontend/mui-theme/createEmotionCache";
import { createContext, useEffect, useMemo, useState } from "react";
// import {
//   ThemeModeProvider,
//   useDarkMode,
// } from "../frontend/hooks/ThemeModeContext";
import { VARS } from "../consts/vars";
import { ModalCircular } from "../frontend/components/common/loading/ModalCircular";
import { ThemeModeContext } from "../frontend/hooks/ThemeModeContext";

// export const ColorModeContext = createContext({ toggleColorMode: () => {} });

const clientSideEmotionCache = createEmotionCache();
interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

function MyApp(props: MyAppProps) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  // const { state, dispatch } = useDarkMode(false);

  const [mode, setMode] = useState<"light" | "dark">("light");

  const themeMode = useMemo(
    () => ({
      toggleThemeMode: () => {
        setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
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
    // do that after mounting
    if (typeof window !== "undefined") {
      const local_mode: string =
        localStorage.getItem(VARS.LOCAL_STORAGE_MODE) || "false";

      if (local_mode === "true") setMode("dark")

        setIsLoading(false);
    }
  }, []);

  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  // const customTheme: Theme = theme(state.mode);

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
          {/* <ThemeModeProvider value={{ state, dispatch }}> */}
          <Component {...pageProps} />
          {/* </ThemeModeProvider> */}
        </ThemeProvider>
      </ThemeModeContext.Provider>
    </CacheProvider>
  );
}

export default MyApp;
