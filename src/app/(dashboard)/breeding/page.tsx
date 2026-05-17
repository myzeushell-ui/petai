"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Heart, Calendar, Dna, FileText, Sparkles, TrendingUp, Check, Download, Award,
} from "lucide-react";

type Tab = "heat" | "match" | "coi" | "contract";

const HEAT_CYCLE = [
  { phase: "Proestrus", days: "1–9", color: "bg-pink-400", current: false, hint: "Bloody discharge, vulva swelling" },
  { phase: "Estrus", days: "10–14", color: "bg-rose-500", current: true, hint: "Ovulation · Mating window days 11–13" },
  { phase: "Diestrus", days: "15–60", color: "bg-purple-300", current: false, hint: "Post-ovulation" },
  { phase: "Anestrus", days: "60+", color: "bg-gray-300", current: false, hint: "Rest phase" },
];

const CANDIDATES = [
  { id: "m-001", name: "Champion Goldenline Atlas", breed: "Golden Retriever", coi: 2.4, age: 4, titles: ["CH RKF", "JCH"], match: 96, photo: "🐕", owner: "Golden Line Kennel", health: ["HD-A", "ED-0", "PRA clear"] },
  { id: "m-002", name: "Apollo Solar Crown", breed: "Golden Retriever", coi: 3.8, age: 5, titles: ["CH RKF", "INT CH"], match: 91, photo: "🐕‍🦺", owner: "Solar Crown Kennel", health: ["HD-A", "ED-0"] },
  { id: "m-003", name: "Rex Sunset Valley", breed: "Golden Retriever", coi: 5.1, age: 3, titles: ["JCH"], match: 84, photo: "🦮", owner: "Sunset Valley Kennel", health: ["HD-B", "ED-0", "PRA carrier"] },
];

const PARENT_A = { name: "Luna Goldenroot", coi: 1.8 };

