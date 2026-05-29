"use client";

// =============================================================================
// Pet AI — 20 bespoke designs in a single drop-in React / Next.js file.
//
// HOW TO USE (zero dependencies — only React):
//   1. Copy this file into your project (e.g. components/PetAiDesigns.tsx).
//   2a. Use it as a page (Next.js App Router):
//          // app/pet/page.tsx
//          import PetAiApp from "@/components/PetAiDesigns";
//          export default function Page() { return <PetAiApp />; }
//   2b. Or drop it anywhere as a component:  <PetAiApp />
//
// Tap the palette button (🎨, top-right of the home screen) to switch between
// all 20 designs. Each design changes BOTH the palette AND the home layout.
//
// No Tailwind, no icon library, no fonts to install — everything is inline.
// Custom font names fall back to the system font unless you load them.
// =============================================================================

import React, {
  createContext,
  useContext,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { motion } from "framer-motion";
import {
  pageVariants,
  staggerContainer,
  cardChildVariants,
  scoreVariants,
  heroPhotoVariants,
  interactiveTile,
  animationFlavor,
} from "./pet-ai-designs/animations";
import { PET_AI_FEATURES, TOP_FEATURES, HERO_FEATURES } from "./pet-ai-designs/petAiFeatures";
import { getPetPhoto } from "./pet-ai-designs/petPhotos";

// ─────────────────────────────────────────────────────────────────────────────
// THEME SPEC + THE 20 PALETTES
// ─────────────────────────────────────────────────────────────────────────────

export type ThemeSpec = {
  id: string;
  name: string;
  dark: boolean;
  bg: string;
  surface: string;
  surfaceVariant: string;
  primary: string;
  onPrimary: string;
  secondary: string;
  accent: string;
  textPrimary: string;
  textSecondary: string;
  outline: string;
  gradient?: string[];
  displayFont: string;
  bodyFont: string;
  monoFont: string;
  displayWeight: number;
  bodyWeight: number;
  lsDisplay: number;
  cardRadius: number;
  buttonRadius: number;
  borderWidth: number;
  cardElevation: number;
  uppercase: boolean;
  tagline: string;
};

type ThemeInput = Partial<ThemeSpec> &
  Pick<
    ThemeSpec,
    | "id"
    | "name"
    | "dark"
    | "bg"
    | "surface"
    | "surfaceVariant"
    | "primary"
    | "onPrimary"
    | "secondary"
    | "accent"
    | "textPrimary"
    | "textSecondary"
    | "outline"
    | "tagline"
  >;

const DEFAULTS = {
  displayFont: "Inter",
  bodyFont: "Inter",
  monoFont: "JetBrains Mono",
  displayWeight: 800,
  bodyWeight: 400,
  lsDisplay: -0.5,
  cardRadius: 20,
  buttonRadius: 24,
  borderWidth: 0,
  cardElevation: 0,
  uppercase: false,
};

const mk = (t: ThemeInput): ThemeSpec => ({ ...DEFAULTS, ...t });

export const THEMES: ThemeSpec[] = [
  mk({
    id: "pet_pastel_pink",
    name: "01 · Pastel Pink",
    dark: false,
    bg: "#FFF5F7",
    surface: "#FFFFFF",
    surfaceVariant: "#FCE7F3",
    primary: "#EC4899",
    onPrimary: "#FFFFFF",
    secondary: "#FBCFE8",
    accent: "#EC4899",
    textPrimary: "#831843",
    textSecondary: "#9D174D",
    outline: "#FCE7F3",
    cardRadius: 28,
    buttonRadius: 28,
    cardElevation: 4,
    tagline: "Hello, Bella's mom 🐾",
  }),
  mk({
    id: "pet_dark_luxury",
    name: "02 · Dark Luxury Gold",
    dark: true,
    bg: "#0A0A0A",
    surface: "#1C1C1C",
    surfaceVariant: "#2A2A2A",
    primary: "#FBBF24",
    onPrimary: "#0A0A0A",
    secondary: "#92400E",
    accent: "#FBBF24",
    textPrimary: "#FFFFFF",
    textSecondary: "#A3A3A3",
    outline: "#92400E",
    gradient: ["#FBBF24", "#92400E"],
    displayFont: "Cormorant Garamond",
    lsDisplay: 0,
    cardRadius: 20,
    buttonRadius: 8,
    borderWidth: 1,
    uppercase: true,
    tagline: "For your finest companion.",
  }),
  mk({
    id: "pet_rainbow",
    name: "03 · Vibrant Rainbow",
    dark: false,
    bg: "#FFFFFF",
    surface: "#FEE2E2",
    surfaceVariant: "#FEF3C7",
    primary: "#1A1A1A",
    onPrimary: "#FFFFFF",
    secondary: "#10B981",
    accent: "#3B82F6",
    textPrimary: "#1A1A1A",
    textSecondary: "#A3A3A3",
    outline: "#E5E5E5",
    gradient: ["#EF4444", "#F59E0B", "#10B981", "#3B82F6", "#A855F7"],
    displayWeight: 900,
    cardRadius: 24,
    buttonRadius: 28,
    uppercase: true,
    tagline: "YO, PET PARENT!",
  }),
  mk({
    id: "pet_forest",
    name: "04 · Forest Trails",
    dark: true,
    bg: "#0C1F17",
    surface: "#064E3B",
    surfaceVariant: "#166534",
    primary: "#22C55E",
    onPrimary: "#052E16",
    secondary: "#84CC16",
    accent: "#86EFAC",
    textPrimary: "#FFFFFF",
    textSecondary: "#86EFAC",
    outline: "#166534",
    displayFont: "Fraunces",
    displayWeight: 700,
    cardRadius: 22,
    buttonRadius: 22,
    tagline: "Walk with your best friend.",
  }),
  mk({
    id: "pet_sky",
    name: "05 · Sunny Sky",
    dark: false,
    bg: "#DBEAFE",
    surface: "#FFFFFF",
    surfaceVariant: "#BFDBFE",
    primary: "#3B82F6",
    onPrimary: "#FFFFFF",
    secondary: "#7DD3FC",
    accent: "#3B82F6",
    textPrimary: "#1E3A8A",
    textSecondary: "#3B82F6",
    outline: "#BFDBFE",
    gradient: ["#7DD3FC", "#DBEAFE"],
    cardRadius: 24,
    buttonRadius: 28,
    cardElevation: 3,
    tagline: "Sunny day, happy paws.",
  }),
  mk({
    id: "pet_yellow",
    name: "06 · Sunny Yellow",
    dark: false,
    bg: "#FEF3C7",
    surface: "#FFFFFF",
    surfaceVariant: "#FDE68A",
    primary: "#D97706",
    onPrimary: "#FFFFFF",
    secondary: "#FBBF24",
    accent: "#D97706",
    textPrimary: "#451A03",
    textSecondary: "#92400E",
    outline: "#FDE68A",
    displayWeight: 900,
    cardRadius: 28,
    buttonRadius: 28,
    cardElevation: 3,
    uppercase: true,
    tagline: "GOOD MORNING ☀",
  }),
  mk({
    id: "pet_paws",
    name: "07 · Paw Pattern",
    dark: false,
    bg: "#FFFFFF",
    surface: "#1A1A1A",
    surfaceVariant: "#F5F5F5",
    primary: "#1A1A1A",
    onPrimary: "#FFFFFF",
    secondary: "#FACC15",
    accent: "#FACC15",
    textPrimary: "#1A1A1A",
    textSecondary: "#A3A3A3",
    outline: "#E5E5E5",
    displayWeight: 900,
    cardRadius: 20,
    buttonRadius: 28,
    uppercase: true,
    tagline: "Track every paw step.",
  }),
  mk({
    id: "pet_cartoon",
    name: "08 · Cartoon",
    dark: false,
    bg: "#FFFBEB",
    surface: "#FFFFFF",
    surfaceVariant: "#FDE047",
    primary: "#EC4899",
    onPrimary: "#FFFFFF",
    secondary: "#3B82F6",
    accent: "#FDE047",
    textPrimary: "#1A1A1A",
    textSecondary: "#A3A3A3",
    outline: "#1A1A1A",
    displayFont: "Bowlby One",
    displayWeight: 900,
    cardRadius: 28,
    buttonRadius: 24,
    borderWidth: 3,
    tagline: "hi friend! 👋",
  }),
  mk({
    id: "pet_photo_dark",
    name: "09 · Photo Dark",
    dark: true,
    bg: "#0A0A0A",
    surface: "#1C1C1C",
    surfaceVariant: "#262626",
    primary: "#FBBF24",
    onPrimary: "#451A03",
    secondary: "#FFFFFF",
    accent: "#FBBF24",
    textPrimary: "#FFFFFF",
    textSecondary: "#A3A3A3",
    outline: "#262626",
    displayWeight: 900,
    lsDisplay: -1,
    cardRadius: 18,
    buttonRadius: 20,
    uppercase: true,
    tagline: "Healthy. Happy. Home.",
  }),
  mk({
    id: "pet_scandi",
    name: "10 · Scandi Minimal",
    dark: false,
    bg: "#FAFAF7",
    surface: "#FFFFFF",
    surfaceVariant: "#F5F5F4",
    primary: "#1C1917",
    onPrimary: "#FFFFFF",
    secondary: "#78716C",
    accent: "#1C1917",
    textPrimary: "#1C1917",
    textSecondary: "#78716C",
    outline: "#E7E5E4",
    displayWeight: 300,
    cardRadius: 2,
    buttonRadius: 2,
    borderWidth: 1,
    tagline: "Less app, more pet.",
  }),
  mk({
    id: "pet_coral",
    name: "11 · Coral Warm",
    dark: false,
    bg: "#FFF1EE",
    surface: "#FFFFFF",
    surfaceVariant: "#FFE4E1",
    primary: "#FB7185",
    onPrimary: "#FFFFFF",
    secondary: "#F97316",
    accent: "#FB7185",
    textPrimary: "#7F1D1D",
    textSecondary: "#9F1239",
    outline: "#FFE4E1",
    gradient: ["#FB7185", "#F97316"],
    cardRadius: 32,
    buttonRadius: 28,
    tagline: "Care that feels warm.",
  }),
  mk({
    id: "pet_neon_party",
    name: "12 · Neon Party",
    dark: true,
    bg: "#000000",
    surface: "#0A0A0A",
    surfaceVariant: "#1C1C1C",
    primary: "#10B981",
    onPrimary: "#000000",
    secondary: "#A855F7",
    accent: "#22D3EE",
    textPrimary: "#FFFFFF",
    textSecondary: "#22D3EE",
    outline: "#10B981",
    gradient: ["#10B981", "#22D3EE", "#A855F7"],
    displayFont: "Orbitron",
    displayWeight: 900,
    lsDisplay: 2,
    cardRadius: 20,
    buttonRadius: 24,
    borderWidth: 2,
    uppercase: true,
    tagline: "RAVE FOR PAWS.",
  }),
  mk({
    id: "pet_vintage",
    name: "13 · Vintage Pet Co.",
    dark: false,
    bg: "#F4EAD5",
    surface: "#FFFFFF",
    surfaceVariant: "#EFE4CC",
    primary: "#7C2D12",
    onPrimary: "#F4EAD5",
    secondary: "#9A3412",
    accent: "#7C2D12",
    textPrimary: "#7C2D12",
    textSecondary: "#9A3412",
    outline: "#7C2D12",
    displayFont: "Playfair Display",
    bodyFont: "Cormorant Garamond",
    displayWeight: 900,
    lsDisplay: 0,
    cardRadius: 2,
    buttonRadius: 2,
    borderWidth: 2,
    uppercase: true,
    tagline: "EST. 2026 — A FINE COMPANION SERVICE",
  }),
  mk({
    id: "pet_aqua_glass",
    name: "14 · Aqua Glass",
    dark: true,
    bg: "#155E75",
    surface: "rgba(255,255,255,0.2)",
    surfaceVariant: "rgba(255,255,255,0.1)",
    primary: "#FFFFFF",
    onPrimary: "#155E75",
    secondary: "#67E8F9",
    accent: "#22D3EE",
    textPrimary: "#FFFFFF",
    textSecondary: "#CFFAFE",
    outline: "rgba(255,255,255,0.3)",
    gradient: ["#22D3EE", "#06B6D4"],
    cardRadius: 28,
    buttonRadius: 28,
    tagline: "Pet care. Crystal clear.",
  }),
  mk({
    id: "pet_watercolor",
    name: "15 · Watercolor",
    dark: false,
    bg: "#FAFAFA",
    surface: "#FFFFFF",
    surfaceVariant: "#FCE7F3",
    primary: "#7C3AED",
    onPrimary: "#FFFFFF",
    secondary: "#EC4899",
    accent: "#A78BFA",
    textPrimary: "#312E81",
    textSecondary: "#7C3AED",
    outline: "#E9D5FF",
    displayFont: "Caveat",
    bodyFont: "Caveat",
    displayWeight: 700,
    lsDisplay: 0,
    cardRadius: 28,
    buttonRadius: 28,
    cardElevation: 2,
    tagline: "your pet is loved.",
  }),
  mk({
    id: "pet_3d_purple",
    name: "16 · 3D Purple",
    dark: true,
    bg: "#1E1B4B",
    surface: "#312E81",
    surfaceVariant: "#4338CA",
    primary: "#A855F7",
    onPrimary: "#FFFFFF",
    secondary: "#6366F1",
    accent: "#C4B5FD",
    textPrimary: "#FFFFFF",
    textSecondary: "#C4B5FD",
    outline: "#A855F7",
    gradient: ["#A855F7", "#6366F1"],
    cardRadius: 20,
    buttonRadius: 20,
    cardElevation: 8,
    tagline: "Your pet, in dimension.",
  }),
  mk({
    id: "pet_sticker",
    name: "17 · Sticker Collage",
    dark: false,
    bg: "#FEF9C3",
    surface: "#FFFFFF",
    surfaceVariant: "#FEF3C7",
    primary: "#1A1A1A",
    onPrimary: "#FEF9C3",
    secondary: "#EC4899",
    accent: "#A855F7",
    textPrimary: "#1A1A1A",
    textSecondary: "#A3A3A3",
    outline: "#1A1A1A",
    displayWeight: 900,
    lsDisplay: 0,
    cardRadius: 6,
    buttonRadius: 12,
    borderWidth: 3,
    uppercase: true,
    tagline: "★ collect pet moments ★",
  }),
  mk({
    id: "pet_brutalist_orange",
    name: "18 · Brutalist Orange",
    dark: false,
    bg: "#FB923C",
    surface: "#FFFFFF",
    surfaceVariant: "#1A1A1A",
    primary: "#1A1A1A",
    onPrimary: "#FB923C",
    secondary: "#FFFFFF",
    accent: "#FB923C",
    textPrimary: "#1A1A1A",
    textSecondary: "#525252",
    outline: "#1A1A1A",
    displayFont: "Archivo Black",
    displayWeight: 900,
    lsDisplay: 0,
    cardRadius: 0,
    buttonRadius: 0,
    borderWidth: 4,
    uppercase: true,
    tagline: "CARE. PERIOD.",
  }),
  mk({
    id: "pet_cyber",
    name: "19 · Cyber Matrix",
    dark: true,
    bg: "#000000",
    surface: "#001A0D",
    surfaceVariant: "#001A0D",
    primary: "#10B981",
    onPrimary: "#000000",
    secondary: "#22C55E",
    accent: "#10B981",
    textPrimary: "#10B981",
    textSecondary: "#15803D",
    outline: "#10B981",
    displayFont: "Orbitron",
    bodyFont: "JetBrains Mono",
    displayWeight: 900,
    lsDisplay: 3,
    cardRadius: 2,
    buttonRadius: 2,
    borderWidth: 1,
    uppercase: true,
    tagline: "DECODE YOUR.PET",
  }),
  mk({
    id: "pet_floral",
    name: "20 · Floral Garden",
    dark: false,
    bg: "#FDF2F8",
    surface: "#FFFFFF",
    surfaceVariant: "#FCE7F3",
    primary: "#BE185D",
    onPrimary: "#FFFFFF",
    secondary: "#FBCFE8",
    accent: "#BE185D",
    textPrimary: "#831843",
    textSecondary: "#BE185D",
    outline: "#FBCFE8",
    displayFont: "Cormorant Garamond",
    displayWeight: 700,
    lsDisplay: 0,
    cardRadius: 32,
    buttonRadius: 28,
    cardElevation: 3,
    tagline: "Bloom together.",
  }),
];

// ─────────────────────────────────────────────────────────────────────────────
// MOCK DATA
// ─────────────────────────────────────────────────────────────────────────────

/** Active pet data — exposed as `let` + setter so the host app (PetContext)
 *  can inject real values without rewriting each of the 20 layouts. */
export let PET = {
  id: "pet-001",
  name: "Bella",
  breed: "Golden Retriever",
  ageLabel: "3 years",
  moodScore: 92,
  emoji: "🐶",
};

/** Override the mock pet data with real values (call before rendering). */
export function setPetData(p: Partial<typeof PET>) {
  PET = { ...PET, ...p };
}

type CareItem = { title: string; due: string; icon: string; done?: boolean };

export let CARE: CareItem[] = [
  { title: "Breakfast", due: "Done · 8:00", icon: "🍽", done: true },
  { title: "Morning walk", due: "Due in 20 min", icon: "🚶" },
  { title: "Vitamin", due: "Due at 14:00", icon: "💊" },
  { title: "Vaccine booster", due: "In 12 days", icon: "💉" },
];

/** Override the daily-care list (call before rendering). */
export function setCareItems(items: CareItem[]) {
  CARE = items;
}

const SCAN_RESULT = [
  { breed: "Golden Retriever", pct: 92 },
  { breed: "Labrador", pct: 5 },
  { breed: "Nova Scotia Duck Toller", pct: 3 },
];

const VET_CHAT: { role: "vet" | "user"; text: string }[] = [
  { role: "vet", text: "Hi! I'm Dr. Lena. How can I help Bella today? 🐾" },
  { role: "user", text: "She has been scratching her left ear a lot." },
  {
    role: "vet",
    text: "Got it. Any redness or smell? Frequent scratching can mean an ear infection or mites — let's rule those out first.",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// THEME CONTEXT + HELPERS
// ─────────────────────────────────────────────────────────────────────────────

type Ctx = {
  spec: ThemeSpec;
  setThemeId: (id: string) => void;
  openPicker: () => void;
  onScan: () => void;
  onOpenPet: () => void;
};

const ThemeCtx = createContext<Ctx | null>(null);
const useTheme = () => {
  const c = useContext(ThemeCtx);
  if (!c) throw new Error("ThemeCtx missing");
  return c;
};

/** Convert "#RRGGBB" + alpha(0..1) to an rgba() string. */
function withA(color: string, a: number): string {
  if (!color.startsWith("#")) return color;
  const h = color.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${a})`;
}

const ff = (font: string) =>
  `"${font}", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`;
const fmono = (font: string) => `"${font}", ui-monospace, Menlo, monospace`;

const up = (s: ThemeSpec, label: string) =>
  s.uppercase ? label.toUpperCase() : label;

/** Text-style builders mirroring the Flutter TextTheme. */
function text(s: ThemeSpec) {
  const disp = (size: number, color?: string): CSSProperties => ({
    fontFamily: ff(s.displayFont),
    fontSize: size,
    fontWeight: s.displayWeight,
    color: color ?? s.textPrimary,
    letterSpacing: s.lsDisplay,
    margin: 0,
    lineHeight: 1.12,
  });
  const b = (
    size: number,
    weight: number,
    color?: string,
    spacing = 0,
    family = s.bodyFont,
  ): CSSProperties => ({
    fontFamily: ff(family),
    fontSize: size,
    fontWeight: weight,
    color: color ?? s.textPrimary,
    letterSpacing: spacing,
    margin: 0,
    lineHeight: 1.3,
  });
  return {
    displayL: (c?: string) => ({ ...disp(40, c) }),
    displayM: (c?: string) => ({ ...disp(32, c) }),
    displayS: (c?: string) => ({ ...disp(26, c) }),
    headlineM: (c?: string) => b(20, 700, c, 0, s.displayFont),
    headlineS: (c?: string) => b(18, 700, c),
    titleL: (c?: string) => b(16, 700, c),
    titleM: (c?: string) => b(14, 600, c),
    titleS: (c?: string) => b(12, 600, c ?? s.textSecondary),
    bodyL: (c?: string) => b(15, s.bodyWeight, c),
    bodyM: (c?: string) => b(13, s.bodyWeight, c),
    bodyS: (c?: string) => b(11, s.bodyWeight, c ?? s.textSecondary),
    labelM: (c?: string) => b(11, 700, c, 1.5),
    labelS: (c?: string) => b(10, 700, c ?? s.textSecondary, 2),
  };
}

const ROW: CSSProperties = { display: "flex", flexDirection: "row", alignItems: "center" };
const COL: CSSProperties = { display: "flex", flexDirection: "column" };

// ─────────────────────────────────────────────────────────────────────────────
// SHARED PRIMITIVES
// ─────────────────────────────────────────────────────────────────────────────

function Page({ children, padding = "16px 20px 24px" }: { children: ReactNode; padding?: string }) {
  return (
    <div style={{ overflowY: "auto", height: "100%", WebkitOverflowScrolling: "touch", padding }}>
      {children}
    </div>
  );
}

function Emoji({ char, size = 22 }: { char: string; size?: number }) {
  return <span style={{ fontSize: size, lineHeight: 1 }}>{char}</span>;
}

function Avatar({ char, size = 68, bg, fontSize, photo }: { char: string; size?: number; bg: string; fontSize?: number; photo?: boolean }) {
  // When `photo` is true, render real pet image from Unsplash instead of emoji.
  // PET.id maps to the photo via getPetPhoto (defaults to Luna golden).
  if (photo) {
    return (
      <div
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          overflow: "hidden",
          flexShrink: 0,
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={getPetPhoto((PET as any).id ?? "pet-001", "avatar")}
          alt={PET.name}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>
    );
  }
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <span style={{ fontSize: fontSize ?? size * 0.5 }}>{char}</span>
    </div>
  );
}

function SwitchBtn() {
  const { spec, openPicker } = useTheme();
  return (
    <button
      onClick={openPicker}
      title="Switch theme"
      style={{
        border: "none",
        background: "transparent",
        cursor: "pointer",
        fontSize: 20,
        color: spec.textPrimary,
        padding: 6,
        borderRadius: 10,
        flexShrink: 0,
      }}
    >
      🎨
    </button>
  );
}

function Card({
  children,
  style,
  onClick,
}: {
  children: ReactNode;
  style?: CSSProperties;
  onClick?: () => void;
}) {
  const { spec } = useTheme();
  const hasBorder = spec.dark || spec.cardElevation === 0;
  return (
    <div
      onClick={onClick}
      style={{
        background: spec.surface,
        borderRadius: spec.cardRadius,
        padding: 16,
        border: hasBorder ? `0.8px solid ${spec.outline}` : "none",
        boxShadow: spec.cardElevation > 0 ? `0 4px ${spec.cardElevation * 4}px rgba(0,0,0,0.08)` : "none",
        cursor: onClick ? "pointer" : "default",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function IconChip({ icon, size = 44, color }: { icon: string; size?: number; color?: string }) {
  const { spec } = useTheme();
  const c = color ?? spec.accent;
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: spec.cardRadius * 0.55,
        background: withA(c, 0.15),
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <span style={{ fontSize: size * 0.46 }}>{icon}</span>
    </div>
  );
}

function Progress({ value, color, track, height = 6 }: { value: number; color: string; track: string; height?: number }) {
  return (
    <div style={{ height, background: track, borderRadius: height, overflow: "hidden", width: "100%" }}>
      <div style={{ height: "100%", width: `${value * 100}%`, background: color }} />
    </div>
  );
}

function gradientCss(colors: string[], angle = "135deg") {
  return `linear-gradient(${angle}, ${colors.join(", ")})`;
}

// ─────────────────────────────────────────────────────────────────────────────
// 20 BESPOKE HOME LAYOUTS
// ─────────────────────────────────────────────────────────────────────────────

type LayoutProps = { onScan: () => void; onOpenPet: () => void };

// 01 · Pastel Pink
function PetPastelPink({ onScan, onOpenPet }: Partial<LayoutProps> = {}) {
  const { spec } = useTheme();
  const t = text(spec);
  const features = [PET_AI_FEATURES.bark, PET_AI_FEATURES.labs];
  return (
    <Page>
      <div style={{ ...ROW, gap: 10 }}>
        <Avatar char={PET.emoji} size={36} bg={spec.surfaceVariant} fontSize={18} photo />
        <p style={{ ...t.titleM(), flex: 1 }}>Hello, {PET.name}'s mom 🐾</p>
        <SwitchBtn />
      </div>
      <div style={{ height: 16 }} />
      <motion.div variants={cardChildVariants.soft} initial="hidden" animate="visible">
        <Card onClick={onOpenPet}>
          <div style={{ ...ROW, gap: 16 }}>
            <Avatar char={PET.emoji} size={68} bg={spec.surfaceVariant} photo />
            <div style={{ ...COL, flex: 1 }}>
              <p style={t.labelS()}>{PET.name.toUpperCase()} · {PET.breed}</p>
              <p style={t.headlineM()}>Mood {PET.moodScore}/100 ✨</p>
              <p style={t.bodyS()}>Tap to open profile</p>
              <div style={{ height: 6 }} />
              <Progress value={PET.moodScore / 100} color={spec.accent} track={spec.surfaceVariant} />
            </div>
          </div>
        </Card>
      </motion.div>
      <div style={{ height: 16 }} />
      <p style={t.titleL()}>What can I do today 💕</p>
      <div style={{ height: 10 }} />
      <motion.div variants={staggerContainer} initial="hidden" animate="visible" style={{ ...ROW, gap: 12, alignItems: "stretch" }}>
        {features.map((f) => {
          const Icon = f.icon;
          return (
            <motion.button
              key={f.id}
              variants={cardChildVariants.soft}
              {...interactiveTile}
              onClick={f.id === "bark" ? onScan : undefined}
              style={{ ...COL, flex: 1, background: spec.surfaceVariant, borderRadius: spec.cardRadius, padding: 16, border: "none", cursor: "pointer", textAlign: "left" as const }}
            >
              <Icon size={22} color={spec.primary} strokeWidth={2} />
              <div style={{ height: 16 }} />
              <p style={t.titleM()}>{f.labelEn}</p>
              <p style={t.bodyS()}>{f.taglineEn}</p>
            </motion.button>
          );
        })}
      </motion.div>
      <div style={{ height: 14 }} />
      <p style={t.bodyS()}>Today's reminders</p>
      <div style={{ height: 8 }} />
      {CARE.slice(0, 3).map((c, i) => (
        <motion.div key={c.title} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.06 }} style={{ ...ROW, gap: 10, padding: "8px 0" }}>
          <span style={{ fontSize: 16 }}>{c.icon}</span>
          <p style={{ ...t.bodyM(), flex: 1 }}>{c.title}</p>
          <p style={{ ...t.bodyS(), opacity: 0.65 }}>{c.due}</p>
        </motion.div>
      ))}
    </Page>
  );
}

// 02 · Dark Luxury Gold
function PetDarkLuxury({ onScan, onOpenPet }: Partial<LayoutProps> = {}) {
  const { spec } = useTheme();
  const t = text(spec);
  const gold = spec.primary;
  const features = [PET_AI_FEATURES.chat, PET_AI_FEATURES.vets];
  return (
    <Page>
      <div style={ROW}>
        <p style={{ ...t.labelM(gold), letterSpacing: 4 }}>PET · AI</p>
        <div style={{ flex: 1 }} />
        <SwitchBtn />
      </div>
      <div style={{ height: 10 }} />
      <p style={t.displayS()}>For your</p>
      <p style={t.displayS(gold)}>finest companion.</p>
      <div style={{ height: 20 }} />
      <motion.div variants={cardChildVariants.sharp} initial="hidden" animate="visible" onClick={onOpenPet} style={{ cursor: "pointer" }}>
        <div style={{ background: spec.surface, borderRadius: 20, padding: 18, border: `1px solid ${withA(gold, 0.31)}` }}>
          <div style={{ ...ROW, gap: 16 }}>
            <Avatar char={PET.emoji} size={64} bg={withA(gold, 0.16)} photo />
            <div style={{ ...COL, flex: 1 }}>
              <p style={t.labelS(gold)}>YOUR COMPANION</p>
              <p style={t.headlineS()}>{PET.name}</p>
              <p style={t.bodyS()}>{PET.breed} · {PET.ageLabel}</p>
            </div>
          </div>
          <div style={{ height: 1, background: withA(gold, 0.24), margin: "20px 0" }} />
          <div style={ROW}>
            <p style={t.labelM(gold)}>HEALTH SCORE</p>
            <div style={{ flex: 1 }} />
            <motion.p variants={scoreVariants} style={t.headlineM(gold)}>{PET.moodScore}</motion.p>
          </div>
        </div>
      </motion.div>
      <div style={{ height: 16 }} />
      <p style={t.labelM(gold)}>PREMIUM SERVICES</p>
      <div style={{ height: 10 }} />
      <motion.div variants={staggerContainer} initial="hidden" animate="visible" style={{ ...ROW, gap: 12, alignItems: "stretch" }}>
        {features.map((f) => {
          const Icon = f.icon;
          return (
            <motion.button
              key={f.id}
              variants={cardChildVariants.sharp}
              {...interactiveTile}
              onClick={onScan}
              style={{ ...COL, flex: 1, background: spec.surface, borderRadius: 14, padding: 14, border: `1px solid ${withA(gold, 0.2)}`, cursor: "pointer", textAlign: "left" as const }}
            >
              <Icon size={22} color={gold} strokeWidth={1.5} />
              <div style={{ height: 12 }} />
              <p style={t.titleM()}>{f.labelEn}</p>
              <p style={t.bodyS(gold)}>{f.taglineEn}</p>
            </motion.button>
          );
        })}
      </motion.div>
    </Page>
  );
}

// 03 · Vibrant Rainbow
function PetRainbow({ onScan, onOpenPet }: LayoutProps) {
  const { spec } = useTheme();
  const t = text(spec);
  const grad = spec.gradient ?? [spec.primary, spec.secondary];
  const ActionRow = ({ bg, tag, title, sub, icon, iconColor, onClick }: { bg: string; tag: string; title: string; sub: string; icon: string; iconColor: string; onClick: () => void }) => (
    <div onClick={onClick} style={{ ...ROW, cursor: "pointer", background: bg, borderRadius: 24, padding: 18, gap: 12 }}>
      <div style={{ ...COL, flex: 1 }}>
        <p style={t.labelM("rgba(0,0,0,0.87)")}>{tag}</p>
        <div style={{ height: 4 }} />
        <p style={t.headlineS("rgba(0,0,0,0.87)")}>{title}</p>
        <p style={t.bodyS("rgba(0,0,0,0.54)")}>{sub}</p>
      </div>
      <Avatar char={icon} size={52} bg={iconColor} fontSize={22} />
    </div>
  );
  return (
    <Page>
      <div style={{ height: 8, borderRadius: 4, background: gradientCss(grad) }} />
      <div style={{ height: 16 }} />
      <div style={ROW}>
        <p style={{ ...t.displayS(), flex: 1 }}>YO, PET PARENT!</p>
        <SwitchBtn />
      </div>
      <div style={{ height: 16 }} />
      <div style={{ ...ROW, gap: 12 }}>
        {[
          { e: PET.emoji, c: grad[0], dashed: false },
          { e: "🐱", c: grad.length > 2 ? grad[2] : grad[1], dashed: false },
          { e: "+", c: spec.secondary, dashed: true },
        ].map((x, i) => (
          <div key={i} style={{ flex: 1, aspectRatio: "1", borderRadius: 20, background: withA(x.c, 0.24), border: x.dashed ? `2px solid ${x.c}` : "none", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: x.dashed ? 28 : 32, color: x.dashed ? x.c : undefined, fontWeight: 700 }}>{x.e}</span>
          </div>
        ))}
      </div>
      <div style={{ height: 16 }} />
      <ActionRow bg="#DBEAFE" tag="📸 SCAN BREED" title="Take a pic →" sub="AI in 2 sec" icon="📷" iconColor={spec.accent} onClick={onScan} />
      <div style={{ height: 12 }} />
      <ActionRow bg="#FCE7F3" tag="💬 ASK A VET" title="Chat live →" sub="Reply 90 sec" icon="💬" iconColor={spec.primary} onClick={onOpenPet} />
    </Page>
  );
}

// 04 · Forest Trails
function PetForest() {
  const { spec } = useTheme();
  const t = text(spec);
  return (
    <Page>
      <div style={ROW}>
        <p style={{ ...t.labelM(spec.accent), letterSpacing: 2 }}>PET · AI · WILD</p>
        <div style={{ flex: 1 }} />
        <SwitchBtn />
      </div>
      <div style={{ height: 8 }} />
      <p style={t.displayS()}>walk with</p>
      <p style={t.displayS(spec.accent)}>your best friend.</p>
      <div style={{ height: 18 }} />
      <div style={{ background: withA("#064E3B", 0.6), borderRadius: 22, padding: 18, border: `1px solid ${withA(spec.accent, 0.31)}` }}>
        <div style={{ ...ROW, gap: 16 }}>
          <Avatar char={PET.emoji} size={64} bg={withA(spec.accent, 0.24)} />
          <div style={{ ...COL, flex: 1 }}>
            <p style={t.labelS(spec.accent)}>ROCKY · BORDER COLLIE</p>
            <p style={t.headlineS()}>3.2 km today</p>
            <p style={t.bodyS()}>in the forest park 🌲</p>
            <div style={{ height: 6 }} />
            <Progress value={0.65} color={spec.accent} track={spec.surface} />
          </div>
        </div>
      </div>
      <div style={{ height: 18 }} />
      <p style={t.labelM(spec.accent)}>NEARBY TRAILS</p>
      <div style={{ height: 10 }} />
      {[
        { icon: "🌳", title: "Oak Grove Loop", sub: "2.1 km · easy · 4 dogs there" },
        { icon: "⛰", title: "Ridge Path", sub: "4.8 km · moderate · scenic" },
      ].map((x) => (
        <div key={x.title} style={{ ...ROW, gap: 12, background: withA(spec.surface, 0.47), borderRadius: 16, padding: 14, marginBottom: 10 }}>
          <Avatar char={x.icon} size={32} bg={spec.accent} fontSize={14} />
          <div style={{ ...COL, flex: 1 }}>
            <p style={t.titleM()}>{x.title}</p>
            <p style={t.bodyS(spec.accent)}>{x.sub}</p>
          </div>
        </div>
      ))}
    </Page>
  );
}

// 05 · Sunny Sky
function PetSky({ onScan, onOpenPet }: LayoutProps) {
  const { spec } = useTheme();
  const t = text(spec);
  const quick: [string, string][] = [["📷", "Scan"], ["💊", "Meds"], ["🍽", "Food"], ["🏥", "Vet"]];
  return (
    <Page>
      <div style={ROW}>
        <p style={{ ...t.labelM(spec.accent), letterSpacing: 3 }}>PET · AI</p>
        <div style={{ flex: 1 }} />
        <SwitchBtn />
      </div>
      <div style={{ height: 8 }} />
      <p style={t.displayS()}>Sunny day,</p>
      <p style={t.displayS()}>happy paws.</p>
      <div style={{ height: 18 }} />
      <Card>
        <div style={{ ...ROW, gap: 14 }}>
          <Avatar char={PET.emoji} size={56} bg={spec.surfaceVariant} />
          <div style={{ ...COL, flex: 1 }}>
            <p style={t.labelS()}>SUNNY · LABRADOR</p>
            <p style={t.headlineS()}>Walk time!</p>
            <p style={t.bodyS()}>☀ 22°C · perfect outside</p>
          </div>
        </div>
      </Card>
      <div style={{ height: 18 }} />
      <p style={t.labelM()}>QUICK ACTIONS</p>
      <div style={{ height: 12 }} />
      <div style={{ ...ROW, justifyContent: "space-between" }}>
        {quick.map(([icon, label]) => (
          <div key={label} style={{ ...COL, alignItems: "center", cursor: label === "Scan" ? "pointer" : "default" }} onClick={label === "Scan" ? onScan : undefined}>
            <Avatar char={icon} size={56} bg={spec.surface} fontSize={22} />
            <div style={{ height: 6 }} />
            <p style={t.bodyS()}>{label}</p>
          </div>
        ))}
      </div>
      <div style={{ height: 18 }} />
      <Card onClick={onOpenPet}>
        <div style={{ ...ROW, gap: 12 }}>
          <Avatar char="🤖" size={24} bg="#10B981" fontSize={12} />
          <div style={{ ...COL, flex: 1 }}>
            <p style={t.titleM()}>Pet AI: Ready</p>
            <p style={t.bodyS()}>Ask me anything →</p>
          </div>
        </div>
      </Card>
    </Page>
  );
}

// 06 · Sunny Yellow
function PetYellow() {
  const { spec } = useTheme();
  const t = text(spec);
  const checks: [string, boolean][] = [
    ["Morning meal", true],
    ["Brush teeth", true],
    ["Morning walk (20 min)", false],
    ["Vitamin · 2pm", false],
  ];
  return (
    <Page>
      <div style={ROW}>
        <p style={t.labelM(spec.primary)}>GOOD MORNING ☀</p>
        <div style={{ flex: 1 }} />
        <SwitchBtn />
      </div>
      <div style={{ height: 8 }} />
      <p style={t.displayS()}>Time to</p>
      <p style={t.displayS(spec.primary)}>wag tails!</p>
      <div style={{ height: 18 }} />
      <Card>
        <div style={{ ...ROW, gap: 16 }}>
          <Avatar char={PET.emoji} size={72} bg={spec.surfaceVariant} />
          <div style={{ ...COL, flex: 1 }}>
            <p style={t.labelS()}>MEET BUDDY</p>
            <p style={t.headlineS()}>Energy: 85%</p>
            <div style={{ height: 6 }} />
            <Progress value={0.85} color={spec.primary} track={spec.surfaceVariant} height={8} />
            <div style={{ height: 8 }} />
            <p style={t.bodyS(spec.primary)}>🚶 Walk due in 20min</p>
          </div>
        </div>
      </Card>
      <div style={{ height: 18 }} />
      <p style={t.titleL()}>Today's checklist 🐾</p>
      <div style={{ height: 10 }} />
      {checks.map(([label, done]) => (
        <div key={label} style={{ ...ROW, gap: 12, marginBottom: 10 }}>
          <div style={{ width: 22, height: 22, borderRadius: "50%", background: done ? spec.primary : "transparent", border: `2px solid ${done ? spec.primary : spec.outline}`, display: "flex", alignItems: "center", justifyContent: "center", color: spec.onPrimary, fontSize: 12 }}>
            {done ? "✓" : ""}
          </div>
          <p style={{ ...t.titleM(), textDecoration: done ? "line-through" : "none" }}>{label}</p>
        </div>
      ))}
    </Page>
  );
}

// 07 · Paw Pattern
function PetPaws() {
  const { spec } = useTheme();
  const t = text(spec);
  const bars = [0.5, 0.7, 0.6, 0.8, 0.9, 0.95, 1.0];
  return (
    <Page>
      <div style={ROW}>
        <p style={t.labelM()}>PET · AI</p>
        <div style={{ flex: 1 }} />
        <SwitchBtn />
      </div>
      <div style={{ height: 8 }} />
      <p style={t.displayS()}>Track every</p>
      <p style={t.displayS()}>paw step.</p>
      <div style={{ height: 18 }} />
      <div style={{ background: spec.primary, borderRadius: 20, padding: 18 }}>
        <div style={{ ...ROW, gap: 16 }}>
          <Avatar char={PET.emoji} size={64} bg="rgba(255,255,255,0.15)" />
          <div style={{ ...COL, flex: 1 }}>
            <p style={t.labelS(withA(spec.onPrimary, 0.67))}>LIVE TRACKING</p>
            <p style={t.displayS(spec.onPrimary)}>12,420</p>
            <p style={t.bodyS(withA(spec.onPrimary, 0.7))}>paw-steps today</p>
          </div>
        </div>
      </div>
      <div style={{ height: 18 }} />
      <p style={t.labelM()}>PAW-PRINTS THIS WEEK</p>
      <div style={{ height: 12 }} />
      <div style={{ ...ROW, alignItems: "flex-end", height: 120, gap: 6 }}>
        {bars.map((b, i) => (
          <div key={i} style={{ flex: 1, height: 120 * b, borderRadius: 4, background: i >= 5 ? spec.accent : spec.primary }} />
        ))}
      </div>
    </Page>
  );
}

// 08 · Cartoon
function PetCartoon({ onScan, onOpenPet }: LayoutProps) {
  const { spec } = useTheme();
  const t = text(spec);
  const ink = "#1A1A1A";
  const Toon = ({ bg, icon, title, sub, onClick }: { bg: string; icon: string; title: string; sub: string; onClick: () => void }) => (
    <div onClick={onClick} style={{ ...COL, flex: 1, cursor: "pointer", background: bg, borderRadius: 20, padding: 16, border: `2.5px solid ${ink}` }}>
      <Emoji char={icon} size={28} />
      <div style={{ height: 10 }} />
      <p style={t.titleM(ink)}>{title}</p>
      <p style={t.bodyS(ink)}>{sub}</p>
    </div>
  );
  return (
    <Page>
      <div style={ROW}>
        <p style={t.titleL()}>hi friend! 👋</p>
        <div style={{ flex: 1 }} />
        <SwitchBtn />
      </div>
      <div style={{ height: 8 }} />
      <p style={t.displayS(spec.primary)}>Meet your</p>
      <p style={t.displayS(spec.secondary)}>pet's bestie 🤖</p>
      <div style={{ height: 18 }} />
      <div style={{ ...COL, alignItems: "center", background: spec.surface, borderRadius: 28, padding: 20, border: `3px solid ${ink}` }}>
        <Emoji char={PET.emoji} size={72} />
        <div style={{ height: 8 }} />
        <div style={{ background: spec.surfaceVariant, borderRadius: 16, border: `2px solid ${ink}`, padding: "8px 14px" }}>
          <p style={t.titleM(ink)}>"hewwo! i'm happy! 🐾"</p>
        </div>
      </div>
      <div style={{ height: 16 }} />
      <div style={{ ...ROW, gap: 14, alignItems: "stretch" }}>
        <Toon bg="#BFDBFE" icon="📷" title="Snap-a-Pet" sub="AI knows breed!" onClick={onScan} />
        <Toon bg="#FBCFE8" icon="💬" title="Vet-Chat" sub="Real humans!" onClick={onOpenPet} />
      </div>
    </Page>
  );
}

// 09 · Photo Dark
function PetPhotoDark({ onOpenPet }: LayoutProps) {
  const { spec } = useTheme();
  const t = text(spec);
  const Stat = ({ icon, label, value, highlight }: { icon: string; label: string; value: string; highlight?: boolean }) => {
    const fg = highlight ? spec.onPrimary : spec.textPrimary;
    return (
      <div style={{ ...COL, flex: 1, background: highlight ? spec.accent : spec.surface, borderRadius: 18, padding: 14 }}>
        <Emoji char={icon} size={18} />
        <div style={{ height: 10 }} />
        <p style={t.bodyS(withA(fg, 0.7))}>{label}</p>
        <p style={t.titleL(fg)}>{value}</p>
      </div>
    );
  };
  return (
    <Page padding="0 0 24px">
      <div style={{ position: "relative" }}>
        <div style={{ height: 300, background: `linear-gradient(${withA(spec.primary, 0.47)}, ${spec.bg})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Emoji char={PET.emoji} size={120} />
        </div>
        <div style={{ position: "absolute", top: 8, right: 8 }}><SwitchBtn /></div>
        <div style={{ position: "absolute", left: 20, right: 20, bottom: 20 }}>
          <p style={t.labelM(spec.primary)}>{PET.name.toUpperCase()} · GERMAN SHEPHERD</p>
          <p style={t.displayS("#FFFFFF")}>Healthy. Happy. Home.</p>
        </div>
      </div>
      <div style={{ padding: 20 }}>
        <div style={{ ...ROW, gap: 12, alignItems: "stretch" }}>
          <Stat icon="❤" label="heart rate" value="82" />
          <Stat icon="🌡" label="temp" value="38.5" />
          <Stat icon="🦴" label="next meal" value="17:30" highlight />
        </div>
        <div style={{ height: 16 }} />
        <Card onClick={onOpenPet}>
          <div style={{ ...ROW, gap: 12 }}>
            <Avatar char="🤖" size={32} bg={spec.accent} fontSize={14} />
            <div style={{ ...COL, flex: 1 }}>
              <p style={t.titleM()}>Ask Pet AI →</p>
              <p style={t.bodyS()}>Symptoms · diet · behavior</p>
            </div>
          </div>
        </Card>
      </div>
    </Page>
  );
}

// 10 · Scandi Minimal
function PetScandi({ onScan, onOpenPet }: LayoutProps) {
  const { spec } = useTheme();
  const t = text(spec);
  const Line = ({ icon, label, onClick }: { icon: string; label: string; onClick: () => void }) => (
    <div>
      <div onClick={onClick} style={{ ...ROW, cursor: "pointer", padding: "14px 0", gap: 14 }}>
        <Emoji char={icon} size={20} />
        <p style={{ ...t.bodyL(), flex: 1 }}>{label}</p>
        <span style={{ ...t.titleM(withA(spec.textPrimary, 0.55)) }}>→</span>
      </div>
      <div style={{ height: 1, background: spec.outline }} />
    </div>
  );
  return (
    <Page padding="16px 24px 24px">
      <div style={ROW}>
        <p style={t.labelM()}>PET · AI · 01</p>
        <div style={{ flex: 1 }} />
        <SwitchBtn />
      </div>
      <div style={{ height: 12 }} />
      <p style={t.displayM()}>Less app,</p>
      <p style={t.displayM()}>more pet.</p>
      <div style={{ width: 36, height: 2, background: spec.primary, margin: "16px 0" }} />
      <div style={{ background: spec.surface, borderRadius: 2, padding: 18 }}>
        <div style={{ ...ROW, gap: 16 }}>
          <Avatar char={PET.emoji} size={60} bg={spec.surfaceVariant} />
          <div style={{ ...COL, flex: 1 }}>
            <p style={t.labelM()}>MIA</p>
            <p style={t.headlineS()}>All good.</p>
            <p style={t.bodyS()}>No alerts. Nothing due.</p>
          </div>
        </div>
      </div>
      <div style={{ height: 18 }} />
      <p style={t.labelM()}>IF NEEDED</p>
      <div style={{ height: 4 }} />
      <Line icon="📷" label="Identify breed" onClick={onScan} />
      <Line icon="💬" label="Ask a vet" onClick={onOpenPet} />
      <Line icon="📅" label="Add reminder" onClick={onOpenPet} />
    </Page>
  );
}

// 11 · Coral Warm
function PetCoral() {
  const { spec } = useTheme();
  const t = text(spec);
  const grad = spec.gradient ?? [spec.primary, spec.secondary];
  const moments: [string, string, string][] = [["🍽", "Fed", "2/2"], ["😴", "Naps", "4"], ["🐾", "Play", "35m"]];
  return (
    <Page>
      <div style={ROW}>
        <p style={{ ...t.labelM(spec.primary), letterSpacing: 3 }}>PET · AI</p>
        <div style={{ flex: 1 }} />
        <SwitchBtn />
      </div>
      <div style={{ height: 8 }} />
      <p style={t.displayS()}>Care that</p>
      <p style={t.displayS(spec.primary)}>feels warm.</p>
      <div style={{ height: 18 }} />
      <div style={{ background: gradientCss(grad), borderRadius: 32, padding: 18 }}>
        <div style={{ ...ROW, gap: 16 }}>
          <Avatar char={PET.emoji} size={68} bg="rgba(255,255,255,0.3)" />
          <div style={{ ...COL, flex: 1 }}>
            <p style={t.labelS("rgba(255,255,255,0.78)")}>LUNA · TABBY · 2Y</p>
            <p style={t.headlineM("#FFFFFF")}>Purring,</p>
            <p style={t.headlineM("#FFFFFF")}>at 70 bpm.</p>
            <p style={t.bodyS("rgba(255,255,255,0.86)")}>happy &amp; healthy ✨</p>
          </div>
        </div>
      </div>
      <div style={{ height: 18 }} />
      <p style={t.titleL()}>Care moments today</p>
      <div style={{ height: 10 }} />
      <div style={{ ...ROW, gap: 12, alignItems: "stretch" }}>
        {moments.map(([emoji, label, value]) => (
          <div key={label} style={{ ...COL, alignItems: "center", flex: 1, background: spec.surface, borderRadius: 22, padding: 14 }}>
            <Avatar char={emoji} size={40} bg={spec.surfaceVariant} fontSize={18} />
            <div style={{ height: 8 }} />
            <p style={t.titleS(spec.textPrimary)}>{label}</p>
            <p style={t.headlineS(spec.primary)}>{value}</p>
          </div>
        ))}
      </div>
    </Page>
  );
}

// 12 · Neon Party
function PetNeonParty() {
  const { spec } = useTheme();
  const t = text(spec);
  const grad = spec.gradient ?? [spec.primary, spec.secondary];
  return (
    <Page>
      <div style={ROW}>
        <p style={{ ...t.labelM(spec.primary), letterSpacing: 4 }}>▒ PET · AI ▒</p>
        <div style={{ flex: 1 }} />
        <SwitchBtn />
      </div>
      <div style={{ height: 8 }} />
      <p style={t.displayS()}>RAVE</p>
      <p style={{ ...t.displayS(), background: gradientCss(grad), WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>FOR PAWS.</p>
      <div style={{ height: 18 }} />
      <div style={{ background: spec.surface, borderRadius: 20, padding: 18, border: `2px solid ${spec.primary}` }}>
        <div style={{ ...ROW, gap: 16 }}>
          <div style={{ width: 76, height: 76, borderRadius: "50%", position: "relative", flexShrink: 0 }}>
            {[0, 1, 2].map((i) => (
              <div key={i} style={{ position: "absolute", inset: i * 10, borderRadius: "50%", border: `2px solid ${grad[i % grad.length]}` }} />
            ))}
            <div style={{ position: "absolute", top: "calc(50% - 6px)", left: "calc(50% - 6px)", width: 12, height: 12, borderRadius: "50%", background: grad[grad.length - 1] }} />
          </div>
          <div style={{ ...COL, flex: 1 }}>
            <p style={t.labelM(spec.primary)}>ENERGY</p>
            <p style={t.headlineM("#FFFFFF")}>MAX</p>
            <p style={{ fontFamily: fmono(spec.monoFont), color: spec.secondary, fontSize: 11, margin: 0 }}>▓▓▓▓▓▓▓░ 92%</p>
          </div>
        </div>
      </div>
      <div style={{ height: 18 }} />
      <p style={t.labelM(spec.primary)}>SQUAD · 3 ONLINE</p>
      <div style={{ height: 12 }} />
      <div style={{ ...ROW, justifyContent: "space-around" }}>
        {["🐶", "🐕", "🐱", "+"].map((e, i) => (
          <Avatar key={i} char={e} size={48} bg={withA(spec.primary, 0.2)} fontSize={18} />
        ))}
      </div>
    </Page>
  );
}

// 13 · Vintage Pet Co.
function PetVintage() {
  const { spec } = useTheme();
  const t = text(spec);
  const ink = spec.primary;
  const Rule = () => <div style={{ height: 1, background: ink, margin: "6px 0" }} />;
  return (
    <Page>
      <div style={ROW}>
        <div style={{ flex: 1 }} />
        <p style={{ ...t.labelM(), letterSpacing: 4 }}>— EST. 2026 —</p>
        <div style={{ flex: 1 }} />
        <SwitchBtn />
      </div>
      <p style={{ ...t.displayM(), textAlign: "center" }}>PET &amp; CO.</p>
      <p style={{ ...t.titleM(spec.secondary), textAlign: "center", fontStyle: "italic" }}>a fine companion service</p>
      <Rule />
      <div style={{ background: spec.surface, border: `2px solid ${ink}`, padding: 14 }}>
        <div style={{ ...ROW, gap: 14 }}>
          <Avatar char={PET.emoji} size={64} bg={withA(ink, 0.12)} />
          <div style={{ ...COL, flex: 1 }}>
            <p style={t.labelS()}>CERTIFICATE OF HEALTH</p>
            <p style={t.headlineS()}>Lord Barkley</p>
            <p style={{ ...t.bodyS(), fontStyle: "italic" }}>spaniel, gentleman, age 5</p>
            <p style={t.bodyS()}>★ ★ ★ ★ ★ in good standing</p>
          </div>
        </div>
      </div>
      <div style={{ height: 14 }} />
      <p style={t.labelM()}>SERVICES OFFERED</p>
      <Rule />
      {["№ I  · Veterinary consult", "№ II · Pedigree records", "№ III · Daily wellness", "№ IV · Breed recognition"].map((s) => (
        <p key={s} style={{ ...t.titleM(), padding: "4px 0" }}>{s}</p>
      ))}
    </Page>
  );
}

// 14 · Aqua Glass
function PetAquaGlass({ onScan, onOpenPet }: LayoutProps) {
  const { spec } = useTheme();
  const t = text(spec);
  const onHero = "#FFFFFF";
  const glass: CSSProperties = { padding: 16, borderRadius: 24, background: "rgba(255,255,255,0.18)", border: "1px solid rgba(255,255,255,0.3)", backdropFilter: "blur(6px)" };
  return (
    <Page>
      <div style={ROW}>
        <p style={{ ...t.labelM(onHero), letterSpacing: 3 }}>PET · AI · AQUA</p>
        <div style={{ flex: 1 }} />
        <SwitchBtn />
      </div>
      <div style={{ height: 8 }} />
      <p style={t.displayS(onHero)}>Pet care.</p>
      <p style={t.displayS(onHero)}>Crystal clear.</p>
      <div style={{ height: 18 }} />
      <div style={glass}>
        <div style={{ ...ROW, gap: 14 }}>
          <Avatar char={PET.emoji} size={60} bg="rgba(255,255,255,0.3)" />
          <div style={{ ...COL, flex: 1 }}>
            <p style={t.labelS(withA(onHero, 0.75))}>REX · HUSKY · 2Y</p>
            <p style={t.titleL(onHero)}>All systems excellent.</p>
            <p style={t.bodyS(withA(onHero, 0.78))}>98% health · 4h until walk</p>
          </div>
        </div>
      </div>
      <div style={{ height: 14 }} />
      <div style={{ ...ROW, gap: 12, alignItems: "stretch" }}>
        <div onClick={onScan} style={{ ...glass, ...COL, flex: 1, cursor: "pointer" }}>
          <Emoji char="📷" size={20} />
          <div style={{ height: 10 }} />
          <p style={t.titleM(onHero)}>Breed AI</p>
          <p style={t.bodyS(withA(onHero, 0.75))}>scan now</p>
        </div>
        <div onClick={onOpenPet} style={{ ...glass, ...COL, flex: 1, cursor: "pointer" }}>
          <Emoji char="💬" size={20} />
          <div style={{ height: 10 }} />
          <p style={t.titleM(onHero)}>Vet chat</p>
          <p style={t.bodyS(withA(onHero, 0.75))}>90s reply</p>
        </div>
      </div>
    </Page>
  );
}

// 15 · Watercolor
function PetWatercolor({ onScan, onOpenPet }: LayoutProps) {
  const { spec } = useTheme();
  const t = text(spec);
  const Soft = ({ emoji, title, onClick }: { emoji: string; title: string; onClick: () => void }) => (
    <div onClick={onClick} style={{ ...COL, flex: 1, cursor: "pointer", background: withA("#FFFFFF", 0.78), borderRadius: 24, padding: 16 }}>
      <Emoji char={emoji} size={22} />
      <div style={{ height: 10 }} />
      <p style={t.titleM()}>{title}</p>
    </div>
  );
  return (
    <Page>
      <div style={ROW}>
        <p style={t.titleL(spec.accent)}>hello, you</p>
        <div style={{ flex: 1 }} />
        <SwitchBtn />
      </div>
      <p style={{ ...t.displayL(spec.textPrimary), fontSize: 44 }}>your pet</p>
      <p style={{ ...t.displayL(spec.primary), fontSize: 44 }}>is loved.</p>
      <div style={{ height: 16 }} />
      <div style={{ background: withA("#FFFFFF", 0.7), borderRadius: 28, padding: 18 }}>
        <div style={{ ...ROW, gap: 16 }}>
          <Avatar char={PET.emoji} size={68} bg={spec.surfaceVariant} />
          <div style={{ ...COL, flex: 1 }}>
            <p style={t.titleL()}>Mochi · 2y · ginger</p>
            <p style={t.headlineS()}>today: gentle</p>
            <p style={t.bodyS()}>she sat by the window for 2 hours, watching rain ☔</p>
            <p style={t.bodyM(spec.secondary)}>she purred 4 times.</p>
          </div>
        </div>
      </div>
      <div style={{ height: 16 }} />
      <p style={t.titleL()}>soft things to do →</p>
      <div style={{ height: 10 }} />
      <div style={{ ...ROW, gap: 14, alignItems: "stretch" }}>
        <Soft emoji="📝" title="a note about today" onClick={onOpenPet} />
        <Soft emoji="📸" title="a small photo, kept" onClick={onScan} />
      </div>
    </Page>
  );
}

// 16 · 3D Purple
function Pet3dPurple({ onScan, onOpenPet }: LayoutProps) {
  const { spec } = useTheme();
  const t = text(spec);
  const grad = spec.gradient ?? [spec.primary, spec.secondary];
  const Depth = ({ icon, title, sub, filled, onClick }: { icon: string; title: string; sub: string; filled: boolean; onClick: () => void }) => (
    <div onClick={onClick} style={{ ...COL, flex: 1, cursor: "pointer", padding: 14, borderRadius: 20, background: filled ? gradientCss(grad) : spec.surface, border: filled ? "none" : `1px solid ${spec.accent}` }}>
      <Emoji char={icon} size={20} />
      <div style={{ height: 10 }} />
      <p style={t.titleM(filled ? "#FFFFFF" : spec.textPrimary)}>{title}</p>
      <p style={t.bodyS(filled ? "rgba(255,255,255,0.7)" : spec.accent)}>{sub}</p>
    </div>
  );
  return (
    <Page>
      <div style={ROW}>
        <p style={{ ...t.labelM(spec.accent), letterSpacing: 3 }}>PET · AI · 3D</p>
        <div style={{ flex: 1 }} />
        <SwitchBtn />
      </div>
      <div style={{ height: 8 }} />
      <p style={t.displayS()}>Your pet,</p>
      <p style={t.displayS(spec.accent)}>in dimension.</p>
      <div style={{ height: 18 }} />
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div style={{ width: 140, height: 140, borderRadius: "50%", background: `radial-gradient(circle at 35% 35%, ${grad.join(", ")})`, boxShadow: `0 16px 40px ${withA(spec.primary, 0.47)}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Emoji char={PET.emoji} size={64} />
        </div>
      </div>
      <div style={{ height: 14 }} />
      <p style={{ ...t.labelM(spec.accent), textAlign: "center" }}>PIXEL · 3Y · POMERANIAN</p>
      <p style={{ ...t.titleM(), textAlign: "center" }}>touch to rotate · view in AR</p>
      <div style={{ height: 18 }} />
      <div style={{ ...ROW, gap: 12, alignItems: "stretch" }}>
        <Depth icon="📷" title="Scan" sub="breed AI" filled onClick={onScan} />
        <Depth icon="🎮" title="AR Play" sub="camera" filled={false} onClick={onOpenPet} />
        <Depth icon="💬" title="Vet" sub="chat live" filled={false} onClick={onOpenPet} />
      </div>
    </Page>
  );
}

// 17 · Sticker Collage
function PetSticker() {
  const { spec } = useTheme();
  const t = text(spec);
  const ink = spec.primary;
  const Sticker = ({ children, bg, angle }: { children: ReactNode; bg: string; angle: number }) => (
    <div style={{ transform: `rotate(${angle}deg)`, width: 76, height: 76, background: bg, borderRadius: 8, border: "3px solid #1A1A1A", display: "flex", alignItems: "center", justifyContent: "center" }}>
      {children}
    </div>
  );
  return (
    <Page>
      <div style={ROW}>
        <p style={t.labelM()}>★ PET · AI ★</p>
        <div style={{ flex: 1 }} />
        <SwitchBtn />
      </div>
      <div style={{ height: 8 }} />
      <p style={t.displayS()}>collect</p>
      <p style={t.displayS()}>pet moments</p>
      <div style={{ height: 18 }} />
      <div style={{ display: "flex", flexWrap: "wrap", gap: 14, justifyContent: "center" }}>
        <Sticker bg="#FFFFFF" angle={-4.6}><Emoji char={PET.emoji} size={34} /></Sticker>
        <Sticker bg="#FFFFFF" angle={4}><Emoji char="🐱" size={34} /></Sticker>
        <Sticker bg="#FFFFFF" angle={-2.9}><Emoji char="🐕" size={34} /></Sticker>
        <Sticker bg="#FFFFFF" angle={5.7}><Emoji char="🐾" size={32} /></Sticker>
        <Sticker bg={spec.secondary} angle={-4}><span style={t.headlineM("#FFFFFF")}>42</span></Sticker>
        <Sticker bg="#FFFFFF" angle={2.9}><span style={t.displayS(ink)}>+</span></Sticker>
      </div>
      <div style={{ height: 18 }} />
      <div style={{ background: ink, borderRadius: 20, padding: 18 }}>
        <p style={t.labelM(spec.accent)}>✦ DAILY CHALLENGE</p>
        <div style={{ height: 6 }} />
        <p style={t.headlineS(spec.onPrimary)}>Snap 3 pets</p>
        <p style={t.bodyS(withA(spec.onPrimary, 0.7))}>unlock the "park crew" sticker</p>
      </div>
    </Page>
  );
}

// 18 · Brutalist Orange
function PetBrutalistOrange({ onScan }: LayoutProps) {
  const { spec, openPicker } = useTheme();
  const t = text(spec);
  const ink = spec.primary;
  const paper = spec.onPrimary;
  return (
    <Page padding="16px 16px 24px">
      <div style={{ background: ink, padding: 16 }}>
        <div style={ROW}>
          <p style={t.labelM(paper)}>PET · AI · LOUD</p>
          <div style={{ flex: 1 }} />
          <button onClick={openPicker} style={{ border: "none", background: "transparent", cursor: "pointer", fontSize: 20, color: paper }}>🎨</button>
        </div>
        <p style={t.displayM(paper)}>CARE.</p>
        <p style={t.displayM(spec.secondary)}>PERIOD.</p>
      </div>
      <div style={{ height: 14 }} />
      <div style={{ ...ROW, gap: 14, alignItems: "stretch" }}>
        <div style={{ flex: 1, border: `4px solid ${ink}`, aspectRatio: "1", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Emoji char={PET.emoji} size={56} />
        </div>
        <div style={{ ...COL, flex: 1, gap: 14 }}>
          <div style={{ background: ink, padding: 14 }}>
            <p style={t.labelM(paper)}>HEALTH</p>
            <p style={t.displayS(paper)}>98%</p>
          </div>
          <div style={{ background: spec.surface, border: `4px solid ${ink}`, padding: 14 }}>
            <p style={t.labelM()}>MEALS</p>
            <p style={t.displayS()}>2/2</p>
          </div>
        </div>
      </div>
      <div style={{ height: 14 }} />
      <div onClick={onScan} style={{ cursor: "pointer", background: spec.surface, border: `4px solid ${ink}`, padding: 16 }}>
        <p style={t.labelM()}>AI · BREED SCAN</p>
        <p style={t.headlineS()}>POINT &amp; CLICK.</p>
        <p style={t.bodyS()}>98% ACCURACY · 200+ BREEDS</p>
      </div>
    </Page>
  );
}

// 19 · Cyber Matrix
function PetCyber({ onScan, onOpenPet }: LayoutProps) {
  const { spec } = useTheme();
  const t = text(spec);
  const mono = (color = spec.primary, size = 11): CSSProperties => ({ fontFamily: fmono(spec.monoFont), color, fontSize: size, lineHeight: 1.7, margin: 0 });
  const Mod = ({ no, name, state, onClick }: { no: string; name: string; state: string; onClick: () => void }) => (
    <div onClick={onClick} style={{ ...COL, flex: 1, cursor: "pointer", padding: 10, background: spec.surface, border: `1px solid ${spec.primary}` }}>
      <span style={mono(spec.primary, 10)}>{no} {name}</span>
      <span style={mono("#FFFFFF", 10)}>{state}</span>
    </div>
  );
  return (
    <Page>
      <div style={ROW}>
        <p style={{ ...t.labelM(spec.primary), letterSpacing: 3 }}>PET.SYS v4.1.7</p>
        <div style={{ flex: 1 }} />
        <SwitchBtn />
      </div>
      <div style={{ height: 8 }} />
      <p style={t.displayS(spec.primary)}>DECODE</p>
      <p style={t.displayS("#FFFFFF")}>YOUR.PET</p>
      <div style={{ height: 16 }} />
      <div style={{ background: spec.surface, border: `1px solid ${spec.primary}` }}>
        <div style={{ background: spec.primary, padding: "6px 12px" }}>
          <span style={{ ...mono(spec.bg), fontWeight: 700 }}>root@petai:~$ ./scan</span>
        </div>
        <div style={{ padding: 12, ...COL }}>
          <span style={mono()}>&gt; analyzing image...</span>
          <span style={mono()}>&gt; detected: canine</span>
          <span style={mono()}>&gt; breed: golden retriever</span>
          <span style={mono()}>&gt; confidence: 98.4%</span>
          <span style={{ ...mono("#FFFFFF"), fontWeight: 700 }}>[SUCCESS] match found_</span>
        </div>
      </div>
      <div style={{ height: 14 }} />
      <div style={{ ...ROW, gap: 10, alignItems: "stretch" }}>
        <Mod no="[01]" name="SCAN" state="breed.detect" onClick={onScan} />
        <Mod no="[02]" name="CHAT" state="vet.online" onClick={onOpenPet} />
        <Mod no="[03]" name="CARE" state="schedule.ai" onClick={onOpenPet} />
      </div>
    </Page>
  );
}

// 20 · Floral Garden
function PetFloral() {
  const { spec } = useTheme();
  const t = text(spec);
  const joys: [string, string, string][] = [["🌸", "grooming", "tomorrow"], ["🌻", "vitamin", "in 4 hours"], ["🍃", "play time", "now ✨"]];
  return (
    <Page>
      <div style={ROW}>
        <p style={t.titleL(spec.primary)}>a garden for your pet</p>
        <div style={{ flex: 1 }} />
        <SwitchBtn />
      </div>
      <p style={{ ...t.displayM(), fontStyle: "italic" }}>Bloom</p>
      <p style={{ ...t.displayM(spec.primary), fontStyle: "italic" }}>together.</p>
      <div style={{ height: 16 }} />
      <Card>
        <div style={{ ...ROW, gap: 16 }}>
          <Avatar char={PET.emoji} size={68} bg={spec.surfaceVariant} />
          <div style={{ ...COL, flex: 1 }}>
            <p style={t.labelS(spec.primary)}>PEONY · 4Y · MAINE COON</p>
            <p style={{ ...t.headlineS(), fontStyle: "italic" }}>in full bloom</p>
            <p style={t.bodyM()}>🌸 🌸 🌸 🌸 🌸</p>
            <p style={t.bodyS()}>5 of 5 healthy markers</p>
          </div>
        </div>
      </Card>
      <div style={{ height: 16 }} />
      <p style={{ ...t.titleM(), fontStyle: "italic" }}>today's small joys →</p>
      <div style={{ height: 10 }} />
      <div style={{ ...ROW, gap: 12, alignItems: "stretch" }}>
        {joys.map(([emoji, title, sub]) => (
          <div key={title} style={{ ...COL, flex: 1, background: spec.surfaceVariant, borderRadius: 22, padding: 14 }}>
            <Emoji char={emoji} size={22} />
            <div style={{ height: 8 }} />
            <p style={{ ...t.titleS(spec.textPrimary), fontStyle: "italic" }}>{title}</p>
            <p style={t.bodyS(spec.primary)}>{sub}</p>
          </div>
        ))}
      </div>
    </Page>
  );
}

const LAYOUTS: Record<string, React.FC<LayoutProps>> = {
  pet_pastel_pink: PetPastelPink,
  pet_dark_luxury: PetDarkLuxury,
  pet_rainbow: PetRainbow,
  pet_forest: PetForest,
  pet_sky: PetSky,
  pet_yellow: PetYellow,
  pet_paws: PetPaws,
  pet_cartoon: PetCartoon,
  pet_photo_dark: PetPhotoDark,
  pet_scandi: PetScandi,
  pet_coral: PetCoral,
  pet_neon_party: PetNeonParty,
  pet_vintage: PetVintage,
  pet_aqua_glass: PetAquaGlass,
  pet_watercolor: PetWatercolor,
  pet_3d_purple: Pet3dPurple,
  pet_sticker: PetSticker,
  pet_brutalist_orange: PetBrutalistOrange,
  pet_cyber: PetCyber,
  pet_floral: PetFloral,
};

// ─────────────────────────────────────────────────────────────────────────────
// SECONDARY SCREENS  (scan · vet chat · profile)
// ─────────────────────────────────────────────────────────────────────────────

function ScanScreen() {
  const { spec } = useTheme();
  const t = text(spec);
  const [scanned, setScanned] = useState(false);
  const Corner = ({ pos }: { pos: CSSProperties }) => (
    <div style={{ position: "absolute", width: 26, height: 26, borderColor: spec.accent, borderStyle: "solid", borderWidth: 0, ...pos }} />
  );
  return (
    <Page padding="8px 20px 24px">
      <p style={t.displayS()}>Breed scan</p>
      <div style={{ height: 4 }} />
      <p style={t.bodyM()}>Point at your pet — AI identifies in ~2s</p>
      <div style={{ height: 20 }} />
      <div style={{ position: "relative", aspectRatio: "3 / 4", borderRadius: spec.cardRadius, background: withA(spec.primary, 0.12), border: `2px solid ${spec.accent}`, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
        <Emoji char={PET.emoji} size={96} />
        <div style={{ position: "absolute", inset: 24 }}>
          <Corner pos={{ top: 0, left: 0, borderTopWidth: 3, borderLeftWidth: 3 }} />
          <Corner pos={{ top: 0, right: 0, borderTopWidth: 3, borderRightWidth: 3 }} />
          <Corner pos={{ bottom: 0, left: 0, borderBottomWidth: 3, borderLeftWidth: 3 }} />
          <Corner pos={{ bottom: 0, right: 0, borderBottomWidth: 3, borderRightWidth: 3 }} />
        </div>
        {scanned && (
          <div style={{ position: "absolute", top: 16, background: spec.accent, borderRadius: 20, padding: "6px 12px" }}>
            <span style={{ color: spec.onPrimary, fontSize: 11, fontWeight: 800 }}>{up(spec, "Match found · 92%")}</span>
          </div>
        )}
      </div>
      <div style={{ height: 20 }} />
      {!scanned ? (
        <Btn label={up(spec, "📷  Scan now")} onClick={() => setScanned(true)} />
      ) : (
        <>
          <SectionHeader title="AI result" />
          {SCAN_RESULT.map((r) => (
            <div key={r.breed} style={{ marginBottom: 10 }}>
              <Card style={{ padding: "14px 16px" }}>
                <div style={ROW}>
                  <p style={{ ...(r.pct > 50 ? t.titleL() : t.titleM()), flex: 1 }}>{r.breed}</p>
                  <p style={t.titleM(spec.accent)}>{r.pct}%</p>
                </div>
                <div style={{ height: 8 }} />
                <Progress value={r.pct / 100} color={spec.accent} track={spec.outline} />
              </Card>
            </div>
          ))}
          <div style={{ height: 8 }} />
          <Btn label={up(spec, "🔄  Scan again")} outlined onClick={() => setScanned(false)} />
        </>
      )}
    </Page>
  );
}

function VetChatScreen() {
  const { spec } = useTheme();
  const t = text(spec);
  const [messages, setMessages] = useState(VET_CHAT);
  const [draft, setDraft] = useState("");
  const send = () => {
    const msg = draft.trim();
    if (!msg) return;
    setMessages((m) => [
      ...m,
      { role: "user", text: msg },
      { role: "vet", text: "Thanks — noting that down for Bella. I'd suggest a quick photo of the ear so I can take a closer look." },
    ]);
    setDraft("");
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ ...ROW, gap: 12, padding: "8px 20px 0" }}>
        <div style={{ position: "relative" }}>
          <IconChip icon="🩺" />
          <div style={{ position: "absolute", right: 0, bottom: 0, width: 12, height: 12, borderRadius: "50%", background: "#22C55E", border: `2px solid ${spec.bg}` }} />
        </div>
        <div style={{ ...COL, flex: 1 }}>
          <p style={t.titleL()}>Dr. Lena · Vet</p>
          <p style={t.bodyS()}>Online · avg reply 90s</p>
        </div>
        <span style={{ fontSize: 20 }}>📹</span>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px" }}>
        {messages.map((m, i) => {
          const isVet = m.role === "vet";
          return (
            <div key={i} style={{ display: "flex", justifyContent: isVet ? "flex-start" : "flex-end", marginBottom: 12 }}>
              <div style={{ maxWidth: "78%", padding: "12px 16px", borderRadius: spec.cardRadius, background: isVet ? spec.surfaceVariant : spec.primary }}>
                <span style={{ ...t.bodyM(isVet ? spec.textPrimary : spec.onPrimary), lineHeight: 1.4 }}>{m.text}</span>
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ ...ROW, gap: 8, padding: "0 16px 12px" }}>
        <span style={{ fontSize: 20, color: spec.accent }}>📷</span>
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Describe a symptom…"
          style={{ flex: 1, height: 48, border: "none", borderRadius: spec.buttonRadius, background: spec.surfaceVariant, padding: "0 16px", color: spec.textPrimary, fontSize: 13, outline: "none" }}
        />
        <button onClick={send} style={{ width: 48, height: 48, border: "none", borderRadius: spec.cardRadius, background: spec.accent, color: spec.onPrimary, cursor: "pointer", fontSize: 18 }}>➤</button>
      </div>
    </div>
  );
}

function ProfileScreen() {
  const { spec, openPicker } = useTheme();
  const t = text(spec);
  const onHero = spec.gradient ? "#FFFFFF" : spec.onPrimary;
  const heroBg = spec.gradient ? gradientCss(spec.gradient) : spec.primary;
  const Stat = ({ value, label }: { value: string; label: string }) => (
    <Card style={{ flex: 1 }}>
      <p style={t.headlineM()}>{value}</p>
      <div style={{ height: 2 }} />
      <p style={t.labelS()}>{up(spec, label)}</p>
    </Card>
  );
  const Rec = ({ icon, title, value }: { icon: string; title: string; value: string }) => (
    <div style={{ ...ROW, gap: 12, padding: "12px 16px" }}>
      <IconChip icon={icon} size={40} />
      <p style={{ ...t.titleM(), flex: 1 }}>{title}</p>
      <p style={t.bodyS()}>{value}</p>
    </div>
  );
  return (
    <Page>
      <div style={{ background: heroBg, borderRadius: spec.cardRadius, padding: 24, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ width: 96, height: 96, borderRadius: spec.cardRadius * 1.4, background: "rgba(255,255,255,0.24)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Emoji char={PET.emoji} size={56} />
        </div>
        <div style={{ height: 14 }} />
        <p style={t.displayS(onHero)}>{PET.name}</p>
        <p style={t.bodyM(withA(onHero, 0.82))}>{PET.breed} · {PET.ageLabel}</p>
      </div>
      <div style={{ height: 20 }} />
      <div style={{ ...ROW, gap: 12, alignItems: "stretch" }}>
        <Stat value="92" label="Mood" />
        <Stat value="24.5kg" label="Weight" />
        <Stat value="38.5°" label="Temp" />
      </div>
      <div style={{ height: 24 }} />
      <SectionHeader title="Health record" />
      <Card style={{ padding: 0 }}>
        <Rec icon="💉" title="Vaccinations" value="Up to date" />
        <div style={{ height: 1, background: spec.outline, margin: "0 16px" }} />
        <Rec icon="⚖️" title="Weight log" value="Stable" />
        <div style={{ height: 1, background: spec.outline, margin: "0 16px" }} />
        <Rec icon="💊" title="Medications" value="1 active" />
      </Card>
      <div style={{ height: 16 }} />
      <SectionHeader title="Appearance" />
      <Card style={{ padding: 0 }} onClick={openPicker}>
        <div style={{ ...ROW, gap: 12, padding: "12px 16px" }}>
          <IconChip icon="🎨" size={40} />
          <div style={{ ...COL, flex: 1 }}>
            <p style={t.titleM()}>Theme</p>
            <p style={t.bodyS()}>{spec.name}</p>
          </div>
          <span style={{ fontSize: 20, color: spec.textSecondary }}>›</span>
        </div>
      </Card>
    </Page>
  );
}

function SectionHeader({ title }: { title: string }) {
  const { spec } = useTheme();
  const t = text(spec);
  return (
    <div style={{ padding: "4px 0 12px" }}>
      <p style={t.labelM()}>{up(spec, title)}</p>
    </div>
  );
}

function Btn({ label, onClick, outlined }: { label: string; onClick: () => void; outlined?: boolean }) {
  const { spec } = useTheme();
  return (
    <button
      onClick={onClick}
      style={{
        width: "100%",
        height: 52,
        borderRadius: spec.buttonRadius,
        border: outlined ? `1.2px solid ${spec.outline}` : "none",
        background: outlined ? "transparent" : spec.primary,
        color: outlined ? spec.textPrimary : spec.onPrimary,
        fontWeight: 800,
        fontSize: 13,
        cursor: "pointer",
        letterSpacing: spec.uppercase ? 2 : 0,
      }}
    >
      {label}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// BOTTOM NAV + THEME PICKER
// ─────────────────────────────────────────────────────────────────────────────

const NAV: { icon: string; label: string }[] = [
  { icon: "🏠", label: "Home" },
  { icon: "📷", label: "Scan" },
  { icon: "➕", label: "" },
  { icon: "💬", label: "Vet" },
  { icon: "🐾", label: "Pet" },
];

function BottomNav({ current, onTap, onCenter }: { current: number; onTap: (i: number) => void; onCenter: () => void }) {
  const { spec } = useTheme();
  return (
    <div style={{ padding: "0 16px 14px" }}>
      <div style={{ ...ROW, justifyContent: "space-around", background: spec.surfaceVariant, borderRadius: spec.cardRadius * 1.6, border: `0.8px solid ${spec.outline}`, padding: "10px 8px" }}>
        {NAV.map((item, i) => {
          if (i === 2) {
            return (
              <button key={i} onClick={onCenter} style={{ width: 50, height: 50, border: "none", borderRadius: spec.cardRadius, background: spec.accent, color: spec.onPrimary, cursor: "pointer", fontSize: 24 }}>
                {item.icon}
              </button>
            );
          }
          const active = i === current;
          const color = active ? spec.accent : withA(spec.textPrimary, 0.47);
          return (
            <button key={i} onClick={() => onTap(i)} style={{ ...COL, alignItems: "center", border: "none", background: "transparent", cursor: "pointer", gap: 4 }}>
              <span style={{ fontSize: 22, filter: active ? "none" : "grayscale(0.4)" }}>{item.icon}</span>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 0.2, color }}>{up(spec, item.label)}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ThemePicker({ currentId, onSelect, onClose }: { currentId: string; onSelect: (id: string) => void; onClose: () => void }) {
  return (
    <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "flex-end", zIndex: 50 }}>
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ width: "100%", maxHeight: "85%", background: "#101013", borderTopLeftRadius: 28, borderTopRightRadius: 28, display: "flex", flexDirection: "column", overflow: "hidden" }}
      >
        <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 0" }}>
          <div style={{ width: 40, height: 4, borderRadius: 2, background: "rgba(255,255,255,0.24)" }} />
        </div>
        <div style={{ ...ROW, padding: "16px 20px 8px", gap: 8 }}>
          <span style={{ fontSize: 20 }}>🎨</span>
          <span style={{ color: "#fff", fontSize: 18, fontWeight: 800 }}>Choose a theme</span>
          <div style={{ flex: 1 }} />
          <span style={{ color: "rgba(255,255,255,0.38)", fontSize: 12 }}>{THEMES.length} variants</span>
        </div>
        <div style={{ overflowY: "auto", padding: "8px 16px 32px", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
          {THEMES.map((s) => {
            const active = s.id === currentId;
            return (
              <button key={s.id} onClick={() => onSelect(s.id)} style={{ border: "none", background: "transparent", cursor: "pointer", padding: 0, display: "flex", flexDirection: "column" }}>
                <div style={{ aspectRatio: "0.62", borderRadius: 16, border: `${active ? 3 : 1}px solid ${active ? s.accent : "rgba(255,255,255,0.12)"}`, overflow: "hidden" }}>
                  <div style={{ height: "100%", background: s.gradient ? gradientCss(s.gradient) : s.bg, padding: 10, display: "flex", flexDirection: "column" }}>
                    <div style={{ width: 28, height: 28, borderRadius: s.cardRadius * 0.4, background: s.primary }} />
                    <div style={{ flex: 1 }} />
                    <div style={{ height: 8, width: 44, borderRadius: 4, background: s.accent }} />
                    <div style={{ height: 5 }} />
                    <div style={{ height: 6, width: 30, borderRadius: 3, background: s.textSecondary }} />
                  </div>
                </div>
                <div style={{ height: 6 }} />
                <span style={{ color: active ? s.accent : "rgba(255,255,255,0.7)", fontSize: 10, fontWeight: active ? 800 : 500, textAlign: "center", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {s.name.split("·").pop()?.trim()}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ROOT COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export default function PetAiApp() {
  const [themeId, setThemeId] = useState("pet_pastel_pink");
  const [tab, setTab] = useState(0); // 0 home · 1 scan · 2 vet · 3 pet
  const [pickerOpen, setPickerOpen] = useState(false);

  const spec = THEMES.find((t) => t.id === themeId) ?? THEMES[0];

  const ctx: Ctx = {
    spec,
    setThemeId,
    openPicker: () => setPickerOpen(true),
    onScan: () => setTab(1),
    onOpenPet: () => setTab(3),
  };

  const Home = LAYOUTS[themeId] ?? PetPastelPink;
  const navIndex = tab === 0 ? 0 : tab === 1 ? 1 : tab === 2 ? 3 : 4;

  return (
    <ThemeCtx.Provider value={ctx}>
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          height: "100dvh",
          maxWidth: 440,
          margin: "0 auto",
          background: spec.bg,
          color: spec.textPrimary,
          fontFamily: ff(spec.bodyFont),
          overflow: "hidden",
        }}
      >
        <div style={{ flex: 1, minHeight: 0 }}>
          {tab === 0 && <Home onScan={ctx.onScan} onOpenPet={ctx.onOpenPet} />}
          {tab === 1 && <ScanScreen />}
          {tab === 2 && <VetChatScreen />}
          {tab === 3 && <ProfileScreen />}
        </div>

        <BottomNav
          current={navIndex}
          onCenter={() => setTab(1)}
          onTap={(i) => setTab(i === 0 ? 0 : i === 1 ? 1 : i === 3 ? 2 : 3)}
        />

        {pickerOpen && (
          <ThemePicker
            currentId={themeId}
            onSelect={(id) => {
              setThemeId(id);
              setPickerOpen(false);
            }}
            onClose={() => setPickerOpen(false)}
          />
        )}
      </div>
    </ThemeCtx.Provider>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PUBLIC API — exported components for host integration
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Renders ONLY the home-screen layout for the given themeId, wrapped in
 * the internal ThemeCtx so all Pet* layouts work standalone. No bottom
 * nav, no theme picker — the host app provides those.
 *
 * Falls back to the first theme if themeId is unknown.
 */
export function ThemedHome({
  themeId,
  onScan = () => {},
  onOpenPet = () => {},
}: {
  themeId: string;
  onScan?: () => void;
  onOpenPet?: () => void;
}) {
  const spec = THEMES.find((t) => t.id === themeId) ?? THEMES[0];

  // Layout map — some Pet* fns take LayoutProps, some don't; cast as
  // a permissive any-props component so we can pass uniformly.
  const Layout: React.ComponentType<Partial<LayoutProps>> =
    (spec.id === "pet_pastel_pink"      ? PetPastelPink :
    spec.id === "pet_dark_luxury"      ? PetDarkLuxury :
    spec.id === "pet_rainbow"          ? PetRainbow :
    spec.id === "pet_forest"           ? PetForest :
    spec.id === "pet_sky"              ? PetSky :
    spec.id === "pet_yellow"           ? PetYellow :
    spec.id === "pet_paws"             ? PetPaws :
    spec.id === "pet_cartoon"          ? PetCartoon :
    spec.id === "pet_photo_dark"       ? PetPhotoDark :
    spec.id === "pet_scandi"           ? PetScandi :
    spec.id === "pet_coral"            ? PetCoral :
    spec.id === "pet_neon_party"       ? PetNeonParty :
    spec.id === "pet_vintage"          ? PetVintage :
    spec.id === "pet_aqua_glass"       ? PetAquaGlass :
    spec.id === "pet_watercolor"       ? PetWatercolor :
    spec.id === "pet_3d_purple"        ? Pet3dPurple :
    spec.id === "pet_sticker"          ? PetSticker :
    spec.id === "pet_brutalist_orange" ? PetBrutalistOrange :
    spec.id === "pet_cyber"            ? PetCyber :
    spec.id === "pet_floral"           ? PetFloral :
    PetPastelPink) as React.ComponentType<Partial<LayoutProps>>;

  const ctxValue: Ctx = {
    spec,
    setThemeId: () => {},   // no-op — host controls the theme
    openPicker: () => {},   // no-op — host has its own picker
    onScan,
    onOpenPet,
  };

  const flavor = animationFlavor(spec.id);

  return (
    <ThemeCtx.Provider value={ctxValue}>
      <motion.div
        key={spec.id}
        initial="hidden"
        animate="visible"
        variants={pageVariants[flavor]}
        style={{
          background: spec.bg,
          color: spec.textPrimary,
          minHeight: "100%",
          width: "100%",
          fontFamily: ff(spec.bodyFont),
        }}
      >
        <Layout onScan={onScan} onOpenPet={onOpenPet} />
      </motion.div>
    </ThemeCtx.Provider>
  );
}
