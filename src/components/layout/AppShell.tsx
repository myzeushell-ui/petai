"use client";

import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { MobileBottomNav } from "./MobileBottomNav";
import { VariantSwitcher } from "./VariantSwitcher";
import { DemoModeBanner } from "@/components/demo/DemoModeBanner";
import { motion, AnimatePresence } from "framer-motion";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-[#0a0a0f]">
      <DemoModeBanner />

      <div className="flex flex-1">
        {/* Desktop sidebar */}
        <div className="hidden lg:flex lg:flex-shrink-0">
          <Sidebar />
        </div>

        {/* Mobile sidebar overlay */}
        <AnimatePresence>
          {sidebarOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-40 bg-black/40 lg:hidden"
                onClick={() => setSidebarOpen(false)}
              />
              <motion.div
                initial={{ x: -280 }}
                animate={{ x: 0 }}
                exit={{ x: -280 }}
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
          {/* Extra bottom padding on mobile so content doesn't hide behind bottom nav */}
          <main className="flex-1 overflow-y-auto p-4 pb-24 lg:p-6 lg:pb-6">
            {children}
          </main>
        </div>
      </div>

      {/* Mobile bottom navigation */}
      <MobileBottomNav />

      {/* Floating variant switcher */}
      <VariantSwitcher />
    </div>
  );
}
