/**
 * Game engine — the orchestrator.
 *
 * Owns the initial-state builder, the real-time tick (movement → enemy AI →
 * supply → battles → scripted events → win/lose checks) and the player-action
 * pipeline (interpret → officer decision → dialogue → formal order → execution).
 * All functions are pure: they take a GameState and return a new one. The React
 * layer never mutates state directly.
 */

import type {
  GameState,
  Officer,
  Order,
  UnitGroup,
  Battle,
  MemoryEventType,
  PrisonerDecision,
  GameOutcome,
  OutcomeKind,
  SpeechStyle,
  Side,
  CouncilDecisions,
  OfficerVerdict,
} from "./types";
import { getScenario } from "./scenario";
import { seedState } from "./rng";
import { clamp, clampStat, formatMinutes, pluralSoldiers } from "./util";
import { localInterpreter } from "./commandInterpreter";
import { localDialogue } from "./dialogue";
import { createMemoryEvent, applyMemoryToOfficer } from "./memory";
import { decideAcceptance, evaluateInitiative, hasReadyStrikeForce } from "./officers";
import {
  buildOrder,
  resolveOrderForce,
  splitGroup,
  isActive,
} from "./orders";
import {
  pathfind,
  beginMovement,
  clearMovement,
  stepGroupMovement,
  applySupply,
  deliverFood,
} from "./world";
import { resolveBattleRound, makeBattle } from "./battle";
import { collectScriptedEvents, scoutingReport } from "./events";
import { resolvePrisoner, computePrisonerRespect } from "./prisoner";
import { councilEffects, PLAN_OPTIONS } from "./council";
import { chooseEnemyPlan } from "./enemyPlanner";
import { UNIT_LABELS_GENITIVE } from "./constants";

/* ------------------------------------------------------------------ */
/* Tuning constants                                                    */
/* ------------------------------------------------------------------ */

const STEP_CAP = 3; // max game minutes per internal sub-step
const ROUND_INTERVAL = 6; // game minutes between battle rounds
const ENEMY_START_DELAY = 20; // game minutes before the enemy breaks camp
const RAID_TICK = 34; // enemy splits off a village raid while cavalry is still en route
const RAID_SIZE = 60; // cavalry in the raid detachment
const FLANK_SIZE = 70; // cavalry that slip through the forest in a feint-and-flank
const DIALOGUE_CAP = 140;
const LOG_CAP = 160;
const EVENT_CAP = 60;
const BATTLE_LOG_CAP = 24;

/* ------------------------------------------------------------------ */
/* Low-level draft helpers                                             */
/* ------------------------------------------------------------------ */

function clone(state: GameState): GameState {
  return structuredClone(state);
}

function allocId(s: GameState, prefix: string): string {
  const id = `${prefix}_${s.idCounter}`;
  s.idCounter += 1;
  return id;
}

function officerById(s: GameState, id: string | null): Officer | undefined {
  return s.officers.find((o) => o.id === id) ?? undefined;
}
function locById(s: GameState, id: string | null) {
  return s.locations.find((l) => l.id === id);
}

function pushDialogue(
  s: GameState,
  speaker: string,
  officerId: string | null,
  text: string,
  kind: import("./types").DialogueKind,
): void {
  s.dialogue.push({ id: allocId(s, "msg"), tick: s.tick, speaker, officerId, text, kind });
  if (s.dialogue.length > DIALOGUE_CAP) s.dialogue = s.dialogue.slice(-DIALOGUE_CAP);
}

function pushLog(
  s: GameState,
  text: string,
  kind: import("./types").LogEntry["kind"],
  severity: import("./types").LogEntry["severity"],
): void {
  s.log.push({ id: allocId(s, "log"), tick: s.tick, kind, text, severity });
  if (s.log.length > LOG_CAP) s.log = s.log.slice(-LOG_CAP);
}

function pushEvent(
  s: GameState,
  input: {
    kind: import("./types").WorldEventKind;
    severity: import("./types").WorldEvent["severity"];
    title: string;
    message: string;
    officerId?: string | null;
    locationId?: string | null;
    requiresPause?: boolean;
  },
): void {
  s.events.push({
    id: allocId(s, "evt"),
    tick: s.tick,
    kind: input.kind,
    severity: input.severity,
    title: input.title,
    message: input.message,
    officerId: input.officerId ?? null,
    locationId: input.locationId ?? null,
    requiresPause: input.requiresPause ?? false,
    handled: false,
  });
  if (s.events.length > EVENT_CAP) s.events = s.events.slice(-EVENT_CAP);
  if (input.requiresPause) s.speed = 0;
}

function addMemory(
  s: GameState,
  officerId: string,
  type: MemoryEventType,
  opts: { relatedOrderId?: string | null; weightScale?: number; description?: string } = {},
): void {
  const idx = s.officers.findIndex((o) => o.id === officerId);
  if (idx < 0) return;
  const { event, nextCounter } = createMemoryEvent(type, s.tick, s.idCounter, opts);
  s.idCounter = nextCounter;
  s.officers[idx] = applyMemoryToOfficer(s.officers[idx], event);
}

/* ------------------------------------------------------------------ */
/* Initial state                                                       */
/* ------------------------------------------------------------------ */

export function createInitialState(scenarioId = "night-before-siege"): GameState {
  const scenario = getScenario(scenarioId);
  let counter = 0;
  const nextId = (prefix: string) => `${prefix}_${counter++}`;

  const units: UnitGroup[] = [];
  const officers: Officer[] = scenario.officers.map((cfg) => {
    const commanded: string[] = [];
    for (const u of cfg.units) {
      const id = nextId("unit");
      commanded.push(id);
      units.push({
        id,
        side: "player",
        type: u.type,
        count: u.count,
        morale: u.morale,
        fatigue: 8,
        supply: 100,
        locationId: cfg.startLocationId,
        commanderId: cfg.id,
        orderId: null,
        state: "idle",
        revealed: true,
      });
    }
    return {
      id: cfg.id,
      name: cfg.name,
      title: cfg.title,
      role: cfg.role,
      crestSeed: cfg.crestSeed,
      accentColor: cfg.accentColor,
      bio: cfg.bio,
      character: cfg.character,
      competencies: cfg.competencies,
      traits: { ...cfg.traits },
      speechStyle: cfg.speechStyle,
      currentTask: "Ожидает приказа",
      commandedUnitIds: commanded,
      locationId: cfg.startLocationId,
      injury: "none",
      permanentInjury: "none",
      alive: true,
      memory: [],
    };
  });

  // Enemy forces (hidden) at their camp.
  const comp = scenario.enemy.composition;
  (["spearmen", "archers", "cavalry"] as const).forEach((type) => {
    const count = comp[type];
    if (count > 0) {
      units.push({
        id: nextId("unit"),
        side: "enemy",
        type,
        count,
        morale: 74,
        fatigue: 20,
        supply: 80,
        locationId: "enemy_camp",
        commanderId: null,
        orderId: null,
        state: "idle",
        revealed: false,
      });
    }
  });

  const initialPlayerTotal = units
    .filter((u) => u.side === "player")
    .reduce((sum, u) => sum + u.count, 0);

  const state: GameState = {
    version: 3,
    scenarioId: scenario.id,
    kingdomName: scenario.kingdomName,
    seed: scenario.seed,
    rngState: seedState(scenario.seed),
    tick: 0,
    timeUntilDawn: scenario.durationMinutes,
    phase: "briefing",
    speed: 0,
    resources: { ...scenario.startResources },
    officers,
    units,
    locations: structuredClone(scenario.locations),
    orders: [],
    events: [],
    dialogue: [],
    battles: [],
    log: [],
    enemy: {
      commanderName: scenario.enemy.commanderName,
      scriptPhase: "approach",
      trueStrength: scenario.enemy.trueStrength,
      estimatedStrength: null,
      intelLevel: 0,
      approachRoute: scenario.enemy.approachRoute,
      raidDispatched: false,
      rerouted: false,
      routed: false,
    },
    prisoner: null,
    outcome: {
      kind: "in_progress",
      title: "",
      summary: "",
      highlights: [],
    },
    scenarioPhase: "war_council",
    council: null,
    village: {
      civilians: 140,
      workers: 40,
      militia: 0,
      food: scenario.locations.find((l) => l.id === "village")?.foodStore ?? 60,
      carts: 3,
      morale: 62,
      evacuationProgress: 0,
      damage: 0,
      plan: null,
      cartsRolling: 0,
    },
    enemyPlan: null,
    aftermath: null,
    balance: structuredClone(scenario.balance),
    selectedOfficerId: null,
    selectedLocationId: null,
    viewBattleId: null,
    pendingClarification: null,
    pendingRevision: null,
    settings: { voiceInput: false, voiceOutput: false, speechLang: "ru-RU" },
    tutorial: { active: true, step: 0, completed: false },
    flags: {
      initialPlayerTotal,
      playerCasualtiesTotal: 0,
      enemyAdvancing: false,
      villageEvacuated: false,
      mainForceBeaten: false,
    },
    idCounter: counter,
    lastUpdated: 0,
  };

  // Opening briefing line from Mara.
  pushDialogue(state, "narrator", null, scenario.intro, "briefing");
  pushLog(state, "Разведка предупредила о приближении врага. Ночь началась.", "narrative", "notable");
  return state;
}

/** Transition from the briefing screen into live play; the enemy sets out. */
export function beginPlay(state: GameState): GameState {
  const s = clone(state);
  s.phase = "playing";
  s.speed = 0; // start paused so the player can plan
  s.flags.enemyAdvancing = true; // committed; the column actually marches after a short delay
  pushDialogue(
    s,
    "mara",
    "mara",
    "Ваше величество, у нас мало времени. Отдайте приказы — я подготовлю донесения.",
    "advice",
  );
  s.selectedOfficerId = s.selectedOfficerId ?? "mara";
  syncCommanded(s);
  return s;
}

/* ------------------------------------------------------------------ */
/* War council                                                         */
/* ------------------------------------------------------------------ */

/** Briefing → war council: convene the five officers before the fighting. */
export function enterCouncil(state: GameState): GameState {
  const s = clone(state);
  s.phase = "war_council";
  s.scenarioPhase = "war_council";
  pushDialogue(
    s,
    "narrator",
    null,
    "Военный совет собрался у карты. Свечи горят низко — до рассвета одна ночь.",
    "briefing",
  );
  return s;
}

