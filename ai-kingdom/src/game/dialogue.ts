/**
 * Local dialogue system.
 *
 * Produces short, in-character officer lines from a structured situation:
 * personality (speech style), the order, its risk, troop state, the officer's
 * relationship with the player and recent memories. No LLM — weighted template
 * pools with deterministic variation so lines rarely repeat verbatim. A future
 * DialogueProvider can swap this for an LLM without touching game logic.
 */

import type {
  DialogueContext,
  DialogueProvider,
  MissingField,
  Officer,
  SpeechStyle,
} from "./types";
import { UNIT_LABELS_GENITIVE } from "./constants";
import { dominantMemory } from "./memory";
import { formatMinutes } from "./util";

/** Deterministic pick so a given situation yields a stable but varied line. */
function seedFrom(ctx: DialogueContext): number {
  const o = ctx.officer.id.length * 7 + ctx.officer.memory.length * 13;
  const orderPart = ctx.order ? ctx.order.id.length * 17 + ctx.order.action.length : 0;
  return (o + orderPart + Math.floor(ctx.state.tick)) >>> 0;
}

function pick(list: string[], seed: number): string {
  if (list.length === 0) return "";
  return list[seed % list.length];
}

function targetName(ctx: DialogueContext): string {
  const id = ctx.order?.targetLocationId;
  const loc = ctx.state.locations.find((l) => l.id === id);
  return loc ? loc.name : "позицию";
}

function troopPhrase(ctx: DialogueContext): string {
  const order = ctx.order;
  if (!order || order.unitCount == null || !order.unitType) return "мои люди";
  return `${order.unitCount} ${UNIT_LABELS_GENITIVE[order.unitType]}`;
}

/** Is the officer cool towards the player right now? */
function isCold(officer: Officer): boolean {
  return officer.traits.resentment > 45 || officer.traits.respectForPlayer < 35;
}

function isWarm(officer: Officer): boolean {
  return officer.traits.respectForPlayer > 72 && officer.traits.resentment < 25;
}

/* ------------------------------------------------------------------ */

export class LocalDialogueProvider implements DialogueProvider {
  officerAcknowledge(ctx: DialogueContext): string {
    const seed = seedFrom(ctx);
    const target = targetName(ctx);
    const troops = troopPhrase(ctx);
    const cold = isCold(ctx.officer);

    const byStyle: Record<SpeechStyle, string[]> = {
      stoic: cold
        ? [
            `Как прикажете, милорд. ${troops} будут у цели.`,
            `Исполню. Надеюсь, на сей раз вы знаете, что делаете.`,
            `Слушаюсь. Займём ${target}.`,
          ]
        : [
            `Приказ ясен, милорд. Мои люди займут ${target}.`,
            `Будет исполнено. ${troops} выступают немедленно.`,
            `Понял вас. Держим курс на ${target}.`,
          ],
      brash: cold
        ? [
            `Ладно. Сделаю, раз уж настаиваете.`,
            `Как скажете. Только не жалуйтесь на способ.`,
            `Хорошо. ${target} будет наша.`,
          ]
        : [
            `Наконец достойная задача! Я ударю прежде, чем они поймут, что случилось.`,
            `С радостью, милорд. ${target} падёт к рассвету.`,
            `Отличный приказ! ${troops} со мной — идём.`,
          ],
      analytic: cold
        ? [
            `Принято. Отмечаю, что риск вы берёте на себя.`,
            `Исполнимо. Последствия — на вашей совести, милорд.`,
            `Хорошо. Займусь ${target}.`,
          ]
        : [
            `Исполнить можно. Займусь ${target} без промедления.`,
            `Разумно. ${troops} — оптимальный наряд для этой задачи.`,
            `Принято к исполнению. Расчёт времени уже готовлю.`,
          ],
      gruff: cold
        ? [
            `Ладно. Сделаем. Только потом не спрашивайте, отчего колчаны пусты.`,
            `Как скажете. Стрелы найдут ${target} — если доживём.`,
            `Понял. Займём ${target}.`,
          ]
        : [
            `Дело понятное, милорд. ${target} будет под нашими стрелами.`,
            `Годный приказ. ${troops} — и ни одна лестница не встанет к стене.`,
            `Сделаем чисто. Держим ${target}.`,
          ],
      courtly: cold
        ? [
            `Как будет угодно, милорд. Хотя двор запомнит и это решение.`,
            `Исполню. Надеюсь, цена не ляжет на плечи простого люда.`,
            `Хорошо. Займусь ${target}.`,
          ]
        : [
            `С честью, милорд. ${target} не останется без защиты.`,
            `Мудрое распоряжение. Я всё устрою — и люди, и припасы будут готовы.`,
            `Как подобает, милорд. ${troops} выступят достойно.`,
          ],
    };
    return pick(byStyle[ctx.officer.speechStyle], seed);
  }

