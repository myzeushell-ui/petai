# Changelog

All notable changes to AI Kingdom are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project aims to
follow [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased] — V2: Living War (in progress)

Direction and design for the V2 upgrade. **These items are planned, not yet
implemented.** See `ARCHITECTURE.md`, `GAME_DESIGN_V2.md`, `ART_BIBLE.md`,
`AI_PROVIDER_SETUP.md`, and `ASSET_LICENSES.md` for detail.

### Planned

- **Clean rendering boundary** — the simulation emits an immutable, view-oriented
  `RenderState`; renderers become pure functions of that snapshot and hold no game
  truth.
- **Battlefield squad-simulation layer** — units decompose into squads with
  position, formation, facing, and cohesion that resolve on the tactical field and
  roll up into the authoritative strategic result. (V1 ships the tactical view as
  a *visualisation* only.)
- **Server-side AI provider gateway** — optional `CommandInterpreter` /
  `DialogueProvider` backed by an external model, with API keys kept server-side,
  event-driven calls (never per tick), JSON-schema validation, and deterministic
  local fallback. Default stays `local`.
- **Officer-agent cognition layer** — officers gain beliefs (fog-of-war bounded),
  goals, doctrine, and richer relationships, layered above today's deterministic
  trait math.
- **Six-phase scenario arc** — War Council, Preparation, Enemy Probes, Main
  Assault, Crisis, Aftermath.
- **Three presentation spaces** — War Room, Strategic Map, Tactical Battlefield.
- **Layered enemy command** — strategic + tactical + squad behaviour with its own
  fallible read of the battlefield.
- **Campaign shell** — persist officers, wounds, memory, and relationships across
  scenarios.
- **Officers visible on the battlefield** and heraldic banners on the field.

---

## [0.1.0] — V1 vertical slice

The first playable release: one complete, self-contained scenario — **"The Night
Before the Siege"** (Kingdom of Valemont) — a 10–20 minute game from troop
allocation to the finale. Browser-only React 18 + TypeScript (strict) + Vite;
no backend, no external assets, fully offline and deterministic.

### Added

- **Strategic map** — hand-inked parchment war map (Canvas) with locations, roads,
  night lighting, fog-of-war over un-scouted ground, torch glow at held positions,
  and a dawn warmth that grows as the night ends; interactive DOM nodes and unit
  markers layered above.
- **Natural-language orders** — a local, deterministic Russian command interpreter
  (dictionaries, stemmed keyword matching, number parsing, conversational context)
  turning speech/text into structured `ParsedCommand`s; supports MOVE, HOLD/DEFEND,
  ATTACK, SCOUT, AMBUSH, SUPPLY, EVACUATE, RETREAT, PROTECT/REINFORCE, WAIT, and
  info/meta actions, with conditions (until dawn, at all costs, quietly, …).
- **Three officers with traits & memory** — Sir Edward Vale (infantry, stoic),
  Sir Roland Ashford (cavalry, brash), and Mara Velt (scout/supply advisor,
  analytic); each with 0–100 personality traits, a procedural heraldic crest, and
  persistent episodic memory of the player's decisions.
- **Order lifecycle** — draft → confirmation → accepted/preparing/moving/executing
  → completed/failed/cancelled/interrupted, with officer acceptance decisions
  (obey / warn / refuse), dangerous-order confirmation, revise, and change/cancel.
- **World simulation** — pathfinding and visible troop movement, unit splitting,
  supply and food drain, morale and fatigue, terrain effects (defence bonus, choke
  point, archer/cavalry modifiers, cover, vision).
- **Scenario enemy AI** — scripted approach from camp to castle, a cavalry raid on
  the village, contact-halts-and-fights behaviour, and post-battle advance.
- **Battle** — round-based resolution mixing troop counts, unit type, terrain,
  commander competence, morale, fatigue, supply, and flanking into a power
  comparison with proportional casualties and a momentum track.
- **Officer initiative** — a bold officer can spot an open flank and either request
  permission or, if very bold and there is no time, charge on his own; the player's
  response is remembered.
- **Prisoner finale** — on victory the enemy commander is captured; the player
  chooses to execute, imprison, release, or recruit, with officer reactions and
  outcome consequences.
- **Tutorial** — a step-based in-game coach.
- **Save** — versioned localStorage autosave with defensive, crash-proof loading
  (incompatible saves are discarded rather than migrated).
- **Tactical battle scene** — an opt-in oblique 2.5D Canvas view visualising the
  running battle: ranks of drawn soldiers, archer volleys, cavalry charges, and
  casualty puffs (visualisation only — it does not change the outcome).
- **Drawn war map** — procedural cartographic terrain (river, forest, hills,
  village, roads) as a stable, seeded Canvas layer.
- **Smart advisor** — the advisor answers situation, enemy, time, supply, losses,
  positions, and orders questions, and never dead-ends on unrecognised input.
- **Visible movement** — interpolated marker positions and flowing march-route
  lines so troop movement is legible even while paused or at low speed.
- **Voice (optional)** — Web Speech API input and output, with full text fallback
  when unsupported.

[Unreleased]: https://github.com/myzeushell-ui/petai/tree/dev/ai-kingdom
[0.1.0]: https://github.com/myzeushell-ui/petai/tree/dev/ai-kingdom
