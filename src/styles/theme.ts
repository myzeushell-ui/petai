export const theme = {
  colors: {
    brand: {
      primary: "#22c55e",
      primaryDark: "#16a34a",
      primaryLight: "#86efac",
      secondary: "#6366f1",
    },
    health: {
      excellent: "#22c55e",
      good: "#3b82f6",
      fair: "#f59e0b",
      poor: "#ef4444",
    },
    status: {
      normal: "#22c55e",
      borderline: "#f59e0b",
      abnormal: "#f97316",
      critical: "#ef4444",
    },
  },
  petColors: {
    dog: "#F59E0B",
    cat: "#6366F1",
    rabbit: "#EC4899",
    bird: "#06B6D4",
    other: "#8B5CF6",
  },
} as const;

export type Theme = typeof theme;
