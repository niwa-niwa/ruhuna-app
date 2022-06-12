import { PaletteMode } from "@mui/material";
import { createContext, useState } from "react";

const default_context: PaletteMode = "light";

export const ThemeModeContext = createContext<PaletteMode>(default_context);

export const ThemeModeProvider = ThemeModeContext.Provider;

export const useThemeMode = (type_mode: PaletteMode = default_context) => {
  const [mode, setMode] = useState<PaletteMode>(type_mode);
  return { mode, setMode };
};
