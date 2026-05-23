"use client";

import { use } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Heart, Home, Dumbbell, Scissors, Baby, AlertCircle } from "lucide-react";
import { allBreeds } from "@/data/breeds";
import { UpbringingTimeline } from "@/components/upbringing/UpbringingTimeline";
import { useLocale } from "@/contexts/LocaleContext";
import { t } from "@/lib/i18n";
import { Badge } from "@/components/ui/badge";
import { usePet } from "@/contexts/PetContext";
import { getStageForAge } from "@/data/upbringing";

const sizeLabelsBilingual = {
  small: { en: "Small", ru: "Малая" },
  medium: { en: "Medium", ru: "Средняя" },
  large: { en: "Large", ru: "Крупная" },
  giant: { en: "Giant", ru: "Гигантская" },
};

const activityLabelsBilingual = {
  low: { en: "Low", ru: "Низкая" },
  medium: { en: "Medium", ru: "Средняя" },
  high: { en: "High", ru: "Высокая" },
  very_high: { en: "Very high", ru: "Очень высокая" },
};

const groomingLabelsBilingual = {
  low: { en: "Minimal", ru: "Минимальный" },
  medium: { en: "Moderate", ru: "Умеренный" },
  high: { en: "Demanding", ru: "Требовательный" },
};

const UI = {
  back:           { en: "All breeds",       ru: "Все породы" },
  notFound:       { en: "Breed not found",  ru: "Порода не найдена" },
  origin:         { en: "Origin",           ru: "Происхождение" },
  weight:         { en: "Weight",           ru: "Вес" },
  lifespan:       { en: "Lifespan",         ru: "Срок жизни" },
  size:           { en: "Size",             ru: "Размер" },
  activity:       { en: "Activity",         ru: "Активность" },
  grooming:       { en: "Grooming",         ru: "Груминг" },
  shedding:       { en: "Shedding",         ru: "Линька" },
  traits:         { en: "Personality",      ru: "Характер" },
  healthRisks:    { en: "Health risks to watch", ru: "Риски для здоровья" },
  goodWithKids:   { en: "Good with kids",   ru: "С детьми" },
  goodWithPets:   { en: "Good with pets",   ru: "С другими питомцами" },
  apartment:      { en: "Apartment-friendly", ru: "Подходит для квартиры" },
  upbringingTitle:{ en: "Lifecycle Upbringing Guide", ru: "Гид по воспитанию по этапам" },
  upbringingSub:  { en: "Breed-specific recommendations synced to age", ru: "Породные рекомендации по возрасту" },
};

export default function BreedDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { locale } = useLocale();
  const { activePet } = usePet();
  const breed = allBreeds.find((b) => b.id === id);

  if (!breed) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">{t(UI.notFound, locale)}</p>
        <Link href="/breeds" className="text-emerald-600 dark:text-emerald-400 underline mt-3 inline-block">
          ← {t(UI.back, locale)}
        </Link>
      </div>
    );
  }

  // Highlight stage of the user's pet if it matches this breed
  const isUsersBreed =
    activePet.species === breed.species &&
    activePet.breed.toLowerCase().replace(/\s+/g, "-") === breed.id;
  const highlightStage = isUsersBreed ? getStageForAge(activePet.age).id : undefined;

  return (
    <div className="space-y-6">
      <Link
        href="/breeds"
        className="inline-flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        {t(UI.back, locale)}
      </Link>

      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="rounded-2xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-50 dark:bg-gray-900 text-4xl">
              {breed.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{breed.name}</h1>
                <Badge variant={breed.species === "dog" ? "success" : "info"}>
                  {breed.species === "dog" ? (locale === "ru" ? "Собака" : "Dog") : (locale === "ru" ? "Кот" : "Cat")}
                </Badge>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {breed.group} · {t(UI.origin, locale)}: {breed.origin}
              </p>

              <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <Stat label={t(UI.size, locale)} value={t(sizeLabelsBilingual[breed.size], locale)} />
                <Stat label={t(UI.weight, locale)} value={breed.weight} />
                <Stat label={t(UI.lifespan, locale)} value={breed.lifespan} />
                <Stat label={t(UI.activity, locale)} value={t(activityLabelsBilingual[breed.activity], locale)} />
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {breed.goodWithKids && (
                  <Pill icon={<Baby className="h-3 w-3" />} label={t(UI.goodWithKids, locale)} color="green" />
                )}
                {breed.goodWithPets && (
                  <Pill icon={<Heart className="h-3 w-3" />} label={t(UI.goodWithPets, locale)} color="blue" />
                )}
                {breed.apartment && (
                  <Pill icon={<Home className="h-3 w-3" />} label={t(UI.apartment, locale)} color="purple" />
                )}
                <Pill icon={<Scissors className="h-3 w-3" />} label={`${t(UI.grooming, locale)}: ${t(groomingLabelsBilingual[breed.grooming], locale)}`} color="orange" />
                <Pill icon={<Dumbbell className="h-3 w-3" />} label={`${t(UI.activity, locale)}: ${t(activityLabelsBilingual[breed.activity], locale)}`} color="cyan" />
              </div>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">{t(UI.traits, locale)}</p>
              <div className="flex flex-wrap gap-1.5">
                {breed.traits.map((trait) => (
                  <span key={trait} className="rounded-full bg-gray-100 dark:bg-gray-700 px-2.5 py-1 text-xs text-gray-700 dark:text-gray-200">
                    {trait}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {t(UI.healthRisks, locale)}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {breed.healthIssues.map((issue) => (
                  <Badge key={issue} variant="warning" className="text-[11px]">{issue}</Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Lifecycle upbringing — only for dogs */}
      {breed.species === "dog" && (
        <div>
          <div className="mb-3">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">{t(UI.upbringingTitle, locale)}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">{t(UI.upbringingSub, locale)}</p>
          </div>
          <UpbringingTimeline breedId={breed.id} highlightStage={highlightStage} />
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-gray-50 dark:bg-gray-900 p-2.5">
      <p className="text-[10px] uppercase tracking-wider text-gray-400">{label}</p>
      <p className="font-medium text-gray-900 dark:text-white text-sm mt-0.5">{value}</p>
    </div>
  );
}

function Pill({ icon, label, color }: { icon: React.ReactNode; label: string; color: string }) {
  const colorMap: Record<string, string> = {
    green:  "bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-400",
    blue:   "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400",
    purple: "bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-400",
    orange: "bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-400",
    cyan:   "bg-cyan-50 dark:bg-cyan-950/40 text-cyan-700 dark:text-cyan-400",
  };
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium ${colorMap[color]}`}>
      {icon}
      {label}
    </span>
  );
}
