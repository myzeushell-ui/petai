"use client";

import { createContext, useContext, useState, useEffect, useCallback, useMemo, type ReactNode } from "react";
import { THEMES, type ThemeSpec } from "@/components/PetAiDesigns";

/**
 * PetAI app-wide theme system — backed by all 20 ThemeSpec palettes
 * from src/components/PetAiDesigns.tsx.
 *
 * HOW IT WORKS
 * ─────────────
 * Tailwind compiles classes at BUILD time and can't see dynamically
 * constructed names like `bg-[${hex}]`, so we use CSS variables:
 *
 *   1. VariantProvider injects a <style> block setting --petai-* vars
 *      from the active ThemeSpec on every theme change.
 *   2. VariantColors below references those vars via Tailwind
 *      arbitrary-value classes like `bg-[var(--petai-primary)]`.
 *      Tailwind sees these literal class strings at build time and
 *      generates the rules ONCE; at runtime only the var values
 *      change, so all theme-aware UI flips instantly.
 *
 * Result: 20 themes, zero per-theme CSS bloat, all components keep
 * their existing `className={colors.x}` pattern unchanged.
 */

// ─────────────────────────────────────────────────────────────────────────────
// Public types
// ─────────────────────────────────────────────────────────────────────────────

export type VariantId = string;

export interface VariantColors {
  id: VariantId;
  name: string;
  emoji: string;
  description: string;
  group: "light" | "dark";
  layout: "sidebar" | "topnav" | "dock";
  defaultDark: boolean;

  logoBg: string;
  avatarGradient: string;
  activeBg: string;
  activeText: string;
  activeIcon: string;
  inactiveIcon: string;
  navLine: string;
  btnPrimary: string;
  btnGhost: string;
  heroGradient: string;
  ctaGradient: string;
  badgeBorder: string;
  badgeBg: string;
  badgeText: string;
  badgeDot: string;
  pillActive: string;
  shadow: string;
  accent50: string;
  accent100: string;
  accentText: string;
  accentTextDark: string;
  popularBadge: string;
  scoreColor: string;
  focusRing: string;
  shellBg: string;
  cardStyle: string;
  headerStyle: string;
  animationType: "fade" | "slide" | "scale";
}

// ─────────────────────────────────────────────────────────────────────────────
// Per-theme metadata
// ─────────────────────────────────────────────────────────────────────────────

const META: Record<string, { emoji: string; layout: VariantColors["layout"]; group: VariantColors["group"]; descRu: string }> = {
  pet_pastel_pink:    { emoji: "🎀", layout: "sidebar", group: "light", descRu: "Пастельный розовый" },
  pet_dark_luxury:    { emoji: "✨", layout: "dock",    group: "dark",  descRu: "Тёмная роскошь · золото" },
  pet_rainbow:        { emoji: "🌈", layout: "topnav",  group: "light", descRu: "Радужный, яркий" },
  pet_forest:         { emoji: "🌲", layout: "sidebar", group: "light", descRu: "Лесные тропы" },
  pet_sky:            { emoji: "☁️", layout: "sidebar", group: "light", descRu: "Солнечное небо" },
  pet_yellow:         { emoji: "☀️", layout: "topnav",  group: "light", descRu: "Солнечный жёлтый" },
  pet_paws:           { emoji: "🐾", layout: "sidebar", group: "light", descRu: "Узор из лапок" },
  pet_cartoon:        { emoji: "🎨", layout: "topnav",  group: "light", descRu: "Мультяшный" },
  pet_photo_dark:     { emoji: "📷", layout: "dock",    group: "dark",  descRu: "Тёмный с фото" },
  pet_scandi:         { emoji: "⚪", layout: "sidebar", group: "light", descRu: "Скандинавский минимализм" },
  pet_coral:          { emoji: "🪸", layout: "sidebar", group: "light", descRu: "Тёплый коралл" },
  pet_neon_party:     { emoji: "🎉", layout: "dock",    group: "dark",  descRu: "Неоновая вечеринка" },
  pet_vintage:        { emoji: "📻", layout: "sidebar", group: "light", descRu: "Винтаж Pet Co." },
  pet_aqua_glass:     { emoji: "💧", layout: "dock",    group: "light", descRu: "Стеклянный аква" },
  pet_watercolor:     { emoji: "🖌️", layout: "sidebar", group: "light", descRu: "Акварель" },
  pet_3d_purple:      { emoji: "🟣", layout: "dock",    group: "dark",  descRu: "3D фиолетовый" },
  pet_sticker:        { emoji: "🏷️", layout: "topnav",  group: "light", descRu: "Стикер-коллаж" },
  pet_brutalist_orange:{ emoji: "🟧", layout: "sidebar", group: "light", descRu: "Брутализм оранжевый" },
  pet_cyber:          { emoji: "🤖", layout: "dock",    group: "dark",  descRu: "Кибер-матрица" },
  pet_floral:         { emoji: "🌸", layout: "sidebar", group: "light", descRu: "Цветочный сад" },
};

