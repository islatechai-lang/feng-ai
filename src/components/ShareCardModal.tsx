"use client";

import { useState } from "react";
import { Share2, Download, Copy, Check, X, Sparkles } from "lucide-react";

interface ShareCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  score: number;
  grade: string;
  roomType: string;
  goal: string;
  originalUrl: string;
  afterUrl: string;
}

export function ShareCardModal({
  isOpen,
  onClose,
  score,
  grade,
  roomType,
  goal,
  originalUrl,
  afterUrl,
}: ShareCardModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const shareUrl = typeof window !== "undefined" ? window.location.href : "https://fengshui-ai.app";

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleWebShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `My Room Feng Shui Score: ${score}/100 (${grade})`,
          text: `Check out my Feng Shui room transformation for ${goal}! Try yours free:`,
          url: shareUrl,
        });
      } catch (err) {
        console.log("Share dismissed");
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-sm my-6 bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl text-center space-y-4">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white"
          aria-label="Close share modal"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="space-y-1">
          <h3 className="text-base font-bold text-white flex items-center justify-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Story Share Card (9:16)</span>
          </h3>
          <p className="text-xs text-slate-400">
            Share your transformation on TikTok, Instagram Stories & Reels
          </p>
        </div>

        {/* 9:16 Ratio Story Card Mockup */}
        <div className="relative w-full aspect-[9/16] max-h-[480px] mx-auto rounded-2xl overflow-hidden border border-slate-700 shadow-2xl bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 p-4 flex flex-col justify-between text-left">
          {/* Top Branding */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo.png"
                alt="FengShui AI"
                className="w-6 h-6 rounded-lg object-cover shadow"
              />
              <span className="text-xs font-bold text-white">FengShui AI</span>
            </div>
            <span className="text-[10px] font-mono uppercase text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
              {roomType}
            </span>
          </div>

          {/* Center Images Comparison (Stacked) */}
          <div className="space-y-2 my-auto">
            <div className="relative aspect-video rounded-xl overflow-hidden border border-slate-800 shadow">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={originalUrl} alt="Before" className="w-full h-full object-cover" />
              <div className="absolute top-1.5 left-1.5 bg-slate-950/80 px-2 py-0.5 rounded text-[9px] font-bold text-slate-300">
                BEFORE
              </div>
            </div>

            <div className="relative aspect-video rounded-xl overflow-hidden border border-emerald-500/50 shadow-lg">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={afterUrl} alt="After" className="w-full h-full object-cover" />
              <div className="absolute top-1.5 left-1.5 bg-emerald-950/90 text-emerald-300 px-2 py-0.5 rounded text-[9px] font-bold border border-emerald-700">
                FENG SHUI HARMONIZED
              </div>
            </div>
          </div>

          {/* Bottom Score & Watermark */}
          <div className="bg-slate-950/80 backdrop-blur-md p-3 rounded-xl border border-slate-800 space-y-1.5">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[10px] uppercase tracking-wider text-slate-400">
                  Feng Shui Score
                </div>
                <div className="text-xl font-black text-white font-mono flex items-baseline gap-1">
                  <span>{score}</span>
                  <span className="text-xs text-slate-400 font-normal">/100</span>
                  <span className="ml-1 text-xs px-1.5 py-0.2 rounded bg-emerald-900/60 text-emerald-300 border border-emerald-700 font-bold">
                    Grade {grade}
                  </span>
                </div>
              </div>

              {/* Watermark QR indicator */}
              <div className="w-9 h-9 rounded-lg bg-white p-1 flex items-center justify-center">
                <div className="w-full h-full bg-slate-950 rounded flex items-center justify-center text-[7px] text-white font-mono text-center font-bold">
                  SCAN
                </div>
              </div>
            </div>

            <div className="text-[9px] text-slate-400 text-center border-t border-slate-800/80 pt-1">
              Analyze your room free at fengshui-ai.app
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            type="button"
            onClick={handleWebShare}
            className="py-2.5 px-3 rounded-xl text-xs font-bold bg-emerald-500 text-slate-950 hover:bg-emerald-400 flex items-center justify-center gap-1.5 shadow"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share Story</span>
          </button>

          <button
            type="button"
            onClick={handleCopyLink}
            className="py-2.5 px-3 rounded-xl text-xs font-semibold bg-slate-800 text-slate-200 hover:bg-slate-700 flex items-center justify-center gap-1.5 border border-slate-700"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "Link Copied!" : "Copy Link"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
