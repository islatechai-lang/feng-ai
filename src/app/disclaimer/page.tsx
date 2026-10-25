import { TopHeader } from "@/components/TopHeader";
import { BottomNav } from "@/components/BottomNav";
import { AlertTriangle, ShieldCheck } from "lucide-react";

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#020e0c] text-slate-100 pb-28 selection:bg-emerald-500 selection:text-slate-950">
      <TopHeader />

      <main className="flex-1 max-w-md w-full mx-auto px-4 pt-4 space-y-5">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-amber-400">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Legal Disclaimer</span>
          </div>
          <h1 className="text-2xl font-black text-white">Traditional Practice</h1>
          <p className="text-[11px] text-slate-400">Last updated: October 2026</p>
        </div>

        <div className="glass-panel p-5 rounded-3xl border border-emerald-500/15 text-xs text-slate-300 leading-relaxed space-y-3">
          <p>
            The recommendations and analyses provided by <strong>FengShui AI</strong> are rooted in classical Chinese spatial traditions (Bagua, Ba Zhai, Form School) and are provided strictly for <strong>cultural appreciation, entertainment, and personal aesthetic inspiration</strong>.
          </p>

          <h3 className="text-xs font-bold text-white pt-1">No Professional Advice</h3>
          <p className="text-[11px] text-slate-400">
            This app is not a substitute for professional architectural engineering, structural consultation, medical diagnosis, financial planning, or legal advice.
          </p>

          <h3 className="text-xs font-bold text-white pt-1">No Guaranteed Outcomes</h3>
          <p className="text-[11px] text-slate-400">
            FengShui AI makes no guarantees regarding financial, romantic, or medical outcomes. Users are responsible for ensuring physical furniture moves respect safety codes and fire exits.
          </p>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
