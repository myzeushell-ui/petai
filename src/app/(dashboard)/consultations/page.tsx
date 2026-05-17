"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { consultants, specialtyLabels, type Consultant, type ConsultantSpecialty } from "@/data/consultants";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Star, MapPin, Clock, Video, Filter, Calendar, CreditCard, Check, ArrowLeft, Lock, Shield,
} from "lucide-react";

type Step = "list" | "detail" | "booking" | "payment" | "success";

const TIME_SLOTS = ["09:00", "10:30", "12:00", "14:00", "15:30", "17:00", "18:30"];

export default function ConsultationsPage() {
  const [step, setStep] = useState<Step>("list");
  const [filter, setFilter] = useState<ConsultantSpecialty | "all">("all");
  const [selected, setSelected] = useState<Consultant | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [paying, setPaying] = useState(false);

  const visible = filter === "all" ? consultants : consultants.filter((c) => c.specialty === filter);

  const reset = () => {
    setStep("list");
    setSelected(null);
    setTime(null);
  };

  const startPay = async () => {
    setPaying(true);
    await new Promise((r) => setTimeout(r, 1300));
    setPaying(false);
    setStep("success");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Consultations</h1>
          <p className="text-sm text-gray-500">Vets, trainers, breeders — online and in-person</p>
        </div>
        {step !== "list" && (
          <Button variant="ghost" size="sm" onClick={reset}>
            <ArrowLeft className="h-4 w-4" /> Back to list
          </Button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {step === "list" && (
          <motion.div key="list" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-4">
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              <Filter className="h-4 w-4 text-gray-400 flex-shrink-0" />
              <button onClick={() => setFilter("all")}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${filter === "all" ? "bg-green-500 text-white" : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200"}`}>
                All
              </button>
              {(Object.keys(specialtyLabels) as ConsultantSpecialty[]).map((s) => (
                <button key={s} onClick={() => setFilter(s)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${filter === s ? "bg-green-500 text-white" : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200"}`}>
                  {specialtyLabels[s]}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {visible.map((c, i) => (
                <motion.div key={c.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                  <Card className="hover:shadow-md transition-shadow cursor-pointer h-full"
                    onClick={() => { setSelected(c); setStep("detail"); }}>
                    <CardContent className="p-5">
                      <div className="flex items-start gap-4">
                        <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-gray-50 dark:bg-gray-800 text-3xl">
                          {c.emoji}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{c.name}</p>
                              <p className="text-xs text-gray-500 truncate">{c.title}</p>
                            </div>
                            <Badge variant="success" className="flex-shrink-0">
                              {c.price.toLocaleString()} {c.currency}
                            </Badge>
                          </div>
                          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">
                            <span className="inline-flex items-center gap-1">
                              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                              <span className="font-semibold text-gray-700 dark:text-gray-300">{c.rating}</span>
                              <span>({c.reviewCount})</span>
                            </span>
                            <span className="inline-flex items-center gap-1">
                              <Clock className="h-3 w-3" /> {c.duration}
                            </span>
                            {c.availability !== "offline" && (
                              <span className="inline-flex items-center gap-1 text-green-600">
                                <Video className="h-3 w-3" /> Online
                              </span>
                            )}
                            {c.location && (
                              <span className="inline-flex items-center gap-1">
                                <MapPin className="h-3 w-3" /> {c.location}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {step === "detail" && selected && (
          <motion.div key="detail" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gray-50 dark:bg-gray-800 text-4xl">{selected.emoji}</div>
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">{selected.name}</h2>
                    <p className="text-sm text-gray-500">{selected.title}</p>
                    <div className="mt-2 flex items-center gap-3 text-sm">
                      <span className="inline-flex items-center gap-1">
                        <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                        <span className="font-semibold">{selected.rating}</span>
                        <span className="text-gray-500">· {selected.reviewCount} reviews</span>
                      </span>
                      <span className="text-gray-300">·</span>
                      <span className="text-gray-600 dark:text-gray-300">{selected.experience} years of experience</span>
                    </div>
                  </div>
                </div>

                <p className="mt-5 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{selected.bio}</p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {selected.tags.map((t) => (
                    <Badge key={t} variant="info">{t}</Badge>
                  ))}
                </div>

                <div className="mt-6 grid grid-cols-3 gap-3 text-center">
                  <div className="rounded-xl bg-gray-50 dark:bg-gray-800 p-3">
                    <p className="text-xs text-gray-400">Price</p>
                    <p className="text-base font-bold text-gray-900 dark:text-white">{selected.price.toLocaleString()} {selected.currency}</p>
                  </div>
                  <div className="rounded-xl bg-gray-50 dark:bg-gray-800 p-3">
                    <p className="text-xs text-gray-400">Duration</p>
                    <p className="text-base font-bold text-gray-900 dark:text-white">{selected.duration}</p>
                  </div>
                  <div className="rounded-xl bg-gray-50 dark:bg-gray-800 p-3">
                    <p className="text-xs text-gray-400">Format</p>
                    <p className="text-base font-bold text-gray-900 dark:text-white">{selected.availability === "both" ? "Online / In-person" : selected.availability === "online" ? "Online" : "In-person"}</p>
                  </div>
                </div>

                <Button size="lg" className="mt-6 w-full" onClick={() => setStep("booking")}>
                  <Calendar className="h-4 w-4" /> Book a session
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {step === "booking" && selected && (
          <motion.div key="booking" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Pick a time</h2>
                <p className="text-sm text-gray-500 mt-1">Tomorrow, May 18 · {selected.name}</p>

                <div className="mt-6 grid grid-cols-3 gap-2 sm:grid-cols-4">
                  {TIME_SLOTS.map((t) => (
                    <button key={t} onClick={() => setTime(t)}
                      className={`rounded-xl border-2 py-3 text-sm font-semibold transition-all ${time === t ? "border-green-500 bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-300" : "border-gray-100 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:border-gray-200"}`}>
                      {t}
                    </button>
                  ))}
                </div>

                <div className="mt-6 rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 p-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Session</span>
                    <span className="font-medium text-gray-900 dark:text-white">{selected.duration}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm mt-1">
                    <span className="text-gray-500">PetAI fee</span>
                    <span className="text-gray-400">included</span>
                  </div>
                  <div className="border-t border-gray-200 dark:border-gray-700 my-3" />
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-900 dark:text-white">Due</span>
                    <span className="text-2xl font-black text-gray-900 dark:text-white">{selected.price.toLocaleString()} {selected.currency}</span>
                  </div>
                </div>

                <Button size="lg" disabled={!time} className="mt-6 w-full" onClick={() => setStep("payment")}>
                  <CreditCard className="h-4 w-4" /> Continue to payment
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {step === "payment" && selected && (
          <motion.div key="payment" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Lock className="h-3 w-3" /> Secure payment · Stripe
                </div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mt-2">Pay for session</h2>

                <div className="mt-5 space-y-3">
                  <div>
                    <label className="text-xs font-medium text-gray-500">Card number</label>
                    <div className="mt-1 flex items-center gap-2 rounded-xl border border-gray-200 dark:border-gray-700 px-4 py-3">
                      <span className="text-sm font-mono tracking-wider text-gray-900 dark:text-white">4242 4242 4242 4242</span>
                      <span className="ml-auto text-xs font-semibold text-blue-600">VISA</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-medium text-gray-500">MM/YY</label>
                      <div className="mt-1 rounded-xl border border-gray-200 dark:border-gray-700 px-4 py-3 text-sm font-mono text-gray-900 dark:text-white">12 / 28</div>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500">CVC</label>
                      <div className="mt-1 rounded-xl border border-gray-200 dark:border-gray-700 px-4 py-3 text-sm font-mono text-gray-900 dark:text-white">•••</div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 rounded-2xl bg-gray-50 dark:bg-gray-800 p-4 space-y-1.5 text-sm">
                  <div className="flex justify-between"><span className="text-gray-500">{selected.name}</span><span className="font-medium">{selected.price.toLocaleString()} {selected.currency}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Time</span><span className="font-medium">tomorrow, {time}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Pet</span><span className="font-medium">Luna</span></div>
                  <div className="border-t border-gray-200 dark:border-gray-700 my-2" />
                  <div className="flex justify-between text-base"><span className="font-semibold">Total</span><span className="font-black">{selected.price.toLocaleString()} {selected.currency}</span></div>
                </div>

                <Button size="lg" disabled={paying} className="mt-6 w-full" onClick={startPay}>
                  {paying ? (<><span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" /> Processing...</>) : (<><Shield className="h-4 w-4" /> Pay {selected.price.toLocaleString()} {selected.currency}</>)}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {step === "success" && selected && (
          <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
            <Card>
              <CardContent className="p-8 text-center">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 300, damping: 18 }}
                  className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-950/40">
                  <Check className="h-10 w-10 text-green-600" strokeWidth={3} />
                </motion.div>
                <h2 className="mt-5 text-2xl font-bold text-gray-900 dark:text-white">Booking confirmed!</h2>
                <p className="mt-2 text-sm text-gray-500">
                  {selected.name} · tomorrow, May 18 at {time}
                </p>

                <div className="mt-6 rounded-2xl border border-green-200 dark:border-green-900/40 bg-green-50 dark:bg-green-950/20 p-4 text-left">
                  <p className="text-xs font-semibold text-green-700 dark:text-green-400 uppercase tracking-wide">Training plan delivered</p>
                  <p className="text-sm text-green-900 dark:text-green-300 mt-1">
                    An 8-week basic obedience plan is already in your profile. Trainer will reach out 1 hour before the session.
                  </p>
                </div>

                <Button size="lg" variant="outline" className="mt-6" onClick={reset}>Back to list</Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
