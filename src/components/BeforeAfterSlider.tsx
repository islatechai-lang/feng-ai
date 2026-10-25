"use client";

import { useState, useRef, useCallback } from "react";
import { Lock, Sparkles } from "lucide-react";

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
      <div
        ref={containerRef}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onMouseMove={onMouseMove}
        onTouchMove={onTouchMove}
        className="relative w-full aspect-video sm:aspect-[16/10] max-h-[540px] rounded-3xl overflow-hidden select-none cursor-ew-resize border border-slate-800 shadow-2xl bg-slate-950"
      >
        {/* After Image (Background) */}
        <div className="absolute inset-0 w-full h-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={afterUrl}
            alt="Feng Shui Harmonized Room"
            className={`w-full h-full object-cover ${
              isLocked ? "blur-xl scale-105 saturate-150" : ""
            }`}
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
          className="absolute top-0 bottom-0 w-1 bg-white shadow-2xl z-20 pointer-events-none"
          style={{ left: `${sliderPos}%` }}
        >
          {/* Center Handle Knob */}
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-slate-950 border-2 border-white shadow-xl flex items-center justify-center text-white text-xs font-bold pointer-events-auto">
            <span>⇄</span>
          </div>
        </div>

        {/* Badges */}
        <div className="absolute top-4 left-4 z-10 bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-slate-300 border border-slate-700 shadow">
          Original Layout
        </div>

        <div className="absolute top-4 right-4 z-10 bg-emerald-950/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-emerald-300 border border-emerald-600 shadow flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Feng Shui Harmony</span>
        </div>

        {/* Locked Paywall Overlay on the "After" side */}
        {isLocked && sliderPos < 80 && (
          <div className="absolute inset-y-0 right-0 left-1/3 z-10 flex items-center justify-center p-6 bg-slate-950/40 backdrop-blur-[3px]">
            <div className="bg-slate-950/90 border border-emerald-500/40 p-5 rounded-2xl text-center max-w-xs shadow-2xl space-y-3">
              <div className="w-10 h-10 mx-auto rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">
                  Rearranged Room Aligned
                </h4>
                <p className="text-xs text-slate-300 mt-1">
                  Unlock to reveal the full AI transformation with your bed & desk in the optimal Command Position.
                </p>
              </div>
              <button
                type="button"
                onClick={onUnlockClick}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 hover:from-emerald-400 hover:to-teal-400 shadow-md shadow-emerald-950/50 transition-transform active:scale-95"
              >
                Unlock Full Result ($3.99)
              </button>
            </div>
          </div>
        )}
      </div>

      <p className="text-center text-xs text-slate-400">
        Drag the slider horizontally to compare your original room vs the Feng Shui rearranged sanctuary
      </p>
    </div>
  );
}
