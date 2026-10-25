"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Camera,
  Upload,
  Sparkles,
  Compass,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Flame,
  Moon,
  Coins,
  Briefcase,
  Heart,
  ChevronRight,
  Scan,
  Maximize2,
  Move,
} from "lucide-react";
import { TopHeader } from "@/components/TopHeader";
import { BottomNav } from "@/components/BottomNav";
import { CompassPicker } from "@/components/CompassPicker";
import { RoomScanner360 } from "@/components/RoomScanner360";
import { compressImage } from "@/lib/image/compress";
import { RoomType, CompassDirection, FengShuiGoal } from "@/types";
import { getHumanSpatialZone, COMMAND_POSITION_PLAIN_ENGLISH } from "@/lib/fengshui/human-terms";

export default function NativeAppHome() {
  const router = useRouter();

  // Upload & Form State
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [roomType, setRoomType] = useState<RoomType>("bedroom");
  const [doorDirection, setDoorDirection] = useState<CompassDirection>("SW");
  const [goal, setGoal] = useState<FengShuiGoal>("sleep");
  const [birthYear, setBirthYear] = useState<string>("");

  // Modals and 360 Scanner State
  const [showScanner360, setShowScanner360] = useState(false);

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
      setActiveStep(1);
    } catch {
      setErrorMsg("Failed to process image. Please try another.");
    } finally {
      setIsProcessingImage(false);
    }
  };

  const handle360ScanComplete = (capturedUrl: string) => {
    setImageDataUrl(capturedUrl);
    setShowScanner360(false);
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
        throw new Error("Analysis failed. Please check your photo and try again.");
      }

      const data = await response.json();

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

  const spatialZone = getHumanSpatialZone(doorDirection);

  return (
    <div className="min-h-screen flex flex-col bg-[#020e0c] text-slate-100 pb-28 selection:bg-emerald-500 selection:text-slate-950">
      <TopHeader />

      <main className="flex-1 max-w-md w-full mx-auto px-4 pt-3 space-y-5">
        {/* Subtle Ambient Light Orb behind scanner */}
        <div className="absolute top-16 left-1/2 -translate-x-1/2 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* 1. Main Native Studio Card (Scanner) */}
        {!imageDataUrl ? (
          <div className="relative glass-panel-elevated rounded-3xl p-6 text-center space-y-5 border border-emerald-500/20 shadow-2xl overflow-hidden">
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">
                Spatial Chi AI • 3D Room Scan
              </span>
              <h1 className="text-2xl font-black tracking-tight text-white">
                Scan Your Space
              </h1>
              <p className="text-xs text-slate-300 max-w-xs mx-auto leading-relaxed">
                Scan your room in 360° or snap a photo. We will map every corner in 3D and show you how to rearrange it into the harmonious Command Position.
              </p>
            </div>

            {/* Glowing Big Action Button (360° Scan Trigger) */}
            <div className="relative py-2 flex flex-col items-center justify-center">
              <button
                type="button"
                onClick={() => setShowScanner360(true)}
                className="group relative active:scale-95 transition-transform"
              >
                {/* Glow ring */}
                <div className="absolute -inset-3 rounded-full bg-gradient-to-tr from-emerald-500/30 via-teal-400/25 to-amber-300/20 blur-xl group-hover:opacity-100 transition duration-500" />
                <div className="relative w-28 h-28 rounded-full bg-gradient-to-tr from-emerald-500 via-teal-400 to-emerald-300 p-1 shadow-2xl flex items-center justify-center">
                  <div className="w-full h-full rounded-full bg-[#031915] flex flex-col items-center justify-center gap-1 text-emerald-300 group-hover:text-emerald-200 transition-colors">
                    <Scan className="w-8 h-8 stroke-[2] animate-pulse" />
                    <span className="text-[11px] font-black tracking-tight">
                      360° Scan
                    </span>
                  </div>
                </div>
              </button>

              <div className="flex items-center gap-2 mt-4">
                {/* Secondary: Regular Camera */}
                <label
                  htmlFor="camera-input"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full glass-pill text-xs font-semibold text-slate-300 hover:text-white cursor-pointer active:scale-95 transition-all border border-emerald-500/20"
                >
                  <Camera className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Snap Photo</span>
                </label>

                {/* Secondary: Gallery Upload */}
                <label
                  htmlFor="gallery-input"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full glass-pill text-xs font-semibold text-slate-300 hover:text-white cursor-pointer active:scale-95 transition-all border border-emerald-500/20"
                >
                  <Upload className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Upload</span>
                </label>
              </div>

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

              {isProcessingImage && (
                <p className="text-xs text-emerald-400 mt-2 animate-pulse font-medium">
                  Optimizing photo resolution...
                </p>
              )}
            </div>

            {/* Quick Benefits Checklist */}
            <div className="grid grid-cols-3 gap-2 pt-3 border-t border-emerald-500/15 text-[10px] text-slate-300">
              <div className="p-2 rounded-2xl bg-slate-950/50 border border-emerald-500/10 flex flex-col items-center gap-1">
                <span className="font-bold text-white">3D Studio</span>
                <span className="text-slate-400">Interactive</span>
              </div>
              <div className="p-2 rounded-2xl bg-slate-950/50 border border-emerald-500/10 flex flex-col items-center gap-1">
                <span className="font-bold text-white">Command</span>
                <span className="text-slate-400">Position Fix</span>
              </div>
              <div className="p-2 rounded-2xl bg-slate-950/50 border border-emerald-500/10 flex flex-col items-center gap-1">
                <span className="font-bold text-white">No Jargon</span>
                <span className="text-slate-400">Simple Guide</span>
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
                <span>Room Captured</span>
              </div>
              <button
                type="button"
                onClick={() => setImageDataUrl(null)}
                className="absolute top-2 right-2 px-2.5 py-0.5 rounded-full bg-slate-950/80 text-[10px] font-semibold text-slate-300 hover:text-white border border-slate-700"
              >
                Retake
              </button>
            </div>

            {/* Step Indicators */}
            <div className="flex items-center justify-between text-xs font-semibold border-b border-emerald-500/15 pb-2">
              <span className="text-emerald-300 font-bold">
                Room Details
              </span>
              <span className="text-slate-400 text-[11px]">
                Step {activeStep} of 3
              </span>
            </div>

            {/* Step 1: Room Type */}
            {activeStep === 1 && (
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-200">
                  What space are you harmonizing?
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: "bedroom", label: "Bedroom", sub: "Sleep & Aura Rejuvenation" },
                    { id: "office", label: "Work Desk", sub: "Authority & Focus" },
                    { id: "living_room", label: "Living Room", sub: "Family Chi & Social Flow" },
                    { id: "kitchen", label: "Dining / Kitchen", sub: "Nourishment & Harmony" },
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
                  className="w-full mt-2 py-3.5 rounded-2xl font-bold text-xs bg-emerald-500 text-slate-950 hover:bg-emerald-400 flex items-center justify-center gap-1.5 shadow"
                >
                  <span>Continue to Door Location</span>
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

                {/* Plain English Translation of Door Angle */}
                <div className="p-3 rounded-2xl bg-slate-950/70 border border-emerald-500/20 text-xs text-slate-200 flex items-start gap-2">
                  <div className="text-[11px]">
                    <strong className="text-emerald-400 block mb-0.5 font-bold">
                      Plain English Translation:
                    </strong>
                    Facing <span className="font-bold text-white">{doorDirection}</span> corresponds to your{" "}
                    <span className="text-emerald-300 font-bold">{spatialZone.humanTitle}</span> ({spatialZone.lifeArea}).
                  </div>
                </div>

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
                    className="flex-1 py-3.5 rounded-2xl font-bold text-xs bg-emerald-500 text-slate-950 hover:bg-emerald-400 flex items-center justify-center gap-1.5 shadow"
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
                  What energy intention do you want to elevate?
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: "sleep", label: "Restful Sleep", icon: Moon, color: "text-indigo-400" },
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
                    <span>Birth Year (Finds Lucky Headboard Wall)</span>
                    <span className="text-slate-500">Optional</span>
                  </label>
                  <input
                    type="number"
                    min="1930"
                    max="2030"
                    placeholder="e.g. 1996"
                    value={birthYear}
                    onChange={(e) => setBirthYear(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-emerald-500/20 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-emerald-400 font-mono"
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
                    <span>{isAnalyzing ? "Building 3D Room & Chi Model..." : "Analyze & Open 3D Studio ✨"}</span>
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

        {/* 2. Plain English Golden Rule Explainer */}
        <div className="glass-panel rounded-3xl p-4 flex items-start gap-3.5 border border-emerald-500/15">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 text-emerald-400">
            <Flame className="w-5 h-5 text-amber-400" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-white">
                {COMMAND_POSITION_PLAIN_ENGLISH.title}
              </span>
              <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 font-mono">
                Golden Rule
              </span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              {COMMAND_POSITION_PLAIN_ENGLISH.simpleRule}
            </p>
          </div>
        </div>

        {/* 3. Quick Nav to 3D Compass Tool */}
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
                Measure doorway heading with your phone gyro
              </div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500" />
        </button>
      </main>

      {/* 360° Circular Scanner Modal */}
      {showScanner360 && (
        <RoomScanner360
          onScanComplete={handle360ScanComplete}
          onCancel={() => setShowScanner360(false)}
        />
      )}

      {/* Native Floating Bottom Tab Bar */}
      <BottomNav />
    </div>
  );
}
