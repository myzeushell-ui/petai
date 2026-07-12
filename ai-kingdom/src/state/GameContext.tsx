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
import type {
  GameState,
  GameSpeed,
  PrisonerDecision,
  CouncilDecisions,
  OfficerVerdict,
} from "../game/types";
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
  enterCouncil: () => void;
  resolveCouncil: (decisions: CouncilDecisions) => void;
  // aftermath / campaign
  setAftermathVerdict: (officerId: string, verdict: OfficerVerdict) => void;
  nameHero: (officerId: string | null) => void;
  concludeAftermath: (chronicleChoice: string) => void;
  // commands
  submit: (text: string) => void;
  confirmOrder: (orderId: string) => void;
  declineOrder: (orderId: string) => void;
  reviseOrder: (orderId: string) => void;
  clearRevision: () => void;
  cancelOrder: (orderId: string) => void;
  resolveInitiative: (officerId: string, approve: boolean) => void;
  decidePrisoner: (decision: PrisonerDecision) => void;
  // controls
  setSpeed: (speed: GameSpeed) => void;
  selectOfficer: (officerId: string | null) => void;
  selectLocation: (locationId: string | null) => void;
  viewBattle: (battleId: string | null) => void;
  // tutorial / settings
  advanceTutorial: () => void;
  skipTutorial: () => void;
  updateSettings: (patch: Partial<GameState["settings"]>) => void;
  dismissEvents: (eventId?: string) => void;
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

  /* ---- real-time tick loop ----
     Runs the simulation on a fixed ~10 Hz accumulator (not every frame) to
     bound the per-frame structuredClone cost, and clamps dt so backgrounding
     the tab can't dump a huge catch-up step. Reads phase/speed from a ref so a
     long pause never accumulates a giant jump on resume. */
  const SIM_STEP_MS = 100;
  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    let acc = 0;
    const loop = (now: number) => {
      const dtMs = Math.min(now - last, 250);
      last = now;
      const st = stateRef.current;
      const running = !!st && st.phase === "playing" && st.speed !== 0;
      if (!running) {
        acc = 0;
      } else {
        acc += dtMs;
        if (acc >= SIM_STEP_MS) {
          const chunk = acc;
          acc = 0;
          setState((prev) => {
            if (!prev || prev.phase !== "playing" || prev.speed === 0) return prev;
            const gameDt = (chunk / 1000) * prev.speed * TIME_SCALE;
            return gameDt > 0 ? engine.tickGame(prev, gameDt) : prev;
          });
        }
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  /* ---- autosave ----
     Fixed interval reading the ref, so it fires even while state churns every
     frame during active play (a per-state debounce would be reset every frame
     and never fire). A finished game clears its save so it isn't offered as
     "Continue". */
  useEffect(() => {
    const id = setInterval(() => {
      const st = stateRef.current;
      if (!st || st.phase === "menu") return;
      if (st.phase === "ended") {
        clearSave();
        setHasSavedGame(false);
        return;
      }
      saveGame({ ...st, lastUpdated: Date.now() });
    }, AUTOSAVE_MS);
    return () => clearInterval(id);
  }, []);

  /* ---- voice output: speak every not-yet-spoken officer/narrator line, in
     order. When voice is off we keep the marker at the latest line so enabling
     it later doesn't replay the backlog. */
  const lastSpokenId = useRef<string | null>(null);
  useEffect(() => {
    if (!state) return;
    const msgs = state.dialogue;
    if (!state.settings.voiceOutput) {
      lastSpokenId.current = msgs.length ? msgs[msgs.length - 1].id : null;
      return;
    }
    const spokenKinds = ["report", "advice", "order", "question", "briefing"];
    let startIdx = 0;
    if (lastSpokenId.current) {
      const li = msgs.findIndex((m) => m.id === lastSpokenId.current);
      if (li < 0) {
        // Marker scrolled out of the capped buffer — resync without replaying.
        lastSpokenId.current = msgs.length ? msgs[msgs.length - 1].id : null;
        return;
      }
      startIdx = li + 1;
    }
    for (let i = startIdx; i < msgs.length; i++) {
      const m = msgs[i];
      if (m.speaker === "player") continue;
      if (spokenKinds.includes(m.kind)) {
        speechOutput.speak(m.text, state.settings.speechLang);
        lastSpokenId.current = m.id;
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
      enterCouncil: () => wrap(engine.enterCouncil),
      resolveCouncil: (d) => wrap((s) => engine.resolveCouncil(s, d)),
      setAftermathVerdict: (id, v) => wrap((s) => engine.setAftermathVerdict(s, id, v)),
      nameHero: (id) => wrap((s) => engine.nameHero(s, id)),
      concludeAftermath: (c) => wrap((s) => engine.concludeAftermath(s, c)),
      submit: (text) => wrap((s) => engine.submitCommand(s, text)),
      confirmOrder: (id) => wrap((s) => engine.confirmOrder(s, id)),
      declineOrder: (id) => wrap((s) => engine.declineOrder(s, id)),
      reviseOrder: (id) => wrap((s) => engine.reviseOrder(s, id)),
      clearRevision: () => wrap(engine.clearRevision),
      cancelOrder: (id) => wrap((s) => engine.cancelOrder(s, id)),
      resolveInitiative: (id, approve) => wrap((s) => engine.resolveInitiative(s, id, approve)),
      decidePrisoner: (d) => wrap((s) => engine.decidePrisoner(s, d)),
      setSpeed: (speed) => wrap((s) => engine.setSpeed(s, speed)),
      selectOfficer: (id) => wrap((s) => engine.selectOfficer(s, id)),
      selectLocation: (id) => wrap((s) => engine.selectLocation(s, id)),
      viewBattle: (id) => wrap((s) => engine.viewBattle(s, id)),
      advanceTutorial: () => wrap(engine.advanceTutorial),
      skipTutorial: () => wrap(engine.skipTutorial),
      updateSettings: (patch) => {
        wrap((s) => {
          const next = engine.updateSettings(s, patch);
          saveSettings(next.settings);
          return next;
        });
      },
      dismissEvents: (eventId) =>
        wrap((s) => (eventId ? engine.markEventHandled(s, eventId) : engine.markEventsHandled(s))),
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
