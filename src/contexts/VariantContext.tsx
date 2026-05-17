"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";

export type VariantId = "emerald" | "ocean" | "sunset";

export interface VariantColors {
  id: VariantId;
  name: string;
  emoji: string;
  description: string;
  layout: "sidebar" | "topnav" | "dock";
  defaultDark: boolean;
  // Logo & brand
  logoBg: string;
  avatarGradient: string;
  // Sidebar / Nav active states
  activeBg: string;
  activeText: string;
  activeIcon: string;
  inactiveIcon: string;
  navLine: string;
  // Buttons
  btnPrimary: string;
  btnGhost: string;
  // Landing page
  heroGradient: string;
  ctaGradient: string;
  badgeBorder: string;
  badgeBg: string;
  badgeText: string;
  badgeDot: string;
  pillActive: string;
  shadow: string;
  // Cards & accents
  accent50: string;
  accent100: string;
  accentText: string;
  accentTextDark: string;
  // Misc
  popularBadge: string;
  scoreColor: string;
  focusRing: string;
  // Layout-specific
  shellBg: string;
  cardStyle: string;
  headerStyle: string;
  animationType: "fade" | "slide" | "scale";
}

export const variants: Record<VariantId, VariantColors> = {
  emerald: {
    id: "emerald",
    name: "Emerald",
    emoji: "🌿",
    description: "Classic sidebar layout",
    layout: "sidebar",
    defaultDark: false,
    logoBg: "bg-green-500",
    avatarGradient: "from-green-400 to-blue-500",
    activeBg: "bg-green-50 dark:bg-green-950/40",
    activeText: "text-green-700 dark:text-green-400",
    activeIcon: "text-green-600 dark:text-green-400",
    inactiveIcon: "text-gray-400",
    navLine: "bg-green-500",
    btnPrimary: "bg-green-500 hover:bg-green-600 text-white",
    btnGhost: "hover:bg-green-50 dark:hover:bg-green-950/30",
    heroGradient: "from-green-50 via-white to-white",
    ctaGradient: "from-green-500 to-emerald-600",
    badgeBorder: "border-green-200",
    badgeBg: "bg-green-50",
    badgeText: "text-green-700",
    badgeDot: "bg-green-500",
    pillActive: "bg-green-500 text-white shadow-sm",
    shadow: "shadow-green-200",
    accent50: "bg-green-50",
    accent100: "bg-green-100",
    accentText: "text-green-600",
    accentTextDark: "text-green-700",
    popularBadge: "bg-green-500",
    scoreColor: "text-green-600",
    focusRing: "focus:ring-green-100 focus:border-green-400",
    shellBg: "bg-gray-50 dark:bg-[#0a0a0f]",
    cardStyle: "rounded-2xl border border-gray-100 bg-white dark:bg-gray-900 dark:border-gray-800 shadow-sm",
    headerStyle: "border-b border-gray-100 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm",
    animationType: "fade",
  },
  ocean: {
    id: "ocean",
    name: "Ocean",
    emoji: "🌊",
    description: "Top tabs, modern SaaS",
    layout: "topnav",
    defaultDark: false,
    logoBg: "bg-indigo-500",
    avatarGradient: "from-indigo-400 to-cyan-500",
    activeBg: "bg-indigo-50 dark:bg-indigo-950/40",
    activeText: "text-indigo-700 dark:text-indigo-400",
    activeIcon: "text-indigo-600 dark:text-indigo-400",
    inactiveIcon: "text-gray-400",
    navLine: "bg-indigo-500",
    btnPrimary: "bg-indigo-500 hover:bg-indigo-600 text-white",
    btnGhost: "hover:bg-indigo-50 dark:hover:bg-indigo-950/30",
    heroGradient: "from-indigo-50 via-white to-white",
    ctaGradient: "from-indigo-500 to-cyan-600",
    badgeBorder: "border-indigo-200",
    badgeBg: "bg-indigo-50",
    badgeText: "text-indigo-700",
    badgeDot: "bg-indigo-500",
    pillActive: "bg-indigo-500 text-white shadow-sm",
    shadow: "shadow-indigo-200",
    accent50: "bg-indigo-50",
    accent100: "bg-indigo-100",
    accentText: "text-indigo-600",
    accentTextDark: "text-indigo-700",
    popularBadge: "bg-indigo-500",
    scoreColor: "text-indigo-600",
    focusRing: "focus:ring-indigo-100 focus:border-indigo-400",
    shellBg: "bg-white dark:bg-[#0a0a0f]",
    cardStyle: "rounded-xl border border-indigo-100 dark:border-indigo-900/40 bg-white dark:bg-gray-900 shadow-md hover:shadow-indigo-100 dark:hover:shadow-indigo-950/20",
    headerStyle: "border-b-2 border-indigo-100 dark:border-indigo-900 bg-white dark:bg-gray-900",
    animationType: "slide",
  },
  sunset: {
    id: "sunset",
    name: "Sunset",
    emoji: "🌅",
    description: "Floating dock, premium",
    layout: "dock",
    defaultDark: true,
    logoBg: "bg-gradient-to-br from-amber-400 to-orange-500",
    avatarGradient: "from-amber-400 to-rose-500",
    activeBg: "bg-amber-50 dark:bg-amber-950/40",
    activeText: "text-amber-700 dark:text-amber-400",
    activeIcon: "text-amber-500 dark:text-amber-400",
    inactiveIcon: "text-gray-500 dark:text-gray-500",
    navLine: "bg-amber-500",
    btnPrimary: "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white",
    btnGhost: "hover:bg-amber-50 dark:hover:bg-amber-950/30",
    heroGradient: "from-amber-50 via-white to-white",
    ctaGradient: "from-amber-500 to-orange-600",
    badgeBorder: "border-amber-200",
    badgeBg: "bg-amber-50",
    badgeText: "text-amber-700",
    badgeDot: "bg-amber-500",
    pillActive: "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-200",
    shadow: "shadow-amber-200",
    accent50: "bg-amber-50",
    accent100: "bg-amber-100",
    accentText: "text-amber-600",
    accentTextDark: "text-amber-700",
    popularBadge: "bg-gradient-to-r from-amber-500 to-orange-500",
    scoreColor: "text-amber-600",
    focusRing: "focus:ring-amber-100 focus:border-amber-400",
    shellBg: "bg-gray-50 dark:bg-[#0d0d12]",
    cardStyle: "rounded-3xl border border-white/10 bg-white/80 dark:bg-white/5 backdrop-blur-lg shadow-xl dark:shadow-amber-950/10",
    headerStyle: "bg-transparent dark:bg-transparent",
    animationType: "scale",
  },
};

