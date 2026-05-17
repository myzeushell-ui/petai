"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { LayoutDashboard, Bot, FlaskConical, Bell, FileText } from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", Icon: LayoutDashboard },
  { href: "/assistant", label: "AI",         Icon: Bot             },
  { href: "/labs",      label: "Labs",        Icon: FlaskConical    },
  { href: "/reminders", label: "Reminders",   Icon: Bell            },
  { href: "/vet-report",label: "Report",      Icon: FileText        },
];

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-100 bg-white/95 backdrop-blur-sm lg:hidden safe-area-inset-bottom">
      <div className="flex items-stretch">
        {navItems.map(({ href, label, Icon }) => {
          const isActive = pathname === href;
          return (
            <Link key={href} href={href}
              className="flex flex-1 flex-col items-center justify-center gap-0.5 py-2.5 relative">
              {isActive && (
                <motion.div layoutId="mobileNavLine"
                  className="absolute top-0 left-1/2 -translate-x-1/2 h-[2.5px] w-8 rounded-full bg-green-500"
                  transition={{ type: "spring", stiffness: 500, damping: 35 }} />
              )}
              <motion.div
                animate={{ scale: isActive ? 1.1 : 1, y: isActive ? -1 : 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 22 }}>
                <Icon className={`h-[22px] w-[22px] transition-colors duration-200 ${isActive ? "text-green-600" : "text-gray-400"}`}
                  strokeWidth={isActive ? 2.5 : 1.8} />
              </motion.div>
              <motion.span animate={{ opacity: isActive ? 1 : 0.5 }}
                className={`text-[10px] font-semibold leading-none ${isActive ? "text-green-600" : "text-gray-400"}`}>
                {label}
              </motion.span>
            </Link>
          );
        })}
      </div>
      {/* iPhone home indicator space */}
      <div className="h-safe-area-inset-bottom" />
    </nav>
  );
}
