"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ChevronDown, Check, Plus } from "lucide-react";
import { usePet } from "@/contexts/PetContext";
import { useVariant } from "@/contexts/VariantContext";
import { useLocale } from "@/contexts/LocaleContext";

const speciesEmoji: Record<string, string> = {
  dog: "🐕",
  cat: "🐱",
  rabbit: "🐰",
  bird: "🦜",
  other: "🐾",
};

const UI = {
  switchPet: { en: "Switch pet", ru: "Сменить питомца" },
  addPet:    { en: "Add a pet",  ru: "Добавить питомца" },
};

export function PetSwitcher() {
  const { activePet, setActivePet, pets } = usePet();
  const { colors } = useVariant();
  const { locale } = useLocale();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      {/* Compact pill — just avatar + name + switch arrow.
          Pet breed / age / score are now in the dashboard cover header, not here. */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={UI.switchPet[locale]}
        className={`flex w-full items-center gap-2.5 rounded-xl ${colors.accent50} hover:opacity-80 p-2.5 transition-opacity duration-150`}
      >
        <div
          className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-base"
          style={{ backgroundColor: `${activePet.color}25` }}
        >
          {speciesEmoji[activePet.species] ?? "🐾"}
        </div>
        <p className="flex-1 min-w-0 text-left font-semibold text-gray-900 dark:text-white truncate text-sm">
          {activePet.name}
        </p>
        <ChevronDown
          className={`h-3.5 w-3.5 text-gray-400 transition-transform duration-200 flex-shrink-0 ${open ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg"
          >
            {pets.map((pet) => {
              const isActive = pet.id === activePet.id;
              return (
                <button
                  key={pet.id}
                  onClick={() => { setActivePet(pet); setOpen(false); }}
                  className={`flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50 ${isActive ? colors.accent50 : ""}`}
                >
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-lg"
                    style={{ backgroundColor: `${pet.color}25` }}>
                    {speciesEmoji[pet.species] ?? "🐾"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{pet.name}</p>
                    <p className="text-xs text-gray-400">{pet.breed}</p>
                  </div>
                  {isActive && <Check className={`h-4 w-4 ${colors.activeIcon} flex-shrink-0`} />}
                </button>
              );
            })}

            <div className="border-t border-gray-100 dark:border-gray-700 px-3 py-2">
              <button className="flex w-full items-center gap-1.5 text-xs text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors py-1">
                <Plus className="h-3 w-3" />
                {UI.addPet[locale]}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {open && (
        <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
      )}
    </div>
  );
}
