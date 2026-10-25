import { TopHeader } from "@/components/TopHeader";
import { BottomNav } from "@/components/BottomNav";

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#020e0c] text-slate-100 pb-28 selection:bg-emerald-500 selection:text-slate-950">
      <TopHeader />

      <main className="flex-1 max-w-md w-full mx-auto px-4 pt-4 space-y-5">
        <div className="space-y-1">
          <h1 className="text-2xl font-black text-white">Terms of Service</h1>
          <p className="text-[11px] text-slate-400">Last updated: October 2026</p>
        </div>

        <div className="glass-panel p-5 rounded-3xl border border-emerald-500/15 space-y-3 text-xs text-slate-300 leading-relaxed">
          <h3 className="text-xs font-bold text-white">1. Service Scope</h3>
          <p className="text-[11px] text-slate-400">
            FengShui AI provides spatial layout diagnoses and generative suggestions for cultural and personal enjoyment. One free scan is offered per device.
          </p>

          <h3 className="text-xs font-bold text-white pt-1">2. Fair Use</h3>
          <p className="text-[11px] text-slate-400">
            Paid plans include fair-use caps on AI image generations (15 revisions per room) to prevent automated bot scraping.
          </p>

          <h3 className="text-xs font-bold text-white pt-1">3. Subscriptions</h3>
          <p className="text-[11px] text-slate-400">
            Weekly and annual passes renew automatically unless canceled 24h prior. You may cancel anytime in your account.
          </p>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
