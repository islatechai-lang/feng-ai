import { NextRequest, NextResponse } from "next/server";
import { PRICING_PLANS } from "@/lib/payments";

export async function POST(req: NextRequest) {
  try {
    const { planId, analysisId, region } = await req.json();

    const plan = PRICING_PLANS.find((p) => p.id === planId) || PRICING_PLANS[0];

    const stripeKey = process.env.STRIPE_SECRET_KEY;

    if (!stripeKey) {
      // Test / Demo mode: Instant simulated success
      return NextResponse.json({
        success: true,
        mode: "demo",
        analysisId,
        message: "Demo unlocked successfully without live payment provider",
      });
    }

    // Stripe checkout session creation
    const Stripe = (await import("stripe")).default;
    const stripe = new Stripe(stripeKey, {
      apiVersion: "2024-12-18.acacia" as any,
    });

    const origin = req.headers.get("origin") || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `FengShui AI - ${plan.name}`,
              description: `Unlocked Feng Shui room analysis & layout transformation`,
            },
            unit_amount: Math.round(plan.priceUSD * 100),
          },
          quantity: 1,
        },
      ],
      mode: plan.billingPeriod === "once" ? "payment" : "subscription",
      success_url: `${origin}/result/${analysisId || "demo"}?unlocked=true`,
      cancel_url: `${origin}/result/${analysisId || "demo"}?canceled=true`,
      metadata: {
        analysisId: analysisId || "",
        planId: plan.id,
      },
    });

    return NextResponse.json({
      checkoutUrl: session.url,
    });
  } catch (error: any) {
    console.error("Stripe session error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to initiate checkout" },
      { status: 500 }
    );
  }
}
