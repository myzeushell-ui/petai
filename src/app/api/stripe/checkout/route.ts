/**
 * Stripe Checkout — creates a hosted checkout session for Pro subscription.
 *
 * Setup:
 * 1. Create Stripe products + prices in dashboard
 * 2. Add to Vercel env:
 *    STRIPE_SECRET_KEY=sk_live_...
 *    STRIPE_PRICE_PRO=price_xxx (monthly $4.99)
 *    STRIPE_PRICE_BREEDER=price_xxx (monthly $9.99)
 *    STRIPE_WEBHOOK_SECRET=whsec_...
 *    NEXT_PUBLIC_APP_URL=https://petai-ochre.vercel.app
 * 3. Configure webhook endpoint to /api/stripe/webhook
 */
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export const runtime = "nodejs";

const PRICE_MAP = {
  pro: process.env.STRIPE_PRICE_PRO,
  breeder: process.env.STRIPE_PRICE_BREEDER,
};

export async function POST(req: NextRequest) {
  try {
    const secret = process.env.STRIPE_SECRET_KEY;
    if (!secret) {
      return NextResponse.json(
        { error: "Stripe not configured. Set STRIPE_SECRET_KEY in env.", configured: false },
        { status: 503 }
      );
    }

    const stripe = new Stripe(secret);
    const body = await req.json();
    const plan = (body.plan ?? "pro") as keyof typeof PRICE_MAP;
    const userId = body.userId as string | undefined;
    const email = body.email as string | undefined;

    const priceId = PRICE_MAP[plan];
    if (!priceId) {
      return NextResponse.json({ error: `Unknown plan or missing STRIPE_PRICE_${plan.toUpperCase()}` }, { status: 400 });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://petai-ochre.vercel.app";
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${appUrl}/settings?upgraded=true`,
      cancel_url: `${appUrl}/settings`,
      customer_email: email,
      client_reference_id: userId,
      metadata: { plan, userId: userId ?? "" },
      subscription_data: { metadata: { plan, userId: userId ?? "" } },
    });

    return NextResponse.json({ url: session.url, sessionId: session.id });
  } catch (err) {
    console.error("[/api/stripe/checkout] Error:", err);
    return NextResponse.json({ error: err instanceof Error ? err.message : "Unknown error" }, { status: 500 });
  }
}
