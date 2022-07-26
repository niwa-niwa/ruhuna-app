import { PaletteMode } from "@mui/material";
import { useState } from "react";
import { VARS } from "../../../consts/vars";

export function useThemeMode(theme: PaletteMode = "light") {
  const [mode, setMode] = useState<PaletteMode>(theme);

  const toggleThemeMode = () => {
    const color = mode === "light" ? "dark" : "light";
    localStorage.setItem(VARS.THEME_MODE, color);
    setMode(color);
  };

  const setThemeMode = (color: PaletteMode) => {
    localStorage.setItem(VARS.THEME_MODE, color);
    setMode(color);
  };

  return { mode, setThemeMode, toggleThemeMode };
}
