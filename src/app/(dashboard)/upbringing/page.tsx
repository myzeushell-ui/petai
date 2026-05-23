"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { GraduationCap, Search, X } from "lucide-react";
import { UpbringingTimeline } from "@/components/upbringing/UpbringingTimeline";
import { LIFE_STAGES, getStageForAge } from "@/data/upbringing";
import { dogBreeds } from "@/data/breeds";
import { useLocale } from "@/contexts/LocaleContext";
import { t } from "@/lib/i18n";
import { usePet } from "@/contexts/PetContext";
import { cn } from "@/lib/utils";

const UI = {
  title:           { en: "Upbringing & Training",  ru: "Воспитание и дрессировка" },
  subtitle:        { en: "Life-stage guide for your dog, synced to age and breed.", ru: "Гид по этапам жизни собаки, синхронизированный с возрастом и породой." },
  selectBreed:     { en: "Breed for guidance",     ru: "Порода для рекомендаций" },
  universal:       { en: "Universal (any breed)",  ru: "Универсально (любая порода)" },
  showingFor:      { en: "Showing recommendations for", ru: "Показываю рекомендации для" },
  searchBreed:     { en: "Search breed…",          ru: "Поиск породы…" },
  petStageNotice:  { en: "Highlighted: stage of your active pet", ru: "Выделено: этап вашего активного питомца" },
};

export default function UpbringingPage() {
  const { locale } = useLocale();
  const { activePet } = usePet();
  const [breedId, setBreedId] = useState<string | undefined>(() => {
    // Default to active pet's breed if it's a dog
    if (activePet.species === "dog") {
      const slug = activePet.breed.toLowerCase().replace(/\s+/g, "-");
      const match = dogBreeds.find((b) =>
        b.id === slug || b.name.toLowerCase() === activePet.breed.toLowerCase()
      );
      return match?.id;
    }
    return undefined;
  });
  const [search, setSearch] = useState("");

  const petStage = activePet.species === "dog" ? getStageForAge(activePet.age) : null;

  const filteredBreeds = useMemo(() => {
    if (!search) return dogBreeds;
    const q = search.toLowerCase();
    return dogBreeds.filter((b) => b.name.toLowerCase().includes(q));
  }, [search]);

  const selectedBreed = breedId ? dogBreeds.find((b) => b.id === breedId) : undefined;

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-lg shadow-emerald-200 dark:shadow-emerald-950">
            <GraduationCap className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t(UI.title, locale)}</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">{t(UI.subtitle, locale)}</p>
          </div>
        </div>
      </motion.div>

      {/* Breed selector */}
      <div className="rounded-2xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            {t(UI.selectBreed, locale)}
          </div>
          {breedId && (
            <button
              onClick={() => setBreedId(undefined)}
              className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white flex items-center gap-1"
            >
              <X className="h-3 w-3" />
              {t(UI.universal, locale)}
            </button>
          )}
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t(UI.searchBreed, locale)}
            className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 pl-10 pr-4 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 dark:focus:ring-emerald-900/30"
          />
        </div>

        <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
          <button
            onClick={() => setBreedId(undefined)}
            className={cn(
              "rounded-full px-3 py-1 text-xs font-medium transition-colors",
              !breedId
                ? "bg-emerald-500 text-white"
                : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
            )}
          >
            {t(UI.universal, locale)}
          </button>
          {filteredBreeds.map((b) => (
            <button
              key={b.id}
              onClick={() => setBreedId(b.id)}
              className={cn(
                "flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium transition-colors",
                breedId === b.id
                  ? "bg-emerald-500 text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              )}
            >
              <span>{b.emoji}</span>
              {b.name}
            </button>
          ))}
        </div>

        {selectedBreed && (
          <div className="text-xs text-gray-600 dark:text-gray-300 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg px-3 py-2 flex items-center gap-2">
            <span className="text-base">{selectedBreed.emoji}</span>
            <span>
              <span className="text-gray-400">{t(UI.showingFor, locale)}:</span>{" "}
              <span className="font-semibold text-gray-900 dark:text-white">{selectedBreed.name}</span>
            </span>
          </div>
        )}
      </div>

      {petStage && (
        <div className="text-xs text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 rounded-xl px-3 py-2">
          ✨ {t(UI.petStageNotice, locale)}: <span className="font-bold">{activePet.name}</span> · {t(petStage.label, locale)}
        </div>
      )}

      <UpbringingTimeline
        breedId={breedId}
        highlightStage={petStage?.id}
      />
    </div>
  );
}
