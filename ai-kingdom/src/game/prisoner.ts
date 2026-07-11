/**
 * Captured-commander finale.
 *
 * After the battle the player decides the enemy commander's fate. Each decision
 * shifts kingdom morale, plants a memory in every officer and feeds the end
 * report. Recruiting is not guaranteed — it weighs the prisoner's respect, how
 * the battle ended and the player's standing. Pure and seeded.
 */

import type {
  GameState,
  MemoryEventType,
  OutcomeKind,
  PrisonerDecision,
} from "./types";
import { chance } from "./rng";
import { clampStat } from "./util";

/** How much the beaten commander respects his captor, given the battle. */
export function computePrisonerRespect(state: GameState): number {
  const base: Record<OutcomeKind, number> = {
    decisive_victory: 78,
    tactical_victory: 66,
    costly_victory: 52,
    pyrrhic_victory: 44,
    defeat_castle_lost: 20,
    defeat_army_broken: 20,
    in_progress: 50,
  };
  let respect = base[state.outcome.kind] ?? 50;
  // A kingdom with high morale commands more respect.
  respect += (state.resources.kingdomMorale - 60) * 0.2;
  return clampStat(respect);
}

export interface PrisonerResolution {
  recruitSucceeded: boolean | null;
  moraleDelta: number;
  /** Memory planted in every surviving officer. */
  officerMemory: MemoryEventType;
  rngState: number;
  /** Narrator summary line shown in the finale + end report. */
  summary: string;
  /** Whether the enemy commander now serves the kingdom. */
  recruited: boolean;
}

export function resolvePrisoner(
  state: GameState,
  decision: PrisonerDecision,
  rngState: number,
): PrisonerResolution {
  const name = state.enemy.commanderName;
  const respect = state.prisoner?.respectForPlayer ?? computePrisonerRespect(state);

  switch (decision) {
    case "execute":
      return {
        recruitSucceeded: null,
        moraleDelta: +3,
        officerMemory: "PLAYER_EXECUTED_PRISONER",
        rngState,
        summary: `${name} казнён на рассвете. Враг усвоит урок, но милосердием это не назвать.`,
        recruited: false,
      };

    case "imprison":
      return {
        recruitSucceeded: null,
        moraleDelta: +1,
        officerMemory: "PLAYER_IMPRISONED_COMMANDER",
        rngState,
        summary: `${name} брошен в темницу — живой козырь для будущих переговоров.`,
        recruited: false,
      };

    case "release":
      return {
        recruitSucceeded: null,
        moraleDelta: -3,
        officerMemory: "PLAYER_SPARED_ENEMY_COMMANDER",
        rngState,
        summary: `Вы отпустили ${name}. Одни назовут это благородством, другие — слабостью.`,
        recruited: false,
      };

    case "recruit": {
      // Chance scales with the prisoner's respect and the kingdom's standing.
      const p = clampStat(respect + (state.resources.kingdomMorale - 55) * 0.3) / 100;
      const roll = chance(rngState, Math.min(0.9, Math.max(0.1, p)));
      if (roll.value) {
        return {
          recruitSucceeded: true,
          moraleDelta: +4,
          officerMemory: "PLAYER_RECRUITED_ENEMY_COMMANDER",
          rngState: roll.state,
          summary: `${name} преклонил колено и присягнул вам. Дерзкий выбор — время покажет, верный ли.`,
          recruited: true,
        };
      }
      return {
        recruitSucceeded: false,
        moraleDelta: -2,
        officerMemory: "PLAYER_SPARED_ENEMY_COMMANDER",
        rngState: roll.state,
        summary: `${name} с презрением отверг ваше предложение. Пришлось отпустить его ни с чем.`,
        recruited: false,
      };
    }
  }
}
