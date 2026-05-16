"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getHealthScoreCategory } from "@/types";

interface HealthScoreProps {
  score: number;
  previousScore?: number;
}

export function HealthScore({ score, previousScore }: HealthScoreProps) {
  const category = getHealthScoreCategory(score);
  const diff = previousScore !== undefined ? score - previousScore : undefined;

  const categoryConfig = {
    excellent: {
      label: "Excellent Health",
      description: "Your pet is in great shape! Keep up the fantastic care.",
      emoji: "🌟",
      gradient: "from-green-400 to-emerald-600",
      ring: "ring-green-200",
    },
    good: {
      label: "Good Health",
      description: "Your pet is healthy with a few things to watch.",
      emoji: "✅",
      gradient: "from-blue-400 to-blue-600",
      ring: "ring-blue-200",
    },
    fair: {
      label: "Fair Health",
      description: "Some health items need attention soon.",
      emoji: "⚠️",
      gradient: "from-yellow-400 to-orange-500",
      ring: "ring-yellow-200",
    },
    poor: {
      label: "Needs Care",
      description: "Please consult your vet as soon as possible.",
      emoji: "🏥",
      gradient: "from-red-400 to-red-600",
      ring: "ring-red-200",
    },
  };

  const config = categoryConfig[category];

  const circumference = 2 * Math.PI * 54;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Health Score</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-6">
          <div className={`relative flex-shrink-0 ring-4 ${config.ring} rounded-full`}>
            <svg width="128" height="128" viewBox="0 0 128 128">
              <circle cx="64" cy="64" r="54" fill="none" stroke="#f3f4f6" strokeWidth="12" />
              <motion.circle
                cx="64"
                cy="64"
                r="54"
                fill="none"
                stroke="url(#scoreGradient)"
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                transform="rotate(-90 64 64)"
              />
              <defs>
                <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#4ade80" />
                  <stop offset="100%" stopColor="#22c55e" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.span
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.4 }}
                className="text-3xl font-black text-gray-900"
              >
                {score}
              </motion.span>
              <span className="text-xs font-medium text-gray-400">/ 100</span>
            </div>
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{config.emoji}</span>
              <h3 className="text-base font-bold text-gray-900">{config.label}</h3>
            </div>
            <p className="mt-1 text-sm text-gray-500">{config.description}</p>

            {diff !== undefined && (
              <div className="mt-3 flex items-center gap-1.5">
                {diff > 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-500" />
                ) : diff < 0 ? (
                  <TrendingDown className="h-4 w-4 text-red-500" />
                ) : (
                  <Minus className="h-4 w-4 text-gray-400" />
                )}
                <span
                  className={`text-sm font-medium ${
                    diff > 0 ? "text-green-600" : diff < 0 ? "text-red-600" : "text-gray-500"
                  }`}
                >
                  {diff > 0 ? `+${diff}` : diff} from last month
                </span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
