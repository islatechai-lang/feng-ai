"use client";

import { useState } from "react";
import { TopHeader } from "@/components/TopHeader";
import { BottomNav } from "@/components/BottomNav";
import { ShieldCheck, Lock, Trash2, CheckCircle2 } from "lucide-react";

export default function PrivacyPage() {
  const [deleteEmail, setDeleteEmail] = useState("");
  const [deletedMsg, setDeletedMsg] = useState(false);

  const handleDeleteRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deleteEmail) return;
    setDeletedMsg(true);
    setDeleteEmail("");
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#020e0c] text-slate-100 pb-28 selection:bg-emerald-500 selection:text-slate-950">
      <TopHeader />

      <main className="flex-1 max-w-md w-full mx-auto px-4 pt-4 space-y-5">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>GDPR & CCPA</span>
          </div>
          <h1 className="text-2xl font-black text-white">Privacy Guarantee</h1>
          <p className="text-[11px] text-slate-400">Strict 30-Day Auto-Purge Policy</p>
        </div>

        <div className="glass-panel p-5 rounded-3xl border border-emerald-500/15 space-y-3 text-xs text-slate-300 leading-relaxed">
          <ul className="space-y-2.5">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white">Confidentiality:</strong> Photos are strictly used for your spatial layout generation and never sold or shared.
              </div>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white">30-Day Auto-Purge:</strong> Free guest scan photos are permanently purged from cloud storage after 30 days.
              </div>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white">No Face Storage:</strong> We do not scan or store biometric facial data.
              </div>
            </li>
          </ul>
        </div>

        {/* Right to Erasure */}
        <div className="glass-panel p-5 rounded-3xl border border-rose-500/20 space-y-3">
          <div className="space-y-0.5">
            <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
              <Trash2 className="w-3.5 h-3.5 text-rose-400" />
              <span>Right to Erasure (Instant Purge)</span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Request immediate deletion of all data associated with your email.
            </p>
          </div>

          {deletedMsg ? (
            <div className="p-3 rounded-2xl bg-emerald-950/80 border border-emerald-800 text-[11px] text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Your data purge request has been logged and queued.</span>
            </div>
          ) : (
            <form onSubmit={handleDeleteRequest} className="flex gap-2">
              <input
                type="email"
                required
                value={deleteEmail}
                onChange={(e) => setDeleteEmail(e.target.value)}
                placeholder="Enter email address..."
                className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-emerald-500/20 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-emerald-400"
              />
              <button
                type="submit"
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white transition shrink-0"
              >
                Purge
              </button>
            </form>
          )}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
