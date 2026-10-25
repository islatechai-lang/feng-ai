"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RoomType, CompassDirection, FengShuiGoal } from "@/types";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ImageUploader } from "@/components/ImageUploader";
import { ContextForm } from "@/components/ContextForm";
import { AnalysisProgress } from "@/components/AnalysisProgress";
import { SampleRoom } from "@/lib/sample-data";

export default function AnalyzePage() {
  const router = useRouter();

  // Form State
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [roomType, setRoomType] = useState<RoomType>("bedroom");
  const [doorDirection, setDoorDirection] = useState<CompassDirection>("SW");
  const [goal, setGoal] = useState<FengShuiGoal>("sleep");
  const [birthYear, setBirthYear] = useState<string>("");

  // Loading State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Handle Preset Selection
  const handleImageSelected = (url: string, sample?: SampleRoom) => {
    setImageDataUrl(url);
    if (sample) {
      setRoomType(sample.roomType);
      setDoorDirection(sample.doorDirection);
      setGoal(sample.goal);
      if (sample.birthYear) setBirthYear(sample.birthYear.toString());
    }
  };

  const handleStartAnalysis = async () => {
    if (!imageDataUrl) {
      setErrorMsg("Please upload a room photo or choose one of the sample presets.");
      return;
    }

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

      // Cache locally in localStorage for persistent access in case database is offline
      const analysisRecord = {
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
        const stored = JSON.parse(localStorage.getItem("fengshui_analyses") || "[]");
        localStorage.setItem(
          "fengshui_analyses",
          JSON.stringify([analysisRecord, ...stored.filter((a: any) => a.id !== data.analysisId)])
        );
        sessionStorage.setItem(`analysis_${data.analysisId}`, JSON.stringify(analysisRecord));
      } catch (storageErr) {
        console.warn("Storage write failed:", storageErr);
      }

      // Navigate to result screen
      router.push(`/result/${data.analysisId}`);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Something went wrong during analysis.");
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-10">
        {isAnalyzing ? (
          <AnalysisProgress />
        ) : (
          <div className="space-y-8">
            <div className="text-center space-y-2">
              <span className="text-xs uppercase tracking-widest text-emerald-400 font-bold">
                Spatial Feng Shui Scanner
              </span>
              <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                Analyze Your Room
              </h1>
              <p className="text-sm text-slate-400 max-w-md mx-auto">
                Upload your photo and specify your door orientation to reveal your Feng Shui score and layout improvements.
              </p>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="p-4 rounded-2xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs text-center">
                {errorMsg}
              </div>
            )}

            {/* Step 1: Upload Photo */}
            <ImageUploader
              onImageSelected={handleImageSelected}
              selectedImageUrl={imageDataUrl || undefined}
            />

            {/* Step 2: Context Form */}
            {imageDataUrl && (
              <ContextForm
                roomType={roomType}
                doorDirection={doorDirection}
                goal={goal}
                birthYear={birthYear}
                onRoomTypeChange={setRoomType}
                onDoorDirectionChange={setDoorDirection}
                onGoalChange={setGoal}
                onBirthYearChange={setBirthYear}
                onSubmit={handleStartAnalysis}
                isLoading={isAnalyzing}
              />
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
