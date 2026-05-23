/**
 * Lightweight i18n primitives for PetAI web.
 * Two locales: English (default) and Russian.
 *
 * Pattern: every translatable value is stored as { en, ru } or { en: [], ru: [] }
 * — keeps source-of-truth side by side and easy to maintain.
 */

export type Locale = "en" | "ru";

export const LOCALES: Locale[] = ["en", "ru"];

export const LOCALE_LABELS: Record<Locale, string> = {
  en: "English",
  ru: "Русский",
};

export const LOCALE_FLAGS: Record<Locale, string> = {
  en: "🇬🇧",
  ru: "🇷🇺",
};

/** A string that exists in both languages. */
export type LocaleString = { en: string; ru: string };

/** A bulleted list that exists in both languages. */
export type LocaleArray = { en: string[]; ru: string[] };

/** Pick the locale-specific value from a LocaleString. */
export function t(s: LocaleString | string | undefined, locale: Locale): string {
  if (!s) return "";
  if (typeof s === "string") return s;
  return s[locale] ?? s.en ?? "";
}

/** Pick the locale-specific list from a LocaleArray. */
export function tList(s: LocaleArray | undefined, locale: Locale): string[] {
  if (!s) return [];
  return s[locale] ?? s.en ?? [];
}

/** Build a UI string bag with translations: t(ui.greeting, locale) */
export type UIStringBag = Record<string, LocaleString>;
