# AI Kingdom — Architecture

This document describes how AI Kingdom is built **today** (the V1 vertical slice)
and the **planned** direction for **V2: Living War**. Every section is tagged so
there is no ambiguity between what ships now and what is a proposal.

- **[Implemented]** — exists in the current codebase and runs.
- **[Planned]** — a V2 design intent, not yet in the code.

The game is a browser-only React 18 + TypeScript (strict) + Vite application. It
has **no backend, no external API, and no runtime dependencies** beyond
`react`/`react-dom`. All graphics are procedural Canvas / SVG / CSS. It runs
fully offline.

---

## 1. Current architecture (V1) — [Implemented]

### 1.1 The core principle: a pure-function engine separated from React

All game logic lives in `src/game/` as **pure functions**. Every engine function
takes a `GameState` and returns a **new** `GameState`; it never mutates in place
and never touches the DOM, React, storage, timers, or the network. The UI, the
voice layer, and the (local) "AI" never change state directly — they call engine
functions and render the result.

```
text / voice → CommandInterpreter.parse → officer decision → DialogueProvider
             → formal Order → simulation executes → new GameState → React renders
```

This separation is what makes the simulation testable in isolation (Vitest, no
DOM) and is the seam every V2 upgrade plugs into.

### 1.2 Module map

```
src/
  game/                      ← simulation (pure TypeScript, no React)
    types.ts                 ← canonical type contract (single source of truth)
    scenario.ts              ← scenario CONFIG: all tunable numbers live here
    commandInterpreter.ts    ← localInterpreter: RU natural-language → ParsedCommand
    dialogue.ts              ← localDialogue: template-pool officer lines
    officers.ts              ← acceptance (obey/warn/refuse), initiative, boldness
    orders.ts                ← order lifecycle, ETA, force resolution, splitGroup
    world.ts                 ← pathfind, movement stepping, supply, food delivery
    battle.ts                ← round-based battle resolution (groupPower)
    events.ts                ← scripted narrative beats + event/log constructors
    memory.ts                ← officer memory events and how they shift traits
    prisoner.ts              ← captured-commander finale resolution
    engine.ts                ← orchestrator: createInitialState, beginPlay,
                               submitCommand, tickGame, actions, end conditions
    persistence.ts           ← localStorage save/load (versioned schema)
    speech.ts                ← Web Speech adapters (SpeechInput/OutputProvider)
    rng.ts, ids.ts, util.ts, constants.ts
  state/GameContext.tsx      ← React binding: tick loop, autosave, voice output
  components/                ← UI layer (panels, map, battle scene, modals)
  styles/global.css, map.css ← design tokens + layout
```

Dependency rule: `components/` and `state/` depend on `game/`; `game/` never
depends on React. `types.ts` is imported everywhere and imports nothing runtime.

### 1.3 The tick loop — [Implemented]

`GameContext.tsx` owns the single `GameState` and drives real time:

- A `requestAnimationFrame` loop accumulates wall-clock time and steps the
  simulation on a fixed ~10 Hz accumulator (`SIM_STEP_MS = 100`) to bound the
  per-frame `structuredClone` cost. Frame `dt` is clamped (max 250 ms) so
  backgrounding the tab cannot dump a huge catch-up step.
- Game time advances at `TIME_SCALE = 1.0` game-minutes per real second at speed
  ×1; speeds are `0 | 1 | 2 | 4`. Phase and speed are read from a ref so a long
  pause never accumulates a giant jump on resume.
- Each call to `engine.tickGame(state, dtMinutes)` sub-steps in chunks of at most
  `STEP_CAP = 3` game-minutes and, per sub-step, runs a fixed pipeline:

  ```
  advanceMovement → runEnemyAI → applySupplyStep → detectBattles
                 → runBattles → collectScriptedEvents → checkEndConditions
  ```

- Battles resolve in rounds every `ROUND_INTERVAL = 6` game-minutes.
- Autosave runs on a fixed 2 s interval reading the state ref; a finished game
  clears its save so it is not offered as "Continue".

### 1.4 GameContext — the React boundary — [Implemented]

`GameProvider` exposes a `GameApi`: lifecycle (`newGame`, `continueGame`,
`quitToMenu`, `beginPlay`), commands (`submit`, `confirmOrder`, `declineOrder`,
`reviseOrder`, `cancelOrder`, `resolveInitiative`, `decidePrisoner`), controls
(`setSpeed`, `selectOfficer`, `selectLocation`, `viewBattle`), and
tutorial/settings/debug helpers. Every method is a thin wrapper that calls an
engine function and stores the returned state. Components consume `useGame()` and
never import the engine.

### 1.5 The swappable interfaces — [Implemented]

Four adapter interfaces are declared in `types.ts`. The engine depends only on
the interface, so any one can be replaced without touching game math:

| Interface | V1 implementation | Contract |
|---|---|---|
| `CommandInterpreter` | `localInterpreter` (`commandInterpreter.ts`) — dictionaries, stemmed keyword matching, number parsing, conversational context | `parse(text, ctx): ParsedCommand` |
| `DialogueProvider` | `localDialogue` (`dialogue.ts`) — weighted template pools, deterministic variation | `officerAcknowledge/Warning/Question/Report/Status/Advice/Initiative(ctx)` |
| `SpeechInputProvider` | `WebSpeechInput` (`speech.ts`) — `SpeechRecognition` | `isSupported`, `start(handlers)`, `stop` |
| `SpeechOutputProvider` | `WebSpeechOutput` (`speech.ts`) — `SpeechSynthesis` | `isSupported`, `speak(text, lang)`, `cancel` |

