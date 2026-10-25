"use client";

import { useState } from "react";
import { PRICING_PLANS, REGIONAL_PRICING } from "@/lib/payments";
import { PricingPlan } from "@/types";
import { Check, Sparkles, X, ShieldCheck, Zap, Lock } from "lucide-react";

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUnlockSuccess: () => void;
  analysisId?: string;
}

export function PaywallModal({
  isOpen,
  onClose,
  onUnlockSuccess,
  analysisId,
}: PaywallModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan>("single_room");
  const [region, setRegion] = useState<"US" | "PH" | "ID" | "IN">("US");
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleCheckout = async (planId: PricingPlan) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId,
          analysisId,
          region,
        }),
      });

      const data = await res.json();
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else if (data.success) {
        // Immediate demo unlock
        onUnlockSuccess();
        onClose();
      }
    } catch (err) {
      console.error("Checkout failed:", err);
      // Fallback unlock for demo resilience
      onUnlockSuccess();
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoUnlock = () => {
    onUnlockSuccess();
    onClose();
  };

  const regional = REGIONAL_PRICING[region];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl my-8 bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white transition"
          aria-label="Close paywall modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-700/60 shadow">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Harmonize Your Sanctuary</span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Unlock Full Room Transformation
          </h3>

          <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
            Get the unblurred photorealistic room rearrangement, step-by-step 2D floor plan, and complete remedies for all detected issues.
          </p>

          {/* Regional Currency Selector */}
          <div className="pt-2 flex items-center justify-center gap-2 text-xs">
            <span className="text-slate-400">Regional Pricing:</span>
            <div className="flex gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
              {(["US", "PH", "ID", "IN"] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRegion(r)}
                  className={`px-2.5 py-1 rounded-lg font-mono font-bold text-xs transition ${
                    region === r
                      ? "bg-emerald-500 text-slate-950"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {r === "US" ? "$ USD" : r === "PH" ? "₱ PHP" : r === "ID" ? "Rp IDR" : "₹ INR"}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {PRICING_PLANS.map((plan) => {
            const isSelected = selectedPlan === plan.id;
            let displayPrice = plan.priceLabelUSD;

            if (region !== "US" && regional) {
              if (plan.id === "single_room") displayPrice = regional.singleRoom.label;
              if (plan.id === "weekly_pass") displayPrice = `${regional.weeklyPass.label} / wk`;
              if (plan.id === "pro_yearly") displayPrice = `${regional.proYearly.label} / yr`;
            }

            return (
              <div
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id)}
                className={`relative p-5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                  isSelected
                    ? "bg-slate-950 border-emerald-500 shadow-xl shadow-emerald-950/80 ring-2 ring-emerald-500"
                    : "bg-slate-950/60 border-slate-800 hover:border-slate-700"
                }`}
              >
                {plan.isPopular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-slate-950 shadow">
                    Most Popular
                  </span>
                )}
                {plan.bestValue && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-400 text-slate-950 shadow">
                    Best Value
                  </span>
                )}

                <div>
                  <h4 className="text-sm font-bold text-white">{plan.name}</h4>
                  <div className="text-2xl font-black text-white mt-1">
                    {displayPrice}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {plan.billingPeriod === "once"
                      ? "One-time payment"
                      : plan.billingPeriod === "week"
                      ? "Renews weekly • Cancel anytime"
                      : "Billed annually"}
                  </p>

                  <ul className="space-y-2 mt-4 text-[11px] text-slate-300">
                    {plan.features.slice(0, 4).map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 mt-auto">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCheckout(plan.id);
                    }}
                    disabled={isLoading}
                    className={`w-full py-2.5 rounded-xl text-xs font-bold transition ${
                      isSelected
                        ? "bg-emerald-500 text-slate-950 hover:bg-emerald-400"
                        : "bg-slate-800 text-white hover:bg-slate-700"
                    }`}
                  >
                    {isLoading && selectedPlan === plan.id ? "Processing..." : `Select ${plan.name}`}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Guarantee & Instant Demo Unlock */}
        <div className="border-t border-slate-800 pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Secure Checkout • 100% Satisfaction Guarantee</span>
          </div>

          {/* Demo unlock bypass button for testing */}
          <button
            type="button"
            onClick={handleDemoUnlock}
            className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 text-xs font-semibold py-1 px-3 rounded-lg border border-emerald-900/60 hover:bg-emerald-950/40 transition"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Instant Demo Unlock (Test Mode)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
