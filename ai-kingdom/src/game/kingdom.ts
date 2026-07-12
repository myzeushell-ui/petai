/**
 * Core World Foundation (Master Game Bible §9–11, Phase 1).
 *
 * The strategic layer beneath the tactical siege: provinces, aggregated
 * population, realm-wide strategic resources, and campaign-scale season/day.
 * Pure and data-driven — adding a province or resource needs no engine change.
 * The existing tactical `Resources`/`units`/`locations` are untouched; this
 * lives alongside them under `GameState.kingdom`.
 */

export type Season = "spring" | "summer" | "autumn" | "winter";

export const SEASON_ORDER: Season[] = ["spring", "summer", "autumn", "winter"];
export const SEASON_LABELS: Record<Season, string> = {
  spring: "Весна",
  summer: "Лето",
  autumn: "Осень",
  winter: "Зима",
};

/** Ten strategic resources shown (selectively) in the HUD; goods live elsewhere. */
export type StrategicResource =
  | "food"
  | "timber"
  | "stone"
  | "iron"
  | "gold"
  | "manpower"
  | "horses"
  | "weapons"
  | "medicine"
  | "influence";

export const STRATEGIC_RESOURCES: StrategicResource[] = [
  "food",
  "timber",
  "stone",
  "iron",
  "gold",
  "manpower",
  "horses",
  "weapons",
  "medicine",
  "influence",
];

export const RESOURCE_LABELS: Record<StrategicResource, string> = {
  food: "Еда",
  timber: "Древесина",
  stone: "Камень",
  iron: "Железо",
  gold: "Золото",
  manpower: "Рекруты",
  horses: "Лошади",
  weapons: "Оружие",
  medicine: "Лекарства",
  influence: "Влияние",
};

export type ProvinceSpecialty =
  | "border_march"
  | "grain_valley"
  | "iron_hills"
  | "forest"
  | "trade_hub"
  | "noble_estate"
  | "river_port";

export const SPECIALTY_LABELS: Record<ProvinceSpecialty, string> = {
  border_march: "Пограничная марка",
  grain_valley: "Хлебная долина",
  iron_hills: "Железные холмы",
  forest: "Лесной край",
  trade_hub: "Торговый узел",
  noble_estate: "Дворянское поместье",
  river_port: "Речной порт",
};

/** Governance levers (wired into effects in the Governance phase). */
export type TaxLevel = "none" | "low" | "normal" | "high" | "emergency";
export type RationLevel = "starvation" | "quarter" | "half" | "normal" | "generous" | "feast";
export type ConscriptionLevel = "volunteers" | "light" | "medium" | "heavy" | "total";

export const TAX_LABELS: Record<TaxLevel, string> = {
  none: "Нет", low: "Низкий", normal: "Обычный", high: "Высокий", emergency: "Чрезвычайный",
};
export const RATION_LABELS: Record<RationLevel, string> = {
  starvation: "Голод", quarter: "Четверть", half: "Половина", normal: "Норма", generous: "Щедрый", feast: "Пир",
};
export const CONSCRIPTION_LABELS: Record<ConscriptionLevel, string> = {
  volunteers: "Добровольцы", light: "Лёгкий", medium: "Средний", heavy: "Тяжёлый", total: "Всеобщий",
};

/** Aggregated population — cohorts by age and social class (not per-person AI). */
export interface PopulationCohorts {
  children: number;
  adults: number;
  elders: number;
  peasants: number;
  artisans: number;
  merchants: number;
  militia: number;
  nobles: number;
  clergy: number;
}

/** Province wellbeing signals, each 0..100. */
export interface PopulationIndicators {
  happiness: number;
  health: number;
  foodSecurity: number;
  trustInCrown: number;
  warWeariness: number;
  taxBurden: number;
  conscriptionBurden: number;
}

export interface Province {
  id: string;
  name: string;
  specialty: ProvinceSpecialty;
  owner: "player" | "enemy" | "neutral";
  governorId: string | null;
  /** Total souls (sum of age cohorts). */
  population: number;
  cohorts: PopulationCohorts;
  indicators: PopulationIndicators;
  loyalty: number;
  nobleSupport: number;
  tax: TaxLevel;
  ration: RationLevel;
  conscription: ConscriptionLevel;
  /** Farmland productivity 0..100. */
  fertility: number;
  security: number;
  /** Roads/development level 0..100. */
  infrastructure: number;
  /** Natural richness / local reserve of strategic resources. */
  resources: Partial<Record<StrategicResource, number>>;
  buildings: string[];
  /** Ties this province to a tactical map location, if any. */
  anchorLocationId?: string;
  x: number;
  y: number;
}

