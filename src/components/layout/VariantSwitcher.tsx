"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Palette } from "lucide-react";
import { useVariant, variants, type VariantId } from "@/contexts/VariantContext";

const variantList: VariantId[] = ["emerald", "ocean", "sunset"];

export function VariantSwitcher() {
  const { variant, setVariant, colors } = useVariant();
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
            className="mb-2 flex flex-col gap-1.5 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-2 shadow-xl"
          >
            {variantList.map((v) => {
              const vc = variants[v];
              const isActive = variant === v;
              return (
                <button
                  key={v}
                  onClick={() => {
                    setVariant(v);
                    setOpen(false);
                  }}
                  className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-left transition-all ${
                    isActive
                      ? "bg-gray-100 dark:bg-gray-700 ring-2 ring-gray-300 dark:ring-gray-500"
                      : "hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  }`}
                >
                  <span className="text-xl">{vc.emoji}</span>
                  <div>
                    <p className={`text-sm font-semibold ${isActive ? "text-gray-900 dark:text-white" : "text-gray-700 dark:text-gray-200"}`}>
                      {vc.name}
                    </p>
                    <p className="text-[10px] text-gray-400">{vc.description}</p>
                  </div>
                  {isActive && (
                    <span className="ml-auto text-xs font-medium text-gray-500">Active</span>
                  )}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(!open)}
        className={`flex h-12 w-12 items-center justify-center rounded-full ${colors.logoBg} text-white shadow-lg transition-transform`}
      >
        <Palette className="h-5 w-5" />
      </motion.button>
    </div>
  );
}
