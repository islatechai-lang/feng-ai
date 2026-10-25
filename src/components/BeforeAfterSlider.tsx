"use client";

import { useState, useRef, useCallback } from "react";
import { Sparkles, ArrowLeftRight, CheckCircle2 } from "lucide-react";

interface BeforeAfterSliderProps {
  originalUrl: string;
  afterUrl: string;
  isLocked?: boolean;
  onUnlockClick?: () => void;
}

export function BeforeAfterSlider({
  originalUrl,
  afterUrl,
  isLocked = false,
  onUnlockClick,
}: BeforeAfterSliderProps) {
  const [sliderPos, setSliderPos] = useState(50); // percentage 0 to 100
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(percentage);
  }, []);

  const onMouseDown = () => {
    isDragging.current = true;
  };

  const onMouseUp = () => {
    isDragging.current = false;
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    handleMove(e.clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX);
  };

  return (
    <div className="space-y-3">
      {/* Visual Instruction Badge */}
      <div className="flex items-center justify-between text-[11px] px-1 font-semibold text-slate-400">
        <span className="flex items-center gap-1.5 text-rose-400">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
          <span>Original Room Layout</span>
        </span>
        <span className="flex items-center gap-1 text-slate-500">
          <ArrowLeftRight className="w-3 h-3" />
          <span>Slide to compare</span>
        </span>
        <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
          <span>AI Feng Shui Redesign</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
        </span>
      </div>

      <div
        ref={containerRef}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onMouseMove={onMouseMove}
        onTouchMove={onTouchMove}
        className="relative w-full aspect-[4/3] sm:aspect-video rounded-3xl overflow-hidden select-none cursor-ew-resize border border-emerald-500/30 shadow-2xl bg-slate-950 touch-none"
      >
        {/* After Image (Background) - Crystal Clear AI Relayout */}
        <div className="absolute inset-0 w-full h-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={afterUrl}
            alt="Feng Shui Harmonized Room"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Before Image (Clipped Overlay) */}
        <div
          className="absolute inset-0 w-full h-full overflow-hidden"
          style={{ width: `${sliderPos}%` }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={originalUrl}
            alt="Original Room Layout"
            className="absolute inset-0 w-full h-full object-cover max-w-none"
            style={{
              width: containerRef.current?.clientWidth
                ? `${containerRef.current.clientWidth}px`
                : "100%",
            }}
          />
        </div>

        {/* Center Draggable Divider */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-gradient-to-b from-emerald-300 via-white to-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.7)] z-20 pointer-events-none"
          style={{ left: `${sliderPos}%` }}
        >
          {/* Center Handle Knob */}
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-slate-950/90 border-2 border-emerald-400 shadow-xl flex items-center justify-center text-emerald-300 text-xs font-black pointer-events-auto backdrop-blur-md">
            <span>⇄</span>
          </div>
        </div>

        {/* Badges on the corners */}
        <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-[10px] font-bold text-slate-300 border border-slate-700 pointer-events-none shadow">
          BEFORE
        </div>
        <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-emerald-950/80 backdrop-blur-md text-[10px] font-bold text-emerald-300 border border-emerald-500/40 pointer-events-none shadow flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-emerald-400" />
          <span>AFTER: HARMONIZED</span>
        </div>
      </div>

      <p className="text-center text-[10px] text-slate-400">
        Drag slider left or right to reveal the authentic Feng Shui Command Position transformation.
      </p>
    </div>
  );
}
