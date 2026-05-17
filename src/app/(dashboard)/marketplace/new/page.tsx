"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft, ImagePlus, Camera, Check, Sparkles, FileText, Award, Calendar, Hash, DollarSign, Tag,
} from "lucide-react";

type Step = 1 | 2 | 3 | 4;

const PUPPY_PHOTOS = ["🐶", "🐕", "🐶", "🐩"];

export default function CreateListingPage() {
  const [step, setStep] = useState<Step>(1);
  const [publishing, setPublishing] = useState(false);
  const [published, setPublished] = useState(false);

  const publish = async () => {
    setPublishing(true);
    await new Promise((r) => setTimeout(r, 1500));
    setPublishing(false);
    setPublished(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Новое объявление</h1>
          <p className="text-sm text-gray-500">Щенки Luna × Champion Goldenline Atlas</p>
        </div>
        <Link href="/marketplace">
          <Button variant="ghost" size="sm"><ArrowLeft className="h-4 w-4" /> К маркетплейсу</Button>
        </Link>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-2">
        {[1, 2, 3, 4].map((n) => (
          <div key={n} className="flex-1 flex items-center gap-2">
            <div className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors ${step >= n ? "bg-green-500 text-white" : "bg-gray-100 dark:bg-gray-800 text-gray-400"}`}>
              {step > n ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : n}
            </div>
            {n < 4 && <div className={`h-0.5 flex-1 rounded-full transition-colors ${step > n ? "bg-green-500" : "bg-gray-100 dark:bg-gray-800"}`} />}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && !published && (
          <motion.div key="step1" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
            <Card>
              <CardContent className="p-6 space-y-5">
                <div>
                  <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold">Шаг 1 из 4</p>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white mt-1">Основное</h2>
                </div>

                <Field label="Заголовок" icon={Tag}>
                  Щенки Голден Ретривера — помёт «G»
                </Field>
                <Field label="Помёт" icon={Sparkles}>
                  Luna Goldenroot × CH Goldenline Atlas
                </Field>

                <div className="grid grid-cols-2 gap-3">
                  <Field label="Дата рождения" icon={Calendar}>20 марта 2026</Field>
                  <Field label="Количество щенков" icon={Hash}>6 (4 ♂ · 2 ♀)</Field>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Field label="Цена за щенка" icon={DollarSign}>от 80 000 ₽</Field>
                  <Field label="Класс" icon={Award}>Шоу / Брид / Пет</Field>
                </div>

                <Button size="lg" className="w-full" onClick={() => setStep(2)}>Далее → Фото</Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {step === 2 && !published && (
          <motion.div key="step2" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
            <Card>
              <CardContent className="p-6 space-y-5">
                <div>
                  <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold">Шаг 2 из 4</p>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white mt-1">Фото и видео</h2>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {PUPPY_PHOTOS.map((p, i) => (
                    <motion.div key={i} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: i * 0.1 }}
                      className="relative aspect-square rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-950/40 dark:to-orange-950/40 flex items-center justify-center text-5xl group">
                      {p}
                      {i === 0 && <Badge variant="success" className="absolute top-2 left-2">Главное</Badge>}
                      <span className="absolute bottom-2 right-2 rounded-full bg-white/80 dark:bg-gray-900/80 px-2 py-0.5 text-[10px] font-medium text-gray-700 dark:text-gray-300">#{i + 1}</span>
                    </motion.div>
                  ))}
                  <button className="aspect-square rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center gap-1 text-gray-400 hover:border-green-400 hover:text-green-500 transition-colors">
                    <ImagePlus className="h-6 w-6" />
                    <span className="text-xs">Ещё фото</span>
                  </button>
                  <button className="aspect-square rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center gap-1 text-gray-400 hover:border-green-400 hover:text-green-500 transition-colors">
                    <Camera className="h-6 w-6" />
                    <span className="text-xs">Видео</span>
                  </button>
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1" onClick={() => setStep(1)}>Назад</Button>
                  <Button size="lg" className="flex-1" onClick={() => setStep(3)}>Далее → Документы</Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {step === 3 && !published && (
          <motion.div key="step3" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
            <Card>
              <CardContent className="p-6 space-y-5">
                <div>
                  <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold">Шаг 3 из 4</p>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white mt-1">Документы и родословная</h2>
                </div>

                <div className="space-y-2">
                  {[
                    { name: "Метрика щенка (РКФ)", state: "verified" },
                    { name: "Ветпаспорт + чипирование", state: "verified" },
                    { name: "Родословная Luna (4 поколения)", state: "verified" },
                    { name: "Тесты HD-A / ED-0 / PRA clear", state: "verified" },
                    { name: "Договор вязки", state: "verified" },
                  ].map((d) => (
                    <div key={d.name} className="flex items-center gap-3 rounded-xl border border-gray-100 dark:border-gray-800 px-4 py-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-50 dark:bg-green-950/30">
                        <FileText className="h-4 w-4 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{d.name}</p>
                        <p className="text-xs text-green-600">Проверено PetAI</p>
                      </div>
                      <Check className="h-5 w-5 text-green-500" strokeWidth={3} />
                    </div>
                  ))}
                </div>

                <div className="rounded-2xl border border-green-200 dark:border-green-900/40 bg-green-50 dark:bg-green-950/20 p-4">
                  <div className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-green-600" />
                    <p className="text-sm font-bold text-green-800 dark:text-green-300">Verified Breeder</p>
                  </div>
                  <p className="text-xs text-green-700/80 dark:text-green-400/80 mt-1">
                    Объявление получит «зелёную галочку» — повышает доверие и выдачу в поиске.
                  </p>
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1" onClick={() => setStep(2)}>Назад</Button>
                  <Button size="lg" className="flex-1" onClick={() => setStep(4)}>Далее → Публикация</Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {step === 4 && !published && (
          <motion.div key="step4" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
            <Card>
              <CardContent className="p-6">
                <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold">Шаг 4 из 4 · Предпросмотр</p>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mt-1">Так увидят покупатели</h2>

                <div className="mt-5 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800">
                  <div className="aspect-[16/9] bg-gradient-to-br from-amber-200 via-orange-200 to-rose-200 flex items-center justify-center text-7xl">🐶</div>
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-base font-bold text-gray-900 dark:text-white">Щенки Голден Ретривера</p>
                        <p className="text-xs text-gray-500 mt-0.5">Помёт «G» · 6 щенков · 20 марта 2026</p>
                      </div>
                      <p className="text-lg font-black text-green-600 whitespace-nowrap">от 80 000 ₽</p>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      <Badge variant="success" className="inline-flex items-center gap-1"><Check className="h-3 w-3" strokeWidth={3} /> Verified Breeder</Badge>
                      <Badge variant="purple">РКФ</Badge>
                      <Badge variant="info">HD-A · PRA clear</Badge>
                    </div>
                    <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
                      <span className="inline-flex items-center gap-1">🐾 Luna × CH Atlas</span>
                      <span>·</span>
                      <span>Москва</span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 flex gap-3">
                  <Button variant="outline" className="flex-1" onClick={() => setStep(3)}>Назад</Button>
                  <Button size="lg" disabled={publishing} className="flex-1" onClick={publish}>
                    {publishing ? (<><span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" /> Публикуем...</>) : "Опубликовать"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {published && (
          <motion.div key="done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <Card>
              <CardContent className="p-8 text-center">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 300, damping: 18 }}
                  className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-950/40">
                  <Check className="h-10 w-10 text-green-600" strokeWidth={3} />
                </motion.div>
                <h2 className="mt-5 text-2xl font-bold text-gray-900 dark:text-white">Объявление опубликовано!</h2>
                <p className="mt-2 text-sm text-gray-500">Помёт «G» · 6 щенков · уже на главной маркетплейса</p>

                <div className="mt-6 grid grid-cols-3 gap-3 text-center text-xs">
                  <div className="rounded-xl bg-gray-50 dark:bg-gray-800 p-3">
                    <p className="text-2xl font-black text-gray-900 dark:text-white">142</p>
                    <p className="text-gray-400 mt-0.5">просмотра за час</p>
                  </div>
                  <div className="rounded-xl bg-gray-50 dark:bg-gray-800 p-3">
                    <p className="text-2xl font-black text-gray-900 dark:text-white">8</p>
                    <p className="text-gray-400 mt-0.5">в избранном</p>
                  </div>
                  <div className="rounded-xl bg-gray-50 dark:bg-gray-800 p-3">
                    <p className="text-2xl font-black text-green-600">3</p>
                    <p className="text-gray-400 mt-0.5">сообщения</p>
                  </div>
                </div>

                <Link href="/marketplace">
                  <Button size="lg" variant="outline" className="mt-6">Перейти к маркетплейсу</Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Field({ label, icon: Icon, children }: { label: string; icon: typeof Tag; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs font-medium text-gray-500 inline-flex items-center gap-1.5">
        <Icon className="h-3.5 w-3.5" /> {label}
      </label>
      <div className="mt-1 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-sm text-gray-900 dark:text-white">
        {children}
      </div>
    </div>
  );
}
