import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Theme, ThemeId, THEMES, DEFAULT_THEME_ID } from "../theme/themes";

interface ThemeContextValue {
  themeId: ThemeId;
  theme: Theme;
  colors: Theme["palette"];
  isDark: boolean;
  setTheme: (id: ThemeId) => void;
}

const STORAGE_KEY = "@petai:themeId";

const ThemeContext = createContext<ThemeContextValue>({
  themeId: DEFAULT_THEME_ID,
  theme: THEMES[DEFAULT_THEME_ID],
  colors: THEMES[DEFAULT_THEME_ID].palette,
  isDark: THEMES[DEFAULT_THEME_ID].isDark,
  setTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeId, setThemeIdState] = useState<ThemeId>(DEFAULT_THEME_ID);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((v) => {
      if (v && v in THEMES) setThemeIdState(v as ThemeId);
    });
  }, []);

  const setTheme = (id: ThemeId) => {
    setThemeIdState(id);
    AsyncStorage.setItem(STORAGE_KEY, id).catch(() => {});
  };

  const theme = THEMES[themeId];

  return (
    <ThemeContext.Provider value={{ themeId, theme, colors: theme.palette, isDark: theme.isDark, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
export const useColors = () => useContext(ThemeContext).colors;
