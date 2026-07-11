/**
 * Battle simulation.
 *
 * Not an RTS — battles resolve in rounds on the strategic map. Each round mixes
 * troop counts, unit type, terrain (defence bonus, choke point, archer/cavalry
 * modifiers), commander competence, morale, fatigue, supply and flanking into a
 * power comparison, then applies proportional casualties and morale shifts. Pure
 * and seeded so results are reproducible.
 */

import type {
  BalanceConfig,
  Battle,
  GameState,
  Location,
  Officer,
  Side,
  UnitGroup,
} from "./types";
import { randomRange } from "./rng";
import { clampStat } from "./util";

/** Enemy commander effective competence (0..100). */
const ENEMY_COMPETENCE = 66;

/** Choke points let only a fraction of an attacker's numbers engage. */
const CHOKE_ATTACK_FACTOR = 0.5;

/** Raw combat power of a single group in a given role at a location. */
export function groupPower(
  group: UnitGroup,
  location: Location,
  role: "attack" | "defense",
  balance: BalanceConfig,
): number {
  if (group.count <= 0) return 0;
  let power = group.count * (role === "attack" ? balance.attack[group.type] : balance.defense[group.type]);

  if (group.type === "archers") power *= location.effects.archerBonus;
  if (group.type === "cavalry") power *= location.effects.cavalryModifier;
  if (role === "defense") power *= location.effects.defenseBonus;

  // Morale 0..100 → 0.5..1.0 multiplier; fatigue erodes up to ~33%.
  power *= 0.5 + group.morale / 200;
  power *= 1 - group.fatigue / 300;
  // Low supply saps fighting power.
  if (group.supply < 30) power *= 0.85;
  return power;
}

function commanderCompetence(
  groups: UnitGroup[],
  officers: Officer[],
  side: Side,
): number {
  if (side === "enemy") return ENEMY_COMPETENCE;
  let best = 55;
  for (const g of groups) {
    const officer = officers.find((o) => o.id === g.commanderId && o.alive);
    if (officer) best = Math.max(best, officer.traits.competence);
  }
  return best;
}

function competenceFactor(competence: number): number {
  // 0..100 competence → 0.82..1.18 multiplier.
  return 0.82 + (competence / 100) * 0.36;
}

export interface RoundOutcome {
  units: UnitGroup[];
  playerCasualties: number;
  enemyCasualties: number;
  momentumDelta: number;
  logLine: string;
  rngState: number;
  flankOpportunity: boolean;
  decided: null | "player" | "enemy";
}

function sideGroups(state: GameState, ids: string[]): UnitGroup[] {
  return ids
    .map((id) => state.units.find((u) => u.id === id))
    .filter((u): u is UnitGroup => !!u && u.count > 0);
}

