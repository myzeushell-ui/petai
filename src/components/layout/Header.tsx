"use client";

import { Bell, Search, Menu, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useThemeMode } from "@/contexts/ThemeContext";
import { useVariant } from "@/contexts/VariantContext";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { PetSwitcher } from "@/components/pet/PetSwitcher";

interface HeaderProps {
  onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { isDark, toggle } = useThemeMode();
  const { colors } = useVariant();

  return (
    <header className={cn("sticky top-0 z-30 backdrop-blur-sm", colors.headerStyle)}>
      <div className="flex h-16 items-center gap-4 px-4 lg:px-6">
        {/* Menu button — only Emerald has sidebar so only it needs hamburger on mobile */}
        {colors.layout === "sidebar" && (
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={onMenuClick}>
            <Menu className="h-5 w-5" />
          </Button>
        )}

        <Link href="/" className={cn("flex items-center gap-2", colors.layout === "sidebar" ? "lg:hidden" : "")}>
          <div className={cn("flex h-8 w-8 items-center justify-center rounded-xl", colors.logoBg)}>
            <span className="text-lg">🐾</span>
          </div>
          <span className="text-lg font-bold text-gray-900 dark:text-white">PetAI</span>
        </Link>

        {/* Ocean: show pet switcher in header */}
        {colors.layout === "topnav" && (
          <div className="hidden lg:block ml-4 w-48">
            <PetSwitcher />
          </div>
        )}

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
          <div className={cn("flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br text-sm font-semibold text-white", colors.avatarGradient)}>
            AJ
          </div>
        </div>
      </div>
    </header>
  );
}
