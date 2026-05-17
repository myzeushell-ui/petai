"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight, Activity, Bot, FlaskConical, Bell,
  Shield, Zap, Check, Heart, Dna, Mic,
} from "lucide-react";
import { Button } from "@/components/ui/button";

/* ── Features ── */
const features = [
  { Icon: Activity,     title: "Health Score",      desc: "Real-time AI score based on all your pet's data",            color: "bg-green-100 text-green-600"   },
  { Icon: Bot,          title: "AI Health Assistant",desc: "Ask anything — get instant, personalized answers",          color: "bg-indigo-100 text-indigo-600" },
  { Icon: FlaskConical, title: "Lab Analysis",       desc: "Upload bloodwork, get plain-English AI explanations",       color: "bg-blue-100 text-blue-600"     },
  { Icon: Bell,         title: "Smart Reminders",    desc: "Never miss a vaccine, medication, or checkup again",        color: "bg-orange-100 text-orange-600" },
  { Icon: Dna,          title: "Breeding Suite",     desc: "Heat tracker, whelping guide, COI calculator, mating match",color: "bg-pink-100 text-pink-600"     },
  { Icon: Mic,          title: "Voice AI",           desc: "Understand your pet's barks and vocalizations in real time", color: "bg-purple-100 text-purple-600" },
  { Icon: Shield,       title: "Vet Reports",        desc: "All visit records in one place with AI summaries",          color: "bg-teal-100 text-teal-600"     },
  { Icon: Zap,          title: "Health Timeline",    desc: "Complete medical history with trend analysis",              color: "bg-cyan-100 text-cyan-600"     },
  { Icon: Heart,        title: "Marketplace",        desc: "Verified breeders, RKF pedigrees, breed picker quiz",      color: "bg-rose-100 text-rose-600"     },
];

/* ── Pricing ── */
const plans = [
  {
    name: "Free",
    price: "0₽",
    period: "",
    tagline: "Для старта",
    color: "border-gray-200",
    accent: "bg-gray-50",
    cta: "Начать бесплатно",
    popular: false,
    features: [
      "1 питомец",
      "Медкарта и напоминания",
      "Трекер течки",
      "Health Score (базовый)",
      "AI чат (5 вопросов/день)",
    ],
  },
  {
    name: "Pro",
    price: "499₽",
    period: "/мес",
    tagline: "Для заботливых владельцев",
    color: "border-green-400",
    accent: "bg-green-50",
    cta: "Попробовать 14 дней бесплатно",
    popular: true,
    features: [
      "До 5 питомцев",
      "AI анализ анализов (PDF)",
      "Неограниченный AI чат",
      "Голосовой анализ (ошейник)",
      "Детальный health score + тренды",
      "Экспорт ветеринарного отчёта",
    ],
  },
  {
    name: "Breeder",
    price: "990₽",
    period: "/мес",
    tagline: "Для заводчиков",
    color: "border-purple-400",
    accent: "bg-purple-50",
    cta: "Связаться с нами",
    popular: false,
    features: [
      "Всё из Pro",
      "COI калькулятор",
      "Автодоговор вязки (ЭЦП)",
      "Маркетплейс объявлений",
      "Подбор кандидатов по родословной",
      "AI генератор кличек (РКФ 2026)",
      "Приоритетная поддержка",
    ],
  },
];

/* ── Stats ── */
const stats = [
  { value: "87%", label: "Точность голосового AI" },
  { value: "50+", label: "Пород в базе данных" },
  { value: "3x", label: "Быстрее диагностика" },
  { value: "0₽", label: "Чтобы начать" },
];

