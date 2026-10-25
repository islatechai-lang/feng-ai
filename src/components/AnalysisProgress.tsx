"use client";

import { useState, useEffect } from "react";
import { Check, Sparkles, Compass, Eye, ShieldCheck, Wand2 } from "lucide-react";

interface Step {
  id: number;
  label: string;
  detail: string;
  icon: any;
}

const STEPS: Step[] = [
  {
    id: 1,
    label: "Scanning Spatial Layout",
    detail: "Identifying walls, doors, windows, and furniture coordinates...",
    icon: Eye,
  },
  {
    id: 2,
    label: "Aligning Bagua Sectors",
    detail: "Calibrating compass direction and Nine Palace grid...",
    icon: Compass,
  },
  {
    id: 3,
    label: "Checking Command Position",
    detail: "Detecting coffin lines, mirror reflections, and Sha Chi bottlenecks...",
    icon: ShieldCheck,
  },
  {
    id: 4,
    label: "Calculating Five-Element Harmony",
    detail: "Balancing Wood, Fire, Earth, Metal, Water energies...",
    icon: Sparkles,
  },
  {
    id: 5,
    label: "Rendering Rearranged Sanctuary",
    detail: "Simulating optimal furniture rearrangement and cures...",
    icon: Wand2,
  },
];

export function AnalysisProgress() {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < STEPS.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 2800);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-xl mx-auto py-12 px-4 sm:px-6 text-center space-y-8">
      {/* Central Pulsing Yin-Yang / Bagua Graphic */}
      <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
        {/* Glow rings */}
        <div className="absolute inset-0 rounded-full bg-emerald-500/20 blur-xl animate-pulse" />
        <div className="absolute inset-0 rounded-full border-2 border-emerald-500/40 animate-spin [animation-duration:8s]" />
        <div className="absolute inset-3 rounded-full border border-dashed border-teal-400/50 animate-spin [animation-duration:14s] [animation-direction:reverse]" />

        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-xl shadow-emerald-950/80">
          <span className="text-white font-serif font-black text-2xl animate-bounce [animation-duration:2s]">
            氣
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-2xl font-bold text-white tracking-tight">
          Harmonizing Your Space
        </h3>
        <p className="text-sm text-slate-400">
          Applying classical Feng Shui formulas to optimize your room's life-force energy.
        </p>
      </div>

      {/* Progress Steps List */}
      <div className="bg-slate-900/60 p-5 rounded-3xl border border-slate-800 text-left space-y-3 shadow-xl">
        {STEPS.map((step, idx) => {
          const Icon = step.icon;
          const isDone = idx < currentStepIndex;
          const isCurrent = idx === currentStepIndex;

          return (
            <div
              key={step.id}
              className={`flex items-start gap-3.5 p-2.5 rounded-2xl transition-all ${
                isCurrent
                  ? "bg-emerald-950/70 border border-emerald-700/60 shadow-md"
                  : isDone
                  ? "opacity-80"
                  : "opacity-40"
              }`}
            >
              <div
                className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold transition-all ${
                  isDone
                    ? "bg-emerald-500 text-slate-950"
                    : isCurrent
                    ? "bg-emerald-600 text-white animate-pulse"
                    : "bg-slate-800 text-slate-500"
                }`}
              >
                {isDone ? <Check className="w-4 h-4 stroke-[3]" /> : <Icon className="w-3.5 h-3.5" />}
              </div>

              <div className="min-w-0">
                <div
                  className={`text-xs font-bold ${
                    isCurrent ? "text-emerald-300" : isDone ? "text-slate-200" : "text-slate-400"
                  }`}
                >
                  {step.label}
                </div>
                <div className="text-[11px] text-slate-400 truncate mt-0.5">
                  {step.detail}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="text-xs text-slate-500">
        Estimated time: ~15 seconds • Please keep this window open
      </div>
    </div>
  );
}
