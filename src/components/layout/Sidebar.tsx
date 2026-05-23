"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Bot,
  FlaskConical,
  Clock,
  Bell,
  FileText,
  Settings,
  PawPrint,
  ShoppingCart,
  Utensils,
  Stethoscope,
  Dna,
  Mic,
  GraduationCap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PetSwitcher } from "@/components/pet/PetSwitcher";
import { useVariant } from "@/contexts/VariantContext";
import { LanguageToggle } from "@/components/ui/LanguageToggle";
import { useLocale } from "@/contexts/LocaleContext";
import { t, type LocaleString } from "@/lib/i18n";

const navItems: Array<{ href: string; label: LocaleString; icon: any }> = [
  { href: "/dashboard", label: { en: "Dashboard", ru: "Главная" }, icon: LayoutDashboard },
  { href: "/assistant", label: { en: "AI Assistant", ru: "AI Ассистент" }, icon: Bot },
  { href: "/upbringing", label: { en: "Upbringing", ru: "Воспитание" }, icon: GraduationCap },
  { href: "/breeds", label: { en: "Breeds", ru: "Породы" }, icon: PawPrint },
  { href: "/nutrition", label: { en: "Nutrition", ru: "Питание" }, icon: Utensils },
  { href: "/breeding", label: { en: "Breeding", ru: "Разведение" }, icon: Dna },
  { href: "/collar", label: { en: "Smart Collar", ru: "Умный ошейник" }, icon: Mic },
  { href: "/marketplace", label: { en: "Marketplace", ru: "Маркетплейс" }, icon: ShoppingCart },
  { href: "/consultations", label: { en: "Consultations", ru: "Консультации" }, icon: Stethoscope },
  { href: "/labs", label: { en: "Lab Results", ru: "Анализы" }, icon: FlaskConical },
  { href: "/timeline", label: { en: "Timeline", ru: "История" }, icon: Clock },
  { href: "/reminders", label: { en: "Reminders", ru: "Напоминания" }, icon: Bell },
  { href: "/vet-report", label: { en: "Vet Report", ru: "Отчёт ветеринару" }, icon: FileText },
];

export function Sidebar() {
  const pathname = usePathname();
  const { colors } = useVariant();
  const { locale } = useLocale();

  return (
    <aside className="flex h-full w-64 flex-col border-r border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
      <div className="flex h-16 items-center gap-3 border-b border-gray-100 dark:border-gray-800 px-5">
        <div className={cn("flex h-9 w-9 items-center justify-center rounded-xl text-xl shadow-sm", colors.logoBg)}>
          🐾
        </div>
        <div>
          <span className="text-lg font-bold text-gray-900 dark:text-white">PetAI</span>
          <p className="text-xs text-gray-400">{locale === "ru" ? "OC здоровья питомцев" : "Health OS for Pets"}</p>
        </div>
      </div>

      <div className="border-b border-gray-100 dark:border-gray-800 px-4 py-3">
        <PetSwitcher />
      </div>

      <nav className="flex-1 overflow-y-auto p-3">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            const Icon = item.icon;
            const label = t(item.label, locale);

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                    isActive
                      ? `${colors.activeBg} ${colors.activeText}`
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
                  )}
                >
                  <Icon
                    className={cn("h-5 w-5 flex-shrink-0", isActive ? colors.activeIcon : colors.inactiveIcon)}
                  />
                  {label}
                  {item.href === "/reminders" && (
                    <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                      3
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-gray-100 dark:border-gray-800 p-3 space-y-2">
        <div className="flex justify-center">
          <LanguageToggle />
        </div>
        <Link
          href="/settings"
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-400 transition-all hover:bg-gray-50 dark:hover:bg-gray-800"
        >
          <Settings className="h-5 w-5 text-gray-400" />
          {locale === "ru" ? "Настройки" : "Settings"}
        </Link>
      </div>
    </aside>
  );
}
