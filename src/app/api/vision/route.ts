import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

export const runtime = "nodejs";
export const maxDuration = 60;

const PET_VISION_SYSTEM = `You are PetAI Vision — analyzing a pet photo.

Given an image of a pet, identify:
1. Likely breed (with confidence %)
2. Estimated age range
3. Body condition score (1-9 BCS scale: 1-3 underweight, 4-5 ideal, 6-9 overweight)
4. Coat condition (healthy/dull/matted/balding)
5. Any visible concerns (eye discharge, skin issues, lameness signs, etc.)
6. Overall vibe (happy, anxious, alert, sleepy)

Return STRICT JSON only:
{
  "breed": { "name": "string", "confidence": number },
  "age_estimate": "string (e.g. '3-5 years', 'puppy', 'senior')",
  "body_condition": { "score": number, "label": "underweight"|"ideal"|"overweight", "note": "string" },
  "coat": { "condition": "string", "note": "string" },
  "concerns": [ "string", "string" ],
  "mood": "string",
  "summary": "1-sentence friendly summary"
}

NO markdown, NO preamble, JUST the JSON object.`;

const LAB_VISION_SYSTEM = `You are PetAI Lab Decoder — analyzing a photo or scan of veterinary lab results.

Read all visible values from the lab report. Identify:
- Test name and panel
- All numeric values with units
- Status vs reference range (normal/low/high/critical)
- Most concerning values
- Plain-English explanation owner can understand
- Recommended actions

Return STRICT JSON:
{
  "test_name": "string",
  "lab_date": "string or null",
  "panels": [
    { "name": "ALT", "value": 128, "unit": "U/L", "ref_low": 10, "ref_high": 100, "status": "high"|"low"|"normal"|"critical" }
  ],
  "overall_status": "normal"|"mild_concern"|"needs_followup"|"urgent",
  "summary": "Plain English explanation (2-3 sentences)",
  "concerning_values": [ "ALT is 28% above reference range" ],
  "recommendations": [ "Recheck ALT in 4-6 weeks", "Reduce fatty treats" ],
  "vet_questions": [ "Suggest follow-up bloodwork in 6 weeks?" ]
}

If image is not a lab report, return: { "error": "not_a_lab_report", "summary": "..." }`;

interface VisionRequest {
  image: string;  // base64 OR https URL
  mode: "pet" | "lab";
  petContext?: { name: string; species: string; breed: string; age: number };
}

function mockPetVision() {
  return {
    breed: { name: "Golden Retriever (Demo)", confidence: 87 },
    age_estimate: "Adult, 3-5 years",
    body_condition: { score: 5, label: "ideal", note: "Well-proportioned, healthy weight." },
    coat: { condition: "healthy", note: "Glossy and full." },
    concerns: ["None visible in this photo"],
    mood: "Happy and alert",
    summary: "Beautiful healthy Golden Retriever in excellent condition. (Demo mode — set ANTHROPIC_API_KEY for real AI analysis)",
  };
}

function mockLabVision() {
  return {
    test_name: "Complete Blood Count + Chemistry Panel (Demo)",
    lab_date: null,
    panels: [
      { name: "ALT", value: 128, unit: "U/L", ref_low: 10, ref_high: 100, status: "high" },
      { name: "Creatinine", value: 1.1, unit: "mg/dL", ref_low: 0.5, ref_high: 1.5, status: "normal" },
    ],
    overall_status: "mild_concern",
    summary: "ALT is mildly elevated; everything else looks normal. Likely fatty diet — try low-fat treats for 4 weeks and recheck.",
    concerning_values: ["ALT 128 U/L is 28% above normal max (100)"],
    recommendations: ["Switch to low-fat treats", "Recheck ALT in 4-6 weeks", "Add SAMe liver supplement"],
    vet_questions: ["Should we do a bile acids test if ALT stays elevated?"],
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as VisionRequest;
    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      return NextResponse.json({
        ...(body.mode === "lab" ? mockLabVision() : mockPetVision()),
        mode_label: "mock",
      });
    }

    const anthropic = new Anthropic({ apiKey });
    const system = body.mode === "lab" ? LAB_VISION_SYSTEM : PET_VISION_SYSTEM;

    // Image source: base64 or URL
    const imageSource: any = body.image.startsWith("http")
      ? { type: "url" as const, url: body.image }
      : { type: "base64" as const, media_type: "image/jpeg" as const, data: body.image.replace(/^data:image\/\w+;base64,/, "") };

    let userPrompt = body.mode === "lab" ? "Decode these lab results." : "Analyze this pet photo.";
    if (body.petContext) {
      userPrompt += `\n\nContext: this is ${body.petContext.name}, a ${body.petContext.age}-year-old ${body.petContext.breed} (${body.petContext.species}).`;
    }

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 1500,
      system,
      messages: [{
        role: "user",
        content: [
          { type: "image", source: imageSource },
          { type: "text", text: userPrompt },
        ],
      }],
    });

    const textBlock = response.content.find((b) => b.type === "text");
    const raw = textBlock && "text" in textBlock ? textBlock.text : "{}";

    let parsed;
    try {
      const cleaned = raw.replace(/^```json\s*/i, "").replace(/```\s*$/, "").trim();
      parsed = JSON.parse(cleaned);
    } catch {
      parsed = { summary: raw, error: "parse_failed" };
    }

    return NextResponse.json({ ...parsed, mode_label: "live" });
  } catch (err) {
    console.error("[/api/vision] Error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown", summary: "Vision API failed. Please try again." },
      { status: 200 }
    );
  }
}
