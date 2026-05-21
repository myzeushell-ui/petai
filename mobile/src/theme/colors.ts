/**
 * @deprecated Use `useColors()` hook from ThemeContext instead.
 * This file is kept for backwards compat with legacy utility functions
 * (getHealthColor, getPriorityColor) that some screens still use.
 */
import { THEMES, DEFAULT_THEME_ID, type ThemePalette } from "./themes";

// Provide a default palette for non-component code paths
export const colors: ThemePalette = THEMES[DEFAULT_THEME_ID].palette;

// Re-export the types for convenience
export type { ThemePalette } from "./themes";

export function getHealthColor(score: number, palette: ThemePalette = colors): string {
  if (score >= 85) return palette.healthExcellent;
  if (score >= 70) return palette.healthGood;
  if (score >= 50) return palette.healthFair;
  return palette.healthPoor;
}

export function getPriorityColor(priority: "low" | "medium" | "high", palette: ThemePalette = colors): string {
  switch (priority) {
    case "high": return palette.danger;
    case "medium": return palette.warning;
    case "low": return palette.textTertiary;
  }
}

// Legacy aliases (for code that imported these directly)
export const lightColors = THEMES["1A"].palette;
export const darkColors = THEMES["2A"].palette;
