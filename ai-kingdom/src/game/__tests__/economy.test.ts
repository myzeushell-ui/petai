import { describe, it, expect } from "vitest";
import { createInitialKingdom, advanceKingdomDay } from "../kingdom";
import { stepEconomy } from "../economy";

describe("production chains", () => {
  it("bakes bread in the grain valley (grain → flour → bread same day)", () => {
    const k = createInitialKingdom();
    const step = stepEconomy(k);
    const made = step.produced["prov_quietvale"];
    expect(made.grain ?? 0).toBeGreaterThan(0);
    expect(made.bread ?? 0).toBeGreaterThan(0);
  });

  it("forges weapons in the iron hills (ore → bars → weapons)", () => {
    const k = createInitialKingdom();
    const step = stepEconomy(k);
    const made = step.produced["prov_ironridge"];
    expect(made.ironOre ?? 0).toBeGreaterThan(0);
    expect(made.weapons ?? 0).toBeGreaterThan(0);
  });

  it("stalls a chain and reports the shortage when raw input runs out", () => {
    const k = createInitialKingdom();
    const iron = k.provinces.find((p) => p.id === "prov_ironridge")!;
    iron.resources.iron = 0; // mine has nothing to dig
    const step = stepEconomy(k);
    expect(step.produced["prov_ironridge"].ironOre ?? 0).toBe(0);
    expect(step.shortages.some((s) => s.includes("Железный кряж"))).toBe(true);
  });
});

describe("logistics", () => {
  it("hauls surplus into the realm stockpile", () => {
    const k = createInitialKingdom();
    const before = k.stockpile.food;
    const step = stepEconomy(k);
    expect(step.kingdom.stockpile.food).toBeGreaterThan(before);
  });

  it("reports congestion when a thin road cannot move the surplus", () => {
    const k = createInitialKingdom();
    const vale = k.provinces.find((p) => p.id === "prov_quietvale")!;
    vale.infrastructure = 0; // capacity floor
    vale.resources.food = 5000; // huge surplus, nowhere near enough road
    const step = stepEconomy(k);
    expect(step.shortages.some((s) => s.includes("перегружены"))).toBe(true);
  });
});

describe("strategic day runs the economy", () => {
  it("accumulates realm food across several days", () => {
    let k = createInitialKingdom();
    const start = k.stockpile.food;
    for (let d = 0; d < 5; d++) k = advanceKingdomDay(k);
    expect(k.stockpile.food).toBeGreaterThan(start);
    expect(k.day).toBe(6);
  });
});
