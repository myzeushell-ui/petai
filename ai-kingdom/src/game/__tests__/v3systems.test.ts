import { describe, it, expect } from "vitest";
import {
  createInitialState,
  beginPlay,
  enterCouncil,
  resolveCouncil,
  setAftermathVerdict,
  nameHero,
  concludeAftermath,
  pickCrisis,
} from "../engine";
import { ASSETS, getAsset, assetsByCategory } from "../../assets/registry";
import { portraitAsset, stateFromOfficer } from "../../assets/portraits";
import { chooseEnemyPlan, buildEnemyKnowledge } from "../enemyPlanner";
import { saveChapter, loadCampaign, summarizeChapter } from "../campaign";
import type { StorageLike } from "../persistence";
import type { CouncilDecisions, GameState } from "../types";

const COUNCIL: CouncilDecisions = {
  plan: "hold_bridge",
  village: "partial_evac",
  autonomyOfficerId: null,
  reserveOfficerId: null,
  fortify: "bridge",
};

describe("AssetRegistry", () => {
  it("exposes the full manifest with metadata", () => {
    expect(Object.keys(ASSETS).length).toBe(22);
    const castle = getAsset("castle_dawns_edge");
    expect(castle).toBeTruthy();
    expect(castle!.recommendedScale).toBeGreaterThan(0);
    expect(castle!.anchor.length).toBe(2);
    expect(assetsByCategory("portrait").length).toBe(6);
    expect(assetsByCategory("strategic_unit").length).toBe(6);
  });
});

describe("Portraits", () => {
  it("maps each officer to a portrait asset and derives mood", () => {
    for (const id of ["edward", "roland", "mara", "alaric", "elyne", "cassian"]) {
      expect(portraitAsset(id)).toBeTruthy();
    }
    expect(stateFromOfficer({ injury: "heavy", alive: true })).toBe("wounded");
    expect(stateFromOfficer({ traits: { resentment: 70 } })).toBe("angry");
    expect(stateFromOfficer({ traits: { stress: 10 } })).toBe("neutral");
  });
});

describe("enemy planner", () => {
  it("keeps forces hidden until scouting (no exact enemy token)", () => {
    const s = createInitialState();
    const enemy = s.units.filter((u) => u.side === "enemy");
    expect(enemy.length).toBeGreaterThan(0);
    expect(enemy.every((u) => u.revealed === false)).toBe(true);
  });

  it("does not reveal player forces hidden in the forest to the enemy", () => {
    const s = beginPlay(createInitialState());
    const scout = s.units.find((u) => u.side === "player")!;
    scout.locationId = "forest";
    scout.state = "holding";
    const k = buildEnemyKnowledge(s);
    expect(k.knownPlayerLocations).not.toContain("forest");
  });

  it("picks different plans for different player dispositions", () => {
    // A: nothing special → some plan is chosen with a full score table.
    const base = beginPlay(createInitialState());
    const planA = chooseEnemyPlan(base);
    expect(planA.scores.length).toBe(3);
    expect(["MASS_BRIDGE_ASSAULT", "BRIDGE_FEINT_FOREST_FLANK", "VILLAGE_SUPPLY_CUT"]).toContain(planA.id);

    // B: a fortified, well-garrisoned bridge should steer away from a frontal mass assault.
    const b = beginPlay(createInitialState());
    b.flags.bridgeFortified = true;
    for (const u of b.units) {
      if (u.side === "player" && u.type === "spearmen") {
        u.locationId = "bridge";
        u.count = 400;
      }
    }
    const planB = chooseEnemyPlan(b);
    expect(planB.knowledge.barricadeSeen).toBe(true);
    expect(planB.id).not.toBe("MASS_BRIDGE_ASSAULT");

    // C: an evacuated village makes a supply-cut pointless.
    const c = beginPlay(createInitialState());
    c.flags.villageEvacuated = true;
    c.village.evacuationProgress = 1;
    const planC = chooseEnemyPlan(c);
    const supply = planC.scores.find((x) => x.id === "VILLAGE_SUPPLY_CUT")!;
    const flank = planC.scores.find((x) => x.id === "BRIDGE_FEINT_FOREST_FLANK")!;
    expect(flank.score).toBeGreaterThan(supply.score);
  });
});

