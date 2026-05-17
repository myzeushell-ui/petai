"use client";

import { motion } from "framer-motion";
import { Bell, Check, Calendar, Repeat } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { reminders } from "@/data/reminders";
import { formatDate } from "@/lib/utils";
import type { Reminder } from "@/types";

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

export default function RemindersPage() {
  const pending = reminders.filter((r) => !r.completed);
  const completed = reminders.filter((r) => r.completed);

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Bell className="h-6 w-6 text-orange-500" />
          Reminders
        </h1>
        <p className="text-sm text-gray-500">
          {pending.length} pending · {completed.length} completed
        </p>
      </motion.div>

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
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gray-50 text-xl">
                    {typeEmoji[reminder.type]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{reminder.title}</p>
                      <Badge variant={priorityVariant[reminder.priority]}>{reminder.priority}</Badge>
                      {reminder.recurring && (
                        <span className="flex items-center gap-1 text-xs text-gray-400">
                          <Repeat className="h-3 w-3" />
                          {reminder.recurringInterval}
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
                      Due: {formatDate(reminder.dueDate)}
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

      {completed.length > 0 && (
        <div>
          <p className="mb-2 text-sm font-medium text-gray-400">Completed</p>
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