/** Apply the player's council decisions, then begin play. */
export function resolveCouncil(state: GameState, decisions: CouncilDecisions): GameState {
  const s = clone(state);
  s.council = decisions;
  const eff = councilEffects(decisions);

  for (const m of eff.memories) {
    addMemory(s, m.officerId, m.type, { weightScale: m.weightScale, description: m.description });
  }
  s.resources.kingdomMorale = clampStat(s.resources.kingdomMorale + eff.moraleDelta);
  Object.assign(s.flags, eff.flags);

  s.village.plan = eff.villagePlan;
  s.village.militia += eff.militiaDelta;
  if (eff.villagePlan === "full_evac") s.village.evacuationProgress = 0.15;
  // Mobilized militia reinforces Lady Elyne's levy so the choice is tangible.
  if (eff.militiaDelta > 0) {
    const levy = s.units.find((u) => u.commanderId === "elyne" && u.count > 0);
    if (levy) levy.count += eff.militiaDelta;
  }

  const plan = PLAN_OPTIONS.find((p) => p.id === decisions.plan);
  if (plan) {
    pushDialogue(s, "narrator", null, `Решение принято: ${plan.label.toLowerCase()}. ${plan.blurb}`, "briefing");
  }

  // The enemy commander forms his first plan from what he can see tonight.
  s.enemyPlan = chooseEnemyPlan(s);
  s.scenarioPhase = "preparation";
  return beginPlay(s);
}

function startEnemyAdvance(s: GameState): void {
  const enemyGroups = s.units.filter((u) => u.side === "enemy" && u.count > 0);
  for (let i = 0; i < s.units.length; i++) {
    const g = s.units[i];
    if (g.side !== "enemy" || g.count <= 0) continue;
    const route = pathfind(g.locationId, "castle", s.locations);
    if (route && route.path.length > 1) {
      s.units[i] = beginMovement(g, route.path);
    }
  }
  s.flags.enemyAdvancing = true;
  if (enemyGroups.length > 0) {
    pushLog(s, "Вражеская колонна выступила с восточной дороги.", "enemy_move", "notable");
  }
}

/* ------------------------------------------------------------------ */
/* Sync helpers                                                        */
/* ------------------------------------------------------------------ */

function syncCommanded(s: GameState): void {
  for (const o of s.officers) {
    o.commandedUnitIds = s.units
      .filter((u) => u.commanderId === o.id && u.count > 0)
      .map((u) => u.id);
    // Officer stands where his primary active group is.
    const active = s.units.find(
      (u) => u.commanderId === o.id && u.count > 0 && u.orderId,
    );
    const any = active ?? s.units.find((u) => u.commanderId === o.id && u.count > 0);
    if (any) o.locationId = any.locationId;
    // Refresh the "current task" label.
    const order = s.orders.find((ord) => ord.officerId === o.id && isActive(ord));
    o.currentTask = order ? describeTask(s, order) : o.alive ? "Ожидает приказа" : "—";
  }
}

function describeTask(s: GameState, order: Order): string {
  const loc = locById(s, order.targetLocationId);
  const map: Partial<Record<Order["action"], string>> = {
    MOVE: "Марш",
    DEFEND: "Оборона",
    HOLD: "Удержание",
    ATTACK: "Атака",
    SCOUT: "Разведка",
    SUPPLY: "Снабжение",
    RETREAT: "Отступление",
    AMBUSH: "Засада",
    PROTECT: "Защита",
    EVACUATE: "Эвакуация",
    REINFORCE: "Подкрепление",
    WAIT: "Ожидание",
  };
  const verb = map[order.action] ?? "Задание";
  return loc ? `${verb}: ${loc.name}` : verb;
}

/* ------------------------------------------------------------------ */
/* Player action pipeline                                              */
/* ------------------------------------------------------------------ */

export function submitCommand(state: GameState, text: string): GameState {
  const s = clone(state);
  const trimmed = text.trim();
  if (!trimmed) return s;

  const ctx = {
    officers: s.officers,
    locations: s.locations,
    units: s.units,
    activeOfficerId: s.selectedOfficerId,
    selectedLocationId: s.selectedLocationId,
    pending: s.pendingClarification,
  };
  const parsed = localInterpreter.parse(trimmed, ctx);
  const named = officerById(s, parsed.officerId);
  const isQuery = parsed.action === "ASK_STATUS" || parsed.action === "ASK_ADVICE";

  pushDialogue(
    s,
    "player",
    named?.id ?? s.selectedOfficerId,
    trimmed,
    parsed.isQuestion || isQuery ? "question" : "order",
  );
  s.pendingClarification = null;

  // Never dead-end: an unrecognised line gets a helpful reply from the advisor,
  // who reports what she knows and invites a clearer question or order.
  if (parsed.action === "UNKNOWN") {
    const advisor = named && named.alive ? named : adviser(s);
    const reply = `Не вполне понял, милорд. ${buildSituationBrief(s)} Спросите об обстановке, враге, времени или запасах — или отдайте приказ офицеру.`;
    pushDialogue(s, advisor.id, advisor.id, localDialogue.officerStatus({ officer: advisor, state: s, extra: { report: reply } }), "report");
    return finishAction(s);
  }

  // Questions are fielded by whoever was addressed, or by the advisor (Mara).
  const officer = isQuery ? named ?? adviser(s) : named;

  if (!officer) {
    pushDialogue(s, "narrator", null, "К кому обращён приказ, милорд? Назовите офицера.", "system");
    return s;
  }
  if (!officer.alive) {
    if (isQuery) {
      const a = adviser(s);
      pushDialogue(s, a.id, a.id, localDialogue.officerStatus({ officer: a, state: s, extra: { report: buildStatusReport(s, a, parsed.rawText) } }), "report");
      return finishAction(s);
    }
    pushDialogue(s, "narrator", null, `${officer.name} пал. Отдавать ему приказы больше некому, милорд.`, "system");
    return s;
  }
  s.selectedOfficerId = officer.id;

  // Information & meta actions — no confirmation.
  if (parsed.action === "ASK_STATUS") {
    const report = buildStatusReport(s, officer, parsed.rawText);
    pushDialogue(s, officer.id, officer.id, localDialogue.officerStatus({ officer, state: s, extra: { report } }), "report");
    return finishAction(s);
  }
  if (parsed.action === "ASK_ADVICE") {
    const advice = buildAdvice(s, officer);
    pushDialogue(s, officer.id, officer.id, localDialogue.officerAdvice({ officer, state: s, extra: { advice } }), "advice");
    return finishAction(s);
  }
  if (parsed.action === "SUMMON_OFFICER") {
    pushDialogue(s, officer.id, officer.id, `${officer.name} к вашим услугам, милорд.`, "report");
    return finishAction(s);
  }
  if (parsed.action === "CANCEL_ORDER") {
    return finishAction(cancelOfficerOrders(s, officer.id, true));
  }
  if (parsed.action === "CHANGE_ORDER") {
    const cleared = cancelOfficerOrders(s, officer.id, false);
    pushDialogue(cleared, officer.id, officer.id, "Отменяю прежний приказ. Какова новая задача, милорд?", "report");
    return finishAction(cleared);
  }

  // Combat orders with no explicit place ("атакуй фланг врага") default to the
  // battle already underway, so the player doesn't have to name a location.
  if ((parsed.action === "ATTACK" || parsed.action === "REINFORCE") && !parsed.targetLocationId) {
    const battle = s.battles.find((b) => b.status === "active");
    if (battle) {
      parsed.targetLocationId = battle.locationId;
      parsed.missing = parsed.missing.filter((m) => m !== "target");
    }
  }

  // Missing pieces → officer asks, we remember the partial order.
  if (parsed.missing.includes("target")) {
    s.pendingClarification = { partial: parsed, officerId: officer.id, awaiting: "target", askedAtTick: s.tick };
    pushDialogue(s, officer.id, officer.id, localDialogue.officerQuestion({ officer, state: s }, "target"), "question");
    return s;
  }
  if (parsed.missing.includes("unitCount")) {
    s.pendingClarification = { partial: parsed, officerId: officer.id, awaiting: "unitCount", askedAtTick: s.tick };
    pushDialogue(s, officer.id, officer.id, localDialogue.officerQuestion({ officer, state: s }, "unitCount"), "question");
    return s;
  }

  // Build the formal order.
  const built = buildOrder(parsed, s);
  s.idCounter = built.nextCounter;
  const order = built.order;

  // Supply always draws from the village store and delivers to the castle.
  if (order.action === "SUPPLY") {
    const source = s.locations.find((l) => l.foodStore > 0 && l.type === "village");
    if (source) order.targetLocationId = source.id;
  }

  const decision = decideAcceptance(officer, order, s);
  order.warned = decision.outcome === "warn";
  order.flaggedSuicidal = decision.suicidal;

  if (decision.outcome === "refuse") {
    order.status = "disobeyed";
    s.orders.push(order);
    pushDialogue(
      s,
      officer.id,
      officer.id,
      "Простите, милорд, но этот приказ погубит людей без всякого смысла. Я не могу его исполнить.",
      "report",
    );
    addMemory(s, officer.id, "I_DISOBEYED_ORDER", { relatedOrderId: order.id, weightScale: 0.6 });
    pushEvent(s, {
      kind: "warning",
      severity: "notable",
      title: "Неповиновение",
      message: `${officer.name} отказался исполнить приказ.`,
      officerId: officer.id,
      requiresPause: true,
    });
    return finishAction(s);
  }

  if (decision.outcome === "warn") {
    order.status = "awaiting_confirmation";
    s.orders.push(order);
    const eta = order.expectedCompletion != null ? Math.round(order.expectedCompletion - s.tick) : undefined;
    pushDialogue(s, officer.id, officer.id, localDialogue.officerWarning({ officer, order, state: s, extra: eta != null ? { eta } : undefined }), "report");
    pushEvent(s, {
      kind: "warning",
      severity: "notable",
      title: "Офицер предупреждает",
      message: `${officer.name} предупреждает об опасности приказа.`,
      officerId: officer.id,
      requiresPause: true,
    });
    return s;
  }

  // Accepted.
  if (order.status === "awaiting_confirmation") {
    // Dangerous action — show the confirmation card; the officer speaks on confirm.
    s.orders.push(order);
    return s;
  }

  // Safe action — execute immediately.
  s.orders.push(order);
  startOrderExecution(s, order);
  pushDialogue(s, officer.id, officer.id, localDialogue.officerAcknowledge({ officer, order, state: s }), "order");
  return finishAction(s);
}

function finishAction(s: GameState): GameState {
  syncCommanded(s);
  return s;
}

