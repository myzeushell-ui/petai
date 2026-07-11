/**
 * Officer memory system.
 *
 * Every important thing the player does creates a MemoryEvent that shifts an
 * officer's loyalty / respect / resentment and is remembered for future
 * dialogue. No LLM or vector search — just a bounded list of weighted events.
 */

import type { MemoryEvent, MemoryEventType, Officer } from "./types";
import { clampStat } from "./util";
import { makeId } from "./ids";

interface MemoryTemplate {
  description: string;
  emotionalWeight: number;
  loyaltyDelta: number;
  respectDelta: number;
  resentmentDelta: number;
}

/** Default emotional impact for each memory type. */
export const MEMORY_TEMPLATES: Record<MemoryEventType, MemoryTemplate> = {
  PLAYER_TRUSTED_ME_WITH_IMPORTANT_COMMAND: {
    description: "Правитель доверил мне важное задание.",
    emotionalWeight: 0.6,
    loyaltyDelta: 4,
    respectDelta: 6,
    resentmentDelta: -2,
  },
  PLAYER_IGNORED_MY_WARNING: {
    description: "Я предупреждал — правитель не послушал.",
    emotionalWeight: 0.8,
    loyaltyDelta: -3,
    respectDelta: -8,
    resentmentDelta: 12,
  },
  PLAYER_SAVED_MY_SOLDIERS: {
    description: "Правитель спас моих людей.",
    emotionalWeight: 0.85,
    loyaltyDelta: 8,
    respectDelta: 10,
    resentmentDelta: -8,
  },
  PLAYER_ORDERED_SUICIDAL_DEFENSE: {
    description: "Мне приказали держаться до последнего вопреки здравому смыслу.",
    emotionalWeight: 1.0,
    loyaltyDelta: -6,
    respectDelta: -12,
    resentmentDelta: 18,
  },
  PLAYER_GAVE_GLORY_TO_RIVAL: {
    description: "Славу отдали другому.",
    emotionalWeight: 0.7,
    loyaltyDelta: -2,
    respectDelta: -4,
    resentmentDelta: 14,
  },
  PLAYER_REWARDED_ME: {
    description: "Правитель отметил мои заслуги.",
    emotionalWeight: 0.6,
    loyaltyDelta: 6,
    respectDelta: 6,
    resentmentDelta: -6,
  },
  PLAYER_BLAMED_ME_UNFAIRLY: {
    description: "Меня обвинили несправедливо.",
    emotionalWeight: 0.9,
    loyaltyDelta: -8,
    respectDelta: -6,
    resentmentDelta: 20,
  },
  PLAYER_SPARED_ENEMY_COMMANDER: {
    description: "Правитель пощадил вражеского командира.",
    emotionalWeight: 0.65,
    loyaltyDelta: 0,
    respectDelta: 2,
    resentmentDelta: 2,
  },
  PLAYER_EXECUTED_PRISONER: {
    description: "Правитель казнил пленника.",
    emotionalWeight: 0.7,
    loyaltyDelta: 0,
    respectDelta: 3,
    resentmentDelta: 4,
  },
  PLAYER_RECRUITED_ENEMY_COMMANDER: {
    description: "Вчерашний враг теперь среди нас.",
    emotionalWeight: 0.6,
    loyaltyDelta: -1,
    respectDelta: 4,
    resentmentDelta: 6,
  },
  PLAYER_IMPRISONED_COMMANDER: {
    description: "Пленного командира бросили в темницу.",
    emotionalWeight: 0.4,
    loyaltyDelta: 1,
    respectDelta: 2,
    resentmentDelta: 0,
  },
  I_WON_MAJOR_BATTLE: {
    description: "Я выиграл важный бой.",
    emotionalWeight: 0.9,
    loyaltyDelta: 5,
    respectDelta: 8,
    resentmentDelta: -6,
  },
  I_LOST_MANY_SOLDIERS: {
    description: "Я потерял многих людей.",
    emotionalWeight: 0.85,
    loyaltyDelta: -2,
    respectDelta: -2,
    resentmentDelta: 6,
  },
  I_DISOBEYED_ORDER: {
    description: "Я не выполнил приказ.",
    emotionalWeight: 0.8,
    loyaltyDelta: -3,
    respectDelta: 0,
    resentmentDelta: 4,
  },
  PLAYER_FORGAVE_DISOBEDIENCE: {
    description: "Правитель простил моё неповиновение.",
    emotionalWeight: 0.75,
    loyaltyDelta: 7,
    respectDelta: 8,
    resentmentDelta: -12,
  },
  PLAYER_LISTENED_TO_ME: {
    description: "Правитель прислушался к моему совету.",
    emotionalWeight: 0.5,
    loyaltyDelta: 3,
    respectDelta: 5,
    resentmentDelta: -4,
  },
  PLAYER_TRUSTED_MY_INITIATIVE: {
    description: "Правитель доверился моему решению.",
    emotionalWeight: 0.6,
    loyaltyDelta: 4,
    respectDelta: 7,
    resentmentDelta: -5,
  },
};

/** How many memories an officer keeps. Older ones fade out. */
export const MEMORY_LIMIT = 8;

export interface CreatedMemory {
  event: MemoryEvent;
  nextCounter: number;
}

export function createMemoryEvent(
  type: MemoryEventType,
  tick: number,
  idCounter: number,
  opts: {
    relatedOfficerId?: string | null;
    relatedOrderId?: string | null;
    description?: string;
    weightScale?: number;
  } = {},
): CreatedMemory {
  const template = MEMORY_TEMPLATES[type];
  const { id, next } = makeId("mem", idCounter);
  const scale = opts.weightScale ?? 1;
  return {
    event: {
      id,
      type,
      tick,
      description: opts.description ?? template.description,
      emotionalWeight: template.emotionalWeight,
      loyaltyDelta: template.loyaltyDelta * scale,
      respectDelta: template.respectDelta * scale,
      resentmentDelta: template.resentmentDelta * scale,
      relatedOfficerId: opts.relatedOfficerId ?? null,
      relatedOrderId: opts.relatedOrderId ?? null,
    },
    nextCounter: next,
  };
}

/**
 * Returns a new officer with the memory appended (list bounded to MEMORY_LIMIT)
 * and traits shifted by the event's deltas. Pure — does not mutate input.
 */
export function applyMemoryToOfficer(officer: Officer, event: MemoryEvent): Officer {
  const memory = [...officer.memory, event].slice(-MEMORY_LIMIT);
  return {
    ...officer,
    memory,
    traits: {
      ...officer.traits,
      loyalty: clampStat(officer.traits.loyalty + event.loyaltyDelta),
      respectForPlayer: clampStat(officer.traits.respectForPlayer + event.respectDelta),
      resentment: clampStat(officer.traits.resentment + event.resentmentDelta),
    },
  };
}

/** The most emotionally significant recent memory, or null. */
export function dominantMemory(officer: Officer): MemoryEvent | null {
  if (officer.memory.length === 0) return null;
  const recent = officer.memory.slice(-4);
  return recent.reduce((best, m) =>
    m.emotionalWeight >= best.emotionalWeight ? m : best,
  );
}
