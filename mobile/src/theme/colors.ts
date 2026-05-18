export const colors = {
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
  surfaceDark: "#111827",

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
};

export const darkColors = {
  ...colors,
  background: "#111827",
  backgroundSecondary: "#1F2937",
  surface: "#1F2937",
  text: "#F9FAFB",
  textSecondary: "#9CA3AF",
  textTertiary: "#6B7280",
  border: "#374151",
  borderLight: "#1F2937",
  cardShadow: "rgba(0, 0, 0, 0.3)",
};

export function getHealthColor(score: number): string {
  if (score >= 85) return colors.healthExcellent;
  if (score >= 70) return colors.healthGood;
  if (score >= 50) return colors.healthFair;
  return colors.healthPoor;
}

export function getPriorityColor(priority: "low" | "medium" | "high"): string {
  switch (priority) {
    case "high": return colors.danger;
    case "medium": return colors.warning;
    case "low": return colors.textTertiary;
  }
}
