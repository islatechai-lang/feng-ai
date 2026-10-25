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
  Loader2,
  Box,
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
  const [roomType, setRoomType] = useState<RoomType>("living_room");
  const [doorDirection, setDoorDirection] = useState<CompassDirection>("SW");
  const [goal, setGoal] = useState<FengShuiGoal>("sleep");
  const [birthYear, setBirthYear] = useState<string>("");

  // Modals and 360 Scanner State
  const [showScanner360, setShowScanner360] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState<string | null>(null);

  // Flow State
  const [activeStep, setActiveStep] = useState<1 | 2 | 3>(1);
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Direct Analysis execution
  const executeAnalysis = async (imageUrl: string) => {
    setIsAnalyzing(true);
    setErrorMsg(null);
    setLoadingStatus("Processing 360° perspective...");

    try {
      setTimeout(() => {
        setLoadingStatus("Gemini AI: Detecting actual room layout & furniture...");
      }, 1500);

      setTimeout(() => {
        setLoadingStatus("Constructing interactive 3D spatial studio...");
      }, 3500);

      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageDataUrl: imageUrl,
          roomType,
          doorDirection,
          goal,
          birthYear: birthYear || undefined,
        }),
      });

      if (!response.ok) {
        throw new Error("Analysis failed. Please try scanning again.");
      }

      const data = await response.json();

      const record = {
        id: data.analysisId,
        roomType: data.result.scene3D?.roomType || roomType,
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

      // Automatically route directly to the 3D Studio!
      router.push(`/result/${data.analysisId}`);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to analyze room.");
      setIsAnalyzing(false);
      setLoadingStatus(null);
    }
  };

  // Called when 360 scan completes - immediately builds 3D room!
  const handle360ScanComplete = (capturedUrl: string) => {
    setImageDataUrl(capturedUrl);
    setShowScanner360(false);
    executeAnalysis(capturedUrl);
  };

  // File Handlers for upload
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
      executeAnalysis(compressed.dataUrl);
    } catch {
      setErrorMsg("Failed to process image. Please try another.");
    } finally {
      setIsProcessingImage(false);
    }
  };

  const spatialZone = getHumanSpatialZone(doorDirection);

  return (
    <div className="min-h-screen flex flex-col bg-[#020e0c] text-slate-100 pb-36 selection:bg-emerald-500 selection:text-slate-950">
      <TopHeader />

      <main className="flex-1 max-w-md w-full mx-auto px-4 pt-3 space-y-5">
        {/* Subtle Ambient Light Orb behind scanner */}
        <div className="absolute top-16 left-1/2 -translate-x-1/2 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* 1. Main Native Studio Card (Full Focus on 3D Circular Scan) */}
        {!isAnalyzing ? (
          <div className="relative glass-panel-elevated rounded-3xl p-6 text-center space-y-5 border border-emerald-500/20 shadow-2xl overflow-hidden">
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">
                Spatial Chi AI • 3D Room Studio
              </span>
              <h1 className="text-2xl font-black tracking-tight text-white">
                Scan Your Space in 3D
              </h1>
              <p className="text-xs text-slate-300 max-w-xs mx-auto leading-relaxed">
                Scan your room in a 360° circle. Gemini AI will identify your real furniture and build an interactive 3D studio showing how to rearrange it into the Command Position.
              </p>
            </div>

            {/* Glowing Big Action Button (Full Focus on 3D Circular Scan) */}
            <div className="relative py-4 flex flex-col items-center justify-center">
              <button
                type="button"
                onClick={() => setShowScanner360(true)}
                className="group relative active:scale-95 transition-transform"
              >
                {/* Glow ring */}
                <div className="absolute -inset-4 rounded-full bg-gradient-to-tr from-emerald-500/35 via-teal-400/30 to-amber-300/25 blur-2xl group-hover:opacity-100 transition duration-500 animate-pulse" />
                <div className="relative w-32 h-32 rounded-full bg-gradient-to-tr from-emerald-500 via-teal-400 to-emerald-300 p-1.5 shadow-2xl flex items-center justify-center">
                  <div className="w-full h-full rounded-full bg-[#031915] flex flex-col items-center justify-center gap-1.5 text-emerald-300 group-hover:text-emerald-200 transition-colors">
                    <Scan className="w-10 h-10 stroke-[2] text-emerald-400 animate-pulse" />
                    <span className="text-xs font-black tracking-tight">
                      3D Room Scan
                    </span>
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setShowScanner360(true)}
                className="mt-4 px-6 py-3 rounded-full bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-200 text-slate-950 text-xs font-black tracking-tight shadow-xl shadow-emerald-950/60 active:scale-95 transition flex items-center gap-1.5"
              >
                <Sparkles className="w-4 h-4 text-slate-950" />
                <span>Start 360° Circular Scan</span>
              </button>

              {/* Discreet fallback for desktop or photo upload */}
              <label
                htmlFor="gallery-input"
                className="mt-3 text-[11px] text-slate-400 hover:text-emerald-300 cursor-pointer underline transition flex items-center gap-1"
              >
                <Upload className="w-3 h-3 text-slate-500" />
                <span>or upload room photo / panorama</span>
              </label>

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
                <span className="font-bold text-white">Interactive</span>
                <span className="text-slate-400">3D Studio</span>
              </div>
              <div className="p-2 rounded-2xl bg-slate-950/50 border border-emerald-500/10 flex flex-col items-center gap-1">
                <span className="font-bold text-white">Your Real</span>
                <span className="text-slate-400">Furniture</span>
              </div>
              <div className="p-2 rounded-2xl bg-slate-950/50 border border-emerald-500/10 flex flex-col items-center gap-1">
                <span className="font-bold text-white">Command</span>
                <span className="text-slate-400">Position</span>
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}
          </div>
        ) : (
          /* Analyzing / Building 3D Room Loading Screen */
          <div className="glass-panel-elevated rounded-3xl p-8 text-center space-y-6 border border-emerald-500/30 shadow-2xl">
            <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-2 border-emerald-500/30 border-t-emerald-400 animate-spin" />
              <div className="w-16 h-16 rounded-full bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <Box className="w-8 h-8 animate-pulse" />
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-base font-black text-white tracking-tight">
                Building Your 3D Room Studio
              </h3>
              <p className="text-xs text-emerald-300 font-mono animate-pulse">
                {loadingStatus || "Analyzing spatial energy..."}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-emerald-500/20 text-[11px] text-slate-300 leading-relaxed text-left space-y-1">
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>What happens next:</span>
              </div>
              <p>
                Gemini identifies your real furniture (sofa, desk, or bed) and maps your room into 3D so you can explore, navigate in 360°, and test moving items into the Command Position.
              </p>
            </div>
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

      {/* Native Floating Bottom Tab Bar - hidden when full-screen scanner is active */}
      {!showScanner360 && !isAnalyzing && <BottomNav />}
    </div>
  );
}
