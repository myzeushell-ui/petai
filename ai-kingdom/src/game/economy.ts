/**
 * Economy & Logistics (Master Game Bible §12–14, Phase 2).
 *
 * Data-driven production chains: each building in a province consumes inputs
 * (goods it has, or the province's natural resource richness) plus workers, and
 * produces outputs — one strategic day at a time. Surplus flows to the realm
 * stockpile along roads with finite capacity, so long chains and thin roads
 * create bottlenecks and shortages. Pure; adding a chain is data, not code.
 */

import type { KingdomState, Province, StrategicResource } from "./kingdom";

/** Intermediate production goods (distinct from the 10 strategic resources). */
export type Good =
  | "grain"
  | "flour"
  | "bread"
  | "logs"
  | "planks"
  | "ironOre"
  | "ironBars"
  | "weapons";

export const GOOD_LABELS: Record<Good, string> = {
  grain: "Зерно",
  flour: "Мука",
  bread: "Хлеб",
  logs: "Брёвна",
  planks: "Доски",
  ironOre: "Руда",
  ironBars: "Слитки",
  weapons: "Оружие",
};

interface Recipe {
  /** Goods consumed from the province's `goods` pool. */
  in: Partial<Record<Good, number>>;
  /** Natural resource richness drawn down (timber/iron/stone) as raw input. */
  raw: Partial<Record<StrategicResource, number>>;
  out: Partial<Record<Good, number>>;
  /** Adult workers the building needs to run at full output. */
  workers: number;
  /** True if output scales with province fertility (farms). */
  landBased?: boolean;
  label: string;
}

/**
 * Recipes keyed by building id, ordered upstream→downstream so a chain can flow
 * within a single day. Raw extractors (farm/ironMine/sawmill) have no `in`.
 */
export const RECIPES: Record<string, Recipe> = {
  farm: { in: {}, raw: {}, out: { grain: 46 }, workers: 24, landBased: true, label: "Ферма" },
  mill: { in: { grain: 34 }, raw: {}, out: { flour: 30 }, workers: 8, label: "Мельница" },
  bakery: { in: { flour: 28 }, raw: {}, out: { bread: 32 }, workers: 8, label: "Пекарня" },
  sawmill: { in: {}, raw: { timber: 22 }, out: { planks: 18 }, workers: 10, label: "Лесопилка" },
  ironMine: { in: {}, raw: { iron: 18 }, out: { ironOre: 20 }, workers: 16, label: "Шахта" },
  smelter: { in: { ironOre: 16 }, raw: { timber: 8 }, out: { ironBars: 13 }, workers: 10, label: "Плавильня" },
  smithy: { in: { ironBars: 11 }, raw: {}, out: { weapons: 9 }, workers: 10, label: "Кузница" },
};

/** Upstream→downstream processing order so same-day chains flow. */
const ORDER = ["farm", "sawmill", "ironMine", "mill", "smelter", "bakery", "smithy"];

/** Bread/weapons that leave the goods pool and top up strategic resources. */
const GOOD_TO_RESOURCE: Partial<Record<Good, StrategicResource>> = {
  bread: "food",
  weapons: "weapons",
  planks: "timber",
};

export interface EconomyStep {
  kingdom: KingdomState;
  /** Human-readable bottlenecks/shortages this day (for reports + UI). */
  shortages: string[];
  /** Per-province produced goods this day (for UI/tests). */
  produced: Record<string, Partial<Record<Good, number>>>;
}

function workerBudget(p: Province): number {
  // Adults not otherwise committed; militia/nobles/clergy don't do field labour.
  return Math.round(p.cohorts.peasants + p.cohorts.artisans * 0.6);
}

