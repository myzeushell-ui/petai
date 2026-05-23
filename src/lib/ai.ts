/**
 * Unified AI client — routes through Vercel AI Gateway.
 * On Vercel deploys the gateway auto-auths via OIDC (no API key needed).
 * Locally, set AI_GATEWAY_API_KEY (recommended) or ANTHROPIC_API_KEY.
 */
import { generateText } from "ai";
import { gateway } from "@ai-sdk/gateway";

const MODEL_ID = "anthropic/claude-sonnet-4-5";

export const aiMode = (): "live" | "mock" => {
  // Live when deployed on Vercel (OIDC works automatically),
  // OR when AI_GATEWAY_API_KEY is present (local dev w/ gateway),
  // OR when ANTHROPIC_API_KEY is present (direct fallback).
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
  // Always use the gateway provider — even when ANTHROPIC_API_KEY exists,
  // we prefer routing through Gateway for unified billing / observability.
  const result = await generateText({
    model: gateway(MODEL_ID),
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