export function confirmOrder(state: GameState, orderId: string): GameState {
  const s = clone(state);
  const order = s.orders.find((o) => o.id === orderId && o.status === "awaiting_confirmation");
  if (!order) return s;
  const officer = officerById(s, order.officerId);
  startOrderExecution(s, order);
  if (officer) {
    pushDialogue(s, officer.id, officer.id, localDialogue.officerAcknowledge({ officer, order, state: s }), "order");
    if (order.warned) {
      addMemory(s, officer.id, "PLAYER_IGNORED_MY_WARNING", { relatedOrderId: order.id });
    } else if (order.risk === "high" || order.risk === "extreme") {
      addMemory(s, officer.id, "PLAYER_TRUSTED_ME_WITH_IMPORTANT_COMMAND", { relatedOrderId: order.id });
    }
  }
  return finishAction(s);
}

export function declineOrder(state: GameState, orderId: string): GameState {
  const s = clone(state);
  const order = s.orders.find((o) => o.id === orderId && o.status === "awaiting_confirmation");
  if (!order) return s;
  order.status = "cancelled";
  const officer = officerById(s, order.officerId);
  if (officer) {
    pushDialogue(s, officer.id, officer.id, "Как прикажете, милорд. Отменяю.", "report");
  }
  return finishAction(s);
}

/** Cancel an awaiting order and preload its text so the player can edit it. */
export function reviseOrder(state: GameState, orderId: string): GameState {
  const s = clone(state);
  const order = s.orders.find((o) => o.id === orderId && o.status === "awaiting_confirmation");
  if (!order) return s;
  order.status = "cancelled";
  if (order.officerId) s.selectedOfficerId = order.officerId;
  s.pendingRevision = order.sourceText;
  return s;
}

export function clearRevision(state: GameState): GameState {
  if (state.pendingRevision == null) return state;
  return { ...state, pendingRevision: null };
}

/** Cancel a specific active order (change/cancel from the orders panel). */
export function cancelOrder(state: GameState, orderId: string): GameState {
  const s = clone(state);
  const order = s.orders.find((o) => o.id === orderId);
  if (!order || !isActive(order)) return s;
  order.status = "cancelled";
  // Release the troops — they hold where they are.
  for (const gid of order.unitGroupIds) {
    const idx = s.units.findIndex((u) => u.id === gid);
    if (idx >= 0) {
      s.units[idx] = { ...clearMovement(s.units[idx]), orderId: null, state: "idle" };
    }
  }
  const officer = officerById(s, order.officerId);
  if (officer) pushDialogue(s, officer.id, officer.id, "Приказ отменён. Ждём новых распоряжений.", "report");
  pushLog(s, `Приказ отменён: ${describeTask(s, order)}.`, "order", "info");
  return finishAction(s);
}

function cancelOfficerOrders(s: GameState, officerId: string, speak: boolean): GameState {
  const active = s.orders.filter((o) => o.officerId === officerId && isActive(o));
  for (const order of active) {
    order.status = "cancelled";
    for (const gid of order.unitGroupIds) {
      const idx = s.units.findIndex((u) => u.id === gid);
      if (idx >= 0) s.units[idx] = { ...clearMovement(s.units[idx]), orderId: null, state: "idle" };
    }
  }
  const officer = officerById(s, officerId);
  if (speak && officer) {
    pushDialogue(
      s,
      officer.id,
      officer.id,
      active.length ? "Отменяю прежний приказ, милорд." : "У меня нет действующих приказов для отмены.",
      "report",
    );
  }
  if (active.length) pushLog(s, `${officer?.name ?? "Офицер"} отменил прежний приказ.`, "order", "info");
  return s;
}

/* ------------------------------------------------------------------ */
/* Order execution                                                     */
/* ------------------------------------------------------------------ */

function startOrderExecution(s: GameState, order: Order): void {
  const officer = officerById(s, order.officerId);
  if (!officer) {
    order.status = "failed";
    return;
  }
  // Supersede a prior active order from the same officer.
  const prior = s.orders.filter(
    (o) => o.id !== order.id && o.officerId === order.officerId && isActive(o),
  );
  for (const p of prior) {
    p.status = "interrupted";
    order.supersedesOrderId = p.id;
    for (const gid of p.unitGroupIds) {
      const idx = s.units.findIndex((u) => u.id === gid);
      if (idx >= 0) s.units[idx] = { ...clearMovement(s.units[idx]), orderId: null, state: "idle" };
    }
  }
  if (prior.length) {
    pushLog(s, `${officer.name} меняет задачу: ${describeTask(s, order)}.`, "order", "info");
  }

  const { source, count } = resolveOrderForce(order, s);
  if (!source || count <= 0) {
    order.status = "failed";
    pushDialogue(s, officer.id, officer.id, "У меня нет людей для этого приказа, милорд.", "report");
    return;
  }

  let groupId: string;
  if (count < source.count) {
    const newId = allocId(s, "unit");
    const { kept, detached } = splitGroup(source, count, newId);
    const idx = s.units.findIndex((u) => u.id === source.id);
    s.units[idx] = kept;
    s.units.push({ ...detached, orderId: order.id });
    groupId = newId;
  } else {
    const idx = s.units.findIndex((u) => u.id === source.id);
    s.units[idx] = { ...source, orderId: order.id };
    groupId = source.id;
  }
  order.unitGroupIds = [groupId];
  order.startedAt = s.tick;

  const targetId = order.targetLocationId;
  const gIdx = s.units.findIndex((u) => u.id === groupId);
  const group = s.units[gIdx];

  if (targetId && group.locationId !== targetId) {
    const route = pathfind(group.locationId, targetId, s.locations);
    if (route && route.path.length > 1) {
      s.units[gIdx] = beginMovement({ ...group, state: "preparing" }, route.path);
      // Immediately switch to moving so the marker animates from the start.
      s.units[gIdx] = { ...s.units[gIdx], state: "moving" };
      order.status = "moving";
    } else {
      order.status = "failed";
      pushDialogue(s, officer.id, officer.id, "Туда нет дороги, милорд.", "report");
      return;
    }
  } else {
    // Already in position.
    applyArrival(s, groupId, order);
  }
}

function applyArrival(s: GameState, groupId: string, order: Order): void {
  const gIdx = s.units.findIndex((u) => u.id === groupId);
  if (gIdx < 0) return;
  let group = { ...clearMovement(s.units[gIdx]) };
  const officer = officerById(s, order.officerId);
  const loc = locById(s, group.locationId);
  const locName = loc?.name ?? "позицию";

  switch (order.action) {
    case "MOVE":
    case "RETREAT":
      group.state = "idle";
      order.status = "completed";
      order.result = { success: true, summary: `Прибыл в ${locName}.` };
      if (officer) reportArrival(s, officer, `Мы на месте — ${locName}.`);
      break;
    case "DEFEND":
    case "HOLD":
    case "PROTECT":
      group.state = "holding";
      order.status = "executing";
      if (loc && loc.controlledBy === "neutral") loc.controlledBy = "player";
      if (officer) reportArrival(s, officer, `${locName} — позиция занята, держим оборону.`);
      break;
    case "AMBUSH":
      group.state = "holding";
      group.revealed = false;
      order.status = "executing";
      if (officer) reportArrival(s, officer, `Затаились у ${locName}. Ждём врага.`);
      break;
    case "ATTACK":
    case "REINFORCE":
      group.state = "fighting";
      order.status = "executing";
      if (officer) reportArrival(s, officer, `Мы у ${locName}. Идём в бой!`);
      break;
    case "SCOUT":
      group.state = "holding";
      order.status = "completed";
      doScouting(s, group.locationId);
      break;
    case "SUPPLY": {
      const delivered = deliverFood(9999, group.locationId, s.locations, s.resources);
      s.locations = delivered.locations;
      s.resources.food = delivered.food;
      group.state = "idle";
      order.status = "completed";
      pushEvent(s, {
        kind: "supply",
        severity: "info",
        title: "Снабжение",
        message: `${officer?.name ?? "Обоз"} отправил ${delivered.delivered} припасов в замок.`,
        officerId: officer?.id ?? null,
      });
      break;
    }
    case "EVACUATE": {
      s.flags.villageEvacuated = true;
      const delivered = deliverFood(9999, "village", s.locations, s.resources);
      s.locations = delivered.locations;
      s.resources.food = delivered.food;
      s.resources.kingdomMorale = clampStat(s.resources.kingdomMorale + 2);
      group.state = "idle";
      order.status = "completed";
      pushEvent(s, {
        kind: "report",
        severity: "notable",
        title: "Эвакуация",
        message: "Жители деревни выведены под защиту стен. Запасы спасены.",
        officerId: officer?.id ?? null,
      });
      break;
    }
    default:
      group.state = "holding";
      order.status = order.action === "WAIT" ? "executing" : "completed";
  }
  s.units[gIdx] = group;
}

function reportArrival(s: GameState, officer: Officer, text: string): void {
  pushDialogue(s, officer.id, officer.id, localDialogue.officerReport({ officer, state: s, extra: { report: text } }), "report");
  pushEvent(s, {
    kind: "report",
    severity: "info",
    title: officer.name,
    message: text,
    officerId: officer.id,
  });
}

function doScouting(s: GameState, atLocationId: string): void {
  s.enemy.intelLevel = clamp(s.enemy.intelLevel + 0.42, 0, 1);
  const report = scoutingReport(s, s.enemy.intelLevel);
  s.enemy.estimatedStrength = Math.round(s.enemy.trueStrength * (0.7 + 0.3 * s.enemy.intelLevel));
  // Reveal enemy groups near the scouted location / along the road.
  const nearby = new Set<string>([atLocationId]);
  const loc = locById(s, atLocationId);
  loc?.roads.forEach((r) => nearby.add(r.to));
  for (let i = 0; i < s.units.length; i++) {
    const u = s.units[i];
    if (u.side === "enemy" && u.count > 0 && (nearby.has(u.locationId) || s.enemy.intelLevel > 0.6)) {
      s.units[i] = { ...u, revealed: true };
    }
  }
  pushEvent(s, {
    kind: "scout_result",
    severity: "notable",
    title: "Доклад разведки",
    message: report,
    requiresPause: true,
  });
  pushDialogue(s, "mara", "mara", report, "report");
}

/* ------------------------------------------------------------------ */
/* Status & advice reports                                             */
/* ------------------------------------------------------------------ */

/** The kingdom's intelligence & supply advisor (Mara), for general questions. */
function adviser(s: GameState): Officer {
  return (
    s.officers.find((o) => o.id === "mara" && o.alive) ??
    s.officers.find((o) => o.alive) ??
    s.officers[0]
  );
}

