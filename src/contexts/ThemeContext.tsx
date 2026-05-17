"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

type ThemeMode = "light" | "dark";

interface ThemeContextValue {
  mode: ThemeMode;
  toggle: () => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextValue>({
  mode: "light",
  toggle: () => {},
  isDark: false,
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>("light");

  useEffect(() => {
    const saved = localStorage.getItem("petai-theme") as ThemeMode | null;
    if (saved === "dark") {
      setMode("dark");
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggle = () => {
    setMode((prev) => {
      const next = prev === "light" ? "dark" : "light";
      localStorage.setItem("petai-theme", next);
      if (next === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      return next;
    });
  };

  return (
    <ThemeContext.Provider value={{ mode, toggle, isDark: mode === "dark" }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeMode() {
  return useContext(ThemeContext);
}
