/**
 * World simulation — pathfinding, troop movement and supply/food logistics.
 * Pure helpers operating on plain data; the engine wires them into the tick.
 */

import type {
  BalanceConfig,
  Location,
  Resources,
  UnitGroup,
} from "./types";
import { clampStat } from "./util";

/* ------------------------------------------------------------------ */
/* Pathfinding                                                         */
/* ------------------------------------------------------------------ */

export interface PathResult {
  path: string[]; // includes start and destination
  distance: number;
}

/** Dijkstra over the road network by travel distance (game minutes). */
export function pathfind(
  fromId: string,
  toId: string,
  locations: Location[],
): PathResult | null {
  if (fromId === toId) return { path: [fromId], distance: 0 };
  const byId = new Map(locations.map((l) => [l.id, l]));
  if (!byId.has(fromId) || !byId.has(toId)) return null;

  const dist = new Map<string, number>();
  const prev = new Map<string, string>();
  const visited = new Set<string>();
  dist.set(fromId, 0);

  while (visited.size < locations.length) {
    // Pick the unvisited node with the smallest tentative distance.
    let current: string | null = null;
    let best = Infinity;
    for (const [id, d] of dist) {
      if (!visited.has(id) && d < best) {
        best = d;
        current = id;
      }
    }
    if (current == null) break;
    if (current === toId) break;
    visited.add(current);

    const loc = byId.get(current)!;
    for (const road of loc.roads) {
      if (visited.has(road.to)) continue;
      const nd = best + road.distance;
      if (nd < (dist.get(road.to) ?? Infinity)) {
        dist.set(road.to, nd);
        prev.set(road.to, current);
      }
    }
  }

  if (!dist.has(toId)) return null;
  const path: string[] = [toId];
  let cur = toId;
  while (cur !== fromId) {
    const p = prev.get(cur);
    if (p == null) return null;
    path.unshift(p);
    cur = p;
  }
  return { path, distance: dist.get(toId)! };
}

function hopDistance(fromId: string, toId: string, locations: Location[]): number {
  const from = locations.find((l) => l.id === fromId);
  const road = from?.roads.find((r) => r.to === toId);
  return road?.distance ?? 20;
}

/** Travel time in game minutes for a group crossing one road hop. */
export function hopMinutes(
  fromId: string,
  toId: string,
  type: UnitGroup["type"],
  locations: Location[],
  balance: BalanceConfig,
): number {
  const dest = locations.find((l) => l.id === toId);
  const terrain = dest?.effects.speedModifier ?? 1;
  return hopDistance(fromId, toId, locations) * balance.speed[type] * terrain;
}

/** Total travel time along a full path. */
export function travelMinutes(
  path: string[],
  type: UnitGroup["type"],
  locations: Location[],
  balance: BalanceConfig,
): number {
  let total = 0;
  for (let i = 0; i < path.length - 1; i++) {
    total += hopMinutes(path[i], path[i + 1], type, locations, balance);
  }
  return total;
}

/* ------------------------------------------------------------------ */
/* Movement stepping                                                   */
/* ------------------------------------------------------------------ */

export interface MoveStep {
  group: UnitGroup;
  arrived: boolean;
  arrivedAt: string | null;
  crossedInto: string | null;
}

/**
 * Advance one moving group by dt game minutes. Handles multi-hop paths and
 * reports arrival at the final destination and any waypoint crossed.
 */