const DEFAULT_META = { emoji: "🎨", layout: "sidebar" as const, group: "light" as const, descRu: "" };

// ─────────────────────────────────────────────────────────────────────────────
// Tailwind class strings using CSS vars — same for every theme,
// only the var values change at runtime per active spec.
// ─────────────────────────────────────────────────────────────────────────────

const STATIC_CLASSES = {
  logoBg:        "bg-gradient-to-br from-[var(--petai-grad-start)] to-[var(--petai-grad-end)]",
  avatarGradient:"from-[var(--petai-grad-start)] to-[var(--petai-grad-end)]",
  activeBg:      "bg-[var(--petai-surface-variant)]",
  activeText:    "text-[var(--petai-primary)]",
  activeIcon:    "text-[var(--petai-primary)]",
  inactiveIcon:  "text-[var(--petai-text-secondary)] opacity-60",
  navLine:       "bg-[var(--petai-primary)]",
  btnPrimary:    "bg-[var(--petai-primary)] hover:opacity-90 text-[var(--petai-on-primary)] shadow-md",
  btnGhost:      "hover:bg-[var(--petai-surface-variant)]",
  heroGradient:  "from-[var(--petai-bg)] via-[var(--petai-surface)] to-white",
  ctaGradient:   "from-[var(--petai-grad-start)] to-[var(--petai-grad-end)]",
  badgeBorder:   "border-[var(--petai-outline)]",
  badgeBg:       "bg-[var(--petai-surface-variant)]",
  badgeText:     "text-[var(--petai-primary)]",
  badgeDot:      "bg-[var(--petai-primary)]",
  pillActive:    "bg-[var(--petai-primary)] text-[var(--petai-on-primary)] shadow-sm",
  shadow:        "shadow-[0_4px_16px_var(--petai-primary-alpha)]",
  accent50:      "bg-[var(--petai-surface-variant)]",
  accent100:     "bg-[var(--petai-surface-variant)]",
  accentText:    "text-[var(--petai-primary)]",
  accentTextDark:"text-[var(--petai-text-primary)]",
  popularBadge:  "bg-[var(--petai-primary)]",
  scoreColor:    "text-[var(--petai-primary)]",
  focusRing:     "focus:ring-[var(--petai-surface-variant)] focus:border-[var(--petai-primary)]",
  shellBg:       "bg-[var(--petai-bg)]",
  cardStyle:     "rounded-2xl border border-[var(--petai-outline)] bg-[var(--petai-surface)] shadow-[0_4px_16px_rgba(0,0,0,0.06)]",
  headerStyle:   "border-b border-[var(--petai-outline)] bg-[var(--petai-surface)]/90 backdrop-blur-sm",
} as const;

function displayName(spec: ThemeSpec): string {
  return spec.name.replace(/^\d+\s*·\s*/, "");
}

