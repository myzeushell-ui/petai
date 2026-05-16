"use client";

import { motion } from "framer-motion";
import { Shield, Activity, Scale, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { getHealthScoreCategory } from "@/types";
import type { Pet } from "@/types";

interface PetProfileProps {
  pet: Pet;
}

const speciesEmoji: Record<string, string> = {
  dog: "🐕",
  cat: "🐱",
  rabbit: "🐇",
  bird: "🐦",
  other: "🐾",
};

export function PetProfile({ pet }: PetProfileProps) {
  const category = getHealthScoreCategory(pet.healthScore);

  const categoryConfig = {
    excellent: { label: "Excellent", variant: "success" as const, color: "text-green-600" },
    good: { label: "Good", variant: "info" as const, color: "text-blue-600" },
    fair: { label: "Fair", variant: "warning" as const, color: "text-yellow-600" },
    poor: { label: "Needs Care", variant: "danger" as const, color: "text-red-600" },
  };

  const config = categoryConfig[category];

  const scoreColor =
    pet.healthScore >= 85
      ? "bg-green-500"
      : pet.healthScore >= 70
        ? "bg-blue-500"
        : pet.healthScore >= 50
          ? "bg-yellow-500"
          : "bg-red-500";

  return (
    <Card className="overflow-hidden">
      <div className="h-2 w-full" style={{ backgroundColor: pet.color }} />
      <CardContent className="pt-5">
        <div className="flex items-start gap-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl text-3xl shadow-sm"
            style={{ backgroundColor: `${pet.color}20` }}
          >
            {speciesEmoji[pet.species]}
          </motion.div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl font-bold text-gray-900">{pet.name}</h2>
              <Badge variant={config.variant}>{config.label}</Badge>
              {pet.neutered && (
                <Badge variant="default">{pet.gender === "female" ? "Spayed" : "Neutered"}</Badge>
              )}
            </div>
            <p className="text-sm text-gray-500">
              {pet.breed} · {pet.gender === "female" ? "♀" : "♂"} · {pet.age} years old
            </p>
          </div>
        </div>

        <div className="mt-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-700">Health Score</span>
            </div>
            <span className={`text-lg font-bold ${config.color}`}>{pet.healthScore}/100</span>
          </div>
          <Progress value={pet.healthScore} indicatorClassName={scoreColor} />
        </div>

        <div className="mt-4 grid grid-cols-3 gap-3">
          <div className="rounded-xl bg-gray-50 p-3 text-center">
            <Scale className="mx-auto h-4 w-4 text-gray-400" />
            <p className="mt-1 text-sm font-semibold text-gray-900">
              {pet.weight} {pet.weightUnit}
            </p>
            <p className="text-xs text-gray-500">Weight</p>
          </div>
          <div className="rounded-xl bg-gray-50 p-3 text-center">
            <Calendar className="mx-auto h-4 w-4 text-gray-400" />
            <p className="mt-1 text-sm font-semibold text-gray-900">{pet.age} yrs</p>
            <p className="text-xs text-gray-500">Age</p>
          </div>
          <div className="rounded-xl bg-gray-50 p-3 text-center">
            <Shield className="mx-auto h-4 w-4 text-gray-400" />
            <p className="mt-1 text-sm font-semibold text-gray-900">
              {pet.neutered ? "Yes" : "No"}
            </p>
            <p className="text-xs text-gray-500">
              {pet.gender === "female" ? "Spayed" : "Neutered"}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
