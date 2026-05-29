/**
 * Shared framer-motion variants for all 20 theme layouts.
 *
 * Three core "personalities":
 *  - soft:  pastel/warm themes (gentle fade-up, low-stiffness spring)
 *  - sharp: glass/dark themes (faster scale-in, higher stiffness)
 *  - bouncy: playful themes (overshoot, elastic spring)
 *
 * Use stagger() for child-card cascades.
 */

import type { Variants, Transition } from "framer-motion";

// ─────────────────────────────────────────────────────────────────────────────
// Page entrance — wraps the whole Pet* layout
// ─────────────────────────────────────────────────────────────────────────────

export const pageVariants = {
  soft: {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
  },
  sharp: {
    hidden: { opacity: 0, scale: 0.96 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
  },
  bouncy: {
    hidden: { opacity: 0, scale: 0.9, y: 16 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 180, damping: 14, mass: 0.7 } },
  },
} as const satisfies Record<string, Variants>;

// ─────────────────────────────────────────────────────────────────────────────
// Card / tile stagger container + child
// ─────────────────────────────────────────────────────────────────────────────

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.07, delayChildren: 0.1 },
  },
};

export const cardChildVariants = {
  soft: {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
  },
  sharp: {
    hidden: { opacity: 0, scale: 0.92, y: 10 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 260, damping: 24 } },
  },
  bouncy: {
    hidden: { opacity: 0, scale: 0.85, y: 14, rotate: -3 },
    visible: { opacity: 1, scale: 1, y: 0, rotate: 0, transition: { type: "spring", stiffness: 200, damping: 12 } },
  },
} as const satisfies Record<string, Variants>;

// ─────────────────────────────────────────────────────────────────────────────
// Score / number count-in
// ─────────────────────────────────────────────────────────────────────────────

export const scoreVariants: Variants = {
  hidden: { opacity: 0, scale: 0.5 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 200, damping: 16, delay: 0.25 },
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Hero photo subtle zoom on entrance
// ─────────────────────────────────────────────────────────────────────────────

export const heroPhotoVariants: Variants = {
  hidden: { opacity: 0, scale: 1.06 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

// ─────────────────────────────────────────────────────────────────────────────
// Interactive tile (hover / tap)
// ─────────────────────────────────────────────────────────────────────────────

export const interactiveTile = {
  whileHover: { scale: 1.03, y: -2, transition: { type: "spring" as const, stiffness: 400, damping: 28 } },
  whileTap:   { scale: 0.97, transition: { type: "spring" as const, stiffness: 400, damping: 30 } },
};

// ─────────────────────────────────────────────────────────────────────────────
// Layout transition for content switching (theme switch / route change)
// ─────────────────────────────────────────────────────────────────────────────

export const themeSwitchTransition: Transition = {
  duration: 0.35,
  ease: [0.22, 1, 0.36, 1],
};

// ─────────────────────────────────────────────────────────────────────────────
// Per-theme personality lookup — which animation flavor to use
// ─────────────────────────────────────────────────────────────────────────────

export function animationFlavor(themeId: string): keyof typeof pageVariants {
  // Glass/dark themes get sharp animations
  if (["pet_dark_luxury", "pet_aqua_glass", "pet_3d_purple", "pet_cyber", "pet_photo_dark", "pet_neon_party"].includes(themeId)) {
    return "sharp";
  }
  // Playful themes get bouncy
  if (["pet_rainbow", "pet_cartoon", "pet_sticker", "pet_neon_party"].includes(themeId)) {
    return "bouncy";
  }
  // Default warm/pastel themes: soft
  return "soft";
}
