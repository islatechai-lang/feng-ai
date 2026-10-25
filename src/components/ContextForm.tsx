"use client";

import { RoomType, CompassDirection, FengShuiGoal } from "@/types";
import { CompassPicker } from "./CompassPicker";
import { Bed, Briefcase, Sofa, UtensilsCrossed, Store, Coins, Moon, Heart, TrendingUp, ShieldAlert, Sparkles } from "lucide-react";

interface ContextFormProps {
  roomType: RoomType;
  doorDirection: CompassDirection;
  goal: FengShuiGoal;
  birthYear: string;
  onRoomTypeChange: (val: RoomType) => void;
  onDoorDirectionChange: (val: CompassDirection) => void;
  onGoalChange: (val: FengShuiGoal) => void;
  onBirthYearChange: (val: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export function ContextForm({
  roomType,
  doorDirection,
  goal,
  birthYear,
  onRoomTypeChange,
  onDoorDirectionChange,
  onGoalChange,
  onBirthYearChange,
  onSubmit,
  isLoading,
}: ContextFormProps) {
  const roomTypes: Array<{ id: RoomType; label: string; icon: any; hint: string }> = [
    { id: "bedroom", label: "Bedroom", icon: Bed, hint: "Command bed position & sleep sanctuary" },
    { id: "office", label: "Office / Desk", icon: Briefcase, hint: "Career success & focus layout" },
    { id: "living_room", label: "Living Room", icon: Sofa, hint: "Family harmony & welcoming Chi" },
    { id: "kitchen", label: "Kitchen", icon: UtensilsCrossed, hint: "Fire/Water element harmony" },
    { id: "shop", label: "Shop / Store", icon: Store, hint: "Customer flow & wealth entrance" },
  ];

  const goals: Array<{ id: FengShuiGoal; label: string; icon: any; color: string; desc: string }> = [
    { id: "money", label: "Wealth & Abundance", icon: Coins, color: "text-amber-400", desc: "Activate Xun wealth sector & door threshold" },
    { id: "sleep", label: "Deep Rest & Calm", icon: Moon, color: "text-indigo-400", desc: "Cure insomnia & eliminate nocturnal Sha Chi" },
    { id: "career", label: "Career & Authority", icon: TrendingUp, color: "text-emerald-400", desc: "Command position for leadership and mentors" },
    { id: "love", label: "Love & Harmony", icon: Heart, color: "text-rose-400", desc: "Equal partnership balance & Kun earth energy" },
    { id: "health", label: "Vitality & Healing", icon: ShieldAlert, color: "text-teal-400", desc: "Tai Chi center balance & natural Chi renewal" },
  ];

  return (
    <div className="space-y-8 bg-slate-900/40 p-6 sm:p-8 rounded-3xl border border-slate-800">
      {/* 1. Room Type */}
      <div className="space-y-3">
        <label className="text-sm font-semibold text-slate-200 flex items-center justify-between">
          <span>1. What kind of space is this?</span>
          <span className="text-xs text-slate-400">Step 1 of 4</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          {roomTypes.map((t) => {
            const Icon = t.icon;
            const isSelected = roomType === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => onRoomTypeChange(t.id)}
                className={`p-3 rounded-2xl text-left border transition-all ${
                  isSelected
                    ? "bg-emerald-950/80 border-emerald-500 shadow-lg shadow-emerald-950/80 text-white"
                    : "bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700"
                }`}
              >
                <Icon className={`w-5 h-5 mb-1.5 ${isSelected ? "text-emerald-400" : "text-slate-400"}`} />
                <div className="text-xs font-bold">{t.label}</div>
                <div className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{t.hint}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Compass Direction */}
      <div className="space-y-3">
        <label className="text-sm font-semibold text-slate-200 flex items-center justify-between">
          <span>2. Main door compass orientation</span>
          <span className="text-xs text-slate-400">Step 2 of 4</span>
        </label>
        <CompassPicker value={doorDirection} onChange={onDoorDirectionChange} />
      </div>

      {/* 3. Primary Intention / Goal */}
      <div className="space-y-3">
        <label className="text-sm font-semibold text-slate-200 flex items-center justify-between">
          <span>3. What energy do you want to manifest?</span>
          <span className="text-xs text-slate-400">Step 3 of 4</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {goals.map((g) => {
            const Icon = g.icon;
            const isSelected = goal === g.id;
            return (
              <button
                key={g.id}
                type="button"
                onClick={() => onGoalChange(g.id)}
                className={`p-3.5 rounded-2xl text-left border transition-all flex items-start gap-3 ${
                  isSelected
                    ? "bg-emerald-950/80 border-emerald-500 shadow-md shadow-emerald-950 text-white"
                    : "bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700"
                }`}
              >
                <div className={`p-2 rounded-xl bg-slate-800 shrink-0 ${isSelected ? "bg-emerald-900/60" : ""}`}>
                  <Icon className={`w-4 h-4 ${g.color}`} />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">{g.label}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{g.desc}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Birth Year (Optional for Kua / Eight Mansions) */}
      <div className="space-y-3">
        <label className="text-sm font-semibold text-slate-200 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            4. Your Birth Year <span className="text-xs font-normal text-slate-400">(Optional for Personal Kua)</span>
          </span>
          <span className="text-xs text-slate-400">Step 4 of 4</span>
        </label>
        <div className="flex flex-col sm:flex-row gap-3 items-center">
          <div className="relative w-full sm:w-64">
            <input
              type="number"
              min="1920"
              max="2030"
              placeholder="e.g. 1994"
              value={birthYear}
              onChange={(e) => onBirthYearChange(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500"
            />
          </div>
          <p className="text-xs text-slate-400 leading-tight">
            Used to calculate your personal Ba Zhai Kua number, East/West grouping, and personal lucky directions.
          </p>
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-2">
        <button
          type="button"
          disabled={isLoading}
          onClick={onSubmit}
          className="w-full py-4 rounded-2xl font-bold text-base bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-400 text-slate-950 hover:from-emerald-400 hover:to-teal-400 shadow-xl shadow-emerald-950/60 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2.5 disabled:opacity-50"
        >
          <Sparkles className="w-5 h-5 text-slate-950" />
          <span>{isLoading ? "Consulting Feng Shui Engine..." : "Analyze My Room (Free)"}</span>
        </button>
      </div>
    </div>
  );
}
