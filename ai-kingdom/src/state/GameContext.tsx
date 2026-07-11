/**
 * React binding for the pure engine.
 *
 * Holds the single GameState, runs the real-time tick loop (rAF → game
 * minutes), autosaves to localStorage, speaks officer lines when voice output
 * is on, and exposes every player action as a thin wrapper over an engine
 * function. Components never touch the engine directly.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { GameState, GameSpeed, PrisonerDecision } from "../game/types";
import * as engine from "../game/engine";
import { loadGame, saveGame, clearSave, hasSave, loadSettings, saveSettings } from "../game/persistence";
import { speechOutput } from "../game/speech";

/** Game minutes elapsed per real second at speed x1. */
const TIME_SCALE = 1.0;
const AUTOSAVE_MS = 2000;

export interface GameApi {
  state: GameState | null;
  hasSavedGame: boolean;
  // lifecycle
  newGame: () => void;
  continueGame: () => void;
  quitToMenu: () => void;
  resetSave: () => void;
  beginPlay: () => void;
  // commands
  submit: (text: string) => void;
  confirmOrder: (orderId: string) => void;
  declineOrder: (orderId: string) => void;
  cancelOrder: (orderId: string) => void;
  resolveInitiative: (officerId: string, approve: boolean) => void;
  decidePrisoner: (decision: PrisonerDecision) => void;
  // controls
  setSpeed: (speed: GameSpeed) => void;
  selectOfficer: (officerId: string | null) => void;
  selectLocation: (locationId: string | null) => void;
  // tutorial / settings
  advanceTutorial: () => void;
  skipTutorial: () => void;
  updateSettings: (patch: Partial<GameState["settings"]>) => void;
  dismissEvents: () => void;
  // debug
  debug: {
    addTroops: (officerId: string, amount: number) => void;
    setMorale: (value: number) => void;
    revealEnemy: () => void;
    addTime: (minutes: number) => void;
    forceVictory: () => void;
  };
}

const Ctx = createContext<GameApi | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<GameState | null>(null);
  const [hasSavedGame, setHasSavedGame] = useState<boolean>(() => hasSave());
  const stateRef = useRef<GameState | null>(null);
  stateRef.current = state;

  /* ---- real-time tick loop ---- */
  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    const loop = (now: number) => {
      const dtMs = now - last;
      last = now;
      setState((prev) => {
        if (!prev || prev.phase !== "playing" || prev.speed === 0) return prev;
        const gameDt = (dtMs / 1000) * prev.speed * TIME_SCALE;
        if (gameDt <= 0) return prev;
        return engine.tickGame(prev, gameDt);
      });
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  /* ---- autosave ---- */
  useEffect(() => {
    if (!state) return;
    if (state.phase === "menu") return;
    const t = setTimeout(() => {
      saveGame({ ...state, lastUpdated: Date.now() });
      setHasSavedGame(true);
    }, AUTOSAVE_MS);
    return () => clearTimeout(t);
  }, [state]);

  /* ---- voice output: speak the newest officer/narrator line ---- */
  const lastSpokenId = useRef<string | null>(null);
  useEffect(() => {
    if (!state || !state.settings.voiceOutput) return;
    const spoken = ["report", "advice", "order", "question", "briefing"];
    for (let i = state.dialogue.length - 1; i >= 0; i--) {
      const m = state.dialogue[i];
      if (m.speaker === "player") continue;
      if (spoken.includes(m.kind)) {
        if (lastSpokenId.current !== m.id) {
          lastSpokenId.current = m.id;
          speechOutput.speak(m.text, state.settings.speechLang);
        }
        break;
      }
    }
  }, [state]);

  /* ---- action wrappers ---- */
  const wrap = useCallback((fn: (s: GameState) => GameState) => {
    setState((prev) => (prev ? fn(prev) : prev));
  }, []);

  const newGame = useCallback(() => {
    const saved = loadSettings();
    let s = engine.createInitialState();
    if (saved) s = engine.updateSettings(s, saved);
    setState(s);
    lastSpokenId.current = null;
  }, []);

  const continueGame = useCallback(() => {
    const loaded = loadGame();
    if (loaded) {
      setState(loaded);
      lastSpokenId.current = null;
    } else {
      newGame();
    }
  }, [newGame]);

  const quitToMenu = useCallback(() => {
    if (stateRef.current) saveGame({ ...stateRef.current, lastUpdated: Date.now() });
    setHasSavedGame(hasSave());
    setState(null);
    speechOutput.cancel();
  }, []);

  const resetSave = useCallback(() => {
    clearSave();
    setHasSavedGame(false);
    setState(null);
    speechOutput.cancel();
  }, []);

  const api = useMemo<GameApi>(
    () => ({
      state,
      hasSavedGame,
      newGame,
      continueGame,
      quitToMenu,
      resetSave,
      beginPlay: () => wrap(engine.beginPlay),
      submit: (text) => wrap((s) => engine.submitCommand(s, text)),
      confirmOrder: (id) => wrap((s) => engine.confirmOrder(s, id)),
      declineOrder: (id) => wrap((s) => engine.declineOrder(s, id)),
      cancelOrder: (id) => wrap((s) => engine.cancelOrder(s, id)),
      resolveInitiative: (id, approve) => wrap((s) => engine.resolveInitiative(s, id, approve)),
      decidePrisoner: (d) => wrap((s) => engine.decidePrisoner(s, d)),
      setSpeed: (speed) => wrap((s) => engine.setSpeed(s, speed)),
      selectOfficer: (id) => wrap((s) => engine.selectOfficer(s, id)),
      selectLocation: (id) => wrap((s) => engine.selectLocation(s, id)),
      advanceTutorial: () => wrap(engine.advanceTutorial),
      skipTutorial: () => wrap(engine.skipTutorial),
      updateSettings: (patch) => {
        wrap((s) => {
          const next = engine.updateSettings(s, patch);
          saveSettings(next.settings);
          return next;
        });
      },
      dismissEvents: () => wrap(engine.markEventsHandled),
      debug: {
        addTroops: (officerId, amount) => wrap((s) => engine.debug.addTroops(s, officerId, amount)),
        setMorale: (value) => wrap((s) => engine.debug.setMorale(s, value)),
        revealEnemy: () => wrap(engine.debug.revealEnemy),
        addTime: (minutes) => wrap((s) => engine.debug.addTime(s, minutes)),
        forceVictory: () => wrap(engine.debug.forceVictory),
      },
    }),
    [state, hasSavedGame, newGame, continueGame, quitToMenu, resetSave, wrap],
  );

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}

export function useGame(): GameApi {
  const api = useContext(Ctx);
  if (!api) throw new Error("useGame must be used within GameProvider");
  return api;
}
