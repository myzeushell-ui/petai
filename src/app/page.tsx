"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Activity, Bot, FlaskConical, Bell, Shield, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: Activity,
    title: "Health Score",
    description: "Real-time AI-powered health score based on all your pet's data",
    color: "bg-green-100 text-green-600",
  },
  {
    icon: Bot,
    title: "AI Health Assistant",
    description: "Ask anything about your pet's health. Get instant, personalized answers.",
    color: "bg-indigo-100 text-indigo-600",
  },
  {
    icon: FlaskConical,
    title: "Lab Analysis",
    description: "Upload bloodwork reports and get plain-English AI explanations",
    color: "bg-blue-100 text-blue-600",
  },
  {
    icon: Bell,
    title: "Smart Reminders",
    description: "Never miss a vaccine, medication, or checkup again",
    color: "bg-orange-100 text-orange-600",
  },
  {
    icon: Shield,
    title: "Vet Reports",
    description: "All visit records in one place with AI-generated summaries",
    color: "bg-purple-100 text-purple-600",
  },
  {
    icon: Zap,
    title: "Health Timeline",
    description: "Complete medical history at a glance with trend analysis",
    color: "bg-cyan-100 text-cyan-600",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-gray-100 bg-white/90 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-green-500 text-xl shadow-sm">
              🐾
            </div>
            <span className="text-xl font-bold text-gray-900">PetAI</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                Demo
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="sm">
                Open App
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="overflow-hidden bg-gradient-to-b from-green-50 via-white to-white px-4 pb-20 pt-20">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-4 py-1.5 text-sm font-medium text-green-700">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
              AI-Powered Pet Health · Demo Mode
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-6 text-5xl font-black tracking-tight text-gray-900 sm:text-6xl"
          >
            The AI Health OS
            <br />
            <span className="bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">
              for Your Pets
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mx-auto mt-6 max-w-2xl text-lg text-gray-500"
          >
            Track health scores, analyze lab results with AI, manage medications, and get
            personalized health insights — all in one place. Your pet deserves the same care as you.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center"
          >
            <Link href="/dashboard">
              <Button size="lg" className="w-full sm:w-auto shadow-lg shadow-green-200">
                View Live Demo
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              Join Waitlist
            </Button>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-4 text-sm text-gray-400"
          >
            No registration needed · All data is demo · Works on mobile
          </motion.p>
        </div>

        {/* App preview card */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mx-auto mt-16 max-w-3xl"
        >
          <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-2xl shadow-gray-200/80">
            <div className="flex items-center gap-2 border-b border-gray-100 bg-gray-50 px-5 py-3">
              <div className="h-3 w-3 rounded-full bg-red-400" />
              <div className="h-3 w-3 rounded-full bg-yellow-400" />
              <div className="h-3 w-3 rounded-full bg-green-400" />
              <span className="ml-2 text-xs text-gray-400">petai.app/dashboard</span>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-3xl">
                  🐕
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Luna · Golden Retriever</h3>
                  <p className="text-sm text-gray-500">4 years · Female · Spayed</p>
                </div>
                <div className="ml-auto text-right">
                  <div className="text-3xl font-black text-green-600">87</div>
                  <div className="text-xs text-gray-400">Health Score</div>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-3">
                {[
                  { label: "Vaccines", value: "Up to date ✅", color: "bg-green-50" },
                  { label: "ALT Level", value: "Elevated ⚠️", color: "bg-yellow-50" },
                  { label: "Dental", value: "Due soon 🦷", color: "bg-orange-50" },
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

      {/* Features */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <h2 className="text-3xl font-black text-gray-900 sm:text-4xl">
              Everything your pet&apos;s health needs
            </h2>
            <p className="mt-3 text-gray-500">
              From routine reminders to complex lab analysis — PetAI handles it all.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="rounded-2xl border border-gray-100 p-6 hover:border-gray-200 hover:shadow-sm transition-all"
                >
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl ${feature.color}`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 text-base font-semibold text-gray-900">{feature.title}</h3>
                  <p className="mt-1 text-sm text-gray-500">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-green-500 to-emerald-600 px-4 py-16 text-center">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-3xl font-black text-white">
            Ready to give your pet better care?
          </h2>
          <p className="mt-3 text-green-100">
            Join thousands of pet owners using AI to make smarter health decisions.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link href="/dashboard">
              <Button
                size="lg"
                className="bg-white text-green-700 hover:bg-green-50 w-full sm:w-auto shadow-lg"
              >
                Try the Demo
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 px-4 py-8 text-center text-sm text-gray-400">
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="text-xl">🐾</span>
          <span className="font-bold text-gray-600">PetAI</span>
        </div>
        <p>AI Health Operating System for Pets · Demo Prototype · 2025</p>
      </footer>
    </div>
  );
}
