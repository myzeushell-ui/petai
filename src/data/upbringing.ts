/**
 * Lifecycle upbringing encyclopedia for dogs.
 *
 * Architecture: universal life-stage timeline (covers ~80% of dog-rearing wisdom)
 * + breed-specific overrides (the 20% that varies between, say, a Husky and a Frenchie).
 *
 * All content is bilingual ({ en, ru }). Use t()/tList() helpers from @/lib/i18n.
 *
 * Sources synthesised from: AKC (American Kennel Club) puppy curriculum,
 * ASPCA socialization windows, Whole Dog Journal training methodology,
 * AAHA preventive care guidelines, RSPCA welfare standards, and consensus
 * breeder/cynologist practice for working/giant/brachycephalic/sighthound groups.
 *
 * Disclaimer: information is educational, not veterinary diagnosis.
 */

import type { LocaleArray, LocaleString } from "@/lib/i18n";

export type LifeStageId =
  | "neonatal"      // 0–2 months: with breeder
  | "puppy_early"   // 2–4 months: home arrival, socialization peak
  | "puppy_mid"     // 4–6 months: teething, basic obedience, vaccines complete
  | "puppy_late"    // 6–12 months: adolescence begins, growth
  | "adolescent"    // 1–2 years: the "teenager" — testing limits
  | "adult"         // 2–7 years: maintenance & prime
  | "senior";       // 7+ years: joint care, cognitive support

export interface LifeStage {
  id: LifeStageId;
  ageMinMonths: number;
  ageMaxMonths: number;       // exclusive upper bound; senior is open-ended (Infinity)
  label: LocaleString;
  ageRange: LocaleString;
  oneLiner: LocaleString;     // headline sentence about this stage
  emoji: string;
  color: string;              // tailwind colour token (e.g. "amber")
}

export interface StageContent {
  topPriorities: LocaleArray;   // 2–3 most important things this stage
  training: LocaleArray;        // training & obedience actions
  care: LocaleArray;            // grooming / day-to-day care
  socialization: LocaleArray;   // people, dogs, surfaces, sounds
  nutrition: LocaleArray;       // food & feeding schedule
  dangers: LocaleArray;         // NEVER do this / hazards to avoid
  vetMilestones: LocaleArray;   // vaccines, check-ups, surgeries
  redFlags: LocaleArray;        // call vet immediately if…
}

export interface BreedOverride {
  breedIds: string[];           // applies to all these breed ids
  archetype: LocaleString;      // human-readable name of the override group
  always: LocaleArray;          // notes applicable at every life stage
  stages: Partial<Record<LifeStageId, Partial<StageContent>>>;
}

// ─────────────────────────────────────────────────────────────────────────────
// LIFE STAGES
// ─────────────────────────────────────────────────────────────────────────────

