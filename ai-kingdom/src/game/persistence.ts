/**
 * Persistence layer — autosave to localStorage with a versioned schema.
 *
 * All parsing is defensive: a corrupt or outdated save never throws or crashes
 * the app, it simply returns null so the caller can start fresh.
 */

import type { GameState, GameSettings } from "./types";

export const SAVE_VERSION = 3;
export const SAVE_KEY = "ai-kingdom:save";
export const SETTINGS_KEY = "ai-kingdom:settings";

export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

function defaultStorage(): StorageLike | null {
  try {
    if (typeof localStorage !== "undefined") return localStorage;
  } catch {
    // Access can throw in sandboxed/private contexts.
  }
  return null;
}

export function saveGame(state: GameState, storage: StorageLike | null = defaultStorage()): void {
  if (!storage) return;
  try {
    const payload = JSON.stringify({ ...state, version: SAVE_VERSION });
    storage.setItem(SAVE_KEY, payload);
  } catch {
    // Quota errors or serialization issues are non-fatal for gameplay.
  }
}

export function hasSave(storage: StorageLike | null = defaultStorage()): boolean {
  if (!storage) return false;
  try {
    return storage.getItem(SAVE_KEY) != null;
  } catch {
    return false;
  }
}

export function loadGame(storage: StorageLike | null = defaultStorage()): GameState | null {
  if (!storage) return null;
  let raw: string | null;
  try {
    raw = storage.getItem(SAVE_KEY);
  } catch {
    return null;
  }
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<GameState>;
    if (!isValidSave(parsed)) return null;
    if (parsed.version !== SAVE_VERSION) {
      // No migrations yet — discard incompatible saves rather than crash.
      return null;
    }
    return parsed as GameState;
  } catch {
    return null;
  }
}

function isValidSave(data: unknown): data is GameState {
  if (typeof data !== "object" || data === null) return false;
  const d = data as Record<string, unknown>;
  return (
    typeof d.version === "number" &&
    typeof d.tick === "number" &&
    Array.isArray(d.officers) &&
    Array.isArray(d.units) &&
    Array.isArray(d.locations) &&
    typeof d.resources === "object" &&
    typeof d.phase === "string"
  );
}

export function clearSave(storage: StorageLike | null = defaultStorage()): void {
  if (!storage) return;
  try {
    storage.removeItem(SAVE_KEY);
  } catch {
    // ignore
  }
}

export function saveSettings(
  settings: GameSettings,
  storage: StorageLike | null = defaultStorage(),
): void {
  if (!storage) return;
  try {
    storage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch {
    // ignore
  }
}

export function loadSettings(storage: StorageLike | null = defaultStorage()): GameSettings | null {
  if (!storage) return null;
  try {
    const raw = storage.getItem(SETTINGS_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<GameSettings>;
    if (typeof parsed !== "object" || parsed === null) return null;
    return {
      voiceInput: Boolean(parsed.voiceInput),
      voiceOutput: Boolean(parsed.voiceOutput),
      speechLang: typeof parsed.speechLang === "string" ? parsed.speechLang : "ru-RU",
    };
  } catch {
    return null;
  }
}
