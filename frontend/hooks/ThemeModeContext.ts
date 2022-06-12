import { PaletteMode } from "@mui/material";
import { createContext, Dispatch, SetStateAction, useState } from "react";

const default_context: PaletteMode = "light";

export const ThemeModeContext = createContext<{
  mode: PaletteMode;
  setMode: Dispatch<SetStateAction<PaletteMode>>;
}>({
  mode: default_context,
  setMode: (default_context) => default_context,
});

export const ThemeModeProvider = ThemeModeContext.Provider;

export const useThemeMode = (type_mode: PaletteMode = default_context) => {
  const [mode, setMode] = useState<PaletteMode>(type_mode);
  return { mode, setMode };
};

// TODO implement toggle of mode with useReducer
