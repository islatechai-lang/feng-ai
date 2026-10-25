"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { History, Sparkles, ArrowRight, Trash2, Calendar, Compass } from "lucide-react";

export default function HistoryPage() {
  const [analyses, setAnalyses] = useState<any[]>([]);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("fengshui_analyses") || "[]");
      setAnalyses(stored);
    } catch (e) {
      console.warn("Failed to load history:", e);
    }
  }, []);

  const clearHistory = () => {
    if (confirm("Are you sure you want to clear your local room analysis history?")) {
      localStorage.removeItem("fengshui_analyses");
      setAnalyses([]);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-10 space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald-400">
              <History className="w-4 h-4" />
              <span>Saved Analyses</span>
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight mt-1">
              My Analyzed Rooms
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Re-open your previous room diagnoses, layout recommendations, and before/after comparisons.
            </p>
          </div>

          {analyses.length > 0 && (
            <button
              type="button"
              onClick={clearHistory}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-rose-950/60 hover:bg-rose-900/60 text-rose-300 border border-rose-800 transition"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>
          )}
        </div>

        {analyses.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-slate-900/40 border border-slate-800 space-y-4">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Sparkles className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">No Saved Analyses Yet</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
                Upload a photo of your bedroom, office desk, or living area to receive your first Feng Shui score and layout improvements.
              </p>
            </div>
            <div>
              <Link
                href="/analyze"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-bold bg-emerald-500 text-slate-950 hover:bg-emerald-400 transition"
              >
                <Sparkles className="w-4 h-4" />
                <span>Analyze a Room Now</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {analyses.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition flex gap-4 items-center"
              >
                <div className="relative w-28 h-24 rounded-2xl overflow-hidden shrink-0 border border-slate-800">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.originalImageUrl}
                    alt="Room thumbnail"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-1.5 left-1.5 bg-slate-950/80 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold text-emerald-400">
                    {item.score}/100
                  </div>
                </div>

                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-bold text-white capitalize">
                      {item.roomType}
                    </span>
                    <span className="text-slate-500">•</span>
                    <span className="text-[11px] text-emerald-400 font-mono">
                      Door: {item.doorDirection}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                    <Calendar className="w-3 h-3 text-slate-500" />
                    <span>
                      {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "Recent"}
                    </span>
                  </div>

                  <div className="pt-2">
                    <Link
                      href={`/result/${item.id}`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300"
                    >
                      <span>View Report</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
