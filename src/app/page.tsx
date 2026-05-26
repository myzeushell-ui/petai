"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight, Activity, Bot, FlaskConical, Bell,
  Shield, Zap, Check, Heart, Dna, Mic, Palette,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useVariant } from "@/contexts/VariantContext";
import { cn } from "@/lib/utils";

/* All theme-dependent colours flow through CSS variables set by
 * VariantContext, so feature tiles & plan borders no longer need
 * per-variant hardcoded maps. One class string works for all 20. */
const FEATURE_TILE = "bg-[var(--petai-surface-variant)] text-[var(--petai-primary)]";

const features = [
  { Icon: Activity,     title: "Health Score",        desc: "Real-time AI score based on all your pet's data" },
  { Icon: Bot,          title: "AI Health Assistant", desc: "Ask anything — get instant, personalized answers" },
  { Icon: FlaskConical, title: "Lab Analysis",        desc: "Upload bloodwork, get plain-English AI explanations" },
  { Icon: Bell,         title: "Smart Reminders",     desc: "Never miss a vaccine, medication, or checkup again" },
  { Icon: Dna,          title: "Breeding Suite",      desc: "Heat tracker, whelping guide, COI calculator, mating match" },
  { Icon: Mic,          title: "Voice AI",            desc: "Understand your pet's barks and vocalizations in real time" },
  { Icon: Shield,       title: "Vet Reports",         desc: "All visit records in one place with AI summaries" },
  { Icon: Zap,          title: "Health Timeline",     desc: "Complete medical history with trend analysis" },
  { Icon: Heart,        title: "Marketplace",         desc: "Verified breeders, pedigrees, breed picker quiz" },
];

/* ── Pricing ── */
const plans = [
  {
    name: "Free",
    price: "$0",
    period: "",
    tagline: "To get started",
    border: "border-[var(--petai-outline)]",
    accent: "bg-[var(--petai-surface-variant)]/60",
    cta: "Start for free",
    popular: false,
    features: [
      "1 pet profile",
      "Health card & reminders",
      "Heat cycle tracker",
      "Health Score (basic)",
      "AI chat (5 questions/day)",
      "AI name generator",
    ],
  },
  {
    name: "Pro",
    price: "$4.99",
    period: "/mo",
    tagline: "For caring pet owners",
    border: "border-[var(--petai-primary)]",
    accent: "bg-[var(--petai-surface-variant)]",
    cta: "Try 14 days free",
    popular: true,
    features: [
      "Up to 5 pets",
      "AI lab analysis (PDF upload)",
      "Unlimited AI chat",
      "Voice analysis (smart collar)",
      "Detailed health score + trends",
      "Export vet reports",
      "AI name generator",
    ],
  },
  {
    name: "Breeder",
    price: "$9.99",
    period: "/mo",
    tagline: "For professional breeders",
    border: "border-[var(--petai-accent)]",
    accent: "bg-[var(--petai-surface-variant)]/80",
    cta: "Contact us",
    popular: false,
    features: [
      "Everything in Pro",
      "COI calculator",
      "Auto breeding contract (e-sign)",
      "Marketplace listings",
      "Pedigree-based mate matching",
      "AI name generator",
      "Priority support",
    ],
  },
];

/* ── Stats ── */
const stats = [
  { value: "87%", label: "Voice AI accuracy" },
  { value: "50+", label: "Breeds in database" },
  { value: "3x", label: "Faster diagnostics" },
  { value: "$0", label: "To get started" },
];

/* ── Variant Picker (landing-only, inline, all 20 themes) ── */
function LandingVariantPicker() {
  const { variant, setVariant, allVariants } = useVariant();
  const vList = Object.keys(allVariants);
  return (
    <div className="flex items-center justify-center gap-1.5 flex-wrap max-w-3xl mx-auto">
      {vList.map((v) => {
        const vc = allVariants[v];
        return (
          <button
            key={v}
            onClick={() => setVariant(v)}
            title={vc.name}
            className={cn(
              "flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium transition-all border",
              variant === v
                ? "bg-gray-900 text-white border-gray-900 dark:bg-white dark:text-gray-900 dark:border-white"
                : "bg-white text-gray-600 border-gray-200 hover:border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
            )}
          >
            <span>{vc.emoji}</span>
            <span className="hidden sm:inline">{vc.name}</span>
          </button>
        );
      })}
    </div>
  );
}

