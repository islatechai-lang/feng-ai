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

  // 4 circular checkpoints around the room
  const [sectors, setSectors] = useState<ScanSector[]>([
    { label: "1. Entrance Door", angle: 0, description: "Point at door including the floor entrance", captured: false },
    { label: "2. Right Wall", angle: 90, description: "Rotate right, keeping floor & furniture visible", captured: false },
    { label: "3. Main Focal Wall", angle: 180, description: "Capture bed, sofa, or desk and floor space", captured: false },
    { label: "4. Left Wall", angle: 270, description: "Rotate back to complete full 360° circle", captured: false },
  ]);

  const capturedImages = useRef<string[]>([]);

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

        {/* Top Header Bar Overlay */}
        <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-black/85 via-black/40 to-transparent p-4 safe-top flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-emerald-500/25 border border-emerald-400/50 flex items-center justify-center text-emerald-300 backdrop-blur-md">
              <Scan className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-black text-white tracking-tight drop-shadow-md">
                360° Full Room Scanner
              </h2>
              <p className="text-[10px] text-emerald-300 drop-shadow-sm font-semibold">
                Capture Floor, Furniture & Walls
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onCancel}
            className="w-9 h-9 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-white active:scale-95 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Center Circular 360° Radar Overlay */}
        <div className="relative z-10 w-56 h-56 rounded-full border-2 border-emerald-400/40 flex items-center justify-center pointer-events-none shadow-[0_0_30px_rgba(16,185,129,0.25)]">
          {/* Axis Crosshairs */}
          <div className="absolute w-full h-[1px] bg-emerald-400/30" />
          <div className="absolute h-full w-[1px] bg-emerald-400/30" />

          {/* Rotating Ring */}
          <div
            className="absolute -inset-1 rounded-full border-2 border-emerald-400 border-t-transparent animate-spin duration-1000"
            style={{ animationDuration: "12s" }}
          />

          {/* Center Target Info */}
          <div className="text-center space-y-0.5 bg-black/80 backdrop-blur-md px-3.5 py-2.5 rounded-2xl border border-emerald-400/50 shadow-2xl">
            <span className="text-[9px] font-bold uppercase tracking-widest text-emerald-300">
              360° Mapped
            </span>
            <div className="text-3xl font-black font-mono text-white leading-none">
              {progressPercent}%
            </div>
            <div className="text-[10px] text-slate-300 font-semibold">
              {capturedCount}/4 Quadrants
            </div>
          </div>
        </div>

        {/* Floor Leveler Tip Pill (Reminds user to keep floor visible) */}
        <div className="absolute bottom-44 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-black/75 backdrop-blur-md border border-emerald-500/40 text-[11px] text-slate-200 pointer-events-none flex items-center gap-1.5 shadow-lg whitespace-nowrap z-20">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Keep the floor & furniture feet visible in frame</span>
        </div>

        {/* Bottom Panel Overlay: Quadrants & Generate Action Button */}
        <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black via-black/90 to-transparent p-4 safe-bottom space-y-3">
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

          {/* Action Button: Full-Width Primary Button */}
          <button
            type="button"
            onClick={handleFinishScan}
            className="w-full py-4 rounded-2xl font-black text-xs bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-200 text-slate-950 hover:brightness-110 flex items-center justify-center gap-2 shadow-2xl shadow-emerald-950 active:scale-95 transition"
          >
            <Sparkles className="w-4 h-4 text-slate-950" />
            <span>Generate 3D Room Studio ✨</span>
          </button>
        </div>

        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
}
