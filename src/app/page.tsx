"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Camera,
  Upload,
  Sparkles,
  Compass,
  ArrowRight,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Flame,
  Moon,
  Coins,
  Briefcase,
  Heart,
} from "lucide-react";
import { TopHeader } from "@/components/TopHeader";
import { BottomNav } from "@/components/BottomNav";
import { CompassPicker } from "@/components/CompassPicker";
import { compressImage } from "@/lib/image/compress";
import { SAMPLE_ROOMS, SampleRoom } from "@/lib/sample-data";
import { RoomType, CompassDirection, FengShuiGoal } from "@/types";

export default function NativeAppHome() {
  const router = useRouter();

  // Upload & Form State
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [selectedPresetName, setSelectedPresetName] = useState<string | null>(null);
  const [roomType, setRoomType] = useState<RoomType>("bedroom");
  const [doorDirection, setDoorDirection] = useState<CompassDirection>("SW");
  const [goal, setGoal] = useState<FengShuiGoal>("sleep");
  const [birthYear, setBirthYear] = useState<string>("");

  // Flow State
  const [activeStep, setActiveStep] = useState<1 | 2 | 3>(1);
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // File Handlers
  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setErrorMsg("Please choose an image file (JPG, PNG, HEIC).");
      return;
    }
    try {
      setIsProcessingImage(true);
      setErrorMsg(null);
      const compressed = await compressImage(file, 1536, 0.85);
      setImageDataUrl(compressed.dataUrl);
      setSelectedPresetName(null);
      setActiveStep(1);
    } catch {
      setErrorMsg("Failed to process image. Please try another.");
    } finally {
      setIsProcessingImage(false);
    }
  };

  const handlePresetSelect = (preset: SampleRoom) => {
    setImageDataUrl(preset.previewUrl);
    setSelectedPresetName(preset.name);
    setRoomType(preset.roomType);
    setDoorDirection(preset.doorDirection);
    setGoal(preset.goal);
    if (preset.birthYear) setBirthYear(preset.birthYear.toString());
    setActiveStep(1);
  };

  const startAnalysis = async () => {
    if (!imageDataUrl) return;

    setIsAnalyzing(true);
    setErrorMsg(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageDataUrl,
          roomType,
          doorDirection,
          goal,
          birthYear: birthYear || undefined,
        }),
      });

      if (!response.ok) {
        throw new Error("Analysis failed. Please try again.");
      }

      const data = await response.json();

      // Store in session and local storage
      const record = {
        id: data.analysisId,
        roomType,
        doorDirection,
        goal,
        birthYear: birthYear ? parseInt(birthYear) : undefined,
        originalImageUrl: data.originalImageUrl,
        editedImageUrl: data.editedImageUrl,
        result: data.result,
        svgBefore: data.svgBefore,
        svgAfter: data.svgAfter,
        isUnlocked: false,
        createdAt: new Date().toISOString(),
      };

      try {
        sessionStorage.setItem(`analysis_${data.analysisId}`, JSON.stringify(record));
        const stored = JSON.parse(localStorage.getItem("fengshui_analyses") || "[]");
        localStorage.setItem(
          "fengshui_analyses",
          JSON.stringify([record, ...stored.filter((r: any) => r.id !== data.analysisId)])
        );
      } catch (e) {
        console.warn(e);
      }

      router.push(`/result/${data.analysisId}`);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to analyze room.");
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#020e0c] text-slate-100 pb-28 selection:bg-emerald-500 selection:text-slate-950">
      <TopHeader />

      <main className="flex-1 max-w-md w-full mx-auto px-4 pt-4 space-y-6">
        {/* Subtle Ambient Light Orb behind scanner */}
        <div className="absolute top-16 left-1/2 -translate-x-1/2 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* 1. Main Native Studio Card (Scanner) */}
        {!imageDataUrl ? (
          <div className="relative glass-panel-elevated rounded-3xl p-6 text-center space-y-5 border border-emerald-500/20 shadow-2xl overflow-hidden">
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">
                Spatial Chi AI
              </span>
              <h1 className="text-2xl font-black tracking-tight text-white">
                Scan Your Room
              </h1>
              <p className="text-xs text-slate-300 max-w-xs mx-auto leading-relaxed">
                Snap a photo to unlock your Feng Shui score, Command Position fixes, and an AI-rearranged layout.
              </p>
            </div>

            {/* Glowing Big Action Button */}
            <div className="relative py-4 flex flex-col items-center justify-center">
              <label
                htmlFor="camera-input"
                className="group relative cursor-pointer active:scale-95 transition-transform"
              >
                {/* Glow ring */}
                <div className="absolute -inset-3 rounded-full bg-gradient-to-tr from-emerald-500/30 to-teal-400/20 blur-xl group-hover:opacity-100 transition duration-500" />
                <div className="relative w-28 h-28 rounded-full bg-gradient-to-tr from-emerald-500 via-teal-400 to-emerald-300 p-1 shadow-2xl flex items-center justify-center">
                  <div className="w-full h-full rounded-full bg-[#031915] flex flex-col items-center justify-center gap-1 text-emerald-300 group-hover:text-emerald-200 transition-colors">
                    <Camera className="w-8 h-8 stroke-[2]" />
                    <span className="text-[11px] font-bold tracking-tight">
                      Take Photo
                    </span>
                  </div>
                </div>
              </label>

              {/* Hidden file inputs */}
              <input
                id="camera-input"
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files?.[0]) handleFileUpload(e.target.files[0]);
                }}
              />
              <input
                id="gallery-input"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files?.[0]) handleFileUpload(e.target.files[0]);
                }}
              />

              <label
                htmlFor="gallery-input"
                className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-full glass-pill text-xs font-semibold text-slate-300 hover:text-white cursor-pointer active:scale-95 transition-all"
              >
                <Upload className="w-3.5 h-3.5 text-emerald-400" />
                <span>Choose from Library</span>
              </label>

              {isProcessingImage && (
                <p className="text-xs text-emerald-400 mt-2 animate-pulse font-medium">
                  Optimizing photo...
                </p>
              )}
            </div>

            {/* Feature highlights */}
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-emerald-500/10 text-[10px] text-slate-400">
              <div className="flex flex-col items-center gap-1">
                <span className="font-bold text-slate-200">Instant</span>
                <span>0-100 Score</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <span className="font-bold text-slate-200">Command</span>
                <span>Position Fix</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <span className="font-bold text-slate-200">AI Visual</span>
                <span>Rearranged Room</span>
              </div>
            </div>
          </div>
        ) : (
          /* Step-by-Step Context Form once Photo is selected */
          <div className="glass-panel-elevated rounded-3xl p-5 space-y-5 border border-emerald-500/25 shadow-2xl">
            {/* Thumbnail Preview Banner */}
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-emerald-500/30 shadow-lg">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageDataUrl}
                alt="Selected Room"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full bg-slate-950/80 backdrop-blur-md text-[10px] font-bold text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span>{selectedPresetName || "Photo Ready"}</span>
              </div>
              <button
                type="button"
                onClick={() => setImageDataUrl(null)}
                className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-slate-950/80 text-[10px] text-slate-300 hover:text-white"
              >
                Change
              </button>
            </div>

            {/* Step Indicators */}
            <div className="flex items-center justify-between text-xs font-semibold border-b border-emerald-500/15 pb-2">
              <span className="text-emerald-300">
                Configure Room Context
              </span>
              <span className="text-slate-400 text-[11px]">
                Step {activeStep} of 3
              </span>
            </div>

            {/* Step 1: Room Type */}
            {activeStep === 1 && (
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-200">
                  What kind of space is this?
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: "bedroom", label: "Bedroom", sub: "Bed & sleep Chi" },
                    { id: "office", label: "Work Desk", sub: "Career authority" },
                    { id: "living_room", label: "Living Room", sub: "Family harmony" },
                    { id: "kitchen", label: "Kitchen / Dining", sub: "Fire/Water balance" },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setRoomType(item.id as RoomType)}
                      className={`p-3 rounded-2xl text-left border transition-all ${
                        roomType === item.id
                          ? "bg-emerald-950/70 border-emerald-400 text-white shadow-md shadow-emerald-950"
                          : "glass-pill text-slate-300 hover:text-white border-transparent"
                      }`}
                    >
                      <div className="text-xs font-bold">{item.label}</div>
                      <div className="text-[10px] text-slate-400">{item.sub}</div>
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => setActiveStep(2)}
                  className="w-full mt-2 py-3 rounded-2xl font-bold text-xs bg-emerald-500 text-slate-950 hover:bg-emerald-400 flex items-center justify-center gap-1.5 shadow"
                >
                  <span>Continue to Door Direction</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Step 2: Door Orientation */}
            {activeStep === 2 && (
              <div className="space-y-4">
                <CompassPicker
                  value={doorDirection}
                  onChange={(d) => setDoorDirection(d)}
                />

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveStep(1)}
                    className="py-3 px-4 rounded-2xl text-xs font-semibold glass-pill text-slate-300 hover:text-white"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveStep(3)}
                    className="flex-1 py-3 rounded-2xl font-bold text-xs bg-emerald-500 text-slate-950 hover:bg-emerald-400 flex items-center justify-center gap-1.5 shadow"
                  >
                    <span>Continue to Intention</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Goal & Optional Birth Year */}
            {activeStep === 3 && (
              <div className="space-y-4">
                <label className="text-xs font-bold text-slate-200">
                  What energy do you want to cultivate?
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: "sleep", label: "Rest & Calm", icon: Moon, color: "text-indigo-400" },
                    { id: "money", label: "Wealth & Cash", icon: Coins, color: "text-amber-400" },
                    { id: "career", label: "Career & Focus", icon: Briefcase, color: "text-emerald-400" },
                    { id: "love", label: "Love & Harmony", icon: Heart, color: "text-rose-400" },
                  ].map((g) => {
                    const Icon = g.icon;
                    const isSelected = goal === g.id;
                    return (
                      <button
                        key={g.id}
                        type="button"
                        onClick={() => setGoal(g.id as FengShuiGoal)}
                        className={`p-3 rounded-2xl text-left border transition-all flex items-center gap-2.5 ${
                          isSelected
                            ? "bg-emerald-950/70 border-emerald-400 text-white shadow-md shadow-emerald-950"
                            : "glass-pill text-slate-300 hover:text-white border-transparent"
                        }`}
                      >
                        <Icon className={`w-4 h-4 ${g.color}`} />
                        <span className="text-xs font-bold">{g.label}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="space-y-1.5 pt-1">
                  <label className="text-[11px] font-semibold text-slate-300 flex items-center justify-between">
                    <span>Birth Year (Optional for Personal Kua)</span>
                    <span className="text-slate-500">e.g. 1996</span>
                  </label>
                  <input
                    type="number"
                    min="1930"
                    max="2030"
                    placeholder="1996"
                    value={birthYear}
                    onChange={(e) => setBirthYear(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-emerald-500/20 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveStep(2)}
                    className="py-3 px-4 rounded-2xl text-xs font-semibold glass-pill text-slate-300 hover:text-white"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    disabled={isAnalyzing}
                    onClick={startAnalysis}
                    className="flex-1 py-3.5 rounded-2xl font-bold text-xs bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-200 text-slate-950 hover:brightness-110 flex items-center justify-center gap-2 shadow-xl shadow-emerald-950 disabled:opacity-50"
                  >
                    <Sparkles className="w-4 h-4 text-slate-950" />
                    <span>{isAnalyzing ? "Consulting Feng Shui AI..." : "Harmonize My Space ✨"}</span>
                  </button>
                </div>
              </div>
            )}

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}
          </div>
        )}

        {/* 2. 1-Tap Sample Presets (Smooth Horizontal Carousel) */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Instant Sample Rooms</span>
            </span>
            <span className="text-[10px] text-slate-500">1-Tap Demo</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {SAMPLE_ROOMS.map((sample) => (
              <button
                key={sample.id}
                type="button"
                onClick={() => handlePresetSelect(sample)}
                className="group text-left glass-pill p-2 rounded-2xl hover:border-emerald-500/40 transition active:scale-95 space-y-1.5"
              >
                <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden border border-emerald-500/10">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={sample.previewUrl}
                    alt={sample.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-1 left-1 px-1.5 py-0.2 rounded bg-slate-950/80 text-[8px] font-mono text-emerald-300">
                    {sample.score} pts
                  </div>
                </div>
                <div className="text-[10px] font-bold text-white group-hover:text-emerald-300 truncate">
                  {sample.name.split(" ")[0]} {sample.name.split(" ")[1]}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 3. Today's Chi Insight Card */}
        <div className="glass-panel rounded-3xl p-4 flex items-start gap-3.5 border border-emerald-500/15">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 text-emerald-400">
            <Flame className="w-5 h-5 text-amber-400" />
          </div>
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-white">
                Daily Chi Atmosphere
              </span>
              <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 font-mono">
                Auspicious
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Open your morning windows before 11:00 AM to flush out night-stagnant Si Chi and welcome vibrant Yang energy.
            </p>
          </div>
        </div>

        {/* 4. Quick Nav to Standalone Compass */}
        <button
          type="button"
          onClick={() => router.push("/compass")}
          className="w-full glass-panel hover:bg-emerald-950/30 p-4 rounded-3xl flex items-center justify-between border border-emerald-500/15 active:scale-95 transition"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal-500/10 flex items-center justify-center text-teal-400 border border-teal-500/20">
              <Compass className="w-5 h-5" />
            </div>
            <div className="text-left">
              <div className="text-xs font-bold text-white">
                Live Feng Shui Compass Tool
              </div>
              <div className="text-[10px] text-slate-400">
                Measure your doorway heading in real-time
              </div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500" />
        </button>
      </main>

      {/* Native Floating Bottom Tab Bar */}
      <BottomNav />
    </div>
  );
}