The interpreter and dialogue providers are **deterministic and fully local** —
there is no LLM anywhere in V1. Voice is optional; if the browser lacks Web
Speech, the UI falls back to text and nothing breaks.

### 1.6 Canvas renderers — [Implemented]

Two renderers draw everything procedurally (no external images, CSP-safe):

- **`MapCanvas.tsx`** — draws the strategic map as a hand-inked parchment war
  map (river, forest hachures, hills, village roofs, roads, night tint, torch
  glow at held positions, fog over un-scouted ground, a dawn warmth that grows
  as the night ends). It has its own deterministic PRNG so terrain is stable
  across redraws, and redraws only when a signature of the relevant inputs
  changes. It reads `Location[]` plus a handful of scalar props.
  `StrategicMap.tsx` layers interactive DOM nodes and unit markers (with
  interpolated positions for moving groups and animated march routes) above it.
- **`BattleScene.tsx`** — an opt-in tactical view ("watch the battle") that
  animates ranks of drawn soldiers, archer volleys, cavalry charges, and
  casualty puffs. It is a **visualisation of the running simulation**: it snapshots
  the `Battle` object's counts, momentum, and status and animates them. It does
  **not** change the outcome — the strategic-map simulation is authoritative.

### 1.7 Persistence — [Implemented]

`persistence.ts` autosaves the whole `GameState` to `localStorage` under a
versioned schema (`SAVE_VERSION = 2`). All parsing is defensive: a corrupt or
outdated save returns `null` rather than throwing, so the app never crashes on
load. There are **no migrations** — an incompatible save is discarded and a fresh
game starts. Settings are stored separately.

### 1.8 Determinism — [Implemented]

Randomness flows through a single seeded `mulberry32` generator (`rng.ts`); the
current generator state lives in `GameState.rngState` and advancing it is the
only entropy source. Ids come from a monotonic `idCounter`. Given the same seed
and the same inputs, a playthrough is reproducible — important for tests and for
save/restore.

---

## 2. V2 direction: Living War — [Planned]

V2 keeps the pure-engine core and the adapter seams, and adds four layers. None
of the following is implemented yet.

### 2.1 A clean rendering boundary — [Planned]

**Today**, renderers read engine state fairly directly (`BattleScene` pulls from
`GameState`/`Battle`; `StrategicMap` derives marker positions from `UnitGroup`
fields). **V2** formalises a one-way boundary:

```
simulation → produces an immutable RenderState (plain data) → renderer reads it
```

The simulation would emit an explicit, view-oriented `RenderState` (positions,
facings, banners, squad rosters, effect events) each frame or on change; the
renderer becomes a pure function of that snapshot and owns no game truth. This
decouples visual richness from simulation rules, lets the battlefield renderer be
swapped or upgraded independently, and keeps determinism intact (the renderer
cannot feed anything back into the sim).

### 2.2 A battlefield squad-simulation layer — [Planned]

**Today**, a battle is a round-based power comparison on the strategic map;
`BattleScene` only *depicts* it with a fixed number of drawn figures. **V2** adds
a real **squad-simulation layer** beneath the tactical view: units decompose into
squads with position, formation, facing, cohesion, and local morale that resolve
melee/ranged/charge interactions over the tactical space, then roll up into the
strategic result. The strategic layer stays authoritative for campaign outcomes;
the squad layer adds legible, emergent battlefield behaviour and produces the
`RenderState` the tactical renderer consumes.

### 2.3 A server-side AI provider gateway — [Planned]

**Today** there is **no server** and **no LLM** — the game runs entirely on the
local deterministic interpreter and dialogue provider. **V2** proposes an
optional **server-side gateway** that implements the existing `CommandInterpreter`
and `DialogueProvider` interfaces by calling an external model. Hard rules:

- **API keys never reach the browser.** All provider calls originate server-side.
- Calls are **event-driven** (an order issued, a crisis, a council beat) — **never
  per simulation tick**.
- Every model response is **schema-validated** against the existing
  `ParsedCommand` / dialogue contracts, with **deterministic local fallback** on
  timeout, malformed output, or provider error.
- With the provider set to `local` (the current default), the gateway is bypassed
  entirely and the game is fully playable offline.

See `AI_PROVIDER_SETUP.md` for the env-var contract.

### 2.4 An officer-agent cognition layer — [Planned]

**Today**, officer behaviour is deterministic trait math (`officers.ts`:
`decideAcceptance`, `evaluateInitiative`, `boldness`) reading `OfficerTraits` and
`memory`. **V2** proposes a richer **cognition layer** where each officer is an
agent with identity, personality, capability, live state, **beliefs** (possibly
wrong, shaped by fog-of-war), **goals**, **doctrine** (how they prefer to fight),
**relationships**, and episodic **memory**. Cognition would sit between the world
and the officer's actions: the officer forms beliefs from what they can perceive,
weighs orders against goals/doctrine, and may propose, hedge, or act on
initiative. It can be driven by the local deterministic model or, when enabled,
routed through the AI gateway — behind the same `DialogueProvider`/decision seams
that already exist, so the simulation contract does not change.

---

## 3. Build, test, and tooling — [Implemented]

- `npm run dev` — Vite dev server.
- `npm run build` — `tsc --noEmit` (strict typecheck) then `vite build`.
- `npm run test` — Vitest suite covering the interpreter and the engine
  (command parsing, order lifecycle, movement, battle math, memory,
  save/restore, and a full briefing → finale playthrough).
- `npm run typecheck` — strict TypeScript, no emit.

Current package version: `0.1.0`. Save schema version: `2`.
