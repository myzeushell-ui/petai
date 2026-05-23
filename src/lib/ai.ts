/**
 * Unified AI client — routes through Vercel AI Gateway when deployed,
 * falls back to direct Anthropic if ANTHROPIC_API_KEY is set,
 * or mock mode if neither.
 */
import { generateText } from "ai";

const MODEL = "anthropic/claude-sonnet-4-5";

export const aiMode = (): "live" | "mock" => {
  // Vercel AI Gateway auto-auths when deployed (via OIDC).
  // For local dev, set AI_GATEWAY_API_KEY OR ANTHROPIC_API_KEY.
  const hasGateway = Boolean(process.env.AI_GATEWAY_API_KEY || process.env.VERCEL);
  const hasDirectKey = Boolean(process.env.ANTHROPIC_API_KEY);
  return hasGateway || hasDirectKey ? "live" : "mock";
};

interface CallOpts {
  system: string;
  messages: Array<{ role: "user" | "assistant"; content: string | any[] }>;
  maxTokens?: number;
}

export async function callAI(opts: CallOpts): Promise<string> {
  const result = await generateText({
    model: MODEL,
    system: opts.system,
    messages: opts.messages as any,
    maxOutputTokens: opts.maxTokens ?? 1024,
  });
  return result.text;
}

export function extractJSON(raw: string): any {
  try {
    const cleaned = raw.replace(/^```json\s*/i, "").replace(/```\s*$/, "").trim();
    return JSON.parse(cleaned);
  } catch {
    return null;
  }
}
