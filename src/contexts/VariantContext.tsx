"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";

/**
 * PetAI Design v2 — 6 official themes ported from public/design-previews.html
 * Mirrors the palette already used in the mobile app (mobile/ commit f36ee9b).
 *
 * Group 1 (warm/premium, sidebar layout):
 *   1A terracotta · 1B sage · 1C peach
 * Group 2 (glass/aurora, dock layout):
 *   2A aurora · 2B deepOcean · 2C sunrise
 */
export type VariantId = "terracotta" | "sage" | "peach" | "aurora" | "deepOcean" | "sunrise";

export interface VariantColors {
  id: VariantId;
  name: string;
  emoji: string;
  description: string;
  group: "warm" | "glass";
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
  // ─────────────────── 1A · TERRACOTTA — warm earth, premium ──────────────
  terracotta: {
    id: "terracotta",
    name: "Terracotta",
    emoji: "🏺",
    description: "Warm earth · Premium serif",
    group: "warm",
    layout: "sidebar",
    defaultDark: false,
    logoBg: "bg-[#C2562A]",
    avatarGradient: "from-[#C2562A] to-[#E8B496]",
    activeBg: "bg-[#F4D7C5] dark:bg-[#2A1A0F]",
    activeText: "text-[#2A2520] dark:text-[#F4D7C5]",
    activeIcon: "text-[#C2562A]",
    inactiveIcon: "text-[#B8A89B] dark:text-[#5A4A3F]",
    navLine: "bg-[#C2562A]",
    btnPrimary: "bg-[#2A2520] hover:bg-[#1a1612] text-white",
    btnGhost: "hover:bg-[#F4D7C5] dark:hover:bg-[#2A1A0F]",
    heroGradient: "from-[#FDF8F3] via-[#FCEEDF] to-white",
    ctaGradient: "from-[#C2562A] to-[#E8B496]",
    badgeBorder: "border-[#F2E2D2]",
    badgeBg: "bg-[#FCEEDF]",
    badgeText: "text-[#2A2520]",
    badgeDot: "bg-[#C2562A]",
    pillActive: "bg-[#2A2520] text-white shadow-sm",
    shadow: "shadow-[0_4px_16px_rgba(194,86,42,0.15)]",
    accent50: "bg-[#FCEEDF]",
    accent100: "bg-[#F4D7C5]",
    accentText: "text-[#C2562A]",
    accentTextDark: "text-[#2A2520]",
    popularBadge: "bg-[#C2562A]",
    scoreColor: "text-[#C2562A]",
    focusRing: "focus:ring-[#F4D7C5] focus:border-[#C2562A]",
    shellBg: "bg-[#FDF8F3] dark:bg-[#1A1410]",
    cardStyle: "rounded-3xl border border-[#F2E2D2] dark:border-[#3A2A20] bg-white dark:bg-[#241A14] shadow-[0_4px_16px_rgba(194,86,42,0.08)]",
    headerStyle: "border-b border-[#F2E2D2] dark:border-[#3A2A20] bg-[#FDF8F3]/90 dark:bg-[#1A1410]/90 backdrop-blur-sm",
    animationType: "fade",
  },

  // ─────────────────── 1B · SAGE — green calm, premium serif ──────────────
  sage: {
    id: "sage",
    name: "Sage",
    emoji: "🌿",
    description: "Green calm · Botanical",
    group: "warm",
    layout: "sidebar",
    defaultDark: false,
    logoBg: "bg-[#6A8059]",
    avatarGradient: "from-[#6A8059] to-[#A5BA8E]",
    activeBg: "bg-[#D9E5D1] dark:bg-[#1A2218]",
    activeText: "text-[#2C322A] dark:text-[#A5BA8E]",
    activeIcon: "text-[#6A8059]",
    inactiveIcon: "text-[#A8B49E] dark:text-[#4A5440]",
    navLine: "bg-[#6A8059]",
    btnPrimary: "bg-[#2C322A] hover:bg-[#1f241d] text-white",
    btnGhost: "hover:bg-[#D9E5D1] dark:hover:bg-[#1A2218]",
    heroGradient: "from-[#F4F1EA] via-[#EDE6D3] to-white",
    ctaGradient: "from-[#6A8059] to-[#A5BA8E]",
    badgeBorder: "border-[#E0E5D5]",
    badgeBg: "bg-[#EDE6D3]",
    badgeText: "text-[#2C322A]",
    badgeDot: "bg-[#6A8059]",
    pillActive: "bg-[#2C322A] text-white shadow-sm",
    shadow: "shadow-[0_4px_16px_rgba(106,128,89,0.15)]",
    accent50: "bg-[#EDE6D3]",
    accent100: "bg-[#D9E5D1]",
    accentText: "text-[#6A8059]",
    accentTextDark: "text-[#2C322A]",
    popularBadge: "bg-[#6A8059]",
    scoreColor: "text-[#6A8059]",
    focusRing: "focus:ring-[#D9E5D1] focus:border-[#6A8059]",
    shellBg: "bg-[#F4F1EA] dark:bg-[#161A14]",
    cardStyle: "rounded-3xl border border-[#E0E5D5] dark:border-[#2A3624] bg-white dark:bg-[#1F2419] shadow-[0_4px_16px_rgba(106,128,89,0.08)]",
    headerStyle: "border-b border-[#E0E5D5] dark:border-[#2A3624] bg-[#F4F1EA]/90 dark:bg-[#161A14]/90 backdrop-blur-sm",
    animationType: "fade",
  },

