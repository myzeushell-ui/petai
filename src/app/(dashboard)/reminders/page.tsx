"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Bell, Check, Calendar, Repeat, GraduationCap, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { reminders } from "@/data/reminders";
import { getUpbringingRemindersForPet } from "@/data/upbringingReminders";
import { getStageForAge } from "@/data/upbringing";
import { formatDate } from "@/lib/utils";
import type { Reminder } from "@/types";
import { usePet } from "@/contexts/PetContext";
import { useLocale } from "@/contexts/LocaleContext";
import { t, type LocaleString } from "@/lib/i18n";

const typeEmoji: Record<Reminder["type"], string> = {
  medication: "💊",
  vaccination: "💉",
  checkup: "🩺",
  grooming: "✂️",
  custom: "📌",
};

const priorityVariant: Record<string, "danger" | "warning" | "default"> = {
  high: "danger",
  medium: "warning",
  low: "default",
};

const UI = {
  title:         { en: "Reminders",          ru: "Напоминания" },
  pending:       { en: "pending",            ru: "ожидают" },
  completed:     { en: "completed",          ru: "выполнено" },
  completedHdr:  { en: "Completed",          ru: "Выполнено" },
  stageHdr:      { en: "Suggested for life stage", ru: "Рекомендации по этапу жизни" },
  stageSub:      { en: "Auto-generated for", ru: "Автогенерация для" },
  base:          { en: "Your reminders",     ru: "Ваши напоминания" },
  due:           { en: "Due",                ru: "Срок" },
  priorityHigh:  { en: "high",               ru: "высокий" },
  priorityMed:   { en: "medium",             ru: "средний" },
  priorityLow:   { en: "low",                ru: "низкий" },
};

const priorityLabel: Record<string, LocaleString> = {
  high:   { en: "high",   ru: "высокий" },
  medium: { en: "medium", ru: "средний" },
  low:    { en: "low",    ru: "низкий" },
};

const intervalLabel: Record<string, LocaleString> = {
  daily:   { en: "daily",   ru: "ежедневно" },
  weekly:  { en: "weekly",  ru: "еженедельно" },
  monthly: { en: "monthly", ru: "ежемесячно" },
  yearly:  { en: "yearly",  ru: "ежегодно" },
};

export default function RemindersPage() {
  const { activePet } = usePet();
  const { locale } = useLocale();

  // Stage-appropriate auto-generated reminders for the active pet
  const upbringingReminders = useMemo(
    () => getUpbringingRemindersForPet(activePet, locale),
    [activePet, locale]
  );

  const stage = activePet.species === "dog" ? getStageForAge(activePet.age) : null;

  const pending = reminders.filter((r) => !r.completed);
  const completed = reminders.filter((r) => r.completed);

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Bell className="h-6 w-6 text-orange-500" />
          {t(UI.title, locale)}
        </h1>
        <p className="text-sm text-gray-500">
          {pending.length + upbringingReminders.length} {t(UI.pending, locale)} · {completed.length} {t(UI.completed, locale)}
        </p>
      </motion.div>

      {/* ── Auto-generated upbringing reminders ── */}
      {upbringingReminders.length > 0 && stage && (
        <motion.section
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="rounded-2xl border border-emerald-200 dark:border-emerald-900 bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-950/40 dark:to-gray-900 p-4"
        >
          <div className="flex items-start gap-3 mb-3">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-emerald-500 text-white shadow-md">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <Sparkles className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                <h2 className="text-sm font-bold text-emerald-900 dark:text-emerald-200 uppercase tracking-wide">
                  {t(UI.stageHdr, locale)}
                </h2>
              </div>
              <p className="text-xs text-emerald-700 dark:text-emerald-400 mt-0.5">
                {t(UI.stageSub, locale)} <span className="font-bold">{activePet.name}</span> · {stage.emoji} {t(stage.label, locale)} ({t(stage.ageRange, locale)})
              </p>
            </div>
          </div>

          <div className="space-y-2">
            {upbringingReminders.map((reminder, i) => (
              <motion.div
                key={reminder.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.08 + i * 0.04 }}
                className="rounded-xl bg-white dark:bg-gray-800 border border-emerald-100 dark:border-emerald-900/50 p-3"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-lg">
                    {typeEmoji[reminder.type]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{reminder.title}</p>
                      <Badge variant={priorityVariant[reminder.priority]} className="text-[10px]">
                        {t(priorityLabel[reminder.priority], locale)}
                      </Badge>
                      {reminder.recurring && reminder.recurringInterval && (
                        <span className="flex items-center gap-1 text-xs text-gray-400">
                          <Repeat className="h-3 w-3" />
                          {t(intervalLabel[reminder.recurringInterval], locale)}
                        </span>
                      )}
                    </div>
                    {reminder.description && (
                      <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                        {reminder.description}
                      </p>
                    )}
                    <div className="mt-1.5 flex items-center gap-1.5 text-[11px] text-gray-500 dark:text-gray-400">
                      <Calendar className="h-3 w-3" />
                      {t(UI.due, locale)}: {formatDate(reminder.dueDate)}
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="text-gray-400 hover:text-emerald-600 flex-shrink-0 h-8 w-8">
                    <Check className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}

      {/* ── Existing user reminders ── */}
      <div>
        <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">
          {t(UI.base, locale)}
        </p>
        <div className="space-y-3">
          {pending.map((reminder, i) => (
            <motion.div
              key={reminder.id}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.07 }}
            >
              <Card>
                <CardContent className="pt-4">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gray-50 dark:bg-gray-800 text-xl">
                      {typeEmoji[reminder.type]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{reminder.title}</p>
                        <Badge variant={priorityVariant[reminder.priority]}>{t(priorityLabel[reminder.priority], locale)}</Badge>
                        {reminder.recurring && reminder.recurringInterval && (
                          <span className="flex items-center gap-1 text-xs text-gray-400">
                            <Repeat className="h-3 w-3" />
                            {t(intervalLabel[reminder.recurringInterval], locale)}
                          </span>
                        )}
                      </div>
                      {reminder.description && (
                        <p className="mt-0.5 text-xs text-gray-500 line-clamp-2">
                          {reminder.description}
                        </p>
                      )}
                      <div className="mt-2 flex items-center gap-1.5 text-xs text-gray-500">
                        <Calendar className="h-3.5 w-3.5" />
                        {t(UI.due, locale)}: {formatDate(reminder.dueDate)}
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="text-gray-400 hover:text-green-600 flex-shrink-0">
                      <Check className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {completed.length > 0 && (
        <div>
          <p className="mb-2 text-sm font-medium text-gray-400">{t(UI.completedHdr, locale)}</p>
          <div className="space-y-2 opacity-60">
            {completed.map((reminder) => (
              <Card key={reminder.id}>
                <CardContent className="pt-3 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{typeEmoji[reminder.type]}</span>
                    <p className="text-sm text-gray-500 line-through">{reminder.title}</p>
                    <Check className="ml-auto h-4 w-4 text-green-500" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
