export const lightColors = {
  primary: "#22c55e",
  primaryDark: "#16a34a",
  primaryLight: "#bbf7d0",

  accent: "#F59E0B",
  accentDark: "#D97706",

  indigo: "#6366F1",
  indigoDark: "#4F46E5",

  background: "#FFFFFF",
  backgroundSecondary: "#F9FAFB",
  surface: "#FFFFFF",
  surfaceElevated: "#FFFFFF",

  text: "#111827",
  textSecondary: "#6B7280",
  textTertiary: "#9CA3AF",
  textInverse: "#FFFFFF",

  border: "#E5E7EB",
  borderLight: "#F3F4F6",

  success: "#22c55e",
  warning: "#F59E0B",
  danger: "#EF4444",
  info: "#3B82F6",

  healthExcellent: "#22c55e",
  healthGood: "#3B82F6",
  healthFair: "#F59E0B",
  healthPoor: "#EF4444",

  cardShadow: "rgba(0, 0, 0, 0.05)",
  overlay: "rgba(0, 0, 0, 0.35)",
};

export const darkColors: typeof lightColors = {
  primary: "#22c55e",
  primaryDark: "#16a34a",
  primaryLight: "#16a34a",

  accent: "#F59E0B",
  accentDark: "#D97706",

  indigo: "#818CF8",
  indigoDark: "#6366F1",

  background: "#0F172A",
  backgroundSecondary: "#0A0F1E",
  surface: "#1E293B",
  surfaceElevated: "#293548",

  text: "#F1F5F9",
  textSecondary: "#94A3B8",
  textTertiary: "#64748B",
  textInverse: "#0F172A",

  border: "#334155",
  borderLight: "#1E293B",

  success: "#22c55e",
  warning: "#F59E0B",
  danger: "#F87171",
  info: "#60A5FA",

  healthExcellent: "#22c55e",
  healthGood: "#60A5FA",
  healthFair: "#FBBF24",
  healthPoor: "#F87171",

  cardShadow: "rgba(0, 0, 0, 0.3)",
  overlay: "rgba(0, 0, 0, 0.5)",
};

// Backwards-compat default export (light) — for files not yet using useColors()
export const colors = lightColors;

export function getHealthColor(score: number, palette: typeof lightColors = colors): string {
  if (score >= 85) return palette.healthExcellent;
  if (score >= 70) return palette.healthGood;
  if (score >= 50) return palette.healthFair;
  return palette.healthPoor;
}

export function getPriorityColor(priority: "low" | "medium" | "high", palette: typeof lightColors = colors): string {
  switch (priority) {
    case "high": return palette.danger;
    case "medium": return palette.warning;
    case "low": return palette.textTertiary;
  }
}
