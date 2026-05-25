/**
 * Auto-generate reminders based on pet's current life stage and breed.
 *
 * Closes the loop between the upbringing encyclopedia and the
 * reminders system: pet ages → matching life-stage reminders appear
 * automatically, so the owner doesn't have to memorise the timeline.
 *
 * Bilingual: each generator returns translated content based on locale.
 */

import { addDays, addMonths, type DateInput } from "@/lib/utils-date";
import { getStageForAge, type LifeStageId } from "@/data/upbringing";
import type { Reminder } from "@/types";
import type { Locale } from "@/lib/i18n";
import type { Pet } from "@/types";

interface UpbringingReminder {
  id: string;
  type: Reminder["type"];
  priority: Reminder["priority"];
  /** Days from now this reminder is due. Negative = already past, urgent. */
  dueInDays: number;
  recurring: boolean;
  recurringInterval?: Reminder["recurringInterval"];
  title: { en: string; ru: string };
  description: { en: string; ru: string };
}

/**
 * For each life stage, the set of recommended reminders.
 * Generated lazily per pet so dates are always "from today".
 */
const TEMPLATES: Record<LifeStageId, UpbringingReminder[]> = {
  neonatal: [
    {
      id: "neo-1",
      type: "checkup",
      priority: "high",
      dueInDays: 0,
      recurring: false,
      title: { en: "Verify breeder paperwork", ru: "Проверь документы заводчика" },
      description: {
        en: "Confirm first vaccine (DHPP), deworming protocol, microchip ID and parents' health screens before bringing puppy home.",
        ru: "Подтверди первую прививку (DHPP), протокол дегельминтизации, ID чипа и обследования родителей перед тем как забрать щенка домой.",
      },
    },
  ],
  puppy_early: [
    {
      id: "pe-1",
      type: "checkup",
      priority: "high",
      dueInDays: 7,
      recurring: false,
      title: { en: "Book first vet visit", ru: "Запиши первый визит к ветеринару" },
      description: {
        en: "Wellness exam + verify vaccine schedule. Vet should examine eyes, ears, teeth, heart and stool sample.",
        ru: "Осмотр + сверка графика прививок. Врач должен проверить глаза, уши, зубы, сердце и взять анализ кала.",
      },
    },
    {
      id: "pe-2",
      type: "custom",
      priority: "high",
      dueInDays: 3,
      recurring: false,
      title: { en: "Enrol in puppy socialization class", ru: "Запишись на щенячий курс социализации" },
      description: {
        en: "Critical window closes at 16 weeks. Class accepts pups after 2nd vaccine (~10–12 wk). Don't miss this — biggest predictor of adult temperament.",
        ru: "Критическое окно закрывается в 16 недель. Курс принимает щенков после 2-й прививки (~10–12 нед). Не упусти — главный фактор взрослого темперамента.",
      },
    },
    {
      id: "pe-3",
      type: "vaccination",
      priority: "high",
      dueInDays: 21,
      recurring: false,
      title: { en: "2nd DHPP + Leptospirosis vaccine", ru: "2-я DHPP + Лептоспироз" },
      description: {
        en: "Around 12 weeks. Region-dependent: ask vet about Bordetella for puppy class attendance.",
        ru: "Около 12 недель. По региону: спроси врача про Бордетеллу для курсов с другими щенками.",
      },
    },
    {
      id: "pe-4",
      type: "vaccination",
      priority: "high",
      dueInDays: 49,
      recurring: false,
      title: { en: "Final DHPP + Rabies (16 weeks)", ru: "Финальная DHPP + Бешенство (16 нед)" },
      description: {
        en: "After this puppy can safely visit dog parks and public places. Schedule flea/tick/heartworm prevention discussion.",
        ru: "После этой прививки можно безопасно водить на собачьи площадки и в общественные места. Обсуди защиту от блох/клещей/дирофилярий.",
      },
    },
    {
      id: "pe-5",
      type: "custom",
      priority: "medium",
      dueInDays: 1,
      recurring: true,
      recurringInterval: "weekly",
      title: { en: "Socialization log: 5 new positive experiences", ru: "Журнал социализации: 5 новых позитивных опытов" },
      description: {
        en: "New people, surfaces, sounds, environments. Target: 100 positive exposures before 16 weeks of age.",
        ru: "Новые люди, поверхности, звуки, среды. Цель: 100 позитивных опытов до 16 недель.",
      },
    },
  ],
  puppy_mid: [
    {
      id: "pm-1",
      type: "checkup",
      priority: "medium",
      dueInDays: 14,
      recurring: false,
      title: { en: "Discuss spay/neuter timing with vet", ru: "Обсуди сроки стерилизации/кастрации" },
      description: {
        en: "For medium/large breeds wait until growth plates close (12–24 mo). For small breeds 6–9 mo is fine. Don't rush — early sterilization affects joint development.",
        ru: "Для средних/крупных пород ждать закрытия зон роста (12–24 мес). Для мелких — 6–9 мес норм. Не торопись — ранняя стерилизация влияет на суставы.",
      },
    },
    {
      id: "pm-2",
      type: "custom",
      priority: "medium",
      dueInDays: 0,
      recurring: true,
      recurringInterval: "daily",
      title: { en: "Daily training: sit/stay/come with distractions", ru: "Дневная тренировка: сидеть/ждать/ко мне с отвлечениями" },
      description: {
        en: "3 sessions of 2–3 minutes. Practise in new locations — adolescents fail at generalisation.",
        ru: "3 сессии по 2–3 минуты. Тренируй в новых местах — подростки проваливают генерализацию.",
      },
    },
    {
      id: "pm-3",
      type: "grooming",
      priority: "low",
      dueInDays: 7,
      recurring: true,
      recurringInterval: "monthly",
      title: { en: "Trim nails & check ears", ru: "Стриги когти и проверяй уши" },
      description: {
        en: "Build the routine now — habitual handling = stress-free vet visits for life.",
        ru: "Формируй привычку сейчас — спокойное обращение = бесстрессовые визиты к ветеринару на всю жизнь.",
      },
    },
  ],
  puppy_late: [
    {
      id: "pl-1",
      type: "vaccination",
      priority: "high",
      dueInDays: 14,
      recurring: false,
      title: { en: "1-year booster vaccines + heartworm test", ru: "Годовая ревакцинация + тест на дирофиляриоз" },
      description: {
        en: "DHPP, rabies, heartworm antigen test. Discuss switching to 3-year vaccine schedule for core vaccines after this.",
        ru: "DHPP, бешенство, тест на дирофиляриоз. Обсуди переход на 3-летний график для основных прививок после этого.",
      },
    },
    {
      id: "pl-2",
      type: "checkup",
      priority: "medium",
      dueInDays: 30,
      recurring: false,
      title: { en: "Baseline blood panel at 1 year", ru: "Базовый анализ крови в 1 год" },
      description: {
        en: "Lifetime comparison data — invaluable later if disease appears. CBC + chemistry + thyroid.",
        ru: "Данные для сравнения на всю жизнь — бесценны если позже появится болезнь. ОАК + биохимия + щитовидка.",
      },
    },
    {
      id: "pl-3",
      type: "custom",
      priority: "medium",
      dueInDays: 0,
      recurring: true,
      recurringInterval: "weekly",
      title: { en: "Recall practice with high-value rewards", ru: "Тренировка подзыва с ценным лакомством" },
      description: {
        en: "Adolescents test boundaries. Rock-solid recall now = off-leash freedom later (when safe).",
        ru: "Подростки проверяют границы. Железный подзыв сейчас = свобода без поводка позже (где безопасно).",
      },
    },
  ],
  adolescent: [
    {
      id: "ad-1",
      type: "grooming",
      priority: "medium",
      dueInDays: 30,
      recurring: true,
      recurringInterval: "yearly",
      title: { en: "Annual professional dental cleaning", ru: "Ежегодная профессиональная чистка зубов" },
      description: {
        en: "From age 1–2 dental disease is the #1 silent cause of pain. Under anaesthesia at the vet.",
        ru: "С 1–2 лет стоматология — №1 скрытая причина боли. Под наркозом у ветеринара.",
      },
    },
    {
      id: "ad-2",
      type: "checkup",
      priority: "high",
      dueInDays: 30,
      recurring: true,
      recurringInterval: "yearly",
      title: { en: "Annual exam: weight, joints, lifestyle review", ru: "Ежегодный осмотр: вес, суставы, образ жизни" },
      description: {
        en: "Adolescents often gain weight after neutering — adjust portions. Joint check critical for large breeds.",
        ru: "Подростки часто набирают вес после кастрации — скорректируй порции. Проверка суставов критична для крупных пород.",
      },
    },
    {
      id: "ad-3",
      type: "custom",
      priority: "medium",
      dueInDays: 0,
      recurring: true,
      recurringInterval: "monthly",
      title: { en: "New trick or skill — keep brain engaged", ru: "Новый трюк или навык — поддерживай мозг" },
      description: {
        en: "Bored adolescent = destroyed sofa. 15 min of mental work beats a 1-hour walk for tiring them out.",
        ru: "Скучающий подросток = разорванный диван. 15 мин умственной работы утомят больше чем час прогулки.",
      },
    },
  ],
  adult: [
    {
      id: "ad-adult-1",
      type: "checkup",
      priority: "high",
      dueInDays: 30,
      recurring: true,
      recurringInterval: "yearly",
      title: { en: "Annual wellness exam + bloodwork", ru: "Ежегодный wellness осмотр + анализ крови" },
      description: {
        en: "From age 4 add baseline blood/urine annually. Catches kidney/thyroid issues years before symptoms.",
        ru: "С 4 лет — ежегодно базовая кровь+моча. Ловит проблемы почек/щитовидки за годы до симптомов.",
      },
    },
    {
      id: "ad-adult-2",
      type: "grooming",
      priority: "medium",
      dueInDays: 60,
      recurring: true,
      recurringInterval: "yearly",
      title: { en: "Dental cleaning under anaesthesia", ru: "Чистка зубов под наркозом" },
      description: {
        en: "Every 12–18 months. Periodontal disease shortens lifespan more than most owners realise.",
        ru: "Каждые 12–18 мес. Пародонтит сокращает жизнь больше чем большинство хозяев осознаёт.",
      },
    },
    {
      id: "ad-adult-3",
      type: "custom",
      priority: "low",
      dueInDays: 90,
      recurring: true,
      recurringInterval: "monthly",
      title: { en: "Body condition check (rib palpation)", ru: "Проверка упитанности (прощупывание рёбер)" },
      description: {
        en: "Even +10% over ideal weight cuts lifespan and increases disease risk. Catch drift early.",
        ru: "Даже +10% к норме сокращают жизнь и повышают риски. Лови дрейф рано.",
      },
    },
  ],
  senior: [
    {
      id: "sn-1",
      type: "checkup",
      priority: "high",
      dueInDays: 14,
      recurring: true,
      recurringInterval: "monthly",
      title: { en: "Twice-yearly vet exam (every 6 months)", ru: "Осмотры дважды в год (каждые 6 мес)" },
      description: {
        en: "Senior dogs hide disease well. Bi-annual visits catch problems early and add years.",
        ru: "Пожилые собаки хорошо скрывают болезнь. Визиты дважды в год ловят проблемы рано и добавляют годы.",
      },
    },
    {
      id: "sn-2",
      type: "checkup",
      priority: "high",
      dueInDays: 60,
      recurring: true,
      recurringInterval: "yearly",
      title: { en: "Full senior panel: CBC, chemistry, urine, thyroid, BP", ru: "Полная сеньорская панель: ОАК, биохимия, моча, щитовидка, давление" },
      description: {
        en: "Annual at minimum. Add radiographs for known joint issues. Discuss cognitive function.",
        ru: "Ежегодно как минимум. Добавь рентген при известных проблемах суставов. Обсуди когнитивные функции.",
      },
    },
    {
      id: "sn-3",
      type: "custom",
      priority: "medium",
      dueInDays: 7,
      recurring: true,
      recurringInterval: "weekly",
      title: { en: "Lump check + photo log", ru: "Проверка шишек + фото-журнал" },
      description: {
        en: "Run hands over body weekly. New lumps? Photograph + date. Anything growing → vet aspiration biopsy.",
        ru: "Раз в неделю проводи руками по телу. Новые шишки? Фото + дата. Растёт → пункция-биопсия у врача.",
      },
    },
    {
      id: "sn-4",
      type: "custom",
      priority: "medium",
      dueInDays: 30,
      recurring: false,
      title: { en: "Joint support: ramps + non-slip rugs", ru: "Поддержка суставов: пандусы + нескользящие коврики" },
      description: {
        en: "Set up ramps to couch/bed/car. Add non-slip rugs on tile/laminate. Discuss glucosamine/omega-3 with vet.",
        ru: "Поставь пандусы к дивану/кровати/машине. Добавь нескользящие коврики на плитку/ламинат. Обсуди глюкозамин/омега-3 с врачом.",
      },
    },
  ],
};

/**
 * Generate the list of upbringing reminders for a pet, with translated content
 * and absolute due dates (today + dueInDays).
 */
export function generateUpbringingReminders(pet: Pet, locale: Locale): Reminder[] {
  // Only generates for dogs (upbringing encyclopedia is dog-specific for now)
  if (pet.species !== "dog") return [];

  const stage = getStageForAge(pet.age);
  const templates = TEMPLATES[stage.id] ?? [];

  return templates.map((tmpl) => {
    const dueDate = addDays(new Date(), tmpl.dueInDays).toISOString();
    return {
      id: `upbringing-${pet.id}-${tmpl.id}`,
      petId: pet.id,
      type: tmpl.type,
      title: tmpl.title[locale],
      description: tmpl.description[locale],
      dueDate,
      recurring: tmpl.recurring,
      recurringInterval: tmpl.recurringInterval,
      completed: false,
      priority: tmpl.priority,
    };
  });
}

/** Re-export so callers don't have to know the stage logic. */
export function getUpbringingRemindersForPet(pet: Pet, locale: Locale): Reminder[] {
  return generateUpbringingReminders(pet, locale);
}
