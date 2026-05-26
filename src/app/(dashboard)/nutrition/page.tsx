"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { usePet } from "@/contexts/PetContext";
import { getNutritionPlan, getFoodRecommendations, type FoodItem } from "@/data/nutrition";
import { Star, AlertTriangle, Utensils, Apple, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/contexts/LocaleContext";

function FoodCard({ food, index }: { food: FoodItem; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="pt-4">
          <div className="flex gap-3">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gray-50 dark:bg-gray-800 text-2xl">
              {food.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white text-sm">{food.name}</h4>
                  <p className="text-xs text-gray-500">{food.brand} · {food.type === "dry" ? "Dry" : food.type === "wet" ? "Wet" : food.type === "raw" ? "Raw" : "Supplement"}</p>
                </div>
                <div className="flex items-center gap-1 text-xs text-yellow-600">
                  <Star className="h-3.5 w-3.5 fill-yellow-400" />
                  {food.rating}
                </div>
              </div>

              <div className="mt-2 space-y-1.5">
                <div className="flex items-center gap-2 text-xs">
                  <span className="w-12 text-gray-400">Protein</span>
                  <Progress value={food.proteinPercent} max={50} className="h-1.5 flex-1" indicatorClassName="bg-red-400" />
                  <span className="w-8 text-right font-medium text-gray-700 dark:text-gray-300">{food.proteinPercent}%</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="w-12 text-gray-400">Fat</span>
                  <Progress value={food.fatPercent} max={30} className="h-1.5 flex-1" indicatorClassName="bg-yellow-400" />
                  <span className="w-8 text-right font-medium text-gray-700 dark:text-gray-300">{food.fatPercent}%</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="w-12 text-gray-400">Fiber</span>
                  <Progress value={food.fiberPercent} max={10} className="h-1.5 flex-1" indicatorClassName="bg-green-400" />
                  <span className="w-8 text-right font-medium text-gray-700 dark:text-gray-300">{food.fiberPercent}%</span>
                </div>
              </div>

              <div className="mt-2 flex items-center justify-between">
                <p className="text-xs text-gray-400">
                  {food.topIngredients.slice(0, 3).join(", ")}
                </p>
                <p className="text-xs font-semibold text-green-600">{food.price}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function NutritionPage() {
  const { activePet } = usePet();
  const { locale } = useLocale();
  const [tab, setTab] = useState<"plan" | "food">("plan");

  // Determine size from breed/weight
  const petSize = activePet.weight > 25 ? "large" : activePet.weight > 10 ? "medium" : "small";
  const petActivity = activePet.species === "dog" ? "high" : "medium";

  const plan = getNutritionPlan(
    activePet.species as "dog" | "cat",
    activePet.age,
    petSize,
    petActivity
  );

  const foods = getFoodRecommendations(
    activePet.species as "dog" | "cat",
    activePet.breed
  );

  return (
    <div className="space-y-5">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Utensils className="h-6 w-6 text-orange-500" />
          {locale === "ru" ? "Питание" : "Nutrition"}
        </h1>
        <p className="text-sm text-gray-500">
          {locale === "ru" ? "Сбалансированное питание для" : "Balanced diet for"} {activePet.name} — {activePet.breed}, {activePet.age}{locale === "ru" ? " г" : "y"}, {activePet.weight} {locale === "ru" ? "кг" : "kg"}
        </p>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setTab("plan")}
          className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-medium transition-colors ${
            tab === "plan" ? "bg-green-500 text-white" : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
          }`}
        >
          <Apple className="h-3.5 w-3.5" /> Diet plan
        </button>
        <button
          onClick={() => setTab("food")}
          className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-medium transition-colors ${
            tab === "food" ? "bg-green-500 text-white" : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
          }`}
        >
          <ShoppingCart className="h-3.5 w-3.5" /> Food recommendations
        </button>
      </div>

      {tab === "plan" && plan && (
        <div className="space-y-4">
          {/* Macros overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                📊 Daily target
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-orange-50 dark:bg-orange-950/30 p-3 text-center">
                  <p className="text-2xl font-bold text-orange-600">{plan.dailyCalories.split("-")[0]}</p>
                  <p className="text-[10px] text-orange-500 mt-0.5">kcal/day (min)</p>
                </div>
                <div className="rounded-xl bg-green-50 dark:bg-green-950/30 p-3 text-center">
                  <p className="text-2xl font-bold text-green-600">{plan.meals}</p>
                  <p className="text-[10px] text-green-500 mt-0.5">meals/day</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">Protein</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{plan.protein}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">Fat</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{plan.fat}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">Fiber</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{plan.fiber}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                ✅ Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {plan.recommendations.map((rec, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300"
                  >
                    <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/40 text-green-600 text-xs">
                      {i + 1}
                    </span>
                    {rec}
                  </motion.li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Avoid */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                Avoid these foods
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {plan.avoid.map((item) => (
                  <Badge key={item} variant="danger" className="text-xs">{item}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {tab === "plan" && !plan && (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-gray-400 text-sm">No nutrition plan matches this profile. Talk to a nutritionist.</p>
            <Button variant="default" size="sm" className="mt-3">
              Book a nutritionist
            </Button>
          </CardContent>
        </Card>
      )}

      {tab === "food" && (
        <div className="space-y-3">
          <p className="text-xs text-gray-400">{foods.length} foods match {activePet.breed}</p>
          {foods.map((food, i) => (
            <FoodCard key={food.id} food={food} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
