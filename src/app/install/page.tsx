"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Platform = "ios" | "android" | "desktop" | "unknown";

export default function InstallPage() {
  const [platform, setPlatform] = useState<Platform>("unknown");
  const [browser, setBrowser] = useState<"safari" | "chrome" | "other">("other");

  useEffect(() => {
    const ua = navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(ua)) setPlatform("ios");
    else if (/android/.test(ua)) setPlatform("android");
    else setPlatform("desktop");

    if (/safari/.test(ua) && !/chrome|crios|fxios/.test(ua)) setBrowser("safari");
    else if (/chrome|crios/.test(ua)) setBrowser("chrome");
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-amber-50 text-gray-900">
      <div className="max-w-md mx-auto px-6 pt-12 pb-20">
        {/* Brand */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-xl shadow-green-500/30">
            <span className="text-3xl">🐾</span>
          </div>
          <div>
            <div className="text-2xl font-extrabold tracking-tight">PetAI</div>
            <div className="text-xs text-gray-500">AI health for pets</div>
          </div>
        </div>

        {platform === "unknown" && (
          <div className="text-center py-20">
            <div className="animate-pulse text-gray-400">Detecting your device...</div>
          </div>
        )}

        {/* iPhone instructions */}
        {platform === "ios" && (
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight mb-2 text-center">Install on iPhone</h1>
            <p className="text-center text-gray-600 mb-8">Add PetAI to your home screen — works like a real app, no App Store needed.</p>

            {browser !== "safari" && (
              <div className="bg-amber-100 border-l-4 border-amber-500 p-4 rounded-r-xl mb-6">
                <div className="font-bold text-amber-900">⚠️ Open in Safari</div>
                <div className="text-sm text-amber-800 mt-1">Adding to Home Screen only works in Safari. Copy this URL and open it there:</div>
                <div className="mt-2 p-2 bg-white rounded text-xs font-mono break-all">https://petai-ochre.vercel.app/install</div>
              </div>
            )}

            <ol className="space-y-5">
              {[
                { num: 1, title: "Tap Share button", desc: "At the bottom of Safari, tap the square with arrow ↑ pointing up.", icon: "⬆️" },
                { num: 2, title: "Tap \"Add to Home Screen\"", desc: "Scroll down in the share menu and tap it.", icon: "➕" },
                { num: 3, title: "Tap \"Add\" in the top right", desc: "PetAI icon will appear on your home screen.", icon: "✅" },
                { num: 4, title: "Open PetAI", desc: "Launch from home screen like any app. Full screen, no Safari bars.", icon: "🚀" },
              ].map((step) => (
                <div key={step.num} className="flex gap-4 bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 text-white font-extrabold flex items-center justify-center">
                    {step.num}
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-base">{step.title} {step.icon}</div>
                    <div className="text-sm text-gray-600 mt-1">{step.desc}</div>
                  </div>
                </div>
              ))}
            </ol>

            <Link href="/" className="block mt-8 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-center font-bold py-4 rounded-2xl shadow-lg shadow-green-500/30">
              Open PetAI now →
            </Link>

            <div className="mt-6 text-center text-xs text-gray-500">
              💡 Why no App Store? PetAI is free and Apple charges $99/year + a 1-week review just to publish. PWA install is the same experience — no waiting.
            </div>
          </div>
        )}

        {/* Android instructions */}
        {platform === "android" && (
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight mb-2 text-center">Install on Android</h1>
            <p className="text-center text-gray-600 mb-8">Web install (PWA) — recommended. Always up to date with the latest features.</p>

            {/* PWA — PRIMARY */}
            <Link
              href="/dashboard"
              className="block bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-2xl p-5 shadow-xl shadow-green-500/30 mb-4"
            >
              <div className="flex items-center gap-3">
                <div className="text-3xl">🌐</div>
                <div className="flex-1">
                  <div className="text-xs font-bold uppercase tracking-wider opacity-90">RECOMMENDED · LATEST</div>
                  <div className="text-xl font-extrabold">Open PetAI now →</div>
                  <div className="text-sm opacity-90 mt-1">Lifecycle upbringing guide, bilingual UI 🇬🇧/🇷🇺, AI assistant, lab analysis. Always current.</div>
                </div>
                <div className="text-2xl">↗</div>
              </div>
            </Link>

            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-6">
              <div className="font-bold text-emerald-900 text-sm">Add to home screen (looks like an installed app):</div>
              <ol className="text-sm text-emerald-900 mt-2 space-y-1 ml-4 list-decimal">
                <li>Open this page in Chrome (you might already be in it)</li>
                <li>Tap the menu (⋮) in the top right corner</li>
                <li>Tap <strong>&quot;Add to Home screen&quot;</strong> → <strong>&quot;Install&quot;</strong></li>
                <li>PetAI icon appears on your home screen. Opens full-screen, no browser bars.</li>
              </ol>
            </div>

            {/* Native APK — SECONDARY, clearly marked as old */}
            <div className="bg-white border border-gray-200 rounded-2xl p-5">
              <div className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">OR: Native APK (older version)</div>
              <div className="font-bold text-base text-gray-700">PetAI v1.0.0 (May 2026)</div>
              <p className="text-xs text-gray-500 mt-1 mb-3">
                Original native build. <strong>Does not include</strong> the bilingual UI or the lifecycle upbringing system —
                those are in the web version above. Useful only if you need offline access to the early features.
              </p>
              <a
                href="https://github.com/myzeushell-ui/petai/releases/download/v1.0.0/PetAI.apk"
                className="block bg-gray-100 text-gray-700 rounded-xl p-3 text-center text-sm font-semibold hover:bg-gray-200"
              >
                ↓ Download v1.0.0 APK (88 MB)
              </a>
            </div>
          </div>
        )}

        {/* Desktop */}
        {platform === "desktop" && (
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight mb-4 text-center">PetAI for mobile</h1>
            <p className="text-center text-gray-600 mb-8">Open this page on your phone to install.</p>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-6">
              <div className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Scan with phone camera</div>
              {/* QR code via free api */}
              <img
                src="https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=https%3A%2F%2Fpetai-ochre.vercel.app%2Finstall"
                alt="QR code to install page"
                className="w-full max-w-[260px] mx-auto"
              />
              <div className="text-center text-xs text-gray-500 mt-3 break-all">petai-ochre.vercel.app/install</div>
            </div>

            <div className="space-y-3">
              <Link href="/dashboard" className="block bg-gradient-to-r from-green-500 to-emerald-600 text-white text-center font-bold py-4 rounded-2xl shadow-lg shadow-green-500/30">
                🌐 Open web app (latest)
              </Link>
              <a
                href="https://github.com/myzeushell-ui/petai/releases/download/v1.0.0/PetAI.apk"
                className="block bg-white border-2 border-gray-200 text-gray-700 text-center font-semibold py-4 rounded-2xl text-sm"
              >
                ↓ Legacy v1.0.0 APK (88 MB)
              </a>
            </div>
          </div>
        )}
      </div>

      <footer className="text-center text-xs text-gray-400 pb-8">
        PetAI · AI health platform for pets · made with care
      </footer>
    </div>
  );
}