export default function LandingPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleWaitlist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setSubmitted(true);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* ── Nav ── */}
      <nav className="sticky top-0 z-50 border-b border-gray-100 bg-white/90 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-green-500 text-xl shadow-sm">
              🐾
            </div>
            <span className="text-xl font-bold text-gray-900">PetAI</span>
            <span className="hidden sm:inline rounded-full border border-green-200 bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700 ml-1">
              Beta
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-6 text-sm font-medium text-gray-500">
            <a href="#features" className="hover:text-gray-900 transition-colors">Возможности</a>
            <a href="#pricing" className="hover:text-gray-900 transition-colors">Тарифы</a>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="hidden sm:inline-flex">Demo</Button>
            </Link>
            <Link href="/dashboard">
              <Button size="sm">
                Открыть приложение <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="overflow-hidden bg-gradient-to-b from-green-50 via-white to-white px-4 pb-20 pt-20">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-4 py-1.5 text-sm font-medium text-green-700">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
              AI-Powered Pet Health · Demo Mode
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-6 text-5xl font-black tracking-tight text-gray-900 sm:text-6xl">
            Health OS для вашего
            <br />
            <span className="bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">
              питомца
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mx-auto mt-6 max-w-2xl text-lg text-gray-500">
            AI health score, расшифровка анализов, трекер течки, голосовой AI и маркетплейс заводчиков —
            всё в одном приложении. Ваш питомец заслуживает лучшего.
          </motion.p>

          {/* Waitlist form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8">
            {!submitted ? (
              <form onSubmit={handleWaitlist}
                className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-2">
                <input
                  type="email"
                  required
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full max-w-xs rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 shadow-sm outline-none placeholder-gray-400 focus:border-green-400 focus:ring-2 focus:ring-green-100 sm:w-72"
                />
                <Button type="submit" size="lg" disabled={loading}
                  className="w-full sm:w-auto shadow-lg shadow-green-200">
                  {loading ? "Записываем..." : "Вступить в список"}
                  {!loading && <ArrowRight className="h-5 w-5" />}
                </Button>
              </form>
            ) : (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-2 rounded-2xl border border-green-200 bg-green-50 px-6 py-3 text-green-700 font-semibold">
                <Check className="h-5 w-5" />
                Вы в списке! Уведомим при запуске.
              </motion.div>
            )}
            <p className="mt-3 text-sm text-gray-400">
              Без регистрации · <Link href="/dashboard" className="underline hover:text-gray-600">Или сразу в Demo →</Link>
            </p>
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.45 }}
            className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-3xl font-black text-gray-900">{s.value}</p>
                <p className="mt-1 text-sm text-gray-400">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* App preview */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mx-auto mt-16 max-w-3xl">
          <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-2xl shadow-gray-200/80">
            {/* Browser chrome */}
            <div className="flex items-center gap-2 border-b border-gray-100 bg-gray-50 px-5 py-3">
              <div className="h-3 w-3 rounded-full bg-red-400" />
              <div className="h-3 w-3 rounded-full bg-yellow-400" />
              <div className="h-3 w-3 rounded-full bg-green-400" />
              <span className="ml-2 text-xs text-gray-400">petai.app/dashboard</span>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-100 text-3xl">🐕</div>
                  <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-green-500 text-[10px] font-black text-white">87</div>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Luna · Golden Retriever</h3>
                  <p className="text-sm text-gray-500">4 года · Самка · Стерилизована</p>
                  <div className="mt-1 flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                    <span className="text-xs text-green-600 font-medium">Excellent Health</span>
                  </div>
                </div>
                <div className="ml-auto hidden sm:block">
                  <div className="rounded-xl bg-amber-50 px-4 py-2 text-center">
                    <p className="text-2xl font-black text-green-600">87</p>
                    <p className="text-xs text-gray-400">Health Score</p>
                  </div>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-3">
                {[
                  { label: "Vaccines", value: "✅ Up to date", color: "bg-green-50" },
                  { label: "ALT Level", value: "⚠️ Elevated", color: "bg-yellow-50" },
                  { label: "Dental", value: "🦷 Due soon", color: "bg-orange-50" },
                ].map((item) => (
                  <div key={item.label} className={`${item.color} rounded-xl p-3`}>
                    <p className="text-xs font-medium text-gray-500">{item.label}</p>
                    <p className="mt-0.5 text-sm font-semibold text-gray-800">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="px-4 py-20 bg-gray-50">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <h2 className="text-3xl font-black text-gray-900 sm:text-4xl">
              Всё что нужно вашему питомцу
            </h2>
            <p className="mt-3 text-gray-500">
              От ежедневных напоминаний до анализа анализов — PetAI закрывает всё.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <motion.div key={f.title}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.06 }}
                className="rounded-2xl border border-gray-100 bg-white p-6 hover:border-gray-200 hover:shadow-md transition-all duration-200">
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${f.color}`}>
                  <f.Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-base font-bold text-gray-900">{f.title}</h3>
                <p className="mt-1 text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" className="px-4 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <h2 className="text-3xl font-black text-gray-900 sm:text-4xl">Простые тарифы</h2>
            <p className="mt-3 text-gray-500">Начните бесплатно. Платите только когда захотите большего.</p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {plans.map((plan, i) => (
              <motion.div key={plan.name}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className={`relative rounded-3xl border-2 ${plan.color} ${plan.popular ? "shadow-xl shadow-green-100" : ""} p-6 flex flex-col`}>
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="rounded-full bg-green-500 px-4 py-1 text-xs font-bold text-white shadow-sm">
                      Популярный
                    </span>
                  </div>
                )}
                <div className={`rounded-2xl ${plan.accent} px-4 py-3 mb-5`}>
                  <p className="text-sm font-bold text-gray-500">{plan.name}</p>
                  <div className="flex items-baseline gap-1">
                    <p className="text-4xl font-black text-gray-900">{plan.price}</p>
                    {plan.period && <p className="text-gray-400 text-sm">{plan.period}</p>}
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{plan.tagline}</p>
                </div>
                <ul className="space-y-2.5 flex-1 mb-6">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <Check className="h-4 w-4 flex-shrink-0 text-green-500 mt-0.5" />
                      <span className="text-sm text-gray-600">{f}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/dashboard">
                  <Button
                    className="w-full"
                    variant={plan.popular ? "default" : "outline"}>
                    {plan.cta}
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>

          <p className="text-center text-sm text-gray-400 mt-8">
            + 20% комиссия с консультаций · 3% с маркетплейс-сделок · Договор вязки: 490₽
          </p>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-gradient-to-r from-green-500 to-emerald-600 px-4 py-16 text-center">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-3xl font-black text-white">Готовы дать питомцу лучший уход?</h2>
          <p className="mt-3 text-green-100">
            Присоединяйтесь к владельцам, которые уже используют AI для умных решений о здоровье.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link href="/dashboard">
              <Button size="lg" className="bg-white text-green-700 hover:bg-green-50 w-full sm:w-auto shadow-lg">
                Смотреть Demo <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-gray-100 px-4 py-10">
        <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <span className="text-xl">🐾</span>
            <span className="font-bold text-gray-600">PetAI</span>
            <span className="text-gray-300">·</span>
            <span>AI Health OS для питомцев</span>
          </div>
          <div className="flex items-center gap-4">
            <span>© 2026</span>
            <a href="#features" className="hover:text-gray-600 transition-colors">Возможности</a>
            <a href="#pricing" className="hover:text-gray-600 transition-colors">Тарифы</a>
            <Link href="/dashboard" className="hover:text-gray-600 transition-colors">Demo</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
