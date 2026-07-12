import { describe, it, expect } from "vitest";
import {
  createInitialKingdom,
  kingdomTotals,
  provinceManpowerPool,
  seasonFertility,
  advanceKingdomDay,
  STRATEGIC_RESOURCES,
} from "../kingdom";
import { createInitialState } from "../engine";
import { saveGame, loadGame, SAVE_VERSION, type StorageLike } from "../persistence";
import type { GameState } from "../types";

function fakeStorage(): StorageLike {
  const map = new Map<string, string>();
  return {
    getItem: (k) => map.get(k) ?? null,
    setItem: (k, v) => void map.set(k, v),
    removeItem: (k) => void map.delete(k),
  };
}

describe("kingdom foundation", () => {
  it("builds three player provinces with a full strategic stockpile", () => {
    const k = createInitialKingdom();
    expect(k.provinces.length).toBe(3);
    expect(k.provinces.every((p) => p.owner === "player")).toBe(true);
    for (const r of STRATEGIC_RESOURCES) {
      expect(typeof k.stockpile[r]).toBe("number");
    }
    // each province carries an aggregated population and indicators
    for (const p of k.provinces) {
      expect(p.population).toBeGreaterThan(0);
      expect(p.cohorts.adults).toBeGreaterThan(0);
      expect(p.indicators.happiness).toBeGreaterThanOrEqual(0);
      expect(p.indicators.happiness).toBeLessThanOrEqual(100);
    }
  });

  it("aggregates realm totals from the provinces", () => {
    const k = createInitialKingdom();
    const t = kingdomTotals(k);
    expect(t.population).toBe(k.provinces.reduce((s, p) => s + p.population, 0));
    expect(t.manpowerPool).toBeGreaterThan(0);
    expect(t.playerProvinces).toBe(3);
  });

  it("scales the levy with conscription policy", () => {
    const k = createInitialKingdom();
    const p = { ...k.provinces[0] };
    const light = provinceManpowerPool({ ...p, conscription: "light" });
    const total = provinceManpowerPool({ ...p, conscription: "total" });
    expect(total).toBeGreaterThan(light);
  });

  it("applies seasonal fertility (winter starves, grain valley thrives)", () => {
    expect(seasonFertility("winter", "grain_valley")).toBeLessThan(seasonFertility("summer", "grain_valley"));
    expect(seasonFertility("summer", "grain_valley")).toBeGreaterThan(seasonFertility("summer", "iron_hills"));
  });

  it("advances a strategic day, rolling seasons and drifting population", () => {
    let k = createInitialKingdom();
    const startDay = k.day;
    k = advanceKingdomDay(k);
    expect(k.day).toBe(startDay + 1);

    // 30-day season roll
    let k2 = createInitialKingdom();
    k2 = { ...k2, day: 30 };
    k2 = advanceKingdomDay(k2);
    expect(k2.day).toBe(1);
    expect(k2.season).not.toBe("autumn"); // rolled to winter

    // a happy, healthy province grows; a miserable one shrinks
    const base = createInitialKingdom();
    const happy = { ...base };
    happy.provinces = base.provinces.map((p) => ({
      ...p,
      indicators: { ...p.indicators, happiness: 90, health: 90, foodSecurity: 90, warWeariness: 0 },
    }));
    const grown = advanceKingdomDay(happy);
    expect(grown.provinces[0].population).toBeGreaterThanOrEqual(happy.provinces[0].population);

    const grim = { ...base };
    grim.provinces = base.provinces.map((p) => ({
      ...p,
      indicators: { ...p.indicators, happiness: 10, health: 20, foodSecurity: 10, warWeariness: 80 },
    }));
    const shrunk = advanceKingdomDay(grim);
    expect(shrunk.provinces[0].population).toBeLessThan(grim.provinces[0].population);
  });
});

describe("save migration (v3 → v4)", () => {
  it("initial state is version 4 and carries a kingdom", () => {
    const s = createInitialState();
    expect(s.version).toBe(SAVE_VERSION);
    expect(s.kingdom.provinces.length).toBe(3);
  });

  it("round-trips a v4 save with the kingdom intact", () => {
    const storage = fakeStorage();
    const s = createInitialState();
    saveGame(s, storage);
    const loaded = loadGame(storage);
    expect(loaded).not.toBeNull();
    expect(loaded!.kingdom.provinces.length).toBe(3);
    expect(loaded!.version).toBe(SAVE_VERSION);
  });

  it("migrates a v3 save (no kingdom) instead of discarding it", () => {
    const storage = fakeStorage();
    const s = createInitialState();
    // Simulate an older v3 save: strip the kingdom, stamp version 3.
    const legacy = { ...(s as unknown as Record<string, unknown>) };
    delete legacy.kingdom;
    legacy.version = 3;
    storage.setItem("ai-kingdom:save", JSON.stringify(legacy));
    const loaded = loadGame(storage) as GameState | null;
    expect(loaded).not.toBeNull();
    expect(loaded!.version).toBe(SAVE_VERSION);
    expect(loaded!.kingdom.provinces.length).toBe(3);
  });

  it("discards saves older than the V3 systems layer", () => {
    const storage = fakeStorage();
    const s = createInitialState();
    const ancient = { ...(s as unknown as Record<string, unknown>), version: 2 };
    storage.setItem("ai-kingdom:save", JSON.stringify(ancient));
    expect(loadGame(storage)).toBeNull();
  });
});
