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
} from "lucide-react";
import { RoomType, CompassDirection } from "@/types";

interface Room3DViewerProps {
  roomType?: RoomType;
  initialMode?: "before" | "after";
  onScoreChange?: (score: number) => void;
}

export function Room3DViewer({
  roomType = "bedroom",
  initialMode = "after",
  onScoreChange,
}: Room3DViewerProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  // States
  const [layoutMode, setLayoutMode] = useState<"before" | "after">("after");
  const [selectedItem, setSelectedItem] = useState<"bed" | "desk" | "mirror" | "plant">("bed");
  const [bedPosition, setBedPosition] = useState<"door_line" | "command_diagonal" | "wall_side">("command_diagonal");
  const [showChiFlow, setShowChiFlow] = useState(true);
  const [cameraView, setCameraView] = useState<"orbit" | "top" | "door">("orbit");

  // Dynamic calculated score based on 3D furniture placement
  const calculateCurrentScore = (bedPos: string) => {
    if (bedPos === "command_diagonal") return 94;
    if (bedPos === "wall_side") return 78;
    return 54; // door_line (coffin position)
  };

  const currentScore = calculateCurrentScore(bedPosition);

  // Three.js References
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const objectsRef = useRef<{
    bed?: THREE.Group;
    desk?: THREE.Group;
    mirror?: THREE.Group;
    plant?: THREE.Group;
    chiParticles?: THREE.Points;
    shaChiBeam?: THREE.Line;
  }>({});

  // Touch and Mouse Interaction state
  const isPointerDownRef = useRef(false);
  const previousPointerPosRef = useRef({ x: 0, y: 0 });
  const cameraAngleRef = useRef({ theta: 0.8, phi: 0.6, radius: 11 });

  // Initialize Three.js Scene
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#020e0c");
    sceneRef.current = scene;

    // Camera
    const width = container.clientWidth;
    const height = container.clientHeight;
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.innerHTML = "";
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xfff5ea, 1.2);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffeedd, 1.6);
    sunLight.position.set(6, 10, 5);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    scene.add(sunLight);

    // Warm Bedside Lamp Point Light
    const warmLamp = new THREE.PointLight(0xffaa44, 2.2, 8);
    warmLamp.position.set(-2.5, 2, -2.5);
    scene.add(warmLamp);

    // 1. Build Room Shell (Floor, Walls, Door, Window)
    const roomSize = 7;
    const wallHeight = 3.6;

    // Floor
    const floorGeo = new THREE.PlaneGeometry(roomSize, roomSize);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x241e17, // Warm dark oak
      roughness: 0.4,
      metalness: 0.1,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // Subtle Baseboard / Grid
    const grid = new THREE.GridHelper(roomSize, 14, 0x10b981, 0x054637);
    grid.position.y = 0.01;
    scene.add(grid);

    // Back Wall (Far Wall - Z = -roomSize/2)
    const wallMat = new THREE.MeshStandardMaterial({ color: 0x132520, roughness: 0.8 });
    const backWall = new THREE.Mesh(new THREE.BoxGeometry(roomSize, wallHeight, 0.2), wallMat);
    backWall.position.set(0, wallHeight / 2, -roomSize / 2);
    backWall.receiveShadow = true;
    scene.add(backWall);

    // Left Wall (X = -roomSize/2)
    const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.2, wallHeight, roomSize), wallMat);
    leftWall.position.set(-roomSize / 2, wallHeight / 2, 0);
    leftWall.receiveShadow = true;
    scene.add(leftWall);

    // Window on Left Wall (Emits natural daylight)
    const windowFrame = new THREE.Mesh(
      new THREE.BoxGeometry(0.25, 1.8, 2.4),
      new THREE.MeshStandardMaterial({ color: 0x334155 })
    );
    windowFrame.position.set(-roomSize / 2 + 0.05, 2.1, 0);
    scene.add(windowFrame);

    const windowGlass = new THREE.Mesh(
      new THREE.PlaneGeometry(2.2, 1.6),
      new THREE.MeshBasicMaterial({ color: 0xbae6fd, transparent: true, opacity: 0.75 })
    );
    windowGlass.rotation.y = Math.PI / 2;
    windowGlass.position.set(-roomSize / 2 + 0.18, 2.1, 0);
    scene.add(windowGlass);

    // Doorway Frame on Front Wall (Entrance at Z = roomSize/2, X = 0)
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
    doorPanel.rotation.y = -Math.PI / 4; // Open door welcoming Chi
    scene.add(doorPanel);

    // Doorway "Entrance" glowing threshold
    const entranceThreshold = new THREE.Mesh(
      new THREE.PlaneGeometry(1.6, 0.6),
      new THREE.MeshBasicMaterial({ color: 0x10b981, transparent: true, opacity: 0.35 })
    );
    entranceThreshold.rotation.x = -Math.PI / 2;
    entranceThreshold.position.set(0, 0.02, roomSize / 2 - 0.3);
    scene.add(entranceThreshold);

    // 2. Build 3D Furniture Groups
    // A. Bed Group (Wooden frame, headboard, mattress, pillows)
    const bedGroup = new THREE.Group();
    const bedFrame = new THREE.Mesh(
      new THREE.BoxGeometry(2.0, 0.45, 2.4),
      new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.5 })
    );
    bedFrame.position.y = 0.225;
    bedFrame.castShadow = true;
    bedFrame.receiveShadow = true;
    bedGroup.add(bedFrame);

    // Solid Headboard
    const headboard = new THREE.Mesh(
      new THREE.BoxGeometry(2.0, 1.3, 0.15),
      new THREE.MeshStandardMaterial({ color: 0x361602, roughness: 0.4 })
    );
    headboard.position.set(0, 0.65, -1.15);
    headboard.castShadow = true;
    bedGroup.add(headboard);

    // Mattress (Crisp linen white)
    const mattress = new THREE.Mesh(
      new THREE.BoxGeometry(1.85, 0.35, 2.2),
      new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.7 })
    );
    mattress.position.set(0, 0.55, 0.05);
    mattress.castShadow = true;
    bedGroup.add(mattress);

    // 2 Pillows
    const pillowMat = new THREE.MeshStandardMaterial({ color: 0xecfdf5, roughness: 0.6 });
    const pillow1 = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.15, 0.45), pillowMat);
    pillow1.position.set(-0.45, 0.8, -0.75);
    const pillow2 = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.15, 0.45), pillowMat);
    pillow2.position.set(0.45, 0.8, -0.75);
    bedGroup.add(pillow1);
    bedGroup.add(pillow2);

    // Duvet blanket (Emerald accent)
    const blanket = new THREE.Mesh(
      new THREE.BoxGeometry(1.86, 0.12, 1.4),
      new THREE.MeshStandardMaterial({ color: 0x065f46, roughness: 0.5 })
    );
    blanket.position.set(0, 0.72, 0.45);
    bedGroup.add(blanket);

    scene.add(bedGroup);
    objectsRef.current.bed = bedGroup;

    // B. Desk & Chair Group
    const deskGroup = new THREE.Group();
    const deskTop = new THREE.Mesh(
      new THREE.BoxGeometry(1.8, 0.1, 0.9),
      new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.5 })
    );
    deskTop.position.y = 1.0;
    deskTop.castShadow = true;
    deskGroup.add(deskTop);

    // Desk Legs
    const legGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.95);
    const legMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8 });
    const legOffsets = [
      [-0.8, 0.475, -0.35],
      [0.8, 0.475, -0.35],
      [-0.8, 0.475, 0.35],
      [0.8, 0.475, 0.35],
    ];
    legOffsets.forEach(([lx, ly, lz]) => {
      const leg = new THREE.Mesh(legGeo, legMat);
      leg.position.set(lx, ly, lz);
      deskGroup.add(leg);
    });

    // Laptop on Desk
    const laptop = new THREE.Mesh(
      new THREE.BoxGeometry(0.4, 0.02, 0.3),
      new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.9 })
    );
    laptop.position.set(0, 1.06, 0);
    deskGroup.add(laptop);

    deskGroup.position.set(2.2, 0, 1.2);
    deskGroup.rotation.y = -Math.PI / 4;
    scene.add(deskGroup);
    objectsRef.current.desk = deskGroup;

    // C. Vanity Full-Length Mirror
    const mirrorGroup = new THREE.Group();
    const mirrorFrame = new THREE.Mesh(
      new THREE.BoxGeometry(0.9, 1.8, 0.08),
      new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.3 })
    );
    mirrorFrame.position.y = 1.0;
    mirrorGroup.add(mirrorFrame);

    const mirrorGlass = new THREE.Mesh(
      new THREE.PlaneGeometry(0.75, 1.65),
      new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.05, metalness: 0.95 })
    );
    mirrorGlass.position.set(0, 1.0, 0.05);
    mirrorGroup.add(mirrorGlass);

    mirrorGroup.position.set(-3.2, 0, 1.8);
    mirrorGroup.rotation.y = Math.PI / 2;
    scene.add(mirrorGroup);
    objectsRef.current.mirror = mirrorGroup;

    // D. Jade Wealth Plant in Terracotta Pot
    const plantGroup = new THREE.Group();
    const pot = new THREE.Mesh(
      new THREE.CylinderGeometry(0.3, 0.22, 0.5, 16),
      new THREE.MeshStandardMaterial({ color: 0xc2410c, roughness: 0.7 })
    );
    pot.position.y = 0.25;
    plantGroup.add(pot);

    // Leaves
    const leafMat = new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.3 });
    for (let i = 0; i < 9; i++) {
      const angle = (i / 9) * Math.PI * 2;
      const leaf = new THREE.Mesh(new THREE.SphereGeometry(0.2, 8, 8), leafMat);
      leaf.scale.set(1.2, 0.3, 0.8);
      leaf.position.set(Math.cos(angle) * 0.25, 0.6 + (i % 3) * 0.15, Math.sin(angle) * 0.25);
      leaf.rotation.z = Math.cos(angle) * 0.5;
      leaf.rotation.x = Math.sin(angle) * 0.5;
      plantGroup.add(leaf);
    }

    plantGroup.position.set(-2.5, 0, -2.5); // Far-Left Wealth Corner
    scene.add(plantGroup);
    objectsRef.current.plant = plantGroup;

    // 3. 3D Chi Flow Energy Streams (Harmonious green vs Sha Chi red)
    // A. Harmonious Sheng Chi Particles
    const particleCount = 180;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleAlphas = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const t = i / particleCount;
      // Curved flowing path from entrance (0, 0.2, 3.5) curling gracefully across the room
      const x = Math.sin(t * Math.PI * 2) * 2.2;
      const z = 3.5 - t * 5.5;
      const y = 0.2 + Math.sin(t * Math.PI * 3) * 0.35;

      particlePositions[i * 3] = x;
      particlePositions[i * 3 + 1] = y;
      particlePositions[i * 3 + 2] = z;
      particleAlphas[i] = Math.random();
    }

    particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x34d399,
      size: 0.16,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });
    const chiParticles = new THREE.Points(particleGeo, particleMat);
    scene.add(chiParticles);
    objectsRef.current.chiParticles = chiParticles;

    // B. Harsh Direct Sha Chi Red Laser (Wind tunnel from doorway)
    const lineMat = new THREE.LineDashedMaterial({
      color: 0xf43f5e,
      dashSize: 0.3,
      gapSize: 0.15,
      linewidth: 3,
    });
    const lineGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0.4, 3.5),
      new THREE.Vector3(0, 0.4, -2.5),
    ]);
    const shaChiBeam = new THREE.Line(lineGeo, lineMat);
    shaChiBeam.computeLineDistances();
    scene.add(shaChiBeam);
    objectsRef.current.shaChiBeam = shaChiBeam;

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

      // Animate Chi particles flowing in waves
      if (chiParticles.geometry.attributes.position) {
        const positions = chiParticles.geometry.attributes.position.array as Float32Array;
        for (let i = 0; i < particleCount; i++) {
          positions[i * 3 + 1] = 0.2 + Math.sin(elapsedTime * 2 + i * 0.1) * 0.15;
        }
        chiParticles.geometry.attributes.position.needsUpdate = true;
      }

      // Pulse red Sha Chi beam
      if (shaChiBeam.material instanceof THREE.LineDashedMaterial) {
        shaChiBeam.material.opacity = 0.4 + Math.sin(elapsedTime * 4) * 0.4;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Resize handler
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
  }, []);

  // Update Bed and Furniture Position when state changes
  useEffect(() => {
    const bed = objectsRef.current.bed;
    const shaBeam = objectsRef.current.shaChiBeam;
    if (!bed) return;

    if (bedPosition === "command_diagonal") {
      // Golden Command Position: Far-Right wall diagonal to door, head against solid wall
      bed.position.set(1.8, 0, -1.8);
      bed.rotation.y = 0;
      if (shaBeam) shaBeam.visible = false;
    } else if (bedPosition === "door_line") {
      // Deadly Coffin Position: Straight in line with entrance door!
      bed.position.set(0, 0, 0.4);
      bed.rotation.y = 0;
      if (shaBeam) shaBeam.visible = true;
    } else {
      // Side Wall
      bed.position.set(-1.8, 0, -1.8);
      bed.rotation.y = 0;
      if (shaBeam) shaBeam.visible = false;
    }

    if (onScoreChange) {
      onScoreChange(calculateCurrentScore(bedPosition));
    }
  }, [bedPosition, onScoreChange]);

  // Pointer Drag handlers for touch & mouse 360° orbit
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

  // Quick camera presets
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
      {/* 3D Canvas Box */}
      <div className="relative w-full aspect-[4/3] sm:aspect-video rounded-3xl overflow-hidden border border-emerald-500/30 shadow-2xl bg-[#020e0c] touch-none">
        {/* Three.js Container */}
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
                  currentScore >= 90 ? "text-emerald-400" : "text-rose-400"
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
              Try Moving the Bed in 3D:
            </span>
          </div>
          <span className="text-[10px] font-mono text-slate-400">
            Interactive Simulator
          </span>
        </div>

        {/* 3 Positions User can test */}
        <div className="grid grid-cols-2 gap-2">
          {/* Position 1: Golden Command Position */}
          <button
            type="button"
            onClick={() => setBedPosition("command_diagonal")}
            className={`p-3 rounded-2xl border text-left transition-all ${
              bedPosition === "command_diagonal"
                ? "bg-emerald-950/80 border-emerald-400 text-white shadow-lg shadow-emerald-950"
                : "glass-pill text-slate-300 hover:text-white border-transparent"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-300">
                ✨ Command Position
              </span>
              <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300">
                94 pts
              </span>
            </div>
            <p className="text-[10px] text-slate-300 mt-1 leading-snug">
              Diagonal from door with solid supportive wall behind headboard.
            </p>
          </button>

          {/* Position 2: Coffin Position (Direct Line) */}
          <button
            type="button"
            onClick={() => setBedPosition("door_line")}
            className={`p-3 rounded-2xl border text-left transition-all ${
              bedPosition === "door_line"
                ? "bg-rose-950/80 border-rose-500 text-white shadow-lg shadow-rose-950"
                : "glass-pill text-slate-300 hover:text-white border-transparent"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-rose-400">
                ⚠️ Coffin Position
              </span>
              <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300">
                54 pts
              </span>
            </div>
            <p className="text-[10px] text-slate-300 mt-1 leading-snug">
              Feet point right out the door. Direct Sha Chi strikes during sleep.
            </p>
          </button>
        </div>

        {/* Plain English Explanation of what just happened in 3D */}
        <div className="p-3 rounded-2xl bg-slate-950/70 border border-emerald-500/15 flex items-start gap-2.5">
          {bedPosition === "command_diagonal" ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div className="text-[11px] text-slate-200 leading-relaxed">
                <strong className="text-emerald-400 block mb-0.5">
                  Why this layout works:
                </strong>
                You can immediately see the entrance door without neck strain, while your head is guarded by a solid wall. The green Chi energy particles circulate smoothly without striking your body.
              </div>
            </>
          ) : (
            <>
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div className="text-[11px] text-slate-200 leading-relaxed">
                <strong className="text-rose-400 block mb-0.5">
                  The Problem:
                </strong>
                Notice the red laser beam rushing directly through the open doorway right into the bed. In classical Feng Shui, this is the "Coffin Line" — causing nocturnal awakenings and elevated cortisol.
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
