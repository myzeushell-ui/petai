/**
 * Local command interpreter — turns Russian natural language into a structured
 * ParsedCommand. No external NLP: it uses dictionaries, stemmed keyword
 * matching, number parsing and conversational context. A future adapter can
 * implement the same CommandInterpreter interface with an LLM.
 */

import type {
  CommandInterpreter,
  InterpreterContext,
  Location,
  Officer,
  OrderAction,
  OrderCondition,
  ParsedCommand,
  MissingField,
  RiskLevel,
  UnitGroup,
  UnitType,
} from "./types";

/* ------------------------------------------------------------------ */
/* Dictionaries                                                        */
/* ------------------------------------------------------------------ */

/** Stemmed keyword groups per action, checked in priority order. */
const ACTION_KEYWORDS: { action: OrderAction; stems: string[] }[] = [
  { action: "ASK_ADVICE", stems: ["посовет", "твой совет", "твоё мнение", "твое мнение", "что скажешь", "как думаешь", "что делать", "рекоменд", "стоит ли"] },
  { action: "ASK_STATUS", stems: ["сколько", "каков", "запас", "доклад", "донесен", "статус", "потер", "обстанов", "как дела", "что происход", "доложи"] },
  { action: "CANCEL_ORDER", stems: ["отмени", "отменить", "отставить", "забудь приказ", "отмена"] },
  { action: "SUMMON_OFFICER", stems: ["позови", "вызови", "пригласи", "мне нужен", "мне нужна", "ко мне"] },
  { action: "SCOUT", stems: ["развед", "разузнай", "осмотр", "дозор", "выясни", "проверь", "разведай"] },
  { action: "AMBUSH", stems: ["засад", "спрячь", "укрой", "притаись", "из засады", "скрытно ждать"] },
  { action: "EVACUATE", stems: ["эвакуир", "эвакуац", "увед жител", "спаси жител", "выведи людей", "вывези жител"] },
  { action: "SUPPLY", stems: ["снабж", "привез", "перевез", "перевоз", "доставь", "провиант", "продовольств", "припас", "зерн", "перевезите ед", "привезите ед"] },
  { action: "RETREAT", stems: ["отступ", "отходи", "отход", "отвод", "назад к замк", "вернись к замк"] },
  { action: "REINFORCE", stems: ["подкреплен", "усиль", "на помощь", "поддерж", "подмог"] },
  { action: "PROTECT", stems: ["защит", "прикрой", "обереги", "охраняй"] },
  { action: "DEFEND", stems: ["оборон"] },
  { action: "HOLD", stems: ["удерж", "держи", "держись", "не отступ", "стой на", "закрепись"] },
  { action: "ATTACK", stems: ["атак", "удар", "напад", "в атаку", "разбей", "сокруши", "ринься"] },
  { action: "WAIT", stems: ["жди", "ожидай", "подожди", "ничего не делай", "оставайся на месте", "не двигайся", "стой и жди"] },
  { action: "MOVE", stems: ["иди", "веди", "отправ", "выдвиг", "марш", "переброс", "двигай", "ступай", "займи", "к мост", "к замк", "к деревн", "к холм", "к лес", "поведи"] },
];

const LOCATION_SYNONYMS: Record<string, string[]> = {
  castle: ["замок", "замку", "замка", "замке", "крепост", "цитадел", "стен"],
  village: ["деревн", "село", "селе", "тихий брод", "крестьян"],
  bridge: ["мост", "мосту", "моста", "мосте", "переправ"],
  forest: ["лес", "лесу", "леса", "чащ", "северн"],
  hills: ["холм", "возвышен", "высот"],
  road: ["дорог", "тракт", "восточн дорог"],
  enemy_camp: ["лагер", "враж лагер", "стан врага"],
};

const HERE_WORDS = ["сюда", "здесь", "тут", "туда", "это место", "эту точку", "сюды"];

const UNIT_SYNONYMS: Record<UnitType, string[]> = {
  spearmen: ["копейщик", "копьён", "копьен", "пехот", "пехотинц", "щитоносц"],
  archers: ["лучник", "стрелк", "лучниц", "с луками"],
  cavalry: ["конниц", "кавалер", "кавалери", "всадник", "конн", "рыцар", "верхов"],
};

