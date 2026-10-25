"use client";

import { useState, useRef } from "react";
import { Camera, Upload, Sparkles, CheckCircle2, AlertCircle } from "lucide-react";
import { compressImage } from "@/lib/image/compress";
import { SAMPLE_ROOMS, SampleRoom } from "@/lib/sample-data";

interface ImageUploaderProps {
  onImageSelected: (dataUrl: string, sampleData?: SampleRoom) => void;
  selectedImageUrl?: string;
}

export function ImageUploader({ onImageSelected, selectedImageUrl }: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setErrorMsg("Please upload an image file (JPG, PNG, HEIC, WEBP).");
      return;
    }

    try {
      setIsProcessing(true);
      setErrorMsg(null);
      const compressed = await compressImage(file, 1536, 0.85);
      onImageSelected(compressed.dataUrl);
    } catch (err: any) {
      console.error("Compression error:", err);
      setErrorMsg("Failed to process image. Please try another file.");
    } finally {
      setIsProcessing(false);
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Box */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        className={`relative border-2 border-dashed rounded-3xl p-6 sm:p-10 text-center transition-all ${
          isDragging
            ? "border-emerald-500 bg-emerald-950/20 scale-[1.01]"
            : selectedImageUrl
            ? "border-emerald-700/60 bg-slate-900/40"
            : "border-slate-800 hover:border-slate-700 bg-slate-900/20"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              handleFile(e.target.files[0]);
            }
          }}
        />
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              handleFile(e.target.files[0]);
            }
          }}
        />

        {selectedImageUrl ? (
          <div className="space-y-4">
            <div className="relative w-full max-w-md mx-auto aspect-video rounded-2xl overflow-hidden border border-emerald-600/40 shadow-2xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selectedImageUrl}
                alt="Uploaded Room"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 right-3 bg-emerald-500/90 text-slate-950 px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Ready to Analyze</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 text-slate-200 hover:bg-slate-700 transition"
              >
                Choose Different Photo
              </button>
              <button
                type="button"
                onClick={() => cameraInputRef.current?.click()}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 text-slate-200 hover:bg-slate-700 transition"
              >
                Retake with Camera
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Camera className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                Upload or Take a Room Photo
              </h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                Capture the whole room including the bed/desk and doorway. High resolution is automatically optimized.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                type="button"
                disabled={isProcessing}
                onClick={() => cameraInputRef.current?.click()}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-emerald-500 text-slate-950 hover:bg-emerald-400 transition shadow-lg shadow-emerald-950/60"
              >
                <Camera className="w-4 h-4" />
                <span>Take Photo</span>
              </button>

              <button
                type="button"
                disabled={isProcessing}
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white transition border border-slate-700"
              >
                <Upload className="w-4 h-4" />
                <span>Browse Files</span>
              </button>
            </div>

            {isProcessing && (
              <p className="text-xs text-emerald-400 animate-pulse">
                Optimizing and compressing image...
              </p>
            )}
          </div>
        )}

        {errorMsg && (
          <div className="mt-4 flex items-center justify-center gap-2 text-xs text-rose-400 bg-rose-950/40 p-2.5 rounded-xl border border-rose-900/50">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>

      {/* Preset Demo Rooms */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Or try with a sample room preset
          </span>
          <span className="text-[11px] text-slate-500">1-click instant demo</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {SAMPLE_ROOMS.map((room) => (
            <button
              key={room.id}
              type="button"
              onClick={() => onImageSelected(room.previewUrl, room)}
              className="group text-left p-2.5 rounded-2xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-emerald-600/50 transition-all flex sm:flex-col gap-3 items-center sm:items-start"
            >
              <div className="relative w-24 sm:w-full h-16 sm:h-28 rounded-xl overflow-hidden shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={room.previewUrl}
                  alt={room.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-1.5 left-1.5 bg-slate-950/80 px-2 py-0.5 rounded text-[10px] font-mono text-emerald-400">
                  Score: {room.score}
                </div>
              </div>

              <div className="min-w-0">
                <h4 className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors truncate">
                  {room.name}
                </h4>
                <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                  {room.problemSummary}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
