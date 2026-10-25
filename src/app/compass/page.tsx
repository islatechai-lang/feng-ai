"use client";

import { useState } from "react";
import { TopHeader } from "@/components/TopHeader";
import { BottomNav } from "@/components/BottomNav";
import { CompassPicker } from "@/components/CompassPicker";
import { CompassDirection } from "@/types";
import { BAGUA_MAP } from "@/lib/fengshui/bagua";
import { Compass, Sparkles, Shield, Info } from "lucide-react";

export default function CompassPage() {
  const [selectedDir, setSelectedDir] = useState<CompassDirection>("S");

  const sector = BAGUA_MAP[selectedDir] || BAGUA_MAP["S"];

  return (
    <div className="min-h-screen flex flex-col bg-[#020e0c] text-slate-100 pb-28 selection:bg-emerald-500 selection:text-slate-950">
      <TopHeader />

      <main className="flex-1 max-w-md w-full mx-auto px-4 pt-4 space-y-6">
        <div className="text-center space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">
            Luo Pan Tool
          </span>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Feng Shui Compass
          </h1>
          <p className="text-xs text-slate-400">
            Align with your doorway or bed headboard to reveal the governing Bagua Palace.
          </p>
        </div>

        {/* Interactive Compass */}
        <div className="glass-panel-elevated rounded-3xl p-5 border border-emerald-500/20 shadow-2xl">
          <CompassPicker
            value={selectedDir}
            onChange={(d) => setSelectedDir(d)}
          />
        </div>

        {/* Selected Sector Diagnosis Card */}
        {selectedDir !== "UNKNOWN" && (
          <div className="glass-panel rounded-3xl p-5 border border-emerald-500/15 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                Direction: {selectedDir} Sector
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-700 capitalize">
                {sector.element} Element
              </span>
            </div>

            <h3 className="text-base font-bold text-white">
              {sector.name}
            </h3>

            <p className="text-xs text-slate-300">
              <strong>Life Focus:</strong> {sector.lifeArea}
            </p>

            <div className="pt-2 border-t border-emerald-500/10 space-y-1">
              <span className="text-[11px] font-semibold text-slate-200">
                Auspicious Colors:
              </span>
              <div className="flex flex-wrap gap-1.5 pt-0.5">
                {sector.colors.map((c) => (
                  <span
                    key={c}
                    className="px-2 py-0.5 rounded-lg text-[10px] bg-slate-900 border border-emerald-500/20 text-slate-300"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-emerald-950/40 border border-emerald-500/20 text-[11px] text-emerald-200">
              <strong>Classical Remedy:</strong> {sector.remedies[0]}
            </div>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