const CONDITION_KEYWORDS: { condition: OrderCondition; stems: string[] }[] = [
  { condition: "until_dawn", stems: ["до рассвет", "до утра", "до зари", "всю ночь"] },
  { condition: "at_all_costs", stems: ["любой ценой", "во что бы то ни стало", "до последнего", "любыми средствами"] },
  { condition: "avoid_losses", stems: ["без потерь", "береги людей", "сохрани людей", "не рискуй людьми"] },
  { condition: "on_my_command", stems: ["по моему приказ", "жди моего приказ", "жди сигнал", "по команде", "по моему сигнал", "жди приказ"] },
  { condition: "quietly", stems: ["тихо", "скрытно", "незаметно", "бесшумно"] },
  { condition: "hold_position", stems: ["не покидай позиц", "держи позиц", "стой на месте"] },
];

const ALL_WORDS = /\bвсе[хмйю]?\b|\bвсю\b|\bвсё\b|\bвесь\b|\bцелик/;

/* ------------------------------------------------------------------ */
/* Text normalisation & number parsing                                 */
/* ------------------------------------------------------------------ */

function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/ё/g, "е")
    .replace(/[.,!?;:()"'«»]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const NUMBER_WORDS: Record<string, number> = {
  ноль: 0, один: 1, одну: 1, одного: 1, два: 2, две: 2, двух: 2, три: 3, трех: 3,
  четыре: 4, четырех: 4, пять: 5, пяти: 5, шесть: 6, семь: 7, восемь: 8, девять: 9,
  десять: 10, двадцать: 20, тридцать: 30, сорок: 40, пятьдесят: 50, полсотни: 50,
  шестьдесят: 60, семьдесят: 70, восемьдесят: 80, девяносто: 90,
  сто: 100, сотня: 100, сотню: 100, двести: 200, триста: 300, четыреста: 400,
  пятьсот: 500, шестьсот: 600, семьсот: 700, восемьсот: 800, девятьсот: 900,
  тысяча: 1000, тысячу: 1000,
};

/** Extract a troop count from normalized text, or null. */
function parseCount(norm: string): number | null {
  const digit = norm.match(/\b(\d{1,5})\b/);
  if (digit) return parseInt(digit[1], 10);

  // "N сотен/сотни" -> N*100
  const hundredMul = norm.match(/(\d+|[а-я]+)\s+сот(?:ен|ни|ня|ню)?/);
  if (hundredMul) {
    const head = hundredMul[1];
    const mul = /\d+/.test(head) ? parseInt(head, 10) : NUMBER_WORDS[head];
    if (mul) return mul * 100;
  }

  // Additive word composition: "сто двадцать" -> 120, "двести" -> 200.
  const tokens = norm.split(" ");
  let sum = 0;
  let matched = false;
  for (const tok of tokens) {
    const v = NUMBER_WORDS[tok];
    if (v != null) {
      sum += v;
      matched = true;
    }
  }
  return matched ? sum : null;
}

/* ------------------------------------------------------------------ */
/* Entity resolution                                                   */
/* ------------------------------------------------------------------ */

function officerKeywords(o: Officer): string[] {
  return o.name
    .toLowerCase()
    .replace(/ё/g, "е")
    .replace(/^(сэр|сер|леди|госпож[аи])\s+/i, "")
    .split(/\s+/)
    .filter((w) => w.length >= 3);
}

function findOfficer(norm: string, officers: Officer[]): Officer | null {
  for (const o of officers) {
    for (const kw of officerKeywords(o)) {
      if (norm.includes(kw)) return o;
    }
  }
  return null;
}

function findLocation(
  norm: string,
  locations: Location[],
  selectedLocationId: string | null,
): Location | null {
  if (HERE_WORDS.some((w) => norm.includes(w)) && selectedLocationId) {
    return locations.find((l) => l.id === selectedLocationId) ?? null;
  }
  let best: { loc: Location; idx: number } | null = null;
  for (const loc of locations) {
    const syns = LOCATION_SYNONYMS[loc.type] ?? [loc.name.toLowerCase()];
    for (const syn of syns) {
      const idx = norm.indexOf(syn);
      if (idx >= 0 && (!best || idx < best.idx)) best = { loc, idx };
    }
  }
  return best?.loc ?? null;
}

function findUnitType(norm: string): UnitType | null {
  for (const type of Object.keys(UNIT_SYNONYMS) as UnitType[]) {
    if (UNIT_SYNONYMS[type].some((s) => norm.includes(s))) return type;
  }
  return null;
}

function findAction(norm: string): OrderAction {
  for (const { action, stems } of ACTION_KEYWORDS) {
    if (stems.some((s) => norm.includes(s))) return action;
  }
  return "UNKNOWN";
}

function findConditions(norm: string): OrderCondition[] {
  const out: OrderCondition[] = [];
  for (const { condition, stems } of CONDITION_KEYWORDS) {
    if (stems.some((s) => norm.includes(s)) && !out.includes(condition)) out.push(condition);
  }
  return out;
}

/* ------------------------------------------------------------------ */
/* Risk & classification helpers                                       */
/* ------------------------------------------------------------------ */

const BASE_RISK: Partial<Record<OrderAction, RiskLevel>> = {
  ATTACK: "high",
  DEFEND: "medium",
  HOLD: "medium",
  AMBUSH: "medium",
  RETREAT: "low",
  EVACUATE: "medium",
  MOVE: "low",
  SCOUT: "low",
  SUPPLY: "low",
  REINFORCE: "medium",
  PROTECT: "low",
  WAIT: "none",
};

function assessRisk(action: OrderAction, conditions: OrderCondition[], target: Location | null): RiskLevel {
  let risk = BASE_RISK[action] ?? "none";
  if (conditions.includes("at_all_costs")) risk = "extreme";
  if (conditions.includes("until_dawn") && (action === "HOLD" || action === "DEFEND")) {
    risk = risk === "extreme" ? "extreme" : "high";
  }
  if (target?.type === "bridge" && (action === "HOLD" || action === "DEFEND")) {
    // Holding the chokepoint is dangerous but doable.
    risk = risk === "low" ? "medium" : risk;
  }
  return risk;
}

const QUESTION_ACTIONS: OrderAction[] = ["ASK_STATUS", "ASK_ADVICE"];
const NO_TARGET_ACTIONS: OrderAction[] = ["ASK_STATUS", "ASK_ADVICE", "WAIT", "SUMMON_OFFICER", "CANCEL_ORDER"];
const TROOP_ACTIONS: OrderAction[] = ["MOVE", "DEFEND", "HOLD", "ATTACK", "AMBUSH", "PROTECT", "REINFORCE", "RETREAT"];
/** Actions where an unspecified count should prompt a clarification. */
const COUNT_REQUIRED_ACTIONS: OrderAction[] = ["MOVE", "REINFORCE"];

function officerPrimaryGroup(officer: Officer, units: UnitGroup[], type: UnitType | null): UnitGroup | null {
  const owned = units.filter((u) => u.commanderId === officer.id && u.count > 0);
  if (type) {
    const typed = owned.find((u) => u.type === type);
    if (typed) return typed;
  }
  return owned[0] ?? null;
}

/* ------------------------------------------------------------------ */
/* Interpreter                                                         */
/* ------------------------------------------------------------------ */

export class LocalCommandInterpreter implements CommandInterpreter {
  parse(text: string, context: InterpreterContext): ParsedCommand {
    const norm = normalize(text);

    // If we are awaiting clarification, try to merge this reply into it first.
    if (context.pending) {
      const merged = this.mergeClarification(text, norm, context);
      if (merged) return merged;
    }

    return this.parseFresh(text, norm, context);
  }

  private parseFresh(rawText: string, norm: string, context: InterpreterContext): ParsedCommand {
    const officerByName = findOfficer(norm, context.officers);
    const officer =
      officerByName ??
      (context.activeOfficerId
        ? context.officers.find((o) => o.id === context.activeOfficerId) ?? null
        : null);

    const action = findAction(norm);
    const target = NO_TARGET_ACTIONS.includes(action)
      ? null
      : findLocation(norm, context.locations, context.selectedLocationId);
    let unitType = findUnitType(norm);
    const takeAll = ALL_WORDS.test(norm);
    let unitCount = parseCount(norm);
    const conditions = findConditions(norm);

    // Resolve unit type / count from the addressed officer's command.
    if (TROOP_ACTIONS.includes(action) && officer) {
      const group = officerPrimaryGroup(officer, context.units, unitType);
      if (!unitType && group) unitType = group.type;
      if (takeAll && group) unitCount = group.count;
      if (unitCount == null && group && !COUNT_REQUIRED_ACTIONS.includes(action)) {
        // Positional/combat orders default to the officer's whole command.
        unitCount = group.count;
      }
    }

    const missing = this.computeMissing(action, officer, target, unitCount, takeAll);
    const risk = assessRisk(action, conditions, target);
    const isQuestion = QUESTION_ACTIONS.includes(action);
    const confidence = this.computeConfidence(action, missing);

    return {
      action,
      officerId: officer?.id ?? null,
      targetLocationId: target?.id ?? null,
      unitType,
      unitCount,
      takeAll,
      conditions,
      confidence,
      missing,
      risk,
      isQuestion,
      rawText,
      summary: this.buildSummary(action, officer, target, unitType, unitCount, conditions, context),
    };
  }

  /** Merge a short follow-up ("двести копейщиков") into a pending order. */
  private mergeClarification(
    rawText: string,
    norm: string,
    context: InterpreterContext,
  ): ParsedCommand | null {
    const pending = context.pending!;
    const base = { ...pending.partial };
    const officer = context.officers.find((o) => o.id === pending.officerId) ?? null;

    let changed = false;
    if (pending.awaiting === "unitCount") {
      const takeAll = ALL_WORDS.test(norm);
      const count = parseCount(norm);
      const type = findUnitType(norm) ?? base.unitType;
      const group = officer ? officerPrimaryGroup(officer, context.units, type) : null;
      if (takeAll && group) {
        base.unitCount = group.count;
        base.takeAll = true;
        changed = true;
      } else if (count != null) {
        base.unitCount = count;
        changed = true;
      }
      if (type) base.unitType = type;
    } else if (pending.awaiting === "target") {
      const target = findLocation(norm, context.locations, context.selectedLocationId);
      if (target) {
        base.targetLocationId = target.id;
        changed = true;
      }
    } else if (pending.awaiting === "officer") {
      const o = findOfficer(norm, context.officers);
      if (o) {
        base.officerId = o.id;
        changed = true;
      }
    }

    if (!changed) return null;

    const target = context.locations.find((l) => l.id === base.targetLocationId) ?? null;
    const missing = this.computeMissing(base.action, officer, target, base.unitCount, base.takeAll);
    return {
      ...base,
      rawText,
      missing,
      confidence: this.computeConfidence(base.action, missing),
      summary: this.buildSummary(base.action, officer, target, base.unitType, base.unitCount, base.conditions, context),
    };
  }

  private computeMissing(
    action: OrderAction,
    officer: Officer | null,
    target: Location | null,
    unitCount: number | null,
    takeAll: boolean,
  ): MissingField[] {
    const missing: MissingField[] = [];
    if (action === "UNKNOWN") missing.push("action");
    if (!officer && action !== "UNKNOWN" && action !== "SUMMON_OFFICER") missing.push("officer");
    if (!target && !NO_TARGET_ACTIONS.includes(action) && action !== "UNKNOWN") missing.push("target");
    if (
      COUNT_REQUIRED_ACTIONS.includes(action) &&
      unitCount == null &&
      !takeAll
    ) {
      missing.push("unitCount");
    }
    return missing;
  }

  private computeConfidence(action: OrderAction, missing: MissingField[]): number {
    if (action === "UNKNOWN") return 0.2;
    let c = 0.9;
    c -= missing.length * 0.2;
    return Math.max(0.25, Math.min(1, c));
  }

  private buildSummary(
    action: OrderAction,
    officer: Officer | null,
    target: Location | null,
    unitType: UnitType | null,
    unitCount: number | null,
    conditions: OrderCondition[],
    _context: InterpreterContext,
  ): string {
    if (action === "UNKNOWN") return "Приказ не распознан.";
    const who = officer ? officer.name : "Офицер";
    const verb: Partial<Record<OrderAction, string>> = {
      MOVE: "выдвигается",
      DEFEND: "занимает оборону",
      HOLD: "удерживает",
      ATTACK: "атакует",
      SCOUT: "разведывает",
      SUPPLY: "везёт снабжение",
      RETREAT: "отступает",
      WAIT: "ожидает",
      AMBUSH: "готовит засаду",
      PROTECT: "защищает",
      EVACUATE: "эвакуирует",
      REINFORCE: "усиливает",
      ASK_STATUS: "докладывает обстановку",
      ASK_ADVICE: "даёт совет",
      CANCEL_ORDER: "отменяет приказ",
      SUMMON_OFFICER: "вызывается",
      PRISONER_DECISION: "решает судьбу пленника",
    };
    const parts: string[] = [who, verb[action] ?? action.toLowerCase()];
    if (target) parts.push(`→ ${target.name}`);
    if (unitCount != null && unitType) {
      const label = { spearmen: "копейщиков", archers: "лучников", cavalry: "всадников" }[unitType];
      parts.push(`(${unitCount} ${label})`);
    }
    if (conditions.includes("until_dawn")) parts.push("до рассвета");
    if (conditions.includes("at_all_costs")) parts.push("любой ценой");
    if (conditions.includes("on_my_command")) parts.push("по сигналу");
    return parts.join(" ");
  }
}

export const localInterpreter = new LocalCommandInterpreter();