  // ─────────────────── 1C · PEACH — sunset coral, premium ─────────────────
  peach: {
    id: "peach",
    name: "Peach",
    emoji: "🍑",
    description: "Sunset coral · Warm vibrant",
    group: "warm",
    layout: "sidebar",
    defaultDark: false,
    logoBg: "bg-gradient-to-br from-[#FF6B47] to-[#FF8A5C]",
    avatarGradient: "from-[#FF6B47] to-[#FFB088]",
    activeBg: "bg-[#FFD8C6] dark:bg-[#3A1F18]",
    activeText: "text-[#2A1A14] dark:text-[#FFD8C6]",
    activeIcon: "text-[#FF6B47]",
    inactiveIcon: "text-[#D4B0A0] dark:text-[#5A4038]",
    navLine: "bg-gradient-to-r from-[#FF6B47] to-[#FF8A5C]",
    btnPrimary: "bg-gradient-to-r from-[#FF6B47] to-[#FF8A5C] hover:opacity-90 text-white shadow-lg shadow-[#FF6B47]/30",
    btnGhost: "hover:bg-[#FFD8C6] dark:hover:bg-[#3A1F18]",
    heroGradient: "from-[#FFF6F1] via-[#FCEEDF] to-white",
    ctaGradient: "from-[#FF6B47] to-[#FF8A5C]",
    badgeBorder: "border-[#FFE0D6]",
    badgeBg: "bg-[#FCEEDF]",
    badgeText: "text-[#2A1A14]",
    badgeDot: "bg-[#FF6B47]",
    pillActive: "bg-gradient-to-r from-[#FF6B47] to-[#FF8A5C] text-white shadow-lg shadow-[#FF6B47]/35",
    shadow: "shadow-[0_4px_18px_rgba(255,107,71,0.2)]",
    accent50: "bg-[#FCEEDF]",
    accent100: "bg-[#FFD8C6]",
    accentText: "text-[#FF6B47]",
    accentTextDark: "text-[#2A1A14]",
    popularBadge: "bg-gradient-to-r from-[#FF6B47] to-[#FF8A5C]",
    scoreColor: "text-[#FF6B47]",
    focusRing: "focus:ring-[#FFE0D6] focus:border-[#FF6B47]",
    shellBg: "bg-[#FFF6F1] dark:bg-[#1A1310]",
    cardStyle: "rounded-3xl border border-[#FFE0D6] dark:border-[#3A2520] bg-white dark:bg-[#241814] shadow-[0_4px_18px_rgba(255,107,71,0.1)]",
    headerStyle: "border-b border-[#FFE0D6] dark:border-[#3A2520] bg-[#FFF6F1]/90 dark:bg-[#1A1310]/90 backdrop-blur-sm",
    animationType: "fade",
  },

