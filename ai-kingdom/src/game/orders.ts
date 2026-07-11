/**
 * Order system — builders and helpers for the formal Order lifecycle.
 *
 * The engine drives status transitions; this module provides the pure pieces:
 * building a draft order from a parsed command, estimating travel/ETA, splitting
 * a unit group when only part of a command is detached, and describing an order
 * for the confirmation card.
 */

import type {
  GameState,
  Location,
  Order,
  ParsedCommand,
  UnitGroup,
} from "./types";
import { ACTION_LABELS, DANGEROUS_ACTIONS, UNIT_LABELS_GENITIVE } from "./constants";
import { pathfind, travelMinutes } from "./world";
import { makeId } from "./ids";

export const ACTIVE_STATUSES: Order["status"][] = [
  "accepted",
  "preparing",
  "moving",
  "executing",
];

export function isActive(order: Order): boolean {
  return ACTIVE_STATUSES.includes(order.status);
}

/** Extra time (minutes) a task takes once the troops are in position. */
const ACTION_DURATION: Partial<Record<Order["action"], number>> = {
  SCOUT: 20,
  SUPPLY: 15,
  EVACUATE: 35,
  AMBUSH: 5,
};

export interface TravelEstimate {
  minutes: number;
  path: string[];
}

/** Estimate travel from an officer's current location to the order target. */
export function estimateTravel(
  state: GameState,
  fromId: string,
  targetId: string,
  unitType: UnitGroup["type"],
): TravelEstimate | null {
  const result = pathfind(fromId, targetId, state.locations);
  if (!result) return null;
  return {
    minutes: travelMinutes(result.path, unitType, state.locations, state.balance),
    path: result.path,
  };
}

/**
 * Build a fresh Order from a parsed command. Status starts at
 * `awaiting_confirmation` for dangerous actions, or `accepted` for safe ones.
 */
export function buildOrder(
  parsed: ParsedCommand,
  state: GameState,
): { order: Order; nextCounter: number } {
  const { id, next } = makeId("ord", state.idCounter);
  const officer = state.officers.find((o) => o.id === parsed.officerId);
  const unitType = parsed.unitType ?? "spearmen";

  let expectedCompletion: number | null = null;
  if (officer && parsed.targetLocationId) {
    const est = estimateTravel(state, officer.locationId, parsed.targetLocationId, unitType);
    if (est) {
      expectedCompletion = state.tick + est.minutes + (ACTION_DURATION[parsed.action] ?? 0);
    }
  }

  const needsConfirm = DANGEROUS_ACTIONS.includes(parsed.action);
  const order: Order = {
    id,
    officerId: parsed.officerId ?? "",
    action: parsed.action,
    targetLocationId: parsed.targetLocationId,
    unitType: parsed.unitType,
    unitCount: parsed.unitCount,
    unitGroupIds: [],
    conditions: parsed.conditions,
    priority: 1,
    createdAt: state.tick,
    startedAt: null,
    expectedCompletion,
    status: needsConfirm ? "awaiting_confirmation" : "accepted",
    risk: parsed.risk,
    sourceText: parsed.rawText,
    parsed,
    result: null,
  };
  return { order, nextCounter: next };
}

/**
 * Split a unit group so that `detach` soldiers form a new group (keeping the
 * same commander/type/morale) and the remainder stays behind. Returns both.
 */
export function splitGroup(
  group: UnitGroup,
  detach: number,
  newId: string,
): { kept: UnitGroup; detached: UnitGroup } {
  const take = Math.max(0, Math.min(group.count, detach));
  const detached: UnitGroup = {
    ...group,
    id: newId,
    count: take,
  };
  const kept: UnitGroup = {
    ...group,
    count: group.count - take,
  };
  return { kept, detached };
}

/**
 * Resolve which existing group an order should draw from, and how many soldiers.
 * Returns the source group and the count to commit.
 */
export function resolveOrderForce(
  order: Order,
  state: GameState,
): { source: UnitGroup | null; count: number } {
  const officerId = order.officerId;
  const candidates = state.units.filter(
    (u) => u.side === "player" && u.commanderId === officerId && u.count > 0,
  );
  const typed = order.unitType
    ? candidates.find((u) => u.type === order.unitType)
    : candidates[0];
  const source = typed ?? candidates[0] ?? null;
  if (!source) return { source: null, count: 0 };
  const requested = order.unitCount ?? source.count;
  return { source, count: Math.min(requested, source.count) };
}

function locName(state: GameState, id: string | null): string {
  return state.locations.find((l: Location) => l.id === id)?.name ?? "—";
}

export interface OrderCardLine {
  label: string;
  value: string;
}

/** Structured lines for the order-confirmation card. */
export function describeOrder(order: Order, state: GameState): OrderCardLine[] {
  const officer = state.officers.find((o) => o.id === order.officerId);
  const lines: OrderCardLine[] = [
    { label: "Исполнитель", value: officer?.name ?? "—" },
    { label: "Действие", value: ACTION_LABELS[order.action] },
  ];
  if (order.targetLocationId) lines.push({ label: "Цель", value: locName(state, order.targetLocationId) });
  if (order.unitCount != null && order.unitType) {
    lines.push({
      label: "Войска",
      value: `${order.unitCount} ${UNIT_LABELS_GENITIVE[order.unitType]}`,
    });
  }
  if (order.conditions.length) {
    const map: Record<string, string> = {
      until_dawn: "до рассвета",
      at_all_costs: "любой ценой",
      avoid_losses: "без лишних потерь",
      on_my_command: "по вашему сигналу",
      quietly: "скрытно",
      hold_position: "не покидая позиции",
    };
    lines.push({ label: "Условие", value: order.conditions.map((c) => map[c] ?? c).join(", ") });
  }
  if (order.expectedCompletion != null) {
    const eta = Math.max(0, Math.round(order.expectedCompletion - state.tick));
    lines.push({ label: "Прибытие", value: `~${eta} игровых минут` });
  }
  const riskMap = { none: "нет", low: "низкий", medium: "умеренный", high: "высокий", extreme: "смертельный" };
  lines.push({ label: "Риск", value: riskMap[order.risk] });
  return lines;
}
