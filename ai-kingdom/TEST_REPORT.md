# AI Kingdom — Test Report (V3 Candy Integration Sprint)

Snapshot of automated checks and the manual screenshot review for the V3
art-integration sprint. Re-run with `npm run typecheck`, `npm run test`,
`npm run build`.

## Automated

| Check | Command | Result |
|-------|---------|--------|
| Types | `tsc --noEmit` (strict) | ✅ 0 errors |
| Unit tests | `vitest run` | ✅ **43 / 43** passing (3 files) |
| Production build | `vite build` | ✅ passes (~114 KB gzip JS + 1.9 MB art) |
| Single-file build | `vite build --config vite.single.config.ts` | ✅ passes (self-contained artifact) |

### Test coverage added this sprint (`src/game/__tests__/v3systems.test.ts`)
- **AssetRegistry** — 22 assets with metadata; 6 portraits + 6 strategic units.
- **Portraits** — every officer + Cassian maps to an asset; mood derivation.
- **Enemy planner** — forces stay hidden until scouted; player forces hiding in
  the forest are *not* leaked to the enemy; three dispositions yield distinct
  plans (fortified bridge steers off a mass assault; an evacuated village makes
  the supply-cut score fall below the flank).
- **Council → civilian layer** — "stand" mobilizes militia into Elyne's levy;
  "full evacuation" lifts morale and starts the wagons; the enemy commits a plan.
- **Crisis director** — archers engaged → ARROWS_LOW; a fallback crisis always exists.
- **Aftermath** — verdicts + hero shift officer memory and reputation; resolves.
- **Campaign** — chapter result round-trips through storage.

Existing suites (interpreter, engine, world, battle, memory, persistence, full
playthrough) remain green; the playthrough now drives through the aftermath phase.

## Manual screenshot review (Chromium via Playwright)

Full loop driven end-to-end — **menu → briefing → war council → living map →
orders → bridge assault + crisis → aftermath → prisoner → end → campaign** —
with **no console errors** at any step.

| Scene | Verified |
|-------|----------|
| Main menu | Cinematic fortress backdrop + council portrait strip |
| War council | Five portraits, live conflict (backer approves / rival objects), decisions |
| Living map | Recognizable castle / bridge+river / forest / hills / village+mill / tower / enemy camp; depth-sorted; no white boxes on alpha PNGs |
| Army tokens | Faction-ringed strategic PNGs with count + morale; unscouted enemy shown as fog "?" |
| Phase + civilian | Live phase chip (Подготовка → Разведка боем → Штурм → Кризис); rolling supply wagons on evacuation |
| Battle | Bridge chokepoint assault with battle glow + combat log; adaptive enemy diverts a raid to the village |
| Aftermath | Outcome, stat tiles, per-officer verdicts + hero, chronicle |
| Campaign | Four chapters (I done, II–IV locked), carried officers + consequences |

### Issues found and fixed during review
- Stacked army tokens overlapped their count plates at the castle → spiral spread.
- Main-menu fortress backdrop was near-black → brightened + repositioned + lighter grade.

### Known limitations
- The tactical BattleScene (V2 living battlefield) remains a visualization layer
  over the round-based resolver — the resolver is still the source of truth.
- Portrait emotion states are expressed via color grading over one neutral
  portrait per character (painted variants are a future drop).
- One scenario / one campaign chapter is playable; II–IV are shells.
