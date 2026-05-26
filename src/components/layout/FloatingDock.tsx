"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Bot, PawPrint, ShoppingCart, Stethoscope,
  FlaskConical, Dna, Utensils, MoreHorizontal, GraduationCap,
} from "lucide-react";
import { useState } from "react";
import { useVariant } from "@/contexts/VariantContext";
import { useLocale } from "@/contexts/LocaleContext";
import { t, type LocaleString } from "@/lib/i18n";

const mainItems: Array<{ href: string; label: LocaleString; Icon: any }> = [
  { href: "/dashboard",     label: { en: "Home",   ru: "Главная" }, Icon: LayoutDashboard },
  { href: "/assistant",     label: { en: "AI",     ru: "AI" },      Icon: Bot },
  { href: "/upbringing",    label: { en: "Raise",  ru: "Учить" },   Icon: GraduationCap },
  { href: "/breeds",        label: { en: "Breeds", ru: "Породы" },  Icon: PawPrint },
  { href: "/consultations", label: { en: "Vets",   ru: "Веты" },    Icon: Stethoscope },
];

const moreItems: Array<{ href: string; label: LocaleString; Icon: any }> = [
  { href: "/nutrition",   label: { en: "Nutrition", ru: "Питание" },     Icon: Utensils },
  { href: "/breeding",    label: { en: "Breeding",  ru: "Разведение" },  Icon: Dna },
  { href: "/labs",        label: { en: "Labs",      ru: "Анализы" },     Icon: FlaskConical },
  { href: "/marketplace", label: { en: "Market",    ru: "Маркет" },      Icon: ShoppingCart },
];

export function FloatingDock() {
  const pathname = usePathname();
  const [showMore, setShowMore] = useState(false);
  const { colors } = useVariant();
  const { locale } = useLocale();

  return (
    <>
      {/* Expanded menu */}
      <AnimatePresence>
        {showMore && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[59]"
              onClick={() => setShowMore(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[60] flex gap-2 rounded-2xl border border-white/10 bg-gray-900/95 dark:bg-gray-800/95 backdrop-blur-xl p-2 shadow-2xl"
            >
              {moreItems.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                const label = t(item.label, locale);
                return (
                  <Link key={item.href} href={item.href} onClick={() => setShowMore(false)}>
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className={`flex flex-col items-center gap-1 rounded-xl px-4 py-2.5 ${
                        isActive ? "bg-white/10" : "hover:bg-white/5"
                      }`}
                    >
                      <item.Icon className={`h-5 w-5 ${isActive ? colors.activeIcon : "text-gray-400"}`} />
                      <span className={`text-[10px] font-medium ${isActive ? colors.activeText : "text-gray-500"}`}>
                        {label}
                      </span>
                    </motion.div>
                  </Link>
                );
              })}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main dock */}
      <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-[58]">
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", damping: 20, stiffness: 300, delay: 0.2 }}
          className="flex items-center gap-1.5 rounded-full border border-white/10 bg-gray-900/90 dark:bg-gray-800/90 backdrop-blur-xl px-3 py-2 shadow-2xl shadow-black/30"
        >
          {mainItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link key={item.href} href={item.href} aria-label={t(item.label, locale)}>
                <motion.div
                  whileHover={{ scale: 1.15, y: -4 }}
                  whileTap={{ scale: 0.9 }}
                  className={`relative flex h-11 w-11 items-center justify-center rounded-full transition-colors ${
                    isActive
                      ? `${colors.logoBg} shadow-lg ${colors.shadow}`
                      : "hover:bg-white/10"
                  }`}
                >
                  <item.Icon
                    className={`h-5 w-5 ${isActive ? "text-white" : "text-gray-400"}`}
                    strokeWidth={isActive ? 2.5 : 1.8}
                  />
                  {isActive && (
                    <motion.div
                      layoutId="dockGlow"
                      className={`absolute -bottom-1.5 h-1 w-4 rounded-full ${colors.navLine} blur-[2px]`}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </motion.div>
              </Link>
            );
          })}

          {/* More button */}
          <motion.button
            whileHover={{ scale: 1.15, y: -4 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowMore(!showMore)}
            aria-label="More"
            className={`flex h-11 w-11 items-center justify-center rounded-full transition-colors ${
              showMore ? "bg-white/20" : "hover:bg-white/10"
            }`}
          >
            <MoreHorizontal className="h-5 w-5 text-gray-400" />
          </motion.button>
        </motion.div>
      </div>
    </>
  );
}