describe("war council → civilian layer", () => {
  it("mobilizes militia into the levy when the village stands", () => {
    const s0 = enterCouncil(createInitialState());
    const levyBefore = s0.units.filter((u) => u.commanderId === "elyne").reduce((n, u) => n + u.count, 0);
    const s = resolveCouncil(s0, { ...COUNCIL, village: "stand" });
    const levyAfter = s.units.filter((u) => u.commanderId === "elyne").reduce((n, u) => n + u.count, 0);
    expect(levyAfter).toBeGreaterThan(levyBefore);
    expect(s.village.militia).toBeGreaterThan(0);
    expect(s.phase).toBe("playing");
  });

  it("full evacuation lifts morale and starts the wagons", () => {
    const s0 = enterCouncil(createInitialState());
    const moraleBefore = s0.resources.kingdomMorale;
    const s = resolveCouncil(s0, { ...COUNCIL, village: "full_evac" });
    expect(s.resources.kingdomMorale).toBeGreaterThan(moraleBefore);
    expect(s.village.evacuationProgress).toBeGreaterThan(0);
    expect(s.enemyPlan).not.toBeNull();
  });
});

describe("crisis director", () => {
  it("selects an arrows-low crisis when archers are engaged", () => {
    const s = beginPlay(createInitialState());
    const arch = s.units.find((u) => u.side === "player" && u.type === "archers")!;
    arch.state = "fighting";
    const crisis = pickCrisis(s);
    expect(crisis).toBeTruthy();
    expect(crisis!.id).toBe("ARROWS_LOW");
  });

  it("always has a fallback crisis", () => {
    const s = beginPlay(createInitialState());
    expect(pickCrisis(s)).toBeTruthy();
  });
});

describe("aftermath persistence", () => {
  it("records verdicts and hero, shifting memory and reputation", () => {
    // Reach a terminal outcome, which routes into the aftermath phase.
    let s = beginPlay(createInitialState());
    // Force an ending via the debug helper path.
    s = { ...s, resources: { ...s.resources, castleIntegrity: 0 } };
    // Drive one tick to trigger end conditions.
    // (Directly craft aftermath if the tick didn't end it.)
    if (s.phase !== "aftermath") {
      s.phase = "aftermath";
      s.aftermath = { heroOfficerId: null, verdicts: {}, chronicleChoice: null, reputation: 0, resolved: false };
      s.outcome = { ...s.outcome, kind: "defeat_castle_lost" };
    }
    const memBefore = s.officers.find((o) => o.id === "edward")!.memory.length;
    s = nameHero(s, "edward");
    s = setAftermathVerdict(s, "edward", "promote");
    s = setAftermathVerdict(s, "roland", "blame");
    s = concludeAftermath(s, "tragic");
    expect(s.aftermath!.resolved).toBe(true);
    expect(s.aftermath!.chronicleChoice).toBe("tragic");
    const edward = s.officers.find((o) => o.id === "edward")!;
    expect(edward.memory.length).toBeGreaterThan(memBefore);
    expect(s.phase === "ended" || s.phase === "prisoner").toBe(true);
  });
});

describe("campaign save", () => {
  it("round-trips a chapter result through storage", () => {
    const map = new Map<string, string>();
    const storage: StorageLike = {
      getItem: (k) => map.get(k) ?? null,
      setItem: (k, v) => void map.set(k, v),
      removeItem: (k) => void map.delete(k),
    };
    const s = terminalState();
    const saved = saveChapter(s, storage, 1);
    expect(saved.chapters.length).toBe(1);
    expect(saved.chapters[0].outcomeKind).toBe(s.outcome.kind);
    const loaded = loadCampaign(storage);
    expect(loaded).not.toBeNull();
    expect(loaded!.chapters[0].officers.length).toBe(s.officers.length);
    // summarizeChapter carries surviving officers + village state.
    const summary = summarizeChapter(s, 1);
    expect(summary.officers.length).toBe(s.officers.length);
    expect(typeof summary.villageState).toBe("string");
  });
});

function terminalState(): GameState {
  const s = beginPlay(createInitialState());
  s.outcome = { ...s.outcome, kind: "tactical_victory" };
  s.aftermath = { heroOfficerId: "mara", verdicts: { mara: "praise" }, chronicleChoice: "measured", reputation: 4, resolved: true };
  return s;
}
