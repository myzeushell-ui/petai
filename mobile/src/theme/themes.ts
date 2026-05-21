// 6 design themes — switchable from Settings
// Generated to match design-previews.html mockups

export type ThemeId = "1A" | "1B" | "1C" | "2A" | "2B" | "2C";
export type ThemeStyle = "premium" | "glass";

export interface ThemePalette {
  // Backgrounds
  background: string;
  backgroundSecondary: string;
  surface: string;
  surfaceElevated: string;

  // Text
  text: string;
  textSecondary: string;
  textTertiary: string;
  textInverse: string;

  // Borders
  border: string;
  borderLight: string;

  // Brand
  primary: string;
  primaryDark: string;
  primaryLight: string;

  // Status
  success: string;
  warning: string;
  danger: string;
  info: string;

  // Health
  healthExcellent: string;
  healthGood: string;
  healthFair: string;
  healthPoor: string;

  // Misc
  cardShadow: string;
  overlay: string;

  // Glass theme extras
  glassBg: string;          // semi-transparent for glass cards
  glassBorder: string;
}

export interface Theme {
  id: ThemeId;
  name: string;
  group: "Premium Wellness" | "Glass iOS";
  description: string;
  style: ThemeStyle;
  isDark: boolean;
  swatches: string[];       // 4 colors for preview
  fontFamily: string;       // heading font
  palette: ThemePalette;
  gradient?: {
    base: string;
    blobs: Array<{ x: number; y: number; size: number; color: string; opacity: number }>;
  };
  accentGradient?: [string, string];  // for buttons/CTA
}

// ============ Premium Wellness palettes (light) ============

const p1a: ThemePalette = {
  background: "#FDF8F3", backgroundSecondary: "#F8EFE3", surface: "#FFFFFF", surfaceElevated: "#FFFFFF",
  text: "#2A2520", textSecondary: "#87766A", textTertiary: "#B5A498", textInverse: "#FDF8F3",
  border: "#F2E2D2", borderLight: "#F8EFE3",
  primary: "#C2562A", primaryDark: "#9C4421", primaryLight: "#F4D7C5",
  success: "#6A8059", warning: "#D97706", danger: "#B91C1C", info: "#0369A1",
  healthExcellent: "#6A8059", healthGood: "#0369A1", healthFair: "#D97706", healthPoor: "#B91C1C",
  cardShadow: "rgba(194,86,42,0.08)", overlay: "rgba(42,37,32,0.4)",
  glassBg: "rgba(255,255,255,0.6)", glassBorder: "rgba(194,86,42,0.15)",
};

const p1b: ThemePalette = {
  background: "#F4F1EA", backgroundSecondary: "#EDE6D3", surface: "#FFFFFF", surfaceElevated: "#FFFFFF",
  text: "#2C322A", textSecondary: "#6E7867", textTertiary: "#A3A89A", textInverse: "#F4F1EA",
  border: "#E0E5D5", borderLight: "#EDE6D3",
  primary: "#6A8059", primaryDark: "#4E6042", primaryLight: "#D9E5D1",
  success: "#6A8059", warning: "#D97706", danger: "#B91C1C", info: "#0369A1",
  healthExcellent: "#6A8059", healthGood: "#0369A1", healthFair: "#D97706", healthPoor: "#B91C1C",
  cardShadow: "rgba(106,128,89,0.08)", overlay: "rgba(44,50,42,0.4)",
  glassBg: "rgba(255,255,255,0.6)", glassBorder: "rgba(106,128,89,0.15)",
};

const p1c: ThemePalette = {
  background: "#FFF6F1", backgroundSecondary: "#FCEEDF", surface: "#FFFFFF", surfaceElevated: "#FFFFFF",
  text: "#2A1A14", textSecondary: "#8B5A4A", textTertiary: "#B89485", textInverse: "#FFF6F1",
  border: "#FFE0D6", borderLight: "#FCEEDF",
  primary: "#FF6B47", primaryDark: "#E0481F", primaryLight: "#FFD8C6",
  success: "#22c55e", warning: "#FB923C", danger: "#EF4444", info: "#0EA5E9",
  healthExcellent: "#22c55e", healthGood: "#0EA5E9", healthFair: "#FB923C", healthPoor: "#EF4444",
  cardShadow: "rgba(255,107,71,0.1)", overlay: "rgba(42,26,20,0.4)",
  glassBg: "rgba(255,255,255,0.6)", glassBorder: "rgba(255,107,71,0.2)",
};

// ============ Glass iOS palettes (dark) ============

const p2a: ThemePalette = {
  background: "#0A0717", backgroundSecondary: "#15102A", surface: "rgba(255,255,255,0.06)", surfaceElevated: "rgba(255,255,255,0.1)",
  text: "#FFFFFF", textSecondary: "#94a3b8", textTertiary: "#64748B", textInverse: "#0A0717",
  border: "rgba(255,255,255,0.12)", borderLight: "rgba(255,255,255,0.06)",
  primary: "#A855F7", primaryDark: "#7C3AED", primaryLight: "rgba(168,85,247,0.25)",
  success: "#4ADE80", warning: "#FBBF24", danger: "#F87171", info: "#38BDF8",
  healthExcellent: "#4ADE80", healthGood: "#38BDF8", healthFair: "#FBBF24", healthPoor: "#F87171",
  cardShadow: "rgba(0,0,0,0.3)", overlay: "rgba(10,7,23,0.6)",
  glassBg: "rgba(255,255,255,0.08)", glassBorder: "rgba(255,255,255,0.14)",
};