export interface KingdomState {
  name: string;
  ruler: string;
  capital: string;
  year: number;
  day: number;
  season: Season;
  /** Realm-wide reserves shown in the HUD. */
  stockpile: Record<StrategicResource, number>;
  provinces: Province[];
  reputation: number;
}

/* ------------------------------------------------------------------ */
/* Vertical-slice content (Bible §55: 3 provinces, 2 villages, 1 keep) */
/* ------------------------------------------------------------------ */

function cohorts(total: number, mix: Partial<PopulationCohorts> = {}): PopulationCohorts {
  const adults = Math.round(total * 0.58);
  const children = Math.round(total * 0.28);
  const elders = total - adults - children;
  return {
    children,
    adults,
    elders,
    peasants: Math.round(adults * 0.68),
    artisans: Math.round(adults * 0.14),
    merchants: Math.round(adults * 0.06),
    militia: Math.round(adults * 0.06),
    nobles: Math.round(adults * 0.03),
    clergy: Math.round(adults * 0.03),
    ...mix,
  };
}

function indicators(over: Partial<PopulationIndicators> = {}): PopulationIndicators {
  return {
    happiness: 60,
    health: 66,
    foodSecurity: 62,
    trustInCrown: 55,
    warWeariness: 20,
    taxBurden: 40,
    conscriptionBurden: 15,
    ...over,
  };
}

/** Build the initial three-province realm for "Ночь перед осадой 2.0". */
export function createInitialKingdom(): KingdomState {
  const provinces: Province[] = [
    {
      id: "prov_dawnreach",
      name: "Рассветная марка",
      specialty: "border_march",
      owner: "player",
      governorId: "edward",
      population: 2600,
      cohorts: cohorts(2600, { militia: 220 }),
      indicators: indicators({ happiness: 52, warWeariness: 34, foodSecurity: 55, trustInCrown: 58 }),
      loyalty: 64,
      nobleSupport: 50,
      tax: "normal",
      ration: "normal",
      conscription: "light",
      fertility: 42,
      security: 46,
      infrastructure: 55,
      resources: { stone: 320, timber: 180, food: 240, weapons: 90, horses: 40 },
      buildings: ["keep", "watchtower", "wall", "barracks", "market"],
      anchorLocationId: "castle",
      x: 22,
      y: 66,
    },
    {
      id: "prov_quietvale",
      name: "Тихая долина",
      specialty: "grain_valley",
      owner: "player",
      governorId: "elyne",
      population: 3400,
      cohorts: cohorts(3400),
      indicators: indicators({ happiness: 64, foodSecurity: 78 }),
      loyalty: 70,
      nobleSupport: 44,
      tax: "normal",
      ration: "normal",
      conscription: "volunteers",
      fertility: 82,
      security: 52,
      infrastructure: 48,
      resources: { food: 620, timber: 120, horses: 70, gold: 60 },
      buildings: ["village", "mill", "farm", "bakery", "market"],
      anchorLocationId: "village",
      x: 40,
      y: 52,
    },
    {
      id: "prov_ironridge",
      name: "Железный кряж",
      specialty: "iron_hills",
      owner: "player",
      governorId: "alaric",
      population: 1900,
      cohorts: cohorts(1900, { artisans: 220 }),
      indicators: indicators({ happiness: 58, health: 60, foodSecurity: 50 }),
      loyalty: 60,
      nobleSupport: 38,
      tax: "normal",
      ration: "normal",
      conscription: "light",
      fertility: 30,
      security: 44,
      infrastructure: 40,
      resources: { iron: 280, stone: 200, timber: 260, weapons: 60 },
      buildings: ["ironMine", "smelter", "smithy", "sawmill"],
      anchorLocationId: "hills",
      x: 62,
      y: 40,
    },
  ];

  const stockpile = emptyStockpile();
  stockpile.food = 900;
  stockpile.timber = 420;
  stockpile.stone = 300;
  stockpile.iron = 180;
  stockpile.gold = 520;
  stockpile.manpower = 260;
  stockpile.horses = 120;
  stockpile.weapons = 240;
  stockpile.medicine = 60;
  stockpile.influence = 40;

  return {
    name: "Валедорн",
    ruler: "молодой правитель",
    capital: "Арквелл",
    year: 1,
    day: 1,
    season: "autumn",
    stockpile,
    provinces,
    reputation: 50,
  };
}

export function emptyStockpile(): Record<StrategicResource, number> {
  return {
    food: 0, timber: 0, stone: 0, iron: 0, gold: 0,
    manpower: 0, horses: 0, weapons: 0, medicine: 0, influence: 0,
  };
}