  officerWarning(ctx: DialogueContext): string {
    const seed = seedFrom(ctx);
    const target = targetName(ctx);
    const eta = ctx.extra?.eta != null ? formatMinutes(Number(ctx.extra.eta)) : null;

    const byStyle: Record<SpeechStyle, string[]> = {
      stoic: [
        `Милорд, я исполню приказ, но без подкрепления мы не удержим ${target} долго.`,
        `Осмелюсь предупредить: людей слишком мало. Потери будут тяжёлыми.`,
        `Позиция опасна, милорд. Если вы настаиваете — я останусь до конца.`,
      ],
      brash: [
        `Рискованно, но я не из трусливых. Прикажете — сделаю.`,
        `Это почти самоубийство, милорд. Впрочем, слава того стоит.`,
        `Мы можем не вернуться. Но если прикажете — я поведу их сам.`,
      ],
      analytic: [
        `Расчёт неутешителен: шанс удержать позицию мал. Настаиваете?`,
        `Предупреждаю: после этого приказа резервов почти не останется.`,
        `Цифры против нас, милорд. Решение за вами, но я обязана сказать.`,
      ],
      gruff: [
        `Скажу прямо, милорд: людей мало, а стрел ещё меньше. Долго не простоим.`,
        `Это гиблое место. Прикажете стоять — будем стоять, но полягут многие.`,
        `Стена стеной, а без подкрепления её проломят. Ваше слово.`,
      ],
      courtly: [
        `Милорд, боюсь, эта цена ляжет на весь двор. Вы уверены?`,
        `Осмелюсь предостеречь: народ не простит напрасных потерь. Но решать вам.`,
        `Я исполню, милорд, однако прошу взвесить — резервов почти не останется.`,
      ],
    };
    let line = pick(byStyle[ctx.officer.speechStyle], seed);
    if (eta) line += ` Прибудем через ${eta}.`;
    return line;
  }

  officerQuestion(ctx: DialogueContext, field: MissingField): string {
    const seed = seedFrom(ctx);
    const questions: Record<MissingField, string[]> = {
      unitCount: [
        "Сколько людей мне взять, милорд?",
        "С каким отрядом выступать? Назовите число.",
        "Сколько воинов повести за собой?",
      ],
      target: [
        "Куда именно направить людей, милорд?",
        "Укажите цель — куда выдвигаться?",
        "К какой позиции держать путь?",
      ],
      officer: ["Кому адресован приказ, милорд?", "Кто должен это исполнить?"],
      action: [
        "Не вполне понял приказ. Что мне сделать?",
        "Уточните, милорд, — какова задача?",
      ],
      unitType: ["Какими войсками, милорд?", "Кого выслать — пехоту, лучников или конницу?"],
    };
    return pick(questions[field], seed);
  }

  officerReport(ctx: DialogueContext): string {
    const seed = seedFrom(ctx);
    const text = ctx.extra?.report ? String(ctx.extra.report) : "";
    if (text) return text;
    const target = targetName(ctx);
    const byStyle: Record<SpeechStyle, string[]> = {
      stoic: [`Милорд, ${target} за нами. Позиция занята.`, `Докладываю: приказ выполнен.`],
      brash: [`Сделано, милорд! ${target} наша.`, `Дело закрыто. Что дальше?`],
      analytic: [`Задача выполнена. Докладываю по ${target}.`, `Исполнено в срок.`],
      gruff: [`${target} держим, милорд. Стрелы на месте.`, `Сделано. Позиция пристреляна.`],
      courtly: [`${target} под нашим приглядом, милорд.`, `Исполнено. Двор может быть спокоен.`],
    };
    return pick(byStyle[ctx.officer.speechStyle], seed);
  }

