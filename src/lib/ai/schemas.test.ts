import test from "node:test";
import assert from "node:assert/strict";
import { VisionAnalysisResponseSchema, FengShuiOutputSchema } from "./schemas";
import { evaluateFengShui } from "../fengshui/scoring";

test("VisionAnalysisResponseSchema validates clean detection JSON", () => {
  const validData = {
    roomType: "bedroom",
    clutterLevel: 7,
    lightingQuality: "moderate",
    dominantColors: ["White", "Oak"],
    detectedObjects: [
      {
        id: "bed_1",
        label: "Bed",
        position: "Facing door directly",
      },
    ],
    notes: "Bed in line with doorway",
  };

  const validated = VisionAnalysisResponseSchema.parse(validData);
  assert.equal(validated.roomType, "bedroom");
  assert.equal(validated.detectedObjects.length, 1);
});

test("evaluateFengShui flags coffin position and calculates valid score", () => {
  const visionData = {
    roomType: "bedroom" as const,
    clutterLevel: 7,
    lightingQuality: "moderate" as const,
    dominantColors: ["Grey", "Cream"],
    detectedObjects: [
      {
        id: "bed_1",
        label: "Bed",
        position: "In line with door (coffin position)",
      },
      {
        id: "mirror_1",
        label: "Mirror",
        position: "Facing bed directly",
      },
    ],
    notes: "Severe Sha Chi alignment",
  };

  const output = evaluateFengShui(visionData, "SW", "sleep", 1990);
  assert.ok(output.score >= 0 && output.score <= 100);
  assert.ok(output.issues.length >= 2);
  assert.equal(output.biggestProblem.severity, "critical");
  assert.ok(output.suggestedMoves.length >= 1);
  assert.ok(output.imageEditPrompt.includes("Keep all other structural walls"));
});
