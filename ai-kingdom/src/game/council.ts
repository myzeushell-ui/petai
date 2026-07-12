/**
 * War Council content and effects (pure data).
 *
 * The scene text (who backs what, who objects) lives here so the UI can render
 * five conflicting voices; `councilEffects` turns the player's decisions into a
 * declarative list of consequences the engine applies (memory, morale, flags,
 * village). No engine imports — keeps it testable and content-only.
 */

import type {
  CouncilDecisions,
  FortifyFocus,
  MainPlan,
  MemoryEventType,
  VillagePlan,
} from "./types";

export interface CouncilVoice {
  officerId: string;
  /** Which plan this officer pushes for (null = civil concern). */
  backs: MainPlan | null;
  line: string;
  /** Short concern that conflicts with a rival's stance. */
  concern: string;
}

/** The opening round: five voices, deliberately in tension. */
export const COUNCIL_VOICES: CouncilVoice[] = [
  {
    officerId: "mara",
    backs: null,
    line: "Разведка подтверждает: авангард Рейка выходит на восточную дорогу. Точных сил не знаю — уверенность средняя.",
    concern: "Слепой удар — половина поражения. Дайте мне разведать, прежде чем решать.",
  },
  {
    officerId: "edward",
    backs: "hold_bridge",
    line: "Держим мост, милорд. Узкий проход стоит трёх полков. Пусть враг разбивается о камень.",
    concern: "Вылазка в поле — это подарок их коннице. Роланд погубит людей ради славы.",
  },
  {
    officerId: "roland",
    backs: "preemptive_strike",
    line: "Ударим первыми! Пока они не построились, я развею их авангард одним броском конницы.",
    concern: "Отсиживаться за стенами — значит отдать врагу выбор. Аларик тянет время, которого нет.",
  },
  {
    officerId: "alaric",
    backs: "fortify_lines",
    line: "Дайте мне время, милорд: колья на мосту, лучники на холмах. Оборона сама перемелет их.",
    concern: "Лихая атака Роланда оставит стены голыми. Сначала позиции — потом геройство.",
  },
  {
    officerId: "elyne",
    backs: null,
    line: "А деревня, милорд? Там наши люди и наш хлеб. Решите их судьбу, прежде чем зазвенит сталь.",
    concern: "Чистая военная логика забывает о народе. Бросите деревню — потеряете сердца королевства.",
  },
];

export interface PlanOption {
  id: MainPlan;
  label: string;
  blurb: string;
  backer: string;
  opposed: string;
}

export const PLAN_OPTIONS: PlanOption[] = [
  {
    id: "hold_bridge",
    label: "Удерживать мост",
    blurb: "Сосредоточить оборону на переправе. Надёжно, бережёт людей, отдаёт инициативу врагу.",
    backer: "edward",
    opposed: "roland",
  },
  {
    id: "preemptive_strike",
    label: "Упреждающий удар",
    blurb: "Выслать конницу навстречу авангарду. Смело и быстро, но рискованно и дорого.",
    backer: "roland",
    opposed: "edward",
  },
  {
    id: "fortify_lines",
    label: "Укрепить рубежи",
    blurb: "Баррикады, колья, лучники на высотах. Перемалывает штурм, но требует времени.",
    backer: "alaric",
    opposed: "roland",
  },
];

export interface VillageOption {
  id: VillagePlan;
  label: string;
  blurb: string;
}

export const VILLAGE_OPTIONS: VillageOption[] = [
  {
    id: "full_evac",
    label: "Полная эвакуация",
    blurb: "Увести всех жителей и обозы в замок. Спасает людей и поднимает дух — но теряется ополчение.",
  },
  {
    id: "partial_evac",
    label: "Частичная эвакуация",
    blurb: "Вывезти семьи и часть припасов, оставить работников на укреплениях. Компромисс.",
  },
  {
    id: "stand",
    label: "Оставить и вооружить",
    blurb: "Раздать оружие мужчинам, поднять ополчение. Больше защитников — но жители под ударом.",
  },
];

export interface FortifyOption {
  id: FortifyFocus;
  label: string;
  blurb: string;
}

export const FORTIFY_OPTIONS: FortifyOption[] = [
  { id: "bridge", label: "Мост", blurb: "Баррикада и колья на переправе — узкий проход становится смертельным." },
  { id: "hills", label: "Холмы", blurb: "Частокол и позиции лучников на высотах — обзор и залповый огонь." },
  { id: "balanced", label: "Поровну", blurb: "Разделить усилия между мостом и холмами." },
];

/* ------------------------------------------------------------------ */
/* Effects                                                            */
/* ------------------------------------------------------------------ */

export interface OfficerMemoryEffect {
  officerId: string;
  type: MemoryEventType;
  weightScale?: number;
  description?: string;
}

export interface CouncilEffects {
  memories: OfficerMemoryEffect[];
  moraleDelta: number;
  flags: Record<string, boolean | number>;
  /** Villager militia mobilized into the levy. */
  militiaDelta: number;
  villagePlan: VillagePlan;
}

/** Turn council decisions into declarative consequences for the engine. */
export function councilEffects(d: CouncilDecisions): CouncilEffects {
  const memories: OfficerMemoryEffect[] = [];
  const flags: Record<string, boolean | number> = {};
  let moraleDelta = 0;
  let militiaDelta = 0;

  // Main plan: the backer feels heard, the rival passed over.
  const plan = PLAN_OPTIONS.find((p) => p.id === d.plan)!;
  memories.push({ officerId: plan.backer, type: "PLAYER_LISTENED_TO_ME" });
  memories.push({ officerId: plan.opposed, type: "PLAYER_GAVE_GLORY_TO_RIVAL", weightScale: 0.7 });
  if (d.plan === "hold_bridge") flags.planHoldBridge = true;
  if (d.plan === "preemptive_strike") flags.planPreemptive = true;
  if (d.plan === "fortify_lines") flags.planFortify = true;

  // Village fate.
  if (d.village === "full_evac") {
    memories.push({ officerId: "elyne", type: "PLAYER_LISTENED_TO_ME" });
    moraleDelta += 6;
    flags.villageEvacIntent = 1;
  } else if (d.village === "stand") {
    memories.push({ officerId: "elyne", type: "PLAYER_IGNORED_MY_WARNING", weightScale: 0.8 });
    militiaDelta += 60;
    moraleDelta -= 2;
    flags.villageStand = true;
  } else {
    militiaDelta += 25;
    flags.villagePartial = true;
  }

  // Autonomy and reserve are marks of trust.
  if (d.autonomyOfficerId) {
    memories.push({ officerId: d.autonomyOfficerId, type: "PLAYER_TRUSTED_MY_INITIATIVE" });
    flags.autonomyGranted = 1;
  }
  if (d.reserveOfficerId) {
    memories.push({
      officerId: d.reserveOfficerId,
      type: "PLAYER_TRUSTED_ME_WITH_IMPORTANT_COMMAND",
      weightScale: 0.8,
    });
  }

  // Fortification focus.
  if (d.fortify === "bridge") flags.bridgeFortified = true;
  else if (d.fortify === "hills") flags.hillsFortified = true;
  else {
    flags.bridgeFortified = true;
    flags.hillsFortified = true;
  }

  return { memories, moraleDelta, flags, militiaDelta, villagePlan: d.village };
}

/** Default decisions (used if the player skips the council). */
export const DEFAULT_COUNCIL: CouncilDecisions = {
  plan: "hold_bridge",
  village: "partial_evac",
  autonomyOfficerId: null,
  reserveOfficerId: null,
  fortify: "bridge",
};
