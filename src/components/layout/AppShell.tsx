"use client";

import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { MobileBottomNav } from "./MobileBottomNav";
import { TopNav } from "./TopNav";
import { FloatingDock } from "./FloatingDock";
import { VariantSwitcher } from "./VariantSwitcher";
import { DemoModeBanner } from "@/components/demo/DemoModeBanner";
import { motion, AnimatePresence } from "framer-motion";
import { useVariant } from "@/contexts/VariantContext";
import { cn } from "@/lib/utils";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { colors } = useVariant();

  // Emerald — classic sidebar layout
  if (colors.layout === "sidebar") {
    return (
      <div className={cn("flex min-h-screen flex-col", colors.shellBg)}>
        <DemoModeBanner />
        <div className="flex flex-1">
          <div className="hidden lg:flex lg:flex-shrink-0">
            <Sidebar />
          </div>
          <AnimatePresence>
            {sidebarOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="fixed inset-0 z-40 bg-black/40 lg:hidden"
                  onClick={() => setSidebarOpen(false)}
                />
                <motion.div
                  initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
                  transition={{ type: "spring", damping: 25, stiffness: 300 }}
                  className="fixed left-0 top-0 z-50 h-full lg:hidden"
                >
                  <Sidebar />
                </motion.div>
              </>
            )}
          </AnimatePresence>
          <div className="flex flex-1 flex-col overflow-hidden">
            <Header onMenuClick={() => setSidebarOpen(true)} />
            <main className="flex-1 overflow-y-auto p-4 pb-24 lg:p-6 lg:pb-6">
              {children}
            </main>
          </div>
        </div>
        <MobileBottomNav />
        <VariantSwitcher />
      </div>
    );
  }

  // Ocean — top horizontal tabs, no sidebar
  if (colors.layout === "topnav") {
    return (
      <div className={cn("flex min-h-screen flex-col", colors.shellBg)}>
        <DemoModeBanner />
        <Header />
        <div className="hidden lg:block">
          <TopNav />
        </div>
        <main className="flex-1 overflow-y-auto p-4 pb-24 lg:p-6 lg:pb-6 mx-auto w-full max-w-6xl">
          {children}
        </main>
        <MobileBottomNav />
        <VariantSwitcher />
      </div>
    );
  }

  // Sunset — floating dock, no sidebar, glass aesthetic
  return (
    <div className={cn("flex min-h-screen flex-col", colors.shellBg)}>
      <DemoModeBanner />
      <Header />
      <main className="flex-1 overflow-y-auto p-4 pb-28 lg:p-6 lg:pb-28 mx-auto w-full max-w-5xl">
        {children}
      </main>
      <FloatingDock />
      <VariantSwitcher />
    </div>
  );
}
