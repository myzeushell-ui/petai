/** Russian display labels and shared display constants. */

import type {
  OrderAction,
  OrderStatus,
  RiskLevel,
  UnitType,
  LocationType,
  UnitState,
  InjuryLevel,
  PermanentInjury,
} from "./types";

export const UNIT_LABELS: Record<UnitType, string> = {
  spearmen: "Копейщики",
  archers: "Лучники",
  cavalry: "Конница",
};

export const UNIT_LABELS_GENITIVE: Record<UnitType, string> = {
  spearmen: "копейщиков",
  archers: "лучников",
  cavalry: "всадников",
};

export const LOCATION_TYPE_LABELS: Record<LocationType, string> = {
  castle: "Замок",
  bridge: "Мост",
  forest: "Лес",
  village: "Деревня",
  hills: "Холмы",
  enemy_camp: "Лагерь врага",
  road: "Дорога",
  field: "Поле",
};

export const ACTION_LABELS: Record<OrderAction, string> = {
  MOVE: "Марш",
  DEFEND: "Оборона",
  ATTACK: "Атака",
  HOLD: "Удержание",
  SCOUT: "Разведка",
  SUPPLY: "Снабжение",
  RETREAT: "Отступление",
  WAIT: "Ожидание",
  AMBUSH: "Засада",
  PROTECT: "Защита",
  EVACUATE: "Эвакуация",
  REINFORCE: "Подкрепление",
  CANCEL_ORDER: "Отмена приказа",
  CHANGE_ORDER: "Изменение приказа",
  ASK_STATUS: "Запрос доклада",
  ASK_ADVICE: "Запрос совета",
  SUMMON_OFFICER: "Вызов офицера",
  PRISONER_DECISION: "Судьба пленника",
  UNKNOWN: "Неясный приказ",
};

export const STATUS_LABELS: Record<OrderStatus, string> = {
  draft: "черновик",
  awaiting_confirmation: "ждёт подтверждения",
  accepted: "принят",
  preparing: "подготовка",
  moving: "движение",
  executing: "исполняется",
  completed: "выполнен",
  failed: "провален",
  cancelled: "отменён",
  disobeyed: "не исполнен",
  interrupted: "прерван",
};

export const RISK_LABELS: Record<RiskLevel, string> = {
  none: "нет",
  low: "низкий",
  medium: "умеренный",
  high: "высокий",
  extreme: "смертельный",
};

export const UNIT_STATE_LABELS: Record<UnitState, string> = {
  idle: "в резерве",
  preparing: "готовится",
  moving: "на марше",
  holding: "удерживает",
  fighting: "в бою",
  retreating: "отступает",
  routed: "разбит",
  destroyed: "уничтожен",
};

export const INJURY_LABELS: Record<InjuryLevel, string> = {
  none: "здоров",
  light: "лёгкое ранение",
  heavy: "тяжёлое ранение",
  dead: "погиб",
};

export const PERMANENT_INJURY_LABELS: Record<PermanentInjury, string> = {
  none: "",
  eye: "потерял глаз",
  arm: "повреждена рука",
  limp: "хромает",
};

export const RISK_ORDER: RiskLevel[] = ["none", "low", "medium", "high", "extreme"];

/** Actions that are safe information requests — never need confirmation. */
export const QUESTION_ACTIONS: OrderAction[] = ["ASK_STATUS", "ASK_ADVICE"];

/** Actions that carry real danger and always require confirmation. */
export const DANGEROUS_ACTIONS: OrderAction[] = [
  "ATTACK",
  "DEFEND",
  "HOLD",
  "AMBUSH",
  "RETREAT",
  "EVACUATE",
];
