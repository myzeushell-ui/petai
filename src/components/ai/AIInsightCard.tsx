"use client";

import { motion } from "framer-motion";
import { AlertTriangle, Lightbulb, TrendingUp, Star, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { AIInsight } from "@/types";

interface AIInsightCardProps {
  insight: AIInsight;
  index?: number;
}

const typeConfig = {
  health_alert: {
    icon: AlertTriangle,
    variant: "danger" as const,
    label: "Health Alert",
    bg: "bg-red-50",
    border: "border-red-100",
  },
  recommendation: {
    icon: Lightbulb,
    variant: "info" as const,
    label: "Recommendation",
    bg: "bg-blue-50",
    border: "border-blue-100",
  },
  trend: {
    icon: TrendingUp,
    variant: "warning" as const,
    label: "Health Trend",
    bg: "bg-yellow-50",
    border: "border-yellow-100",
  },
  praise: {
    icon: Star,
    variant: "success" as const,
    label: "Good News",
    bg: "bg-green-50",
    border: "border-green-100",
  },
};

export function AIInsightCard({ insight, index = 0 }: AIInsightCardProps) {
  const config = typeConfig[insight.type];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className={`${config.border} border`}>
        <CardContent className={`${config.bg} rounded-2xl pt-5`}>
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-white shadow-sm">
              <Icon className="h-4 w-4 text-gray-600" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant={config.variant}>{config.label}</Badge>
                <span className="text-xs text-gray-400">
                  {Math.round(insight.confidence * 100)}% confidence
                </span>
              </div>
              <h4 className="mt-1.5 text-sm font-semibold text-gray-900">{insight.title}</h4>
              <p className="mt-1 text-sm leading-relaxed text-gray-600">{insight.body}</p>

              {insight.sources && insight.sources.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {insight.sources.map((source) => (
                    <span
                      key={source}
                      className="rounded-md bg-white/70 px-2 py-0.5 text-xs text-gray-500"
                    >
                      {source}
                    </span>
                  ))}
                </div>
              )}

              {insight.actionable && insight.action && (
                <div className="mt-3">
                  <Button size="sm" variant="outline" className="text-xs">
                    <ExternalLink className="h-3 w-3" />
                    {insight.action}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
