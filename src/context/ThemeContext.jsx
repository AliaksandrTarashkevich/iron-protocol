import { createContext, useContext } from "react";
import { THEME } from "../styles/theme";

export const ThemeContext = createContext(THEME.dark);

export function useTheme() {
  return useContext(ThemeContext);
}
