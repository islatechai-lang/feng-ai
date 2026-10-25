"use client";

import { DecorSuggestion, FiveElement, KuaInfo, CompassDirection } from "@/types";
import { Sparkles, Compass, ShieldCheck, Palette, ShoppingBag, Leaf, Droplet, Flame, Mountain, CircleDot } from "lucide-react";
import { getHumanSpatialZone } from "@/lib/fengshui/human-terms";

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
      {/* 1. Kua Number & Personal Energy */}
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
            💡 <strong>Simple Rule:</strong> Point the head of your bed toward your{" "}
            <strong>{getHumanSpatialZone(kuaInfo.luckyDirections.tianYi).humanTitle} ({kuaInfo.luckyDirections.tianYi})</strong> for peaceful sleep, and face{" "}
            <strong>{getHumanSpatialZone(kuaInfo.luckyDirections.shengChi).humanTitle} ({kuaInfo.luckyDirections.shengChi})</strong> while working at your desk.
          </p>

          {/* 4 Lucky Directions Breakdown with Human Descriptions */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <div className="p-3 rounded-2xl glass-pill space-y-1">
              <div className="text-[9px] font-bold uppercase tracking-wider text-amber-400">
                Wealth Direction
              </div>
              <div className="text-sm font-black text-white">
                {getHumanSpatialZone(kuaInfo.luckyDirections.shengChi).humanTitle}
              </div>
              <div className="text-[10px] font-mono text-emerald-400">
                Compass: {kuaInfo.luckyDirections.shengChi}
              </div>
              <div className="text-[9px] text-slate-400">
                {getHumanSpatialZone(kuaInfo.luckyDirections.shengChi).lifeArea}
              </div>
            </div>

            <div className="p-3 rounded-2xl glass-pill space-y-1">
              <div className="text-[9px] font-bold uppercase tracking-wider text-teal-400">
                Sleep & Health
              </div>
              <div className="text-sm font-black text-white">
                {getHumanSpatialZone(kuaInfo.luckyDirections.tianYi).humanTitle}
              </div>
              <div className="text-[10px] font-mono text-emerald-400">
                Compass: {kuaInfo.luckyDirections.tianYi}
              </div>
              <div className="text-[9px] text-slate-400">
                {getHumanSpatialZone(kuaInfo.luckyDirections.tianYi).lifeArea}
              </div>
            </div>

            <div className="p-3 rounded-2xl glass-pill space-y-1">
              <div className="text-[9px] font-bold uppercase tracking-wider text-rose-400">
                Love & Romance
              </div>
              <div className="text-sm font-black text-white">
                {getHumanSpatialZone(kuaInfo.luckyDirections.yanNian).humanTitle}
              </div>
              <div className="text-[10px] font-mono text-emerald-400">
                Compass: {kuaInfo.luckyDirections.yanNian}
              </div>
              <div className="text-[9px] text-slate-400">
                {getHumanSpatialZone(kuaInfo.luckyDirections.yanNian).lifeArea}
              </div>
            </div>

            <div className="p-3 rounded-2xl glass-pill space-y-1">
              <div className="text-[9px] font-bold uppercase tracking-wider text-indigo-400">
                Peace & Focus
              </div>
              <div className="text-sm font-black text-white">
                {getHumanSpatialZone(kuaInfo.luckyDirections.fuWei).humanTitle}
              </div>
              <div className="text-[10px] font-mono text-emerald-400">
                Compass: {kuaInfo.luckyDirections.fuWei}
              </div>
              <div className="text-[9px] text-slate-400">
                {getHumanSpatialZone(kuaInfo.luckyDirections.fuWei).lifeArea}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Primary Element & Color Balance */}
      <div className="p-4 rounded-3xl glass-panel border border-emerald-500/20 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <PrimaryIcon className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">
                Primary Element: <span className="capitalize text-emerald-400">{primaryElement}</span>
              </h4>
              <p className="text-[10px] text-slate-400">
                Natural energy signature needed to balance this room
              </p>
            </div>
          </div>
          <Palette className="w-4 h-4 text-slate-400" />
        </div>

        {/* Lucky Colors Pill List */}
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1.5">
            Recommended Harmonizing Accents
          </span>
          <div className="flex flex-wrap gap-1.5">
            {luckyColors.map((color, idx) => (
              <span
                key={idx}
                className="px-3 py-1 rounded-full text-xs font-semibold glass-pill text-white"
              >
                {color}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Curated Decor Shopping List */}
      <div className="p-4 rounded-3xl glass-panel border border-emerald-500/20 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">
                Recommended Chi Enhancers
              </h4>
              <p className="text-[10px] text-slate-400">
                Targeted cures for your space
              </p>
            </div>
          </div>
          <span className="text-[10px] font-mono text-emerald-400">
            {decorSuggestions.length} items
          </span>
        </div>

        <div className="space-y-2 pt-1">
          {decorSuggestions.map((item, idx) => (
            <div
              key={idx}
              className="p-3 rounded-2xl bg-slate-950/60 border border-emerald-500/10 space-y-1"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-300">
                  {item.item}
                </span>
                <span className="text-[9px] uppercase font-bold px-2 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300">
                  {item.element}
                </span>
              </div>
              <div className="text-[11px] text-slate-300">
                <strong className="text-slate-400">Where to put it:</strong> {item.placement}
              </div>
              <p className="text-[10px] text-slate-400 leading-relaxed">
                {item.purpose}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
