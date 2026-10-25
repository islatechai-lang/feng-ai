export type RoomType = "bedroom" | "living_room" | "office" | "kitchen" | "shop";

export type CompassDirection =
  | "N"
  | "NE"
  | "E"
  | "SE"
  | "S"
  | "SW"
  | "W"
  | "NW"
  | "UNKNOWN";

export type FengShuiGoal =
  | "money"
  | "sleep"
  | "love"
  | "career"
  | "health";

export type IssueSeverity = "critical" | "warning" | "info";

export type FiveElement = "wood" | "fire" | "earth" | "metal" | "water";

export interface FengShuiIssue {
  id: string;
  title: string;
  severity: IssueSeverity;
  what: string;
  why: string;
  fix: string;
  whichObject: string;
  pinCoordinates?: { x: number; y: number }; // percentage from top-left (0-100)
}

export interface DetectedFurniture {
  id: string;
  label: string;
  position: string; // e.g. "North wall", "Center", "Facing door"
  facesWhat?: string;
  coords?: { x: number; y: number; width: number; height: number };
}

export interface RoomVisionData {
  roomType: RoomType;
  clutterLevel: number; // 1-10
  lightingQuality: "poor" | "moderate" | "bright" | "harsh";
  dominantColors: string[];
  detectedObjects: DetectedFurniture[];
  notes: string;
}

export interface KuaInfo {
  kuaNumber: number;
  group: "East" | "West";
  trigram: string;
  element: FiveElement;
  luckyDirections: {
    shengChi: CompassDirection; // Wealth & Vitality
    tianYi: CompassDirection;   // Health & Healing
    yanNian: CompassDirection;  // Love & Relationships
    fuWei: CompassDirection;    // Peace & Wisdom
  };
  inauspiciousDirections: {
    hoHai: CompassDirection;    // Mishaps
    wuGui: CompassDirection;    // Five Ghosts / Conflict
    liuSha: CompassDirection;   // Six Killings
    jueMing: CompassDirection;  // Total Loss
  };
}

export interface BaguaSector {
  direction: CompassDirection;
  name: string;
  lifeArea: string;
  element: FiveElement;
  colors: string[];
  recommendation: string;
}

export interface SuggestedMove {
  item: string;
  from: string;
  to: string;
  reason: string;
}

export interface DecorSuggestion {
  item: string;
  element: FiveElement;
  placement: string;
  purpose: string;
  color: string;
}

export type FurnitureItemType =
  | "bed"
  | "desk"
  | "sofa"
  | "chair"
  | "table"
  | "dining_table"
  | "tv_unit"
  | "bookshelf"
  | "plant"
  | "mirror"
  | "wardrobe"
  | "lighting"
  | "cabinet"
  | "other";

export interface SceneItem3D {
  id: string;
  type: FurnitureItemType;
  label: string;
  initialPos: { x: number; y: number; z: number; rotY?: number };
  rearrangedPos: { x: number; y: number; z: number; rotY?: number };
  status: "inauspicious" | "harmonious";
  issue?: string;
  fixReason: string;
}

export interface Room3DScene {
  roomType: RoomType;
  detectedItems: SceneItem3D[];
  primaryFocalType: FurnitureItemType;
  doorPosition: { x: number; z: number };
  windowPosition: { x: number; z: number };
}

export interface FengShuiResult {
  score: number;
  grade: "A+" | "A" | "B" | "C" | "D" | "F";
  summary: string;
  biggestProblem: {
    title: string;
    description: string;
    quickFix: string;
    severity: IssueSeverity;
  };
  issues: FengShuiIssue[];
  suggestedMoves: SuggestedMove[];
  imageEditPrompt: string;
  scene3D?: Room3DScene;
  luckyGuide: {
    primaryElement: FiveElement;
    luckyColors: string[];
    luckyDirections: CompassDirection[];
    baguaSectors: BaguaSector[];
    kuaInfo?: KuaInfo;
    decorSuggestions: DecorSuggestion[];
  };
  svgLayoutDiagram?: {
    beforeSvg: string;
    afterSvg: string;
  };
}

export interface AnalysisRecord {
  id: string;
  userId?: string;
  status: "pending" | "analyzing" | "completed" | "failed";
  roomType: RoomType;
  doorDirection: CompassDirection;
  goal: FengShuiGoal;
  birthYear?: number;
  inputImageUrl: string;
  editedImageUrl?: string;
  annotatedImageUrl?: string;
  score: number;
  isUnlocked: boolean;
  resultJson: FengShuiResult;
  createdAt: string;
  shareToken?: string;
}

export type PricingPlan = "single_room" | "weekly_pass" | "pro_yearly";

export interface PricingPlanDetail {
  id: PricingPlan;
  name: string;
  priceUSD: number;
  priceLabelUSD: string;
  regionalPrice?: {
    currency: string;
    price: number;
    symbol: string;
  };
  billingPeriod: "once" | "week" | "year";
  features: string[];
  isPopular?: boolean;
  bestValue?: boolean;
}