export default function BreedingPage() {
  const [tab, setTab] = useState<Tab>("heat");
  const [selected, setSelected] = useState<typeof CANDIDATES[0] | null>(null);
  const [contractGen, setContractGen] = useState(false);
  const [contractReady, setContractReady] = useState(false);

  const generateContract = async () => {
    setContractGen(true);
    await new Promise((r) => setTimeout(r, 1600));
    setContractGen(false);
    setContractReady(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Dna className="h-6 w-6 text-pink-500" /> Breeding Suite
        </h1>
        <p className="text-sm text-gray-500">Heat tracker, mating match, COI calculator, auto-contract</p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {([
          { id: "heat", label: "Heat tracker", Icon: Heart },
          { id: "match", label: "Mating match", Icon: Sparkles },
          { id: "coi", label: "COI calculator", Icon: TrendingUp },
          { id: "contract", label: "Breeding contract", Icon: FileText },
        ] as { id: Tab; label: string; Icon: typeof Heart }[]).map(({ id, label, Icon }) => (
          <button key={id} onClick={() => setTab(id)}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors ${tab === id ? "bg-pink-500 text-white shadow-sm" : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200"}`}>
            <Icon className="h-4 w-4" /> {label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {tab === "heat" && (
          <motion.div key="heat" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Heart className="h-4 w-4 text-rose-500" /> Current cycle · Luna</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-2xl border border-rose-200 dark:border-rose-900/40 bg-rose-50 dark:bg-rose-950/20 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-rose-600 dark:text-rose-400 font-semibold">Now</p>
                      <p className="mt-1 text-2xl font-bold text-rose-700 dark:text-rose-300">Day 12 · Estrus</p>
                      <p className="text-sm text-rose-600/80 dark:text-rose-400/80 mt-1">Ovulation · Mating window open</p>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-black text-rose-600">11–13</p>
                      <p className="text-xs text-rose-600/70">optimal days</p>
                    </div>
                  </div>
                </div>

                <div className="mt-5 space-y-2">
                  {HEAT_CYCLE.map((c) => (
                    <div key={c.phase} className={`rounded-xl p-3 border ${c.current ? "border-rose-300 dark:border-rose-700 bg-rose-50/50 dark:bg-rose-950/10" : "border-gray-100 dark:border-gray-800"}`}>
                      <div className="flex items-center gap-3">
                        <div className={`h-3 w-3 rounded-full ${c.color} ${c.current ? "ring-4 ring-rose-200 dark:ring-rose-900/60" : ""}`} />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-semibold text-gray-900 dark:text-white">{c.phase}</p>
                            <p className="text-xs text-gray-500">Days {c.days}</p>
                          </div>
                          <p className="text-xs text-gray-500 mt-0.5">{c.hint}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-5 grid grid-cols-3 gap-3 text-center text-xs">
                  <div className="rounded-xl bg-gray-50 dark:bg-gray-800 p-3">
                    <p className="text-gray-400">Last cycle</p>
                    <p className="mt-1 text-sm font-bold text-gray-900 dark:text-white">November 5</p>
                  </div>
                  <div className="rounded-xl bg-gray-50 dark:bg-gray-800 p-3">
                    <p className="text-gray-400">Cycle length</p>
                    <p className="mt-1 text-sm font-bold text-gray-900 dark:text-white">192 days</p>
                  </div>
                  <div className="rounded-xl bg-gray-50 dark:bg-gray-800 p-3">
                    <p className="text-gray-400">Next</p>
                    <p className="mt-1 text-sm font-bold text-gray-900 dark:text-white">~ November 2026</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {tab === "match" && (
          <motion.div key="match" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-3">
            <Card>
              <CardContent className="p-5">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Sparkles className="h-4 w-4 text-pink-500" /> AI matching by pedigree, COI, health and titles
                </div>
              </CardContent>
            </Card>

            {CANDIDATES.map((c, i) => (
              <motion.div key={c.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => { setSelected(c); setTab("coi"); }}>
                  <CardContent className="p-5">
                    <div className="flex items-start gap-4">
                      <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-gray-50 dark:bg-gray-800 text-4xl">{c.photo}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{c.name}</p>
                            <p className="text-xs text-gray-500 truncate">{c.breed} · {c.age}y · {c.owner}</p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="text-2xl font-black text-pink-600 leading-none">{c.match}%</p>
                            <p className="text-[10px] text-pink-500 font-semibold uppercase">Match</p>
                          </div>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-1">
                          {c.titles.map((t) => (
                            <Badge key={t} variant="purple" className="inline-flex items-center gap-1">
                              <Award className="h-3 w-3" /> {t}
                            </Badge>
                          ))}
                          {c.health.map((h) => (
                            <Badge key={h} variant={h.includes("clear") || h.endsWith("0") || h === "HD-A" ? "success" : h === "HD-B" ? "warning" : "danger"}>{h}</Badge>
                          ))}
                        </div>
                        <div className="mt-3 flex items-center justify-between text-xs">
                          <span className="text-gray-500">Predicted offspring COI</span>
                          <span className={`font-bold ${c.coi < 3 ? "text-green-600" : c.coi < 5 ? "text-amber-600" : "text-red-600"}`}>
                            {c.coi}%
                          </span>
                        </div>
                        <Progress value={c.coi} max={10} className="mt-1.5 h-1.5"
                          indicatorClassName={c.coi < 3 ? "bg-green-500" : c.coi < 5 ? "bg-amber-500" : "bg-red-500"} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}

        {tab === "coi" && (
          <motion.div key="coi" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><TrendingUp className="h-4 w-4 text-pink-500" /> COI calculator · 10 generations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-gray-100 dark:border-gray-800 p-4">
                    <p className="text-xs text-gray-400">Female</p>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">{PARENT_A.name}</p>
                    <p className="text-xs text-gray-500 mt-2">COI: <span className="font-semibold text-gray-700 dark:text-gray-300">{PARENT_A.coi}%</span></p>
                  </div>
                  <div className="rounded-2xl border border-gray-100 dark:border-gray-800 p-4">
                    <p className="text-xs text-gray-400">Male</p>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">{(selected ?? CANDIDATES[0]).name}</p>
                    <p className="text-xs text-gray-500 mt-2">Match: <span className="font-semibold text-pink-600">{(selected ?? CANDIDATES[0]).match}%</span></p>
                  </div>
                </div>

                <div className="mt-5 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border border-green-200 dark:border-green-900/40 p-5">
                  <p className="text-xs uppercase tracking-wide text-green-700 dark:text-green-400 font-semibold">Predicted offspring COI</p>
                  <div className="mt-2 flex items-end gap-2">
                    <p className="text-5xl font-black text-green-600">{(selected ?? CANDIDATES[0]).coi}%</p>
                    <p className="text-sm text-green-700/80 dark:text-green-400/80 mb-2">acceptable (&lt; 6.25%)</p>
                  </div>
                  <Progress value={(selected ?? CANDIDATES[0]).coi} max={10} className="mt-3 h-2 bg-white/60" indicatorClassName="bg-gradient-to-r from-green-400 to-emerald-500" />
                  <p className="text-xs text-green-700/80 dark:text-green-400/80 mt-3">
                    AI checked 10 generations of pedigree. No common ancestors in the first 4 generations. Hereditary disease risk — low.
                  </p>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-xl bg-gray-50 dark:bg-gray-800 p-3">
                    <p className="text-xs text-gray-400">Generations checked</p>
                    <p className="mt-1 font-bold text-gray-900 dark:text-white">10 / 10</p>
                  </div>
                  <div className="rounded-xl bg-gray-50 dark:bg-gray-800 p-3">
                    <p className="text-xs text-gray-400">Pedigree database</p>
                    <p className="mt-1 font-bold text-gray-900 dark:text-white">AKC + FCI</p>
                  </div>
                </div>

                <Button size="lg" className="mt-5 w-full bg-pink-500 hover:bg-pink-600" onClick={() => setTab("contract")}>
                  <FileText className="h-4 w-4" /> Generate breeding contract
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {tab === "contract" && (
          <motion.div key="contract" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-gray-400 font-semibold">
                  <FileText className="h-3.5 w-3.5" /> Breeding contract · $9
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-1">
                  Auto-generated AKC-compliant
                </h2>

                <div className="mt-5 space-y-2 text-sm">
                  {[
                    { l: "Female", v: `${PARENT_A.name} · Golden Retriever` },
                    { l: "Male", v: `${(selected ?? CANDIDATES[0]).name}` },
                    { l: "Predicted COI", v: `${(selected ?? CANDIDATES[0]).coi}%` },
                    { l: "Stud fee terms", v: "1 puppy (stud owner's choice)" },
                    { l: "Stud fee", v: "$500 + 1 puppy" },
                    { l: "Guarantee", v: "Re-mating if no pregnancy" },
                  ].map((r) => (
                    <div key={r.l} className="flex justify-between gap-3 rounded-lg bg-gray-50 dark:bg-gray-800 px-4 py-2.5">
                      <span className="text-gray-500">{r.l}</span>
                      <span className="font-medium text-gray-900 dark:text-white text-right">{r.v}</span>
                    </div>
                  ))}
                </div>

                {!contractReady ? (
                  <Button size="lg" disabled={contractGen} className="mt-6 w-full bg-pink-500 hover:bg-pink-600" onClick={generateContract}>
                    {contractGen ? (<><span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" /> Generating...</>) : (<><Sparkles className="h-4 w-4" /> Generate contract PDF</>)}
                  </Button>
                ) : (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    className="mt-6 rounded-2xl border border-green-200 dark:border-green-900/40 bg-green-50 dark:bg-green-950/20 p-5 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-500">
                      <Check className="h-6 w-6 text-white" strokeWidth={3} />
                    </div>
                    <p className="mt-3 text-sm font-bold text-green-800 dark:text-green-300">Contract ready · 6 pages</p>
                    <p className="text-xs text-green-700/80 dark:text-green-400/80 mt-1">Compliant with AKC breeding regulations</p>
                    <Button variant="outline" className="mt-4">
                      <Download className="h-4 w-4" /> Download PDF
                    </Button>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
