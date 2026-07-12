import { describe, it, expect } from "vitest";
import {
  createInitialState,
  beginPlay,
  submitCommand,
  confirmOrder,
  cancelOrder,
  tickGame,
  decidePrisoner,
  concludeAftermath,
} from "../engine";
import { buildOrder } from "../orders";
import { pathfind, stepGroupMovement, beginMovement } from "../world";
import { groupPower, resolveBattleRound, makeBattle } from "../battle";
import { createMemoryEvent, applyMemoryToOfficer } from "../memory";
import { saveGame, loadGame, type StorageLike } from "../persistence";
import { localInterpreter } from "../commandInterpreter";
import type { GameState } from "../types";

function fakeStorage(): StorageLike {
  const map = new Map<string, string>();
  return {
    getItem: (k) => map.get(k) ?? null,
    setItem: (k, v) => void map.set(k, v),
    removeItem: (k) => void map.delete(k),
  };
}

function ctx(s: GameState) {
  return { officers: s.officers, locations: s.locations, units: s.units, activeOfficerId: s.selectedOfficerId, selectedLocationId: null, pending: null };
}

describe("orders", () => {
  it("builds a dangerous order awaiting confirmation with an ETA", () => {
    const s = beginPlay(createInitialState());
    const parsed = localInterpreter.parse("Эдвард, удерживай мост", ctx({ ...s, selectedOfficerId: "edward" }));
    const { order } = buildOrder(parsed, s);
    expect(order.status).toBe("awaiting_confirmation");
    expect(order.expectedCompletion).not.toBeNull();
    expect(order.expectedCompletion! > s.tick).toBe(true);
  });

  it("transitions an order through confirmation into execution", () => {
    let s = beginPlay(createInitialState());
    s = { ...s, selectedOfficerId: "edward" };
    s = submitCommand(s, "Эдвард, удерживай мост до рассвета");
    const awaiting = s.orders.find((o) => o.status === "awaiting_confirmation");
    expect(awaiting).toBeTruthy();
    s = confirmOrder(s, awaiting!.id);
    const order = s.orders.find((o) => o.id === awaiting!.id)!;
    expect(["moving", "executing"]).toContain(order.status);
    expect(order.unitGroupIds.length).toBeGreaterThan(0);
  });

  it("cancels an active order and frees the troops", () => {
    let s = beginPlay(createInitialState());
    s = { ...s, selectedOfficerId: "mara" };
    s = submitCommand(s, "Мара, разведай северный лес"); // SCOUT auto-starts (safe)
    const order = s.orders.find((o) => o.action === "SCOUT");
    expect(order).toBeTruthy();
    s = cancelOrder(s, order!.id);
    expect(s.orders.find((o) => o.id === order!.id)!.status).toBe("cancelled");
  });
});

describe("world movement", () => {
  it("finds a road path between distant locations", () => {
    const s = createInitialState();
    const path = pathfind("castle", "enemy_camp", s.locations);
    expect(path).not.toBeNull();
    expect(path!.path[0]).toBe("castle");
    expect(path!.path[path!.path.length - 1]).toBe("enemy_camp");
    expect(path!.distance).toBeGreaterThan(0);
  });

  it("advances a moving group along its path until arrival", () => {
    const s = createInitialState();
    let group = s.units.find((u) => u.commanderId === "edward")!;
    const route = pathfind(group.locationId, "bridge", s.locations)!;
    group = beginMovement(group, route.path);
    expect(group.state).toBe("moving");
    // Step a generous amount of time to guarantee arrival.
    const step = stepGroupMovement(group, 500, s.locations, s.balance);
    expect(step.arrived).toBe(true);
    expect(step.group.locationId).toBe("bridge");
  });
});

describe("battle", () => {
  it("gives the defender a terrain advantage in raw power", () => {
    const s = createInitialState();
    const bridge = s.locations.find((l) => l.id === "bridge")!;
    const spears = s.units.find((u) => u.type === "spearmen" && u.side === "player")!;
    const atk = groupPower(spears, bridge, "attack", s.balance);
    const def = groupPower(spears, bridge, "defense", s.balance);
    expect(def).toBeGreaterThan(atk);
  });

  it("inflicts casualties in a battle round", () => {
    const s = createInitialState();
    const player = s.units.find((u) => u.type === "spearmen" && u.side === "player")!;
    const enemy = s.units.find((u) => u.side === "enemy")!;
    const battle = makeBattle("b1", "bridge", "player", [player.id], [enemy.id], 0);
    const out = resolveBattleRound(battle, s);
    const totalCasualties = out.playerCasualties + out.enemyCasualties;
    expect(totalCasualties).toBeGreaterThan(0);
    expect(out.units.length).toBeGreaterThan(0);
  });
});

describe("memory", () => {
  it("creates a memory event and shifts officer traits", () => {
    const s = createInitialState();
    const edward = s.officers.find((o) => o.id === "edward")!;
    const before = edward.traits.resentment;
    const { event } = createMemoryEvent("PLAYER_IGNORED_MY_WARNING", 10, s.idCounter);
    const after = applyMemoryToOfficer(edward, event);
    expect(after.memory.length).toBe(edward.memory.length + 1);
    expect(after.traits.resentment).toBeGreaterThan(before);
    // Original is not mutated.
    expect(edward.traits.resentment).toBe(before);
  });
});

describe("persistence", () => {
  it("round-trips a game state through storage", () => {
    const storage = fakeStorage();
    const s = beginPlay(createInitialState());
    saveGame(s, storage);
    const loaded = loadGame(storage);
    expect(loaded).not.toBeNull();
    expect(loaded!.scenarioId).toBe(s.scenarioId);
    expect(loaded!.officers.length).toBe(s.officers.length);
    expect(loaded!.version).toBe(s.version);
  });

  it("returns null on corrupt save data without throwing", () => {
    const storage = fakeStorage();
    storage.setItem("ai-kingdom:save", "{not valid json");
    expect(loadGame(storage)).toBeNull();
  });
});

describe("full playthrough", () => {
  it("runs from briefing to an ending and resolves the prisoner", () => {
    let s = beginPlay(createInitialState());
    s = { ...s, selectedOfficerId: "edward" };
    s = submitCommand(s, "Эдвард, удерживай мост до рассвета");
    const c = s.orders.find((o) => o.status === "awaiting_confirmation");
    if (c) s = confirmOrder(s, c.id);
    s = { ...s, speed: 4 };

    let steps = 0;
    while (s.phase === "playing" && steps < 500) {
      s = tickGame(s, 5);
      // Auto-resolve any officer initiative and keep time running past pauses.
      const init = s.officers.find((o) => o.pendingInitiativeOrderId);
      if (init) {
        s = { ...s };
      }
      if (s.speed === 0) s = { ...s, speed: 4 };
      steps++;
    }
    // Terminal outcomes now pass through the aftermath scene first.
    expect(["aftermath", "prisoner", "ended"]).toContain(s.phase);
    if (s.phase === "aftermath") {
      expect(s.aftermath).not.toBeNull();
      s = concludeAftermath(s, "heroic");
    }
    expect(["prisoner", "ended"]).toContain(s.phase);
    if (s.phase === "prisoner") {
      s = decidePrisoner(s, "imprison");
      expect(s.phase).toBe("ended");
      expect(s.prisoner!.decided).toBe(true);
    }
    expect(s.outcome.kind).not.toBe("in_progress");
  });
});