  // ─────────────────── 2A · AURORA — glass purple/pink (DEFAULT) ──────────
  aurora: {
    id: "aurora",
    name: "Aurora",
    emoji: "🔮",
    description: "Glass · Purple-pink aurora",
    group: "glass",
    layout: "dock",
    defaultDark: true,
    logoBg: "bg-gradient-to-br from-[#A855F7] to-[#EC4899]",
    avatarGradient: "from-[#A855F7] to-[#EC4899]",
    activeBg: "bg-purple-50/80 dark:bg-purple-950/40",
    activeText: "text-[#c4b5fd] dark:text-[#c4b5fd]",
    activeIcon: "text-[#A855F7] dark:text-[#c4b5fd]",
    inactiveIcon: "text-gray-400 dark:text-gray-500",
    navLine: "bg-gradient-to-r from-[#A855F7] to-[#EC4899]",
    btnPrimary: "bg-gradient-to-r from-[#A855F7] to-[#EC4899] hover:opacity-90 text-white shadow-lg shadow-[#A855F7]/40",
    btnGhost: "hover:bg-purple-50 dark:hover:bg-purple-950/30",
    heroGradient: "from-purple-50 via-pink-50 to-indigo-50",
    ctaGradient: "from-[#A855F7] to-[#EC4899]",
    badgeBorder: "border-purple-200 dark:border-white/10",
    badgeBg: "bg-purple-50 dark:bg-white/5",
    badgeText: "text-[#A855F7] dark:text-[#c4b5fd]",
    badgeDot: "bg-gradient-to-r from-[#A855F7] to-[#EC4899]",
    pillActive: "bg-gradient-to-r from-[#A855F7] to-[#EC4899] text-white shadow-[0_8px_24px_rgba(168,85,247,0.5)]",
    shadow: "shadow-[0_8px_32px_rgba(168,85,247,0.3)]",
    accent50: "bg-purple-50",
    accent100: "bg-purple-100",
    accentText: "text-[#A855F7] dark:text-[#c4b5fd]",
    accentTextDark: "text-[#4C1D95] dark:text-[#c4b5fd]",
    popularBadge: "bg-gradient-to-r from-[#A855F7] to-[#EC4899]",
    scoreColor: "text-[#A855F7]",
    focusRing: "focus:ring-purple-100 focus:border-[#A855F7]",
    shellBg: "bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 dark:bg-[#0A0717]",
    cardStyle: "rounded-3xl border border-white/30 dark:border-white/14 bg-white/70 dark:bg-white/[0.04] backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3)]",
    headerStyle: "border-b border-white/30 dark:border-white/10 bg-white/60 dark:bg-[#0A0717]/60 backdrop-blur-xl",
    animationType: "scale",
  },

  // ─────────────────── 2B · DEEP OCEAN — glass cyan/blue ──────────────────
  deepOcean: {
    id: "deepOcean",
    name: "Deep Ocean",
    emoji: "🌊",
    description: "Glass · Cyan deep water",
    group: "glass",
    layout: "dock",
    defaultDark: true,
    logoBg: "bg-gradient-to-br from-[#06b6d4] to-[#0EA5E9]",
    avatarGradient: "from-[#06b6d4] to-[#0EA5E9]",
    activeBg: "bg-cyan-50/80 dark:bg-cyan-950/40",
    activeText: "text-[#67e8f9]",
    activeIcon: "text-[#06b6d4] dark:text-[#67e8f9]",
    inactiveIcon: "text-gray-400 dark:text-gray-500",
    navLine: "bg-gradient-to-r from-[#06b6d4] to-[#0EA5E9]",
    btnPrimary: "bg-gradient-to-r from-[#06b6d4] to-[#0EA5E9] hover:opacity-90 text-white shadow-lg shadow-[#06b6d4]/40",
    btnGhost: "hover:bg-cyan-50 dark:hover:bg-cyan-950/30",
    heroGradient: "from-cyan-50 via-sky-50 to-blue-50",
    ctaGradient: "from-[#06b6d4] to-[#0EA5E9]",
    badgeBorder: "border-cyan-200 dark:border-white/10",
    badgeBg: "bg-cyan-50 dark:bg-white/5",
    badgeText: "text-[#06b6d4] dark:text-[#67e8f9]",
    badgeDot: "bg-gradient-to-r from-[#06b6d4] to-[#0EA5E9]",
    pillActive: "bg-gradient-to-r from-[#06b6d4] to-[#0EA5E9] text-white shadow-[0_8px_24px_rgba(6,182,212,0.5)]",
    shadow: "shadow-[0_8px_32px_rgba(6,182,212,0.3)]",
    accent50: "bg-cyan-50",
    accent100: "bg-cyan-100",
    accentText: "text-[#06b6d4] dark:text-[#67e8f9]",
    accentTextDark: "text-[#155e75] dark:text-[#67e8f9]",
    popularBadge: "bg-gradient-to-r from-[#06b6d4] to-[#0EA5E9]",
    scoreColor: "text-[#06b6d4]",
    focusRing: "focus:ring-cyan-100 focus:border-[#06b6d4]",
    shellBg: "bg-gradient-to-br from-cyan-50 via-sky-50 to-blue-50 dark:bg-[#021024]",
    cardStyle: "rounded-3xl border border-white/30 dark:border-white/12 bg-white/70 dark:bg-white/[0.03] backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)]",
    headerStyle: "border-b border-white/30 dark:border-white/10 bg-white/60 dark:bg-[#021024]/60 backdrop-blur-xl",
    animationType: "scale",
  },

