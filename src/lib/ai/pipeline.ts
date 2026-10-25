import {
  CompassDirection,
  FengShuiGoal,
  FengShuiResult,
  RoomType,
} from "@/types";
import { parseRoomVisionWithGemini } from "./gemini";
import { parseRoomVision } from "./unorouter";
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
 * Executes the AI Feng Shui Spatial Pipeline:
 * 1. Multimodal Vision Analysis (Detects real layout, furniture, chi blockages, door/window alignment)
 * 2. Classical Feng Shui Spatial Engine (Command Position, Mountain backing, 5 Elements, Bagua)
 * 3. Parametric 3D Interactive Room Studio Generation (Real 3D furniture coordinates for Three.js WebGL)
 * 4. Architectural 2D Before & After Vector Floor Plan Generation
 * 5. Actionable Priority Harmonization Checklist
 */
export async function runFengShuiPipeline(
  input: RunPipelineInput
): Promise<RunPipelineOutput> {
  const geminiKey = process.env.GEMINI_API_KEY;

  let visionData;

  // Step 1: Multimodal Vision Parsing
  if (geminiKey) {
    try {
      visionData = await parseRoomVisionWithGemini(input.imageDataUrl, {
        roomType: input.roomType,
        doorDirection: input.doorDirection,
        goal: input.goal,
      });
    } catch (err) {
      console.warn("Gemini vision parse error, falling back:", err);
      visionData = await parseRoomVision(input.imageDataUrl, {
        roomType: input.roomType,
        doorDirection: input.doorDirection,
        goal: input.goal,
      });
    }
  } else {
    visionData = await parseRoomVision(input.imageDataUrl, {
      roomType: input.roomType,
      doorDirection: input.doorDirection,
      goal: input.goal,
    });
  }

  // Step 2: Classical Feng Shui Spatial Engine & 3D Scene Graph Construction
  const fengShuiResult = evaluateFengShui(
    visionData,
    input.doorDirection,
    input.goal,
    input.birthYear
  );

  // Step 3: Architectural 2D Floor Plan SVG Generation (Before & After)
  const svgBefore = generateRoomFloorPlanSvg("before", {
    roomType: visionData.roomType,
    doorDirection: input.doorDirection,
    issues: fengShuiResult.issues.map((i) => i.title),
  });

  const svgAfter = generateRoomFloorPlanSvg("after", {
    roomType: visionData.roomType,
    doorDirection: input.doorDirection,
    issues: fengShuiResult.issues.map((i) => i.title),
  });

  fengShuiResult.svgLayoutDiagram = {
    beforeSvg: svgBefore,
    afterSvg: svgAfter,
  };

  // Keep the user's authentic photo as the true source of visual truth
  const editedImageUrl = input.imageDataUrl;

  return {
    result: fengShuiResult,
    originalImageUrl: input.imageDataUrl,
    editedImageUrl,
    svgBefore,
    svgAfter,
  };
}