function specToVariant(spec: ThemeSpec): VariantColors {
  const meta = META[spec.id] ?? DEFAULT_META;
  return {
    id: spec.id,
    name: displayName(spec),
    emoji: meta.emoji,
    description: meta.descRu,
    group: meta.group,
    layout: meta.layout,
    defaultDark: spec.dark,
    ...STATIC_CLASSES,
    animationType: spec.dark ? "fade" : "scale",
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Build variants record + helpers
// ─────────────────────────────────────────────────────────────────────────────

export const variants: Record<VariantId, VariantColors> = Object.fromEntries(
  THEMES.map((spec) => [spec.id, specToVariant(spec)])
);

const SPECS_BY_ID: Record<VariantId, ThemeSpec> = Object.fromEntries(
  THEMES.map((spec) => [spec.id, spec])
);

const VARIANT_ORDER: VariantId[] = THEMES.map((s) => s.id);
const DEFAULT_VARIANT: VariantId = "pet_pastel_pink";

/** Convert hex like #EC4899 → "236, 72, 153" for use in rgba(). */
function hexToRgb(hex: string): string {
  const clean = hex.replace("#", "");
  const num = parseInt(clean, 16);
  if (isNaN(num) || clean.length !== 6) return "0, 0, 0";
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `${r}, ${g}, ${b}`;
}

/** Build CSS var assignments for an active ThemeSpec. */
function buildCssVars(spec: ThemeSpec): Record<string, string> {
  const gradStart = spec.gradient?.[0] ?? spec.primary;
  const gradEnd = spec.gradient?.[1] ?? spec.accent;
  return {
    "--petai-bg":               spec.bg,
    "--petai-surface":          spec.surface,
    "--petai-surface-variant":  spec.surfaceVariant,
    "--petai-primary":          spec.primary,
    "--petai-on-primary":       spec.onPrimary,
    "--petai-secondary":        spec.secondary,
    "--petai-accent":           spec.accent,
    "--petai-text-primary":     spec.textPrimary,
    "--petai-text-secondary":   spec.textSecondary,
    "--petai-outline":          spec.outline,
    "--petai-grad-start":       gradStart,
    "--petai-grad-end":         gradEnd,
    "--petai-primary-alpha":    `rgba(${hexToRgb(spec.primary)}, 0.25)`,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// React context
// ─────────────────────────────────────────────────────────────────────────────

interface VariantContextValue {
  variant: VariantId;
  colors: VariantColors;
  setVariant: (v: VariantId) => void;
  cycleVariant: () => void;
  allVariants: typeof variants;
}

const VariantContext = createContext<VariantContextValue>({
  variant: DEFAULT_VARIANT,
  colors: variants[DEFAULT_VARIANT],
  setVariant: () => {},
  cycleVariant: () => {},
  allVariants: variants,
});

export function VariantProvider({ children }: { children: ReactNode }) {
  const [variant, setVariantState] = useState<VariantId>(DEFAULT_VARIANT);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("petai-variant");
      if (saved && variants[saved]) {
        setVariantState(saved);
      }
    } catch {
      /* SSR */
    }
  }, []);

  // Apply CSS vars to <html> whenever the variant changes
  useEffect(() => {
    const spec = SPECS_BY_ID[variant];
    if (!spec) return;
    const vars = buildCssVars(spec);
    const root = document.documentElement;
    for (const [k, v] of Object.entries(vars)) {
      root.style.setProperty(k, v);
    }
    // Toggle the global dark class for the dark: tailwind variants the
    // existing components already use.
    root.classList.toggle("dark", spec.dark);
  }, [variant]);

  const setVariant = useCallback((v: VariantId) => {
    if (!variants[v]) return;
    setVariantState(v);
    try {
      window.localStorage.setItem("petai-variant", v);
    } catch {
      /* quota */
    }
  }, []);

  const cycleVariant = useCallback(() => {
    setVariantState((prev) => {
      const idx = VARIANT_ORDER.indexOf(prev);
      const next = VARIANT_ORDER[(idx + 1) % VARIANT_ORDER.length];
      try {
        window.localStorage.setItem("petai-variant", next);
      } catch {
        /* quota */
      }
      return next;
    });
  }, []);

  const value = useMemo<VariantContextValue>(
    () => ({
      variant,
      colors: variants[variant] ?? variants[DEFAULT_VARIANT],
      setVariant,
      cycleVariant,
      allVariants: variants,
    }),
    [variant, setVariant, cycleVariant]
  );

  return <VariantContext.Provider value={value}>{children}</VariantContext.Provider>;
}

export function useVariant() {
  return useContext(VariantContext);
}

/** Helpful for components that want raw hex (e.g. canvas, charts). */
export function getActiveSpec(variant: VariantId): ThemeSpec | undefined {
  return SPECS_BY_ID[variant];
}
