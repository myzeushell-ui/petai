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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PetSwitcher } from "@/components/pet/PetSwitcher";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/assistant", label: "AI Assistant", icon: Bot },
  { href: "/labs", label: "Lab Results", icon: FlaskConical },
  { href: "/timeline", label: "Health Timeline", icon: Clock },
  { href: "/reminders", label: "Reminders", icon: Bell },
  { href: "/vet-report", label: "Vet Report", icon: FileText },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-64 flex-col border-r border-gray-100 bg-white">
      <div className="flex h-16 items-center gap-3 border-b border-gray-100 px-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-green-500 text-xl shadow-sm">
          🐾
        </div>
        <div>
          <span className="text-lg font-bold text-gray-900">PetAI</span>
          <p className="text-xs text-gray-400">Health OS for Pets</p>
        </div>
      </div>

      <div className="border-b border-gray-100 px-4 py-3">
        <PetSwitcher />
      </div>

      <nav className="flex-1 overflow-y-auto p-3">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                    isActive
                      ? "bg-green-50 text-green-700"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  )}
                >
                  <Icon
                    className={cn("h-5 w-5 flex-shrink-0", isActive ? "text-green-600" : "text-gray-400")}
                  />
                  {item.label}
                  {item.label === "Reminders" && (
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

      <div className="border-t border-gray-100 p-3">
        <Link
          href="/settings"
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-600 transition-all hover:bg-gray-50"
        >
          <Settings className="h-5 w-5 text-gray-400" />
          Settings
        </Link>
      </div>
    </aside>
  );
}
