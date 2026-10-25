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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-md my-auto glass-panel-elevated border border-emerald-500/25 rounded-3xl p-5 shadow-2xl text-slate-200 space-y-4">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full glass-pill text-slate-400 hover:text-white transition"
          aria-label="Close paywall modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="text-center space-y-1 pt-1">
          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-500/30">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>Harmonize Your Sanctuary</span>
          </div>

          <h3 className="text-xl font-black text-white tracking-tight">
            Unlock Full Transformation
          </h3>

          <p className="text-[11px] text-slate-300 max-w-xs mx-auto">
            Get the unblurred photorealistic rearrangement, 2D floor plan & all issue cures.
          </p>

          {/* Regional Currency Selector */}
          <div className="pt-1 flex items-center justify-center gap-1.5 text-[11px]">
            <span className="text-slate-400">Currency:</span>
            <div className="flex gap-1 glass-pill p-0.5 rounded-xl">
              {(["US", "PH", "ID", "IN"] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRegion(r)}
                  className={`px-2 py-0.5 rounded-lg font-mono font-bold text-[10px] transition ${
                    region === r
                      ? "bg-emerald-500 text-slate-950 shadow"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="space-y-2.5">
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
                className={`relative p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  isSelected
                    ? "bg-emerald-950/40 border-emerald-400 ring-1 ring-emerald-400 shadow-lg"
                    : "glass-pill hover:border-emerald-500/30"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-xs font-bold text-white">{plan.name}</h4>
                      {plan.isPopular && (
                        <span className="px-1.5 py-0.2 rounded-full text-[8px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          Popular
                        </span>
                      )}
                    </div>
                    <div className="text-base font-black text-white font-mono">
                      {displayPrice}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCheckout(plan.id);
                    }}
                    disabled={isLoading}
                    className={`py-1.5 px-3 rounded-xl text-xs font-bold transition active:scale-95 ${
                      isSelected
                        ? "bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow"
                        : "bg-slate-800 text-white"
                    }`}
                  >
                    {isLoading && selectedPlan === plan.id ? "..." : "Unlock"}
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
