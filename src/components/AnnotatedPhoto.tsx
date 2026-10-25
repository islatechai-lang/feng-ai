"use client";

import { useState } from "react";
import { FengShuiIssue } from "@/types";
import { AlertCircle, CheckCircle2, Info } from "lucide-react";

interface AnnotatedPhotoProps {
  imageUrl: string;
  issues: FengShuiIssue[];
  onSelectIssue?: (issueId: string) => void;
}

export function AnnotatedPhoto({ imageUrl, issues, onSelectIssue }: AnnotatedPhotoProps) {
  const [activeIssueId, setActiveIssueId] = useState<string | null>(
    issues[0]?.id || null
  );

  return (
    <div className="space-y-4">
      {/* Photo with Pin Overlays */}
      <div className="relative w-full aspect-video sm:aspect-[16/10] max-h-[540px] rounded-3xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-950">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt="Room with Annotated Feng Shui Markers"
          className="w-full h-full object-cover"
        />

        {/* Numbered Pins */}
        {issues.map((issue, index) => {
          const pin = issue.pinCoordinates || {
            x: 20 + ((index * 25) % 60),
            y: 30 + ((index * 20) % 40),
          };
          const isActive = activeIssueId === issue.id;
          const isCritical = issue.severity === "critical";

          return (
            <div
              key={issue.id}
              style={{
                left: `${pin.x}%`,
                top: `${pin.y}%`,
              }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group"
            >
              <button
                type="button"
                onClick={() => {
                  setActiveIssueId(issue.id);
                  onSelectIssue?.(issue.id);
                }}
                className={`relative w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-xl ${
                  isActive
                    ? "bg-white text-slate-950 scale-125 ring-4 ring-emerald-500 z-30"
                    : isCritical
                    ? "bg-rose-500 text-white hover:scale-110"
                    : "bg-amber-500 text-slate-950 hover:scale-110"
                }`}
              >
                <span>{index + 1}</span>
                {/* Ping animation on critical pins */}
                {isCritical && (
                  <span className="absolute -inset-1 rounded-full bg-rose-400 opacity-50 animate-ping" />
                )}
              </button>

              {/* Pin Tooltip */}
              <div
                className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2.5 rounded-xl bg-slate-950/95 border border-slate-700 shadow-2xl text-left pointer-events-none transition-all ${
                  isActive
                    ? "opacity-100 scale-100"
                    : "opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100"
                }`}
              >
                <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-rose-400">
                  <AlertCircle className="w-3 h-3" />
                  <span>Issue #{index + 1}</span>
                </div>
                <div className="text-xs font-semibold text-white mt-0.5 line-clamp-1">
                  {issue.title}
                </div>
                <div className="text-[10px] text-slate-400 line-clamp-2 mt-0.5">
                  {issue.what}
                </div>
              </div>
            </div>
          );
        })}

        <div className="absolute bottom-4 left-4 z-10 bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium text-slate-300 border border-slate-700">
          Tap numbered badges to view specific issue remedy
        </div>
      </div>

      {/* Selected Issue Preview Card */}
      {activeIssueId && (
        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          {(() => {
            const current = issues.find((i) => i.id === activeIssueId);
            if (!current) return null;
            return (
              <>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        current.severity === "critical"
                          ? "bg-rose-950 text-rose-300 border border-rose-800"
                          : current.severity === "warning"
                          ? "bg-amber-950 text-amber-300 border border-amber-800"
                          : "bg-blue-950 text-blue-300 border border-blue-800"
                      }`}
                    >
                      {current.severity}
                    </span>
                    <h4 className="text-sm font-bold text-white">
                      {current.title}
                    </h4>
                  </div>
                  <p className="text-xs text-slate-300">
                    <strong>Feng Shui Fix:</strong> {current.fix}
                  </p>
                </div>

                <div className="text-xs text-emerald-400 font-medium shrink-0 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Cure Available</span>
                </div>
              </>
            );
          })()}
        </div>
      )}
    </div>
  );
}