export const LIFE_STAGES: LifeStage[] = [
  {
    id: "neonatal",
    ageMinMonths: 0,
    ageMaxMonths: 2,
    label: { en: "Neonatal", ru: "Новорождённый" },
    ageRange: { en: "0–2 months", ru: "0–2 месяца" },
    oneLiner: {
      en: "Should still be with mother & littermates. Removing earlier causes lifelong behavioural problems.",
      ru: "Должен быть с матерью и помётом. Раннее отлучение даёт пожизненные поведенческие проблемы.",
    },
    emoji: "🍼",
    color: "rose",
  },
  {
    id: "puppy_early",
    ageMinMonths: 2,
    ageMaxMonths: 4,
    label: { en: "Early Puppyhood", ru: "Ранний щенок" },
    ageRange: { en: "2–4 months", ru: "2–4 месяца" },
    oneLiner: {
      en: "Critical socialization window. Every positive new experience now wires the adult brain.",
      ru: "Критическое окно социализации. Каждый позитивный новый опыт сейчас формирует мозг взрослой собаки.",
    },
    emoji: "🐶",
    color: "amber",
  },
  {
    id: "puppy_mid",
    ageMinMonths: 4,
    ageMaxMonths: 6,
    label: { en: "Mid Puppyhood", ru: "Средний щенок" },
    ageRange: { en: "4–6 months", ru: "4–6 месяцев" },
    oneLiner: {
      en: "Teething, vaccinations complete, basic obedience locks in. Start chewing on legal items.",
      ru: "Зубы меняются, базовые прививки завершены, закрепляется послушание. Дай безопасные вещи для жевания.",
    },
    emoji: "🦷",
    color: "orange",
  },
  {
    id: "puppy_late",
    ageMinMonths: 6,
    ageMaxMonths: 12,
    label: { en: "Late Puppyhood", ru: "Поздний щенок" },
    ageRange: { en: "6–12 months", ru: "6–12 месяцев" },
    oneLiner: {
      en: "Adolescence begins. Hormones surge — expect selective hearing and renewed testing of rules.",
      ru: "Начинается подростковый возраст. Гормоны бушуют — жди избирательного слуха и новых проверок правил.",
    },
    emoji: "🐕",
    color: "yellow",
  },
  {
    id: "adolescent",
    ageMinMonths: 12,
    ageMaxMonths: 24,
    label: { en: "Adolescent", ru: "Подросток" },
    ageRange: { en: "1–2 years", ru: "1–2 года" },
    oneLiner: {
      en: "The 'teen' phase. Most dogs surrendered to shelters are this age — patience and consistency now pay off forever.",
      ru: "«Подростковая» фаза. Большинство собак сдают в приют именно в этом возрасте — терпение и постоянство сейчас окупятся навсегда.",
    },
    emoji: "🦴",
    color: "lime",
  },
  {
    id: "adult",
    ageMinMonths: 24,
    ageMaxMonths: 84,
    label: { en: "Adult", ru: "Взрослый" },
    ageRange: { en: "2–7 years", ru: "2–7 лет" },
    oneLiner: {
      en: "Prime years. Maintain training, keep weight ideal, build the routine that will support old age.",
      ru: "Пик жизни. Поддерживай дрессировку, держи вес в норме, строй режим, который поддержит в старости.",
    },
    emoji: "💪",
    color: "green",
  },
  {
    id: "senior",
    ageMinMonths: 84,
    ageMaxMonths: Infinity,
    label: { en: "Senior", ru: "Сеньор" },
    ageRange: { en: "7+ years", ru: "7+ лет" },
    oneLiner: {
      en: "Joint, dental and cognitive care become priority. Vet visits move to twice a year.",
      ru: "Суставы, зубы и когнитивное здоровье выходят на первый план. Визиты к ветеринару — дважды в год.",
    },
    emoji: "🌙",
    color: "slate",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// UNIVERSAL CONTENT (applies to all dog breeds, before breed overrides)
// ─────────────────────────────────────────────────────────────────────────────

export const UNIVERSAL_DOG_CONTENT: Record<LifeStageId, StageContent> = {
  // ─────── NEONATAL 0–2 mo ───────────────────────────────────────────────────
  neonatal: {
    topPriorities: {
      en: [
        "Do not take the puppy home before 8 weeks — full stop.",
        "Verify the breeder gave first deworming and starter vaccine.",
        "Meet the mother on site; observe her temperament and conditions.",
      ],
      ru: [
        "Не забирай щенка раньше 8 недель — без вариантов.",
        "Проверь, что заводчик сделал первую дегельминтизацию и стартовую прививку.",
        "Познакомься с матерью на месте; оцени её темперамент и условия содержания.",
      ],
    },
    training: {
      en: [
        "Training happens with mother and littermates — bite inhibition is learned here.",
        "Visit the litter weekly if possible; let the puppy associate your scent with safety.",
      ],
      ru: [
        "Учится у матери и помёта — именно тут формируется мягкость укуса.",
        "По возможности навещай помёт раз в неделю; пусть твой запах ассоциируется с безопасностью.",
      ],
    },
    care: {
      en: [
        "All care done by breeder: warmth, weight tracking, eye-opening (~14 days), worm prevention.",
        "Plan the home before pickup: crate, x-pen, baby gates, vet booked.",
      ],
      ru: [
        "Весь уход — у заводчика: тепло, контроль веса, открытие глаз (~14 дней), профилактика глистов.",
        "Подготовь дом до приезда: клетка, манеж, ворота, ветеринар записан.",
      ],
    },
    socialization: {
      en: [
        "Breeder should expose litter to gentle handling, household sounds, varied surfaces from week 3.",
        "Avoid taking pup out in public — immune system is still developing.",
      ],
      ru: [
        "Заводчик должен с 3-й недели приучать помёт к аккуратному обращению, бытовым звукам, разным поверхностям.",
        "Не выноси щенка в публичные места — иммунитет ещё формируется.",
      ],
    },
    nutrition: {
      en: [
        "Mother's milk for first 3–4 weeks; weaning food added gradually.",
        "Ask the breeder exactly what brand and schedule pup is on — switch slowly later.",
      ],
      ru: [
        "Молоко матери первые 3–4 недели; прикорм вводится постепенно.",
        "Узнай у заводчика конкретный корм и режим — потом переводи плавно.",
      ],
    },
    dangers: {
      en: [
        "NEVER buy a puppy younger than 8 weeks — separation anxiety and aggression follow for life.",
        "Avoid breeders who refuse home visits or won't show the mother.",
        "Pet-store and online 'puppy mill' pups carry hidden disease and trauma.",
      ],
      ru: [
        "НИКОГДА не покупай щенка младше 8 недель — тревожность разлуки и агрессия останутся на всю жизнь.",
        "Избегай заводчиков, которые не пускают в гости и не показывают мать.",
        "Зоомагазины и онлайн-«фабрики щенков» — скрытые болезни и психотравмы.",
      ],
    },
    vetMilestones: {
      en: [
        "Week 6–8: first 5-in-1 vaccine (DHPP) by breeder's vet.",
        "Week 2, 4, 6, 8: deworming protocol (pyrantel or fenbendazole).",
        "Microchipping commonly done at 7–8 weeks before homing.",
      ],
      ru: [
        "Неделя 6–8: первая вакцина DHPP (5-в-1) у ветеринара заводчика.",
        "Недели 2, 4, 6, 8: протокол дегельминтизации (пирантел или фенбендазол).",
        "Чипирование часто делают в 7–8 недель перед отдачей.",
      ],
    },
    redFlags: {
      en: [
        "Pup is the runt, lethargic, or pot-bellied — request full health screen before commit.",
        "Litter has eye discharge, diarrhoea, or coughs — likely infection passing through.",
        "Breeder pressures fast pickup or skips paperwork — walk away.",
      ],
      ru: [
        "Щенок самый мелкий, вялый или с раздутым животом — потребуй полное обследование до сделки.",
        "У помёта выделения из глаз, понос или кашель — вероятно, инфекция.",
        "Заводчик торопит с забором или пропускает документы — уходи.",
      ],
    },
  },

  // ─────── EARLY PUPPYHOOD 2–4 mo ────────────────────────────────────────────
  puppy_early: {
    topPriorities: {
      en: [
        "Socialization is the #1 job — aim for 100 different positive experiences before 16 weeks.",
        "Establish potty routine: out every 1–2 hours, after every nap, meal and play.",
        "Crate training from day one — a calm crate prevents separation anxiety later.",
      ],
      ru: [
        "Социализация — задача №1. Цель: 100 разных позитивных опытов до 16 недель.",
        "Установи туалетный режим: на улицу каждые 1–2 часа, после каждого сна, еды и игры.",
        "Приучай к клетке с первого дня — спокойная клетка предотвратит тревожность разлуки.",
      ],
    },
    training: {
      en: [
        "Teach name recognition first — 20 repetitions with treat the day pup arrives.",
        "Sit, stay, come, leave-it: 3 short sessions of 2–3 minutes a day, always with food rewards.",
        "Bite inhibition: yelp 'ouch!' and stop play for 30 sec if teeth touch skin. Never hit or scold.",
        "Loose-leash basics: walk inside the house and yard with collar/harness on, treats for slack.",
        "Enrol in a puppy class around 10–12 weeks (after second vaccine) — best money you'll spend.",
      ],
      ru: [
        "Сначала учим имя — 20 повторов с лакомством в день приезда.",
        "Сидеть, ждать, ко мне, фу: 3 коротких сессии по 2–3 мин в день, всегда с пищевым поощрением.",
        "Мягкость укуса: вскрикни «ай!» и прекрати игру на 30 сек, если зубы коснулись кожи. Никогда не бей и не кричи.",
        "Основы поводка: гуляй дома и во дворе с ошейником/шлейкой, давай лакомство за провисший поводок.",
        "Запишись на курсы щенков в 10–12 недель (после 2-й прививки) — лучшая инвестиция.",
      ],
    },
    care: {
      en: [
        "Brush coat 2–3× a week even if short — builds tolerance for grooming for life.",
        "Touch paws, ears, mouth, tail daily — turns vet visits into a non-event.",
        "Bathe only when necessary (every 4–6 weeks) — over-bathing strips coat oils.",
        "Trim nails every 2 weeks with a guillotine or grinder; one nail at a time at first.",
      ],
      ru: [
        "Расчёсывай 2–3 раза в неделю даже короткую шерсть — формируешь терпимость к грумингу на всю жизнь.",
        "Каждый день трогай лапы, уши, рот, хвост — визит к ветеринару станет рутиной.",
        "Купай только при необходимости (раз в 4–6 недель) — лишнее купание смывает защитные масла.",
        "Стриги когти каждые 2 недели гильотинкой или гриндером; сначала по одному.",
      ],
    },
    socialization: {
      en: [
        "Meet 5 new friendly people per week — different ages, genders, hats, beards, uniforms.",
        "Expose to surfaces: tile, grass, gravel, metal grates, wobble boards, sand.",
        "Sounds: vacuum, doorbell, thunder app, traffic, fireworks (low volume + treats).",
        "Car rides 2× per week to fun places, not just the vet — build positive associations.",
        "Until full vaccines, carry pup or use stroller in public; let known healthy dogs greet.",
      ],
      ru: [
        "Знакомь с 5 новыми дружелюбными людьми в неделю — разный возраст, пол, шапки, бороды, форма.",
        "Покажи поверхности: плитка, трава, гравий, металлические решётки, шаткие доски, песок.",
        "Звуки: пылесос, дверной звонок, гром (приложение), движение, фейерверк (тихо + лакомство).",
        "Поездки в машине 2× в неделю в приятные места, не только в клинику — создавай позитивные ассоциации.",
        "До полной вакцинации носи на руках или в коляске; общение — только с проверенно здоровыми собаками.",
      ],
    },
    nutrition: {
      en: [
        "Feed 4 small meals/day until 12 weeks, then drop to 3.",
        "Use the food the breeder used; switch over 7–10 days mixing 25/50/75/100%.",
        "Quality puppy food labelled for breed size (small / medium / large).",
        "Fresh water always; track daily intake — should drink ~60ml per kg of body weight.",
        "Save 1/3 of daily kibble for training rewards.",
      ],
      ru: [
        "Корми 4 раза в день маленькими порциями до 12 недель, потом 3.",
        "Используй корм заводчика; переводи 7–10 дней по схеме 25/50/75/100%.",
        "Качественный щенячий корм с маркировкой для размера породы (мелкая / средняя / крупная).",
        "Свежая вода всегда; следи за объёмом — должен пить ~60 мл на кг веса.",
        "1/3 дневного корма откладывай на поощрения в дрессировке.",
      ],
    },
    dangers: {
      en: [
        "Do NOT visit dog parks before all vaccines complete (~16 weeks) — parvo risk is real and lethal.",
        "Do NOT punish potty accidents — pup links you to fear, hides next pee under furniture.",
        "Do NOT let pup jump off sofas/stairs — growth plates are open, lifelong joint damage possible.",
        "Toxic foods: chocolate, grapes/raisins, xylitol gum, onions, garlic, macadamia, cooked bones.",
        "Do NOT use shock, prong or choke collars — well-documented harm to puppy psyche.",
      ],
      ru: [
        "НЕ води на собачьи площадки до завершения прививок (~16 недель) — парво реален и смертелен.",
        "НЕ наказывай за лужи дома — щенок будет бояться тебя и будет писать под диваном.",
        "НЕ позволяй прыгать с дивана/лестниц — зоны роста открыты, можно повредить суставы на всю жизнь.",
        "Опасная еда: шоколад, виноград/изюм, ксилит, лук, чеснок, макадамия, варёные кости.",
        "НЕ используй электро-, парфорс- или удавки — доказанный вред для психики щенка.",
      ],
    },
    vetMilestones: {
      en: [
        "Week 8–9: 1st DHPP if not done by breeder; deworming.",
        "Week 12: 2nd DHPP, leptospirosis (region-dependent), bordetella for class.",
        "Week 16: final DHPP + rabies; can now safely visit public places.",
        "Discuss flea/tick/heartworm prevention with vet at first visit.",
      ],
      ru: [
        "8–9 нед: 1-я DHPP, если заводчик не сделал; дегельминтизация.",
        "12 нед: 2-я DHPP, лептоспироз (по региону), бордетелла для группы.",
        "16 нед: финальная DHPP + бешенство; можно гулять в общественных местах.",
        "Обсуди защиту от блох/клещей/дирофиляриоза на первом приёме.",
      ],
    },
    redFlags: {
      en: [
        "Lethargy + vomiting + bloody diarrhoea = possible parvo. Vet ER NOW.",
        "Won't eat for 24h or refuses water — emergency at this age.",
        "Persistent coughing or nasal discharge — kennel cough or pneumonia.",
        "Pale gums, weakness — could be hypoglycaemia in toy breeds, rub honey on gums and rush to vet.",
      ],
      ru: [
        "Вялость + рвота + кровавый понос = возможный парво. В скорую ВЕТ-ПОМОЩЬ СЕЙЧАС.",
        "Не ест 24 ч или отказывается от воды — экстренно в этом возрасте.",
        "Постоянный кашель или выделения из носа — питомниковый кашель или пневмония.",
        "Бледные дёсны, слабость — у мелких пород возможна гипогликемия, нанеси мёд на дёсны и срочно в клинику.",
      ],
    },
  },

  // ─────── MID PUPPYHOOD 4–6 mo ──────────────────────────────────────────────
  puppy_mid: {
    topPriorities: {
      en: [
        "Lock in sit/down/stay/come/leave-it with distractions.",
        "Survive teething: provide frozen carrots, rubber Kongs, rotated chew toys.",
        "Continue socialization — the window starts to close around 16–20 weeks.",
      ],
      ru: [
        "Закрепи команды сидеть/лежать/ждать/ко мне/фу с отвлекающими факторами.",
        "Переживи смену зубов: давай мороженую морковь, резиновые конги, ротацию игрушек.",
        "Продолжай социализацию — окно начинает закрываться к 16–20 неделям.",
      ],
    },
    training: {
      en: [
        "Add duration: 'stay' 30 sec, then 1 min, then 2 min.",
        "Add distance: recall from across the room, then yard, then long-line outdoors.",
        "Loose-leash walking outside: stop when leash tightens, treat for returning to side.",
        "Teach 'place'/mat — sends pup to a settle spot, lifesaver for guests.",
        "Practise handling exam: pretend ear cleans, nail trims, gum lifts — daily, 30 seconds.",
      ],
      ru: [
        "Добавляй длительность: «ждать» 30 сек, потом 1 мин, потом 2 мин.",
        "Добавляй дистанцию: подзыв через комнату, потом со двора, потом на длинном поводке на улице.",
        "Прогулка на провисшем поводке: остановись при натяжении, поощри за возврат к ноге.",
        "Учи «место»/коврик — отправляет щенка успокаиваться, спасение при гостях.",
        "Тренируй осмотр: имитируй чистку ушей, стрижку когтей, осмотр дёсен — каждый день по 30 сек.",
      ],
    },
    care: {
      en: [
        "Brush teeth daily with dog toothpaste; never human paste (xylitol is toxic).",
        "Switch to adult feeding schedule of 3 meals/day at 4 months for most breeds.",
        "First professional grooming visit if breed needs it — short, low-stress.",
        "Measure pup monthly; weight should follow breed growth chart.",
      ],
      ru: [
        "Чисти зубы ежедневно собачьей пастой; никогда человеческой (ксилит токсичен).",
        "Переведи на режим взрослого — 3 кормления в день в 4 месяца для большинства пород.",
        "Первая профессиональная стрижка, если порода требует — короткая, без стресса.",
        "Взвешивай ежемесячно; вес должен идти по графику роста породы.",
      ],
    },
    socialization: {
      en: [
        "Now that vaccines are complete, controlled dog parks with vetted dogs.",
        "Group puppy class continues — new dogs every week.",
        "Take to outdoor cafés, hardware stores, vet clinic just for treats.",
        "Practise alone-time: leave for 5 min, then 15, then 30, build slowly.",
      ],
      ru: [
        "После полной вакцинации — контролируемая собачья площадка с проверенными собаками.",
        "Групповые курсы продолжаются — новые собаки каждую неделю.",
        "Води в открытые кафе, хозяйственные магазины, в клинику просто за лакомством.",
        "Тренируй одиночество: уходи на 5 мин, потом 15, потом 30 — наращивай постепенно.",
      ],
    },
    nutrition: {
      en: [
        "3 meals/day; large breeds stay on large-breed puppy food until 12–18 months.",
        "Calories increase with growth spurt — adjust per body condition, not the bag.",
        "Avoid free-feeding — measured portions prevent obesity.",
      ],
      ru: [
        "3 раза в день; крупные породы остаются на корме для крупных щенков до 12–18 мес.",
        "Калории растут на скачке роста — регулируй по упитанности, а не по пакету.",
        "Не оставляй еду в свободном доступе — порционность защищает от ожирения.",
      ],
    },
    dangers: {
      en: [
        "Do NOT force aggressive socialization — bad encounter now creates lifelong reactivity.",
        "Do NOT skip teething chew options — bored pup chews electrical cords and shoes.",
        "Do NOT jog or hike long distances — bones still growing, max 5 min walk per month of age.",
        "Do NOT spay/neuter too early in large breeds (under 12 mo) — affects joint and growth.",
      ],
      ru: [
        "НЕ навязывай агрессивную социализацию — плохая встреча сейчас создаст пожизненную реактивность.",
        "НЕ лишай игрушек для жевания — скучающий щенок грызёт провода и обувь.",
        "НЕ бегай и не ходи в длинные походы — кости ещё растут, максимум 5 мин прогулки на месяц возраста.",
        "НЕ стерилизуй/кастрируй слишком рано крупные породы (до 12 мес) — влияет на суставы и рост.",
      ],
    },
    vetMilestones: {
      en: [
        "5 months: discuss spay/neuter timing — for medium/large breeds wait until growth plates close.",
        "6 months: dental check, oral exam baseline.",
        "Re-evaluate flea/tick/heartworm dosing as weight grows.",
      ],
      ru: [
        "5 мес: обсуди сроки стерилизации/кастрации — средним/крупным породам ждать закрытия зон роста.",
        "6 мес: стоматологический осмотр, базовая оценка ротовой полости.",
        "Пересчитай дозу от блох/клещей/дирофилярий по новому весу.",
      ],
    },
    redFlags: {
      en: [
        "Limping that doesn't resolve in 24h — possible panosteitis (growing pains) or fracture.",
        "Failing to gain weight or sudden weight loss — parasites, GI issue, dietary mismatch.",
        "Sudden fearful/aggressive shift — could be a fear-period; consult trainer fast.",
      ],
      ru: [
        "Хромота, не проходящая за 24 ч — возможен паностеит (боли роста) или перелом.",
        "Не набирает или резко теряет вес — паразиты, ЖКТ, неподходящий корм.",
        "Резкий страх или агрессия — возможно, период страхов; срочно к кинологу.",
      ],
    },
  },

  // ─────── LATE PUPPYHOOD 6–12 mo ────────────────────────────────────────────
  puppy_late: {
    topPriorities: {
      en: [
        "Expect regression — adolescence begins. Stay consistent, don't lower expectations.",
        "Channel energy into structured outlets: sport, nose work, advanced obedience.",
        "Decide spay/neuter timing in consultation with vet, not because 'it's just done'.",
      ],
      ru: [
        "Жди регресса — начинается подростковый период. Будь последователен, не снижай требования.",
        "Направь энергию в структурные занятия: спорт, поиск по запаху, продвинутое послушание.",
        "Решай о стерилизации/кастрации с ветеринаром, а не «потому что так положено».",
      ],
    },
    training: {
      en: [
        "Start a sport: agility, rally, scent work, dock diving, herding — fits energy and breed brain.",
        "Practise impulse control: wait at doors, food bowl wait, 'leave it' with high-value items.",
        "Rock-solid recall: paid every single time with food, no exceptions, even at 1 year.",
        "Public-access manners: sit-stay while owner shops, calm in cafés, polite door-greetings.",
        "If pulling on leash worsens — try front-clip harness; do NOT escalate to prong/e-collar.",
      ],
      ru: [
        "Начни спорт: аджилити, ралли, поиск по запаху, дайвинг, выпас — под энергию и мозг породы.",
        "Тренируй контроль импульса: ждать у двери, ждать у миски, «фу» с ценными предметами.",
        "Железобетонный подзыв: всегда оплачивается едой, без исключений, даже в год.",
        "Манеры в общественных местах: сидеть-ждать, пока хозяин в магазине, спокойствие в кафе.",
        "Если тяга на поводке ухудшается — попробуй фронтальную шлейку; НЕ переходи на парфорс/электро.",
      ],
    },
    care: {
      en: [
        "Adult coat starts coming in 6–9 months — increase brushing.",
        "Switch to adult food at 12–18 months (small breeds earlier, giant breeds later).",
        "Continue daily tooth brushing and weekly ear checks.",
        "First annual booster vaccines due around 12–14 months.",
      ],
      ru: [
        "Взрослая шерсть появляется в 6–9 мес — увеличь частоту вычёсывания.",
        "Переводи на взрослый корм в 12–18 мес (мелкие раньше, гигантские позже).",
        "Продолжай ежедневную чистку зубов и еженедельный осмотр ушей.",
        "Первая годовая ревакцинация — около 12–14 мес.",
      ],
    },
    socialization: {
      en: [
        "Second fear period commonly hits 6–14 months — keep experiences positive, don't push.",
        "If pup spooks at something, don't comfort or punish — be neutral, let them choose to investigate.",
        "Maintain weekly novel experiences — new routes, new dogs, new sounds.",
      ],
      ru: [
        "Второй период страхов чаще в 6–14 мес — держи опыт позитивным, не дави.",
        "Если щенок испугался — не утешай и не наказывай; будь нейтральным, дай самому изучить.",
        "Поддерживай еженедельные новинки — новые маршруты, новые собаки, новые звуки.",
      ],
    },
    nutrition: {
      en: [
        "Switch to 2 meals/day at 6 months for most breeds.",
        "Watch body condition score (BCS): you should feel ribs easily, see waist from above.",
        "Treats stay under 10% of daily calories.",
      ],
      ru: [
        "В 6 мес переведи на 2 кормления в день для большинства пород.",
        "Следи за упитанностью: рёбра должны легко прощупываться, талия видна сверху.",
        "Лакомства — не более 10% дневной калорийности.",
      ],
    },
    dangers: {
      en: [
        "Do NOT assume puppy class was enough — most behaviour issues appear in adolescence.",
        "Do NOT give up training because pup 'forgot everything' — that's the teen brain, push through.",
        "Do NOT let intact males roam — fights and unwanted litters spike at this age.",
        "Limit high-impact play (frisbee, jumps) until growth plates close (12–24 months by breed).",
      ],
      ru: [
        "НЕ думай, что курсов для щенков достаточно — большинство проблем поведения вылазит у подростка.",
        "НЕ бросай дрессировку, потому что «всё забыл» — это подростковый мозг, прорывайся.",
        "НЕ отпускай некастрированных кобелей — драки и нежелательные вязки взлетают в этом возрасте.",
        "Ограничь ударные нагрузки (фрисби, прыжки) до закрытия зон роста (12–24 мес по породе).",
      ],
    },
    vetMilestones: {
      en: [
        "9–12 months: spay/neuter for most medium breeds (large breeds wait 12–24 mo).",
        "12 months: 1-year booster vaccines (DHPP, rabies), heartworm test.",
        "Baseline blood panel at 1 year — gives lifetime comparison data.",
      ],
      ru: [
        "9–12 мес: стерилизация/кастрация для большинства средних пород (крупные ждут 12–24 мес).",
        "12 мес: годовая ревакцинация (DHPP, бешенство), тест на дирофиляриоз.",
        "Базовый анализ крови в 1 год — данные для сравнения на всю жизнь.",
      ],
    },
    redFlags: {
      en: [
        "Resource-guarding (food, toys, people) appearing — get behaviourist NOW, do not punish.",
        "Sudden aggression to family or other dogs — pain check first, then behaviourist.",
        "Excessive water drinking or urination — possible diabetes or kidney issue, vet visit.",
      ],
      ru: [
        "Появилась охрана ресурсов (еды, игрушек, людей) — кинолог-зоопсихолог СЕЙЧАС, не наказывай.",
        "Внезапная агрессия к семье или другим собакам — сначала проверь боль, потом зоопсихолог.",
        "Усиленная жажда или мочеиспускание — возможен диабет или почки, к ветеринару.",
      ],
    },
  },

  // ─────── ADOLESCENT 1–2 yr ──────────────────────────────────────────────────
  adolescent: {
    topPriorities: {
      en: [
        "Survive the teen phase: most surrenders happen at 8–18 months. Patience beats discipline.",
        "Maintain mental + physical exercise; bored adolescent = destroyed sofa.",
        "Lock in social skills with calm adult dogs — your dog learns more from them than from you.",
      ],
      ru: [
        "Переживи подростковый период: больше всего сдают в приют в 8–18 мес. Терпение бьёт строгость.",
        "Поддерживай умственную + физическую нагрузку; скучающий подросток = разорванный диван.",
        "Закрепи социальные навыки общением со спокойными взрослыми собаками — он учится у них больше, чем у тебя.",
      ],
    },
    training: {
      en: [
        "Drill the basics in new locations — generalisation is where adolescents fail.",
        "Expect 'selective deafness' — quietly walk over, attach leash, no scolding.",
        "Continue rewarding recall with high-value treats — don't fade rewards yet.",
        "Add a job: backpack on hikes, find-it games, trick training (10+ tricks).",
        "If reactivity emerges, hire a force-free behaviourist immediately — don't wait.",
      ],
      ru: [
        "Прогоняй основы в новых местах — генерализация — больное место подростков.",
        "Жди «избирательной глухоты» — спокойно подойди, пристегни поводок, без ругани.",
        "Продолжай поощрять подзыв ценным лакомством — не снижай поощрения пока.",
        "Дай работу: рюкзак в походе, игры на поиск, трюки (10+).",
        "Если появилась реактивность — нанимай зоопсихолога без насилия, не жди.",
      ],
    },
    care: {
      en: [
        "Annual professional dental cleaning recommended from age 1–2.",
        "Move to 2 meals/day adult portions; watch weight closely as activity may dip.",
        "Adult coat fully in — heavy shedders may need de-shedding tool weekly.",
      ],
      ru: [
        "С 1–2 лет рекомендуется ежегодная профессиональная чистка зубов.",
        "Перейди на 2 кормления взрослыми порциями; следи за весом — активность может упасть.",
        "Взрослая шерсть полностью на месте — линяющим породам нужен фурминатор раз в неделю.",
      ],
    },
    socialization: {
      en: [
        "Find a stable 'dog mentor' — older calm dog that tolerates teen antics.",
        "Avoid known reactive dogs and chaotic dog parks during this phase.",
        "Practise being calm in busy places — café patios, farmer's markets, vet lobby.",
      ],
      ru: [
        "Найди «собаку-наставника» — старшую спокойную, терпящую подростковые выходки.",
        "Избегай известных реактивных собак и хаотичных площадок в этой фазе.",
        "Тренируй спокойствие в людных местах — кафе, рынки, лобби клиники.",
      ],
    },
    nutrition: {
      en: [
        "Switch fully to adult formula by 12–18 months (24 mo for giants).",
        "Adjust portions if neutered — metabolic rate drops ~20% post-surgery.",
        "Reassess body condition every month for the first year after spay/neuter.",
      ],
      ru: [
        "Полностью переведи на взрослый корм к 12–18 мес (к 24 мес для гигантов).",
        "Скорректируй порции после кастрации — обмен падает ~20% после операции.",
        "Пересматривай упитанность каждый месяц первый год после стерилизации.",
      ],
    },
    dangers: {
      en: [
        "Do NOT 'rehome because of teen phase' — 95% of dogs settle by 24 months if owner stays consistent.",
        "Do NOT escalate to aversive tools — adolescents are emotionally labile; punishment fuels reactivity.",
        "Do NOT skip exercise on busy days — even 15 min mental work prevents household destruction.",
      ],
      ru: [
        "НЕ «отдавай из-за подросткового периода» — 95% собак выравниваются к 24 мес, если хозяин последователен.",
        "НЕ переходи на жёсткие методы — подросток эмоционально нестабилен; наказание усилит реактивность.",
        "НЕ пропускай нагрузки в занятой день — даже 15 мин умственной работы спасут квартиру.",
      ],
    },
    vetMilestones: {
      en: [
        "1-year vaccine boosters + heartworm test.",
        "Annual exam: weight, dental, joint check, lifestyle review.",
        "Lifetime vaccination protocol switches to 3-year boosters after first year for most vaccines.",
      ],
      ru: [
        "Годовая ревакцинация + тест на дирофиляриоз.",
        "Ежегодный осмотр: вес, зубы, суставы, разбор образа жизни.",
        "После 1 года большинство прививок переходит на трёхлетний интервал.",
      ],
    },
    redFlags: {
      en: [
        "Sudden noise phobia or thunderstorm panic — talk to vet about anxiety management.",
        "Repeated tummy upsets — may need diet trial or GI workup.",
        "Behavioural regression that doesn't respond to training in 2 weeks — vet first to rule out pain.",
      ],
      ru: [
        "Резкая боязнь звуков или паника при грозе — обсуди с ветом препараты от тревоги.",
        "Повторяющиеся расстройства ЖКТ — может понадобиться смена корма или обследование.",
        "Поведенческий регресс, не реагирующий на дрессировку 2 недели — сначала к врачу, исключить боль.",
      ],
    },
  },

  // ─────── ADULT 2–7 yr ──────────────────────────────────────────────────────
  adult: {
    topPriorities: {
      en: [
        "Keep weight ideal — even 10% over normal cuts lifespan and predisposes to disease.",
        "Maintain mental stimulation: new tricks every month, walks on new routes.",
        "Annual vet check, dental cleaning, parasite prevention year-round.",
      ],
      ru: [
        "Держи вес в норме — даже +10% сокращают жизнь и провоцируют болезни.",
        "Поддерживай умственную нагрузку: новые трюки каждый месяц, прогулки по новым маршрутам.",
        "Ежегодный осмотр, чистка зубов, защита от паразитов круглый год.",
      ],
    },
    training: {
      en: [
        "Refresh recall and 'leave-it' monthly with real-world distractions.",
        "Teach one new trick per month — it keeps the relationship fresh.",
        "If you got an adult or rescue, treat them like a puppy for the first 3 months — bonds form fast with consistency.",
      ],
      ru: [
        "Освежай подзыв и «фу» ежемесячно с реальными отвлекающими факторами.",
        "Один новый трюк в месяц — освежает отношения.",
        "Если взял взрослую или из приюта — первые 3 месяца обращайся как со щенком; связь укрепится быстро при последовательности.",
      ],
    },
    care: {
      en: [
        "Brush teeth daily; professional cleaning yearly.",
        "Nail trim every 3–4 weeks (or when you hear clicking on floor).",
        "Anal gland check at grooming — only express if vet says so.",
        "Bath every 4–8 weeks depending on coat and lifestyle.",
      ],
      ru: [
        "Чисти зубы ежедневно; профессиональная чистка раз в год.",
        "Когти раз в 3–4 недели (или когда слышен цокот по полу).",
        "Анальные железы проверяй у грумера — выдавливать только по назначению врача.",
        "Купание каждые 4–8 недель в зависимости от шерсти и образа жизни.",
      ],
    },
    socialization: {
      en: [
        "Daily walks meeting calm dogs; avoid forced group play if your dog prefers solo.",
        "Keep meeting new people occasionally — even adult dogs lose social skills if isolated.",
        "Travel with the dog when possible — new environments keep the brain plastic.",
      ],
      ru: [
        "Ежедневные прогулки со встречами спокойных собак; не навязывай группу, если он одиночка.",
        "Иногда знакомь с новыми людьми — даже взрослые собаки теряют навыки в изоляции.",
        "Бери в поездки по возможности — новая среда сохраняет пластичность мозга.",
      ],
    },
    nutrition: {
      en: [
        "Adult maintenance formula; quality protein, moderate fat.",
        "2 measured meals/day; treats <10% of daily calories.",
        "Reassess weight every 3 months — adjust portions, not the food brand.",
        "Add joint supplements (glucosamine, omega-3) from age 5 for breeds with hip/joint risk.",
      ],
      ru: [
        "Корм поддерживающего качества; качественный белок, умеренный жир.",
        "2 порционных кормления в день; лакомства <10% дневной калорийности.",
        "Пересматривай вес каждые 3 месяца — меняй порции, не марку.",
        "С 5 лет добавляй суставные добавки (глюкозамин, омега-3) породам с риском по суставам.",
      ],
    },
    dangers: {
      en: [
        "Do NOT over-exercise on hot days — heat stroke kills fast, especially flat-faced breeds.",
        "Do NOT leave food unattended — adult dogs counter-surf and steal toxic foods.",
        "Do NOT skip annual heartworm test even with prevention — resistance is rising.",
        "Do NOT use human painkillers (ibuprofen, paracetamol) — fatal to dogs.",
      ],
      ru: [
        "НЕ перегружай в жару — тепловой удар убивает быстро, особенно брахицефалов.",
        "НЕ оставляй еду без присмотра — взрослая собака ворует со стола, опасно для жизни.",
        "НЕ пропускай ежегодный тест на дирофиляриоз даже на профилактике — устойчивость растёт.",
        "НЕ давай человеческие обезболивающие (ибупрофен, парацетамол) — смертельны для собак.",
      ],
    },
    vetMilestones: {
      en: [
        "Annual exam + blood/urine baseline starting at age 4.",
        "Dental cleaning under anaesthesia every 12–18 months.",
        "Year-round flea/tick/heartworm prevention.",
        "Update microchip details if you move.",
      ],
      ru: [
        "Ежегодный осмотр + кровь/моча с 4 лет.",
        "Чистка зубов под наркозом каждые 12–18 мес.",
        "Защита от блох/клещей/дирофилярий круглый год.",
        "Обновляй данные чипа при переезде.",
      ],
    },
    redFlags: {
      en: [
        "Unexplained weight loss or gain >5% in a month — bloodwork.",
        "Lethargy more than 2 days — never normal in a healthy adult.",
        "Lumps growing fast or changing — aspiration biopsy.",
        "Bloated belly + retching = bloat emergency in deep-chested breeds — ER NOW.",
      ],
      ru: [
        "Необъяснимая потеря или набор веса >5% за месяц — анализы крови.",
        "Вялость дольше 2 дней — не норма для здоровой взрослой собаки.",
        "Шишки быстро растут или меняются — пункция-биопсия.",
        "Раздутый живот + позывы к рвоте = заворот желудка у пород с глубокой грудью — В СКОРУЮ.",
      ],
    },
  },

  // ─────── SENIOR 7+ yr ──────────────────────────────────────────────────────
  senior: {
    topPriorities: {
      en: [
        "Vet visits every 6 months with bloodwork — early disease detection adds years.",
        "Joint support: ramps, non-slip rugs, orthopaedic bed, glucosamine, low-impact exercise.",
        "Cognitive enrichment: short training sessions, puzzle toys, daily sniff walks.",
      ],
      ru: [
        "Осмотр у ветеринара каждые 6 мес с анализами — ранняя диагностика добавляет годы.",
        "Поддержка суставов: пандусы, нескользящие коврики, ортопедический лежак, глюкозамин, мягкие нагрузки.",
        "Когнитивное обогащение: короткие занятия, головоломки, ежедневные нюхательные прогулки.",
      ],
    },
    training: {
      en: [
        "Short positive sessions (3–5 min) keep brain sharp and slow cognitive decline.",
        "Refresh recall and stay — but accept slower response times.",
        "Hand signals in addition to verbals — many seniors lose hearing first.",
      ],
      ru: [
        "Короткие позитивные занятия (3–5 мин) сохраняют мозг и тормозят когнитивный спад.",
        "Освежай подзыв и ждать — но прими, что реакция медленнее.",
        "Используй жесты вместе с голосом — многие сеньоры теряют слух первым.",
      ],
    },
    care: {
      en: [
        "Brush teeth daily; senior dental disease is the #1 silent cause of pain.",
        "Trim nails more often — older dogs walk less, nails wear less.",
        "Soft warm bed away from drafts; ramps for couch/car/bed.",
        "Monitor lumps weekly; photograph and date any new ones for vet comparison.",
        "Maintain a fixed routine — change is harder for older dogs.",
      ],
      ru: [
        "Чисти зубы ежедневно; стоматология у сеньора — №1 скрытая причина боли.",
        "Когти стриги чаще — пожилая собака меньше ходит, меньше стирает.",
        "Мягкая тёплая лежанка вдали от сквозняков; пандусы к дивану/машине/кровати.",
        "Раз в неделю проверяй шишки; фотографируй новые с датой для сравнения у врача.",
        "Поддерживай постоянный режим — старшим тяжелее переносить перемены.",
      ],
    },
    socialization: {
      en: [
        "Continue gentle social contact; isolation accelerates cognitive decline.",
        "Avoid energetic puppies that pester — old dogs need calm company.",
        "If a new pet joins household, manage introductions slowly — seniors need their own quiet space.",
      ],
      ru: [
        "Поддерживай мягкое общение; изоляция ускоряет когнитивный спад.",
        "Избегай энергичных щенков, которые пристают — старшим нужна спокойная компания.",
        "Если появляется новый питомец, знакомь постепенно — у сеньора должно быть тихое личное пространство.",
      ],
    },
    nutrition: {
      en: [
        "Senior or weight-management formula; lower calories, higher quality protein.",
        "Add fish oil (EPA/DHA) for joints, brain and coat — vet to confirm dose.",
        "Wet food or warm water over kibble if dental pain limits eating.",
        "Smaller frequent meals if appetite or digestion drops.",
      ],
      ru: [
        "Сеньорский или для контроля веса корм; меньше калорий, выше качество белка.",
        "Добавь рыбий жир (EPA/DHA) для суставов, мозга и шерсти — дозировку с ветом.",
        "Влажный корм или тёплая вода в сухой, если из-за зубов больно есть.",
        "Меньшие частые кормления, если падает аппетит или пищеварение.",
      ],
    },
    dangers: {
      en: [
        "Do NOT assume slowing down is 'just age' — pain and disease look like laziness.",
        "Do NOT skip dental work because 'too old for anaesthesia' — modern protocols are safe; rotten teeth are dangerous.",
        "Do NOT over-exercise; long walks become 2 short walks; swimming is gold.",
        "Do NOT change food, bed, or routine drastically — sudden change can trigger anxiety.",
      ],
      ru: [
        "НЕ списывай замедление на «просто возраст» — боль и болезни маскируются под лень.",
        "НЕ отказывайся от чистки зубов из-за «возраст для наркоза» — современные протоколы безопасны; гнилые зубы опаснее.",
        "НЕ перегружай; длинные прогулки замени двумя короткими; плавание — золото.",
        "НЕ меняй резко корм, лежанку или режим — резкие перемены вызывают тревогу.",
      ],
    },
    vetMilestones: {
      en: [
        "Twice-yearly exams from age 7 (or age 5 for giant breeds).",
        "Annual full blood panel, urinalysis, thyroid, blood pressure.",
        "Discuss end-of-life quality scoring with vet around age 10 — easier to plan calmly.",
        "Mobility assessment — ask about laser therapy, hydrotherapy, acupuncture.",
      ],
      ru: [
        "С 7 лет — осмотры дважды в год (с 5 лет для гигантских пород).",
        "Ежегодно полная биохимия, моча, щитовидка, давление.",
        "Около 10 лет — обсуди с ветом критерии качества жизни; легче планировать спокойно.",
        "Оценка подвижности — спроси о лазер- и гидротерапии, акупунктуре.",
      ],
    },
    redFlags: {
      en: [
        "Disorientation, getting stuck in corners, sleep-cycle flip = canine cognitive dysfunction.",
        "Sudden head tilt, circling = vestibular episode — usually treatable but ER-worthy.",
        "Coughing at night = possible heart disease in small breeds.",
        "Increased thirst & urination = kidney disease or diabetes; full panel ASAP.",
      ],
      ru: [
        "Дезориентация, застревание в углах, сбит цикл сна = когнитивная дисфункция собаки.",
        "Резкий наклон головы, хождение по кругу = вестибулярный эпизод — обычно лечится, но в скорую.",
        "Ночной кашель = возможна болезнь сердца у мелких пород.",
        "Усиленная жажда и мочеиспускание = болезнь почек или диабет; срочно полный анализ.",
      ],
    },
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// BREED OVERRIDES (the 20% that's breed-specific)
// Grouped by archetype so we don't repeat ourselves 20 times.
// ─────────────────────────────────────────────────────────────────────────────

export const BREED_OVERRIDES: BreedOverride[] = [
  {
    breedIds: ["french-bulldog"],
    archetype: { en: "Brachycephalic (flat-faced)", ru: "Брахицефал (плоскомордый)" },
    always: {
      en: [
        "Never let body temperature rise — heat stroke is the #1 killer of this breed.",
        "Use harness, never collar — pressure on the trachea worsens breathing.",
        "Flying is high-risk — many airlines ban brachycephalic dogs.",
        "Snoring + open-mouth panting at rest = vet check for BOAS syndrome.",
      ],
      ru: [
        "Никогда не допускай перегрева — тепловой удар убийца №1 для этой породы.",
        "Только шлейка, никаких ошейников — давление на трахею ухудшает дыхание.",
        "Перелёт — высокий риск; многие авиакомпании запрещают брахицефалов.",
        "Храп + дыхание с открытой пастью в покое = к врачу проверять BOAS.",
      ],
    },
    stages: {
      puppy_early: {
        dangers: {
          en: [
            "Heat above 25°C is dangerous — walk only morning/evening.",
            "Do NOT swim unsupervised — heavy head sinks fast.",
            "Avoid stairs and high jumps — spinal disc disease risk lifelong.",
          ],
          ru: [
            "Температура выше 25°C опасна — гуляй только утром и вечером.",
            "НЕ оставляй без присмотра у воды — тяжёлая голова тянет на дно.",
            "Избегай лестниц и высоких прыжков — риск болезни межпозвоночных дисков на всю жизнь.",
          ],
        },
      },
      adult: {
        care: {
          en: [
            "Clean face folds daily with vet-approved wipe — prevents bacterial infection.",
            "Ear cleaning weekly — narrow canals trap wax.",
          ],
          ru: [
            "Каждый день протирай складки на морде вет-салфеткой — профилактика инфекции.",
            "Уши чистить раз в неделю — узкие каналы задерживают серу.",
          ],
        },
      },
    },
  },

  {
    breedIds: ["boxer"],
    archetype: { en: "Athletic brachycephalic", ru: "Атлетичный брахицефал" },
    always: {
      en: [
        "Hereditary cardiomyopathy risk — annual cardiac screen from age 4.",
        "Heat-sensitive despite athletic build — exercise in cool hours.",
        "High cancer rate — feel for lumps monthly.",
      ],
      ru: [
        "Наследственная кардиомиопатия — ежегодное обследование сердца с 4 лет.",
        "Чувствителен к жаре, несмотря на атлетичность — нагрузка в прохладные часы.",
        "Высокий риск онкологии — щупай шишки ежемесячно.",
      ],
    },
    stages: {},
  },

  {
    breedIds: ["husky", "samoyed", "akita"],
    archetype: { en: "Northern / spitz", ru: "Северная / шпиц" },
    always: {
      en: [
        "Genetic urge to run — escape-proof yard and rock-solid recall are non-negotiable.",
        "Coat blows 2× per year — daily brushing during shed, never shave (ruins coat & insulation).",
        "Stubborn-by-design — short positive training sessions, not battles of will.",
        "Cool-climate dog — limit exercise above 20°C, plenty of shade and water.",
      ],
      ru: [
        "Генетическая страсть к бегу — побегоустойчивый двор и железный подзыв обязательны.",
        "Линька 2 раза в год — ежедневное вычёсывание; никогда не брей (портится шерсть и теплоизоляция).",
        "Упрямство в крови — короткие позитивные занятия, не битва воль.",
        "Холодолюбивая порода — ограничь нагрузку при >20°C, тень и вода обязательны.",
      ],
    },
    stages: {
      puppy_late: {
        training: {
          en: [
            "Recall practice on a 10m long-line ONLY — off-leash is unsafe for life with this breed.",
            "Hire a positive trainer with husky/spitz experience — generic obedience often fails this group.",
          ],
          ru: [
            "Подзыв тренируй ТОЛЬКО на длинном поводке 10м — без поводка с этой породой небезопасно всю жизнь.",
            "Найди позитивного кинолога с опытом по хаски/шпицам — стандартное послушание часто не работает.",
          ],
        },
      },
    },
  },

  {
    breedIds: ["german-shepherd", "doberman", "rottweiler", "boxer"],
    archetype: { en: "Working guardian", ru: "Рабочая охранная" },
    always: {
      en: [
        "Early intense socialization is mandatory — un-socialized guardians become liabilities.",
        "Mental jobs prevent neurosis — scent work, advanced obedience, protection sport with pro.",
        "Bond is intense; do not leave alone all day — separation issues guaranteed.",
      ],
      ru: [
        "Ранняя интенсивная социализация обязательна — несоциализированный охранник = опасность.",
        "Умственная работа предотвращает невроз — поиск по запаху, продвинутое послушание, защитный спорт с инструктором.",
        "Привязанность сильная; не оставляй одного на весь день — гарантированы проблемы разлуки.",
      ],
    },
    stages: {
      adolescent: {
        training: {
          en: [
            "Reactivity often peaks 14–22 months — work with force-free behaviourist if barking/lunging starts.",
            "Build 'watch me' + 'find it' as default responses to triggers.",
          ],
          ru: [
            "Реактивность часто пиковая в 14–22 мес — работай с зоопсихологом без насилия, если начался лай/выпады.",
            "Сделай «смотри на меня» + «найди» автоматическим ответом на триггеры.",
          ],
        },
      },
    },
  },

  {
    breedIds: ["border-collie", "australian-shepherd", "corgi"],
    archetype: { en: "Herding", ru: "Пастушья" },
    always: {
      en: [
        "Mental exhaustion matters more than physical — 30 min puzzle work beats 2h walk.",
        "Nipping at heels of running children = herding instinct, not aggression — redirect, never punish.",
        "Without a job they invent one (chase shadows, herd cats, bark at vacuum).",
        "Light/shadow obsession can become OCD — interrupt early, never laser-pointer.",
      ],
      ru: [
        "Умственная усталость важнее физической — 30 мин головоломок лучше 2 ч прогулки.",
        "Покусывание пяток у бегущих детей = пастуший инстинкт, не агрессия — переключай, не наказывай.",
        "Без работы они её придумают (гонять тени, пасти котов, лаять на пылесос).",
        "Одержимость светом/тенью может стать ОКР — пресекай рано, никогда не лазерная указка.",
      ],
    },
    stages: {
      puppy_mid: {
        training: {
          en: [
            "Start trick training in earnest — these dogs learn 5 tricks a week if you let them.",
            "Introduce a sport: agility foundations, treibball, herding instinct test.",
          ],
          ru: [
            "Начинай трюки всерьёз — эти собаки учат по 5 трюков в неделю, если дать.",
            "Введи спорт: основы аджилити, трейббол, тест на пастуший инстинкт.",
          ],
        },
      },
    },
  },

  {
    breedIds: ["dachshund"],
    archetype: { en: "Long-back hound (IVDD risk)", ru: "Длинноспинная (риск дископатии)" },
    always: {
      en: [
        "One in four dachshunds suffers spinal disc disease — manage like spinal patient from day one.",
        "Use stairs RAMPS for couch and bed — never let jump on/off furniture.",
        "Keep weight strictly ideal — every extra gram crushes the spine.",
        "Pick up only by supporting chest AND rear — never just under armpits.",
      ],
      ru: [
        "Каждая 4-я такса страдает дископатией — относись как к позвоночному пациенту с первого дня.",
        "Используй пандусы к дивану и кровати — никогда не давай прыгать с мебели.",
        "Держи вес строго в норме — каждый лишний грамм давит на позвоночник.",
        "Поднимай только поддерживая грудь И зад — никогда не за подмышки.",
      ],
    },
    stages: {
      puppy_late: {
        dangers: {
          en: [
            "Sudden back pain, dragging legs, hunched back = IVDD episode — vet ER within hours.",
            "Avoid puppy parks with rough play — back injury can paralyse.",
          ],
          ru: [
            "Резкая боль в спине, волочение ног, сутулость = эпизод дископатии — в ВЕТ СКОРУЮ в течение часов.",
            "Избегай щенячьих площадок с грубой игрой — травма спины может парализовать.",
          ],
        },
      },
    },
  },

  {
    breedIds: ["chihuahua", "yorkshire-terrier"],
    archetype: { en: "Toy breed (fragile)", ru: "Той-порода (хрупкая)" },
    always: {
      en: [
        "Hypoglycaemia risk in puppies — feed small meals every 4 hours, carry honey when out.",
        "Bones fracture from sofa jumps — provide ramps, never let kids carry alone.",
        "Tracheal collapse risk — harness only, never neck collar.",
        "Cold-sensitive — coat for winter walks below 10°C is not vanity, it's welfare.",
      ],
      ru: [
        "Риск гипогликемии у щенков — корми малыми порциями каждые 4 ч, носи мёд на прогулке.",
        "Кости ломаются от прыжков с дивана — пандусы, не давай детям носить одних.",
        "Риск коллапса трахеи — только шлейка, никаких ошейников на шею.",
        "Чувствительны к холоду — комбинезон ниже 10°C это не понты, это забота.",
      ],
    },
    stages: {
      puppy_early: {
        nutrition: {
          en: [
            "Feed every 3–4 hours; missed meal can trigger fatal hypoglycaemia.",
            "Keep Nutri-Cal or honey at hand for emergencies.",
          ],
          ru: [
            "Корми каждые 3–4 ч; пропущенное кормление может вызвать смертельную гипогликемию.",
            "Держи Nutri-Cal или мёд под рукой на экстренный случай.",
          ],
        },
      },
    },
  },

  {
    breedIds: ["golden-retriever", "labrador"],
    archetype: { en: "Sporting retriever", ru: "Спортивный ретривер" },
    always: {
      en: [
        "Will eat ANYTHING — counter-surf-proof your kitchen and stay strict with portions.",
        "Hip & elbow dysplasia risk — PennHIP screening at 6 months helps planning.",
        "Floppy ears trap moisture — check and dry after every swim.",
        "Goldens: lifetime cancer risk ~60% — feel for lumps monthly from age 4.",
      ],
      ru: [
        "Съест ВСЁ — защити кухню от воровства и строго порционируй еду.",
        "Риск дисплазии локтей и тазобедренных — обследование PennHIP в 6 мес помогает планированию.",
        "Висячие уши задерживают влагу — проверяй и суши после каждого купания.",
        "Голдены: пожизненный риск онкологии ~60% — щупай шишки ежемесячно с 4 лет.",
      ],
    },
    stages: {
      adult: {
        nutrition: {
          en: [
            "Obesity is the #1 health threat — keep ribs easily palpable, visible waist.",
            "Treat budget: pieces of carrot, green bean, plain cooked chicken — not commercial chews.",
          ],
          ru: [
            "Ожирение — угроза №1 здоровью — рёбра должны прощупываться, талия видна.",
            "Бюджет лакомств: морковь, стручковая фасоль, отварная курица без соли — не магазинные жевалки.",
          ],
        },
      },
    },
  },

  {
    breedIds: ["poodle", "cavalier"],
    archetype: { en: "Companion / coated", ru: "Компаньон / шерстяная" },
    always: {
      en: [
        "Professional grooming every 4–6 weeks — coat mats fast if neglected.",
        "Daily ear check — long coated ears trap moisture and yeast.",
        "Poodles: low-shed but NOT hypoallergenic; matting causes skin pain.",
        "Cavaliers: 50%+ develop mitral valve disease — annual cardiac exam from age 5.",
      ],
      ru: [
        "Профессиональный груминг каждые 4–6 недель — шерсть быстро сваляется, если запустить.",
        "Ежедневный осмотр ушей — длинная шерсть на ушах задерживает влагу и грибок.",
        "Пудели: мало линяют, но НЕ гипоаллергенны; колтуны болят на коже.",
        "Кавалеры: 50%+ заболевают митральным клапаном — ежегодное обследование сердца с 5 лет.",
      ],
    },
    stages: {},
  },

  {
    breedIds: ["beagle"],
    archetype: { en: "Scenthound", ru: "Гончая по запаху" },
    always: {
      en: [
        "Nose runs the brain — off-leash is unsafe; baited recall fails when a scent appears.",
        "Bay/howl is breed-default — apartment neighbours hate this; train 'quiet' early.",
        "Food-motivated to extreme — bulletproof container or counter-surf is permanent.",
        "Loose-leash walking is hardest of all breeds — use front-clip harness from puppyhood.",
      ],
      ru: [
        "Нос управляет мозгом — без поводка опасно; подзыв ломается, как только появился запах.",
        "Вой/гав по умолчанию — соседи в квартире страдают; учи «тихо» с раннего возраста.",
        "Экстремально мотивирован едой — герметичные контейнеры, иначе воровство навсегда.",
        "Прогулка на провисшем поводке — сложнее всех пород — используй фронтальную шлейку со щенка.",
      ],
    },
    stages: {},
  },

  {
    breedIds: ["shiba-inu"],
    archetype: { en: "Primitive / independent", ru: "Примитивная / независимая" },
    always: {
      en: [
        "Independent thinker — not for first-time owners; obedience is suggestion-based.",
        "Famous 'Shiba scream' when restrained — desensitise to handling from week 1.",
        "Same-sex aggression common — careful with second dog of same gender.",
        "Off-leash is risky — sight-and-chase drive overrides recall.",
      ],
      ru: [
        "Независимый мыслитель — не для новичков; послушание держится на «предложении».",
        "Знаменитый «крик сибы» при удержании — приучай к рукам с 1-й недели.",
        "Однополая агрессия — осторожно со второй собакой того же пола.",
        "Без поводка рискованно — инстинкт «увидел–погнал» перебивает подзыв.",
      ],
    },
    stages: {},
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// HELPER FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────────

/** Get the life stage for a given age in years (supports fractional ages). */
export function getStageForAge(ageYears: number): LifeStage {
  const months = ageYears * 12;
  return (
    LIFE_STAGES.find((s) => months >= s.ageMinMonths && months < s.ageMaxMonths) ??
    LIFE_STAGES[LIFE_STAGES.length - 1]
  );
}

/** Get the next life stage (or null if at senior). */
export function getNextStage(currentStageId: LifeStageId): LifeStage | null {
  const idx = LIFE_STAGES.findIndex((s) => s.id === currentStageId);
  if (idx === -1 || idx === LIFE_STAGES.length - 1) return null;
  return LIFE_STAGES[idx + 1];
}

/** Find all overrides that apply to a given breed id. */
export function getBreedOverrides(breedId: string): BreedOverride[] {
  return BREED_OVERRIDES.filter((o) => o.breedIds.includes(breedId));
}

/** Merge universal stage content with breed-specific overrides (append, don't replace). */
export function getStageContent(stageId: LifeStageId, breedId?: string): StageContent {
  const base = UNIVERSAL_DOG_CONTENT[stageId];
  if (!breedId) return base;
  const overrides = getBreedOverrides(breedId);
  if (overrides.length === 0) return base;

  // Deep-clone the base so we don't mutate it.
  const merged: StageContent = JSON.parse(JSON.stringify(base));

  // Each override adds to the merged result (don't replace — extend).
  for (const override of overrides) {
    const stageOverride = override.stages[stageId];
    if (!stageOverride) continue;
    for (const key of Object.keys(stageOverride) as (keyof StageContent)[]) {
      const additions = stageOverride[key];
      if (!additions) continue;
      merged[key] = {
        en: [...merged[key].en, ...additions.en],
        ru: [...merged[key].ru, ...additions.ru],
      };
    }
  }

  return merged;
}

/** Collect breed-wide notes (apply at every stage). */
export function getBreedAlwaysNotes(breedId: string): { archetype: LocaleString; always: LocaleArray }[] {
  return getBreedOverrides(breedId).map((o) => ({ archetype: o.archetype, always: o.always }));
}
