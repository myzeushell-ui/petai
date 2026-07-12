# AI Kingdom — Asset Licenses

## Current status: no third-party assets

As of the V1 vertical slice **and** the in-progress V2 work, AI Kingdom uses
**no external assets**. Every graphic is generated procedurally at runtime:

- **Terrain, maps, and the tactical battlefield** — drawn in Canvas 2D
  (`MapCanvas.tsx`, `BattleScene.tsx`), including procedural parchment, age
  stains, trees, hills, roads, water, soldiers, horses, arrows, and effects.
- **Heraldic crests, location icons, and unit glyphs** — inline SVG
  (`Crest.tsx`, `icons.tsx`), generated deterministically from seeds.
- **Panels, banners, meters, and animations** — pure CSS (`global.css`,
  `map.css`).
- **Fonts** — **system font stacks only** (Iowan Old Style / Palatino / Georgia
  for headings; Inter / system-ui for body). No web fonts are downloaded or
  bundled.
- **Audio** — none bundled. Voice input/output, when enabled, uses the browser's
  built-in Web Speech API (`SpeechRecognition` / `SpeechSynthesis`); no audio
  files ship with the game.

Because there are **no images, fonts, audio, or data files from third parties**,
there are **no third-party licenses to record yet**. The application has no
runtime dependency on any external host (CSP-safe, fully offline).

Runtime code dependencies are limited to `react` and `react-dom` (MIT), with
build/test tooling (`vite`, `typescript`, `vitest`, `@vitejs/plugin-react`, and
React type packages) as dev dependencies; those are software libraries, not game
assets, and are governed by their own package licenses.

---

## Rule for adding assets (V2 and beyond)

If any external asset is ever introduced, it **must**:

1. Be **CC0** or a **permissive license** (e.g. CC-BY with attribution recorded
   here, MIT, OFL for fonts). No non-commercial-only, no unknown-license, and
   **nothing copied or derived from another game** or other copyrighted work.
2. Be **downloaded into the repository** and self-hosted. **Never hotlink** an
   external URL at runtime (it breaks offline play and the CSP guarantee, and the
   source can vanish or change).
3. Be **recorded in the table below** before or in the same change that adds it —
   asset, source, license, and the original URL — plus any attribution the
   license requires.
4. Preserve the **procedural fallback**: the game must still render fully with
   zero external assets (see `ART_BIBLE.md` §4).

---

## Third-party asset registry

_None yet — the table is a template for future additions._

| Asset | Source | License | URL |
|---|---|---|---|
| _(none)_ | — | — | — |

<!--
Example row for when an asset is added:
| terrain/grass_tile.png | OpenGameArt user "Foo" | CC0 | https://opengameart.org/... |
-->

### Attribution notes

_None required at this time._ When a CC-BY (or similar) asset is added, record the
required credit line here alongside its registry row.
