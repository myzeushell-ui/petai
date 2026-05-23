"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, GraduationCap, Star, Siren } from "lucide-react";
import { getStageForAge, getStageContent, getNextStage } from "@/data/upbringing";
import { useLocale } from "@/contexts/LocaleContext";
import { t, tList } from "@/lib/i18n";
import { usePet } from "@/contexts/PetContext";

export function CurrentStageCard() {
  const { activePet } = usePet();
  const { locale } = useLocale();

  if (activePet.species !== "dog") return null;

  const stage = getStageForAge(activePet.age);
  const nextStage = getNextStage(stage.id);
  const breedId = breedNameToId(activePet.breed);
  const content = getStageContent(stage.id, breedId);

  const topPriorities = tList(content.topPriorities, locale).slice(0, 3);
  const topRedFlags = tList(content.redFlags, locale).slice(0, 2);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="rounded-2xl border border-emerald-200 dark:border-emerald-900 bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-950/40 dark:to-gray-900 p-5 shadow-sm"
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-900/50 text-xl">
            {stage.emoji}
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              {locale === "ru" ? "Этап жизни сейчас" : "Current life stage"}
            </div>
            <div className="font-bold text-gray-900 dark:text-white text-base leading-tight">
              {t(stage.label, locale)} · {t(stage.ageRange, locale)}
            </div>
          </div>
        </div>
        <Link
          href="/upbringing"
          className="text-emerald-600 dark:text-emerald-400 text-xs font-semibold hover:underline flex items-center gap-0.5 mt-1 flex-shrink-0"
        >
          {locale === "ru" ? "Подробнее" : "Open"}
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      <p className="text-sm text-gray-700 dark:text-gray-200 mb-4 leading-relaxed">
        {t(stage.oneLiner, locale)}
      </p>

      {topPriorities.length > 0 && (
        <div className="mb-3">
          <div className="flex items-center gap-1.5 mb-2">
            <Star className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
              {locale === "ru" ? `Главное сейчас для ${activePet.name}` : `Focus for ${activePet.name} now`}
            </span>
          </div>
          <ul className="space-y-1.5">
            {topPriorities.map((item, i) => (
              <li key={i} className="text-xs text-gray-700 dark:text-gray-200 flex gap-1.5 leading-relaxed">
                <span className="text-emerald-500 flex-shrink-0">▸</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {topRedFlags.length > 0 && (
        <div className="rounded-xl border border-red-200 dark:border-red-900 bg-red-50/60 dark:bg-red-950/30 p-3 mb-3">
          <div className="flex items-center gap-1.5 mb-1.5">
            <Siren className="h-3.5 w-3.5 text-red-600 dark:text-red-400" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-red-700 dark:text-red-300">
              {locale === "ru" ? "Срочно к врачу, если" : "Vet ER if"}
            </span>
          </div>
          <ul className="space-y-1">
            {topRedFlags.map((item, i) => (
              <li key={i} className="text-xs text-red-900 dark:text-red-100 leading-relaxed">
                • {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {nextStage && (
        <div className="text-[11px] text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-gray-800 pt-3 flex items-center gap-1.5">
          <GraduationCap className="h-3 w-3" />
          {locale === "ru" ? "Следующий этап: " : "Next stage: "}
          <span className="font-semibold text-gray-700 dark:text-gray-300">
            {t(nextStage.label, locale)} · {t(nextStage.ageRange, locale)}
          </span>
        </div>
      )}
    </motion.div>
  );
}

/**
 * Map a pet's `breed` string (e.g. "Golden Retriever") to the id used in breeds.ts ("golden-retriever").
 * Simple slugifier — handles 95% of cases. Unmatched → undefined (universal content only).
 */
function breedNameToId(breedName: string): string | undefined {
  if (!breedName) return undefined;
  const id = breedName.toLowerCase().trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "")
    .replace(/^(siberian|pembroke-welsh|yorkshire)-/, (_, p1) =>
      p1 === "siberian" ? "" : p1 === "pembroke-welsh" ? "" : p1 === "yorkshire" ? "yorkshire-" : "")
    // common aliases
    .replace(/^husky.*$/, "husky")
    .replace(/^corgi.*$/, "corgi");
  // Map common full names to expected ids
  const aliases: Record<string, string> = {
    "golden-retriever": "golden-retriever",
    "labrador-retriever": "labrador",
    "labrador": "labrador",
    "german-shepherd": "german-shepherd",
    "french-bulldog": "french-bulldog",
    "poodle": "poodle",
    "husky": "husky",
    "corgi": "corgi",
    "doberman-pinscher": "doberman",
    "doberman": "doberman",
    "beagle": "beagle",
    "yorkshire-terrier": "yorkshire-terrier",
    "dachshund": "dachshund",
    "shiba-inu": "shiba-inu",
    "boxer": "boxer",
    "akita": "akita",
    "samoyed": "samoyed",
    "border-collie": "border-collie",
    "rottweiler": "rottweiler",
    "cavalier-king-charles-spaniel": "cavalier",
    "australian-shepherd": "australian-shepherd",
    "chihuahua": "chihuahua",
  };
  return aliases[id] ?? id;
}