const VARIANT_ORDER: VariantId[] = ["emerald", "ocean", "sunset"];

interface VariantContextValue {
  variant: VariantId;
  colors: VariantColors;
  setVariant: (v: VariantId) => void;
  cycleVariant: () => void;
  allVariants: typeof variants;
}

const VariantContext = createContext<VariantContextValue>({
  variant: "emerald",
  colors: variants.emerald,
  setVariant: () => {},
  cycleVariant: () => {},
  allVariants: variants,
});

export function VariantProvider({ children }: { children: ReactNode }) {
  const [variant, setVariantState] = useState<VariantId>("emerald");

  useEffect(() => {
    const saved = localStorage.getItem("petai-variant") as VariantId | null;
    if (saved && variants[saved]) {
      setVariantState(saved);
    }
  }, []);

  const setVariant = useCallback((v: VariantId) => {
    setVariantState(v);
    localStorage.setItem("petai-variant", v);
  }, []);

  const cycleVariant = useCallback(() => {
    setVariantState((prev) => {
      const idx = VARIANT_ORDER.indexOf(prev);
      const next = VARIANT_ORDER[(idx + 1) % VARIANT_ORDER.length];
      localStorage.setItem("petai-variant", next);
      return next;
    });
  }, []);

  return (
    <VariantContext.Provider
      value={{
        variant,
        colors: variants[variant],
        setVariant,
        cycleVariant,
        allVariants: variants,
      }}
    >
      {children}
    </VariantContext.Provider>
  );
}

export function useVariant() {
  return useContext(VariantContext);
}
