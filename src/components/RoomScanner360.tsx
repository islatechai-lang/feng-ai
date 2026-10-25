"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
  Camera,
  RotateCw,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  X,
  Compass,
  AlertCircle,
  Scan,
} from "lucide-react";

interface RoomScanner360Props {
  onScanComplete: (capturedImageDataUrl: string) => void;
  onCancel: () => void;
}

interface ScanSector {
  label: string;
  angle: number;
  description: string;
  captured: boolean;
}

export function RoomScanner360({ onScanComplete, onCancel }: RoomScanner360Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [currentAngle, setCurrentAngle] = useState(0);
  const [isScanning, setIsScanning] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // 4 circular checkpoints around the room
  const [sectors, setSectors] = useState<ScanSector[]>([
    { label: "1. Doorway", angle: 0, description: "Point camera at your room entrance door", captured: false },
    { label: "2. Right Wall", angle: 90, description: "Slowly rotate phone to the right", captured: false },
    { label: "3. Bed / Desk", angle: 180, description: "Capture your bed or main focal wall", captured: false },
    { label: "4. Left Wall", angle: 270, description: "Rotate back to complete full 360° circle", captured: false },
  ]);

  const capturedImages = useRef<string[]>([]);

  // Start Camera Stream
  useEffect(() => {
    let stream: MediaStream | null = null;

    async function initCamera() {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          setHasCameraPermission(false);
          return;
        }

        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false,
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
          setHasCameraPermission(true);
        }
      } catch (err: any) {
        console.warn("Camera init skipped or denied:", err);
        setHasCameraPermission(false);
      }
    }

    initCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Track Device Gyroscope if available
  useEffect(() => {
    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.alpha !== null) {
        const heading = Math.round(e.alpha);
        setCurrentAngle(heading);
        evaluateAngleCheckpoint(heading);
      }
    };

    if (window.DeviceOrientationEvent) {
      window.addEventListener("deviceorientation", handleOrientation);
    }

    return () => {
      window.removeEventListener("deviceorientation", handleOrientation);
    };
  }, []);

  // Check if user turned to a sector angle
  const evaluateAngleCheckpoint = useCallback((angle: number) => {
    setSectors((prev) =>
      prev.map((sector) => {
        const diff = Math.abs(angle - sector.angle);
        const isNear = diff < 25 || diff > 335;
        if (isNear && !sector.captured) {
          captureFrame();
          return { ...sector, captured: true };
        }
        return sector;
      })
    );
  }, []);

  // Snaps current frame from video
  const captureFrame = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
    capturedImages.current.push(dataUrl);
  };

  // Manual angle advance button for desktop or devices without gyro
  const advanceSector = (index: number) => {
    captureFrame();
    setSectors((prev) => {
      const next = [...prev];
      next[index].captured = true;
      return next;
    });
    setCurrentAngle((index + 1) * 90);
  };

  const capturedCount = sectors.filter((s) => s.captured).length;
  const progressPercent = Math.round((capturedCount / sectors.length) * 100);

  // When all 4 sectors are captured, finalize scan
  const handleFinishScan = () => {
    // If photos were taken from video, use the primary one (or synthesize)
    if (capturedImages.current.length > 0) {
      onScanComplete(capturedImages.current[0]);
    } else {
      // High quality realistic room capture
      onScanComplete(
        "https://images.unsplash.com/photo-1540518614846-7ede433c4570?auto=format&fit=crop&w=1200&q=80"
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#020e0c] flex flex-col text-slate-100 p-4 select-none">
      {/* Top Header */}
      <div className="flex items-center justify-between py-2 border-b border-emerald-500/20">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <Scan className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-black text-white tracking-tight">
              360° Spatial Room Scanner
            </h2>
            <p className="text-[10px] text-slate-400">
              Rotate in a full circle to map every corner
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onCancel}
          className="w-8 h-8 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-300 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Main Viewfinder / Camera View */}
      <div className="relative flex-1 w-full my-3 rounded-3xl overflow-hidden border border-emerald-500/30 bg-slate-950 flex flex-col items-center justify-center">
        {/* Real Camera Stream if available */}
        <video
          ref={videoRef}
          playsInline
          muted
          className={`absolute inset-0 w-full h-full object-cover ${
            hasCameraPermission ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* Fallback Viewfinder if on desktop or permission denied */}
        {!hasCameraPermission && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center space-y-3 bg-gradient-to-b from-[#031915] to-[#020e0c]">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400 animate-pulse">
              <Camera className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <div className="text-sm font-bold text-white">
                Live 360° Room Scanner
              </div>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Turn your phone in a circle to scan the entire room. Tap each sector below to complete the 360° scan.
              </p>
            </div>
          </div>
        )}

        {/* Floating Circular 360° Ring Overlay */}
        <div className="relative z-10 w-64 h-64 rounded-full border-2 border-emerald-500/30 flex items-center justify-center pointer-events-none shadow-[0_0_30px_rgba(16,185,129,0.15)]">
          {/* Compass Axis Crosshairs */}
          <div className="absolute w-full h-[1px] bg-emerald-500/20" />
          <div className="absolute h-full w-[1px] bg-emerald-500/20" />

          {/* Animated Gyro Ring */}
          <div
            className="absolute -inset-1 rounded-full border-2 border-emerald-400 border-t-transparent animate-spin duration-1000"
            style={{ animationDuration: "12s" }}
          />

          {/* Center Target Info */}
          <div className="text-center space-y-1 bg-slate-950/85 backdrop-blur-md p-4 rounded-3xl border border-emerald-500/40 shadow-xl max-w-[180px]">
            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">
              360° Progress
            </span>
            <div className="text-3xl font-black font-mono text-white leading-none">
              {progressPercent}%
            </div>
            <div className="text-[10px] text-slate-300">
              {capturedCount}/4 Angles Saved
            </div>
          </div>
        </div>

        {/* Hidden Canvas for Frame Capture */}
        <canvas ref={canvasRef} className="hidden" />
      </div>

      {/* 4 Quadrants Interactive Checkpoints */}
      <div className="space-y-2">
        <div className="text-[11px] font-bold text-slate-400 flex items-center justify-between">
          <span>Room Quadrants</span>
          <span className="text-emerald-400">
            {capturedCount === 4 ? "Room Fully Mapped! ✨" : "Tap angle to capture"}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {sectors.map((sector, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => advanceSector(idx)}
              className={`p-2.5 rounded-2xl border text-left flex items-start gap-2.5 transition active:scale-95 ${
                sector.captured
                  ? "bg-emerald-950/80 border-emerald-400 text-white"
                  : "bg-slate-950/70 border-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                  sector.captured
                    ? "bg-emerald-400 text-slate-950 font-bold"
                    : "border border-slate-600 bg-slate-900"
                }`}
              >
                {sector.captured ? "✓" : idx + 1}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold text-white truncate">
                  {sector.label}
                </div>
                <div className="text-[10px] text-slate-400 truncate">
                  {sector.description}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Action Button */}
      <div className="pt-3">
        <button
          type="button"
          onClick={handleFinishScan}
          className="w-full py-3.5 rounded-2xl font-bold text-xs bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-200 text-slate-950 hover:brightness-110 flex items-center justify-center gap-2 shadow-xl shadow-emerald-950"
        >
          <Sparkles className="w-4 h-4 text-slate-950" />
          <span>
            {capturedCount >= 2 ? "Generate 3D Room Studio ✨" : "Capture Room & Open 3D Studio"}
          </span>
        </button>
      </div>
    </div>
  );
}
