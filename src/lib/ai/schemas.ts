import { z } from "zod";

export const DetectedObjectSchema = z.object({
  id: z.string(),
  label: z.string(),
  position: z.string(),
  facesWhat: z.string().optional(),
});

export const VisionAnalysisResponseSchema = z.object({
  roomType: z.enum(["bedroom", "living_room", "office", "kitchen", "shop"]),
  clutterLevel: z.number().min(1).max(10),
  lightingQuality: z.enum(["poor", "moderate", "bright", "harsh"]),
  dominantColors: z.array(z.string()),
  detectedObjects: z.array(DetectedObjectSchema),
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