  // ─────────────────── 2C · SUNRISE — glass orange/rose ───────────────────
  sunrise: {
    id: "sunrise",
    name: "Sunrise",
    emoji: "🌅",
    description: "Glass · Orange-rose dawn",
    group: "glass",
    layout: "dock",
    defaultDark: true,
    logoBg: "bg-gradient-to-br from-[#fb923c] to-[#f43f5e]",
    avatarGradient: "from-[#fb923c] to-[#f43f5e]",
    activeBg: "bg-orange-50/80 dark:bg-orange-950/40",
    activeText: "text-[#fb923c]",
    activeIcon: "text-[#fb923c]",
    inactiveIcon: "text-gray-400 dark:text-gray-500",
    navLine: "bg-gradient-to-r from-[#fb923c] to-[#f43f5e]",
    btnPrimary: "bg-gradient-to-r from-[#fb923c] to-[#f43f5e] hover:opacity-90 text-white shadow-lg shadow-[#fb923c]/40",
    btnGhost: "hover:bg-orange-50 dark:hover:bg-orange-950/30",
    heroGradient: "from-orange-50 via-rose-50 to-amber-50",
    ctaGradient: "from-[#fb923c] to-[#f43f5e]",
    badgeBorder: "border-orange-200 dark:border-white/10",
    badgeBg: "bg-orange-50 dark:bg-white/5",
    badgeText: "text-[#fb923c]",
    badgeDot: "bg-gradient-to-r from-[#fb923c] to-[#f43f5e]",
    pillActive: "bg-gradient-to-r from-[#fb923c] to-[#f43f5e] text-white shadow-[0_8px_24px_rgba(251,146,60,0.5)]",
    shadow: "shadow-[0_8px_32px_rgba(251,146,60,0.3)]",
    accent50: "bg-orange-50",
    accent100: "bg-orange-100",
    accentText: "text-[#fb923c]",
    accentTextDark: "text-[#9a3412] dark:text-[#fb923c]",
    popularBadge: "bg-gradient-to-r from-[#fb923c] to-[#f43f5e]",
    scoreColor: "text-[#fb923c]",
    focusRing: "focus:ring-orange-100 focus:border-[#fb923c]",
    shellBg: "bg-gradient-to-br from-orange-50 via-rose-50 to-amber-50 dark:bg-[#0F0A1F]",
    cardStyle: "rounded-3xl border border-white/30 dark:border-white/15 bg-white/70 dark:bg-white/[0.04] backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)]",
    headerStyle: "border-b border-white/30 dark:border-white/10 bg-white/60 dark:bg-[#0F0A1F]/60 backdrop-blur-xl",
    animationType: "scale",
  },
};

const VARIANT_ORDER: VariantId[] = ["terracotta", "sage", "peach", "aurora", "deepOcean", "sunrise"];

interface VariantContextValue {
  variant: VariantId;
  colors: VariantColors;
  setVariant: (v: VariantId) => void;
  cycleVariant: () => void;
  allVariants: typeof variants;
}

const VariantContext = createContext<VariantContextValue>({
  variant: "aurora",
  colors: variants.aurora,
  setVariant: () => {},
  cycleVariant: () => {},
  allVariants: variants,
});

export function VariantProvider({ children }: { children: ReactNode }) {
  // Default to Aurora — matches mobile app's default since May 21 commit f36ee9b
  const [variant, setVariantState] = useState<VariantId>("aurora");

  useEffect(() => {
    const saved = localStorage.getItem("petai-variant") as VariantId | null;
    // Only honor saved value if it matches one of the current variant ids
    // (legacy ids like "emerald" / "minimal" silently fall back to default)
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