type ReportTopic = "situation" | "enemy" | "time" | "supply" | "losses" | "positions" | "orders" | "own";

function detectTopic(low: string): ReportTopic {
  // Specific topics first, so "что там с врагом" resolves to the enemy report
  // rather than the generic "situation" catch-all.
  if (/враг|неприятел|против|их сил|сколько их|наступ|осад|кто идет|конниц.*враг/.test(low)) return "enemy";
  if (/рассвет|врем|сколько остал|успе|до утра|до зари/.test(low)) return "time";
  if (/запас|продовольств|снабжен|провиант|ед[аыу]|голод|хватит/.test(low)) return "supply";
  if (/потер|погиб|ранен|сколько.*люд/.test(low)) return "losses";
  if (/приказ|задани|чем занят|что делают|что исполн/.test(low)) return "orders";
  if (/где|позиц|расстанов|кто где|наши войск/.test(low)) return "positions";
  if (/обстанов|что происход|что там|новост|доклад|сводк|как дела|положени|итог/.test(low)) return "situation";
  return "own";
}

function playerTotals(s: GameState): { spearmen: number; archers: number; cavalry: number; total: number } {
  const t = { spearmen: 0, archers: 0, cavalry: 0, total: 0 };
  for (const u of s.units) {
    if (u.side === "player" && u.count > 0) {
      t[u.type] += u.count;
      t.total += u.count;
    }
  }
  return t;
}

function enemyIntel(s: GameState): string {
  const e = s.enemy;
  if (e.intelLevel < 0.3) {
    return "О враге почти ничего не известно — нужна разведка (лес или холмы). Знамёна замечены на восточной дороге.";
  }
  const approx = e.estimatedStrength ?? Math.round(e.trueStrength * 0.85);
  const revealed = s.units.filter((u) => u.side === "enemy" && u.count > 0 && u.revealed);
  const where = revealed.length
    ? "Замечены у " + [...new Set(revealed.map((u) => locById(s, u.locationId)?.name ?? "?"))].join(", ")
    : "Идут по восточной дороге к мосту";
  const cav = e.intelLevel > 0.6 ? " Среди них есть конница — она движется быстрее пехоты." : " Есть конница.";
  return `У врага около ${approx} бойцов.${cav} ${where}.`;
}

function timeReport(s: GameState): string {
  const t = formatMinutes(s.timeUntilDawn);
  if (s.timeUntilDawn <= 0) return "Рассвет наступил.";
  if (s.timeUntilDawn < 90) return `До рассвета ${t} — враг вот-вот будет у стен, времени почти нет.`;
  if (s.timeUntilDawn < 180) return `До рассвета ${t}. Пора занимать позиции — враг на подходе.`;
  return `До рассвета ${t}. Есть время подготовить оборону.`;
}

function supplyReport(s: GameState): string {
  const village = s.locations.find((l) => l.type === "village");
  const soldiers = playerTotals(s).total;
  const hours = soldiers > 0 ? Math.floor(s.resources.food / ((soldiers / 100) * s.balance.foodDrain || 1)) : 99;
  return `В замке ${Math.round(s.resources.food)} припасов${village && village.foodStore > 0 ? `, в деревне ещё ${village.foodStore}` : ""}. При нынешней армии этого хватит примерно на ${formatMinutes(hours * 60)} боёв. Мораль королевства — ${Math.round(s.resources.kingdomMorale)}/100.`;
}

function positionsReport(s: GameState): string {
  const parts: string[] = [];
  for (const o of s.officers.filter((of) => of.alive)) {
    const groups = s.units.filter((u) => u.commanderId === o.id && u.count > 0);
    if (groups.length === 0) {
      parts.push(`${o.name.split(" ").slice(-1)[0]} — без войск`);
      continue;
    }
    const g = groups[0];
    const place = g.state === "moving" ? `в пути к ${locById(s, g.moveDestId ?? g.moveToId ?? "")?.name ?? "цели"}` : (locById(s, g.locationId)?.name ?? "—");
    const troops = groups.map((gg) => `${gg.count} ${UNIT_LABELS_GENITIVE[gg.type]}`).join(", ");
    parts.push(`${o.name.split(" ").slice(-1)[0]}: ${troops} — ${place}`);
  }
  return parts.join(". ") + ".";
}

function ordersReport(s: GameState): string {
  const active = s.orders.filter(isActive);
  if (active.length === 0) return "Действующих приказов нет — офицеры ждут ваших распоряжений.";
  return active
    .map((o) => {
      const name = s.officers.find((of) => of.id === o.officerId)?.name.split(" ").slice(-1)[0] ?? "—";
      const place = locById(s, o.targetLocationId)?.name;
      return `${name}: ${describeTask(s, o).toLowerCase()}${place ? "" : ""}`;
    })
    .join("; ") + ".";
}

function lossesReport(s: GameState, officer: Officer): string {
  const total = Number(s.flags.playerCasualtiesTotal ?? 0);
  const wounded = s.officers.filter((o) => o.injury !== "none");
  const mine = s.units.filter((u) => u.commanderId === officer.id && u.count > 0);
  const minePart = mine.length ? ` Со мной осталось: ${mine.map((g) => `${g.count} ${UNIT_LABELS_GENITIVE[g.type]}`).join(", ")}.` : "";
  const woundPart = wounded.length ? " Ранены: " + wounded.map((o) => o.name.split(" ").slice(-1)[0]).join(", ") + "." : "";
  return `Потери армии на эту ночь — около ${pluralSoldiers(total)}.${minePart}${woundPart}`;
}

function situationReport(s: GameState): string {
  const t = playerTotals(s);
  const bridgeHeld = s.units.some((u) => u.side === "player" && u.count > 0 && u.locationId === "bridge" && (u.state === "holding" || u.state === "fighting"));
  const castleGuarded = s.units.some((u) => u.side === "player" && u.count > 0 && u.locationId === "castle");
  const fights = s.battles.filter((b) => b.status === "active").map((b) => locById(s, b.locationId)?.name).filter(Boolean);
  const threats: string[] = [];
  if (!bridgeHeld) threats.push("мост не занят");
  if (!castleGuarded) threats.push("замок без гарнизона");
  if (s.flags.villageRaided) threats.push("деревня разграблена");
  if (s.resources.food < 50) threats.push("мало припасов");
  const lines = [
    timeReport(s),
    enemyIntel(s),
    `Наши силы: ${t.spearmen} копейщиков, ${t.archers} лучников, ${t.cavalry} всадников.`,
    fights.length ? `Идёт бой у ${fights.join(", ")}.` : bridgeHeld ? "Мост под нашим контролем." : "",
    threats.length ? `Слабые места: ${threats.join(", ")}.` : "",
  ].filter(Boolean);
  return lines.join(" ");
}

/** One-line summary used as a soft fallback for unrecognised input. */
function buildSituationBrief(s: GameState): string {
  const bridgeHeld = s.units.some((u) => u.side === "player" && u.count > 0 && u.locationId === "bridge" && (u.state === "holding" || u.state === "fighting"));
  return `До рассвета ${formatMinutes(s.timeUntilDawn)}; ${s.enemy.intelLevel < 0.3 ? "силы врага ещё не разведаны" : `враг ≈ ${s.enemy.estimatedStrength ?? "?"} бойцов`}; мост ${bridgeHeld ? "под контролем" : "не занят"}.`;
}

function buildStatusReport(s: GameState, officer: Officer, rawText: string): string {
  const topic = detectTopic(rawText.toLowerCase());
  switch (topic) {
    case "situation":
      return situationReport(s);
    case "enemy":
      return enemyIntel(s);
    case "time":
      return timeReport(s);
    case "supply":
      return supplyReport(s);
    case "losses":
      return lossesReport(s, officer);
    case "positions":
      return positionsReport(s);
    case "orders":
      return ordersReport(s);
    case "own":
    default: {
      const groups = s.units.filter((u) => u.commanderId === officer.id && u.count > 0);
      if (groups.length === 0) {
        // An officer with no troops (or the advisor) gives the wider picture.
        return officer.id === adviser(s).id ? situationReport(s) : "Под моим началом сейчас нет войск, милорд.";
      }
      const parts = groups.map((g) => {
        const loc = g.state === "moving" ? "в пути" : locById(s, g.locationId)?.name ?? "в пути";
        return `${g.count} ${UNIT_LABELS_GENITIVE[g.type]} (мораль ${Math.round(g.morale)}) — ${loc}`;
      });
      return `${parts.join("; ")}.`;
    }
  }
}

function buildAdvice(s: GameState, officer: Officer): string {
  const bridgeHeld = s.units.some(
    (u) => u.side === "player" && u.count > 0 && u.locationId === "bridge" && (u.state === "holding" || u.state === "fighting"),
  );
  const castleGuarded = s.units.some((u) => u.side === "player" && u.count > 0 && u.locationId === "castle");
  const scouted = s.enemy.intelLevel > 0.3;

  if (!castleGuarded) {
    return "Замок остался без гарнизона, милорд — это смертельно опасно. Оставьте кого-то у стен.";
  }
  if (!scouted && (officer.id === "mara" || officer.speechStyle === "analytic")) {
    return "Сначала пошлите разведку к лесу или холмам — мы почти вслепую, милорд.";
  }
  if (!bridgeHeld && officer.speechStyle !== "brash") {
    return "Каменный мост — ключ к обороне. Займите его, и враг увязнет на узкой переправе.";
  }
  if (officer.id === "roland") {
    return "Дайте мне конницу за холмами. Когда враг завязнет у моста, я ударю ему во фланг.";
  }
  if (s.resources.food < 60) {
    return "Припасы тают, милорд. Стоит вывезти зерно из деревни, пока цела дорога.";
  }
  if (s.timeUntilDawn < 120) {
    return "Времени в обрез, милорд. Расставьте войска сейчас — перестраиваться будет поздно.";
  }
  return "Держите оборону плотно у моста, лучников — на холмы, а замок — под охраной.";
}

/* ------------------------------------------------------------------ */
/* Tick: movement, enemy AI, supply, battles, events, end checks       */
/* ------------------------------------------------------------------ */

