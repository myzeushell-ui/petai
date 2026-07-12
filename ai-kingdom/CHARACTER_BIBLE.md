# AI Kingdom — Character Bible (V3: The Living Realm)

The canonical reference for the world, its people, and their voices. Names and
lore live in `src/game/scenario.ts`; this document explains the intent behind
them so writing, portraits, and dialogue stay consistent as V3 grows.

> Status legend: **[In game]** implemented and playable · **[Planned]** designed,
> not yet built.

---

## 1. The World — Kingdom of Valedorn (Королевство Валедорн)

A small, hard-bitten border kingdom on the eastern march. Its wealth is grain,
stone, and the loyalty of plain people. The realm has known peace just long
enough for its young ruler — **you** — to be untested when the first real war
arrives.

- **Валедорн (Valedorn)** — the kingdom. Frontier, agrarian, proud.
- **Рассветный Предел (Dawn's Edge)** — the border fortress that "first meets the
  sun, and will first meet the enemy." The seat of this scenario and the object
  the player must not lose. **[In game]** (`castle` location).
- **Деревня Тихий Брод (Quiet Ford)** — the village below the fortress: granary,
  peasants, and the moral heart of the march. Can be raided or evacuated.
  **[In game]**
- **Каменный мост (The Stone Bridge)** — the only crossing of the river; a choke
  where a handful can hold an army. **[In game]**
- Northern Forest, Eastern Hills, the East Road, and the enemy camp complete the
  theatre. **[In game]**

### The Invasion
**Герцог Корвин Морвейн (Duke Corvin Morvane)** covets the eastern march. He does
not ride himself — he sends his vanguard under a cold professional to take Dawn's
Edge before the young ruler can find their feet. The banners are black-and-crimson.

---

## 2. Your Council — the Officers

You do not command soldiers directly. You command **officers**, each with a
personality that genuinely shapes whether they obey, warn, refuse, or act on
their own. Traits are numeric (0–100): loyalty, courage, caution, ambition,
discipline, initiative, competence, stress, respect, resentment, fatigue.

### Sir Edward Vale — Сэр Эдвард Вейл  **[In game]**
- **Role:** Infantry & defence. Commands the spearmen.
- **Voice:** `stoic` — measured, plain-spoken, hates pointless losses.
- **Core:** Thirty years' service, veteran of three sieges, never surrendered one
  without orders. Loyal, disciplined, cautious. The anchor of the line.
- **Traits:** high loyalty/discipline/caution, low ambition. Will *warn* before a
  costly order and hold to the end if overruled.

### Sir Roland Ashford — Сэр Роланд Эшфорд  **[In game]**
- **Role:** Cavalry & attack. Commands the horse.
- **Voice:** `brash` — eager, boastful, hungry for glory.
- **Core:** A noble house's younger son with something to prove. Bold to the point
  of recklessness; the officer most likely to seize a flank on his own initiative.
- **Traits:** very high courage/ambition/initiative, low caution/discipline. May
  ask — or simply *act* — when he sees an opening.

### Mara Velt — Мара Вельт  **[In game]**
- **Role:** Scouting, intelligence & supply. Leads a light skirmisher/scout screen.
- **Voice:** `analytic` — calm, pragmatic, speaks in odds and timetables.
- **Core:** Raised among caravans; knows the price of a cart of grain and an hour
  before battle. The realm's default adviser — she answers the ruler's questions.
- **Traits:** high competence/caution, steady loyalty. Values preparation over
  daring.

### Alaric Thorn — Аларик Торн  **[In game — new in V3]**
- **Role:** Master of archers & siege preparation. Commands the bowmen.
- **Voice:** `gruff` — blunt, dry soldier's humour, talks of ranges, arrows, walls.
- **Core:** A commoner risen from the levy who built Dawn's Edge's stakes and
  hoardings with his own hands and knows every yard of an arrow's flight. Chases
  no glory; wants full quivers and solid walls.
- **Traits:** very high competence, high discipline, low ambition. Steady, unshowy,
  reliable on the wall.
- **Design intent:** gives the player a dedicated missile/engineering lever and a
  grounded, working-class counterpoint to the noble officers.

### Lady Elyne Arden — Леди Элин Арден  **[In game — new in V3]**
- **Role:** Court, treasury, the common folk & the levy. Commands the village militia.
- **Voice:** `courtly` — polished, measured, speaks for the people and the court.
- **Core:** Daughter of the old Arden line; she holds the court and the granaries.
  Her word raises the militia and opens the stores — but binds the ruler in
  promises. Shrewd, diplomatic, quietly ambitious, protective of commoners.
- **Traits:** high caution/competence, moderate ambition, lower courage. The civil
  axis of the council: morale, evacuation, supply, politics.
- **Design intent:** opens the V3 civilian/resource layer and creates political
  tension (the ruler's choices have a witness who remembers).

---

## 3. The Enemy

### Cassian Rake — Кассиан Рейк  **[In game]**
- **Role:** Field commander of Duke Morvane's vanguard; the antagonist you face and,
  if you win, the prisoner whose fate you decide.
- **Character:** Cold, competent, unsentimental. A professional, not a fanatic —
  which is exactly what makes him dangerous, and what makes recruiting or releasing
  him a real gamble.
- **[Planned]** Adaptive command: Rake should read the player's dispositions and
  adjust — probe the bridge, feint the village, mass where you are thin — without
  cheating on hidden information.

### Duke Corvin Morvane — Герцог Корвин Морвейн  **[In game as lore]**
- The invader whose ambition sets the scenario in motion. Off-screen in the vertical
  slice; the campaign frame (**[Planned]**) makes him the throughline antagonist.

---

## 4. Voice Guide (speech styles)

Each officer's `speechStyle` selects the pool their lines are drawn from
(acknowledge / warn / question / report / status / advice / initiative / prisoner).
Keep new lines short, in-character, and free of anachronism.

| Style | Officer | Register | Reaches for |
|-------|---------|----------|-------------|
| `stoic` | Edward | grave, plain | duty, the line, holding |
| `brash` | Roland | eager, cocky | glory, speed, the charge |
| `analytic` | Mara | cool, precise | odds, time, supply |
| `gruff` | Alaric | blunt, wry | arrows, ranges, walls |
| `courtly` | Elyne | polished, measured | the people, the court, coin |

---

## 5. Naming Conventions

- Kingdom & places: evocative but plain Russian (Валедорн, Рассветный Предел,
  Тихий Брод). Avoid real-world toponyms.
- Nobles: given name + house (Эшфорд, Арден, Вейл, Морвейн). Address with «сэр» /
  «леди»; commoners (Аларик, Мара) without a particle.
- The parser strips «сэр/сер/леди/госпожа» and matches on any name token ≥3 chars,
  so new officers become addressable automatically — no parser change needed.
