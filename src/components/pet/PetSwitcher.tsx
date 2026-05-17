"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ChevronDown, Check } from "lucide-react";
import { usePet } from "@/contexts/PetContext";

const speciesEmoji: Record<string, string> = {
  dog: "🐕",
  cat: "🐱",
  rabbit: "🐰",
  bird: "🦜",
  other: "🐾",
};

export function PetSwitcher() {
  const { activePet, setActivePet, pets } = usePet();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 hover:bg-amber-100 dark:hover:bg-amber-950/50 p-3 transition-colors duration-150"
      >
        <div
          className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-xl"
          style={{ backgroundColor: `${activePet.color}20` }}
        >
          {speciesEmoji[activePet.species] ?? "🐾"}
        </div>
        <div className="flex-1 min-w-0 text-left">
          <p className="font-semibold text-gray-900 dark:text-white truncate text-sm">{activePet.name}</p>
          <p className="text-xs text-gray-500">{activePet.breed} · {activePet.age}y</p>
        </div>
        <div className="flex flex-col items-end gap-0.5">
          <p className="text-sm font-bold text-green-600">{activePet.healthScore}</p>
          <ChevronDown className={`h-3.5 w-3.5 text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
        </div>
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
                  className={`flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors hover:bg-gray-50 ${isActive ? "bg-green-50" : ""}`}
                >
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-lg"
                    style={{ backgroundColor: `${pet.color}20` }}>
                    {speciesEmoji[pet.species] ?? "🐾"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{pet.name}</p>
                    <p className="text-xs text-gray-400">{pet.breed} · Score: {pet.healthScore}</p>
                  </div>
                  {isActive && <Check className="h-4 w-4 text-green-500 flex-shrink-0" />}
                </button>
              );
            })}

            <div className="border-t border-gray-100 px-3 py-2">
              <button className="flex w-full items-center gap-2 text-xs text-gray-400 hover:text-green-600 transition-colors py-1">
                <span>+</span> Добавить питомца
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