/** Resolve a single round of an active battle. Returns changed groups only. */
export function resolveBattleRound(battle: Battle, state: GameState): RoundOutcome {
  const location = state.locations.find((l) => l.id === battle.locationId)!;
  const playerGroups = sideGroups(state, battle.playerGroupIds);
  const enemyGroups = sideGroups(state, battle.enemyGroupIds);

  if (playerGroups.length === 0 || enemyGroups.length === 0) {
    return {
      units: [],
      playerCasualties: 0,
      enemyCasualties: 0,
      momentumDelta: 0,
      logLine: "",
      rngState: state.rngState,
      flankOpportunity: false,
      decided: playerGroups.length === 0 ? "enemy" : "player",
    };
  }

  const playerDefends = battle.defenderSide === "player";
  let playerPower = playerGroups.reduce(
    (s, g) => s + groupPower(g, location, playerDefends ? "defense" : "attack", state.balance),
    0,
  );
  let enemyPower = enemyGroups.reduce(
    (s, g) => s + groupPower(g, location, playerDefends ? "attack" : "defense", state.balance),
    0,
  );

  playerPower *= competenceFactor(commanderCompetence(playerGroups, state.officers, "player"));
  enemyPower *= competenceFactor(commanderCompetence(enemyGroups, state.officers, "enemy"));

  // Choke point throttles whoever is attacking across it.
  if (location.effects.chokePoint) {
    if (playerDefends) enemyPower *= CHOKE_ATTACK_FACTOR;
    else playerPower *= CHOKE_ATTACK_FACTOR;
  }

  const total = playerPower + enemyPower || 1;
  const playerShare = playerPower / total;

  // Casualties: the weaker side bleeds more. Small RNG jitter, no coin-flips.
  let rng = state.rngState;
  const jitterP = randomRange(rng, 0.82, 1.18);
  rng = jitterP.state;
  const jitterE = randomRange(rng, 0.82, 1.18);
  rng = jitterE.state;

  const playerCount = playerGroups.reduce((s, g) => s + g.count, 0);
  const enemyCount = enemyGroups.reduce((s, g) => s + g.count, 0);
  const rate = state.balance.casualtyRate;

  const enemyCasualties = Math.round(enemyCount * rate * playerShare * jitterE.value);
  const playerCasualties = Math.round(playerCount * rate * (1 - playerShare) * jitterP.value);

  const updated: UnitGroup[] = [];
  const applyCasualties = (groups: UnitGroup[], total: number, count: number, moraleHit: number) => {
    for (const g of groups) {
      const share = count > 0 ? g.count / count : 0;
      const loss = Math.min(g.count, Math.round(total * share));
      const newCount = Math.max(0, g.count - loss);
      const morale = clampStat(g.morale - moraleHit - (loss > 0 ? (loss / Math.max(1, g.count)) * 40 : 0));
      updated.push({
        ...g,
        count: newCount,
        morale: newCount === 0 ? 0 : morale,
        fatigue: clampStat(g.fatigue + 4),
        state: newCount === 0 ? "destroyed" : "fighting",
      });
    }
  };

  const playerLosing = playerShare < 0.5;
  applyCasualties(playerGroups, playerCasualties, playerCount, playerLosing ? 3 : 1);
  applyCasualties(enemyGroups, enemyCasualties, enemyCount, playerLosing ? 1 : 3);

  const momentumDelta = Math.round((playerShare - 0.5) * 40);

  // Decide the round: annihilation or a morale rout.
  const playerLeft = playerCount - playerCasualties;
  const enemyLeft = enemyCount - enemyCasualties;
  const playerAvgMorale =
    updated.filter((g) => g.side === "player").reduce((s, g) => s + g.morale, 0) /
    Math.max(1, playerGroups.length);
  const enemyAvgMorale =
    updated.filter((g) => g.side === "enemy").reduce((s, g) => s + g.morale, 0) /
    Math.max(1, enemyGroups.length);

  let decided: null | "player" | "enemy" = null;
  if (enemyLeft <= 0 || enemyAvgMorale < 12) decided = "player";
  else if (playerLeft <= 0 || playerAvgMorale < 10) decided = "enemy";

  // A flank opportunity opens when the fight is close and hangs in the balance.
  const flankOpportunity =
    decided === null && Math.abs(battle.momentum + momentumDelta) < 28 && battle.rounds >= 1;

  const logLine = buildRoundLog(location, playerShare, playerCasualties, enemyCasualties, battle);

  return {
    units: updated,
    playerCasualties,
    enemyCasualties,
    momentumDelta,
    logLine,
    rngState: rng,
    flankOpportunity,
    decided,
  };
}

function buildRoundLog(
  location: Location,
  playerShare: number,
  playerCas: number,
  enemyCas: number,
  battle: Battle,
): string {
  const place = location.name;
  if (playerShare > 0.66) return `У ${place} наши теснят врага (враг −${enemyCas}, мы −${playerCas}).`;
  if (playerShare < 0.34) return `У ${place} враг давит наш строй (мы −${playerCas}, враг −${enemyCas}).`;
  if (battle.rounds === 0) return `Бой у ${place} завязался — строй против строя.`;
  return `У ${place} идёт тяжёлая рубка (мы −${playerCas}, враг −${enemyCas}).`;
}

/** Create a fresh Battle object. */
export function makeBattle(
  id: string,
  locationId: string,
  defenderSide: Side,
  playerGroupIds: string[],
  enemyGroupIds: string[],
  tick: number,
): Battle {
  return {
    id,
    locationId,
    startedAt: tick,
    status: "active",
    defenderSide,
    playerGroupIds,
    enemyGroupIds,
    momentum: 0,
    playerCasualties: 0,
    enemyCasualties: 0,
    rounds: 0,
    log: [],
    flankOpportunity: false,
    roundTimer: 0,
  };
}
