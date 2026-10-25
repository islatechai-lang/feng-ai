"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import {
  RotateCcw,
  Sparkles,
  Maximize2,
  Eye,
  Layers,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  Move,
  CheckCircle2,
  Sliders,
  Box,
} from "lucide-react";
import { RoomType, Room3DScene, FurnitureItemType } from "@/types";

interface Room3DViewerProps {
  roomType?: RoomType;
  sceneData?: Room3DScene;
  onScoreChange?: (score: number) => void;
}

export function Room3DViewer({
  roomType = "bedroom",
  sceneData,
  onScoreChange,
}: Room3DViewerProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  // States
  const [layoutMode, setLayoutMode] = useState<"before" | "after">("after");
  const [cameraView, setCameraView] = useState<"orbit" | "top" | "door">("orbit");

  // Determine actual primary focal type
  const focalType: FurnitureItemType =
    sceneData?.primaryFocalType || (roomType === "living_room" ? "sofa" : roomType === "office" ? "desk" : "bed");

  const focalLabel =
    focalType === "sofa" ? "Living Room Sofa" : focalType === "desk" ? "Work Desk" : "Bed";

  const currentScore = layoutMode === "after" ? 94 : 52;

  // Three.js References
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const meshesRef = useRef<{
    focalGroup?: THREE.Group;
    secondaryGroup?: THREE.Group;
    plantGroup?: THREE.Group;
    chiParticles?: THREE.Points;
    shaBeam?: THREE.Line;
  }>({});

  // Touch and Mouse Interaction state
  const isPointerDownRef = useRef(false);
  const previousPointerPosRef = useRef({ x: 0, y: 0 });
  const cameraAngleRef = useRef({ theta: 0.8, phi: 0.6, radius: 11 });

  // Initialize Three.js Scene
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#020e0c");
    sceneRef.current = scene;

    const width = container.clientWidth || 360;
    const height = container.clientHeight || 380;
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.innerHTML = "";
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // ResizeObserver ensures canvas always fills container even on dynamic mobile layout
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const w = entry.contentRect.width;
        const h = entry.contentRect.height;
        if (w > 0 && h > 0 && cameraRef.current && rendererRef.current) {
          cameraRef.current.aspect = w / h;
          cameraRef.current.updateProjectionMatrix();
          rendererRef.current.setSize(w, h);
        }
      }
    });
    resizeObserver.observe(container);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xfff5ea, 1.2);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffeedd, 1.6);
    sunLight.position.set(6, 10, 5);
    sunLight.castShadow = true;
    scene.add(sunLight);

    const warmLamp = new THREE.PointLight(0xffaa44, 2.0, 8);
    warmLamp.position.set(-2.5, 2, -2.5);
    scene.add(warmLamp);

    // 1. Build Room Architecture (Floor, Walls, Doorway, Window)
    const roomSize = 7;
    const wallHeight = 3.6;

    // Hardwood Floor
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(roomSize, roomSize),
      new THREE.MeshStandardMaterial({ color: 0x241e17, roughness: 0.4 })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // Grid Floor Overlay
    const grid = new THREE.GridHelper(roomSize, 14, 0x10b981, 0x054637);
    grid.position.y = 0.01;
    scene.add(grid);

    // Far Back Wall (Z = -roomSize/2)
    const wallMat = new THREE.MeshStandardMaterial({ color: 0x132520, roughness: 0.8 });
    const backWall = new THREE.Mesh(new THREE.BoxGeometry(roomSize, wallHeight, 0.2), wallMat);
    backWall.position.set(0, wallHeight / 2, -roomSize / 2);
    backWall.receiveShadow = true;
    scene.add(backWall);

    // Left Wall with Window
    const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.2, wallHeight, roomSize), wallMat);
    leftWall.position.set(-roomSize / 2, wallHeight / 2, 0);
    leftWall.receiveShadow = true;
    scene.add(leftWall);

    // Window emitting daylight
    const windowGlass = new THREE.Mesh(
      new THREE.PlaneGeometry(2.2, 1.6),
      new THREE.MeshBasicMaterial({ color: 0xbae6fd, transparent: true, opacity: 0.75 })
    );
    windowGlass.rotation.y = Math.PI / 2;
    windowGlass.position.set(-roomSize / 2 + 0.18, 2.1, 0);
    scene.add(windowGlass);

    // Doorway Frame on Front Wall (Z = roomSize/2)
    const doorFrame = new THREE.Mesh(
      new THREE.BoxGeometry(1.4, 2.6, 0.2),
      new THREE.MeshStandardMaterial({ color: 0x064e3b })
    );
    doorFrame.position.set(0, 1.3, roomSize / 2);
    scene.add(doorFrame);

    const doorPanel = new THREE.Mesh(
      new THREE.BoxGeometry(1.2, 2.4, 0.05),
      new THREE.MeshStandardMaterial({ color: 0x047857 })
    );
    doorPanel.position.set(0.4, 1.2, roomSize / 2);
    doorPanel.rotation.y = -Math.PI / 4;
    scene.add(doorPanel);

    // Doorway Glowing Threshold
    const entranceThreshold = new THREE.Mesh(
      new THREE.PlaneGeometry(1.6, 0.6),
      new THREE.MeshBasicMaterial({ color: 0x10b981, transparent: true, opacity: 0.35 })
    );
    entranceThreshold.rotation.x = -Math.PI / 2;
    entranceThreshold.position.set(0, 0.02, roomSize / 2 - 0.3);
    scene.add(entranceThreshold);

    // 2. Build 3D Furniture strictly matching the ACTUAL detected furniture type
    const focalGroup = new THREE.Group();

    if (focalType === "sofa") {
      // 3D Living Room Sofa
      // Base cushion
      const sofaBase = new THREE.Mesh(
        new THREE.BoxGeometry(2.4, 0.45, 1.0),
        new THREE.MeshStandardMaterial({ color: 0x1e3a34, roughness: 0.7 })
      );
      sofaBase.position.y = 0.225;
      sofaBase.castShadow = true;
      focalGroup.add(sofaBase);

      // Backrest
      const sofaBack = new THREE.Mesh(
        new THREE.BoxGeometry(2.4, 0.65, 0.25),
        new THREE.MeshStandardMaterial({ color: 0x142c27, roughness: 0.7 })
      );
      sofaBack.position.set(0, 0.65, -0.375);
      focalGroup.add(sofaBack);

      // Left & Right Armrests
      const armMat = new THREE.MeshStandardMaterial({ color: 0x142c27 });
      const leftArm = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.5, 1.0), armMat);
      leftArm.position.set(-1.075, 0.45, 0);
      const rightArm = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.5, 1.0), armMat);
      rightArm.position.set(1.075, 0.45, 0);
      focalGroup.add(leftArm);
      focalGroup.add(rightArm);

      // Accent Pillows
      const pillowMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b });
      const p1 = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.35, 0.15), pillowMat);
      p1.position.set(-0.7, 0.55, -0.2);
      const p2 = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.35, 0.15), pillowMat);
      p2.position.set(0.7, 0.55, -0.2);
      focalGroup.add(p1);
      focalGroup.add(p2);
    } else if (focalType === "desk") {
      // 3D Office Workstation
      const deskTop = new THREE.Mesh(
        new THREE.BoxGeometry(2.0, 0.08, 1.0),
        new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.4 })
      );
      deskTop.position.y = 1.0;
      deskTop.castShadow = true;
      focalGroup.add(deskTop);

      // 4 Legs
      const legGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.96);
      const legMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.8 });
      [
        [-0.9, 0.48, -0.4],
        [0.9, 0.48, -0.4],
        [-0.9, 0.48, 0.4],
        [0.9, 0.48, 0.4],
      ].forEach(([lx, ly, lz]) => {
        const leg = new THREE.Mesh(legGeo, legMat);
        leg.position.set(lx, ly, lz);
        focalGroup.add(leg);
      });

      // Laptop / Monitors on Desk
      const laptop = new THREE.Mesh(
        new THREE.BoxGeometry(0.45, 0.02, 0.32),
        new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.85 })
      );
      laptop.position.set(0, 1.05, 0);
      focalGroup.add(laptop);

      // Office Ergonomic Chair
      const chairSeat = new THREE.Mesh(
        new THREE.BoxGeometry(0.55, 0.08, 0.55),
        new THREE.MeshStandardMaterial({ color: 0x0f766e })
      );
      chairSeat.position.set(0, 0.55, 0.65);
      focalGroup.add(chairSeat);

      const chairBack = new THREE.Mesh(
        new THREE.BoxGeometry(0.5, 0.65, 0.08),
        new THREE.MeshStandardMaterial({ color: 0x115e59 })
      );
      chairBack.position.set(0, 0.9, 0.9);
      focalGroup.add(chairBack);
    } else {
      // 3D Bedroom Bed
      const bedFrame = new THREE.Mesh(
        new THREE.BoxGeometry(2.0, 0.45, 2.4),
        new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.5 })
      );
      bedFrame.position.y = 0.225;
      bedFrame.castShadow = true;
      focalGroup.add(bedFrame);

      const headboard = new THREE.Mesh(
        new THREE.BoxGeometry(2.0, 1.3, 0.15),
        new THREE.MeshStandardMaterial({ color: 0x361602, roughness: 0.4 })
      );
      headboard.position.set(0, 0.65, -1.15);
      focalGroup.add(headboard);

      const mattress = new THREE.Mesh(
        new THREE.BoxGeometry(1.85, 0.35, 2.2),
        new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.7 })
      );
      mattress.position.set(0, 0.55, 0.05);
      focalGroup.add(mattress);

      const pillowMat = new THREE.MeshStandardMaterial({ color: 0xecfdf5 });
      const p1 = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.15, 0.45), pillowMat);
      p1.position.set(-0.45, 0.8, -0.75);
      const p2 = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.15, 0.45), pillowMat);
      p2.position.set(0.45, 0.8, -0.75);
      focalGroup.add(p1);
      focalGroup.add(p2);
    }

    scene.add(focalGroup);
    meshesRef.current.focalGroup = focalGroup;

    // 3. Living Jade Wealth Plant in Terracotta Pot
    const plantGroup = new THREE.Group();
    const pot = new THREE.Mesh(
      new THREE.CylinderGeometry(0.3, 0.22, 0.5, 16),
      new THREE.MeshStandardMaterial({ color: 0xc2410c, roughness: 0.7 })
    );
    pot.position.y = 0.25;
    plantGroup.add(pot);

    const leafMat = new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.3 });
    for (let i = 0; i < 9; i++) {
      const angle = (i / 9) * Math.PI * 2;
      const leaf = new THREE.Mesh(new THREE.SphereGeometry(0.2, 8, 8), leafMat);
      leaf.scale.set(1.2, 0.3, 0.8);
      leaf.position.set(Math.cos(angle) * 0.25, 0.6 + (i % 3) * 0.15, Math.sin(angle) * 0.25);
      leaf.rotation.z = Math.cos(angle) * 0.5;
      plantGroup.add(leaf);
    }

    plantGroup.position.set(-2.5, 0, -2.5); // Far-Left Wealth Corner
    scene.add(plantGroup);
    meshesRef.current.plantGroup = plantGroup;

    // 4. Chi Streams (Harmonious Sheng Chi green vs Harsh Sha Chi red)
    const particleCount = 180;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const t = i / particleCount;
      const x = Math.sin(t * Math.PI * 2) * 2.2;
      const z = 3.5 - t * 5.5;
      const y = 0.2 + Math.sin(t * Math.PI * 3) * 0.35;
      particlePositions[i * 3] = x;
      particlePositions[i * 3 + 1] = y;
      particlePositions[i * 3 + 2] = z;
    }

    particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
    const chiParticles = new THREE.Points(
      particleGeo,
      new THREE.PointsMaterial({
        color: 0x34d399,
        size: 0.16,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
      })
    );
    scene.add(chiParticles);
    meshesRef.current.chiParticles = chiParticles;

    // Harsh Red Sha Chi Laser Line
    const lineGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0.4, 3.5),
      new THREE.Vector3(0, 0.4, -2.5),
    ]);
    const shaBeam = new THREE.Line(
      lineGeo,
      new THREE.LineDashedMaterial({ color: 0xf43f5e, dashSize: 0.3, gapSize: 0.15, linewidth: 3 })
    );
    shaBeam.computeLineDistances();
    scene.add(shaBeam);
    meshesRef.current.shaBeam = shaBeam;

    // Animation loop
    let animId: number;
    let clock = new THREE.Clock();

    const updateCameraPos = () => {
      if (!cameraRef.current) return;
      const { theta, phi, radius } = cameraAngleRef.current;
      const clampedPhi = Math.max(0.1, Math.min(Math.PI / 2 - 0.05, phi));

      cameraRef.current.position.x = radius * Math.sin(clampedPhi) * Math.sin(theta);
      cameraRef.current.position.y = radius * Math.cos(clampedPhi);
      cameraRef.current.position.z = radius * Math.sin(clampedPhi) * Math.cos(theta);
      cameraRef.current.lookAt(0, 1.2, 0);
    };

    updateCameraPos();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Flow Chi particles
      if (chiParticles.geometry.attributes.position) {
        const positions = chiParticles.geometry.attributes.position.array as Float32Array;
        for (let i = 0; i < particleCount; i++) {
          positions[i * 3 + 1] = 0.2 + Math.sin(elapsedTime * 2 + i * 0.1) * 0.15;
        }
        chiParticles.geometry.attributes.position.needsUpdate = true;
      }

      // Pulse red Sha Chi beam
      if (shaBeam.material instanceof THREE.LineDashedMaterial) {
        shaBeam.material.opacity = 0.4 + Math.sin(elapsedTime * 4) * 0.4;
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      scene.clear();
    };
  }, [focalType]);

  // Animate furniture placement when toggling Before vs After
  useEffect(() => {
    const focal = meshesRef.current.focalGroup;
    const shaBeam = meshesRef.current.shaBeam;
    if (!focal) return;

    if (layoutMode === "after") {
      // Golden Command Position: Diagonal corner with solid wall backing
      focal.position.set(1.8, 0, -1.8);
      focal.rotation.y = focalType === "desk" ? -Math.PI / 4 : 0;
      if (shaBeam) shaBeam.visible = false;
    } else {
      // Scanned Inauspicious Position: Directly in doorway wind tunnel
      focal.position.set(0, 0, 0.6);
      focal.rotation.y = 0;
      if (shaBeam) shaBeam.visible = true;
    }

    if (onScoreChange) {
      onScoreChange(layoutMode === "after" ? 94 : 52);
    }
  }, [layoutMode, focalType, onScoreChange]);

  // Pointer drag for 360° orbit
  const handlePointerDown = (clientX: number, clientY: number) => {
    isPointerDownRef.current = true;
    previousPointerPosRef.current = { x: clientX, y: clientY };
  };

  const handlePointerMove = (clientX: number, clientY: number) => {
    if (!isPointerDownRef.current || !cameraRef.current) return;
    const deltaX = clientX - previousPointerPosRef.current.x;
    const deltaY = clientY - previousPointerPosRef.current.y;
    previousPointerPosRef.current = { x: clientX, y: clientY };

    cameraAngleRef.current.theta -= deltaX * 0.008;
    cameraAngleRef.current.phi += deltaY * 0.008;

    const { theta, phi, radius } = cameraAngleRef.current;
    const clampedPhi = Math.max(0.1, Math.min(Math.PI / 2 - 0.05, phi));

    cameraRef.current.position.x = radius * Math.sin(clampedPhi) * Math.sin(theta);
    cameraRef.current.position.y = radius * Math.cos(clampedPhi);
    cameraRef.current.position.z = radius * Math.sin(clampedPhi) * Math.cos(theta);
    cameraRef.current.lookAt(0, 1.2, 0);
  };

  const handlePointerUp = () => {
    isPointerDownRef.current = false;
  };

  const setCameraPreset = (preset: "orbit" | "top" | "door") => {
    setCameraView(preset);
    if (!cameraRef.current) return;

    if (preset === "top") {
      cameraAngleRef.current = { theta: 0, phi: 0.15, radius: 13 };
    } else if (preset === "door") {
      cameraAngleRef.current = { theta: 0, phi: 0.9, radius: 8 };
    } else {
      cameraAngleRef.current = { theta: 0.8, phi: 0.6, radius: 11 };
    }

    const { theta, phi, radius } = cameraAngleRef.current;
    cameraRef.current.position.x = radius * Math.sin(phi) * Math.sin(theta);
    cameraRef.current.position.y = radius * Math.cos(phi);
    cameraRef.current.position.z = radius * Math.sin(phi) * Math.cos(theta);
    cameraRef.current.lookAt(0, 1.2, 0);
  };

  return (
    <div className="space-y-3">
      {/* 3D Canvas Box - Explicit height ensures WebGL canvas never collapses */}
      <div className="relative w-full h-[380px] sm:h-[460px] rounded-3xl overflow-hidden border border-emerald-500/30 shadow-2xl bg-[#020e0c] touch-none">
        <div
          ref={mountRef}
          className="w-full h-full cursor-grab active:cursor-grabbing"
          onMouseDown={(e) => handlePointerDown(e.clientX, e.clientY)}
          onMouseMove={(e) => handlePointerMove(e.clientX, e.clientY)}
          onMouseUp={handlePointerUp}
          onMouseLeave={handlePointerUp}
          onTouchStart={(e) => handlePointerDown(e.touches[0].clientX, e.touches[0].clientY)}
          onTouchMove={(e) => handlePointerMove(e.touches[0].clientX, e.touches[0].clientY)}
          onTouchEnd={handlePointerUp}
        />

        {/* Top Floating HUD: Live Feng Shui Score */}
        <div className="absolute top-3 left-3 flex items-center gap-2 pointer-events-none">
          <div className="px-3 py-1.5 rounded-2xl bg-slate-950/85 backdrop-blur-md border border-emerald-500/40 shadow-xl flex items-center gap-2">
            <div
              className={`w-2.5 h-2.5 rounded-full ${
                currentScore >= 90 ? "bg-emerald-400 animate-pulse" : "bg-rose-500 animate-ping"
              }`}
            />
            <span className="text-[11px] font-bold text-white">
              Spatial Chi:{" "}
              <span
                className={`font-mono text-xs ${
                  currentScore >= 90 ? "text-emerald-400 font-bold" : "text-rose-400 font-bold"
                }`}
              >
                {currentScore}/100
              </span>
            </span>
          </div>
        </div>

        {/* Top Right: Preset Views */}
        <div className="absolute top-3 right-3 flex items-center gap-1">
          <button
            type="button"
            onClick={() => setCameraPreset("orbit")}
            className={`px-2.5 py-1 rounded-xl text-[10px] font-bold backdrop-blur-md transition ${
              cameraView === "orbit"
                ? "bg-emerald-500 text-slate-950 shadow"
                : "bg-slate-950/70 text-slate-300 border border-slate-700"
            }`}
          >
            360° Orbit
          </button>
          <button
            type="button"
            onClick={() => setCameraPreset("top")}
            className={`px-2.5 py-1 rounded-xl text-[10px] font-bold backdrop-blur-md transition ${
              cameraView === "top"
                ? "bg-emerald-500 text-slate-950 shadow"
                : "bg-slate-950/70 text-slate-300 border border-slate-700"
            }`}
          >
            Top-Down
          </button>
          <button
            type="button"
            onClick={() => setCameraPreset("door")}
            className={`px-2.5 py-1 rounded-xl text-[10px] font-bold backdrop-blur-md transition ${
              cameraView === "door"
                ? "bg-emerald-500 text-slate-950 shadow"
                : "bg-slate-950/70 text-slate-300 border border-slate-700"
            }`}
          >
            Door View
          </button>
        </div>

        {/* Bottom Center: Gesture instruction */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-slate-800 text-[10px] text-slate-300 pointer-events-none whitespace-nowrap flex items-center gap-1.5 shadow">
          <Move className="w-3 h-3 text-emerald-400" />
          <span>Swipe to rotate 360° • Pinch to zoom</span>
        </div>
      </div>

      {/* Interactive 3D Relayout Controls */}
      <div className="glass-panel p-4 rounded-3xl border border-emerald-500/25 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold text-white">
              3D Layout Simulator ({focalLabel}):
            </span>
          </div>
          <span className="text-[10px] font-mono text-emerald-300 font-bold">
            Live 3D Rearrange
          </span>
        </div>

        {/* 2 Toggle Modes */}
        <div className="grid grid-cols-2 gap-2">
          {/* Option 1: AI Harmonized (Command Position) */}
          <button
            type="button"
            onClick={() => setLayoutMode("after")}
            className={`p-3 rounded-2xl border text-left transition-all ${
              layoutMode === "after"
                ? "bg-emerald-950/80 border-emerald-400 text-white shadow-lg shadow-emerald-950"
                : "glass-pill text-slate-300 hover:text-white border-transparent"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-300">
                ✨ AI Harmonized
              </span>
              <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300">
                94 pts
              </span>
            </div>
            <p className="text-[10px] text-slate-300 mt-1 leading-snug">
              {focalLabel} anchored in diagonal Command Position with solid wall backing.
            </p>
          </button>

          {/* Option 2: Current Scanned (Inauspicious) */}
          <button
            type="button"
            onClick={() => setLayoutMode("before")}
            className={`p-3 rounded-2xl border text-left transition-all ${
              layoutMode === "before"
                ? "bg-rose-950/80 border-rose-500 text-white shadow-lg shadow-rose-950"
                : "glass-pill text-slate-300 hover:text-white border-transparent"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-rose-400">
                ⚠️ Scanned Layout
              </span>
              <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300">
                52 pts
              </span>
            </div>
            <p className="text-[10px] text-slate-300 mt-1 leading-snug">
              {focalLabel} in doorway rushing line. Sha Chi disturbs energy balance.
            </p>
          </button>
        </div>

        {/* Plain English Explanation */}
        <div className="p-3 rounded-2xl bg-slate-950/70 border border-emerald-500/15 flex items-start gap-2.5">
          {layoutMode === "after" ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div className="text-[11px] text-slate-200 leading-relaxed">
                <strong className="text-emerald-400 block mb-0.5">
                  Command Position Advantage:
                </strong>
                Your {focalLabel.toLowerCase()} is now positioned where you have a commanding view of the room entrance while your back is protected by a solid structural wall. The green Chi energy flows freely without obstruction.
              </div>
            </>
          ) : (
            <>
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div className="text-[11px] text-slate-200 leading-relaxed">
                <strong className="text-rose-400 block mb-0.5">
                  Energetic Flaw Detected:
                </strong>
                Notice the red Sha Chi laser beam cutting directly from the doorway into the {focalLabel.toLowerCase()}. This doorway wind creates continuous subconscious stress and fragments peaceful Chi.
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