  officerStatus(ctx: DialogueContext): string {
    const seed = seedFrom(ctx);
    const report = ctx.extra?.report ? String(ctx.extra.report) : "";
    if (report) {
      const opener: Record<SpeechStyle, string[]> = {
        stoic: ["Докладываю, милорд. ", "Обстановка такова. "],
        brash: ["Слушайте, милорд. ", "Коротко: "],
        analytic: ["По моим данным. ", "Сводка: "],
        gruff: ["Как есть, милорд. ", "Без прикрас: "],
        courtly: ["Извольте, милорд. ", "Позвольте доложить: "],
      };
      return pick(opener[ctx.officer.speechStyle], seed) + report;
    }
    return "Пока докладывать нечего, милорд.";
  }

  officerAdvice(ctx: DialogueContext): string {
    const seed = seedFrom(ctx);
    const advice = ctx.extra?.advice ? String(ctx.extra.advice) : "";
    if (advice) return advice;
    const byStyle: Record<SpeechStyle, string[]> = {
      stoic: [
        "Мой совет — беречь мост. Там нас не обойти.",
        "Не распыляйте силы, милорд. Крепкая оборона надёжнее лихой атаки.",
      ],
      brash: [
        "Мой совет — бить первыми. Кто медлит, тот проигрывает.",
        "Дайте мне конницу и открытый фланг — остальное я сделаю.",
      ],
      analytic: [
        "Сначала разведка, милорд. Слепой удар — половина поражения.",
        "Проверьте снабжение, прежде чем растягивать оборону.",
      ],
      gruff: [
        "Мой совет — посадите лучников на холмы, а мост держите щитами. Пусть лезут под стрелы.",
        "Готовьте стены и колья, милорд. Пусть враг разобьётся о нашу оборону сам.",
      ],
      courtly: [
        "Мой совет — сперва спасите людей и припасы деревни, милорд. Верное сердце народа дороже пяди земли.",
        "Не растрачивайте казну и жизни впустую. Крепкий тыл выигрывает долгие ночи.",
      ],
    };
    return pick(byStyle[ctx.officer.speechStyle], seed);
  }

  officerInitiative(ctx: DialogueContext): string {
    const seed = seedFrom(ctx);
    const byStyle: Record<SpeechStyle, string[]> = {
      stoic: [
        "Милорд, вижу возможность. Прошу разрешения действовать.",
        "Открылась брешь. Разрешите воспользоваться, пока не поздно?",
      ],
      brash: [
        "Милорд, враг открыл фланг! Разрешите атаковать?",
        "Они подставились! Дайте слово — и я обрушусь на них!",
      ],
      analytic: [
        "Наблюдаю тактическую возможность. Рекомендую действовать — разрешите?",
        "Окно короткое, милорд. Прошу санкции на манёвр.",
      ],
      gruff: [
        "Милорд, они скучились — залп ляжет точно. Разрешите бить?",
        "Хороший угол открылся. Прикажете — и стрелы найдут их.",
      ],
      courtly: [
        "Милорд, представился случай. С вашего дозволения — я им воспользуюсь.",
        "Момент удачен, милорд. Позвольте распорядиться — двор поймёт.",
      ],
    };
    const warm = isWarm(ctx.officer) ? " Вы знаете — я вас не подведу." : "";
    return pick(byStyle[ctx.officer.speechStyle], seed) + warm;
  }
}

export const localDialogue = new LocalDialogueProvider();

/** A short mood colour used in the officer panel, driven by recent memory. */
export function officerMoodLine(officer: Officer): string {
  const mem = dominantMemory(officer);
  if (officer.traits.resentment > 55) return "Затаил обиду.";
  if (officer.traits.respectForPlayer > 75) return "Верит в вас.";
  if (mem) return mem.description;
  if (officer.traits.stress > 60) return "На пределе.";
  return "Готов служить.";
}
