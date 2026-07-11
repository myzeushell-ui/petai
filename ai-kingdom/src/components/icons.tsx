/** Minimal inline SVG icons for map locations and unit types. */

import type { LocationType, UnitType } from "../game/types";

const S = { fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };

export function LocationIcon({ type, size = 22 }: { type: LocationType; size?: number }) {
  const p = { width: size, height: size, viewBox: "0 0 24 24", ...S };
  switch (type) {
    case "castle":
      return (
        <svg {...p}><path d="M4 20V9l2 1V7l2 1V6l2 1V6l2-1v2l2-1v2l2-1v3l2-1v11z" /><path d="M9 20v-4h3v4" /></svg>
      );
    case "bridge":
      return (
        <svg {...p}><path d="M3 15c4 0 4-4 9-4s5 4 9 4" /><path d="M3 15v3M21 15v3M8 13v5M16 13v5M12 11v7" /></svg>
      );
    case "forest":
      return (
        <svg {...p}><path d="M12 3l4 6h-3l3 5h-8l3-5H7z" /><path d="M12 14v6" /></svg>
      );
    case "village":
      return (
        <svg {...p}><path d="M4 20v-8l8-6 8 6v8z" /><path d="M10 20v-5h4v5" /></svg>
      );
    case "hills":
      return (
        <svg {...p}><path d="M2 19c3-6 5-6 7 0M9 19c3-8 6-8 9 0" /></svg>
      );
    case "enemy_camp":
      return (
        <svg {...p}><path d="M4 20l8-14 8 14z" /><path d="M9 20l3-5 3 5" /></svg>
      );
    case "road":
      return (
        <svg {...p}><path d="M6 20l4-16M18 20l-4-16" /><path d="M12 6v2M12 12v2M12 17v1" /></svg>
      );
    default:
      return (
        <svg {...p}><circle cx="12" cy="12" r="7" /></svg>
      );
  }
}

export function UnitIcon({ type, size = 14 }: { type: UnitType; size?: number }) {
  const p = { width: size, height: size, viewBox: "0 0 24 24", ...S, strokeWidth: 2 };
  switch (type) {
    case "spearmen":
      return <svg {...p}><path d="M12 3v18" /><path d="M12 3l3 4h-6z" /></svg>;
    case "archers":
      return <svg {...p}><path d="M5 4c8 2 8 14 0 16" /><path d="M5 12h13" /><path d="M15 9l3 3-3 3" /></svg>;
    case "cavalry":
      return <svg {...p}><path d="M4 18c1-6 5-9 9-9l3-3 1 3-2 2c3 2 4 6 4 10" /></svg>;
  }
}

export const UNIT_GLYPH: Record<UnitType, string> = {
  spearmen: "К",
  archers: "Л",
  cavalry: "В",
};
