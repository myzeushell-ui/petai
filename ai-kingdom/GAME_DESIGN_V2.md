# AI Kingdom — Game Design (V2: Living War)

AI Kingdom is a single-player medieval **command** strategy. You do not move
units with the mouse; you command **people** — officers who command troops — by
giving orders in natural language (voice or text). Officers interpret, accept,
warn, refuse, act on initiative, and **remember**.

This document describes the **V2: Living War** design. It is layered on top of the
shipped V1 vertical slice. Everything is tagged:

- **[Implemented]** — present in the current build.
- **[Planned]** — a V2 target, not yet built.

The V1 scenario is **"The Night Before the Siege"** (Kingdom of Valemont): defend
the castle until dawn against Lord Cassius Morn, with the **Stone Bridge**
chokepoint as the key to the defence and a prisoner's fate as the finale.

---

## 1. The V2 six-phase scenario — [Planned]

V2 reshapes a battle into a six-phase dramatic arc. Each phase changes what
information you have, what the enemy does, and what your officers worry about.
(V1 already implements a compressed version of phases 2–6: preparation while
paused, a scripted enemy advance and village raid, the main clash at the bridge,
initiative crises, and a prisoner finale. The named six-phase structure below is
the V2 formalisation.)

1. **War Council** — [Planned]. Before the clock runs, meet your officers, hear
   the intelligence picture, argue over doctrine, and set intent. Establishes
   relationships and the plan you will be judged against.
2. **Preparation** — [Planned]. Time is paused/slow. Position troops, scout, move
   supply, evacuate the village, set ambushes. *(V1 lets you plan while paused
   before releasing time — the seed of this phase.)*
3. **Enemy Probes** — [Planned]. The enemy tests your line — feints, raids, a
   detachment toward the village — to reveal your dispositions before committing.
   *(V1's scripted cavalry raid on the village is a probe.)*
4. **Main Assault** — [Planned]. The enemy commits its main force along its
   approach route to the objective; the decisive fighting happens here.
   *(V1 implements the scripted approach and the bridge/castle battles.)*
5. **Crisis** — [Planned]. A turning point: a line breaks, an officer requests a
   risky flank, morale wavers, supply runs short. Demands a hard call under
   pressure. *(V1's flank-initiative request and suicidal-order refusals are
   crises.)*
6. **Aftermath** — [Planned]. Resolution and consequence: the outcome tier, the
   prisoner's fate, wounded officers, and how the night is remembered. *(V1 ships
   the outcome report and the prisoner finale.)*

---

## 2. The three presentation spaces — [Planned]

V2 presents the same authoritative simulation through three linked spaces:

- **War Room** — [Planned]. The council/command space: officers, dialogue,
  orders, intent-setting, relationships. *(V1's officer panel + conversation
  panel + order-confirm flow are the working core of this.)*
- **Strategic Map** — [Implemented]. The hand-inked parchment war map: locations,
  roads, fog-of-war, unit markers with morale, animated march routes, torch glow,
  and the growing dawn. This is where the simulation is authoritative today.
- **Tactical Battlefield** — [Implemented as a visualisation; Planned as a
  simulation]. An oblique 2.5D battlefield where a battle can be watched: ranks of
  drawn soldiers, archer volleys, cavalry charges, casualties. In V1 it *depicts*
  the round-based strategic battle and cannot change its outcome. In V2 it becomes
  a real squad-simulation layer (see ARCHITECTURE.md §2.2).

---

## 3. The officer agent model

Officers are the heart of the game. Each is defined by these facets:

| Facet | V1 status | Notes |
|---|---|---|
| **Identity** | [Implemented] | `id`, name, title, role, procedural heraldic crest (from `crestSeed`), accent colour, bio. |
| **Personality** | [Implemented] | `OfficerTraits`, all 0–100: loyalty, courage, caution, ambition, discipline, initiative, competence, respectForPlayer, resentment. `speechStyle`: `stoic` / `brash` / `analytic`. |
| **Capability** | [Implemented] | `competence` trait + `competencies` list; feeds battle math and advice. |
| **State** | [Implemented] | Live `stress`, `fatigue`, `injury` (none/light/heavy/dead), `permanentInjury` (eye/arm/limp), `alive`, current location, commanded units, current task. |
| **Beliefs** | [Planned] | A private, possibly-wrong world model shaped by fog-of-war. *(V1 officers read true state directly.)* |
| **Goals** | [Planned] | Explicit objectives (hold the bridge, prove myself, keep my men alive) an officer weighs orders against. |
| **Doctrine** | [Planned] | Preferred way of fighting (defensive attrition vs. bold shock) that colours proposals and initiative. *(V1 approximates this via traits + speech style.)* |
| **Relationships** | [Implemented, basic] | Relationship-to-player label from respect/resentment/loyalty; rivalry between officers is [Planned] as a first-class model. |
| **Memory** | [Implemented] | Episodic `MemoryEvent[]` persisted with the save; events carry loyalty/respect/resentment deltas and a dominant-mood summary. |

