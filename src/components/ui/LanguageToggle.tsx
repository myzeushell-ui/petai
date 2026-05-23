"use client";

import { useLocale } from "@/contexts/LocaleContext";
import { LOCALE_FLAGS, LOCALE_LABELS, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

interface LanguageToggleProps {
  variant?: "pill" | "compact";
  className?: string;
}

export function LanguageToggle({ variant = "pill", className }: LanguageToggleProps) {
  const { locale, setLocale } = useLocale();

  if (variant === "compact") {
    return (
      <button
        onClick={() => setLocale(locale === "en" ? "ru" : "en")}
        aria-label={`Switch to ${locale === "en" ? "Russian" : "English"}`}
        className={cn(
          "flex h-8 items-center gap-1.5 rounded-full bg-gray-100 dark:bg-gray-800 px-2.5 text-xs font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors",
          className
        )}
      >
        <span className="text-sm leading-none">{LOCALE_FLAGS[locale]}</span>
        <span className="uppercase tracking-wide">{locale}</span>
      </button>
    );
  }

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-full bg-gray-100 dark:bg-gray-800 p-1",
        className
      )}
      role="radiogroup"
      aria-label="Language"
    >
      {(["en", "ru"] as Locale[]).map((l) => {
        const active = locale === l;
        return (
          <button
            key={l}
            role="radio"
            aria-checked={active}
            onClick={() => setLocale(l)}
            className={cn(
              "flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition-all",
              active
                ? "bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            )}
          >
            <span className="text-sm leading-none">{LOCALE_FLAGS[l]}</span>
            <span>{LOCALE_LABELS[l]}</span>
          </button>
        );
      })}
    </div>
  );
}
