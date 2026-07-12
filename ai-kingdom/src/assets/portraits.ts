/**
 * PortraitManifest — maps a character to a portrait asset per emotional state.
 *
 * The pack ships one neutral portrait per character; additional states are
 * expressed for now through color grading / overlays in the Portrait component
 * (see Portrait.tsx). When painted variants arrive, point the states here.
 */

import type { GameAsset } from "./registry";
import { getAsset } from "./registry";

export type PortraitState =
  | "neutral"
  | "worried"
  | "angry"
  | "wounded"
  | "exhausted"
  | "victorious";

export type PortraitFaction = "player" | "enemy";

interface PortraitDef {
  faction: PortraitFaction;
  /** Character's house/faction accent, for the frame. */
  accent: string;
  states: Record<PortraitState, string>;
}

function mono(assetId: string, faction: PortraitFaction, accent: string): PortraitDef {
  return {
    faction,
    accent,
    states: {
      neutral: assetId,
      worried: assetId,
      angry: assetId,
      wounded: assetId,
      exhausted: assetId,
      victorious: assetId,
    },
  };
}

export const PORTRAITS: Record<string, PortraitDef> = {
  edward: mono("edward_vale_neutral", "player", "#c9a24a"),
  roland: mono("roland_ashford_neutral", "player", "#c0433a"),
  mara: mono("mara_velt_neutral", "player", "#4a8fb0"),
  alaric: mono("alaric_thorn_neutral", "player", "#6f8f3a"),
  elyne: mono("elyne_arden_neutral", "player", "#9a5ea8"),
  cassian: mono("cassian_reik_neutral", "enemy", "#8f2b22"),
};

export function portraitAsset(
  characterKey: string,
  state: PortraitState = "neutral",
): GameAsset | undefined {
  const def = PORTRAITS[characterKey];
  if (!def) return undefined;
  return getAsset(def.states[state] ?? def.states.neutral);
}

export function portraitFaction(characterKey: string): PortraitFaction {
  return PORTRAITS[characterKey]?.faction ?? "player";
}

export function portraitAccent(characterKey: string): string | undefined {
  return PORTRAITS[characterKey]?.accent;
}

/** Derive a portrait state from an officer's live condition. */
export function stateFromOfficer(o: {
  injury?: string;
  alive?: boolean;
  traits?: { stress?: number; resentment?: number; respectForPlayer?: number };
}): PortraitState {
  if (o.injury && o.injury !== "none" && o.injury !== "light") return "wounded";
  const t = o.traits ?? {};
  if ((t.resentment ?? 0) > 55) return "angry";
  if ((t.stress ?? 0) > 62) return "worried";
  if ((t.stress ?? 0) > 45) return "exhausted";
  return "neutral";
}