const p2b: ThemePalette = {
  background: "#021024", backgroundSecondary: "#0A1F3C", surface: "rgba(255,255,255,0.06)", surfaceElevated: "rgba(255,255,255,0.1)",
  text: "#FFFFFF", textSecondary: "#94a3b8", textTertiary: "#64748B", textInverse: "#021024",
  border: "rgba(255,255,255,0.12)", borderLight: "rgba(255,255,255,0.06)",
  primary: "#06B6D4", primaryDark: "#0E7490", primaryLight: "rgba(6,182,212,0.25)",
  success: "#4ADE80", warning: "#FBBF24", danger: "#F87171", info: "#67E8F9",
  healthExcellent: "#4ADE80", healthGood: "#67E8F9", healthFair: "#FBBF24", healthPoor: "#F87171",
  cardShadow: "rgba(0,0,0,0.4)", overlay: "rgba(2,16,36,0.6)",
  glassBg: "rgba(255,255,255,0.08)", glassBorder: "rgba(255,255,255,0.12)",
};

const p2c: ThemePalette = {
  background: "#0F0A1F", backgroundSecondary: "#1C1430", surface: "rgba(255,255,255,0.06)", surfaceElevated: "rgba(255,255,255,0.1)",
  text: "#FFFFFF", textSecondary: "#CBD5E1", textTertiary: "#64748B", textInverse: "#0F0A1F",
  border: "rgba(255,255,255,0.12)", borderLight: "rgba(255,255,255,0.06)",
  primary: "#FB923C", primaryDark: "#EA580C", primaryLight: "rgba(251,146,60,0.25)",
  success: "#4ADE80", warning: "#FB923C", danger: "#FB7185", info: "#F472B6",
  healthExcellent: "#4ADE80", healthGood: "#F472B6", healthFair: "#FB923C", healthPoor: "#FB7185",
  cardShadow: "rgba(0,0,0,0.4)", overlay: "rgba(15,10,31,0.6)",
  glassBg: "rgba(255,255,255,0.1)", glassBorder: "rgba(255,255,255,0.15)",
};

// ============ Theme registry ============

export const THEMES: Record<ThemeId, Theme> = {
  "1A": {
    id: "1A", name: "Terracotta", group: "Premium Wellness",
    description: "Earthy, grounding, classic warmth",
    style: "premium", isDark: false,
    swatches: ["#FDF8F3", "#C2562A", "#2A2520", "#F4D7C5"],
    fontFamily: "Inter_700Bold",
    palette: p1a,
    accentGradient: ["#C2562A", "#E8B496"],
  },
  "1B": {
    id: "1B", name: "Sage Calm", group: "Premium Wellness",
    description: "Forest, serene, zen quietness",
    style: "premium", isDark: false,
    swatches: ["#F4F1EA", "#6A8059", "#2C322A", "#D9E5D1"],
    fontFamily: "Inter_700Bold",
    palette: p1b,
    accentGradient: ["#6A8059", "#A5BA8E"],
  },
  "1C": {
    id: "1C", name: "Sunset Peach", group: "Premium Wellness",
    description: "Vibrant, warm, alive energy",
    style: "premium", isDark: false,
    swatches: ["#FFF6F1", "#FF6B47", "#2A1A14", "#FFD8C6"],
    fontFamily: "Inter_700Bold",
    palette: p1c,
    accentGradient: ["#FF6B47", "#FF8A5C"],
  },
  "2A": {
    id: "2A", name: "Aurora Violet", group: "Glass iOS",
    description: "Premium, futuristic, bold",
    style: "glass", isDark: true,
    swatches: ["#0A0717", "#A855F7", "#EC4899", "#6366F1"],
    fontFamily: "Inter_800ExtraBold",
    palette: p2a,
    accentGradient: ["#A855F7", "#EC4899"],
    gradient: {
      base: "#0A0717",
      blobs: [
        { x: 80, y: 10, size: 600, color: "#A855F7", opacity: 0.55 },
        { x: 20, y: 50, size: 500, color: "#EC4899", opacity: 0.4 },
        { x: 90, y: 90, size: 500, color: "#6366F1", opacity: 0.4 },
      ],
    },
  },
  "2B": {
    id: "2B", name: "Deep Ocean", group: "Glass iOS",
    description: "Calm, technical, trust",
    style: "glass", isDark: true,
    swatches: ["#021024", "#06B6D4", "#0EA5E9", "#22C55E"],
    fontFamily: "Inter_800ExtraBold",
    palette: p2b,
    accentGradient: ["#06B6D4", "#0EA5E9"],
    gradient: {
      base: "#021024",
      blobs: [
        { x: 75, y: -10, size: 700, color: "#06B6D4", opacity: 0.5 },
        { x: 10, y: 60, size: 500, color: "#0EA5E9", opacity: 0.45 },
        { x: 80, y: 100, size: 600, color: "#22C55E", opacity: 0.3 },
      ],
    },
  },
  "2C": {
    id: "2C", name: "Sunrise Amber", group: "Glass iOS",
    description: "Energetic, warm, luxe",
    style: "glass", isDark: true,
    swatches: ["#0F0A1F", "#FB923C", "#F43F5E", "#C026D3"],
    fontFamily: "Inter_800ExtraBold",
    palette: p2c,
    accentGradient: ["#FB923C", "#F43F5E"],
    gradient: {
      base: "#0F0A1F",
      blobs: [
        { x: 70, y: 0, size: 600, color: "#FB923C", opacity: 0.55 },
        { x: 20, y: 30, size: 500, color: "#F43F5E", opacity: 0.4 },
        { x: 90, y: 80, size: 600, color: "#C026D3", opacity: 0.35 },
      ],
    },
  },
};

export const THEME_LIST = Object.values(THEMES);
export const DEFAULT_THEME_ID: ThemeId = "2A";  // Default to Aurora Violet
