"use client";

import { motion } from "framer-motion";
import {
  Syringe,
  Stethoscope,
  Scissors,
  Pill,
  AlertCircle,
  FlaskConical,
  FileText,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import type { HealthEvent } from "@/types";

interface HealthTimelineProps {
  events: HealthEvent[];
}

const typeConfig = {
  vaccination: { icon: Syringe, color: "bg-blue-100 text-blue-600", label: "Vaccination" },
  checkup: { icon: Stethoscope, color: "bg-green-100 text-green-600", label: "Checkup" },
  surgery: { icon: Scissors, color: "bg-red-100 text-red-600", label: "Surgery" },
  medication: { icon: Pill, color: "bg-purple-100 text-purple-600", label: "Medication" },
  symptom: { icon: AlertCircle, color: "bg-orange-100 text-orange-600", label: "Symptom" },
  lab: { icon: FlaskConical, color: "bg-cyan-100 text-cyan-600", label: "Lab Test" },
  note: { icon: FileText, color: "bg-gray-100 text-gray-600", label: "Note" },
};

const severityVariant = {
  low: "success" as const,
  medium: "warning" as const,
  high: "danger" as const,
};

export function HealthTimeline({ events }: HealthTimelineProps) {
  const sorted = [...events].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Health Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative space-y-4">
          <div className="absolute left-5 top-0 h-full w-px bg-gray-100" />
          {sorted.map((event, i) => {
            const config = typeConfig[event.type];
            const Icon = config.icon;

            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                className="flex gap-4"
              >
                <div
                  className={`relative z-10 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${config.color} ring-2 ring-white`}
                >
                  <Icon className="h-4 w-4" />
                </div>

                <div className="flex-1 rounded-xl border border-gray-100 bg-white p-3 shadow-sm">
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{event.title}</p>
                      {event.vetName && (
                        <p className="text-xs text-gray-500">
                          {event.vetName}
                          {event.clinicName && ` · ${event.clinicName}`}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      {event.severity && (
                        <Badge variant={severityVariant[event.severity]}>
                          {event.severity}
                        </Badge>
                      )}
                      {event.resolved && (
                        <Badge variant="success">Resolved</Badge>
                      )}
                    </div>
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-gray-500 line-clamp-2">
                    {event.description}
                  </p>
                  <p className="mt-1.5 text-xs text-gray-400">{formatDate(event.date)}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
