import {
  CompassDirection,
  FengShuiGoal,
  FengShuiResult,
  RoomType,
} from "@/types";
import { parseRoomVision, generateEditedRoomImage } from "./unorouter";
import { evaluateFengShui } from "../fengshui/scoring";
import { generateRoomFloorPlanSvg } from "../image/diagram";

export interface RunPipelineInput {
  imageDataUrl: string;
  roomType: RoomType;
  doorDirection: CompassDirection;
  goal: FengShuiGoal;
  birthYear?: number;
}

export interface RunPipelineOutput {
  result: FengShuiResult;
  originalImageUrl: string;
  editedImageUrl: string;
  svgBefore: string;
  svgAfter: string;
}

/**
 * Executes the complete 5-step AI Feng Shui pipeline
 */
export async function runFengShuiPipeline(
  input: RunPipelineInput
): Promise<RunPipelineOutput> {
  // Step 1: Vision Parsing
  const visionData = await parseRoomVision(input.imageDataUrl, {
    roomType: input.roomType,
    doorDirection: input.doorDirection,
    goal: input.goal,
  });

  // Step 2: Classical Feng Shui Reasoning Engine
  const fengShuiResult = evaluateFengShui(
    visionData,
    input.doorDirection,
    input.goal,
    input.birthYear
  );

  // Step 3 & 4: Image Generation / Editing
  const editedImageUrl = await generateEditedRoomImage(
    input.imageDataUrl,
    fengShuiResult.imageEditPrompt
  );

  // Step 5: Fallback 2D Floor Plan SVG Generation (Before & After)
  const svgBefore = generateRoomFloorPlanSvg("before", {
    roomType: input.roomType,
    doorDirection: input.doorDirection,
    issues: fengShuiResult.issues.map((i) => i.title),
  });

  const svgAfter = generateRoomFloorPlanSvg("after", {
    roomType: input.roomType,
    doorDirection: input.doorDirection,
    issues: fengShuiResult.issues.map((i) => i.title),
  });

  fengShuiResult.svgLayoutDiagram = {
    beforeSvg: svgBefore,
    afterSvg: svgAfter,
  };

  return {
    result: fengShuiResult,
    originalImageUrl: input.imageDataUrl,
    editedImageUrl,
    svgBefore,
    svgAfter,
  };
}