export function stepGroupMovement(
  group: UnitGroup,
  dtMinutes: number,
  locations: Location[],
  balance: BalanceConfig,
): MoveStep {
  if (group.state !== "moving" || !group.moveToId || !group.moveFromId) {
    return { group, arrived: false, arrivedAt: null, crossedInto: null };
  }

  let g: UnitGroup = { ...group };
  let crossedInto: string | null = null;
  let remaining = dtMinutes;
  let guard = 0;

  while (remaining > 0 && guard++ < 32) {
    const from = g.moveFromId!;
    const to = g.moveToId!;
    const hop = hopMinutes(from, to, g.type, locations, balance);
    const progressLeft = 1 - (g.moveProgress ?? 0);
    const timeLeftOnHop = progressLeft * hop;

    if (remaining < timeLeftOnHop) {
      g.moveProgress = (g.moveProgress ?? 0) + remaining / hop;
      remaining = 0;
    } else {
      // Complete this hop.
      remaining -= timeLeftOnHop;
      g.locationId = to;
      crossedInto = to;
      const nextPath = g.movePath ?? [];
      if (nextPath.length > 0) {
        g.moveFromId = to;
        g.moveToId = nextPath[0];
        g.movePath = nextPath.slice(1);
        g.moveProgress = 0;
      } else {
        // Reached final destination.
        g.moveProgress = 1;
        return { group: g, arrived: true, arrivedAt: to, crossedInto };
      }
    }
  }

  return { group: g, arrived: false, arrivedAt: null, crossedInto };
}

/** Begin moving a group along a path (path[0] is its current location). */
export function beginMovement(group: UnitGroup, path: string[]): UnitGroup {
  if (path.length < 2) return group;
  return {
    ...group,
    state: "moving",
    moveFromId: path[0],
    moveToId: path[1],
    movePath: path.slice(2),
    moveDestId: path[path.length - 1],
    moveProgress: 0,
  };
}

export function clearMovement(group: UnitGroup): UnitGroup {
  const g = { ...group };
  delete g.moveFromId;
  delete g.moveToId;
  delete g.movePath;
  delete g.moveDestId;
  g.moveProgress = 0;
  return g;
}

/* ------------------------------------------------------------------ */
/* Supply & food                                                       */
/* ------------------------------------------------------------------ */

export interface SupplyResult {
  units: UnitGroup[];
  food: number;
  notes: string[];
}

/**
 * Drain food (kept at the castle) for the whole player army and drain per-group
 * supply while away from a supplied location. Low supply erodes morale.
 */
export function applySupply(
  units: UnitGroup[],
  resources: Resources,
  dtMinutes: number,
  locations: Location[],
  balance: BalanceConfig,
): SupplyResult {
  const hours = dtMinutes / 60;
  const notes: string[] = [];
  const suppliedLocations = new Set(
    locations.filter((l) => l.type === "castle" || l.foodStore > 0).map((l) => l.id),
  );

  const playerSoldiers = units
    .filter((u) => u.side === "player")
    .reduce((sum, u) => sum + u.count, 0);
  let food = resources.food - (playerSoldiers / 100) * balance.foodDrain * hours;
  const starving = food <= 0;
  food = Math.max(0, food);

  const updated = units.map((u) => {
    if (u.side !== "player" || u.count <= 0) return u;
    let supply = u.supply;
    let morale = u.morale;
    if (!suppliedLocations.has(u.locationId)) {
      supply = clampStat(supply - balance.supplyDrain * hours);
    } else {
      supply = clampStat(supply + balance.supplyDrain * 0.5 * hours);
    }
    if (supply < 25 || starving) {
      morale = clampStat(morale - (starving ? 3 : 1.5) * hours);
    }
    return { ...u, supply, morale };
  });

  if (starving) notes.push("Продовольствие на исходе — армия голодает и теряет мораль.");
  return { units: updated, food, notes };
}

/** Move food from a source location's store into the castle stockpile. */
export function deliverFood(
  amount: number,
  fromId: string,
  locations: Location[],
  resources: Resources,
): { locations: Location[]; food: number; delivered: number } {
  const source = locations.find((l) => l.id === fromId);
  const delivered = source ? Math.min(amount, source.foodStore) : 0;
  const newLocations = locations.map((l) =>
    l.id === fromId ? { ...l, foodStore: l.foodStore - delivered } : l,
  );
  return { locations: newLocations, food: resources.food + delivered, delivered };
}
