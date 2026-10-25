import { z } from "zod";

export const DetectedObjectSchema = z.object({
  id: z.string(),
  label: z.string(),
  position: z.string(),
  facesWhat: z.string().optional(),
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
