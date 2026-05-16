"use client";

import { motion } from "framer-motion";
import { FlaskConical, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getStatusColor, formatDate } from "@/lib/utils";
import type { LabResult, LabPanel } from "@/types";

interface LabResultsProps {
  results: LabResult[];
}

function PanelRow({ panel, index }: { panel: LabPanel; index: number }) {
  const isHigh = panel.status === "high" || panel.status === "critical";
  const isLow = panel.status === "low";
  const isNormal = panel.status === "normal";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: index * 0.04 }}
      className={`flex items-center justify-between rounded-lg px-3 py-2 ${
        !isNormal ? "bg-yellow-50/60" : "bg-gray-50/60"
      }`}
    >
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-800 truncate">{panel.name}</p>
        <p className="text-xs text-gray-400">
          Ref: {panel.referenceMin}–{panel.referenceMax} {panel.unit}
        </p>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <span className={`text-sm font-semibold ${isHigh ? "text-red-600" : isLow ? "text-blue-600" : "text-gray-900"}`}>
          {panel.value} {panel.unit}
        </span>
        {isHigh ? (
          <TrendingUp className="h-3.5 w-3.5 text-red-500" />
        ) : isLow ? (
          <TrendingDown className="h-3.5 w-3.5 text-blue-500" />
        ) : (
          <Minus className="h-3.5 w-3.5 text-green-400" />
        )}
        <span className={`text-xs px-1.5 py-0.5 rounded-md font-medium ${getStatusColor(panel.status)}`}>
          {panel.status}
        </span>
      </div>
    </motion.div>
  );
}

export function LabResults({ results }: LabResultsProps) {
  if (results.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <FlaskConical className="mx-auto h-10 w-10 text-gray-200" />
          <p className="mt-3 text-sm font-medium text-gray-500">No lab results yet</p>
          <p className="text-xs text-gray-400">Upload your pet&apos;s lab report to get AI analysis</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {results.map((result) => (
        <Card key={result.id}>
          <CardHeader>
            <div className="flex items-start justify-between gap-2">
              <div>
                <CardTitle>{result.testName}</CardTitle>
                <CardDescription>
                  {result.labName} · {formatDate(result.testDate)}
                </CardDescription>
              </div>
              <Badge
                variant={
                  result.status === "normal"
                    ? "success"
                    : result.status === "borderline"
                      ? "warning"
                      : result.status === "critical"
                        ? "danger"
                        : "warning"
                }
              >
                {result.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {result.aiAnalysis && (
              <div className="rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm">🤖</span>
                  <p className="text-xs font-semibold text-indigo-700 uppercase tracking-wide">
                    AI Analysis
                  </p>
                </div>
                <p className="text-sm leading-relaxed text-gray-700">{result.aiAnalysis}</p>
              </div>
            )}

            <div className="space-y-1.5">
              {result.panels.map((panel, i) => (
                <PanelRow key={panel.name} panel={panel} index={i} />
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