export default function LandingPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const { colors, variant } = useVariant();

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
            <div className={cn("flex h-9 w-9 items-center justify-center rounded-xl text-xl shadow-sm", colors.logoBg)}>
              🐾
            </div>
            <span className="text-xl font-bold text-gray-900">PetAI</span>
            <span className={cn("hidden sm:inline rounded-full border px-2 py-0.5 text-xs font-medium ml-1", colors.badgeBorder, colors.badgeBg, colors.badgeText)}>
              Beta
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-6 text-sm font-medium text-gray-500">
            <a href="#features" className="hover:text-gray-900 transition-colors">Features</a>
            <a href="#pricing" className="hover:text-gray-900 transition-colors">Pricing</a>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="hidden sm:inline-flex">Demo</Button>
            </Link>
            <Link href="/dashboard">
              <Button size="sm" className={colors.btnPrimary}>
                Open App <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className={cn("overflow-hidden bg-gradient-to-b px-4 pb-20 pt-20", colors.heroGradient)}>
        <div className="mx-auto max-w-4xl text-center">
          {/* Variant picker */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="mb-6 flex flex-col items-center gap-3">
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <Palette className="h-3.5 w-3.5" />
                <span>Choose a design variant</span>
              </div>
              <LandingVariantPicker />
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.05 }}>
            <span className={cn("inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-medium", colors.badgeBorder, colors.badgeBg, colors.badgeText)}>
              <span className={cn("h-1.5 w-1.5 rounded-full animate-pulse", colors.badgeDot)} />
              AI-Powered Pet Health · Demo Mode
            </span>
          </motion.div>

          <motion.h1
            key={`hero-${variant}`}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-6 text-5xl font-black tracking-tight text-gray-900 sm:text-6xl">
            The Health OS for your
            <br />
            <span className={cn("bg-gradient-to-r bg-clip-text text-transparent", colors.ctaGradient)}>
              pet
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mx-auto mt-6 max-w-2xl text-lg text-gray-500">
            AI health score, lab result analysis, heat cycle tracker, voice AI, and breeder marketplace —
            all in one app. Your pet deserves the best.
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
                  className={cn("w-full max-w-xs rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 shadow-sm outline-none placeholder-gray-400 focus:ring-2 sm:w-72", colors.focusRing)}
                />
                <Button type="submit" size="lg" disabled={loading}
                  className={cn("w-full sm:w-auto shadow-lg", colors.shadow, colors.btnPrimary)}>
                  {loading ? "Joining..." : "Join the waitlist"}
                  {!loading && <ArrowRight className="h-5 w-5" />}
                </Button>
              </form>
            ) : (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                className={cn("inline-flex items-center gap-2 rounded-2xl border px-6 py-3 font-semibold", colors.badgeBorder, colors.badgeBg, colors.badgeText)}>
                <Check className="h-5 w-5" />
                You&apos;re on the list! We&apos;ll notify you at launch.
              </motion.div>
            )}
            <p className="mt-3 text-sm text-gray-400">
              No sign-up required · <Link href="/dashboard" className="underline hover:text-gray-600">Or jump to Demo →</Link>
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
          key={`preview-${variant}`}
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
                  <div className={cn("absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-black text-white", colors.logoBg)}>87</div>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Luna · Golden Retriever</h3>
                  <p className="text-sm text-gray-500">4 years · Female · Spayed</p>
                  <div className="mt-1 flex items-center gap-1.5">
                    <span className={cn("h-1.5 w-1.5 rounded-full", colors.badgeDot)} />
                    <span className={cn("text-xs font-medium", colors.accentText)}>Excellent Health</span>
                  </div>
                </div>
                <div className="ml-auto hidden sm:block">
                  <div className={cn("rounded-xl px-4 py-2 text-center", colors.accent50)}>
                    <p className={cn("text-2xl font-black", colors.scoreColor)}>87</p>
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
              Everything your pet needs
            </h2>
            <p className="mt-3 text-gray-500">
              From daily reminders to lab analysis — PetAI covers it all.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <motion.div key={f.title}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.06 }}
                className="rounded-2xl border border-gray-100 bg-white p-6 hover:border-gray-200 hover:shadow-md transition-all duration-200">
                <div className={cn("flex h-11 w-11 items-center justify-center rounded-xl", FEATURE_TILE)}>
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
            <h2 className="text-3xl font-black text-gray-900 sm:text-4xl">Simple pricing</h2>
            <p className="mt-3 text-gray-500">Start free. Pay only when you want more.</p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {plans.map((plan, i) => (
              <motion.div key={plan.name}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className={cn(
                  "relative rounded-3xl border-2 p-6 flex flex-col",
                  plan.border,
                  plan.popular ? `shadow-xl ${colors.shadow}` : ""
                )}>
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className={cn("rounded-full px-4 py-1 text-xs font-bold text-white shadow-sm", colors.popularBadge)}>
                      Popular
                    </span>
                  </div>
                )}
                <div className={cn("rounded-2xl px-4 py-3 mb-5", plan.accent)}>
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
                      <Check className={cn("h-4 w-4 flex-shrink-0 mt-0.5", colors.accentText)} />
                      <span className="text-sm text-gray-600">{f}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/dashboard">
                  <Button
                    className={cn("w-full", plan.popular ? colors.btnPrimary : "")}
                    variant={plan.popular ? "default" : "outline"}>
                    {plan.cta}
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>

          <p className="text-center text-sm text-gray-400 mt-8">
            + 20% commission on consultations · 3% on marketplace deals · Breeding contract: $4.90
          </p>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className={cn("bg-gradient-to-r px-4 py-16 text-center", colors.ctaGradient)}>
        <div className="mx-auto max-w-2xl">
          <h2 className="text-3xl font-black text-white">Ready to give your pet the best care?</h2>
          <p className="mt-3 text-white/80">
            Join pet owners who already use AI for smarter health decisions.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link href="/dashboard">
              <Button size="lg" className="w-full sm:w-auto shadow-lg bg-white text-[var(--petai-primary)] hover:bg-[var(--petai-surface-variant)]">
                View Demo <ArrowRight className="h-5 w-5" />
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
            <span>AI Health OS for Pets</span>
          </div>
          <div className="flex items-center gap-4 flex-wrap justify-center">
            <span>© 2026</span>
            <a href="#features" className="hover:text-gray-600 transition-colors">Features</a>
            <a href="#pricing" className="hover:text-gray-600 transition-colors">Pricing</a>
            <Link href="/dashboard" className="hover:text-gray-600 transition-colors">Demo</Link>
            <Link href="/designs" className="hover:text-gray-600 transition-colors">20 Designs</Link>
            <Link href="/partner" className="text-emerald-600 hover:text-emerald-700 transition-colors font-semibold">For vets &amp; breeders →</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
