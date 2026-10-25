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
    <div className="space-y-4">
      {/* 1. Kua Number & Personal Energy (if available) */}
      {kuaInfo && (
        <div className="p-4 rounded-3xl glass-panel-elevated border border-emerald-500/25 shadow-xl space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-serif font-black text-xl shadow-inner">
              {kuaInfo.kuaNumber}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-xs font-bold text-white">
                  Personal Kua {kuaInfo.kuaNumber} ({kuaInfo.trigram})
                </h3>
                <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-700">
                  {kuaInfo.group}
                </span>
              </div>
              <p className="text-[10px] text-slate-400">
                Element: <strong className="capitalize text-emerald-300">{kuaInfo.element}</strong> • Based on birth year
              </p>
            </div>
          </div>

          <p className="text-[11px] text-emerald-200/90 leading-tight p-2.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/20">
            💡 <strong>Actionable Rule:</strong> Sleep with the crown of your head facing <strong>{kuaInfo.luckyDirections.tianYi} (Tian Yi)</strong> for healing sleep, or face <strong>{kuaInfo.luckyDirections.shengChi} (Sheng Chi)</strong> at your desk for career authority.
          </p>

          {/* 4 Lucky Directions Breakdown */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <div className="p-2.5 rounded-2xl glass-pill">
              <div className="text-[9px] font-bold uppercase tracking-wider text-amber-400">
                Sheng Chi (Wealth)
              </div>
              <div className="text-base font-black text-white font-mono">
                {kuaInfo.luckyDirections.shengChi}
              </div>
              <div className="text-[9px] text-slate-400">Vitality & money growth</div>
            </div>

            <div className="p-2.5 rounded-2xl glass-pill">
              <div className="text-[9px] font-bold uppercase tracking-wider text-teal-400">
                Tian Yi (Health)
              </div>
              <div className="text-base font-black text-white font-mono">
                {kuaInfo.luckyDirections.tianYi}
              </div>
              <div className="text-[9px] text-slate-400">Healing & calm sleep</div>
            </div>

            <div className="p-2.5 rounded-2xl glass-pill">
              <div className="text-[9px] font-bold uppercase tracking-wider text-rose-400">
                Yan Nian (Love)
              </div>
              <div className="text-base font-black text-white font-mono">
                {kuaInfo.luckyDirections.yanNian}
              </div>
              <div className="text-[9px] text-slate-400">Romance & harmony</div>
            </div>

            <div className="p-2.5 rounded-2xl glass-pill">
              <div className="text-[9px] font-bold uppercase tracking-wider text-indigo-400">
                Fu Wei (Peace)
              </div>
              <div className="text-base font-black text-white font-mono">
                {kuaInfo.luckyDirections.fuWei}
              </div>
              <div className="text-[9px] text-slate-400">Clarity & mental stillness</div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Elements & Lucky Colors */}
      <div className="space-y-3">
        {/* Primary Element Card */}
        <div className="p-4 rounded-3xl glass-panel border border-emerald-500/15 space-y-2">
          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-400">
            <PrimaryIcon className="w-3.5 h-3.5" />
            <span>Harmonizing Element</span>
          </div>

          <h4 className="text-sm font-black text-white capitalize">
            {primaryElement} Element Sanctuary
          </h4>

          <p className="text-xs text-slate-300 leading-relaxed">
            Your space and goal benefit most from active {primaryElement} cultivation. Incorporate organic textures, rounded organic lines, and natural living elements to circulate vibrant Sheng Chi.
          </p>

          <div className="flex items-center gap-2 pt-1 text-xs">
            <span className="text-[11px] font-semibold text-slate-300">Auspicious Sectors:</span>
            <div className="flex gap-1">
              {luckyDirections.map((dir) => (
                <span
                  key={dir}
                  className="px-2 py-0.2 rounded-lg text-[10px] font-mono font-bold bg-slate-900 text-emerald-300 border border-emerald-500/30"
                >
                  {dir}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Lucky Colors Palette */}
        <div className="p-4 rounded-3xl glass-panel border border-emerald-500/15 space-y-2">
          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-teal-400">
            <Palette className="w-3.5 h-3.5" />
            <span>Recommended Accent Palette</span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Incorporate these tones in throw pillows, ceramics, curtains, and lighting shades:
          </p>

          <div className="flex flex-wrap gap-1.5 pt-0.5">
            {luckyColors.map((color) => (
              <div
                key={color}
                className="px-2.5 py-1 rounded-xl glass-pill flex items-center gap-1.5 text-[11px] font-medium text-slate-200"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-sm" />
                <span>{color}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Decor / Shopping Suggestions */}
      <div className="space-y-2.5 pt-1">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
            <ShoppingBag className="w-3.5 h-3.5 text-emerald-400" />
            <span>Auspicious Decor Enhancers</span>
          </h4>
          <span className="text-[10px] text-slate-500">Generic items • No affiliates</span>
        </div>

        <div className="space-y-2">
          {decorSuggestions.map((item, index) => (
            <div
              key={index}
              className="p-3.5 rounded-2xl glass-panel border border-emerald-500/15 space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.2 rounded text-[9px] font-bold uppercase tracking-wider bg-slate-900 text-slate-300 capitalize border border-slate-700">
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

              <div className="text-[10px] text-teal-300 font-medium pt-0.5 border-t border-emerald-500/10">
                <strong>Placement:</strong> {item.placement}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
