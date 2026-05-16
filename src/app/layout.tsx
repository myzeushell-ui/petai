import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PetAI — AI Health OS for Pets",
  description:
    "Track your pet's health, get AI-powered insights, analyze lab results, and never miss a reminder. PetAI is the intelligent health operating system for your pets.",
  keywords: ["pet health", "AI vet", "pet care", "health tracking", "lab results"],
  openGraph: {
    title: "PetAI — AI Health OS for Pets",
    description: "The intelligent health operating system for your pets.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
