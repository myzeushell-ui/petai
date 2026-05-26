"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard, Bot, FlaskConical, Clock, Bell, FileText,
  PawPrint, ShoppingCart, Utensils, Stethoscope, Dna, Mic, GraduationCap,
} from "lucide-react";
import { useVariant } from "@/contexts/VariantContext";
import { useLocale } from "@/contexts/LocaleContext";
import { t, type LocaleString } from "@/lib/i18n";

const navItems: Array<{ href: string; label: LocaleString; icon: any }> = [
  { href: "/dashboard",     label: { en: "Dashboard", ru: "Главная" },     icon: LayoutDashboard },
  { href: "/assistant",     label: { en: "AI",        ru: "AI" },          icon: Bot },
  { href: "/upbringing",    label: { en: "Raise",     ru: "Воспитание" },  icon: GraduationCap },
  { href: "/breeds",        label: { en: "Breeds",    ru: "Породы" },      icon: PawPrint },
  { href: "/nutrition",     label: { en: "Nutrition", ru: "Питание" },     icon: Utensils },
  { href: "/breeding",      label: { en: "Breeding",  ru: "Разведение" },  icon: Dna },
  { href: "/collar",        label: { en: "Collar",    ru: "Ошейник" },     icon: Mic },
  { href: "/marketplace",   label: { en: "Market",    ru: "Маркет" },      icon: ShoppingCart },
  { href: "/consultations", label: { en: "Vets",      ru: "Веты" },        icon: Stethoscope },
  { href: "/labs",          label: { en: "Labs",      ru: "Анализы" },     icon: FlaskConical },
  { href: "/timeline",      label: { en: "Timeline",  ru: "История" },     icon: Clock },
  { href: "/reminders",     label: { en: "Reminders", ru: "Напоминания" }, icon: Bell },
  { href: "/vet-report",    label: { en: "Reports",   ru: "Отчёты" },      icon: FileText },
];

export function TopNav() {
  const pathname = usePathname();
  const { colors } = useVariant();
  const { locale } = useLocale();

  return (
    <nav className={`border-b-2 ${colors.headerStyle} overflow-hidden`}>
      <div className="overflow-x-auto scrollbar-none">
        <div className="flex items-center gap-1 px-4 py-2 min-w-max">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`relative flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition-all ${
                    isActive
                      ? colors.pillActive
                      : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  <Icon className="h-4 w-4" strokeWidth={isActive ? 2.5 : 2} />
                  <span>{t(item.label, locale)}</span>
                  {item.href === "/reminders" && (
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] text-white">3</span>
                  )}
                </motion.div>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
