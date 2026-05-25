"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Palette } from "lucide-react";
import { useVariant, variants, type VariantId } from "@/contexts/VariantContext";
import { useLocale } from "@/contexts/LocaleContext";
import { t, type LocaleString } from "@/lib/i18n";

// All 6 themes from design-previews.html v2 — grouped by warm/glass families
const WARM_THEMES: VariantId[] = ["terracotta", "sage", "peach"];
const GLASS_THEMES: VariantId[] = ["aurora", "deepOcean", "sunrise"];

const VARIANT_LABEL: Record<VariantId, LocaleString> = {
  terracotta: { en: "Terracotta",  ru: "Терракота" },
  sage:       { en: "Sage",        ru: "Шалфей" },
  peach:      { en: "Peach",       ru: "Персик" },
  aurora:     { en: "Aurora",      ru: "Аврора" },
  deepOcean:  { en: "Deep Ocean",  ru: "Океан" },
  sunrise:    { en: "Sunrise",     ru: "Рассвет" },
};
const VARIANT_DESC: Record<VariantId, LocaleString> = {
  terracotta: { en: "Warm earth · Premium",       ru: "Тёплая земля · Премиум" },
  sage:       { en: "Green calm · Botanical",     ru: "Зелёный покой · Ботаника" },
  peach:      { en: "Sunset coral · Warm",        ru: "Закатный коралл · Тепло" },
  aurora:     { en: "Glass · Purple-pink aurora", ru: "Стекло · Фиолет-розовая" },
  deepOcean:  { en: "Glass · Cyan deep water",    ru: "Стекло · Глубокий бирюз" },
  sunrise:    { en: "Glass · Orange-rose dawn",   ru: "Стекло · Оранжево-розовый" },
};

const UI = {
  title:       { en: "Choose theme",  ru: "Выбрать тему" },
  active:      { en: "Active",        ru: "Активна" },
  groupWarm:   { en: "Warm · Premium", ru: "Тёплая · Премиум" },
  groupGlass:  { en: "Glass · Aurora", ru: "Стекло · Аврора" },
  layoutLabel: { en: "Layout",        ru: "Раскладка" },
};

function ThemeButton({ v, locale, isActive, onClick }: { v: VariantId; locale: "en" | "ru"; isActive: boolean; onClick: () => void }) {
  const vc = variants[v];
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all ${
        isActive
          ? "bg-gray-100 dark:bg-gray-700 ring-2 ring-gray-300 dark:ring-gray-500"
          : "hover:bg-gray-50 dark:hover:bg-gray-700/50"
      }`}
    >
      <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl text-lg shadow-sm ${vc.logoBg}`}>
        <span className={vc.group === "warm" ? "text-white" : ""}>{vc.emoji}</span>
      </div>
      <div className="min-w-0 flex-1">
        <p className={`text-sm font-semibold leading-tight ${isActive ? "text-gray-900 dark:text-white" : "text-gray-700 dark:text-gray-200"}`}>
          {t(VARIANT_LABEL[v], locale)}
        </p>
        <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5 leading-tight">
          {t(VARIANT_DESC[v], locale)}
        </p>
        <p className="text-[9px] uppercase tracking-wider text-gray-300 dark:text-gray-600 mt-0.5">
          {t(UI.layoutLabel, locale)}: {vc.layout}
        </p>
      </div>
      {isActive && (
        <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex-shrink-0">
          {t(UI.active, locale)}
        </span>
      )}
    </button>
  );
}

export function VariantSwitcher() {
  const { variant, setVariant, colors } = useVariant();
  const { locale } = useLocale();
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-24 right-4 z-[60] lg:bottom-6 lg:right-6 flex flex-col items-end gap-2">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.9 }}
            transition={{ duration: 0.15 }}
            className="mb-2 w-72 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-3 shadow-2xl max-h-[80vh] overflow-y-auto"
          >
            <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 px-1 pb-2">
              {t(UI.title, locale)}
            </div>

            {/* Warm group */}
            <div className="text-[9px] font-bold uppercase tracking-wider text-gray-300 dark:text-gray-600 px-1 pt-1 pb-1">
              ☀ {t(UI.groupWarm, locale)}
            </div>
            <div className="flex flex-col gap-1 mb-2">
              {WARM_THEMES.map((v) => (
                <ThemeButton
                  key={v}
                  v={v}
                  locale={locale}
                  isActive={variant === v}
                  onClick={() => {
                    setVariant(v);
                    setOpen(false);
                  }}
                />
              ))}
            </div>

            {/* Glass group */}
            <div className="text-[9px] font-bold uppercase tracking-wider text-gray-300 dark:text-gray-600 px-1 pt-1 pb-1">
              ✨ {t(UI.groupGlass, locale)}
            </div>
            <div className="flex flex-col gap-1">
              {GLASS_THEMES.map((v) => (
                <ThemeButton
                  key={v}
                  v={v}
                  locale={locale}
                  isActive={variant === v}
                  onClick={() => {
                    setVariant(v);
                    setOpen(false);
                  }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(!open)}
        aria-label={t(UI.title, locale)}
        className={`flex h-12 w-12 items-center justify-center rounded-full ${colors.logoBg} text-white shadow-lg transition-transform`}
      >
        <Palette className="h-5 w-5" />
      </motion.button>
    </div>
  );
}
