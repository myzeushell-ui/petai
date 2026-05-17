"use client";

import { motion } from "framer-motion";
import { PetProfile } from "@/components/pet/PetProfile";
import { HealthScore } from "@/components/health/HealthScore";
import { AIInsightCard } from "@/components/ai/AIInsightCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { primaryPet } from "@/data/demoPets";
import { aiInsights } from "@/data/aiInsights";
import { reminders } from "@/data/reminders";
import { formatDate } from "@/lib/utils";
import { Bell, ArrowRight, Calendar } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const urgentReminders = reminders
    .filter((r) => !r.completed && r.priority === "high")
    .slice(0, 3);

  const topInsights = aiInsights.slice(0, 2);

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Good morning, Alex 👋
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Here&apos;s how {primaryPet.name} is doing today</p>
      </motion.div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1 space-y-6">
          <PetProfile pet={primaryPet} />
          <HealthScore score={primaryPet.healthScore} previousScore={83} />
        </div>

        <div className="lg:col-span-2 space-y-6">
          {/* Upcoming Reminders */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-4 w-4 text-orange-500" />
                  Upcoming Reminders
                </CardTitle>
                <Link href="/reminders">
                  <Button variant="ghost" size="sm" className="text-xs">
                    View all <ArrowRight className="h-3 w-3" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {urgentReminders.map((reminder) => (
                <div
                  key={reminder.id}
                  className="flex items-center gap-3 rounded-xl border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-3"
                >
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-white dark:bg-gray-700 shadow-sm">
                    <Calendar className="h-4 w-4 text-gray-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{reminder.title}</p>
                    <p className="text-xs text-gray-500">{formatDate(reminder.dueDate)}</p>
                  </div>
                  <Badge variant={reminder.priority === "high" ? "danger" : "warning"}>
                    {reminder.priority}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* AI Insights */}
          <div>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <span>🤖</span> AI Health Insights
              </h2>
              <Link href="/assistant">
                <Button variant="ghost" size="sm" className="text-xs">
                  Ask AI <ArrowRight className="h-3 w-3" />
                </Button>
              </Link>
            </div>
            <div className="space-y-3">
              {topInsights.map((insight, i) => (
                <AIInsightCard key={insight.id} insight={insight} index={i} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
