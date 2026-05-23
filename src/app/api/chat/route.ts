import { NextRequest, NextResponse } from "next/server";
import { aiMode, callAI } from "@/lib/ai";

export const runtime = "nodejs";
export const maxDuration = 30;

const SYSTEM_PROMPT = `You are PetAI, a friendly and knowledgeable AI veterinary assistant. You help pet owners understand their pet's health, behavior, and care.

Guidelines:
- Be warm and supportive — pet owners worry about their animals
- Give specific, actionable advice grounded in veterinary best practices
- Always recommend seeing a vet for: emergencies, persistent symptoms, anything requiring diagnosis or prescription
- Cite reasoning when explaining (e.g. "Golden Retrievers are prone to hip dysplasia, so...")
- For lab results: explain what each value means in plain English
- Never diagnose definitively — suggest possibilities and next steps
- Keep responses concise (3-5 sentences for simple Qs, longer for complex)
- Use the pet's name and species when given context

When the user provides pet context (name, breed, age, recent labs), incorporate it.`;

interface ChatRequest {
  message: string;
  petContext?: { name?: string; species?: string; breed?: string; age?: number; healthScore?: number; recentLabs?: string };
  history?: Array<{ role: "user" | "assistant"; content: string }>;
}

function mockReply(message: string, petName: string): string {
  const q = message.toLowerCase();
  if (q.includes("alt") || q.includes("liver"))
    return `${petName}'s ALT level (128 U/L) is slightly elevated. This usually means mild liver stress and can come from fatty foods, certain medications, or early liver conditions. I'd recommend: (1) switch to low-fat treats, (2) recheck in 4-6 weeks, (3) ask your vet about a bile acids test if levels stay elevated.`;
  if (q.includes("dental") || q.includes("teeth"))
    return `Based on ${petName}'s age and breed, a professional dental cleaning is recommended within 2 months. Daily tooth brushing with pet-safe toothpaste can extend the time between cleanings.`;
  if (q.includes("weight"))
    return `${petName}'s current weight is in the ideal range. Maintain with 2 cups of high-quality kibble twice daily and 30 min daily exercise.`;
  if (q.includes("vaccine") || q.includes("vaccin"))
    return `${petName} is current on core vaccines (DHPP, Rabies). Next due: Rabies booster in March 2027.`;
  return `I can help with ${petName}'s health, nutrition, breeding, vaccinations, and more. Try asking about lab results, weight management, vaccines, or training!`;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as ChatRequest;
    const petName = body.petContext?.name ?? "your pet";

    if (aiMode() === "mock") {
      return NextResponse.json({ reply: mockReply(body.message, petName), mode: "mock" });
    }

    let systemPrompt = SYSTEM_PROMPT;
    if (body.petContext) {
      const ctx = body.petContext;
      systemPrompt += `\n\nCURRENT PET CONTEXT:\n`;
      if (ctx.name) systemPrompt += `- Name: ${ctx.name}\n`;
      if (ctx.species) systemPrompt += `- Species: ${ctx.species}\n`;
      if (ctx.breed) systemPrompt += `- Breed: ${ctx.breed}\n`;
      if (ctx.age) systemPrompt += `- Age: ${ctx.age} years\n`;
      if (ctx.healthScore) systemPrompt += `- Health Score: ${ctx.healthScore}/100\n`;
      if (ctx.recentLabs) systemPrompt += `- Recent labs: ${ctx.recentLabs}\n`;
    }

    const messages = [
      ...(body.history ?? []),
      { role: "user" as const, content: body.message },
    ];

    const reply = await callAI({ system: systemPrompt, messages, maxTokens: 1024 });
    return NextResponse.json({ reply, mode: "live" });
  } catch (err) {
    console.error("[/api/chat] Error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