export function tickGame(state: GameState, dtMinutes: number): GameState {
  if (state.phase !== "playing") return state;
  const s = clone(state);
  let remaining = Math.max(0, dtMinutes);
  let guard = 0;
  while (remaining > 0 && guard++ < 200) {
    const step = Math.min(STEP_CAP, remaining);
    remaining -= step;
    const prevTick = s.tick;
    s.tick += step;
    s.timeUntilDawn = Math.max(0, s.timeUntilDawn - step);

    advanceMovement(s, step);
    runEnemyAI(s);
    runVillage(s, step);
    applySupplyStep(s, step);
    detectBattles(s);
    runBattles(s, step);
    updateScenarioPhase(s);
    runCrisisDirector(s);

    const scripted = collectScriptedEvents(getScenario(s.scenarioId), prevTick, s.tick, s.idCounter);
    s.idCounter = scripted.next;
    for (const e of scripted.events) {
      s.events.push(e);
      if (e.requiresPause) s.speed = 0;
    }
    for (const l of scripted.logs) s.log.push(l);
    if (s.events.length > EVENT_CAP) s.events = s.events.slice(-EVENT_CAP);
    if (s.log.length > LOG_CAP) s.log = s.log.slice(-LOG_CAP);

    checkEndConditions(s);
    if (s.phase !== "playing") break;
  }
  syncCommanded(s);
  return s;
}

function hasOpposingPresence(s: GameState, side: Side, locationId: string): boolean {
  const other: Side = side === "player" ? "enemy" : "player";
  return s.units.some(
    (u) =>
      u.side === other &&
      u.count > 0 &&
      u.locationId === locationId &&
      (u.state === "holding" || u.state === "idle" || u.state === "fighting"),
  );
}

function advanceMovement(s: GameState, dt: number): void {
  for (let i = 0; i < s.units.length; i++) {
    const g = s.units[i];
    if (g.state !== "moving") continue;
    const res = stepGroupMovement(g, dt, s.locations, s.balance);
    let group = res.group;

    if (res.crossedInto && hasOpposingPresence(s, group.side, res.crossedInto)) {
      // Contact — halt here and give battle instead of walking past.
      group = { ...clearMovement(group), state: "fighting" };
      if (group.side === "enemy") group.revealed = true;
      s.units[i] = group;
      continue;
    }

    if (res.arrived) {
      if (group.side === "enemy") {
        group = { ...clearMovement(group), state: "holding", revealed: true };
        s.units[i] = group;
      } else {
        s.units[i] = group;
        const order = s.orders.find((o) => o.unitGroupIds.includes(group.id) && isActive(o));
        if (order) applyArrival(s, group.id, order);
        else s.units[i] = { ...clearMovement(group), state: "idle" };
      }
    } else {
      s.units[i] = group;
    }
  }
}

function runEnemyAI(s: GameState): void {
  // The enemy breaks camp after a short delay — long enough that a decisive
  // player can reach and hold the bridge chokepoint first.
  if (s.flags.enemyAdvancing && !s.flags.enemyMarchStarted && s.tick >= ENEMY_START_DELAY) {
    startEnemyAdvance(s);
    s.flags.enemyMarchStarted = true;
    // Cassian commits to a plan from what he has seen of the player's preparation.
    s.enemyPlan = chooseEnemyPlan(s);
  }

  const planId = s.enemyPlan?.id ?? "MASS_BRIDGE_ASSAULT";
  // A mass frontal assault throws everything at the bridge — no raid detachment.
  const wantsRaid = planId !== "MASS_BRIDGE_ASSAULT";
  const raidSize = planId === "VILLAGE_SUPPLY_CUT" ? RAID_SIZE + 40 : RAID_SIZE;
  const raidTick = planId === "VILLAGE_SUPPLY_CUT" ? RAID_TICK - 8 : RAID_TICK;

  // Dispatch a village raid once, if the plan calls for it and it's still worth raiding.
  if (
    !s.enemy.raidDispatched &&
    wantsRaid &&
    s.tick >= raidTick &&
    !s.flags.villageEvacuated
  ) {
    const source = s.units.find(
      (u) => u.side === "enemy" && u.type === "cavalry" && u.count > raidSize && u.state === "moving",
    );
    const village = locById(s, "village");
    if (source && village) {
      const idx = s.units.findIndex((u) => u.id === source.id);
      const newId = allocId(s, "unit");
      const { kept, detached } = splitGroup(source, raidSize, newId);
      s.units[idx] = kept;
      const route = pathfind(source.locationId, "village", s.locations);
      let raid: UnitGroup = { ...detached, revealed: true, state: "moving" };
      if (route && route.path.length > 1) raid = beginMovement(raid, route.path);
      s.units.push(raid);
      s.enemy.raidDispatched = true;
      pushEvent(s, {
        kind: "enemy_move",
        severity: "notable",
        title: "Отряд врага отделился",
        message: "Часть вражеской конницы свернула к деревне — похоже, идут за припасами.",
        locationId: "village",
        requiresPause: true,
      });
    }
  }

  // Feint-and-flank: slip a cavalry wing through the northern forest toward the castle.
  if (planId === "BRIDGE_FEINT_FOREST_FLANK" && !s.flags.forestFlankSent && s.tick >= RAID_TICK + 6) {
    const source = s.units.find(
      (u) => u.side === "enemy" && u.type === "cavalry" && u.count > FLANK_SIZE && u.state === "moving",
    );
    const p1 = source ? pathfind(source.locationId, "forest", s.locations) : null;
    const p2 = pathfind("forest", "castle", s.locations);
    if (source && p1 && p2 && p1.path.length > 1) {
      const idx = s.units.findIndex((u) => u.id === source.id);
      const newId = allocId(s, "unit");
      const { kept, detached } = splitGroup(source, FLANK_SIZE, newId);
      s.units[idx] = kept;
      const path = [...p1.path, ...p2.path.slice(1)];
      let flank: UnitGroup = { ...detached, revealed: false, state: "moving" };
      flank = beginMovement(flank, path);
      s.units.push(flank);
      s.flags.forestFlankSent = true;
      pushEvent(s, {
        kind: "enemy_move",
        severity: "notable",
        title: "Шум в лесу",
        message: "Разъезды доносят: в северном лесу что-то движется. Возможно, враг ищет обход.",
        locationId: "forest",
        requiresPause: false,
      });
    }
  }

  // Resolve a raid that reached an undefended village.
  const raiders = s.units.filter(
    (u) => u.side === "enemy" && u.count > 0 && u.locationId === "village" && u.state === "holding",
  );
  if (raiders.length && !hasOpposingPresence(s, "enemy", "village") && !s.flags.villageEvacuated && !s.flags.villageRaided) {
    const village = locById(s, "village");
    const looted = village ? village.foodStore : 0;
    if (village) village.foodStore = 0;
    s.resources.villageIntegrity = clampStat(s.resources.villageIntegrity - 55);
    s.resources.kingdomMorale = clampStat(s.resources.kingdomMorale - 6);
    s.flags.villageRaided = true;
    // Raiders withdraw off-field after pillaging.
    for (let i = 0; i < s.units.length; i++) {
      if (raiders.some((r) => r.id === s.units[i].id)) s.units[i] = { ...s.units[i], count: 0, state: "routed" };
    }
    pushEvent(s, {
      kind: "casualty",
      severity: "critical",
      title: "Деревня разграблена",
      message: `Враг разорил деревню и увёл ${looted} припасов. Мораль королевства падает.`,
      locationId: "village",
      requiresPause: true,
    });
  }
}

/* ------------------------------------------------------------------ */
/* Civilian layer (Elyne's village)                                    */
/* ------------------------------------------------------------------ */

function runVillage(s: GameState, dt: number): void {
  const v = s.village;
  if (s.flags.villageRaided) {
    v.damage = Math.max(v.damage, 72);
    v.cartsRolling = 0;
    return;
  }
  if ((v.plan === "full_evac" || v.plan === "partial_evac") && !s.flags.villageEvacuated) {
    const rate = v.plan === "full_evac" ? 0.011 : 0.0065;
    v.evacuationProgress = Math.min(1, v.evacuationProgress + rate * dt);
    v.cartsRolling = v.carts;
    v.civilians = Math.max(0, Math.round(140 * (1 - v.evacuationProgress)));
    const done = v.plan === "full_evac" ? 0.85 : 0.95;
    if (v.evacuationProgress >= done) {
      s.flags.villageEvacuated = true;
      v.cartsRolling = 0;
      const village = locById(s, "village");
      const moved = village ? village.foodStore : 0;
      if (village) village.foodStore = Math.round(village.foodStore * 0.3);
      s.resources.food = clamp(s.resources.food + Math.round(moved * 0.6), 0, 999);
      s.resources.kingdomMorale = clampStat(s.resources.kingdomMorale + 3);
      pushEvent(s, {
        kind: "report",
        severity: "notable",
        title: "Деревня эвакуирована",
        message: "Обозы дошли до замка. Люди и часть припасов — в безопасности.",
        locationId: "castle",
        requiresPause: false,
      });
    }
  }
}

/* ------------------------------------------------------------------ */
/* Scenario phase + crisis director                                    */
/* ------------------------------------------------------------------ */

function updateScenarioPhase(s: GameState): void {
  if (s.scenarioPhase === "aftermath") return;
  if (s.flags.crisisActive) {
    // The crisis passes after its window; the assault resumes.
    if (s.tick - Number(s.flags.crisisTick ?? 0) > 25) s.flags.crisisActive = false;
    else {
      s.scenarioPhase = "crisis";
      return;
    }
  }
  const anyBattle = s.battles.some((b) => b.status === "active");
  if (anyBattle || s.flags.mainForceBeaten) s.scenarioPhase = "main_assault";
  else if (s.enemy.raidDispatched || s.flags.forestFlankSent || s.tick >= RAID_TICK) s.scenarioPhase = "enemy_probe";
  else s.scenarioPhase = "preparation";
}

interface Crisis {
  id: string;
  title: string;
  message: string;
  locationId?: string;
  apply: (s: GameState) => void;
}

