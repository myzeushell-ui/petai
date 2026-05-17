"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Mic, Thermometer, Activity, Heart, Battery, Wifi, MapPin, Sparkles,
} from "lucide-react";

type Emotion = { id: string; label: string; emoji: string; color: string; bar: number; hint: string };

const EMOTIONS: Emotion[] = [
  { id: "joy",     label: "Радость",      emoji: "😊", color: "from-amber-400 to-yellow-500",  bar: 72, hint: "Игровой лай, высокая тональность" },
  { id: "stress",  label: "Стресс",       emoji: "😰", color: "from-orange-400 to-red-500",    bar: 14, hint: "Норма" },
  { id: "anxiety", label: "Тревога",      emoji: "😟", color: "from-purple-400 to-pink-500",   bar: 8,  hint: "Норма" },
  { id: "pain",    label: "Боль",         emoji: "🤕", color: "from-red-500 to-rose-600",      bar: 0,  hint: "Не обнаружено" },
  { id: "alert",   label: "Бдительность", emoji: "👀", color: "from-blue-400 to-cyan-500",     bar: 6,  hint: "Норма" },
];

function generateWave(seed: number, len = 60) {
  return Array.from({ length: len }, (_, i) => {
    const x = Math.sin((i + seed) * 0.3) * 0.4 + Math.sin((i + seed) * 0.8) * 0.3 + Math.random() * 0.3;
    return Math.max(0.1, Math.min(1, Math.abs(x)));
  });
}

export default function CollarPage() {
  const [wave, setWave] = useState<number[]>(() => generateWave(0));
  const [heart, setHeart] = useState(92);
  const [recording, setRecording] = useState(true);

  useEffect(() => {
    const id = setInterval(() => {
      setWave(generateWave(Date.now() / 80));
      setHeart((h) => Math.max(78, Math.min(110, h + (Math.random() - 0.5) * 4)));
    }, 220);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Mic className="h-6 w-6 text-purple-500" /> Smart Collar · Luna
          </h1>
          <p className="text-sm text-gray-500">Голосовой AI и биометрия в реальном времени</p>
        </div>
        <div className="flex items-center gap-3 text-xs text-gray-500">
          <span className="inline-flex items-center gap-1"><Wifi className="h-3.5 w-3.5 text-green-500" /> онлайн</span>
          <span className="inline-flex items-center gap-1"><Battery className="h-3.5 w-3.5 text-green-500" /> 87%</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <MetricCard Icon={Thermometer} label="Температура" value="38.6" unit="°C" tone="ok" detail="норма" />
        <MetricCard Icon={Heart} label="Пульс" value={`${heart.toFixed(0)}`} unit="bpm" tone="ok" detail="покой" animate />
        <MetricCard Icon={Activity} label="Активность" value="6.4" unit="km" tone="ok" detail="сегодня" />
        <MetricCard Icon={MapPin} label="GPS" value="Дом" unit="" tone="ok" detail="< 30 м" />
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Mic className="h-4 w-4 text-purple-500" /> Voice AI · Анализ лая
            </CardTitle>
            <Badge variant={recording ? "danger" : "default"} className="inline-flex items-center gap-1.5">
              {recording && <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />}
              {recording ? "LIVE" : "пауза"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border border-purple-200 dark:border-purple-900/40 p-5">
            <div className="flex items-end justify-center gap-[3px] h-24">
              {wave.map((v, i) => (
                <motion.div key={i}
                  animate={{ height: `${v * 100}%` }}
                  transition={{ duration: 0.2 }}
                  className="w-[6px] rounded-full bg-gradient-to-t from-purple-500 to-pink-400" />
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between">
              <div className="text-xs text-purple-700 dark:text-purple-300">
                <p className="font-semibold uppercase tracking-wide">Распознано</p>
                <p className="text-base font-bold mt-0.5">Игровой лай · 0.8 сек</p>
              </div>
              <Button size="sm" variant="outline" onClick={() => setRecording((r) => !r)}>
                {recording ? "Пауза" : "Слушать"}
              </Button>
            </div>
          </div>

          <div className="mt-5">
            <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-3">Эмоции питомца · 24 часа</p>
            <div className="space-y-2.5">
              {EMOTIONS.map((e) => (
                <div key={e.id} className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-xl">{e.emoji}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{e.label}</span>
                      <span className="text-xs text-gray-400">{e.hint}</span>
                    </div>
                    <div className="mt-1 h-2 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${e.bar}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className={`h-full rounded-full bg-gradient-to-r ${e.color}`} />
                    </div>
                  </div>
                  <span className="text-sm font-bold text-gray-700 dark:text-gray-300 w-9 text-right">{e.bar}%</span>
                </div>
              ))}
            </div>
          </div>

          <AnimatePresence>
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              className="mt-5 rounded-2xl border border-amber-200 dark:border-amber-900/40 bg-amber-50 dark:bg-amber-950/20 p-4">
              <div className="flex items-start gap-3">
                <Sparkles className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-semibold text-amber-800 dark:text-amber-300">AI заметил утром</p>
                  <p className="text-amber-700/90 dark:text-amber-300/80 mt-0.5">
                    Между 06:40 и 07:10 уровень тревоги был на 28% выше обычного — лай при звуке грозы. Стоит обсудить с зоопсихологом, если повторится.
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
}

function MetricCard({
  Icon, label, value, unit, tone, detail, animate,
}: {
  Icon: typeof Mic; label: string; value: string; unit: string; tone: "ok" | "warn" | "bad"; detail: string; animate?: boolean;
}) {
  const toneColor = tone === "ok" ? "text-green-600" : tone === "warn" ? "text-amber-600" : "text-red-600";
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <Icon className={`h-4 w-4 ${toneColor}`} />
          <span className="text-[10px] text-gray-400 font-medium">{detail}</span>
        </div>
        <div className="mt-3 flex items-baseline gap-1">
          <motion.span animate={animate ? { scale: [1, 1.05, 1] } : {}} transition={{ duration: 1.2, repeat: Infinity }}
            className="text-2xl font-black text-gray-900 dark:text-white">
            {value}
          </motion.span>
          {unit && <span className="text-xs text-gray-400">{unit}</span>}
        </div>
        <p className="mt-1 text-xs text-gray-500">{label}</p>
      </CardContent>
    </Card>
  );
}
