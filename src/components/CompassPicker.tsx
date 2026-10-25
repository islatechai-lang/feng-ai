"use client";

import { useState, useEffect, useRef } from "react";
import { CompassDirection } from "@/types";
import { BAGUA_MAP } from "@/lib/fengshui/bagua";
import { Compass, HelpCircle, Navigation, Check, Sparkles } from "lucide-react";

interface CompassPickerProps {
  value: CompassDirection;
  onChange: (dir: CompassDirection) => void;
}

const DIRECTIONS: Array<{ dir: CompassDirection; label: string; degrees: number; pal: string }> = [
  { dir: "N", label: "North", degrees: 0, pal: "Career (Kan)" },
  { dir: "NE", label: "Northeast", degrees: 45, pal: "Knowledge (Gen)" },
  { dir: "E", label: "East", degrees: 90, pal: "Vitality (Zhen)" },
  { dir: "SE", label: "Southeast", degrees: 135, pal: "Wealth (Xun)" },
  { dir: "S", label: "South", degrees: 180, pal: "Fame (Li)" },
  { dir: "SW", label: "Southwest", degrees: 225, pal: "Love (Kun)" },
  { dir: "W", label: "West", degrees: 270, pal: "Creativity (Dui)" },
  { dir: "NW", label: "Northwest", degrees: 315, pal: "Mentors (Qian)" },
];

