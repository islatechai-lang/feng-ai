"use client";

import { DecorSuggestion, FiveElement, KuaInfo, CompassDirection } from "@/types";
import { Sparkles, Compass, ShieldCheck, Palette, ShoppingBag, Leaf, Droplet, Flame, Mountain, CircleDot } from "lucide-react";

interface LuckyGuideProps {
  primaryElement: FiveElement;
  luckyColors: string[];
  luckyDirections: CompassDirection[];
  kuaInfo?: KuaInfo;
  decorSuggestions: DecorSuggestion[];
}

export function LuckyGuide({
  primaryElement,
  luckyColors,
  luckyDirections,
  kuaInfo,
  decorSuggestions,
}: LuckyGuideProps) {
  const elementIcons: Record<FiveElement, any> = {
    wood: Leaf,
    water: Droplet,
    fire: Flame,
    earth: Mountain,
    metal: CircleDot,
  };

  const PrimaryIcon = elementIcons[primaryElement] || Sparkles;

  return (
    <div className="space-y-8">
      {/* 1. Kua Number & Personal Energy (if available) */}
      {kuaInfo && (
        <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-950/40 via-slate-900/60 to-slate-950 border border-emerald-600/40 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-serif font-black text-2xl shadow-inner">
                {kuaInfo.kuaNumber}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white">
                    Personal Kua Number {kuaInfo.kuaNumber} ({kuaInfo.trigram})
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-900/60 text-emerald-300 border border-emerald-700">
                    {kuaInfo.group} Group
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Governing Element: <strong className="capitalize text-emerald-300">{kuaInfo.element}</strong> • Based on your birth year.
                </p>
              </div>
            </div>

            <div className="text-xs text-slate-400 max-w-xs text-left sm:text-right">
              Sleep with your crown or sit facing your personal Sheng Chi direction to maximize vitality.
            </div>
          </div>

          {/* 4 Lucky Directions Breakdown */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
            <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800">
              <div className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                Sheng Chi (Wealth)
              </div>
              <div className="text-lg font-black text-white mt-0.5 font-mono">
                {kuaInfo.luckyDirections.shengChi}
              </div>
              <div className="text-[10px] text-slate-400">Vitality, money & growth</div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800">
              <div className="text-[10px] font-bold uppercase tracking-wider text-teal-400">
                Tian Yi (Health)
              </div>
              <div className="text-lg font-black text-white mt-0.5 font-mono">
                {kuaInfo.luckyDirections.tianYi}
              </div>
              <div className="text-[10px] text-slate-400">Healing & well-being</div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800">
              <div className="text-[10px] font-bold uppercase tracking-wider text-rose-400">
                Yan Nian (Love)
              </div>
              <div className="text-lg font-black text-white mt-0.5 font-mono">
                {kuaInfo.luckyDirections.yanNian}
              </div>
              <div className="text-[10px] text-slate-400">Romance & harmony</div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800">
              <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
                Fu Wei (Peace)
              </div>
              <div className="text-lg font-black text-white mt-0.5 font-mono">
                {kuaInfo.luckyDirections.fuWei}
              </div>
              <div className="text-[10px] text-slate-400">Stability & clarity</div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Elements & Lucky Colors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Primary Element Card */}
        <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
            <PrimaryIcon className="w-4 h-4" />
            <span>Harmonizing Element</span>
          </div>

          <h4 className="text-xl font-black text-white capitalize">
            {primaryElement} Element Energy
          </h4>

          <p className="text-xs text-slate-400 leading-relaxed">
            Your space and goal benefit most from active {primaryElement} cultivation. Incorporate natural organic textures, rounded organic lines, and living elements to maintain Sheng Chi momentum.
          </p>

          <div className="flex items-center gap-2 pt-2">
            <span className="text-xs font-semibold text-slate-300">Auspicious Sectors:</span>
            <div className="flex gap-1.5">
              {luckyDirections.map((dir) => (
                <span
                  key={dir}
                  className="px-2 py-0.5 rounded-lg text-xs font-mono font-bold bg-slate-800 text-emerald-300 border border-slate-700"
                >
                  {dir}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Lucky Colors Palette */}
        <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-400">
            <Palette className="w-4 h-4" />
            <span>Recommended Palette</span>
          </div>

          <h4 className="text-xl font-black text-white">
            Auspicious Accent Colors
          </h4>

          <p className="text-xs text-slate-400 leading-relaxed">
            Use these shades in throw blankets, artwork, curtains, or small ceramics to stimulate Chi without overwhelming the room.
          </p>

          <div className="flex flex-wrap gap-2 pt-1">
            {luckyColors.map((color) => (
              <div
                key={color}
                className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 flex items-center gap-2 text-xs font-medium text-slate-200"
              >
                <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm" />
                <span>{color}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Decor / Shopping Suggestions */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-base font-bold text-white flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-emerald-400" />
            <span>Feng Shui Decor & Placement Enhancers</span>
          </h4>
          <span className="text-xs text-slate-400">Generic items • No affiliates</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {decorSuggestions.map((item, index) => (
            <div
              key={index}
              className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-2 hover:border-slate-700 transition"
            >
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-slate-300 capitalize">
                  {item.element} element
                </span>
                <span className="text-[10px] text-emerald-400 font-medium">
                  {item.color}
                </span>
              </div>

              <h5 className="text-xs font-bold text-white leading-tight">
                {item.item}
              </h5>

              <p className="text-[11px] text-slate-400 leading-relaxed">
                {item.purpose}
              </p>

              <div className="text-[10px] text-teal-300 font-medium pt-1 border-t border-slate-800">
                <strong>Placement:</strong> {item.placement}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
