import React, { createContext, useContext, useEffect, useState } from "react";
import { Appearance } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { lightColors, darkColors } from "../theme/colors";

type ThemeMode = "light" | "dark" | "system";

interface ThemeContextValue {
  mode: ThemeMode;
  isDark: boolean;
  colors: typeof lightColors;
  setMode: (mode: ThemeMode) => void;
  toggle: () => void;
}

const STORAGE_KEY = "@petai:theme";

const ThemeContext = createContext<ThemeContextValue>({
  mode: "system",
  isDark: false,
  colors: lightColors,
  setMode: () => {},
  toggle: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>("system");
  const [systemDark, setSystemDark] = useState(Appearance.getColorScheme() === "dark");

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((v) => {
      if (v === "light" || v === "dark" || v === "system") setModeState(v);
    });
    const sub = Appearance.addChangeListener(({ colorScheme }) => {
      setSystemDark(colorScheme === "dark");
    });
    return () => sub.remove();
  }, []);

  const isDark = mode === "dark" || (mode === "system" && systemDark);
  const palette = isDark ? darkColors : lightColors;

  const setMode = (next: ThemeMode) => {
    setModeState(next);
    AsyncStorage.setItem(STORAGE_KEY, next).catch(() => {});
  };

  const toggle = () => setMode(isDark ? "light" : "dark");

  return (
    <ThemeContext.Provider value={{ mode, isDark, colors: palette, setMode, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
export const useColors = () => useContext(ThemeContext).colors;