export function CompassPicker({ value, onChange }: CompassPickerProps) {
  const [deviceHeading, setDeviceHeading] = useState<number | null>(null);
  const [isLiveListening, setIsLiveListening] = useState(false);
  const [sensorStatus, setSensorStatus] = useState<string | null>(null);
  const listenerRef = useRef<((e: DeviceOrientationEvent) => void) | null>(null);

  const startAutoDetect = async () => {
    setSensorStatus("Point your phone at the doorway...");

    try {
      if (
        typeof window !== "undefined" &&
        typeof (DeviceOrientationEvent as any)?.requestPermission === "function"
      ) {
        // iOS 13+ permission dialog
        const perm = await (DeviceOrientationEvent as any).requestPermission();
        if (perm !== "granted") {
          setSensorStatus("Compass permission was denied. Tap a direction below.");
          return;
        }
      }

      setIsLiveListening(true);

      const handleOrientation = (e: DeviceOrientationEvent) => {
        let heading: number | null = null;
        if ((e as any).webkitCompassHeading) {
          heading = (e as any).webkitCompassHeading;
        } else if (e.alpha !== null) {
          heading = (360 - e.alpha) % 360;
        }

        if (heading !== null) {
          const roundedHeading = Math.round(heading);
          setDeviceHeading(roundedHeading);
          const mapped = degreesToDirection(roundedHeading);
          onChange(mapped);
          setSensorStatus(`Live: ${roundedHeading}° (${mapped})`);
        }
      };

      listenerRef.current = handleOrientation;
      window.addEventListener("deviceorientation", handleOrientation);
    } catch {
      setSensorStatus("Phone gyroscope not available. Tap a direction below.");
      setIsLiveListening(false);
    }
  };

  const stopAutoDetect = () => {
    if (listenerRef.current) {
      window.removeEventListener("deviceorientation", listenerRef.current);
      listenerRef.current = null;
    }
    setIsLiveListening(false);
  };

  useEffect(() => {
    return () => {
      if (listenerRef.current) {
        window.removeEventListener("deviceorientation", listenerRef.current);
      }
    };
  }, []);

  function degreesToDirection(deg: number): CompassDirection {
    const normalized = (deg % 360 + 360) % 360;
    if (normalized >= 337.5 || normalized < 22.5) return "N";
    if (normalized >= 22.5 && normalized < 67.5) return "NE";
    if (normalized >= 67.5 && normalized < 112.5) return "E";
    if (normalized >= 112.5 && normalized < 157.5) return "SE";
    if (normalized >= 157.5 && normalized < 202.5) return "S";
    if (normalized >= 202.5 && normalized < 247.5) return "SW";
    if (normalized >= 247.5 && normalized < 292.5) return "W";
    return "NW";
  }

  // Active angle for visual needle
  const activeObj = DIRECTIONS.find((d) => d.dir === value);
  const activeDegrees = deviceHeading !== null ? deviceHeading : activeObj ? activeObj.degrees : 0;
  const currentSector = BAGUA_MAP[value] || BAGUA_MAP["S"];

  return (
    <div className="space-y-4">
      {/* 1-Tap Auto Detect Sensor Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <label className="font-bold text-white flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-emerald-400" />
            <span>Door Facing Direction</span>
          </label>
          <span className="text-[11px] font-mono font-bold text-emerald-300 px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/30">
            {value !== "UNKNOWN" ? `${value} (${activeDegrees}°)` : "Not set"}
          </span>
        </div>

        {/* Big 1-Click Auto-Detect Button */}
        {!isLiveListening ? (
          <button
            type="button"
            onClick={startAutoDetect}
            className="w-full py-3 px-4 rounded-2xl font-bold text-xs bg-gradient-to-r from-emerald-500/20 via-teal-500/30 to-emerald-500/20 border border-emerald-500/40 text-emerald-200 hover:text-white flex items-center justify-center gap-2 active:scale-95 transition shadow-lg"
          >
            <Navigation className="w-4 h-4 text-emerald-400" />
            <span>🎯 Point Phone at Door (Auto-Detect)</span>
          </button>
        ) : (
          <div className="p-3 rounded-2xl bg-emerald-950/90 border border-emerald-400/60 shadow-xl space-y-2 animate-pulse">
            <div className="flex items-center justify-between text-xs font-bold text-emerald-300">
              <span className="flex items-center gap-1.5">
                <Navigation className="w-3.5 h-3.5 animate-spin" />
                <span>Sensor Active: Facing {value} ({deviceHeading}°)</span>
              </span>
              <button
                type="button"
                onClick={stopAutoDetect}
                className="px-3 py-1 rounded-xl bg-emerald-500 text-slate-950 text-xs font-black shadow active:scale-95"
              >
                ✓ Lock In {value}
              </button>
            </div>
            <p className="text-[10px] text-emerald-200/80">
              Hold phone flat at waist height pointed straight toward the exit.
            </p>
          </div>
        )}

        {sensorStatus && !isLiveListening && (
          <p className="text-[10px] text-slate-400 text-center italic">
            {sensorStatus}
          </p>
        )}
      </div>

      {/* Interactive Dial & Palace Preview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center glass-panel p-4 rounded-3xl border border-emerald-500/15">
        {/* Dial */}
        <div className="relative w-44 h-44 mx-auto flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-2 border-emerald-500/20 bg-slate-950/60 shadow-inner flex items-center justify-center">
            <div className="absolute inset-2 rounded-full border border-dashed border-emerald-500/10" />
          </div>

          {/* 8 Directions Around Circle */}
          {DIRECTIONS.map((item) => {
            const rad = ((item.degrees - 90) * Math.PI) / 180;
            const radius = 66;
            const x = Math.round(radius * Math.cos(rad));
            const y = Math.round(radius * Math.sin(rad));
            const isSelected = value === item.dir;

            return (
              <button
                key={item.dir}
                type="button"
                onClick={() => {
                  stopAutoDetect();
                  onChange(item.dir);
                }}
                style={{ transform: `translate(${x}px, ${y}px)` }}
                className={`absolute w-7 h-7 rounded-full text-[10px] font-bold flex items-center justify-center transition-all ${
                  isSelected
                    ? "bg-emerald-400 text-slate-950 scale-125 shadow-lg shadow-emerald-500/50 z-10"
                    : "text-slate-400 hover:text-white glass-pill"
                }`}
              >
                {item.dir}
              </button>
            );
          })}

          {/* Rotating Compass Needle */}
          {value !== "UNKNOWN" && (
            <div
              className="absolute w-1 h-28 transition-transform duration-300 pointer-events-none flex flex-col justify-between items-center"
              style={{ transform: `rotate(${activeDegrees}deg)` }}
            >
              <div className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-b-[16px] border-b-rose-500" />
              <div className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[16px] border-t-slate-500" />
            </div>
          )}

          {/* Pivot */}
          <div className="w-4 h-4 rounded-full bg-slate-900 border-2 border-emerald-400 z-10 flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          </div>
        </div>

        {/* Palace Explanation for Beginners */}
        <div className="space-y-2.5">
          {value !== "UNKNOWN" ? (
            <div className="p-3 rounded-2xl bg-emerald-950/40 border border-emerald-500/20 space-y-1">
              <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                Governing Palace Energy
              </div>
              <div className="text-xs font-bold text-white">
                {currentSector.name}
              </div>
              <p className="text-[10px] text-slate-300 line-clamp-2">
                {currentSector.lifeArea}
              </p>
              <div className="text-[10px] text-amber-300 pt-0.5 font-medium">
                Element: {currentSector.element}
              </div>
            </div>
          ) : (
            <div className="p-3 rounded-2xl glass-pill text-[10px] text-slate-400 text-center">
              Select or auto-detect your door orientation to reveal the governing Palace.
            </div>
          )}

          {/* 8 Quick Buttons */}
          <div className="grid grid-cols-4 gap-1">
            {DIRECTIONS.map((item) => (
              <button
                key={item.dir}
                type="button"
                onClick={() => {
                  stopAutoDetect();
                  onChange(item.dir);
                }}
                className={`py-1.5 rounded-xl text-[10px] font-bold transition border ${
                  value === item.dir
                    ? "bg-emerald-500 text-slate-950 border-emerald-400 shadow"
                    : "glass-pill text-slate-400 hover:text-white border-transparent"
                }`}
              >
                {item.dir}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => {
              stopAutoDetect();
              onChange("UNKNOWN");
            }}
            className={`w-full text-center text-[10px] pt-1 transition ${
              value === "UNKNOWN"
                ? "text-emerald-400 font-bold"
                : "text-slate-500 hover:text-slate-400"
            }`}
          >
            I don't know the exact direction (Use Central Tai Chi)
          </button>
        </div>
      </div>
    </div>
  );
}
