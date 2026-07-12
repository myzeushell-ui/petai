/**
 * Campaign persistence — carries a chapter's consequences into the next.
 *
 * A finished chapter is summarized (outcome, chronicle, hero, surviving
 * officers + relationships, village fate, prisoner's fate, reputation) and
 * stored so a future Chapter II can read what the ruler wrought. Pure and
 * storage-injectable for tests.
 */

import type { GameState } from "./types";
import type { StorageLike } from "./persistence";

export interface OfficerCarry {
  id: string;
  name: string;
  alive: boolean;
  loyalty: number;
  respect: number;
  resentment: number;
}

export interface CampaignChapterResult {
  chapter: number;
  outcomeKind: string;
  chronicle: string | null;
  heroOfficerId: string | null;
  reputation: number;
  officers: OfficerCarry[];
  villageState: string;
  castleIntegrity: number;
  prisonerFate: string | null;
}

export interface CampaignSave {
  version: 1;
  chapters: CampaignChapterResult[];
  reputation: number;
}

export const CAMPAIGN_KEY = "ai-kingdom:campaign";

function villageWord(s: GameState): string {
  if (s.flags.villageRaided) return "разграблена";
  if (s.village.evacuationProgress >= 0.8 || s.flags.villageEvacuated) return "спасена";
  if (s.village.damage > 50) return "разорена";
  return "цела";
}

/** Summarize a finished chapter from the terminal game state. */
export function summarizeChapter(s: GameState, chapter = 1): CampaignChapterResult {
  return {
    chapter,
    outcomeKind: s.outcome.kind,
    chronicle: s.aftermath?.chronicleChoice ?? null,
    heroOfficerId: s.aftermath?.heroOfficerId ?? null,
    reputation: s.aftermath?.reputation ?? 0,
    officers: s.officers.map((o) => ({
      id: o.id,
      name: o.name,
      alive: o.alive,
      loyalty: Math.round(o.traits.loyalty),
      respect: Math.round(o.traits.respectForPlayer),
      resentment: Math.round(o.traits.resentment),
    })),
    villageState: villageWord(s),
    castleIntegrity: Math.round(s.resources.castleIntegrity),
    prisonerFate: s.prisoner?.decision ?? null,
  };
}

function storage(explicit?: StorageLike): StorageLike | null {
  if (explicit) return explicit;
  try {
    return typeof localStorage !== "undefined" ? localStorage : null;
  } catch {
    return null;
  }
}

/** Persist a chapter result, appending to any existing campaign. */
export function saveChapter(s: GameState, explicit?: StorageLike, chapter = 1): CampaignSave {
  const store = storage(explicit);
  const prev = loadCampaign(explicit);
  const result = summarizeChapter(s, chapter);
  const chapters = [...(prev?.chapters ?? []).filter((c) => c.chapter !== chapter), result].sort(
    (a, b) => a.chapter - b.chapter,
  );
  const save: CampaignSave = {
    version: 1,
    chapters,
    reputation: (prev?.reputation ?? 0) + result.reputation,
  };
  try {
    store?.setItem(CAMPAIGN_KEY, JSON.stringify(save));
  } catch {
    /* ignore quota / private-mode errors */
  }
  return save;
}

export function loadCampaign(explicit?: StorageLike): CampaignSave | null {
  const store = storage(explicit);
  if (!store) return null;
  try {
    const raw = store.getItem(CAMPAIGN_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CampaignSave;
    if (parsed.version !== 1) return null;
    return parsed;
  } catch {
    return null;
  }
}

export interface ChapterMeta {
  chapter: number;
  title: string;
  subtitle: string;
}

export const CHAPTERS: ChapterMeta[] = [
  { chapter: 1, title: "Ночь перед осадой", subtitle: "Оборона Рассветного Предела" },
  { chapter: 2, title: "Разбитая клятва", subtitle: "Цена вчерашних решений" },
  { chapter: 3, title: "Совет волков", subtitle: "Интриги знати Валедорна" },
  { chapter: 4, title: "Пепельная корона", subtitle: "Последняя война герцога" },
];
