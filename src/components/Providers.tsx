"use client";

import { ThemeProvider } from "@/contexts/ThemeContext";
import { VariantProvider } from "@/contexts/VariantContext";
import { LocaleProvider } from "@/contexts/LocaleContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <LocaleProvider>
        <VariantProvider>{children}</VariantProvider>
      </LocaleProvider>
    </ThemeProvider>
  );
}
