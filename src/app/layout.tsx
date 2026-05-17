import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "PetAI — AI Health OS for Pets",
  description:
    "Track your pet's health, get AI-powered insights, analyze lab results, and never miss a reminder. PetAI is the intelligent health operating system for your pets.",
  keywords: ["pet health", "AI vet", "pet care", "health tracking", "lab results", "ветеринар", "здоровье питомца"],
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🐾</text></svg>",
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
    <html lang="ru" className={inter.variable}>
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}
