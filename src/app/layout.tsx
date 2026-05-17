import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Providers } from "@/components/Providers";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#22c55e",
};

export const metadata: Metadata = {
  title: "PetAI — AI Health OS for Pets",
  description:
    "Track your pet's health, get AI-powered insights, analyze lab results, and never miss a reminder. PetAI is the intelligent health operating system for your pets.",
  keywords: ["pet health", "AI vet", "pet care", "health tracking", "lab results"],
  manifest: "/manifest.json",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🐾</text></svg>",
    apple: "/icons/icon-192.svg",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "PetAI",
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
  openGraph: {
    title: "PetAI — AI Health OS for Pets",
    description: "The intelligent health operating system for your pets. AI-powered health score, lab analysis, smart reminders.",
    type: "website",
    siteName: "PetAI",
  },
  twitter: {
    card: "summary_large_image",
    title: "PetAI — AI Health OS for Pets",
    description: "The intelligent health operating system for your pets.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={`${inter.className} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
