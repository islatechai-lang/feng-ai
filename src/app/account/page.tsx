"use client";

import { useState } from "react";
import Link from "next/link";
import { TopHeader } from "@/components/TopHeader";
import { BottomNav } from "@/components/BottomNav";
import { PRICING_PLANS, REGIONAL_PRICING } from "@/lib/payments";
import { Crown, Check, ShieldCheck, FileText, Lock, ChevronRight, Zap } from "lucide-react";

export default function AccountPage() {
  const [region, setRegion] = useState<"US" | "PH" | "ID" | "IN">("US");
  const [isUnlocked, setIsUnlocked] = useState(false);

  const regional = REGIONAL_PRICING[region];

  return (
    <div className="min-h-screen flex flex-col bg-[#020e0c] text-slate-100 pb-36 selection:bg-emerald-500 selection:text-slate-950">
      <TopHeader />

      <main className="flex-1 max-w-md w-full mx-auto px-4 pt-4 space-y-6">
        <div className="space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400">
            Membership
          </span>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Pro Sanctuary Access
          </h1>
          <p className="text-xs text-slate-400">
            Unlock photorealistic room rearrangements, 2D floor plans & personalized Kua formulas.
          </p>
        </div>

        {/* Currency Switcher */}
        <div className="flex items-center justify-between glass-pill p-2 rounded-2xl text-xs">
          <span className="text-slate-400 pl-2 text-[11px]">Pricing Region:</span>
          <div className="flex gap-1">
            {(["US", "PH", "ID", "IN"] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRegion(r)}
                className={`px-2.5 py-1 rounded-xl font-mono text-[10px] font-bold transition ${
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

        {/* Pricing Cards */}
        <div className="space-y-3">
          {PRICING_PLANS.map((plan) => {
            let priceLabel = plan.priceLabelUSD;
            if (region !== "US" && regional) {
              if (plan.id === "single_room") priceLabel = regional.singleRoom.label;
              if (plan.id === "weekly_pass") priceLabel = `${regional.weeklyPass.label} / wk`;
              if (plan.id === "pro_yearly") priceLabel = `${regional.proYearly.label} / yr`;
            }

            return (
              <div
                key={plan.id}
                className={`glass-panel p-4 rounded-3xl border space-y-3 transition ${
                  plan.isPopular
                    ? "border-emerald-400/50 bg-emerald-950/30"
                    : "border-emerald-500/15"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                      {plan.name}
                      {plan.isPopular && (
                        <span className="px-2 py-0.2 rounded-full text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          Popular
                        </span>
                      )}
                    </h3>
                    <div className="text-xl font-black text-white font-mono mt-0.5">
                      {priceLabel}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      alert(`In demo mode: you can unlock any room scan for free!`);
                    }}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500 text-slate-950 hover:bg-emerald-400 active:scale-95 transition shadow"
                  >
                    Select
                  </button>
                </div>

                <ul className="space-y-1.5 text-[11px] text-slate-300 border-t border-emerald-500/10 pt-2">
                  {plan.features.slice(0, 3).map((feat, idx) => (
                    <li key={idx} className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Legal & Compliance Links */}
        <div className="glass-panel rounded-3xl p-4 border border-emerald-500/15 space-y-2.5 text-xs">
          <Link
            href="/privacy"
            className="flex items-center justify-between py-1.5 text-slate-300 hover:text-white transition"
          >
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Privacy & GDPR Right-to-Erasure</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500" />
          </Link>

          <Link
            href="/disclaimer"
            className="flex items-center justify-between py-1.5 text-slate-300 hover:text-white transition border-t border-emerald-500/10 pt-2"
          >
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-amber-400" />
              <span>Traditional Practice Disclaimer</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500" />
          </Link>

          <Link
            href="/terms"
            className="flex items-center justify-between py-1.5 text-slate-300 hover:text-white transition border-t border-emerald-500/10 pt-2"
          >
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-teal-400" />
              <span>Terms of Service</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500" />
          </Link>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
