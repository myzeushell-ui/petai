import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

export const runtime = "nodejs";
export const maxDuration = 30;

const TRIAGE_SYSTEM = `You are PetAI Triage — an AI veterinary triage assistant.

YOUR JOB
Help a pet owner figure out: "How urgent is this, and what should I do right now?"
You are NOT diagnosing. You are sorting symptoms into one of four buckets:
- EMERGENCY — go to vet ER now (uncontrolled bleeding, breathing distress, suspected poison, unconscious, seizure >5min, bloat, snake bite, hit by car)
- URGENT — see vet within 24h (significant pain, repeated vomiting/diarrhea >24h, won't eat/drink >24h, abscess, lethargy with fever signs)
- MONITOR — watch and see vet within 3-5 days if not improving (mild symptoms, isolated incident, mild GI upset, mild limp, single small wound)
- AT HOME — likely fine to manage at home (minor cuts, mild itching, anxiety, shedding, normal behavior changes)

CONVERSATION FLOW
1. The user describes a symptom. You ask 2-4 sharp clarifying questions one at a time.
2. After enough info, you give the triage verdict.

EVERY RESPONSE MUST BE STRICT JSON of this shape:
{
  "mode": "question" | "verdict",
  "message": "your text response to the user",
  "options"?: ["short answer 1", "short answer 2", "short answer 3"],
  "verdict"?: {
    "severity": "emergency" | "urgent" | "monitor" | "at_home",
    "headline": "1-line summary",
    "what_to_do": ["action 1", "action 2"],
    "red_flags": ["watch for X", "call vet if Y"],
    "likely_causes": ["possible cause 1", "possible cause 2"]
  }
}

RULES
- When asking a question, set mode="question" and provide 3-4 multiple-choice options when possible
- When ready to give the verdict, set mode="verdict" with full verdict object
- Always speak to the OWNER about their named pet (use the pet's name and species from context)
- Be warm but direct. No fluff. No disclaimers like "I'm not a vet" — owner knows.
- If EMERGENCY: skip questions, give verdict immediately
- 3-5 questions max before verdict
- For at_home/monitor, include specific home care steps

NEVER output anything except the JSON object. No markdown fences, no preamble.`;

interface TriageRequest {
  message: string;
  petContext: { name: string; species: string; breed: string; age: number };
  history?: Array<{ role: "user" | "assistant"; content: string }>;
}

function mockTriage(message: string, petName: string): any {
  const q = message.toLowerCase();
  if (q.includes("blood") || q.includes("кров") || q.includes("breathing") || q.includes("seizure")) {
    return {
      mode: "verdict",
      message: `Based on what you described, this is an emergency for ${petName}.`,
      verdict: {
        severity: "emergency",
        headline: `Possible serious condition — go to vet ER now`,
        what_to_do: ["Call your nearest 24/7 vet immediately", "Keep your pet calm and warm", "Bring any medications they take"],
        red_flags: ["Unconsciousness", "Difficulty breathing", "Pale or blue gums"],
        likely_causes: ["Trauma", "Toxin ingestion", "Severe internal issue"],
      },
    };
  }
  if (q.includes("vomit") || q.includes("diarrhea") || q.includes("not eating")) {
    return {
      mode: "question",
      message: `How long has ${petName} been showing these symptoms?`,
      options: ["Less than 12 hours", "12-24 hours", "1-3 days", "More than 3 days"],
    };
  }
  return {
    mode: "question",
    message: `Tell me more — when did ${petName} start showing this?`,
    options: ["Just now", "Earlier today", "Yesterday", "Few days ago"],
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as TriageRequest;
    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      return NextResponse.json({
        ...mockTriage(body.message, body.petContext.name),
        mode_label: "mock",
      });
    }

    const anthropic = new Anthropic({ apiKey });
    const ctx = body.petContext;
    const systemPrompt = `${TRIAGE_SYSTEM}\n\nPET CONTEXT:\n- Name: ${ctx.name}\n- Species: ${ctx.species}\n- Breed: ${ctx.breed}\n- Age: ${ctx.age} years`;

    const messages: Anthropic.MessageParam[] = [
      ...(body.history ?? []).map((h) => ({ role: h.role, content: h.content })),
      { role: "user", content: body.message },
    ];

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 1024,
      system: systemPrompt,
      messages,
    });

    const textBlock = response.content.find((b) => b.type === "text");
    const raw = textBlock && "text" in textBlock ? textBlock.text : "{}";

    // Parse JSON response from Claude
    let parsed;
    try {
      const cleaned = raw.replace(/^```json\s*/i, "").replace(/```\s*$/, "").trim();
      parsed = JSON.parse(cleaned);
    } catch {
      // Fallback: wrap raw text as a question
      parsed = { mode: "question", message: raw, options: [] };
    }

    return NextResponse.json({ ...parsed, mode_label: "live" });
  } catch (err) {
    console.error("[/api/triage] Error:", err);
    return NextResponse.json(
      { mode: "verdict", message: "Sorry — AI is having trouble. Please consult your vet directly.", verdict: { severity: "monitor", headline: "Could not assess", what_to_do: ["Consult your vet"], red_flags: [], likely_causes: [] } },
      { status: 200 }
    );
  }
}