/* ------------------------------------------------------------------ */
/* Pure helpers                                                        */
/* ------------------------------------------------------------------ */

/** Adult men eligible for the levy, scaled by conscription policy. */
export function provinceManpowerPool(p: Province): number {
  const eligible = Math.round(p.cohorts.peasants * 0.5 + p.cohorts.artisans * 0.25 + p.cohorts.militia);
  const factor: Record<ConscriptionLevel, number> = {
    volunteers: 0.05, light: 0.12, medium: 0.25, heavy: 0.45, total: 0.7,
  };
  return Math.round(eligible * factor[p.conscription]);
}

/** Seasonal farmland yield multiplier, biased by the province's specialty. */
export function seasonFertility(season: Season, specialty: ProvinceSpecialty): number {
  const base: Record<Season, number> = { spring: 0.9, summer: 1.15, autumn: 1.0, winter: 0.4 };
  const bonus = specialty === "grain_valley" ? 0.25 : specialty === "iron_hills" ? -0.1 : 0;
  return Math.max(0.15, base[season] + bonus);
}

export interface KingdomTotals {
  population: number;
  militia: number;
  manpowerPool: number;
  provinces: number;
  playerProvinces: number;
  avgHappiness: number;
  avgLoyalty: number;
}

export function kingdomTotals(k: KingdomState): KingdomTotals {
  const owned = k.provinces.filter((p) => p.owner === "player");
  const pop = owned.reduce((s, p) => s + p.population, 0);
  const militia = owned.reduce((s, p) => s + p.cohorts.militia, 0);
  const pool = owned.reduce((s, p) => s + provinceManpowerPool(p), 0);
  const happiness = owned.length ? owned.reduce((s, p) => s + p.indicators.happiness, 0) / owned.length : 0;
  const loyalty = owned.length ? owned.reduce((s, p) => s + p.loyalty, 0) / owned.length : 0;
  return {
    population: pop,
    militia,
    manpowerPool: pool,
    provinces: k.provinces.length,
    playerProvinces: owned.length,
    avgHappiness: Math.round(happiness),
    avgLoyalty: Math.round(loyalty),
  };
}

function clamp01to100(n: number): number {
  return Math.max(0, Math.min(100, n));
}

/**
 * Advance the realm by one strategic day: population drifts with wellbeing,
 * provinces produce a little food by season. Pure — returns a new kingdom.
 * (Full production chains arrive in the Economy phase; this establishes the
 * living-foundation loop.)
 */
export function advanceKingdomDay(k: KingdomState): KingdomState {
  let day = k.day + 1;
  let year = k.year;
  let season = k.season;
  // 30-day seasons.
  if (day > 30) {
    day = 1;
    const idx = SEASON_ORDER.indexOf(k.season);
    season = SEASON_ORDER[(idx + 1) % 4];
    if (season === "spring") year += 1;
  }

  const stockpile = { ...k.stockpile };
  const provinces = k.provinces.map((p) => {
    if (p.owner !== "player") return p;
    const ind = { ...p.indicators };
    // Food security nudges health and happiness; war weariness erodes happiness.
    ind.happiness = clamp01to100(ind.happiness + (ind.foodSecurity - 55) * 0.02 - ind.warWeariness * 0.01);
    ind.health = clamp01to100(ind.health + (ind.foodSecurity - 50) * 0.015);
    // Population growth/decline from wellbeing.
    const growth = (ind.happiness - 50) * 0.0006 + (ind.health - 50) * 0.0004 - ind.warWeariness * 0.0003;
    const population = Math.max(0, Math.round(p.population * (1 + growth)));
    // Seasonal food onto the realm stockpile (light; economy phase makes it physical).
    const yield_ = p.fertility * 0.5 * seasonFertility(season, p.specialty);
    stockpile.food += Math.round(yield_);
    return { ...p, indicators: ind, population, cohorts: rescaleCohorts(p.cohorts, population, p.population) };
  });

  return { ...k, day, year, season, stockpile, provinces };
}

function rescaleCohorts(c: PopulationCohorts, next: number, prev: number): PopulationCohorts {
  if (prev <= 0 || next === prev) return c;
  const f = next / prev;
  const r = (n: number) => Math.round(n * f);
  return {
    children: r(c.children), adults: r(c.adults), elders: r(c.elders),
    peasants: r(c.peasants), artisans: r(c.artisans), merchants: r(c.merchants),
    militia: r(c.militia), nobles: r(c.nobles), clergy: r(c.clergy),
  };
}
