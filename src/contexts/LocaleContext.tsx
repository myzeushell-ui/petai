"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Locale } from "@/lib/i18n";

interface LocaleContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
  toggle: () => void;
}

const LocaleContext = createContext<LocaleContextValue>({
  locale: "en",
  setLocale: () => {},
  toggle: () => {},
});

const STORAGE_KEY = "petai.locale";

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  // Restore from localStorage on mount; default = browser language if Russian, else English.
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY) as Locale | null;
      if (stored === "en" || stored === "ru") {
        setLocaleState(stored);
        return;
      }
      const navLang = window.navigator.language?.toLowerCase() ?? "";
      if (navLang.startsWith("ru") || navLang.startsWith("uk") || navLang.startsWith("be")) {
        setLocaleState("ru");
      }
    } catch {
      /* SSR / private mode — stick with default */
    }
  }, []);

  const setLocale = (l: Locale) => {
    setLocaleState(l);
    try {
      window.localStorage.setItem(STORAGE_KEY, l);
    } catch {
      /* ignore */
    }
  };

  const toggle = () => setLocale(locale === "en" ? "ru" : "en");

  return (
    <LocaleContext.Provider value={{ locale, setLocale, toggle }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  return useContext(LocaleContext);
}
