"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard, Bot, FlaskConical, Clock, Bell, FileText,
  PawPrint, ShoppingCart, Utensils, Stethoscope, Dna, Mic,
} from "lucide-react";
import { useVariant } from "@/contexts/VariantContext";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/assistant", label: "AI", icon: Bot },
  { href: "/breeds", label: "Breeds", icon: PawPrint },
  { href: "/nutrition", label: "Nutrition", icon: Utensils },
  { href: "/breeding", label: "Breeding", icon: Dna },
  { href: "/collar", label: "Collar", icon: Mic },
  { href: "/marketplace", label: "Market", icon: ShoppingCart },
  { href: "/consultations", label: "Vets", icon: Stethoscope },
  { href: "/labs", label: "Labs", icon: FlaskConical },
  { href: "/timeline", label: "Timeline", icon: Clock },
  { href: "/reminders", label: "Reminders", icon: Bell },
  { href: "/vet-report", label: "Reports", icon: FileText },
];

export function TopNav() {
  const pathname = usePathname();
  const { colors } = useVariant();

  return (
    <nav className="border-b-2 border-indigo-100 dark:border-indigo-900/50 bg-white dark:bg-gray-900 overflow-hidden">
      <div className="overflow-x-auto scrollbar-none">
        <div className="flex items-center gap-1 px-4 py-2 min-w-max">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
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
                  <span>{item.label}</span>
                  {item.label === "Reminders" && (
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