**V1 roster (implemented):** Sir Edward Vale (infantry, stoic, cautious veteran),
Sir Roland Ashford (cavalry, brash, ambitious — the initiative/flank engine), and
Mara Velt (scouting & supply advisor, analytic — the default advisor for
situation questions).

**Decision-making — [Implemented].** `decideAcceptance` returns obey / warn /
refuse from order risk, troop sufficiency, morale, conditions ("at all costs"),
and the officer's traits and memory (a resentful officer who was overruled before
pushes back harder). `evaluateInitiative` decides whether a bold officer seizes a
battlefield opening and whether he asks first or acts alone. **V2** moves these
into the richer cognition layer (beliefs → goals/doctrine → action) while keeping
the same decision seams.

---

## 4. Enemy AI layers

- **[Implemented] — Scenario-scripted tactical AI.** The enemy breaks camp after
  a short delay, pathfinds its main column to the castle, splits off a cavalry
  raid toward the village if it is still worth raiding, resolves that raid if the
  village is undefended, halts to give battle on contact instead of walking past,
  and — on winning an engagement — resumes its advance to the objective. It is
  scripted and not adaptive.
- **[Planned] — Layered enemy command.** V2 proposes distinct layers: a
  strategic commander (objective selection, feints vs. commitment across the six
  phases), tactical sub-commanders (per-engagement decisions), and reactive squad
  behaviour on the tactical field. The enemy would form its own (fallible) read of
  your dispositions through the same fog-of-war rules, enabling probes,
  concentration of force, and exploitation of a broken flank.

---

## 5. Information & fog-of-war

- **[Implemented].** Enemy strength is hidden (`trueStrength`) until scouting
  raises `intelLevel`; the player sees an `estimatedStrength` that sharpens with
  intel. Enemy groups carry a `revealed` flag — surfaced by scouting near them or
  once intel is high, and always on contact. The map draws an eastern fog veil
  that lifts as intel grows. Terrain grants vision (hills, castle) or conceals
  troops (forest ambush).
- **[Planned].** Fog-of-war becomes the substrate for officer **beliefs**: what an
  officer knows is bounded by what they can perceive, so officers (and the enemy)
  can act on stale or wrong information, and scouting becomes a genuine
  intelligence economy rather than a single reveal.

---

## 6. Emergent events

- **[Implemented].** Scripted narrative beats (torches on the road, the sky
  lightening) plus **emergent** world events from the simulation: battles joined,
  positions lost, the village raided, officers wounded or killed, starvation
  warnings, and an officer's on-the-spot flank request. Pause-worthy events stop
  the clock so the player can react.
- **[Planned].** A broader emergent-event system driven by the cognition and
  enemy-command layers: officer disputes, morale cascades, opportunistic enemy
  exploits, and consequence chains that differ run to run.

---

## 7. Replayability

- **[Implemented].** Seeded determinism plus branching choices (who holds the
  bridge, whether to scout, whether to evacuate, whether to grant a flank, the
  four-way prisoner decision) already yield materially different outcomes and
  outcome tiers (decisive / tactical / costly / pyrrhic victory, or defeat by
  castle lost / army broken). Officers carry memory of your choices.
- **[Planned].** Replayability deepens with variable enemy plans, officer beliefs
  and goals that shift the "correct" answer between runs, and multiple scenarios.

---

## 8. Campaign shell — [Planned]

V1 is a **single self-contained scenario** (one night, one battle). V2 proposes a
**campaign shell** that strings scenarios together: officers, their wounds, their
memories, and their relationships **persist between battles**, so the human cost
and the loyalties you built (or spent) carry forward. The scenario config format
(`scenario.ts`) is already data-driven and authored to make additional scenarios
possible without engine changes; the campaign layer that sequences them is not yet
built.

---

## 9. What is authoritative

In both V1 and V2, the **strategic simulation is the source of truth** for
campaign outcomes. The tactical battlefield visualises (V1) or simulates and rolls
up into (V2) that truth — it never silently overrides it. This keeps results
legible, reproducible, and fair.
