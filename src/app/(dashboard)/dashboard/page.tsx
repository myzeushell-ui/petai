"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ThemedHome, setPetData, setCareItems } from "@/components/PetAiDesigns";
import { usePet } from "@/contexts/PetContext";
import { useVariant } from "@/contexts/VariantContext";
import { useLocale } from "@/contexts/LocaleContext";
import { reminders } from "@/data/reminders";
import { t } from "@/lib/i18n";

/**
 * /dashboard — renders the bespoke home layout for the currently active
 * theme (one of 20 from PetAiDesigns.tsx). Each theme has its own
 * layout, button placement, iconography — not just a recoloured shell.
 *
 * Real pet data from PetContext is injected into the mock module
 * (PetAiDesigns uses module-scoped `let PET` so we can swap values).
 *
 * The previous flat-card dashboard is preserved at /dashboard-classic
 * for users who prefer the simpler layout.
 */

const UI = {
  classicLink: { en: "Use classic dashboard", ru: "Классический дашборд" },
};

const SPECIES_EMOJI: Record<string, string> = {
  dog: "🐕",
  cat: "🐱",
  rabbit: "🐰",
  bird: "🦜",
  other: "🐾",
};

export default function DashboardPage() {
  const { activePet } = usePet();
  const { variant, colors } = useVariant();
  const { locale } = useLocale();
  const router = useRouter();

  // Inject real pet data into the mock module before the themed
  // layout renders. Module-scoped variable mutation — V1 trade-off,
  // future iterations should switch to a proper PetDataContext.
  useEffect(() => {
    setPetData({
      id: activePet.id,
      name: activePet.name,
      breed: activePet.breed,
      ageLabel: `${activePet.age} ${activePet.age === 1 ? "year" : "years"}`,
      moodScore: activePet.healthScore,
      emoji: SPECIES_EMOJI[activePet.species] ?? "🐾",
    });

    const top = reminders
      .filter((r) => !r.completed)
      .slice(0, 4)
      .map((r) => {
        const icon =
          r.type === "medication" ? "💊" :
          r.type === "vaccination" ? "💉" :
          r.type === "checkup" ? "🩺" :
          r.type === "grooming" ? "✂️" : "📌";
        return {
          title: r.title.length > 40 ? r.title.slice(0, 38) + "…" : r.title,
          due: new Date(r.dueDate).toLocaleDateString(locale === "ru" ? "ru-RU" : "en-US", { month: "short", day: "numeric", timeZone: "UTC" }),
          icon,
          done: r.completed,
        };
      });
    if (top.length > 0) setCareItems(top);
  }, [activePet, locale]);

  return (
    <div className="-m-4 sm:-m-6 lg:-m-8 relative min-h-screen">
      {/* Themed bespoke home layout for the active theme */}
      <ThemedHome
        themeId={variant}
        onScan={() => router.push("/labs")}
        onOpenPet={() => router.push("/breeds")}
      />

      {/* Back-door link to the classic flat-card dashboard */}
      <div className="fixed bottom-24 left-4 z-[55] lg:bottom-6 lg:left-6">
        <Link
          href="/dashboard-classic"
          className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider ${colors.btnGhost} bg-black/30 backdrop-blur-md text-white hover:bg-black/45 transition-colors`}
        >
          ↩ {t(UI.classicLink, locale)}
        </Link>
      </div>
    </div>
  );
}
