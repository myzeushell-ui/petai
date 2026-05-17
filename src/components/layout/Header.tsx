"use client";

import { Bell, Search, Menu, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useThemeMode } from "@/contexts/ThemeContext";
import Link from "next/link";

interface HeaderProps {
  onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { isDark, toggle } = useThemeMode();

  return (
    <header className="sticky top-0 z-30 border-b border-gray-100 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
      <div className="flex h-16 items-center gap-4 px-4 lg:px-6">
        <Button variant="ghost" size="icon" className="lg:hidden" onClick={onMenuClick}>
          <Menu className="h-5 w-5" />
        </Button>

        <Link href="/" className="flex items-center gap-2 lg:hidden">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-green-500">
            <span className="text-lg">🐾</span>
          </div>
          <span className="text-lg font-bold text-gray-900 dark:text-white">PetAI</span>
        </Link>

        <div className="flex flex-1 items-center justify-end gap-2">
          <Button variant="ghost" size="icon" className="text-gray-500 dark:text-gray-400" onClick={toggle}>
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          <Button variant="ghost" size="icon" className="text-gray-500 dark:text-gray-400">
            <Search className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="relative text-gray-500 dark:text-gray-400">
            <Bell className="h-5 w-5" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
          </Button>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-blue-500 text-sm font-semibold text-white">
            AJ
          </div>
        </div>
      </div>
    </header>
  );
}
