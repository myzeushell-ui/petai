import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState, createContext, useContext, ReactNode, createElement } from "react";
import { strings, Lang } from "./strings";

const LANG_KEY = "@petai:lang";

const LANGUAGES: Record<Lang, { name: string; flag: string }> = {
  en: { name: "English", flag: "🇬🇧" },
  de: { name: "Deutsch", flag: "🇩🇪" },
  fr: { name: "Français", flag: "🇫🇷" },
  es: { name: "Español", flag: "🇪🇸" },
  it: { name: "Italiano", flag: "🇮🇹" },
  ru: { name: "Русский", flag: "🇷🇺" },
  pl: { name: "Polski", flag: "🇵🇱" },
  nl: { name: "Nederlands", flag: "🇳🇱" },
};

export const LANG_LIST = Object.entries(LANGUAGES).map(([code, info]) => ({ code: code as Lang, ...info }));

interface I18nValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nValue>({
  lang: "en",
  setLang: () => {},
  t: (k: string) => k,
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    AsyncStorage.getItem(LANG_KEY).then((v) => {
      if (v && v in LANGUAGES) setLangState(v as Lang);
    });
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    AsyncStorage.setItem(LANG_KEY, l).catch(() => {});
  };

  const t = (key: string): string => {
    const langStrings = strings[lang] || strings.en;
    return (langStrings as any)[key] ?? (strings.en as any)[key] ?? key;
  };

  return createElement(I18nContext.Provider, { value: { lang, setLang, t } }, children);
}

export const useI18n = () => useContext(I18nContext);
export const useT = () => useContext(I18nContext).t;