function pickCrisis(s: GameState): Crisis | null {
  // Fire the first crisis whose preconditions the current state matches.
  if (s.flags.bridgeFortified && !s.flags.crisisFireBarricade && bridgeIsContested(s)) {
    return {
      id: "FIRE_AT_BARRICADE",
      title: "Пожар у баррикады",
      message: "Враг закидал баррикаду факелами — колья горят. Оборона моста слабеет.",
      locationId: "bridge",
      apply: (st) => {
        st.flags.bridgeFortified = false;
        moraleAt(st, "bridge", -6);
      },
    };
  }
  if (s.village.cartsRolling > 0 && !s.flags.villageEvacuated) {
    return {
      id: "REFUGEES_BLOCK_ROAD",
      title: "Беженцы на дороге",
      message: "Поток беженцев запрудил дорогу к замку — подкрепления идут медленнее.",
      locationId: "village",
      apply: (st) => {
        st.resources.kingdomMorale = clampStat(st.resources.kingdomMorale - 3);
      },
    };
  }
  const archers = s.units.find((u) => u.side === "player" && u.type === "archers" && u.count > 0 && u.state === "fighting");
  if (archers) {
    return {
      id: "ARROWS_LOW",
      title: "Стрелы на исходе",
      message: "Лучники Аларика докладывают: колчаны пустеют. Нужно беречь залпы или подвезти стрелы.",
      locationId: archers.locationId,
      apply: (st) => {
        for (const u of st.units) if (u.side === "player" && u.type === "archers") u.morale = clampStat(u.morale - 8);
      },
    };
  }
  return {
    id: "LOST_MESSENGER",
    title: "Пропал гонец",
    message: "Гонец с донесением не вернулся. Разведданные о враге устарели.",
    apply: (st) => {
      st.enemy.intelLevel = Math.max(0, st.enemy.intelLevel - 0.2);
    },
  };
}

function runCrisisDirector(s: GameState): void {
  if (s.flags.crisisFired) return;
  const inAssault = s.battles.some((b) => b.status === "active");
  if (!inAssault && s.tick < RAID_TICK + 40) return;
  const crisis = pickCrisis(s);
  if (!crisis) return;
  s.flags.crisisFired = true;
  s.flags.crisisActive = true;
  s.flags.crisisTick = s.tick;
  crisis.apply(s);
  pushEvent(s, {
    kind: "casualty",
    severity: "critical",
    title: `Кризис: ${crisis.title}`,
    message: crisis.message,
    locationId: crisis.locationId,
    requiresPause: true,
  });
  pushDialogue(s, "mara", "mara", `Милорд, ${crisis.title.toLowerCase()}. Нужно решение — и быстро.`, "report");
}

function bridgeIsContested(s: GameState): boolean {
  return s.battles.some((b) => b.status === "active" && b.locationId === "bridge");
}

function moraleAt(s: GameState, locationId: string, delta: number): void {
  for (const u of s.units) {
    if (u.side === "player" && u.locationId === locationId) u.morale = clampStat(u.morale + delta);
  }
}

function applySupplyStep(s: GameState, dt: number): void {
  const result = applySupply(s.units, s.resources, dt, s.locations, s.balance);
  s.units = result.units;
  s.resources.food = result.food;
  if (result.notes.length && !s.flags.starvationWarned) {
    s.flags.starvationWarned = true;
    pushEvent(s, {
      kind: "supply",
      severity: "notable",
      title: "Голод",
      message: result.notes[0],
      requiresPause: false,
    });
  }
}

function detectBattles(s: GameState): void {
  for (const loc of s.locations) {
    const playerHere = s.units.filter(
      (u) => u.side === "player" && u.count > 0 && u.locationId === loc.id && u.state !== "moving",
    );
    const enemyHere = s.units.filter(
      (u) => u.side === "enemy" && u.count > 0 && u.locationId === loc.id && u.state !== "moving",
    );
    if (playerHere.length === 0 || enemyHere.length === 0) continue;
    const existing = s.battles.find((b) => b.locationId === loc.id && b.status === "active");
    if (existing) {
      // Fold in any newcomers.
      for (const p of playerHere) if (!existing.playerGroupIds.includes(p.id)) existing.playerGroupIds.push(p.id);
      for (const e of enemyHere) if (!existing.enemyGroupIds.includes(e.id)) existing.enemyGroupIds.push(e.id);
      continue;
    }
    // Defender = the side already holding the ground.
    const playerDefends =
      loc.controlledBy === "player" ||
      loc.isObjective ||
      playerHere.some((p) => p.state === "holding");
    const defenderSide: Side = playerDefends ? "player" : "enemy";
    const battle = makeBattle(
      allocId(s, "bat"),
      loc.id,
      defenderSide,
      playerHere.map((p) => p.id),
      enemyHere.map((e) => e.id),
      s.tick,
    );
    for (const g of [...playerHere, ...enemyHere]) {
      const idx = s.units.findIndex((u) => u.id === g.id);
      if (idx >= 0) s.units[idx] = { ...s.units[idx], state: "fighting", revealed: true };
    }
    s.battles.push(battle);
    pushEvent(s, {
      kind: "battle",
      severity: "critical",
      title: "Бой!",
      message: `Сражение началось у ${loc.name}.`,
      locationId: loc.id,
      requiresPause: true,
    });
    pushLog(s, `Завязался бой у ${loc.name}.`, "battle", "critical");
  }
}

function runBattles(s: GameState, dt: number): void {
  for (const battle of s.battles) {
    if (battle.status !== "active") continue;
    battle.roundTimer += dt;
    let safety = 0;
    while (battle.roundTimer >= ROUND_INTERVAL && battle.status === "active" && safety++ < 10) {
      battle.roundTimer -= ROUND_INTERVAL;
      const outcome = resolveBattleRound(battle, s);
      s.rngState = outcome.rngState;
      // Apply changed groups back.
      for (const u of outcome.units) {
        const idx = s.units.findIndex((g) => g.id === u.id);
        if (idx >= 0) s.units[idx] = u;
      }
      battle.momentum = clamp(battle.momentum + outcome.momentumDelta, -100, 100);
      battle.playerCasualties += outcome.playerCasualties;
      battle.enemyCasualties += outcome.enemyCasualties;
      s.flags.playerCasualtiesTotal = Number(s.flags.playerCasualtiesTotal ?? 0) + outcome.playerCasualties;
      // An assault on the castle chips away at its integrity — worse when the
      // defenders are losing the exchange.
      if (battle.locationId === "castle") {
        const damage = outcome.momentumDelta < 0 ? 3 : 1;
        s.resources.castleIntegrity = clampStat(s.resources.castleIntegrity - damage);
      }
      battle.rounds += 1;
      if (outcome.logLine) {
        battle.log.push({ tick: s.tick, text: outcome.logLine });
        if (battle.log.length > BATTLE_LOG_CAP) battle.log = battle.log.slice(-BATTLE_LOG_CAP);
        if (battle.rounds % 2 === 1) {
          pushLog(s, outcome.logLine, "battle", "notable");
        }
      }
      if (outcome.flankOpportunity && !battle.initiativeOfferedTo) {
        offerInitiative(s, battle);
      }
      if (outcome.decided) {
        finishBattle(s, battle, outcome.decided);
        break;
      }
    }
  }
  // Clean up finished battles from the active list is unnecessary; status flags it.
}

function offerInitiative(s: GameState, battle: Battle): void {
  const roland = s.officers.find((o) => o.id === "roland" && o.alive);
  if (!roland) return;
  const force = hasReadyStrikeForce(roland, s);
  if (!force) return;
  const urgent = Math.abs(battle.momentum) > 14; // swinging fast → less time to ask
  const decision = evaluateInitiative(roland, s, { type: "flank", battleId: battle.id, urgent });
  if (!decision.wants) return;
  battle.initiativeOfferedTo = roland.id;

  if (decision.actNow) {
    // Acts on his own — joins the fight immediately.
    commitFlank(s, battle, roland, force.id, true, decision.reason);
  } else {
    roland.pendingInitiativeOrderId = battle.id;
    pushDialogue(s, roland.id, roland.id, localDialogue.officerInitiative({ officer: roland, state: s }), "question");
    pushEvent(s, {
      kind: "initiative_request",
      severity: "critical",
      title: "Роланд просит разрешения",
      message: "Сэр Роланд заметил открытый фланг врага и просит разрешения атаковать.",
      officerId: roland.id,
      locationId: battle.locationId,
      requiresPause: true,
    });
  }
}

export function resolveInitiative(state: GameState, officerId: string, approve: boolean): GameState {
  const s = clone(state);
  const officer = officerById(s, officerId);
  if (!officer || !officer.pendingInitiativeOrderId) return s;
  const battle = s.battles.find((b) => b.id === officer.pendingInitiativeOrderId && b.status === "active");
  officer.pendingInitiativeOrderId = undefined;
  if (!battle) {
    pushDialogue(s, officer.id, officer.id, "Момент упущен, милорд. В другой раз.", "report");
    return finishAction(s);
  }
  const force = hasReadyStrikeForce(officer, s);
  if (approve && force) {
    commitFlank(s, battle, officer, force.id, false, "player_approved");
    addMemory(s, officer.id, "PLAYER_TRUSTED_MY_INITIATIVE");
  } else {
    pushDialogue(s, officer.id, officer.id, officer.traits.ambition > 70 ? "Как прикажете… хоть и жаль упускать такой шанс." : "Слушаюсь, милорд. Остаюсь на месте.", "report");
    if (officer.traits.ambition > 70) {
      officer.traits.resentment = clampStat(officer.traits.resentment + 6);
    }
  }
  return finishAction(s);
}

function commitFlank(
  s: GameState,
  battle: Battle,
  officer: Officer,
  groupId: string,
  onOwn: boolean,
  reason: string,
): void {
  const gIdx = s.units.findIndex((u) => u.id === groupId);
  if (gIdx < 0) return;
  // Move the cavalry into the fight with a flank shock.
  s.units[gIdx] = {
    ...clearMovement(s.units[gIdx]),
    locationId: battle.locationId,
    state: "fighting",
    revealed: true,
    morale: clampStat(s.units[gIdx].morale + 8),
  };
  if (!battle.playerGroupIds.includes(groupId)) battle.playerGroupIds.push(groupId);
  // Flanking shock: swing momentum and rattle the enemy.
  battle.momentum = clamp(battle.momentum + 30, -100, 100);
  for (const eid of battle.enemyGroupIds) {
    const ei = s.units.findIndex((u) => u.id === eid);
    if (ei >= 0) s.units[ei] = { ...s.units[ei], morale: clampStat(s.units[ei].morale - 16) };
  }
  // Create an initiative order for the journal.
  const orderId = allocId(s, "ord");
  const order: Order = {
    id: orderId,
    officerId: officer.id,
    action: "ATTACK",
    targetLocationId: battle.locationId,
    unitType: "cavalry",
    unitCount: s.units[gIdx].count,
    unitGroupIds: [groupId],
    conditions: [],
    priority: 2,
    createdAt: s.tick,
    startedAt: s.tick,
    expectedCompletion: s.tick,
    status: "executing",
    risk: "high",
    sourceText: "(инициатива офицера)",
    parsed: {
      action: "ATTACK",
      officerId: officer.id,
      targetLocationId: battle.locationId,
      unitType: "cavalry",
      unitCount: s.units[gIdx].count,
      takeAll: true,
      conditions: [],
      confidence: 1,
      missing: [],
      risk: "high",
      isQuestion: false,
      rawText: "(инициатива офицера)",
      summary: "Фланговый удар конницы",
    },
    result: null,
    officerInitiated: true,
    initiativeReason: onOwn
      ? "Увидел открытый фланг, времени спросить не было — высокая инициатива и амбиции."
      : "Заметил тактическую возможность и получил ваше разрешение на удар.",
  };
  s.units[gIdx] = { ...s.units[gIdx], orderId };
  s.orders.push(order);
  const line = onOwn
    ? `Сэр Роланд ринулся в атаку по собственному почину: ${order.initiativeReason}`
    : `Сэр Роланд повёл конницу во фланг с вашего одобрения.`;
  pushDialogue(s, officer.id, officer.id, onOwn ? "Простите, милорд, ждать было нельзя — я ударил сам!" : "За короля! В атаку!", "order");
  pushEvent(s, {
    kind: "battle",
    severity: "critical",
    title: "Фланговый удар!",
    message: line,
    officerId: officer.id,
    locationId: battle.locationId,
    requiresPause: onOwn,
  });
  pushLog(s, line, "battle", "critical");
  void reason;
}

