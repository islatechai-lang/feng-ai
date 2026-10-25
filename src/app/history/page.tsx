"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { TopHeader } from "@/components/TopHeader";
import { BottomNav } from "@/components/BottomNav";
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
    if (confirm("Clear all locally saved room scans?")) {
      localStorage.removeItem("fengshui_analyses");
      setAnalyses([]);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#020e0c] text-slate-100 pb-28 selection:bg-emerald-500 selection:text-slate-950">
      <TopHeader />

      <main className="flex-1 max-w-md w-full mx-auto px-4 pt-4 space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">
              Saved Scans
            </span>
            <h1 className="text-2xl font-black text-white tracking-tight">
              My Rooms
            </h1>
          </div>

          {analyses.length > 0 && (
            <button
              type="button"
              onClick={clearHistory}
              className="p-2 rounded-xl text-xs font-semibold glass-pill text-rose-400 hover:text-rose-300"
              title="Clear History"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>

        {analyses.length === 0 ? (
          <div className="glass-panel p-8 text-center rounded-3xl border border-emerald-500/15 space-y-3">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-white">No Saved Rooms Yet</h3>
            <p className="text-xs text-slate-400">
              Scan your bedroom, desk, or living area to store past diagnoses.
            </p>
            <div className="pt-2">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold bg-emerald-500 text-slate-950 hover:bg-emerald-400 transition"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Scan a Room Now</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {analyses.map((item) => (
              <Link
                key={item.id}
                href={`/result/${item.id}`}
                className="glass-panel hover:bg-emerald-950/30 p-3 rounded-3xl border border-emerald-500/15 transition active:scale-95 flex items-center gap-3.5"
              >
                <div className="relative w-20 h-16 rounded-2xl overflow-hidden shrink-0 border border-emerald-500/20">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.originalImageUrl}
                    alt="Thumbnail"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-1 left-1 px-1 py-0.2 rounded bg-slate-950/80 text-[8px] font-mono font-bold text-emerald-300">
                    {item.score} pts
                  </div>
                </div>

                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-white capitalize truncate">
                    {item.roomType} Layout
                  </div>
                  <div className="text-[10px] text-emerald-400 font-mono">
                    Door: {item.doorDirection} • Goal: {item.goal}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "Recent"}
                  </div>
                </div>

                <ArrowRight className="w-4 h-4 text-slate-500 shrink-0" />
              </Link>
            ))}
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
