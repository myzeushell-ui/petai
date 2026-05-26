"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft, Check, Stethoscope, Dna, GraduationCap, Star,
  Calendar, Users, DollarSign, Globe, Sparkles, ChevronRight, AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/contexts/LocaleContext";
import { LanguageToggle } from "@/components/ui/LanguageToggle";
import { cn } from "@/lib/utils";

/**
 * Partner landing page — collects applications from vets, breeders and
 * trainers who want to be listed on PetAI and accept bookings.
 *
 * Form posts to FormSubmit.co — a zero-backend service that forwards
 * to a configured email address. First submission requires the
 * recipient (myzeushell@gmail.com) to confirm by clicking a link in
 * the activation email. After that all submissions arrive directly.
 *
 * Replace FORMSUBMIT_EMAIL_OR_KEY with a hash after first activation
 * for spam-resistance: https://formsubmit.co/your_email → returns
 * a unique hash like `abcdef1234567890` to use instead.
 */

const FORMSUBMIT_ENDPOINT = "https://formsubmit.co/myzeushell@gmail.com";

const UI = {
  back:        { en: "Back to app",                   ru: "В приложение" },
  badge:       { en: "FOR VETS · TRAINERS · BREEDERS", ru: "ДЛЯ ВЕТОВ · КИНОЛОГОВ · ЗАВОДЧИКОВ" },
  heroTitle:   { en: "Grow your practice with PetAI", ru: "Развивай свою практику с PetAI" },
  heroSub:     { en: "Reach owners actively tracking their pet's health. Booked clients pre-filled with full health context — fewer wasted minutes per visit.", ru: "Доступ к владельцам, которые активно следят за здоровьем питомца. Клиент приходит с полным контекстом — меньше минут уходит впустую." },
  ctaApply:    { en: "Apply to join",                 ru: "Подать заявку" },
  ctaSeeHow:   { en: "See how it works",              ru: "Как это работает" },

  benefitsTitle: { en: "Why providers join us",   ru: "Почему специалисты выбирают нас" },
  benefit1Title: { en: "Pre-qualified clients",   ru: "Готовые клиенты" },
  benefit1Desc:  { en: "Owners arrive with full health timeline, lab results, breed profile — you start the consult at minute 5, not 20.", ru: "Владелец приходит с полным анамнезом, анализами, профилем породы — консультация начинается с 5-й минуты, не с 20-й." },
  benefit2Title: { en: "Your schedule, your rules",  ru: "Свой график, свои правила" },
  benefit2Desc:  { en: "Set availability, prices and cancellation policy. We never auto-book — every request needs your confirmation.", ru: "Сам ставишь слоты, цены и политику отмены. Авто-броней нет — каждая запись только с твоим подтверждением." },
  benefit3Title: { en: "Fair revenue share",        ru: "Честная комиссия" },
  benefit3Desc:  { en: "$29/mo listing fee, 15% commission per completed booking. No setup fees. Payouts every 2 weeks via Stripe.", ru: "$29/мес за листинг, 15% с каждой завершённой записи. Без подключения. Выплаты раз в 2 недели через Stripe." },
  benefit4Title: { en: "Built for trust",           ru: "Создано для доверия" },
  benefit4Desc:  { en: "Verified credentials badge, real reviews from real bookings, transparent dispute resolution.", ru: "Бейдж верифицированных документов, реальные отзывы от реальных броней, прозрачное разрешение споров." },

  rolesTitle:    { en: "We're onboarding now",      ru: "Сейчас открыт приём заявок от" },
  roleVet:       { en: "Veterinarians",              ru: "Ветеринаров" },
  roleVetDesc:   { en: "General practice, exotic, emergency, dermatology, dentistry, oncology, cardiology, behaviour", ru: "Общая практика, экзотика, экстренные, дерматология, стоматология, онкология, кардиология, поведение" },
  roleTrainer:   { en: "Trainers & behaviourists",   ru: "Кинологов и зоопсихологов" },
  roleTrainerDesc: { en: "Puppy class, force-free behaviour, sport training (agility, IPO, scent work), service-dog prep", ru: "Курсы щенков, безнасильственная коррекция, спорт (аджилити, IPO, поиск), служебные собаки" },
  roleBreeder:   { en: "Breeders",                   ru: "Заводчиков" },
  roleBreederDesc: { en: "Verified pedigree, health-tested parents, written contract template, microchip + first vaccines", ru: "Подтверждённый пед, тестированные родители, шаблон договора, чип + первые прививки" },

  formTitle:     { en: "Apply to partner",                 ru: "Подать заявку" },
  formSub:       { en: "We review every application personally. You'll hear back within 48 hours.", ru: "Каждую заявку проверяем лично. Ответ в течение 48 часов." },
  fieldName:     { en: "Your full name",       ru: "Полное имя" },
  fieldEmail:    { en: "Email",                ru: "Email" },
  fieldPhone:    { en: "Phone / WhatsApp",     ru: "Телефон / WhatsApp" },
  fieldRole:     { en: "Your role",            ru: "Ваша роль" },
  fieldRoleVet:  { en: "Veterinarian",         ru: "Ветеринар" },
  fieldRoleTr:   { en: "Trainer / behaviourist", ru: "Кинолог / зоопсихолог" },
  fieldRoleBr:   { en: "Breeder",              ru: "Заводчик" },
  fieldRoleOther:{ en: "Other (specify in notes)", ru: "Другое (опишите в комментарии)" },
  fieldCity:     { en: "City / country",       ru: "Город / страна" },
  fieldSpec:     { en: "Specialization (e.g. cardiology, agility, Golden Retrievers)", ru: "Специализация (например: кардиология, аджилити, голден ретриверы)" },
  fieldExp:      { en: "Years of practice",    ru: "Лет практики" },
  fieldUrl:      { en: "Website / Instagram / clinic URL (optional)", ru: "Сайт / Instagram / URL клиники (опционально)" },
  fieldNotes:    { en: "Anything else we should know? (optional)", ru: "Что ещё нам стоит знать? (опционально)" },
  submit:        { en: "Send application",     ru: "Отправить заявку" },
  sending:       { en: "Sending...",            ru: "Отправляю..." },

  successTitle:  { en: "Application sent!",          ru: "Заявка отправлена!" },
  successText:   { en: "We received your application and will reply within 48 hours to set up your provider profile.", ru: "Получили вашу заявку. Ответим в течение 48 часов чтобы настроить ваш профиль партнёра." },
  successReset:  { en: "Submit another",       ru: "Отправить ещё одну" },

  faqTitle:      { en: "Common questions",     ru: "Частые вопросы" },
  faq1Q:         { en: "When do bookings start?", ru: "Когда начнутся реальные брони?" },
  faq1A:         { en: "Profile listings go live within a week of approval. Booking + payment system launches with the first cohort of approved partners in 6-8 weeks. Early partners get 3 months listing free.", ru: "Профиль публикуется в течение недели после одобрения. Бронирование + платежи запускаются с первой группой одобренных партнёров через 6-8 недель. У ранних партнёров 3 месяца листинга бесплатно." },
  faq2Q:         { en: "What countries do you cover?", ru: "Какие страны охватываете?" },
  faq2A:         { en: "Launching first in EU, Russia, CIS and English-speaking US/UK markets. We support both EN and RU interfaces.", ru: "Стартуем с EU, России, СНГ и англоязычных США/Великобритании. Интерфейс EN и RU." },
  faq3Q:         { en: "Can I also accept online consults?", ru: "Можно ли принимать онлайн-консультации?" },
  faq3A:         { en: "Yes. Hybrid profiles (in-clinic + telehealth) get priority placement. We provide the video stack — you don't need Zoom.", ru: "Да. Гибридные профили (клиника + телемедицина) — в приоритете показа. Видео даём мы, Zoom не нужен." },
};

