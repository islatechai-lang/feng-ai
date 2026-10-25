"use client";

import { useState } from "react";
import { SuggestedMove } from "@/types";
import { ArrowRight, Compass, ShieldAlert, Sparkles } from "lucide-react";

interface FloorPlanDiagramProps {
  beforeSvg: string;
  afterSvg: string;
  suggestedMoves: SuggestedMove[];
}

export function FloorPlanDiagram({
  beforeSvg,
  afterSvg,
  suggestedMoves,
}: FloorPlanDiagramProps) {
  const [activeTab, setActiveTab] = useState<"after" | "before">("after");

  return (
    <div className="space-y-6">
      {/* Tab Switcher & Legend */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-2xl w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setActiveTab("after")}
            className={`flex-1 sm:flex-initial px-5 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === "after"
                ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-950"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Harmonized Layout (Recommended)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("before")}
            className={`flex-1 sm:flex-initial px-5 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === "before"
                ? "bg-rose-500 text-white shadow-md shadow-rose-950"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Problematic Layout (Current)</span>
          </button>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <span>Sheng Chi (Good flow)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
            <span>Sha Chi (Cutting line)</span>
          </div>
        </div>
      </div>

      {/* Diagram Viewer */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        <div className="md:col-span-7 bg-slate-950 p-3 sm:p-5 rounded-3xl border border-slate-800 shadow-2xl flex items-center justify-center">
          <div
            className="w-full max-w-[420px] aspect-square"
            dangerouslySetInnerHTML={{
              __html: activeTab === "after" ? afterSvg : beforeSvg,
            }}
          />
        </div>

        {/* Movement Checklist */}
        <div className="md:col-span-5 space-y-4">
          <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-3xl space-y-4">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Compass className="w-4 h-4 text-emerald-400" />
              <span>Step-by-Step Furniture Moves</span>
            </h4>

            <div className="space-y-3">
              {suggestedMoves.map((move, index) => (
                <div
                  key={index}
                  className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-2"
                >
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-300">
                    <span className="w-5 h-5 rounded-full bg-emerald-950 border border-emerald-700 flex items-center justify-center text-[10px]">
                      {index + 1}
                    </span>
                    <span>Move {move.item}</span>
                  </div>

                  <div className="grid grid-cols-1 gap-1 text-[11px] text-slate-400">
                    <div className="flex items-center gap-1.5 text-rose-300/80">
                      <span className="font-semibold text-rose-400">From:</span> {move.from}
                    </div>
                    <div className="flex items-center gap-1.5 text-emerald-300/90 font-medium">
                      <ArrowRight className="w-3 h-3 text-emerald-400 shrink-0" />
                      <span>{move.to}</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-400 italic pt-1 border-t border-slate-800/60">
                    "{move.reason}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
