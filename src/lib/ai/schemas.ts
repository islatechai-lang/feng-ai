import { z } from "zod";

export const DetectedObjectSchema = z.object({
  id: z.string(),
  label: z.string(),
  position: z.string(),
  facesWhat: z.string().optional(),
});

export const SceneItem3DSchema = z.object({
  id: z.string(),
  label: z.string(),
  type: z.string().transform((val) => {
    const v = val.toLowerCase().replace(/[\s-]+/g, "_");
    if (v.includes("sofa") || v.includes("couch")) return "sofa";
    if (v.includes("bed")) return "bed";
    if (v.includes("desk")) return "desk";
    if (v.includes("chair")) return "chair";
    if (v.includes("coffee")) return "coffee_table";
    if (v.includes("dining")) return "dining_table";
    if (v.includes("tv") || v.includes("media")) return "tv_unit";
    if (v.includes("shelf") || v.includes("book")) return "bookshelf";
    if (v.includes("plant") || v.includes("tree")) return "plant";
    if (v.includes("mirror")) return "mirror";
    if (v.includes("wardrobe") || v.includes("closet")) return "wardrobe";
    if (v.includes("nightstand") || v.includes("side_table")) return "nightstand";
    if (v.includes("table")) return "table";
    return "other";
  }),
  color: z.string().default("#64748b"),
  dimensions: z
    .object({
      width: z.number().default(1.5),
      height: z.number().default(0.8),
      depth: z.number().default(1.0),
    })
    .default({ width: 1.5, height: 0.8, depth: 1.0 }),
  initialPos: z.object({
    x: z.number().default(0),
    y: z.number().default(0),
    z: z.number().default(0),
    rotY: z.number().default(0),
  }),
  rearrangedPos: z.object({
    x: z.number().default(1.5),
    y: z.number().default(0),
    z: z.number().default(-1.5),
    rotY: z.number().default(0),
  }),
  status: z.enum(["inauspicious", "harmonious", "neutral"]).default("inauspicious"),
  issue: z.string().optional(),
  fixReason: z.string().default("Relocated to harmonious Command Position"),
});

export const Room3DSceneResponseSchema = z.object({
  roomType: z.string().transform((val) => {
    const cleaned = val.toLowerCase().replace(/[\s-]+/g, "_");
    if (cleaned.includes("living")) return "living_room";
    if (cleaned.includes("office") || cleaned.includes("study") || cleaned.includes("desk")) return "office";
    if (cleaned.includes("kitchen")) return "kitchen";
    if (cleaned.includes("dining")) return "dining";
    if (cleaned.includes("bed")) return "bedroom";
    if (cleaned.includes("studio")) return "studio";
    return "living_room";
  }),
  roomDimensions: z
    .object({
      width: z.number().default(7),
      length: z.number().default(7),
      height: z.number().default(2.8),
    })
    .default({ width: 7, length: 7, height: 2.8 }),
  wallColor: z.string().default("#f1f5f9"),
  floorMaterial: z.enum(["wood", "carpet", "tile", "concrete"]).default("wood"),
  door: z
    .object({
      wall: z.enum(["front", "back", "left", "right"]).default("front"),
      x: z.number().default(0),
      z: z.number().default(3.5),
    })
    .default({ wall: "front", x: 0, z: 3.5 }),
  windows: z
    .array(
      z.object({
        wall: z.enum(["front", "back", "left", "right"]).default("left"),
        x: z.number().default(-3.5),
        z: z.number().default(0),
        width: z.number().default(2.0),
      })
    )
    .default([]),
  detectedFurniture: z.array(SceneItem3DSchema).default([]),
  chiScoreBefore: z.number().min(0).max(100).default(52),
  chiScoreAfter: z.number().min(0).max(100).default(94),
  biggestProblem: z.string().default("Primary furniture lacks Command Position"),
  summary: z.string().default("Spatial Feng Shui analysis"),
});

export const VisionAnalysisResponseSchema = z.object({
  roomType: z.string().transform((val) => {
    const cleaned = val.toLowerCase().replace(/[\s-]+/g, "_");
    if (cleaned.includes("living")) return "living_room";
    if (cleaned.includes("office") || cleaned.includes("study") || cleaned.includes("desk")) return "office";
    if (cleaned.includes("kitchen")) return "kitchen";
    if (cleaned.includes("dining")) return "dining";
    if (cleaned.includes("bed")) return "bedroom";
    if (cleaned.includes("studio")) return "studio";
    return "living_room";
  }),
  clutterLevel: z.number().min(1).max(10).default(3),
  lightingQuality: z.enum(["poor", "moderate", "bright", "harsh"]).default("moderate"),
  dominantColors: z.array(z.string()).default(["warm white", "wood"]),
  detectedObjects: z.array(DetectedObjectSchema).default([]),
  notes: z.string().default(""),
});

export const IssueSchema = z.object({
  id: z.string(),
  title: z.string(),
  severity: z.enum(["critical", "warning", "info"]),
  what: z.string(),
  why: z.string(),
  fix: z.string(),
  whichObject: z.string(),
  pinCoordinates: z
    .object({
      x: z.number().min(0).max(100),
      y: z.number().min(0).max(100),
    })
    .optional(),
});

export const SuggestedMoveSchema = z.object({
  item: z.string(),
  from: z.string(),
  to: z.string(),
  reason: z.string(),
});

export const FengShuiOutputSchema = z.object({
  score: z.number().min(0).max(100),
  grade: z.enum(["A+", "A", "B", "C", "D", "F"]),
  summary: z.string(),
  biggestProblem: z.object({
    title: z.string(),
    description: z.string(),
    quickFix: z.string(),
    severity: z.enum(["critical", "warning", "info"]),
  }),
  issues: z.array(IssueSchema),
  suggestedMoves: z.array(SuggestedMoveSchema),
  imageEditPrompt: z.string(),
});
