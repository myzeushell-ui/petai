"use client";

import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import { HealthTimeline } from "@/components/health/HealthTimeline";
import { healthEvents } from "@/data/healthEvents";

export default function TimelinePage() {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Clock className="h-6 w-6 text-purple-500" />
          Health Timeline
        </h1>
        <p className="text-sm text-gray-500">Complete medical history — vaccines, checkups, labs & more</p>
      </motion.div>

      <HealthTimeline events={healthEvents} />
    </div>
  );
}
