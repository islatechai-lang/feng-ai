"use client";

import { useState, useEffect } from "react";
import { CompassDirection } from "@/types";
import { Compass, HelpCircle, Navigation } from "lucide-react";

interface CompassPickerProps {
  value: CompassDirection;
  onChange: (dir: CompassDirection) => void;
}

const DIRECTIONS: Array<{ dir: CompassDirection; label: string; degrees: number }> = [
  { dir: "N", label: "North (360°)", degrees: 0 },
  { dir: "NE", label: "Northeast (45°)", degrees: 45 },
  { dir: "E", label: "East (90°)", degrees: 90 },
  { dir: "SE", label: "Southeast (135°)", degrees: 135 },
  { dir: "S", label: "South (180°)", degrees: 180 },
  { dir: "SW", label: "Southwest (225°)", degrees: 225 },
  { dir: "W", label: "West (270°)", degrees: 270 },
  { dir: "NW", label: "Northwest (315°)", degrees: 315 },
];

export function CompassPicker({ value, onChange }: CompassPickerProps) {
  const [deviceHeading, setDeviceHeading] = useState<number | null>(null);
  const [isCalibrating, setIsCalibrating] = useState(false);
  const [sensorError, setSensorError] = useState<string | null>(null);

  const requestDeviceCompass = async () => {
    setIsCalibrating(true);
    setSensorError(null);

    try {
      if (
        typeof window !== "undefined" &&
        typeof (DeviceOrientationEvent as any)?.requestPermission === "function"
      ) {
        // iOS 13+ permission flow
        const permission = await (DeviceOrientationEvent as any).requestPermission();
        if (permission !== "granted") {
          setSensorError("Compass permission denied");
          setIsCalibrating(false);
          return;
        }
      }

      const handleOrientation = (e: DeviceOrientationEvent) => {
        let heading: number | null = null;
        if ((e as any).webkitCompassHeading) {
          // iOS Safari
          heading = (e as any).webkitCompassHeading;
        } else if (e.alpha !== null) {
          // Android Chrome / Standard
          heading = 360 - e.alpha;
        }

        if (heading !== null) {
          setDeviceHeading(Math.round(heading));
          // Map degrees to closest of the 8 directions
          const mappedDir = degreesToDirection(heading);
          onChange(mappedDir);
          setIsCalibrating(false);
          window.removeEventListener("deviceorientation", handleOrientation);
        }
      };

      window.addEventListener("deviceorientation", handleOrientation, { once: true });

      // Fallback timeout if no sensor event fires
      setTimeout(() => {
        setIsCalibrating(false);
      }, 4000);
    } catch {
      setSensorError("Device orientation not supported on this browser");
      setIsCalibrating(false);
    }
  };

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
  const activeDegrees = activeObj ? activeObj.degrees : 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-slate-200 flex items-center gap-2">
          <Compass className="w-4 h-4 text-emerald-400" />
          Which direction does the room door face when walking out?
        </label>
        <span className="text-xs text-emerald-400 font-mono font-medium">
          {value !== "UNKNOWN" ? value : "Not specified"}
        </span>
      </div>

      {/* Compass Circular Graphic & Interactive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center bg-slate-900/50 p-4 rounded-2xl border border-slate-800">
        {/* Interactive Visual Dial */}
        <div className="relative w-48 h-48 mx-auto flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-2 border-slate-700/60 bg-slate-950/70 shadow-inner flex items-center justify-center">
            {/* Degree ticks */}
            <div className="absolute inset-1 rounded-full border border-dashed border-slate-800" />
          </div>

          {/* 8 Cardinal points positioned around circle */}
          {DIRECTIONS.map((item) => {
            const rad = ((item.degrees - 90) * Math.PI) / 180;
            const radius = 72;
            const x = Math.round(radius * Math.cos(rad));
            const y = Math.round(radius * Math.sin(rad));
            const isSelected = value === item.dir;

            return (
              <button
                key={item.dir}
                type="button"
                onClick={() => onChange(item.dir)}
                style={{
                  transform: `translate(${x}px, ${y}px)`,
                }}
                className={`absolute w-7 h-7 rounded-full text-[11px] font-bold flex items-center justify-center transition-all ${
                  isSelected
                    ? "bg-emerald-500 text-slate-950 scale-125 shadow-lg shadow-emerald-500/50 z-10"
                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                }`}
              >
                {item.dir}
              </button>
            );
          })}

          {/* Needle */}
          {value !== "UNKNOWN" && (
            <div
              className="absolute w-1 h-32 transition-transform duration-500 pointer-events-none flex flex-col justify-between items-center"
              style={{ transform: `rotate(${activeDegrees}deg)` }}
            >
              <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[18px] border-b-red-500" />
              <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[18px] border-t-slate-500" />
            </div>
          )}

          {/* Center Pivot */}
          <div className="w-5 h-5 rounded-full bg-slate-800 border-2 border-emerald-400 z-10 flex items-center justify-center shadow">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          </div>
        </div>

        {/* Direction Selection Grid & Device Compass Tool */}
        <div className="space-y-3">
          <div className="grid grid-cols-4 gap-1.5">
            {DIRECTIONS.map((item) => (
              <button
                key={item.dir}
                type="button"
                onClick={() => onChange(item.dir)}
                className={`py-2 px-1 rounded-xl text-xs font-semibold transition-all border ${
                  value === item.dir
                    ? "bg-emerald-950/80 text-emerald-300 border-emerald-600 shadow-sm shadow-emerald-950"
                    : "bg-slate-900/60 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200"
                }`}
              >
                {item.dir}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-2 pt-1">
            <button
              type="button"
              onClick={requestDeviceCompass}
              disabled={isCalibrating}
              className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-medium bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700 transition-colors"
            >
              <Navigation className={`w-3.5 h-3.5 text-teal-400 ${isCalibrating ? "animate-spin" : ""}`} />
              <span>
                {isCalibrating ? "Aligning device compass..." : "Use phone compass"}
              </span>
            </button>

            <button
              type="button"
              onClick={() => onChange("UNKNOWN")}
              className={`flex items-center justify-center gap-1.5 py-1.5 text-xs transition-colors ${
                value === "UNKNOWN"
                  ? "text-emerald-400 font-semibold"
                  : "text-slate-500 hover:text-slate-300"
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>I don't know the exact direction</span>
            </button>

            {sensorError && (
              <p className="text-[11px] text-amber-400 text-center">
                {sensorError} — please tap a direction above.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