function finishBattle(s: GameState, battle: Battle, winner: "player" | "enemy"): void {
  battle.status = winner === "player" ? "player_won" : "enemy_won";
  const loc = locById(s, battle.locationId);
  const locName = loc?.name ?? "поле боя";

  if (winner === "player") {
    // Surviving enemy participants rout and leave the field; count them lost.
    for (const eid of battle.enemyGroupIds) {
      const idx = s.units.findIndex((u) => u.id === eid);
      if (idx >= 0) {
        battle.enemyCasualties += s.units[idx].count;
        s.units[idx] = { ...s.units[idx], count: 0, state: "routed" };
      }
    }
    // Player participants hold the ground.
    for (const pid of battle.playerGroupIds) {
      const idx = s.units.findIndex((u) => u.id === pid);
      if (idx >= 0 && s.units[idx].count > 0) {
        s.units[idx] = { ...s.units[idx], state: "holding" };
        // Battle honours: the commander remembers the win.
        const cid = s.units[idx].commanderId;
        if (cid) addMemory(s, cid, "I_WON_MAJOR_BATTLE", { relatedOrderId: s.units[idx].orderId });
      }
    }
    maybeWoundOfficers(s, battle, false);
    pushEvent(s, {
      kind: "victory",
      severity: "critical",
      title: "Враг отброшен",
      message: `Наши войска удержали ${locName}! Враг обращён в бегство (потери врага ≈ ${battle.enemyCasualties}).`,
      locationId: battle.locationId,
      requiresPause: true,
    });
    pushLog(s, `Победа у ${locName}. Враг бежит.`, "victory", "critical");
  } else {
    // Player participants are broken; remnants flee toward the castle.
    for (const pid of battle.playerGroupIds) {
      const idx = s.units.findIndex((u) => u.id === pid);
      if (idx < 0) continue;
      const g = s.units[idx];
      const cid = g.commanderId;
      if (cid && (battle.playerCasualties > 0)) {
        addMemory(s, cid, "I_LOST_MANY_SOLDIERS", { relatedOrderId: g.orderId });
        // If the player forced a suicidal defence, that lands hard.
        const order = s.orders.find((o) => o.unitGroupIds.includes(g.id));
        if (order?.flaggedSuicidal) {
          addMemory(s, cid, "PLAYER_ORDERED_SUICIDAL_DEFENSE", { relatedOrderId: order.id });
        }
      }
      if (g.count > 0 && battle.locationId !== "castle") {
        const route = pathfind(g.locationId, "castle", s.locations);
        s.units[idx] = route
          ? beginMovement({ ...g, state: "retreating", morale: clampStat(g.morale - 10) }, route.path)
          : { ...g, count: 0, state: "routed" };
        s.units[idx] = { ...s.units[idx], state: "moving" };
      } else if (battle.locationId === "castle") {
        // The last defenders are wiped out at the walls — count them as losses.
        s.flags.playerCasualtiesTotal = Number(s.flags.playerCasualtiesTotal ?? 0) + g.count;
        battle.playerCasualties += g.count;
        s.units[idx] = { ...g, count: 0, state: "routed" };
      }
    }
    // Surviving enemy resume their advance to the castle.
    for (const eid of battle.enemyGroupIds) {
      const idx = s.units.findIndex((u) => u.id === eid);
      if (idx < 0 || s.units[idx].count <= 0) continue;
      const g = s.units[idx];
      if (battle.locationId !== "castle") {
        const route = pathfind(g.locationId, "castle", s.locations);
        if (route && route.path.length > 1) s.units[idx] = beginMovement({ ...g, state: "moving" }, route.path);
        else s.units[idx] = { ...g, state: "holding" };
      } else {
        s.units[idx] = { ...g, state: "holding" };
      }
    }
    maybeWoundOfficers(s, battle, true);
    pushEvent(s, {
      kind: "casualty",
      severity: "critical",
      title: "Позиция потеряна",
      message: `Наш строй у ${locName} сломлен. Уцелевшие отходят к замку.`,
      locationId: battle.locationId,
      requiresPause: true,
    });
    pushLog(s, `Поражение у ${locName}. Отступаем.`, "casualty", "critical");
  }
}

function maybeWoundOfficers(s: GameState, battle: Battle, playerLost: boolean): void {
  // Officers present at a hard-fought battle risk a wound; deadlier when losing.
  const roll = (base: number) => {
    const r = (s.rngState = (s.rngState + 0x6d2b79f5) >>> 0);
    return (r % 1000) / 1000 < base;
  };
  for (const o of s.officers) {
    if (!o.alive) continue;
    const inBattle =
      battle.playerGroupIds.some((id) => s.units.find((u) => u.id === id)?.commanderId === o.id) ||
      s.units.some((u) => u.commanderId === o.id && u.locationId === battle.locationId);
    if (!inBattle) continue;
    const woundChance = playerLost ? 0.22 : 0.08;
    if (roll(woundChance)) {
      if (o.injury === "none") {
        o.injury = playerLost && roll(0.4) ? "heavy" : "light";
      } else if (o.injury === "light") {
        o.injury = "heavy";
      } else if (o.injury === "heavy" && playerLost && roll(0.25)) {
        o.injury = "dead";
        o.alive = false;
        if (s.selectedOfficerId === o.id) s.selectedOfficerId = null;
      }
      if (o.injury === "heavy" && o.permanentInjury === "none" && roll(0.5)) {
        const perms = ["eye", "arm", "limp"] as const;
        o.permanentInjury = perms[(s.rngState >>> 3) % 3];
        o.traits.competence = clampStat(o.traits.competence - 6);
      }
      const msg = o.alive
        ? `${o.name} ранен в бою (${o.injury === "heavy" ? "тяжело" : "легко"}).`
        : `${o.name} пал на поле боя. Королевство скорбит.`;
      pushEvent(s, {
        kind: "casualty",
        severity: "critical",
        title: o.alive ? "Офицер ранен" : "Гибель офицера",
        message: msg,
        officerId: o.id,
        requiresPause: true,
      });
      pushLog(s, msg, "casualty", "critical");
    }
  }
}

/* ------------------------------------------------------------------ */
/* Win / lose                                                          */
/* ------------------------------------------------------------------ */

function checkEndConditions(s: GameState): void {
  const enemyAtCastleWinning = s.battles.some(
    (b) => b.status === "enemy_won" && b.locationId === "castle",
  );
  const enemyHoldsCastle = s.units.some(
    (u) => u.side === "enemy" && u.count > 0 && u.locationId === "castle" && !hasOpposingPresence(s, "enemy", "castle"),
  );
  const playerCombatLeft = s.units
    .filter((u) => u.side === "player" && u.count > 0 && u.type !== undefined)
    .reduce((sum, u) => sum + u.count, 0);
  const enemyLeft = s.units
    .filter((u) => u.side === "enemy" && u.count > 0)
    .reduce((sum, u) => sum + u.count, 0);

  if (enemyAtCastleWinning || enemyHoldsCastle || s.resources.castleIntegrity <= 0) {
    endGame(s, "defeat_castle_lost");
    return;
  }
  if (playerCombatLeft <= 0) {
    endGame(s, "defeat_army_broken");
    return;
  }
  if (enemyLeft <= 0 && s.flags.enemyAdvancing) {
    s.flags.mainForceBeaten = true;
    endGame(s, victoryTier(s));
    return;
  }
  if (s.timeUntilDawn <= 0) {
    // Dawn: if the castle still stands, the enemy breaks off the assault.
    endGame(s, victoryTier(s));
  }
}

function victoryTier(s: GameState): OutcomeKind {
  const initial = Number(s.flags.initialPlayerTotal ?? 1);
  const lost = Number(s.flags.playerCasualtiesTotal ?? 0);
  const frac = initial > 0 ? lost / initial : 0;
  const deadOfficers = s.officers.filter((o) => !o.alive).length;
  if (deadOfficers > 0 || frac >= 0.55) return "pyrrhic_victory";
  if (frac >= 0.35) return "costly_victory";
  if (frac >= 0.16) return "tactical_victory";
  return "decisive_victory";
}

function endGame(s: GameState, kind: OutcomeKind): void {
  s.outcome = buildOutcome(s, kind);
  s.speed = 0;
  s.scenarioPhase = "aftermath";
  const victorious =
    kind.startsWith("decisive") || kind.startsWith("tactical") || kind.startsWith("costly") || kind.startsWith("pyrrhic");
  if (victorious) {
    // Capture the enemy commander; his fate is decided after the aftermath.
    s.prisoner = {
      commanderName: s.enemy.commanderName,
      captured: true,
      respectForPlayer: computePrisonerRespect({ ...s, outcome: s.outcome }),
      decided: false,
      decision: null,
      recruitSucceeded: null,
    };
    pushEvent(s, {
      kind: "victory",
      severity: "critical",
      title: s.outcome.title,
      message: `${s.outcome.summary} ${s.enemy.commanderName} захвачен в плен.`,
      requiresPause: true,
    });
  } else {
    pushEvent(s, {
      kind: "defeat",
      severity: "critical",
      title: s.outcome.title,
      message: s.outcome.summary,
      requiresPause: true,
    });
  }
  // Both victory and defeat pass through the aftermath (judge officers, chronicle).
  s.aftermath = { heroOfficerId: null, verdicts: {}, chronicleChoice: null, reputation: 0, resolved: false };
  s.phase = "aftermath";
}