type Role = "vet" | "trainer" | "breeder" | "other";

export default function PartnerLandingPage() {
  const { locale } = useLocale();
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [role, setRole] = useState<Role>("vet");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const form = new FormData(e.currentTarget);
      // Honeypot for spam
      form.append("_subject", "PetAI Partner Application");
      form.append("_template", "table");
      form.append("_captcha", "false");
      const res = await fetch(FORMSUBMIT_ENDPOINT, {
        method: "POST",
        body: form,
        headers: { Accept: "application/json" },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error");
    } finally {
      setSubmitting(false);
    }
  };

  const tt = (k: keyof typeof UI) => UI[k][locale];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-amber-50 text-gray-900">
      {/* Nav */}
      <nav className="sticky top-0 z-40 border-b border-gray-100 bg-white/90 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500 text-lg shadow-sm">🐾</div>
            <span className="text-lg font-bold">PetAI <span className="text-xs font-medium text-emerald-600 ml-1 uppercase tracking-wider">Partners</span></span>
          </Link>
          <div className="flex items-center gap-3">
            <LanguageToggle variant="compact" />
            <Link href="/dashboard" className="text-sm text-gray-500 hover:text-gray-900 flex items-center gap-1">
              <ArrowLeft className="h-3.5 w-3.5" /> {tt("back")}
            </Link>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-5xl px-4 pt-12 pb-20">
        {/* Hero */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-xs font-bold text-emerald-700 tracking-wider">
            <Sparkles className="h-3 w-3" />
            {tt("badge")}
          </span>
          <h1 className="mt-6 text-4xl sm:text-5xl font-black tracking-tight leading-tight max-w-3xl mx-auto">
            {tt("heroTitle")}
          </h1>
          <p className="mt-5 text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            {tt("heroSub")}
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a href="#apply">
              <Button size="lg" className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg shadow-emerald-200/50">
                {tt("ctaApply")} <ChevronRight className="h-4 w-4" />
              </Button>
            </a>
            <a href="#benefits">
              <Button size="lg" variant="outline">{tt("ctaSeeHow")}</Button>
            </a>
          </div>
        </motion.section>

        {/* Benefits */}
        <section id="benefits" className="mb-16">
          <h2 className="text-2xl font-bold text-center mb-8">{tt("benefitsTitle")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { icon: Users,      title: tt("benefit1Title"), desc: tt("benefit1Desc"),  color: "bg-blue-100 text-blue-600" },
              { icon: Calendar,   title: tt("benefit2Title"), desc: tt("benefit2Desc"),  color: "bg-purple-100 text-purple-600" },
              { icon: DollarSign, title: tt("benefit3Title"), desc: tt("benefit3Desc"),  color: "bg-emerald-100 text-emerald-600" },
              { icon: Star,       title: tt("benefit4Title"), desc: tt("benefit4Desc"),  color: "bg-amber-100 text-amber-600" },
            ].map((b, i) => (
              <motion.div
                key={b.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
              >
                <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl mb-3", b.color)}>
                  <b.icon className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-gray-900 mb-1.5">{b.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{b.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Roles */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-center mb-8">{tt("rolesTitle")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: Stethoscope,    title: tt("roleVet"),     desc: tt("roleVetDesc"),     color: "from-blue-500 to-cyan-600" },
              { icon: GraduationCap,  title: tt("roleTrainer"), desc: tt("roleTrainerDesc"), color: "from-purple-500 to-pink-600" },
              { icon: Dna,            title: tt("roleBreeder"), desc: tt("roleBreederDesc"), color: "from-amber-500 to-orange-600" },
            ].map((r) => (
              <div key={r.title} className="rounded-2xl border border-gray-100 bg-white p-5 text-center">
                <div className={cn("mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-md mb-3", r.color)}>
                  <r.icon className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-gray-900 mb-1.5">{r.title}</h3>
                <p className="text-xs text-gray-600 leading-relaxed">{r.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Application form */}
        <section id="apply" className="mb-16 scroll-mt-20">
          <div className="rounded-3xl border border-emerald-200 bg-gradient-to-br from-white to-emerald-50 p-6 sm:p-8 shadow-xl shadow-emerald-100/40">
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500 text-white mb-4">
                  <Check className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{tt("successTitle")}</h3>
                <p className="text-gray-600 max-w-md mx-auto mb-6">{tt("successText")}</p>
                <Button onClick={() => setSubmitted(false)} variant="outline">{tt("successReset")}</Button>
              </motion.div>
            ) : (
              <>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold mb-1.5">{tt("formTitle")}</h2>
                  <p className="text-sm text-gray-600">{tt("formSub")}</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Honeypot for FormSubmit */}
                  <input type="text" name="_honey" style={{ display: "none" }} />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field name="name" label={tt("fieldName")} required />
                    <Field name="email" label={tt("fieldEmail")} type="email" required />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field name="phone" label={tt("fieldPhone")} required />
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">{tt("fieldRole")}</label>
                      <select
                        name="role"
                        value={role}
                        onChange={(e) => setRole(e.target.value as Role)}
                        required
                        className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                      >
                        <option value="vet">{tt("fieldRoleVet")}</option>
                        <option value="trainer">{tt("fieldRoleTr")}</option>
                        <option value="breeder">{tt("fieldRoleBr")}</option>
                        <option value="other">{tt("fieldRoleOther")}</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field name="city" label={tt("fieldCity")} required icon={<Globe className="h-4 w-4 text-gray-400" />} />
                    <Field name="years" label={tt("fieldExp")} type="number" required />
                  </div>
                  <Field name="specialization" label={tt("fieldSpec")} required />
                  <Field name="url" label={tt("fieldUrl")} />
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">{tt("fieldNotes")}</label>
                    <textarea
                      name="notes"
                      rows={3}
                      className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 resize-y"
                    />
                  </div>

                  {error && (
                    <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
                      <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                      {error}
                    </div>
                  )}

                  <Button
                    type="submit"
                    size="lg"
                    disabled={submitting}
                    className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg shadow-emerald-200/50 disabled:opacity-50"
                  >
                    {submitting ? tt("sending") : tt("submit")}
                  </Button>
                </form>
              </>
            )}
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-center mb-6">{tt("faqTitle")}</h2>
          <div className="space-y-3">
            {[
              { q: tt("faq1Q"), a: tt("faq1A") },
              { q: tt("faq2Q"), a: tt("faq2A") },
              { q: tt("faq3Q"), a: tt("faq3A") },
            ].map((item, i) => (
              <details key={i} className="group rounded-2xl border border-gray-100 bg-white p-4 hover:shadow-sm">
                <summary className="flex items-center justify-between cursor-pointer text-sm font-semibold text-gray-900 list-none">
                  {item.q}
                  <ChevronRight className="h-4 w-4 text-gray-400 group-open:rotate-90 transition-transform" />
                </summary>
                <p className="mt-3 text-sm text-gray-600 leading-relaxed">{item.a}</p>
              </details>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-gray-100 px-4 py-8 text-center text-xs text-gray-400">
        PetAI · {locale === "ru" ? "Платформа здоровья питомцев на AI" : "AI Health Platform for Pets"} · {new Date().getFullYear()}
      </footer>
    </div>
  );
}

function Field({ name, label, type = "text", required, icon }: {
  name: string; label: string; type?: string; required?: boolean; icon?: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">{label}</label>
      <div className="relative">
        {icon && <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">{icon}</div>}
        <input
          name={name}
          type={type}
          required={required}
          className={cn(
            "w-full rounded-xl border border-gray-200 bg-white py-2.5 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100",
            icon ? "pl-9 pr-3" : "px-3"
          )}
        />
      </div>
    </div>
  );
}
