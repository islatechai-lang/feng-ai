"use client";

import { useEffect, useRef, useState, useMemo } from "react";
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
  Compass,
  Check,
  X,
  Info,
} from "lucide-react";
import { RoomType, Room3DScene, FurnitureItemType, SceneItem3D } from "@/types";

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

  // Layout mode state
  const [layoutMode, setLayoutMode] = useState<"before" | "after">("after");
  const [cameraView, setCameraView] = useState<"orbit" | "top" | "door">("orbit");
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  // Dynamic Room Items
  const items: SceneItem3D[] = useMemo(() => {
    if (sceneData?.detectedItems && sceneData.detectedItems.length > 0) {
      return sceneData.detectedItems;
    }
    // Procedural fallback if no items in sceneData
    if (roomType === "living_room") {
      return [
        {
          id: "item_sofa",
          label: "Living Room Sofa",
          type: "sofa",
          color: "#475569",
          initialPos: { x: 0, y: 0, z: 0.6, rotY: 0 },
          rearrangedPos: { x: 1.8, y: 0, z: -1.6, rotY: 0 },
          status: "inauspicious",
          issue: "Back exposed to doorway, disturbing restful Chi",
          fixReason: "Relocated diagonally against solid wall in Command Position",
        },
        {
          id: "item_coffee",
          label: "Coffee Table",
          type: "coffee_table",
          color: "#92400e",
          initialPos: { x: 0, y: 0, z: -0.6, rotY: 0 },
          rearrangedPos: { x: 1.8, y: 0, z: -0.4, rotY: 0 },
          status: "neutral",
          fixReason: "Centered with sofa to ground central Tai Chi",
        },
        {
          id: "item_tv",
          label: "Media Console & TV",
          type: "tv_unit",
          color: "#1e293b",
          initialPos: { x: -3.0, y: 0, z: 0, rotY: Math.PI / 2 },
          rearrangedPos: { x: -3.0, y: 0, z: -0.6, rotY: Math.PI / 2 },
          status: "neutral",
          fixReason: "Positioned along side wall to eliminate glare and balance room polarity",
        },
        {
          id: "item_plant",
          label: "Jade Wealth Plant",
          type: "plant",
          color: "#15803d",
          initialPos: { x: 2.2, y: 0, z: 2.2, rotY: 0 },
          rearrangedPos: { x: -2.4, y: 0, z: -2.4, rotY: 0 },
          status: "inauspicious",
          issue: "Trapped in doorway corner path",
          fixReason: "Placed in Far-Left Wealth corner to lift corner Chi",
        },
      ];
    } else if (roomType === "office") {
      return [
        {
          id: "item_desk",
          label: "Executive Work Desk",
          type: "desk",
          color: "#78350f",
          initialPos: { x: 0, y: 0, z: -2.4, rotY: Math.PI },
          rearrangedPos: { x: 1.6, y: 0, z: -1.6, rotY: -Math.PI / 4 },
          status: "inauspicious",
          issue: "Back exposed to door, causing vulnerability and stress",
          fixReason: "Angled in Command Position facing door with solid wall backing",
        },
        {
          id: "item_bookshelf",
          label: "Bookshelf & Cabinet",
          type: "bookshelf",
          color: "#334155",
          initialPos: { x: -2.8, y: 0, z: 1.0, rotY: Math.PI / 2 },
          rearrangedPos: { x: -2.8, y: 0, z: -0.5, rotY: Math.PI / 2 },
          status: "harmonious",
          fixReason: "Grounded along West wall to foster knowledge and focus",
        },
        {
          id: "item_plant",
          label: "Air-Purifying Desk Plant",
          type: "plant",
          color: "#15803d",
          initialPos: { x: 1.5, y: 0, z: 2.2, rotY: 0 },
          rearrangedPos: { x: -2.4, y: 0, z: -2.4, rotY: 0 },
          status: "harmonious",
          fixReason: "Filters electromagnetic radiation from screens and uplifts Wood element",
        },
      ];
    } else {
      return [
        {
          id: "item_bed",
          label: "Master Bed",
          type: "bed",
          color: "#451a03",
          initialPos: { x: 0, y: 0, z: 0.5, rotY: 0 },
          rearrangedPos: { x: 1.8, y: 0, z: -1.8, rotY: 0 },
          status: "inauspicious",
          issue: "In 'Coffin Position' directly in line with doorway",
          fixReason: "Moved diagonally opposite entrance with solid Mountain backing",
        },
        {
          id: "item_nightstand",
          label: "Nightstand & Lamp",
          type: "nightstand",
          color: "#78350f",
          initialPos: { x: -1.3, y: 0, z: 0.5, rotY: 0 },
          rearrangedPos: { x: 0.5, y: 0, z: -1.8, rotY: 0 },
          status: "harmonious",
          fixReason: "Flanks bed to balance Yin-Yang symmetry",
        },
        {
          id: "item_plant",
          label: "Jade Wealth Plant",
          type: "plant",
          color: "#15803d",
          initialPos: { x: 2.4, y: 0, z: 2.2, rotY: 0 },
          rearrangedPos: { x: -2.4, y: 0, z: -2.4, rotY: 0 },
          status: "harmonious",
          fixReason: "Placed in Far-Left Wealth corner to cleanse air and attract prosperity",
        },
      ];
    }
  }, [sceneData, roomType]);

  const selectedItem = useMemo(() => {
    return items.find((i) => i.id === selectedItemId) || items[0] || null;
  }, [items, selectedItemId]);

  const currentScore = layoutMode === "after" ? 94 : 52;

  // Three.js References
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const itemMeshesRef = useRef<
    Array<{
      id: string;
      group: THREE.Group;
      statusRing: THREE.Mesh;
      initialPos: { x: number; y: number; z: number; rotY?: number };
      rearrangedPos: { x: number; y: number; z: number; rotY?: number };
      status: "inauspicious" | "harmonious" | "neutral";
    }>
  >([]);
  const shaBeamRef = useRef<THREE.Line | null>(null);
  const chiParticlesRef = useRef<THREE.Points | null>(null);

  // Pointer & Camera Orbit State
  const isPointerDownRef = useRef(false);
  const pointerStartRef = useRef({ x: 0, y: 0 });
  const hasMovedRef = useRef(false);
  const cameraAngleRef = useRef({ theta: 0.8, phi: 0.65, radius: 11 });

  // Initialize Three.js Scene
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#020e0c");
    sceneRef.current = scene;

    const width = container.clientWidth || 360;
    const height = container.clientHeight || 380;
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.innerHTML = "";
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // ResizeObserver keeps canvas sharp across all screen sizes
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

    // Warm Ambient and Directional Lighting
    const ambientLight = new THREE.AmbientLight(0xfff5ea, 1.3);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffeedd, 1.8);
    sunLight.position.set(6, 11, 5);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    scene.add(sunLight);

    const warmAccent = new THREE.PointLight(0xffaa44, 1.8, 8);
    warmAccent.position.set(-2.5, 2.5, -2.5);
    scene.add(warmAccent);

    // 1. Build Room Shell (Floor, Walls, Door, Window)
    const roomSize = 7.0;
    const wallHeight = 3.4;

    // Floor (Rich Wood tone)
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(roomSize, roomSize),
      new THREE.MeshStandardMaterial({
        color: sceneData?.floorMaterial === "tile" ? 0x334155 : 0x221a13,
        roughness: 0.45,
      })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // Subtle Feng Shui Floor Grid
    const grid = new THREE.GridHelper(roomSize, 14, 0x10b981, 0x054637);
    grid.position.y = 0.01;
    scene.add(grid);

    // Back Wall (Z = -roomSize/2)
    const wallColor = 0x12231e;
    const wallMat = new THREE.MeshStandardMaterial({ color: wallColor, roughness: 0.85 });
    const backWall = new THREE.Mesh(new THREE.BoxGeometry(roomSize, wallHeight, 0.18), wallMat);
    backWall.position.set(0, wallHeight / 2, -roomSize / 2);
    backWall.receiveShadow = true;
    scene.add(backWall);

    // Left Wall with Window (X = -roomSize/2)
    const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.18, wallHeight, roomSize), wallMat);
    leftWall.position.set(-roomSize / 2, wallHeight / 2, 0);
    leftWall.receiveShadow = true;
    scene.add(leftWall);

    // Glowing Sunlight Window
    const windowGlass = new THREE.Mesh(
      new THREE.PlaneGeometry(2.4, 1.6),
      new THREE.MeshBasicMaterial({ color: 0xbae6fd, transparent: true, opacity: 0.8 })
    );
    windowGlass.rotation.y = Math.PI / 2;
    windowGlass.position.set(-roomSize / 2 + 0.12, 2.1, 0);
    scene.add(windowGlass);

    // Front Wall with Entrance Doorway (Z = roomSize/2)
    const doorX = sceneData?.door?.x ?? 0;
    const doorFrame = new THREE.Mesh(
      new THREE.BoxGeometry(1.4, 2.6, 0.2),
      new THREE.MeshStandardMaterial({ color: 0x064e3b })
    );
    doorFrame.position.set(doorX, 1.3, roomSize / 2);
    scene.add(doorFrame);

    const doorPanel = new THREE.Mesh(
      new THREE.BoxGeometry(1.2, 2.4, 0.05),
      new THREE.MeshStandardMaterial({ color: 0x047857 })
    );
    doorPanel.position.set(doorX + 0.4, 1.2, roomSize / 2);
    doorPanel.rotation.y = -Math.PI / 4;
    scene.add(doorPanel);

    // Entrance Glowing Threshold
    const entranceThreshold = new THREE.Mesh(
      new THREE.PlaneGeometry(1.6, 0.6),
      new THREE.MeshBasicMaterial({ color: 0x10b981, transparent: true, opacity: 0.4 })
    );
    entranceThreshold.rotation.x = -Math.PI / 2;
    entranceThreshold.position.set(doorX, 0.02, roomSize / 2 - 0.3);
    scene.add(entranceThreshold);

    // 2. Procedural Mesh Builders for All Detected Furniture
    const buildItemMesh = (item: SceneItem3D): THREE.Group => {
      const group = new THREE.Group();
      group.name = item.id;

      const itemHex = parseInt((item.color || "#475569").replace("#", "0x"), 16) || 0x475569;
      const primaryMat = new THREE.MeshStandardMaterial({ color: itemHex, roughness: 0.6 });

      if (item.type === "sofa") {
        // Sofa Base
        const base = new THREE.Mesh(new THREE.BoxGeometry(2.3, 0.45, 1.0), primaryMat);
        base.position.y = 0.225;
        base.castShadow = true;
        group.add(base);

        // Sofa Backrest
        const back = new THREE.Mesh(
          new THREE.BoxGeometry(2.3, 0.65, 0.24),
          new THREE.MeshStandardMaterial({ color: itemHex, roughness: 0.7 })
        );
        back.position.set(0, 0.65, -0.38);
        group.add(back);

        // Left & Right Arms
        const armMat = new THREE.MeshStandardMaterial({ color: itemHex, roughness: 0.7 });
        const leftArm = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.5, 1.0), armMat);
        leftArm.position.set(-1.03, 0.45, 0);
        const rightArm = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.5, 1.0), armMat);
        rightArm.position.set(1.03, 0.45, 0);
        group.add(leftArm);
        group.add(rightArm);

        // Golden Accent Pillows
        const pillowMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b });
        const p1 = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.35, 0.14), pillowMat);
        p1.position.set(-0.7, 0.55, -0.2);
        const p2 = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.35, 0.14), pillowMat);
        p2.position.set(0.7, 0.55, -0.2);
        group.add(p1);
        group.add(p2);
      } else if (item.type === "bed") {
        // Wooden Bed Frame
        const frame = new THREE.Mesh(
          new THREE.BoxGeometry(2.0, 0.45, 2.3),
          new THREE.MeshStandardMaterial({ color: 0x3d1a04, roughness: 0.5 })
        );
        frame.position.y = 0.225;
        frame.castShadow = true;
        group.add(frame);

        // Tall Headboard
        const headboard = new THREE.Mesh(
          new THREE.BoxGeometry(2.0, 1.3, 0.15),
          new THREE.MeshStandardMaterial({ color: 0x2e1201, roughness: 0.4 })
        );
        headboard.position.set(0, 0.65, -1.1);
        group.add(headboard);

        // White Mattress & Duvet
        const mattress = new THREE.Mesh(
          new THREE.BoxGeometry(1.85, 0.35, 2.1),
          new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.8 })
        );
        mattress.position.set(0, 0.55, 0.05);
        group.add(mattress);

        // Sleeping Pillows
        const pillowMat = new THREE.MeshStandardMaterial({ color: 0xecfdf5 });
        const p1 = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.14, 0.42), pillowMat);
        p1.position.set(-0.45, 0.8, -0.7);
        const p2 = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.14, 0.42), pillowMat);
        p2.position.set(0.45, 0.8, -0.7);
        group.add(p1);
        group.add(p2);
      } else if (item.type === "desk") {
        // Executive Desk Top
        const top = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.08, 0.95), primaryMat);
        top.position.y = 0.96;
        top.castShadow = true;
        group.add(top);

        // Metal Legs
        const legGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.92);
        const legMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.85 });
        [
          [-0.85, 0.46, -0.38],
          [0.85, 0.46, -0.38],
          [-0.85, 0.46, 0.38],
          [0.85, 0.46, 0.38],
        ].forEach(([lx, ly, lz]) => {
          const leg = new THREE.Mesh(legGeo, legMat);
          leg.position.set(lx, ly, lz);
          group.add(leg);
        });

        // Laptop on Desk
        const laptop = new THREE.Mesh(
          new THREE.BoxGeometry(0.42, 0.02, 0.3),
          new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.9 })
        );
        laptop.position.set(0, 1.01, 0);
        group.add(laptop);

        // Ergonomic Chair
        const seat = new THREE.Mesh(
          new THREE.BoxGeometry(0.55, 0.08, 0.55),
          new THREE.MeshStandardMaterial({ color: 0x0f766e })
        );
        seat.position.set(0, 0.52, 0.65);
        group.add(seat);

        const chairBack = new THREE.Mesh(
          new THREE.BoxGeometry(0.5, 0.6, 0.08),
          new THREE.MeshStandardMaterial({ color: 0x115e59 })
        );
        chairBack.position.set(0, 0.85, 0.9);
        group.add(chairBack);
      } else if (item.type === "tv_unit" || item.type === "tv_stand") {
        // Media Console Cabinet
        const cabinet = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.45, 0.45), primaryMat);
        cabinet.position.y = 0.225;
        cabinet.castShadow = true;
        group.add(cabinet);

        // Flat OLED TV Screen
        const screen = new THREE.Mesh(
          new THREE.BoxGeometry(1.4, 0.8, 0.04),
          new THREE.MeshStandardMaterial({ color: 0x020617, roughness: 0.2, metalness: 0.9 })
        );
        screen.position.set(0, 0.9, 0);
        group.add(screen);
      } else if (item.type === "coffee_table" || item.type === "table") {
        // Table Top
        const top = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.06, 0.7), primaryMat);
        top.position.y = 0.42;
        top.castShadow = true;
        group.add(top);

        const legGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.39);
        const legMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.8 });
        [
          [-0.52, 0.195, -0.28],
          [0.52, 0.195, -0.28],
          [-0.52, 0.195, 0.28],
          [0.52, 0.195, 0.28],
        ].forEach(([lx, ly, lz]) => {
          const leg = new THREE.Mesh(legGeo, legMat);
          leg.position.set(lx, ly, lz);
          group.add(leg);
        });
      } else if (item.type === "bookshelf") {
        // Tall Bookshelf
        const caseBody = new THREE.Mesh(new THREE.BoxGeometry(1.2, 2.2, 0.38), primaryMat);
        caseBody.position.y = 1.1;
        caseBody.castShadow = true;
        group.add(caseBody);
      } else if (item.type === "plant") {
        // Jade Wealth Plant in Pot
        const pot = new THREE.Mesh(
          new THREE.CylinderGeometry(0.3, 0.22, 0.5, 16),
          new THREE.MeshStandardMaterial({ color: 0xc2410c, roughness: 0.7 })
        );
        pot.position.y = 0.25;
        pot.castShadow = true;
        group.add(pot);

        const leafMat = new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.3 });
        for (let i = 0; i < 9; i++) {
          const angle = (i / 9) * Math.PI * 2;
          const leaf = new THREE.Mesh(new THREE.SphereGeometry(0.2, 8, 8), leafMat);
          leaf.scale.set(1.2, 0.3, 0.8);
          leaf.position.set(Math.cos(angle) * 0.25, 0.6 + (i % 3) * 0.15, Math.sin(angle) * 0.25);
          leaf.rotation.z = Math.cos(angle) * 0.5;
          group.add(leaf);
        }
      } else if (item.type === "nightstand") {
        const stand = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.55, 0.45), primaryMat);
        stand.position.y = 0.275;
        group.add(stand);

        // Lamp on Stand
        const lamp = new THREE.Mesh(
          new THREE.CylinderGeometry(0.12, 0.18, 0.3, 12),
          new THREE.MeshStandardMaterial({ color: 0xfef08a, emissive: 0xfef08a, emissiveIntensity: 0.4 })
        );
        lamp.position.set(0, 0.7, 0);
        group.add(lamp);
      } else {
        // Generic Furniture Box
        const box = new THREE.Mesh(
          new THREE.BoxGeometry(item.dimensions?.width || 1.2, item.dimensions?.height || 0.8, item.dimensions?.depth || 0.8),
          primaryMat
        );
        box.position.y = (item.dimensions?.height || 0.8) / 2;
        group.add(box);
      }

      return group;
    };

    // 3. Instantiate All Detected Items into the 3D Scene
    itemMeshesRef.current = [];

    items.forEach((item) => {
      const meshGroup = buildItemMesh(item);

      // Floor Status Aura Ring (Red warning for inauspicious, emerald for harmonious)
      const ringGeo = new THREE.RingGeometry(0.8, 1.05, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: item.status === "inauspicious" ? 0xf43f5e : 0x10b981,
        transparent: true,
        opacity: 0.6,
        side: THREE.DoubleSide,
      });
      const statusRing = new THREE.Mesh(ringGeo, ringMat);
      statusRing.rotation.x = -Math.PI / 2;
      statusRing.position.y = 0.02;
      meshGroup.add(statusRing);

      // Set initial position
      const initialPos = item.initialPos || { x: 0, y: 0, z: 0, rotY: 0 };
      const rearrangedPos = item.rearrangedPos || { x: 1.5, y: 0, z: -1.5, rotY: 0 };

      meshGroup.position.set(initialPos.x, initialPos.y, initialPos.z);
      meshGroup.rotation.y = initialPos.rotY || 0;

      scene.add(meshGroup);

      itemMeshesRef.current.push({
        id: item.id,
        group: meshGroup,
        statusRing,
        initialPos,
        rearrangedPos,
        status: item.status,
      });
    });

    // 4. Chi Streams (Green Sheng Chi particles circulating room)
    const particleCount = 200;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const t = i / particleCount;
      particlePositions[i * 3] = Math.sin(t * Math.PI * 2) * 2.4;
      particlePositions[i * 3 + 1] = 0.2 + Math.sin(t * Math.PI * 3) * 0.4;
      particlePositions[i * 3 + 2] = 3.5 - t * 5.8;
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
    chiParticlesRef.current = chiParticles;

    // Red Sha Chi Laser Line cutting through doorway
    const lineGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(doorX, 0.4, 3.5),
      new THREE.Vector3(doorX, 0.4, -2.5),
    ]);
    const shaBeam = new THREE.Line(
      lineGeo,
      new THREE.LineDashedMaterial({
        color: 0xf43f5e,
        dashSize: 0.3,
        gapSize: 0.15,
        linewidth: 3,
        transparent: true,
        opacity: 0.8,
      })
    );
    shaBeam.computeLineDistances();
    scene.add(shaBeam);
    shaBeamRef.current = shaBeam;

    // 5. Animation Loop with Smooth Interpolation
    let animId: number;
    const clock = new THREE.Clock();

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

      // Smoothly animate each piece of furniture to its target coordinates
      itemMeshesRef.current.forEach((meshItem) => {
        const isAfter = layoutMode === "after";
        const target = isAfter ? meshItem.rearrangedPos : meshItem.initialPos;
        const targetRotY = (target.rotY ?? 0) * (Math.abs(target.rotY ?? 0) > 10 ? Math.PI / 180 : 1);

        meshItem.group.position.x = THREE.MathUtils.lerp(meshItem.group.position.x, target.x, 0.08);
        meshItem.group.position.z = THREE.MathUtils.lerp(meshItem.group.position.z, target.z, 0.08);
        meshItem.group.rotation.y = THREE.MathUtils.lerp(meshItem.group.rotation.y, targetRotY, 0.08);

        // Update floor status ring
        if (meshItem.statusRing.material instanceof THREE.MeshBasicMaterial) {
          if (isAfter || meshItem.status === "harmonious") {
            meshItem.statusRing.material.color.setHex(0x10b981);
            meshItem.statusRing.material.opacity = 0.4 + Math.sin(elapsedTime * 2) * 0.15;
          } else {
            meshItem.statusRing.material.color.setHex(0xf43f5e);
            meshItem.statusRing.material.opacity = 0.5 + Math.sin(elapsedTime * 4) * 0.25;
          }
        }
      });

      // Flow green Chi particles
      if (chiParticles.geometry.attributes.position) {
        const positions = chiParticles.geometry.attributes.position.array as Float32Array;
        for (let i = 0; i < particleCount; i++) {
          positions[i * 3 + 1] = 0.2 + Math.sin(elapsedTime * 2 + i * 0.1) * 0.15;
        }
        chiParticles.geometry.attributes.position.needsUpdate = true;
      }

      // Pulse red Sha Chi beam
      if (shaBeam.material instanceof THREE.LineDashedMaterial) {
        shaBeam.visible = layoutMode === "before";
        shaBeam.material.opacity = 0.4 + Math.sin(elapsedTime * 4) * 0.4;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
      renderer.dispose();
      scene.clear();
    };
  }, [items, sceneData, layoutMode]);

  // Notify parent of score change
  useEffect(() => {
    if (onScoreChange) {
      onScoreChange(layoutMode === "after" ? 94 : 52);
    }
  }, [layoutMode, onScoreChange]);

  // Touch and Mouse Orbit Controls
  const handlePointerDown = (clientX: number, clientY: number) => {
    isPointerDownRef.current = true;
    pointerStartRef.current = { x: clientX, y: clientY };
    hasMovedRef.current = false;
  };

  const handlePointerMove = (clientX: number, clientY: number) => {
    if (!isPointerDownRef.current || !cameraRef.current) return;
    const deltaX = clientX - pointerStartRef.current.x;
    const deltaY = clientY - pointerStartRef.current.y;

    if (Math.abs(deltaX) > 3 || Math.abs(deltaY) > 3) {
      hasMovedRef.current = true;
    }

    pointerStartRef.current = { x: clientX, y: clientY };

    cameraAngleRef.current.theta -= deltaX * 0.008;
    cameraAngleRef.current.phi += deltaY * 0.008;

    const { theta, phi, radius } = cameraAngleRef.current;
    const clampedPhi = Math.max(0.1, Math.min(Math.PI / 2 - 0.05, phi));

    cameraRef.current.position.x = radius * Math.sin(clampedPhi) * Math.sin(theta);
    cameraRef.current.position.y = radius * Math.cos(clampedPhi);
    cameraRef.current.position.z = radius * Math.sin(clampedPhi) * Math.cos(theta);
    cameraRef.current.lookAt(0, 1.2, 0);
  };

  const handlePointerUp = (clientX?: number, clientY?: number) => {
    isPointerDownRef.current = false;

    // If it was a quick tap (not a drag), perform 3D raycast selection!
    if (!hasMovedRef.current && clientX !== undefined && clientY !== undefined && mountRef.current && cameraRef.current) {
      const rect = mountRef.current.getBoundingClientRect();
      const mouse = new THREE.Vector2(
        ((clientX - rect.left) / rect.width) * 2 - 1,
        -((clientY - rect.top) / rect.height) * 2 + 1
      );

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, cameraRef.current);

      const intersects = raycaster.intersectObjects(
        itemMeshesRef.current.map((m) => m.group),
        true
      );

      if (intersects.length > 0) {
        let parent: THREE.Object3D | null = intersects[0].object;
        while (parent && parent.parent && !itemMeshesRef.current.some((m) => m.id === parent?.name)) {
          parent = parent.parent;
        }
        if (parent && parent.name) {
          setSelectedItemId(parent.name);
        }
      }
    }
  };

  const setCameraPreset = (preset: "orbit" | "top" | "door") => {
    setCameraView(preset);
    if (!cameraRef.current) return;

    if (preset === "top") {
      cameraAngleRef.current = { theta: 0, phi: 0.15, radius: 13 };
    } else if (preset === "door") {
      cameraAngleRef.current = { theta: 0, phi: 0.9, radius: 8 };
    } else {
      cameraAngleRef.current = { theta: 0.8, phi: 0.65, radius: 11 };
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
      <div className="relative w-full h-[380px] sm:h-[460px] rounded-3xl overflow-hidden border border-emerald-500/30 shadow-2xl bg-[#020e0c] touch-none select-none">
        <div
          ref={mountRef}
          className="w-full h-full cursor-grab active:cursor-grabbing"
          onMouseDown={(e) => handlePointerDown(e.clientX, e.clientY)}
          onMouseMove={(e) => handlePointerMove(e.clientX, e.clientY)}
          onMouseUp={(e) => handlePointerUp(e.clientX, e.clientY)}
          onMouseLeave={() => handlePointerUp()}
          onTouchStart={(e) => handlePointerDown(e.touches[0].clientX, e.touches[0].clientY)}
          onTouchMove={(e) => handlePointerMove(e.touches[0].clientX, e.touches[0].clientY)}
          onTouchEnd={(e) => {
            const touch = e.changedTouches[0];
            handlePointerUp(touch ? touch.clientX : undefined, touch ? touch.clientY : undefined);
          }}
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

        {/* Selected Furniture Bottom Card (Tap in 3D to Inspect) */}
        {selectedItem && (
          <div className="absolute bottom-10 left-3 right-3 p-3 rounded-2xl bg-black/85 backdrop-blur-md border border-emerald-500/40 shadow-2xl flex items-center justify-between gap-3 animate-in fade-in slide-in-from-bottom-2 duration-200">
            <div className="flex items-center gap-2.5 min-w-0">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                  layoutMode === "after" || selectedItem.status === "harmonious"
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                    : "bg-rose-500/20 text-rose-400 border border-rose-500/40"
                }`}
              >
                {layoutMode === "after" || selectedItem.status === "harmonious" ? (
                  <Check className="w-3.5 h-3.5" />
                ) : (
                  <AlertTriangle className="w-3.5 h-3.5" />
                )}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-white truncate">
                  {selectedItem.label}
                </div>
                <div className="text-[10px] text-slate-300 truncate">
                  {layoutMode === "after"
                    ? selectedItem.fixReason
                    : selectedItem.issue || "Placed in room layout"}
                </div>
              </div>
            </div>

            <span className="text-[9px] font-mono px-2 py-0.5 rounded-full font-bold uppercase shrink-0 border bg-emerald-950/80 text-emerald-300 border-emerald-500/30">
              {layoutMode === "after" ? "Command Position" : "Scanned Placement"}
            </span>
          </div>
        )}

        {/* Bottom Center: Gesture instruction */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-slate-950/80 backdrop-blur-md border border-slate-800 text-[9px] text-slate-300 pointer-events-none whitespace-nowrap flex items-center gap-1.5 shadow">
          <Move className="w-2.5 h-2.5 text-emerald-400" />
          <span>Swipe to rotate 360° • Tap objects to inspect</span>
        </div>
      </div>

      {/* Interactive 3D Relayout Controls */}
      <div className="glass-panel p-4 rounded-3xl border border-emerald-500/25 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold text-white">
              3D Layout Simulator:
            </span>
          </div>
          <span className="text-[10px] font-mono text-emerald-300 font-bold">
            Live 3D Rearrange ({items.length} detected items)
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
              Furniture smoothly relocates to the Command Position with solid wall backing.
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
              Current scanned furniture locations exposing occupants to rushing doorway Sha Chi.
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
                Your primary furniture is anchored with solid structural Mountain backing and a commanding diagonal view of the entrance. The red Sha Chi cut is completely eliminated, allowing smooth Sheng Chi vitality to circulate.
              </div>
            </>
          ) : (
            <>
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div className="text-[11px] text-slate-200 leading-relaxed">
                <strong className="text-rose-400 block mb-0.5">
                  Energetic Flaw Detected:
                </strong>
                Notice the red Sha Chi laser beam cutting directly from the doorway. Unanchored furniture in direct line of sight creates subconscious stress, restless sleep, and dispersed focus.
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
