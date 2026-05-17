"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, ChevronDown, Heart, Home, Dumbbell, Scissors, Baby, Dog, Cat, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { allBreeds, type Breed } from "@/data/breeds";

const sizeLabels: Record<string, string> = { small: "Small", medium: "Medium", large: "Large", giant: "Giant" };
const activityLabels: Record<string, string> = { low: "Low", medium: "Medium", high: "High", very_high: "Very high" };
const groomingLabels: Record<string, string> = { low: "Minimal", medium: "Moderate", high: "Demanding" };

function BreedCard({ breed, index }: { breed: Breed; index: number }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
    >
      <Card className="overflow-hidden hover:shadow-md transition-shadow">
        <CardContent className="pt-4">
          <button onClick={() => setExpanded(!expanded)} className="w-full text-left">
            <div className="flex items-start gap-3">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gray-50 dark:bg-gray-800 text-2xl">
                {breed.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm truncate">{breed.name}</h3>
                  <Badge variant={breed.species === "dog" ? "success" : "info"} className="text-[10px]">
                    {breed.species === "dog" ? "Dog" : "Cat"}
                  </Badge>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">{breed.origin}</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {breed.traits.slice(0, 3).map((t) => (
                    <span key={t} className="rounded-full bg-gray-100 dark:bg-gray-800 px-2 py-0.5 text-[10px] text-gray-600 dark:text-gray-300">{t}</span>
                  ))}
                </div>
              </div>
              <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform flex-shrink-0 ${expanded ? "rotate-180" : ""}`} />
            </div>
          </button>

          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="mt-4 border-t border-gray-100 dark:border-gray-700 pt-4 space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="rounded-lg bg-gray-50 dark:bg-gray-800 p-2">
                      <p className="text-gray-400">Size</p>
                      <p className="font-medium text-gray-900 dark:text-white">{sizeLabels[breed.size]}</p>
                    </div>
                    <div className="rounded-lg bg-gray-50 dark:bg-gray-800 p-2">
                      <p className="text-gray-400">Weight</p>
                      <p className="font-medium text-gray-900 dark:text-white">{breed.weight}</p>
                    </div>
                    <div className="rounded-lg bg-gray-50 dark:bg-gray-800 p-2">
                      <p className="text-gray-400">Lifespan</p>
                      <p className="font-medium text-gray-900 dark:text-white">{breed.lifespan}</p>
                    </div>
                    <div className="rounded-lg bg-gray-50 dark:bg-gray-800 p-2">
                      <p className="text-gray-400">Activity</p>
                      <p className="font-medium text-gray-900 dark:text-white">{activityLabels[breed.activity]}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {breed.goodWithKids && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-green-50 dark:bg-green-950/40 px-2 py-0.5 text-[10px] text-green-700 dark:text-green-400">
                        <Baby className="h-3 w-3" /> Kids
                      </span>
                    )}
                    {breed.goodWithPets && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 text-[10px] text-blue-700 dark:text-blue-400">
                        <Heart className="h-3 w-3" /> Other pets
                      </span>
                    )}
                    {breed.apartment && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-purple-50 dark:bg-purple-950/40 px-2 py-0.5 text-[10px] text-purple-700 dark:text-purple-400">
                        <Home className="h-3 w-3" /> Apartment
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1 rounded-full bg-orange-50 dark:bg-orange-950/40 px-2 py-0.5 text-[10px] text-orange-700 dark:text-orange-400">
                      <Scissors className="h-3 w-3" /> {groomingLabels[breed.grooming]}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-cyan-50 dark:bg-cyan-950/40 px-2 py-0.5 text-[10px] text-cyan-700 dark:text-cyan-400">
                      <Dumbbell className="h-3 w-3" /> {activityLabels[breed.activity]}
                    </span>
                  </div>

                  {breed.healthIssues.length > 0 && (
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400 mb-1">Health risks</p>
                      <div className="flex flex-wrap gap-1">
                        {breed.healthIssues.map((h) => (
                          <Badge key={h} variant="warning" className="text-[10px]">{h}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
}

type SpeciesFilter = "all" | "dog" | "cat";
type SizeFilter = "all" | "small" | "medium" | "large" | "giant";

export default function BreedsPage() {
  const [search, setSearch] = useState("");
  const [species, setSpecies] = useState<SpeciesFilter>("all");
  const [size, setSize] = useState<SizeFilter>("all");
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    return allBreeds.filter((b) => {
      if (species !== "all" && b.species !== species) return false;
      if (size !== "all" && b.size !== size) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          b.name.toLowerCase().includes(q) ||
          b.nameRu.toLowerCase().includes(q) ||
          b.traits.some((t) => t.toLowerCase().includes(q)) ||
          b.group.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [search, species, size]);

  const activeFilters = (species !== "all" ? 1 : 0) + (size !== "all" ? 1 : 0);

  return (
    <div className="space-y-4">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              🐾 Breeds
            </h1>
            <p className="text-sm text-gray-500">{allBreeds.length} breeds — find your perfect match</p>
          </div>
        </div>
      </motion.div>

      {/* Search + Filters */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or trait..."
            className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 pl-10 pr-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 dark:focus:ring-green-900/30"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2">
              <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>
        <Button
          variant={showFilters ? "default" : "outline"}
          size="md"
          onClick={() => setShowFilters(!showFilters)}
          className="relative"
        >
          <Filter className="h-4 w-4" />
          {activeFilters > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-green-500 text-[10px] text-white">
              {activeFilters}
            </span>
          )}
        </Button>
      </div>

      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="rounded-xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 space-y-3">
              <div>
                <p className="text-xs font-medium text-gray-500 mb-2">Species</p>
                <div className="flex gap-2">
                  {(["all", "dog", "cat"] as SpeciesFilter[]).map((s) => (
                    <button
                      key={s}
                      onClick={() => setSpecies(s)}
                      className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                        species === s ? "bg-green-500 text-white" : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200"
                      }`}
                    >
                      {s === "all" ? "All" : s === "dog" ? <><Dog className="h-3.5 w-3.5" /> Dogs</> : <><Cat className="h-3.5 w-3.5" /> Cats</>}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 mb-2">Size</p>
                <div className="flex flex-wrap gap-2">
                  {(["all", "small", "medium", "large", "giant"] as SizeFilter[]).map((s) => (
                    <button
                      key={s}
                      onClick={() => setSize(s)}
                      className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                        size === s ? "bg-green-500 text-white" : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200"
                      }`}
                    >
                      {s === "all" ? "Any" : sizeLabels[s]}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Species quick tabs */}
      <div className="flex items-center gap-3 text-sm">
        <span className="text-gray-400 font-medium">{filtered.length} {filtered.length === 1 ? "breed" : "breeds"}</span>
      </div>

      {/* Breed list */}
      <div className="space-y-3">
        {filtered.map((breed, i) => (
          <BreedCard key={breed.id} breed={breed} index={i} />
        ))}
        {filtered.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-gray-400 text-sm">No matches. Try a different query.</p>
          </div>
        )}
      </div>
    </div>
  );
}
