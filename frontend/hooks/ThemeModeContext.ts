import { PaletteMode } from "@mui/material";
import { createContext, Dispatch, Reducer, useReducer } from "react";
import { VARS } from "../../consts/vars";

type DarkMode = {
  mode: PaletteMode;
  isDarkMode: boolean;
};

const initialState: DarkMode = {
  mode: "light",
  isDarkMode: false,
};

const reducer: Reducer<DarkMode, boolean> = (
  state: DarkMode,
  action: boolean
): DarkMode => {
  localStorage.setItem(VARS.LOCAL_STORAGE_MODE, action.toString());
  
  if (action) {
    return { isDarkMode: action, mode: "dark" };
  }

  return { isDarkMode: action, mode: "light" };
};

// export const ThemeModeContext = createContext<{
//   state: DarkMode;
//   dispatch: Dispatch<boolean>;
// }>({
//   state: initialState,
//   dispatch: () => {},
// });

// export const ThemeModeProvider = ThemeModeContext.Provider;

export const useDarkMode = (is_dark: boolean = initialState.isDarkMode) => {
  const [state, dispatch] = useReducer(reducer, {
    mode: is_dark ? "dark" : "light",
    isDarkMode: is_dark,
  });

  return { state, dispatch };
};

export const ThemeModeContext = createContext({ toggleThemeMode: () => {} });
