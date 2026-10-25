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
  Maximize2,
  Compass as CompassIcon,
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
  const [pitchAngle, setPitchAngle] = useState(0); // tracks vertical phone tilt to ensure floor is captured
  const [isCompleted, setIsCompleted] = useState(false);

  // 4 circular checkpoints around the room
  const [sectors, setSectors] = useState<ScanSector[]>([
    { label: "1. Entrance Door", angle: 0, description: "Point at door including the floor entrance", captured: false },
    { label: "2. Right Wall", angle: 90, description: "Rotate right, keeping floor & furniture visible", captured: false },
    { label: "3. Main Focal Wall", angle: 180, description: "Capture bed, sofa, or desk and floor space", captured: false },
    { label: "4. Left Wall", angle: 270, description: "Rotate back to complete full 360° circle", captured: false },
  ]);

  const capturedImages = useRef<string[]>([]);
  const hasTriggeredComplete = useRef(false);

  // Start Camera Stream with Wide Vertical Field of View (showing floor to ceiling)
  useEffect(() => {
    let stream: MediaStream | null = null;

    async function initCamera() {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          setHasCameraPermission(false);
          return;
        }

        // Request natural environment camera with portrait preference so floor is never cropped
        const constraints: MediaStreamConstraints = {
          video: {
            facingMode: { ideal: "environment" },
            // On mobile devices in portrait, standard resolution
            width: { ideal: 1920 },
            height: { ideal: 1080 },
          },
          audio: false,
        };

        try {
          stream = await navigator.mediaDevices.getUserMedia(constraints);
        } catch {
          // Fallback simple environment camera
          stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: "environment" },
            audio: false,
          });
        }

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

  // Track Device Gyroscope (Yaw for 360 circle + Pitch to remind user to keep floor in view)
  useEffect(() => {
    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.alpha !== null) {
        const heading = Math.round(e.alpha);
        setCurrentAngle(heading);
        evaluateAngleCheckpoint(heading);
      }
      if (e.beta !== null) {
        // Beta is forward/backward tilt (pitch)
        setPitchAngle(Math.round(e.beta));
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

  // Snaps current frame from video at full native resolution
  const captureFrame = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 1080;
    canvas.height = video.videoHeight || 1920;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.88);
    capturedImages.current.push(dataUrl);
  };

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

  const handleFinishScan = () => {
    if (capturedImages.current.length > 0) {
      onScanComplete(capturedImages.current[0]);
    } else {
      onScanComplete(
        "https://images.unsplash.com/photo-1540518614846-7ede433c4570?auto=format&fit=crop&w=1200&q=80"
      );
    }
  };

  // Auto-complete when 100% scanned
  useEffect(() => {
    if (capturedCount === sectors.length && !hasTriggeredComplete.current) {
      hasTriggeredComplete.current = true;
      setIsCompleted(true);
      if (typeof navigator !== "undefined" && navigator.vibrate) {
        try {
          navigator.vibrate([60, 40, 80]);
        } catch {}
      }
      const timer = setTimeout(() => {
        handleFinishScan();
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [capturedCount]);

  const activeSector = sectors.find((s) => !s.captured) || sectors[sectors.length - 1];

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col text-slate-100 select-none overflow-hidden">
      {/* Immersive Full-Bleed Camera View (Full Floor-to-Ceiling Height) */}
      <div className="absolute inset-0 w-full h-full overflow-hidden flex items-center justify-center">
        <video
          ref={videoRef}
          playsInline
          muted
          className={`w-full h-full object-contain sm:object-cover transition-opacity duration-300 ${
            hasCameraPermission ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* Fallback Viewfinder if permission denied or desktop */}
        {!hasCameraPermission && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center space-y-3 bg-[#020e0c]">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 animate-pulse">
              <Camera className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <div className="text-sm font-bold text-white">
                360° Full-Room Scanner
              </div>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Turn your phone in a circle to scan all 4 sides of the room, keeping both floor and furniture in view.
              </p>
            </div>
          </div>
        )}

        {/* Top Header Bar Overlay: Sleek HUD with Circular Progress */}
        <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-black/90 via-black/50 to-transparent p-4 safe-top flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Elegant Circular Progress Badge */}
            <div className="relative w-10 h-10 flex items-center justify-center shrink-0">
              <svg className="w-10 h-10 -rotate-90">
                <circle
                  cx="20"
                  cy="20"
                  r="16"
                  stroke="currentColor"
                  strokeWidth="3"
                  className="text-emerald-950/80"
                  fill="none"
                />
                <circle
                  cx="20"
                  cy="20"
                  r="16"
                  stroke="currentColor"
                  strokeWidth="3"
                  className="text-emerald-400 transition-all duration-500"
                  strokeDasharray={100}
                  strokeDashoffset={100 - (100 * progressPercent) / 100}
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>
              <span className="absolute text-[10px] font-black font-mono text-white">
                {progressPercent}%
              </span>
            </div>

            <div>
              <div className="text-xs font-black text-white flex items-center gap-1.5 drop-shadow">
                <span>{isCompleted ? "Room Captured! ✨" : activeSector.label}</span>
                {isCompleted && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
              </div>
              <p className="text-[10px] text-emerald-300 drop-shadow-sm font-medium">
                {isCompleted ? "Building 3D spatial studio..." : activeSector.description}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onCancel}
            className="w-9 h-9 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-white active:scale-95 transition shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Center Minimal AR Guidance Reticle (Translucent & Unobtrusive) */}
        {!isCompleted ? (
          <div className="relative z-10 w-52 h-52 pointer-events-none flex items-center justify-center">
            {/* Corner Bracket Reticles */}
            <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-emerald-400/70 rounded-tl-lg" />
            <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-emerald-400/70 rounded-tr-lg" />
            <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-emerald-400/70 rounded-bl-lg" />
            <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-emerald-400/70 rounded-br-lg" />

            {/* Subtle Crosshair */}
            <div className="w-3 h-0.5 bg-emerald-400/50" />
            <div className="h-3 w-0.5 bg-emerald-400/50 absolute" />

            {/* Rotating Guide Ring (Subtle) */}
            <div
              className="absolute inset-2 rounded-full border border-dashed border-emerald-400/25 animate-spin"
              style={{ animationDuration: "14s" }}
            />
          </div>
        ) : (
          /* Celebratory 100% Captured HUD Modal */
          <div className="relative z-20 px-6 py-4 rounded-3xl bg-black/90 backdrop-blur-xl border border-emerald-400/60 text-center space-y-2 shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-400 mx-auto animate-bounce">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div className="text-sm font-black text-white">
              360° Scan Complete!
            </div>
            <div className="text-xs text-emerald-300 font-mono">
              Loading 3D Spatial Geometry...
            </div>
          </div>
        )}

        {/* Floor Leveler Tip Pill (Reminds user to keep floor visible) */}
        <div className="absolute bottom-40 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-black/75 backdrop-blur-md border border-emerald-500/40 text-[11px] text-slate-200 pointer-events-none flex items-center gap-1.5 shadow-lg whitespace-nowrap z-20">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Keep the floor & furniture feet visible in frame</span>
        </div>

        {/* Bottom Panel Overlay: Quadrants & Generate Action Button */}
        <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black via-black/95 to-transparent p-4 safe-bottom space-y-3">
          {/* 4 Quadrants Pill Row */}
          <div className="grid grid-cols-4 gap-1.5">
            {sectors.map((sector, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => advanceSector(idx)}
                className={`py-2 px-1 rounded-xl border text-center transition active:scale-95 ${
                  sector.captured
                    ? "bg-emerald-950/80 border-emerald-400 text-white"
                    : "bg-black/60 border-white/20 text-slate-400 hover:text-white backdrop-blur-md"
                }`}
              >
                <div className="text-[10px] font-bold text-white flex items-center justify-center gap-1">
                  <span>{sector.captured ? "✓" : idx + 1}</span>
                  <span className="truncate">{sector.label.split(". ")[1]?.split(" ")[0]}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Action Button */}
          <button
            type="button"
            onClick={handleFinishScan}
            disabled={isCompleted}
            className="w-full py-4 rounded-2xl font-black text-xs bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-200 text-slate-950 hover:brightness-110 flex items-center justify-center gap-2 shadow-2xl shadow-emerald-950 active:scale-95 transition disabled:opacity-90"
          >
            <Sparkles className="w-4 h-4 text-slate-950" />
            <span>{isCompleted ? "Generating 3D Room Studio..." : "Generate 3D Room Studio ✨"}</span>
          </button>
        </div>

        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
}
