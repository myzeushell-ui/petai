import { describe, it, expect } from "vitest";
import { localInterpreter } from "../commandInterpreter";
import { createInitialState } from "../engine";
import type { GameState, InterpreterContext, PendingClarification } from "../types";

function ctx(state: GameState, over: Partial<InterpreterContext> = {}): InterpreterContext {
  return {
    officers: state.officers,
    locations: state.locations,
    units: state.units,
    activeOfficerId: null,
    selectedLocationId: null,
    pending: null,
    ...over,
  };
}

describe("command interpreter", () => {
  const base = createInitialState();

  it("parses a basic hold order with officer, target and condition", () => {
    const p = localInterpreter.parse("Эдвард, удерживай мост до рассвета", ctx(base));
    expect(p.action).toBe("HOLD");
    expect(p.officerId).toBe("edward");
    expect(p.targetLocationId).toBe("bridge");
    expect(p.conditions).toContain("until_dawn");
  });

  it("recognises the officer by name (Roland → attack)", () => {
    const p = localInterpreter.parse("Роланд, атакуй врага", ctx(base));
    expect(p.officerId).toBe("roland");
    expect(p.action).toBe("ATTACK");
  });

  it("parses a numeric troop count and unit type", () => {
    const p = localInterpreter.parse("Эдвард, возьми 200 копейщиков и иди к мосту", ctx(base, { activeOfficerId: "edward" }));
    expect(p.unitCount).toBe(200);
    expect(p.unitType).toBe("spearmen");
  });

  it("parses Russian number words (двести → 200)", () => {
    const p = localInterpreter.parse("Веди двести копейщиков к мосту", ctx(base, { activeOfficerId: "edward" }));
    expect(p.unitCount).toBe(200);
  });

  it("resolves a location by synonym and by spatial context (сюда)", () => {
    const p1 = localInterpreter.parse("Мара, разведай северный лес", ctx(base));
    expect(p1.targetLocationId).toBe("forest");
    const p2 = localInterpreter.parse("Эдвард, займи оборону здесь", ctx(base, { activeOfficerId: "edward", selectedLocationId: "hills" }));
    expect(p2.targetLocationId).toBe("hills");
  });

  it("asks for a troop count when a MOVE order omits it", () => {
    const p = localInterpreter.parse("Эдвард, отправляйся к мосту", ctx(base, { activeOfficerId: "edward" }));
    expect(p.action).toBe("MOVE");
    expect(p.missing).toContain("unitCount");
  });

  it("merges a clarification reply into a pending order", () => {
    const pending: PendingClarification = {
      partial: localInterpreter.parse("Эдвард, отправляйся к мосту", ctx(base, { activeOfficerId: "edward" })),
      officerId: "edward",
      awaiting: "unitCount",
      askedAtTick: 0,
    };
    const merged = localInterpreter.parse("двести", ctx(base, { activeOfficerId: "edward", pending }));
    expect(merged.unitCount).toBe(200);
    expect(merged.missing).not.toContain("unitCount");
  });

  it("classifies information questions as non-confirmable", () => {
    const p = localInterpreter.parse("Мара, каковы наши запасы?", ctx(base, { activeOfficerId: "mara" }));
    expect(p.action).toBe("ASK_STATUS");
    expect(p.isQuestion).toBe(true);
  });
});
