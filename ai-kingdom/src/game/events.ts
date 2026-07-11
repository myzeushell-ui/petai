/**
 * Event system — scripted narrative beats and factories for world events / log
 * entries. Enemy tactical behaviour lives in the engine; this module keeps the
 * data-driven, timed pieces and the small constructors the engine reuses.
 */

import type {
  GameState,
  LogEntry,
  ScenarioConfig,
  WorldEvent,
  WorldEventKind,
} from "./types";
import { makeId } from "./ids";

export interface WorldEventInput {
  kind: WorldEventKind;
  severity: "info" | "notable" | "critical";
  title: string;
  message: string;
  officerId?: string | null;
  locationId?: string | null;
  requiresPause?: boolean;
}

export function makeWorldEvent(
  input: WorldEventInput,
  tick: number,
  counter: number,
): { event: WorldEvent; next: number } {
  const { id, next } = makeId("evt", counter);
  return {
    event: {
      id,
      tick,
      kind: input.kind,
      severity: input.severity,
      title: input.title,
      message: input.message,
      officerId: input.officerId ?? null,
      locationId: input.locationId ?? null,
      requiresPause: input.requiresPause ?? false,
      handled: false,
    },
    next,
  };
}

export function makeLogEntry(
  text: string,
  kind: LogEntry["kind"],
  severity: LogEntry["severity"],
  tick: number,
  counter: number,
): { entry: LogEntry; next: number } {
  const { id, next } = makeId("log", counter);
  return { entry: { id, tick, kind, text, severity }, next };
}

/**
 * Fire scenario scripted events whose tick falls in (prevTick, newTick].
 * Returns the produced world events + log entries and the advanced id counter.
 */
export function collectScriptedEvents(
  scenario: ScenarioConfig,
  prevTick: number,
  newTick: number,
  counter: number,
): { events: WorldEvent[]; logs: LogEntry[]; next: number } {
  const events: WorldEvent[] = [];
  const logs: LogEntry[] = [];
  let c = counter;
  for (const scripted of scenario.scriptedEvents) {
    if (scripted.atTick > prevTick && scripted.atTick <= newTick) {
      const ev = makeWorldEvent(
        {
          kind: scripted.kind,
          severity: scripted.severity,
          title: scripted.title,
          message: scripted.message,
          requiresPause: scripted.requiresPause,
        },
        scripted.atTick,
        c,
      );
      events.push(ev.event);
      c = ev.next;
      const lg = makeLogEntry(scripted.message, scripted.kind, scripted.severity, scripted.atTick, c);
      logs.push(lg.entry);
      c = lg.next;
    }
  }
  return { events, logs, next: c };
}

/**
 * A short, deliberately vague scouting report that gets sharper as intel rises.
 */
export function scoutingReport(state: GameState, intel: number): string {
  const enemy = state.enemy;
  if (intel < 0.34) {
    return "Разведчики вернулись с обрывками сведений: колонна врага велика, точный состав неясен.";
  }
  if (intel < 0.7) {
    const approx = Math.round((enemy.trueStrength * 0.85) / 50) * 50;
    return `Разведка докладывает: у врага около ${approx} бойцов, среди них есть конница. Идут по восточной дороге к мосту.`;
  }
  const comp = state.flags.enemyComposition;
  void comp;
  return `Точные данные получены: ${enemy.trueStrength} бойцов — ${state.enemy.commanderName} ведёт пехоту, лучников и конницу прямо на мост.`;
}
