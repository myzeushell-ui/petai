# AI Kingdom — Asset Licenses

## V3 status: one bundled image pack (see registry below)

As of the **V3 Candy Integration sprint**, AI Kingdom bundles the
**AI Kingdom V3 Art Pack 01** — 24 images (6 character portraits, 6 strategic
army tokens, and 12 landmark/building/prop pieces) supplied with the project.
They are optimized (WebP with alpha for landmarks/tokens, JPEG for portraits;
downscaled from ~1254 px originals to a ~1.9 MB web set) and stored in
`src/assets/v3/`, loaded through Vite's asset pipeline (`AssetRegistry`) so the
normal build hashes them and the single-file artifact inlines them as data URIs.
**No asset is hotlinked**; the game stays offline/CSP-safe, and every renderer
keeps a **procedural fallback** if an image fails to load.

The pack owner must confirm the pack is cleared for redistribution in this repo
and the built artifact; record the exact source/license in the registry table
below. **Everything else remains procedurally generated at runtime:**

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

| Asset | Source | License | URL |
|---|---|---|---|
| `src/assets/v3/**` — AI Kingdom V3 Art Pack 01 (24 images: 6 portraits, 6 army tokens, 12 landmarks/props) + `asset-manifest.json` | Supplied with the project by the pack owner (`AI_Kingdom_ArtPack_PART_1..3`) | **To be confirmed by the pack owner** — record the exact license here before public release | provided directly (not hotlinked) |

> ⚠️ The license cell above must be filled in by the project owner. The images
> were delivered as a project art pack; confirm redistribution rights before any
> public/commercial release.

<!--
Example row for when an asset is added:
| terrain/grass_tile.png | OpenGameArt user "Foo" | CC0 | https://opengameart.org/... |
-->

### Attribution notes

_None required at this time._ When a CC-BY (or similar) asset is added, record the
required credit line here alongside its registry row.
