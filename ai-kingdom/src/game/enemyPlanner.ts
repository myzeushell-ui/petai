/**
 * Adaptive enemy planner — Cassian Rake reasons from what he can actually see.
 *
 * Pure and explainable: given the current GameState it builds an EnemyKnowledge
 * (fog-of-war bounded — no peeking at hidden forces), scores three plans on
 * probabilityOfSuccess / expectedLosses / timeToCastle / supplyDamage / surprise
 * plus the commander's preference, and returns the winner with a rationale.
 * No RNG, no hidden combat bonuses — the debug panel can show the whole table.
 */

import type {
  EnemyKnowledge,
  EnemyPlanChoice,
  EnemyPlanId,
  EnemyPlanScore,
  GameState,
  UnitGroup,
} from "./types";

function playerGroups(s: GameState): UnitGroup[] {
  return s.units.filter((u) => u.side === "player" && u.count > 0 && u.state !== "destroyed");
}

/** What the enemy can legitimately infer from scouting + open positions. */
export function buildEnemyKnowledge(s: GameState): EnemyKnowledge {
  const locById = new Map(s.locations.map((l) => [l.id, l]));
  const groups = playerGroups(s);

  // Enemy sees player forces that are in the open (not hiding in cover) or engaged.
  const known = groups.filter((u) => {
    const loc = locById.get(u.locationId);
    const hidden = loc?.effects.hidesTroops && u.state !== "fighting";
    return !hidden;
  });
  const knownPlayerLocations = [...new Set(known.map((u) => u.locationId))];

  const knownStrength = known.reduce((sum, u) => sum + u.count, 0);
  const confidence = Math.min(1, groups.length ? known.length / groups.length : 0);
  // Estimate scales up a little for the forces he cannot see.
  const estimatedStrength = knownStrength > 0 ? Math.round(knownStrength / Math.max(0.5, confidence)) : null;

  const bridgeKnown = knownPlayerLocations.includes("bridge");
  const barricadeSeen = Boolean(s.flags.bridgeFortified) && bridgeKnown;
  const cavalrySeen = known.some((u) => u.type === "cavalry");

  const villageState = s.flags.villageRaided
    ? "raided"
    : s.village.evacuationProgress >= 0.9 || s.flags.villageEvacuated
      ? "evacuated"
      : "populated";

  return {
    knownPlayerLocations,
    estimatedStrength,
    confidence,
    barricadeSeen,
    cavalrySeen,
    villageState,
  };
}

const PLANS: EnemyPlanId[] = [
  "MASS_BRIDGE_ASSAULT",
  "BRIDGE_FEINT_FOREST_FLANK",
  "VILLAGE_SUPPLY_CUT",
];

function bridgeGarrison(s: GameState): number {
  return s.units
    .filter((u) => u.side === "player" && u.locationId === "bridge" && u.count > 0)
    .reduce((sum, u) => sum + u.count, 0);
}

function forestScouted(s: GameState): boolean {
  // If the player has eyes on the forest, a flank is riskier for the enemy.
  return s.units.some((u) => u.side === "player" && u.locationId === "forest" && u.count > 0);
}

function scorePlan(id: EnemyPlanId, s: GameState, k: EnemyKnowledge): EnemyPlanScore {
  const garr = bridgeGarrison(s);
  const forestWatched = forestScouted(s);
  let probabilityOfSuccess = 0.5;
  let expectedLosses = 0.5;
  let timeToCastle = 0.5;
  let supplyDamage = 0;
  let surprise = 0;

  switch (id) {
    case "MASS_BRIDGE_ASSAULT": {
      // Direct and fast, but bleeds at a defended choke; a barricade makes it worse.
      probabilityOfSuccess = 0.6 - Math.min(0.4, garr / 900) - (k.barricadeSeen ? 0.2 : 0);
      expectedLosses = 0.55 + Math.min(0.35, garr / 700) + (k.barricadeSeen ? 0.15 : 0);
      timeToCastle = 0.25;
      supplyDamage = 0.1;
      surprise = 0.05;
      break;
    }
    case "BRIDGE_FEINT_FOREST_FLANK": {
      // Pin the bridge, slip cavalry through the woods. Deadly if the forest is unwatched.
      probabilityOfSuccess = 0.5 + (forestWatched ? -0.15 : 0.22) + (k.confidence < 0.6 ? 0.1 : 0);
      expectedLosses = 0.35 + (forestWatched ? 0.15 : 0);
      timeToCastle = 0.5;
      supplyDamage = 0.15;
      surprise = forestWatched ? 0.2 : 0.55;
      break;
    }
    case "VILLAGE_SUPPLY_CUT": {
      // Starve the fortress: raid the village and cut the wagons.
      const worth = k.villageState === "populated" ? 0.3 : k.villageState === "evacuated" ? -0.1 : -0.25;
      probabilityOfSuccess = 0.45 + worth + (k.cavalrySeen ? -0.05 : 0.05);
      expectedLosses = 0.3;
      timeToCastle = 0.7;
      supplyDamage = k.villageState === "populated" ? 0.6 : 0.2;
      surprise = 0.3;
      break;
    }
  }

  // Cassian prefers efficient, low-loss, surprising strokes over brute force.
  const commanderPreference = surprise * 0.25 + (1 - expectedLosses) * 0.3;
  const score =
    probabilityOfSuccess * 0.4 +
    (1 - expectedLosses) * 0.25 +
    (1 - timeToCastle) * 0.12 +
    supplyDamage * 0.13 +
    commanderPreference * 0.2;

  return {
    id,
    score: Math.round(score * 1000) / 1000,
    probabilityOfSuccess: clamp01(probabilityOfSuccess),
    expectedLosses: clamp01(expectedLosses),
    timeToCastle: clamp01(timeToCastle),
    supplyDamage: clamp01(supplyDamage),
    surprise: clamp01(surprise),
  };
}

function clamp01(n: number): number {
  return Math.min(1, Math.max(0, n));
}

const PLAN_REASON: Record<EnemyPlanId, (k: EnemyKnowledge) => string> = {
  MASS_BRIDGE_ASSAULT: () =>
    "Мост слабо прикрыт — Рейк бьёт в лоб всей силой, пока оборона не готова.",
  BRIDGE_FEINT_FOREST_FLANK: (k) =>
    k.confidence < 0.6
      ? "Позиции короля неясны. Рейк имитирует натиск на мост и посылает конницу лесом в обход."
      : "Рейк сковывает мост ложной атакой и обходит через северный лес.",
  VILLAGE_SUPPLY_CUT: () =>
    "Рейк режет снабжение: удар по деревне и обозам, чтобы крепость голодала к рассвету.",
};

/** Choose the enemy's plan from current knowledge. Deterministic. */
export function chooseEnemyPlan(s: GameState): EnemyPlanChoice {
  const knowledge = buildEnemyKnowledge(s);
  const scores = PLANS.map((id) => scorePlan(id, s, knowledge)).sort((a, b) => b.score - a.score);
  const best = scores[0];
  return {
    id: best.id,
    reason: PLAN_REASON[best.id](knowledge),
    scores,
    knowledge,
    committedAtTick: s.tick,
  };
}
