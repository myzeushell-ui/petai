# AI Kingdom — Art Bible

The visual target is **heroic, fictional medieval war** — the feel of a royal
command tent at night: aged parchment, dark wood, steel, red banners, and warm
gold firelight against a deep-blue night. No real-world heraldry, no branding, and
**no copied assets from any other game**. Everything is drawn procedurally in
Canvas / SVG / CSS so the game stays offline- and CSP-safe.

Tags: **[Implemented]** ships today; **[Planned]** is a V2 target.

---

## 1. Direction

- **Heroic fictional medieval.** Invented kingdom (Valemont), invented houses,
  invented commanders. Grounded but romantic — this is a legend being written, not
  a documentary.
- **Warm vs. cold.** The core tension is **warm gold/fire** (hearth, torches,
  loyalty, dawn) against **deep-blue night** (fog, distance, the unknown enemy).
  As the scenario runs toward dawn, the eastern sky warms — mechanics made
  visible. **[Implemented]** in `MapCanvas`.
- **Red banners & steel.** Player forces read green-and-gold; the enemy reads
  deep red. Steel is cool grey. Red is danger, war, and the foe.
- **Hand-painted terrain.** The strategic map is an inked cartographer's war map:
  river, forest hachures, hill contours, drawn roofs and tents, worn roads.
  **[Implemented]** procedurally.
- **Strong silhouettes, readable battlefield.** Clarity beats detail. Sides,
  unit types, and who is winning must be legible at a glance — colour-coded
  coats, distinct shapes for spear/bow/horse, a momentum bar.

---

## 2. Palette

These are the **actual design tokens** in the codebase. Use them as the single
source of truth; do not introduce parallel colours.

### 2.1 UI tokens — `src/styles/global.css` — [Implemented]

**Surfaces (dark wood):**

| Token | Hex |
|---|---|
| `--wood-0` | `#0e0c08` |
| `--wood-1` | `#17130d` |
| `--wood-2` | `#221b12` |
| `--wood-3` | `#2e2417` |
| `--wood-edge` | `#3d3020` |

**Parchment & ink:**

| Token | Hex |
|---|---|
| `--parch-0` | `#efe4c8` |
| `--parch-1` | `#e2d3af` |
| `--parch-2` | `#cbb98e` |
| `--ink` | `#2a2013` |
| `--ink-soft` | `#5a4a30` |

**Metal & accents:**

| Token | Hex |
|---|---|
| `--metal` | `#9a9382` |
| `--metal-dark` | `#6b6455` |
| `--gold` | `#cba24a` |
| `--gold-bright` | `#e6c56b` |
| `--red` | `#b0392c` |
| `--red-bright` | `#d1503f` |
| `--blue` | `#4a8fb0` |
| `--green` | `#6e9a54` |

**Text on dark & status:**

| Token | Hex |
|---|---|
| `--tx-0` | `#ece2cd` |
| `--tx-1` | `#c3b393` |
| `--tx-2` | `#8f8168` |
| `--tx-mut` | `#6a5f4b` |
| `--danger` | `#d1503f` |
| `--warn` | `#d9a441` |
| `--ok` | `#7fae5c` |

Roles: **gold** = command, headings, the crown, the objective. **red** = the
enemy, primary/danger actions, active battle. **green** = player forces, "ok".
**blue** = information/intel and the water. Parchment is reserved for
"documents" — officer speech bubbles, the coach, and the map ground.

### 2.2 Strategic-map palette — `MapCanvas.tsx` `PALETTE` — [Implemented]

| Key | Hex | Use |
|---|---|---|
| `paper0` | `#efe3c4` | parchment light |
| `paper1` | `#e3d0a8` | parchment mid |
| `paper2` | `#d3bd90` | parchment deep |
| `paperEdge` | `#8a6f45` | worn edge |
| `ink` | `#4a3a22` | drawn lines |
| `inkSoft` | `#6b5738` | soft ink |
| `forest` / `forestDark` | `#5c6b3a` / `#3f4a26` | trees |
| `water` / `waterDark` | `#7c93a0` / `#5b7280` | river |
| `hill` | `#9a7f4e` | hachures |
| `road` | `#7a5f38` | tracks |
| `fire` | `#e8a24a` | torch glow |
| `night` | `#1a2740` | night tint |