/** Run one strategic day of production + logistics. Pure. */
export function stepEconomy(k: KingdomState): EconomyStep {
  const shortages: string[] = [];
  const produced: Record<string, Partial<Record<Good, number>>> = {};
  const stockpile = { ...k.stockpile };

  const provinces = k.provinces.map((p) => {
    if (p.owner !== "player") return p;
    const goods: Partial<Record<Good, number>> = { ...(p.goods ?? {}) };
    const resources = { ...p.resources };
    let workers = workerBudget(p);
    const madeHere: Partial<Record<Good, number>> = {};

    for (const bid of ORDER) {
      if (!p.buildings.includes(bid)) continue;
      const r = RECIPES[bid];
      if (!r) continue;

      // Worker limit → efficiency 0..1.
      const workEff = workers > 0 ? Math.min(1, workers / r.workers) : 0;
      if (workEff <= 0) {
        shortages.push(`${p.name}: ${r.label} простаивает — нет рабочих`);
        continue;
      }
      // Input availability → limiting efficiency.
      let eff = workEff;
      for (const [g, need] of Object.entries(r.in) as [Good, number][]) {
        const have = goods[g] ?? 0;
        if (need > 0) eff = Math.min(eff, have / need);
      }
      for (const [res, need] of Object.entries(r.raw) as [StrategicResource, number][]) {
        const have = resources[res] ?? 0;
        if (need > 0) eff = Math.min(eff, have / need);
      }
      if (r.landBased) eff *= Math.max(0.2, p.fertility / 70);
      if (eff <= 0.01) {
        const missing = missingInput(r, goods, resources);
        shortages.push(`${p.name}: ${r.label} стоит — не хватает ${missing}`);
        continue;
      }

      // Consume + produce at the achieved efficiency.
      for (const [g, need] of Object.entries(r.in) as [Good, number][]) {
        goods[g] = Math.max(0, (goods[g] ?? 0) - need * eff);
      }
      for (const [res, need] of Object.entries(r.raw) as [StrategicResource, number][]) {
        resources[res] = Math.max(0, (resources[res] ?? 0) - need * eff);
      }
      for (const [g, amt] of Object.entries(r.out) as [Good, number][]) {
        const made = amt * eff;
        goods[g] = (goods[g] ?? 0) + made;
        madeHere[g] = (madeHere[g] ?? 0) + made;
      }
      workers = Math.max(0, workers - r.workers);
    }

    // Finished goods (bread/weapons/planks) settle into strategic resources.
    for (const [g, res] of Object.entries(GOOD_TO_RESOURCE) as [Good, StrategicResource][]) {
      const amt = goods[g] ?? 0;
      if (amt > 0) {
        resources[res] = (resources[res] ?? 0) + amt;
        goods[g] = 0;
      }
    }

    produced[p.id] = round(madeHere);
    return { ...p, goods: round(goods), resources };
  });

  // Logistics: haul surplus strategic resources to the realm stockpile, capped
  // by road capacity (province infrastructure). Overflow = a congestion note.
  const HAUL: StrategicResource[] = ["food", "weapons", "iron", "timber", "stone", "horses"];
  for (const p of provinces) {
    if (p.owner !== "player") continue;
    const capacity = 40 + p.infrastructure * 2; // units/day this province can move
    let moved = 0;
    let backlog = 0;
    for (const res of HAUL) {
      const keep = res === "food" ? 200 : 60; // provinces retain a local reserve
      const surplus = Math.max(0, (p.resources[res] ?? 0) - keep);
      if (surplus <= 0) continue;
      const room = Math.max(0, capacity - moved);
      const ship = Math.min(surplus, room);
      if (ship > 0) {
        p.resources[res] = (p.resources[res] ?? 0) - ship;
        stockpile[res] += ship;
        moved += ship;
      }
      backlog += surplus - ship;
    }
    if (backlog > 30) {
      shortages.push(`${p.name}: дороги перегружены — ${Math.round(backlog)} товаров не вывезено`);
    }
  }

  return { kingdom: { ...k, provinces, stockpile }, shortages: dedupe(shortages), produced };
}

function missingInput(
  r: Recipe,
  goods: Partial<Record<Good, number>>,
  resources: Partial<Record<StrategicResource, number>>,
): string {
  for (const [g, need] of Object.entries(r.in) as [Good, number][]) {
    if ((goods[g] ?? 0) < need) return GOOD_LABELS[g].toLowerCase();
  }
  for (const [res, need] of Object.entries(r.raw) as [StrategicResource, number][]) {
    if ((resources[res] ?? 0) < need) return res;
  }
  return "сырья";
}

function round(o: Partial<Record<Good, number>>): Partial<Record<Good, number>> {
  const out: Partial<Record<Good, number>> = {};
  for (const [k, v] of Object.entries(o) as [Good, number][]) out[k] = Math.round(v);
  return out;
}

function dedupe(a: string[]): string[] {
  return [...new Set(a)];
}
