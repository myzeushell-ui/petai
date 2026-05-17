"use client";

import { ThemeProvider } from "@/contexts/ThemeContext";
import { VariantProvider } from "@/contexts/VariantContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <VariantProvider>{children}</VariantProvider>
    </ThemeProvider>
  );
}
