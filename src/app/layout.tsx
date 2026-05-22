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
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180" },
      { url: "/icons/icon-152.png", sizes: "152x152" },
      { url: "/icons/icon-167.png", sizes: "167x167" },
    ],
    shortcut: "/icons/icon-192.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "PetAI",
    startupImage: ["/icons/icon-512.png"],
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