/* ------------------------------------------------------------------ */
/* Aftermath                                                           */
/* ------------------------------------------------------------------ */

const VERDICT_MEMORY: Record<OfficerVerdict, MemoryEventType> = {
  praise: "PLAYER_REWARDED_ME",
  forgive: "PLAYER_FORGAVE_DISOBEDIENCE",
  blame: "PLAYER_BLAMED_ME_UNFAIRLY",
  promote: "PLAYER_REWARDED_ME",
  dismiss: "PLAYER_BLAMED_ME_UNFAIRLY",
};

export function setAftermathVerdict(state: GameState, officerId: string, verdict: OfficerVerdict): GameState {
  const s = clone(state);
  if (!s.aftermath || s.aftermath.resolved) return s;
  s.aftermath.verdicts[officerId] = verdict;
  return s;
}

export function nameHero(state: GameState, officerId: string | null): GameState {
  const s = clone(state);
  if (!s.aftermath || s.aftermath.resolved) return s;
  s.aftermath.heroOfficerId = officerId;
  return s;
}

/** Finalize the aftermath: apply verdicts + hero, then go to the prisoner or end. */
export function concludeAftermath(state: GameState, chronicleChoice: string): GameState {
  const s = clone(state);
  if (!s.aftermath) {
    s.phase = s.prisoner && !s.prisoner.decided ? "prisoner" : "ended";
    return s;
  }
  s.aftermath.chronicleChoice = chronicleChoice;
  let rep = 0;
  for (const [officerId, verdict] of Object.entries(s.aftermath.verdicts)) {
    const strong = verdict === "promote" || verdict === "dismiss";
    addMemory(s, officerId, VERDICT_MEMORY[verdict], { weightScale: strong ? 1.2 : 1 });
    rep += verdict === "praise" || verdict === "promote" ? 2 : verdict === "blame" || verdict === "dismiss" ? -1 : 1;
  }
  if (s.aftermath.heroOfficerId) {
    addMemory(s, s.aftermath.heroOfficerId, "PLAYER_REWARDED_ME", { weightScale: 1.3 });
    rep += 3;
  }
  s.aftermath.reputation = rep;
  s.resources.kingdomMorale = clampStat(s.resources.kingdomMorale + Math.round(rep * 0.6));
  s.aftermath.resolved = true;

  s.phase = s.prisoner && !s.prisoner.decided ? "prisoner" : "ended";
  return s;
}

function buildOutcome(s: GameState, kind: OutcomeKind): GameOutcome {
  const lost = Number(s.flags.playerCasualtiesTotal ?? 0);
  const titles: Record<OutcomeKind, string> = {
    decisive_victory: "Убедительная победа",
    tactical_victory: "Тактическая победа",
    costly_victory: "Тяжёлая победа",
    pyrrhic_victory: "Пиррова победа",
    defeat_castle_lost: "Замок пал",
    defeat_army_broken: "Армия разбита",
    in_progress: "Бой продолжается",
  };
  const summaries: Record<OutcomeKind, string> = {
    decisive_victory: "Враг разбит наголову, а стены целы. О вашей ночи сложат песни.",
    tactical_victory: "Вы отбили натиск и сохранили армию. Достойная победа.",
    costly_victory: "Победа далась дорогой ценой, но замок выстоял.",
    pyrrhic_victory: "Вы победили, но цена была страшной. Эта ночь будет сниться вам долго.",
    defeat_castle_lost: "Враг ворвался в замок. Королевство пало ещё до рассвета.",
    defeat_army_broken: "Ваша армия перестала существовать как сила. Оборона рухнула.",
    in_progress: "",
  };
  const highlights: string[] = [
    `Потери армии: ≈ ${lost} воинов.`,
    `Мораль королевства: ${Math.round(s.resources.kingdomMorale)}/100.`,
    `Продовольствие: ${Math.round(s.resources.food)}.`,
  ];
  const wounded = s.officers.filter((o) => o.injury !== "none");
  if (wounded.length) {
    highlights.push(
      "Офицеры: " +
        wounded
          .map((o) => `${o.name} — ${o.alive ? (o.injury === "heavy" ? "тяжело ранен" : "ранен") : "погиб"}`)
          .join("; ") +
        ".",
    );
  }
  if (s.flags.villageRaided) highlights.push("Деревня была разграблена врагом.");
  else if (s.flags.villageEvacuated) highlights.push("Жителей деревни удалось спасти.");
  return { kind, title: titles[kind], summary: summaries[kind], highlights };
}

/* ------------------------------------------------------------------ */
/* Prisoner finale                                                     */
/* ------------------------------------------------------------------ */

const PRISONER_REACTIONS: Record<PrisonerDecision, Record<SpeechStyle, string>> = {
  execute: {
    stoic: "Сурово, но враг понимает лишь силу. Быть посему.",
    brash: "Так ему и надо! Пусть остальные боятся.",
    analytic: "Устрашение сработает. Хотя союзников это нам не прибавит.",
    gruff: "Быстро и без затей. Мёртвый враг стрел не просит.",
    courtly: "Жестоко, милорд. Двор запомнит эту ночь — надеюсь, не с содроганием.",
  },
  imprison: {
    stoic: "Разумно, милорд. Живой пленник ещё пригодится.",
    brash: "Скучно, но пусть гниёт в темнице, раз вам так угодно.",
    analytic: "Верное решение — он ценный козырь для торга.",
    gruff: "Пусть посидит. Целее будем, да и стены крепче.",
    courtly: "Мудро, милорд. Живой пленник — это и рычаг, и залог для переговоров.",
  },
  release: {
    stoic: "Милосердие благородно, но я запомню его лицо, милорд.",
    brash: "Отпустить?! Мы ещё пожалеем об этом, помяните моё слово.",
    analytic: "Рискованно. Но жест доброй воли иногда стоит армии.",
    gruff: "Отпустить? Ну-ну. Смотрите, чтоб он не вернулся с новой лестницей.",
    courtly: "Благородный жест, милорд. Слух о вашем милосердии дойдёт до многих дворов.",
  },
  recruit: {
    stoic: "Вчерашний враг под нашими знамёнами… посмотрим, чего он стоит.",
    brash: "Предатель есть предатель. Я буду присматривать за ним.",
    analytic: "Смелый расчёт. Если он честен — мы усилились без единого боя.",
    gruff: "Перебежчик, значит. Пусть докажет делом, а я послежу за его руками.",
    courtly: "Тонкий ход, милорд. Верный вассал из бывшего врага — украшение любого двора.",
  },
};

export function decidePrisoner(state: GameState, decision: PrisonerDecision): GameState {
  const s = clone(state);
  if (!s.prisoner || s.prisoner.decided) return s;
  const res = resolvePrisoner(s, decision, s.rngState);
  s.rngState = res.rngState;
  s.prisoner.decided = true;
  s.prisoner.decision = decision;
  s.prisoner.recruitSucceeded = res.recruitSucceeded;
  s.resources.kingdomMorale = clampStat(s.resources.kingdomMorale + res.moraleDelta);

  pushDialogue(s, "narrator", null, res.summary, "briefing");
  for (const o of s.officers) {
    if (!o.alive) continue;
    addMemory(s, o.id, res.officerMemory);
    const reaction = PRISONER_REACTIONS[decision][o.speechStyle];
    pushDialogue(s, o.id, o.id, reaction, "report");
  }

  // Fold the decision into the final report.
  s.outcome = {
    ...s.outcome,
    highlights: [...s.outcome.highlights, `Судьба ${s.enemy.commanderName}: ${res.summary}`],
  };
  s.phase = "ended";
  pushLog(s, res.summary, "narrative", "notable");
  return s;
}

/* ------------------------------------------------------------------ */
/* Trivial UI-driven state changes                                     */
/* ------------------------------------------------------------------ */

export function setSpeed(state: GameState, speed: GameState["speed"]): GameState {
  return { ...state, speed };
}
export function selectOfficer(state: GameState, officerId: string | null): GameState {
  return { ...state, selectedOfficerId: officerId };
}
export function selectLocation(state: GameState, locationId: string | null): GameState {
  return { ...state, selectedLocationId: locationId };
}
export function viewBattle(state: GameState, battleId: string | null): GameState {
  return { ...state, viewBattleId: battleId };
}
export function markEventsHandled(state: GameState): GameState {
  return { ...state, events: state.events.map((e) => ({ ...e, handled: true })) };
}
/** Mark a single event handled, so simultaneous pause-events aren't skipped. */
export function markEventHandled(state: GameState, eventId: string): GameState {
  return {
    ...state,
    events: state.events.map((e) => (e.id === eventId ? { ...e, handled: true } : e)),
  };
}
export function advanceTutorial(state: GameState): GameState {
  const step = state.tutorial.step + 1;
  const done = step >= TUTORIAL_STEPS;
  return { ...state, tutorial: { active: !done, step, completed: done } };
}
export function skipTutorial(state: GameState): GameState {
  return { ...state, tutorial: { active: false, step: TUTORIAL_STEPS, completed: true } };
}
export function updateSettings(state: GameState, patch: Partial<GameState["settings"]>): GameState {
  return { ...state, settings: { ...state.settings, ...patch } };
}

export const TUTORIAL_STEPS = 6;

/** Debug helpers used by the dev panel. */
export const debug = {
  addTroops(state: GameState, officerId: string, amount: number): GameState {
    const s = clone(state);
    const g = s.units.find((u) => u.commanderId === officerId && u.count > 0);
    if (g) g.count += amount;
    syncCommanded(s);
    return s;
  },
  setMorale(state: GameState, value: number): GameState {
    return { ...state, resources: { ...state.resources, kingdomMorale: clampStat(value) } };
  },
  revealEnemy(state: GameState): GameState {
    const s = clone(state);
    s.units = s.units.map((u) => (u.side === "enemy" ? { ...u, revealed: true } : u));
    s.enemy.intelLevel = 1;
    s.enemy.estimatedStrength = s.enemy.trueStrength;
    return s;
  },
  addTime(state: GameState, minutes: number): GameState {
    return { ...state, timeUntilDawn: Math.max(0, state.timeUntilDawn + minutes) };
  },
  forceVictory(state: GameState): GameState {
    const s = clone(state);
    s.units = s.units.map((u) => (u.side === "enemy" ? { ...u, count: 0, state: "routed" } : u));
    s.flags.enemyAdvancing = true;
    checkEndConditions(s);
    return s;
  },
};
