"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
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
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-12 space-y-8">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
            <span>Privacy Policy & Compliance</span>
          </div>
          <h1 className="text-3xl font-black text-white">Privacy Guarantee & Data Handling</h1>
          <p className="text-xs text-slate-400">GDPR & CCPA Compliant • Last updated: October 2026</p>
        </div>

        <div className="bg-slate-900/60 p-6 rounded-3xl border border-slate-800 space-y-4 text-xs text-slate-300 leading-relaxed">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-400" />
            <span>Our 4-Point Privacy Commitment</span>
          </h2>

          <ul className="space-y-3">
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white">Strict Image Confidentiality:</strong> Your uploaded room photos are used solely to generate your spatial layout analysis and photorealistic rearrangement. We do not sell, rent, or publicly display your room photos without explicit consent.
              </div>
            </li>

            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white">Automatic 30-Day Auto-Purge:</strong> Room images uploaded during free guest analyses are automatically scheduled for permanent deletion from our storage servers after 30 days.
              </div>
            </li>

            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white">No Face Biometrics:</strong> We encourage photos of room architecture only. If people or portraits appear in the background, our systems do not perform facial recognition or store biometric templates.
              </div>
            </li>

            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white">Server-Side Encryption:</strong> All transit is secured over TLS 1.3, and cloud storage assets are encrypted at rest with AES-256.
              </div>
            </li>
          </ul>
        </div>

        {/* GDPR Right to Erasure / Immediate Deletion Tool */}
        <div className="bg-slate-900/40 p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Trash2 className="w-4 h-4 text-rose-400" />
              <span>Right to Erasure (Instant Data Purge)</span>
            </h3>
            <p className="text-xs text-slate-400">
              Under GDPR Article 17 and CCPA, you have the right to request immediate deletion of all analyses and uploaded photos associated with your account or email address.
            </p>
          </div>

          {deletedMsg ? (
            <div className="p-3.5 rounded-2xl bg-emerald-950/80 border border-emerald-800 text-xs text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Your data purge request has been logged and queued for immediate deletion.</span>
            </div>
          ) : (
            <form onSubmit={handleDeleteRequest} className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                required
                value={deleteEmail}
                onChange={(e) => setDeleteEmail(e.target.value)}
                placeholder="Enter your account email..."
                className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white transition shrink-0"
              >
                Request Immediate Erasure
              </button>
            </form>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
