import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripeKey || !webhookSecret) {
    return NextResponse.json({ message: "Stripe webhook not configured" }, { status: 200 });
  }

  try {
    const Stripe = (await import("stripe")).default;
    const stripe = new Stripe(stripeKey, { apiVersion: "2024-12-18.acacia" as any });

    const signature = req.headers.get("stripe-signature");
    if (!signature) {
      return NextResponse.json({ error: "Missing stripe signature" }, { status: 400 });
    }

    const rawBody = await req.text();
    const event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as any;
      const analysisId = session.metadata?.analysisId;

      const supabase = getSupabaseServerClient();
      if (supabase && analysisId) {
        // Unlock analysis in database
        await supabase
          .from("analyses")
          .update({ is_unlocked: true })
          .eq("id", analysisId);

        // Record payment
        await supabase.from("payments").insert({
          analysis_id: analysisId,
          provider: "stripe",
          amount: session.amount_total || 399,
          currency: session.currency || "usd",
          status: "completed",
          provider_payment_id: session.id,
        });
      }
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
