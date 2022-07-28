import { createContext } from "react";
import { useThemeMode } from "./useThemeMode";

export const ThemeModeContext = createContext<ReturnType<typeof useThemeMode>>({
  mode: "light",
  toggleThemeMode: () => {},
  setThemeMode: () => {},
});