### 2.3 Tactical-battlefield palette — `BattleScene.tsx` `COL` — [Implemented]

| Key | Hex | Use |
|---|---|---|
| `playerCoat` | `#4d7a3c` | player coats (green) |
| `playerTrim` | `#d8b24a` | player trim / archers (gold) |
| `enemyCoat` | `#8f2f24` | enemy coats (deep red) |
| `enemyTrim` | `#c9b28a` | enemy trim |
| `steel` / `steelDark` | `#c2c6cc` / `#8b9098` | helms, blades, shields |
| `skin` | `#caa079` | faces |
| `shadow` | `rgba(0,0,0,0.28)` | ground shadow |

### 2.4 Typography — [Implemented]

System stacks only (no web fonts):

- Headings `--font-head`: `"Iowan Old Style", "Palatino Linotype", Palatino,
  Georgia, "Times New Roman", serif`.
- Body `--font-body`: `"Inter", system-ui, -apple-system, "Segoe UI", Roboto,
  sans-serif`.

---

## 3. Tactical battlefield style — [Planned direction; V1 ships a first pass]

- **Oblique 2.5D.** A shallow oblique view (not top-down, not full 3D): the front
  line runs vertically down the middle, the player's side on the left, the enemy
  on the right, so charges and volleys cross a readable no-man's-land.
  **[Implemented]** in `BattleScene`.
- **Squads = several visible soldiers.** A unit is drawn as a small formation of
  figures, not one icon, so mass is felt. *(V1 samples a capped number of figures
  from the troop count as a visualisation; V2 makes each figure part of a real
  squad — see ARCHITECTURE.md §2.2.)*
- **Heraldry.** Coats and trim carry each side's colours; officers' procedural
  crests (`Crest.tsx`, a seeded SVG shield with field division + charge) identify
  houses. **[Planned]** to carry crests onto banners on the field itself.
- **Officers visible.** **[Planned].** In V2 the commanding officer should be a
  distinct, readable figure on the battlefield (mounted, bannered), so the human
  you command is present in the fighting — not just a portrait in a panel.
- **Terrain reads the location.** The battlefield restyles to the fight's
  location — bridge (river + stone deck, narrow front), castle (wall +
  crenellations), hills (slope), forest (trees). **[Implemented]**.
- **Readability rules.** Silhouette first; two-colour sides; motion communicates
  state (bob while holding, jab while clashing, gallop on the charge, dust puffs
  on casualties); a single momentum indicator for "who is winning".

---

## 4. Procedural / vector fallback pipeline

The project's rendering philosophy is **procedural-first**, and this remains the
guaranteed baseline for V2.

- **[Implemented].** All art is generated at runtime: parchment grain, age stains,
  vignette and terrain (Canvas, seeded PRNG for stable results); heraldic crests
  and location/unit glyphs (SVG); panels, banners, and effects (CSS). There are
  **no image files** and no external fonts. This keeps the build tiny, offline,
  and CSP-safe, and lets visuals scale to any resolution via `devicePixelRatio`.
- **[Planned].** If hand-authored raster/vector assets are ever introduced (e.g.
  richer terrain tiles or figure sprites), the procedural renderers remain the
  **fallback path**: the game must render fully with zero external assets. Any
  added asset must be self-hosted in-repo and licensed permissively (see
  `ASSET_LICENSES.md`) — never hotlinked, never lifted from another game.

---

## 5. Non-negotiables

1. No assets copied or derived from other games or copyrighted works.
2. No external hosts at runtime (CSP-safe): no CDN scripts, fonts, or images.
3. Procedural rendering is always a complete, shippable path.
4. One palette. New colours come from the tokens above, or are added to them
   deliberately — not invented ad hoc per component.
5. Clarity over detail — the battlefield must stay readable.
