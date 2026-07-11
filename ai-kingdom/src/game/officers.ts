/**
 * Officer behaviour — how personality turns into decisions.
 *
 * Traits are not decorative: acceptance (obey / warn / refuse) and battlefield
 * initiative both read from loyalty, caution, courage, ambition, discipline,
 * initiative and the officer's memory of the player. The engine consumes these
 * decisions; dialogue text is produced separately by the dialogue system.
 */

import type {
  AcceptanceOutcome,
  GameState,
  Officer,
  Order,
  UnitGroup,
} from "./types";

export interface AcceptanceDecision {
  outcome: AcceptanceOutcome;
  /** Internal, for the journal / debugging. */
  reason: string;
  /** True when the officer flags the order as likely to be very costly. */
  suicidal: boolean;
}

function assignedGroups(order: Order, state: GameState): UnitGroup[] {
  return state.units.filter((u) => order.unitGroupIds.includes(u.id));
}

function hasRecentIgnoredWarning(officer: Officer): boolean {
  return officer.memory.slice(-4).some((m) => m.type === "PLAYER_IGNORED_MY_WARNING");
}

/**
 * Decide how an officer responds to a freshly issued (dangerous) order.
 * Safe information requests always accept.
 */
export function decideAcceptance(officer: Officer, order: Order, state: GameState): AcceptanceDecision {
  if (order.parsed.isQuestion || order.action === "ASK_STATUS" || order.action === "ASK_ADVICE") {
    return { outcome: "accept", reason: "information_request", suicidal: false };
  }

  const groups = assignedGroups(order, state);
  const troopCount = groups.reduce((s, g) => s + g.count, 0) || order.unitCount || 0;
  const avgMorale = groups.length
    ? groups.reduce((s, g) => s + g.morale, 0) / groups.length
    : 60;

  const atAllCosts = order.conditions.includes("at_all_costs");
  const extreme = order.risk === "extreme";
  const high = order.risk === "high" || extreme;

  const target = state.locations.find((l) => l.id === order.targetLocationId);
  const holdingChoke =
    (order.action === "HOLD" || order.action === "DEFEND") && target?.effects.chokePoint === true;

  // Is the order likely to get the command wiped out?
  const insufficient = holdingChoke ? troopCount < 160 : troopCount < 90;
  const lowMorale = avgMorale < 42;
  const suicidal = extreme || (high && insufficient) || (atAllCosts && insufficient);

  // A resentful, disloyal officer may refuse an outright suicidal order.
  if (
    suicidal &&
    officer.traits.loyalty < 42 &&
    officer.traits.resentment > 62 &&
    officer.traits.courage < 80
  ) {
    return { outcome: "refuse", reason: "refuses_suicidal_order", suicidal: true };
  }

  // Cautious, experienced officers warn before dangerous orders.
  const cautiousEnough = officer.traits.caution >= 52;
  const dangerFlag = high && (insufficient || lowMorale || atAllCosts);
  if (cautiousEnough && dangerFlag && officer.traits.courage < 92) {
    const reason = insufficient
      ? "too_few_troops"
      : lowMorale
        ? "morale_broken"
        : "order_is_costly";
    return { outcome: "warn", reason, suicidal };
  }

  // If the player has ignored this officer before, even a bold order gets a note.
  if (dangerFlag && hasRecentIgnoredWarning(officer) && officer.traits.resentment > 40) {
    return { outcome: "warn", reason: "warned_you_before", suicidal };
  }

  return { outcome: "accept", reason: "order_accepted", suicidal };
}

/* ------------------------------------------------------------------ */
/* Initiative                                                          */
/* ------------------------------------------------------------------ */

export interface InitiativeOpportunity {
  type: "flank";
  battleId: string;
  /** Short window — no time to ask, the officer must decide himself. */
  urgent: boolean;
}

export interface InitiativeDecision {
  wants: boolean;
  /** True = act without asking; false = request permission first. */
  actNow: boolean;
  reason: string;
}

/** Combined boldness score from initiative + ambition (0..100). */
export function boldness(officer: Officer): number {
  return officer.traits.initiative * 0.55 + officer.traits.ambition * 0.45;
}

/** Does the officer have a ready, uncommitted mounted force to strike with? */
export function hasReadyStrikeForce(officer: Officer, state: GameState): UnitGroup | null {
  return (
    state.units.find(
      (u) =>
        u.commanderId === officer.id &&
        u.count > 0 &&
        u.type === "cavalry" &&
        (u.state === "idle" || u.state === "holding" || u.state === "preparing"),
    ) ?? null
  );
}

/**
 * Evaluate whether an officer seizes a battlefield opportunity. Bold officers
 * want to; whether they ask first or act alone depends on urgency and how bold
 * (and how trusted) they are.
 */
export function evaluateInitiative(
  officer: Officer,
  state: GameState,
  opportunity: InitiativeOpportunity,
): InitiativeDecision {
  if (!officer.alive) return { wants: false, actNow: false, reason: "unavailable" };
  const force = hasReadyStrikeForce(officer, state);
  if (!force) return { wants: false, actNow: false, reason: "no_force" };

  const b = boldness(officer);
  const wants = b >= 58 && officer.traits.discipline < 85;
  if (!wants) return { wants: false, actNow: false, reason: "not_bold_enough" };

  // Acts without orders only when there's genuinely no time and he's very bold.
  const trusted = officer.traits.respectForPlayer > 70;
  const actNow = opportunity.urgent && (b >= 80 || (b >= 70 && trusted));
  const reason = actNow
    ? "saw_opening_no_time_high_initiative"
    : "saw_opening_requests_permission";
  return { wants: true, actNow, reason };
}

/** Human-readable relationship label for the officer panel. */
export function relationshipLabel(officer: Officer): string {
  const respect = officer.traits.respectForPlayer;
  const resent = officer.traits.resentment;
  if (resent > 60) return "Обижен";
  if (respect > 75 && officer.traits.loyalty > 75) return "Предан";
  if (respect > 60) return "Уважает";
  if (respect < 35) return "Сомневается";
  return "Нейтрален";
}
