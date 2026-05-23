"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, AlertTriangle, Heart, Users, Utensils, Ban, Syringe, Siren, Star } from "lucide-react";
import { LIFE_STAGES, getStageContent, getBreedAlwaysNotes, type LifeStageId } from "@/data/upbringing";
import { useLocale } from "@/contexts/LocaleContext";
import { t, tList, type LocaleString } from "@/lib/i18n";
import { cn } from "@/lib/utils";

interface UpbringingTimelineProps {
  breedId?: string;
  highlightStage?: LifeStageId;   // expand this stage by default
}

// UI string bag for the section labels
const UI = {
  topPriorities:  { en: "Top priorities",      ru: "Главные приоритеты" },
  training:       { en: "Training",            ru: "Дрессировка" },
  care:           { en: "Care",                ru: "Уход" },
  socialization:  { en: "Socialization",       ru: "Социализация" },
  nutrition:      { en: "Nutrition",           ru: "Питание" },
  dangers:        { en: "What NOT to do",      ru: "Чего НЕЛЬЗЯ делать" },
  vetMilestones:  { en: "Vet milestones",      ru: "Вет-вехи" },
  redFlags:       { en: "Red flags — call vet",ru: "Красные флаги — к врачу" },
  alwaysNote:     { en: "Breed-wide notes",    ru: "Заметки по породе (всегда)" },
};

const SECTION_DEFS: Array<{ key: keyof ReturnType<typeof getStageContent>; label: LocaleString; Icon: any; tone: string }> = [
  { key: "topPriorities", label: UI.topPriorities, Icon: Star,          tone: "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900" },
  { key: "training",      label: UI.training,      Icon: Heart,         tone: "bg-blue-50    dark:bg-blue-950/30    text-blue-700    dark:text-blue-300    border-blue-200    dark:border-blue-900" },
  { key: "socialization", label: UI.socialization, Icon: Users,         tone: "bg-purple-50  dark:bg-purple-950/30  text-purple-700  dark:text-purple-300  border-purple-200  dark:border-purple-900" },
  { key: "care",          label: UI.care,          Icon: Heart,         tone: "bg-amber-50   dark:bg-amber-950/30   text-amber-700   dark:text-amber-300   border-amber-200   dark:border-amber-900" },
  { key: "nutrition",     label: UI.nutrition,     Icon: Utensils,      tone: "bg-orange-50  dark:bg-orange-950/30  text-orange-700  dark:text-orange-300  border-orange-200  dark:border-orange-900" },
  { key: "vetMilestones", label: UI.vetMilestones, Icon: Syringe,       tone: "bg-cyan-50    dark:bg-cyan-950/30    text-cyan-700    dark:text-cyan-300    border-cyan-200    dark:border-cyan-900" },
  { key: "dangers",       label: UI.dangers,       Icon: Ban,           tone: "bg-rose-50    dark:bg-rose-950/30    text-rose-700    dark:text-rose-300    border-rose-200    dark:border-rose-900" },
  { key: "redFlags",      label: UI.redFlags,      Icon: Siren,         tone: "bg-red-50     dark:bg-red-950/30     text-red-700     dark:text-red-300     border-red-200     dark:border-red-900" },
];

export function UpbringingTimeline({ breedId, highlightStage }: UpbringingTimelineProps) {
  const { locale } = useLocale();
  const [openStage, setOpenStage] = useState<LifeStageId | null>(highlightStage ?? null);

  const breedNotes = breedId ? getBreedAlwaysNotes(breedId) : [];

  return (
    <div className="space-y-4">
      {/* Breed-wide always notes (rendered above the timeline) */}
      {breedNotes.length > 0 && (
        <div className="space-y-2">
          {breedNotes.map((note, i) => (
            <div
              key={i}
              className="rounded-2xl border border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/30 p-4"
            >
              <div className="flex items-start gap-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                    {t(UI.alwaysNote, locale)} · {t(note.archetype, locale)}
                  </div>
                </div>
              </div>
              <ul className="space-y-1.5 ml-1">
                {tList(note.always, locale).map((item, j) => (
                  <li key={j} className="text-sm text-amber-900 dark:text-amber-100 flex gap-2">
                    <span className="text-amber-500">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Life stage timeline */}
      <ol className="relative space-y-3 before:absolute before:left-5 before:top-2 before:bottom-2 before:w-px before:bg-gray-200 dark:before:bg-gray-700">
        {LIFE_STAGES.map((stage, idx) => {
          const isOpen = openStage === stage.id;
          const isHighlighted = stage.id === highlightStage;
          const content = getStageContent(stage.id, breedId);
          return (
            <li key={stage.id} className="relative pl-14">
              <div className={cn(
                "absolute left-0 top-0 z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 shadow-sm text-lg",
                isHighlighted
                  ? "bg-emerald-500 border-emerald-600 text-white"
                  : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
              )}>
                {stage.emoji}
              </div>

              <button
                onClick={() => setOpenStage(isOpen ? null : stage.id)}
                className={cn(
                  "w-full text-left rounded-2xl border bg-white dark:bg-gray-800 p-4 transition-all hover:shadow-md",
                  isOpen
                    ? "border-emerald-300 dark:border-emerald-700 shadow-sm"
                    : "border-gray-100 dark:border-gray-700",
                  isHighlighted && !isOpen && "ring-2 ring-emerald-400 ring-offset-2 dark:ring-offset-gray-900"
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-gray-900 dark:text-white text-base">
                        {t(stage.label, locale)}
                      </h3>
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full">
                        {t(stage.ageRange, locale)}
                      </span>
                      {isHighlighted && (
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-500 text-white px-2 py-0.5 rounded-full">
                          {locale === "ru" ? "сейчас" : "now"}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1.5 leading-relaxed">
                      {t(stage.oneLiner, locale)}
                    </p>
                  </div>
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 text-gray-400 transition-transform flex-shrink-0 mt-1",
                      isOpen && "rotate-180"
                    )}
                  />
                </div>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 grid grid-cols-1 md:grid-cols-2 gap-3">
                        {SECTION_DEFS.map(({ key, label, Icon, tone }) => {
                          const items = tList(content[key], locale);
                          if (items.length === 0) return null;
                          return (
                            <div
                              key={key as string}
                              className={cn("rounded-xl border p-3", tone)}
                            >
                              <div className="flex items-center gap-1.5 mb-2">
                                <Icon className="h-3.5 w-3.5" />
                                <span className="text-[10px] font-bold uppercase tracking-wider">
                                  {t(label, locale)}
                                </span>
                              </div>
                              <ul className="space-y-1.5">
                                {items.map((item, i) => (
                                  <li key={i} className="text-xs leading-relaxed flex gap-1.5">
                                    <span className="opacity-50 flex-shrink-0">▸</span>
                                    <span>{item}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
