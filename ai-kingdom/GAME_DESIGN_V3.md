# AI Kingdom — Game Design V3: The Living Realm

This document sets the V3 direction and tracks what is actually built versus
planned. It supersedes `GAME_DESIGN_V2.md` as the forward-looking design note;
V2 remains accurate for the living-battlefield work it describes.

> Status legend: **[In game]** playable now · **[Building]** in progress ·
> **[Planned]** designed, not yet built.

---

## 1. Vision

A single-player medieval **command strategy** where the young ruler of **Valedorn**
governs through **officers**, giving natural-language orders (text or voice) and
watching a **living realm** respond. You command people who command units. The
war is atmospheric and legible; the officers feel like people; the enemy thinks;
the consequences are remembered.

The V3 north star is a **modern, beautiful 2D world** — a living strategic map and
squad-level battles — wrapped around the personality-and-consequence core the
prototype already proves out.

---

## 2. Pillars

1. **Rule through people.** Officers, not unit micro. Their beliefs, traits, memory
   and relationships decide whether an order is obeyed, questioned, or seized upon.
2. **A world that lives.** The map breathes — day into dawn, weather, marching
   columns, fires, the village, the river. Battles are legible formations, not
   number-swaps.
3. **A thinking enemy.** Cassian Rake reads your dispositions and adapts, fairly.
4. **Consequences that stick.** Losses, promises, mercy, and cruelty are remembered
   by officers, the people, and the chronicle.
5. **Swappable intelligence.** Local heuristics ship by default; every language and
   dialogue seam can be swapped for a real AI provider behind a server-side gateway,
   with no keys in the browser.

---

## 3. The Council (V3 roster) — **[In game]**

Five officers now sit at the table (was three). See `CHARACTER_BIBLE.md` for full
profiles and voices.

| Officer | Role | Voice | Commands |
|---------|------|-------|----------|
| Sir Edward Vale | Infantry / defence | stoic | spearmen |
| Sir Roland Ashford | Cavalry / attack | brash | horse |
| Mara Velt | Scouting / supply / intel | analytic | light scouts |
| **Alaric Thorn** *(new)* | Archers / siege prep | gruff | bowmen |
| **Lady Elyne Arden** *(new)* | Court / people / levy | courtly | village militia |

**World & antagonist — [In game]:** Kingdom of **Valedorn**; border fortress
**Dawn's Edge (Рассветный Предел)**; village **Quiet Ford**. The invasion is led by
**Duke Corvin Morvane**, his vanguard commanded by **Cassian Rake** — the foe you
fight and, if victorious, the prisoner whose fate you decide.

---

## 4. What ships today

- Strategic map (drawn cartographic canvas): fortress, river, bridge, forest, hills,
  village, roads, night lighting, fog of war, visible troop movement. **[In game]**
- Continuous time with active pause (×1/×2/×4), auto-pause on key events. **[In game]**
- Russian natural-language order parsing (local, no LLM): synonyms, number words,
  conditions, spatial context, clarifying questions, order revision. **[In game]**
- Five officers with numeric traits, memory, acceptance (obey/warn/refuse) and
  battlefield initiative; five distinct speech voices. **[In game]**
- Order lifecycle, pathfinding, movement, supply/food, village evacuation. **[In game]**
- Scenario enemy AI (scripted approach, bridge stall, cavalry raid, ambush reaction),
  strength hidden until scouted. **[In game]**
- Battle resolver + **living positional battlefield** scene (formations deploy,
  advance, volley, charge, clash, take casualties synced to sim, rout). **[In game]**
- Resources, outcomes (decisive→pyrrhic / defeats), prisoner finale, tutorial,
  autosave, settings, smart local advisor (no dead-ends). **[In game]**

---

## 5. Roadmap (priority order)

- **P0 — Audit & checkpoint.** Stable baseline, typecheck/tests/build green,
  baseline screenshots. **[In game]**
- **P1 — Rendering foundation & living strategic map.** PixiJS (or an equivalent
  performant 2D layer); animated water, banners, campfires, weather, day→dawn;
  marching columns; asset pipeline with recorded licenses. **[Planned]**
- **P2 — Squad simulation & tactical battlefield.** Squad-level micro as the battle
  source of truth; richer formations and morale. Living battlefield scene exists as
  a visual layer today; making it the resolver is the P2 goal. **[Planned]**
- **P3 — War council & officer cognition.** Council scene + portraits; beliefs
  (officers don't know everything), goals/doctrine, relationships, remembered
  promises, explainable disobedience and autonomy. Roster + voices done; cognition
  model **[Planned]**.
- **P4 — Adaptive enemy, intelligence & events.** Rake plans against scouted player
  dispositions (no cheating); fog/intel reports; a dynamic Event Director. **[Planned]**
- **P5 — Resources, village & civilians.** Elyne's civil layer: levy, treasury,
  evacuation choices, civilian morale, richer scenario phases. **[Planned]**
- **P6 — AI gateway & structured intelligence.** Server-side provider gateway
  (local/anthropic/openai/ollama), structured order parsing + dialogue behind the
  existing adapter seams, chronicle generation. Keys never reach the browser. **[Planned]**
- **P7 — Atmosphere & meta.** Audio (ambience/horns/clash/arrows/score), portraits
  with emotion, aftermath, reputation, campaign shell. **[Planned]**
- **P8 — Polish.** Tests, performance, docs, final screenshots. **[Ongoing]**

---

## 6. Architecture guarantees (unchanged in V3)

- Pure simulation in `src/game/` is the single source of truth; UI, voice, and AI
  never mutate state directly — they call engine functions that return new state.
- Determinism: seeded RNG, deterministic ids; no `Math.random`/`Date.now` in pure
  logic.
- Swappable seams: `CommandInterpreter`, `DialogueProvider`, `SpeechInput/Output`
  Provider — local implementations ship; providers slot in without touching gameplay.
- All content is data-driven from `scenario.ts`; adding officers/locations/enemies
  requires no engine changes (and the parser recognises new officer names for free).

---

## 7. New in this increment

The V3 world & council foundation: renamed the realm to **Valedorn**, the fortress to
**Dawn's Edge**, and the foe to **Cassian Rake** (invading for **Duke Corvin
Morvane**); added officers **Alaric Thorn** and **Lady Elyne Arden** with two new
speech voices (`gruff`, `courtly`) wired through every dialogue and prisoner path;
rebalanced forces for a five-officer council against a stronger vanguard. Added
`CHARACTER_BIBLE.md` and this document. Full parser + world regression tests
(32 passing).
