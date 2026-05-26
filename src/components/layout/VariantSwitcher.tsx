"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Palette } from "lucide-react";
import { useVariant, variants, type VariantId, getActiveSpec } from "@/contexts/VariantContext";
import { useLocale } from "@/contexts/LocaleContext";
import { t, type LocaleString } from "@/lib/i18n";

const UI = {
  title:       { en: "Choose theme · 20 designs", ru: "Тема · 20 дизайнов" },
  active:      { en: "Active",                    ru: "Активна" },
  groupLight:  { en: "Light themes",              ru: "Светлые" },
  groupDark:   { en: "Dark themes",               ru: "Тёмные" },
};

function ThemeButton({ v, isActive, onClick }: { v: VariantId; isActive: boolean; onClick: () => void }) {
  const vc = variants[v];
  const spec = getActiveSpec(v);
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-left transition-all ${
        isActive
          ? "bg-gray-100 dark:bg-gray-700 ring-2 ring-gray-300 dark:ring-gray-500"
          : "hover:bg-gray-50 dark:hover:bg-gray-700/50"
      }`}
    >
      {/* Tiny color preview using inline styles (works without Tailwind compilation) */}
      <div
        className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl text-base shadow-sm"
        style={{
          background: spec ? `linear-gradient(135deg, ${spec.gradient?.[0] ?? spec.primary}, ${spec.gradient?.[1] ?? spec.accent})` : "#888",
          color: spec?.onPrimary ?? "#fff",
        }}
      >
        {vc.emoji}
      </div>
      <div className="min-w-0 flex-1">
        <p className={`text-xs font-semibold leading-tight truncate ${isActive ? "text-gray-900 dark:text-white" : "text-gray-700 dark:text-gray-200"}`}>
          {vc.name}
        </p>
        <p className="text-[9px] text-gray-400 dark:text-gray-500 mt-0.5 leading-tight truncate">
          {vc.description}
        </p>
      </div>
    </button>
  );
}

export function VariantSwitcher() {
  const { variant, setVariant, colors } = useVariant();
  const { locale } = useLocale();
  const [open, setOpen] = useState(false);

  const lightThemes = Object.keys(variants).filter((id) => variants[id].group === "light");
  const darkThemes = Object.keys(variants).filter((id) => variants[id].group === "dark");

  return (
    <div className="fixed bottom-24 right-4 z-[60] lg:bottom-6 lg:right-6 flex flex-col items-end gap-2">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.9 }}
            transition={{ duration: 0.15 }}
            className="mb-2 w-80 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-3 shadow-2xl max-h-[80vh] overflow-y-auto"
          >
            <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 px-1 pb-2">
              {t(UI.title, locale)}
            </div>

            <div className="text-[9px] font-bold uppercase tracking-wider text-gray-300 dark:text-gray-600 px-1 pt-1 pb-1">
              ☀ {t(UI.groupLight, locale)} · {lightThemes.length}
            </div>
            <div className="grid grid-cols-1 gap-0.5 mb-2">
              {lightThemes.map((v) => (
                <ThemeButton
                  key={v}
                  v={v}
                  isActive={variant === v}
                  onClick={() => { setVariant(v); setOpen(false); }}
                />
              ))}
            </div>

            <div className="text-[9px] font-bold uppercase tracking-wider text-gray-300 dark:text-gray-600 px-1 pt-2 pb-1">
              🌙 {t(UI.groupDark, locale)} · {darkThemes.length}
            </div>
            <div className="grid grid-cols-1 gap-0.5">
              {darkThemes.map((v) => (
                <ThemeButton
                  key={v}
                  v={v}
                  isActive={variant === v}
                  onClick={() => { setVariant(v); setOpen(false); }}
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
