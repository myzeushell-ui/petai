/**
 * /designs — preview of all 20 bespoke PetAI design variants.
 *
 * The component is a zero-dependency drop-in (only React) that ships
 * with its own ThemePicker (palette icon top-right of the phone frame).
 * Each variant changes BOTH the colour palette AND the home layout.
 *
 * Source: synq repo, branch claude/peaceful-heisenberg-8qSG0,
 *         portable/PetAiDesigns.tsx
 */

import PetAiApp from "@/components/PetAiDesigns";

export const metadata = {
  title: "PetAI · 20 Design Variants",
  description: "Preview all 20 bespoke design directions for PetAI.",
};

export default function DesignsPage() {
  return <PetAiApp />;
}
