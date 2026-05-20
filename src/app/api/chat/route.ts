import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

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
  petContext?: {
    name?: string;
    species?: string;
    breed?: string;
    age?: number;
    healthScore?: number;
    recentLabs?: string;
  };
  history?: Array<{ role: "user" | "assistant"; content: string }>;
}

// Mock fallback when no API key — used in demo mode
function mockReply(message: string, petName: string): string {
  const q = message.toLowerCase();
  if (q.includes("alt") || q.includes("liver")) {
    return `${petName}'s ALT level (128 U/L) is slightly elevated. This usually means mild liver stress and can come from fatty foods, certain medications, or early liver conditions. I'd recommend: (1) switch to low-fat treats, (2) recheck in 4-6 weeks, (3) ask your vet about a bile acids test if levels stay elevated. (Demo mode — add ANTHROPIC_API_KEY for real AI)`;
  }
  if (q.includes("dental") || q.includes("teeth")) {
    return `Based on ${petName}'s age and breed, a professional dental cleaning is recommended within 2 months. Daily tooth brushing with pet-safe toothpaste can extend the time between cleanings. (Demo mode)`;
  }
  if (q.includes("weight")) {
    return `${petName}'s current weight is in the ideal range. Maintain with 2 cups of high-quality kibble twice daily and 30 min daily exercise. (Demo mode)`;
  }
  if (q.includes("vaccine") || q.includes("vaccin")) {
    return `${petName} is current on core vaccines (DHPP, Rabies). Next due: Rabies booster in March 2027. (Demo mode)`;
  }
  return `I can help with ${petName}'s health, nutrition, breeding, vaccinations, and more. Try asking about lab results, weight management, vaccines, or training! (Demo mode — set ANTHROPIC_API_KEY env var to enable real Claude)`;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as ChatRequest;
    const petName = body.petContext?.name ?? "your pet";

    // If no API key, return mock response
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json({
        reply: mockReply(body.message, petName),
        mode: "mock",
      });
    }

    const anthropic = new Anthropic({ apiKey });

    // Build context-aware system prompt
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

    const history = body.history ?? [];
    const messages: Anthropic.MessageParam[] = [
      ...history.map((h) => ({ role: h.role, content: h.content })),
      { role: "user", content: body.message },
    ];

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 1024,
      system: systemPrompt,
      messages,
    });

    const textBlock = response.content.find((b) => b.type === "text");
    const reply = textBlock && "text" in textBlock ? textBlock.text : "(no response)";

    return NextResponse.json({
      reply,
      mode: "live",
      usage: response.usage,
    });
  } catch (err) {
    console.error("[/api/chat] Error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
