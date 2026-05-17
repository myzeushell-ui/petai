"use client";

import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { AppShell } from "@/components/layout/AppShell";
import { PetProvider } from "@/contexts/PetContext";
import { useVariant } from "@/contexts/VariantContext";

const pageAnimations = {
  fade: {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -8 },
    transition: { duration: 0.22, ease: "easeOut" as const },
  },
  slide: {
    initial: { opacity: 0, x: 40 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -40 },
    transition: { duration: 0.25, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] },
  },
  scale: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 1.02 },
    transition: { duration: 0.2, ease: "easeOut" as const },
  },
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { colors } = useVariant();
  const anim = pageAnimations[colors.animationType];

  return (
    <PetProvider>
      <AppShell>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={pathname}
            initial={anim.initial}
            animate={anim.animate}
            exit={anim.exit}
            transition={anim.transition}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </AppShell>
    </PetProvider>
  );
}
