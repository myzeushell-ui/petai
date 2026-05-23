import { NextRequest, NextResponse } from "next/server";
import { aiMode, callAI, extractJSON } from "@/lib/ai";

export const runtime = "nodejs";
export const maxDuration = 30;

const SYSTEM = `You are PetAI Daily Insight — generate ONE short, personalized daily tip for a pet owner.

Given context about a pet (name, breed, age, recent health), produce:
- A specific, actionable tip
- Friendly tone, like a knowledgeable friend
- Reference the pet by name
- Vary topics: nutrition, exercise, mental stimulation, preventive care, breed-specific wisdom, seasonal advice

Return STRICT JSON:
{
  "title": "Catchy 4-6 word headline",
  "body": "1-2 sentence specific tip mentioning {pet.name}",
  "category": "nutrition"|"exercise"|"care"|"behavior"|"seasonal"|"preventive",
  "emoji": "single relevant emoji"
}

NO markdown, just JSON.`;

interface InsightReq { petContext: { name: string; species: string; breed: string; age: number; healthScore?: number }; }

const MOCK_TIPS = [
  { title: "Hydration check", body: "{pet} should drink ~30ml per kg daily — that's about 850ml for her size. Add ice cubes to make it fun!", category: "care", emoji: "💧" },
  { title: "Tooth brushing reminder", body: "Goldens are prone to dental tartar. Brush {pet}'s teeth 2-3x this week with pet toothpaste.", category: "preventive", emoji: "🪥" },
  { title: "Brain game time", body: "Try hiding treats in a snuffle mat for {pet} — 15 minutes of sniffing burns more energy than a long walk!", category: "behavior", emoji: "🧠" },
  { title: "Weight check", body: "Quick rib test: place hands on {pet}'s sides. If you can't feel ribs easily, time to cut treats by 25%.", category: "nutrition", emoji: "⚖️" },
  { title: "Joint protection", body: "Add omega-3 to {pet}'s food (1 tsp salmon oil) — Goldens benefit from joint support starting age 4.", category: "preventive", emoji: "🦴" },
];

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as InsightReq;
    const ctx = body.petContext;

    if (aiMode() === "mock") {
      const tip = MOCK_TIPS[Math.floor(Math.random() * MOCK_TIPS.length)];
      return NextResponse.json({ ...tip, body: tip.body.replace("{pet}", ctx.name), mode_label: "mock" });
    }

    const userMsg = `Generate today's tip for ${ctx.name} — a ${ctx.age}yo ${ctx.breed} (${ctx.species}). Health score: ${ctx.healthScore ?? 80}/100.`;

    const raw = await callAI({
      system: SYSTEM,
      maxTokens: 300,
      messages: [{ role: "user", content: userMsg }],
    });

    const parsed = extractJSON(raw);
    if (!parsed) {
      const fallback = MOCK_TIPS[0];
      return NextResponse.json({ ...fallback, body: fallback.body.replace("{pet}", ctx.name), mode_label: "live_fallback" });
    }
    return NextResponse.json({ ...parsed, mode_label: "live" });
  } catch (err) {
    console.error("[/api/insight] Error:", err);
    return NextResponse.json({ title: "Daily love", body: "Spend 5 extra minutes with your pet today — it matters more than you think.", category: "care", emoji: "❤️" });
  }
}
