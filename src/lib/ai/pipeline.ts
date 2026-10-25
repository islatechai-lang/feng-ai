import {
  CompassDirection,
  FengShuiGoal,
  FengShuiResult,
  RoomType,
} from "@/types";
import { parseRoomVisionWithGemini, generateRoomInpaintingWithGemini } from "./gemini";
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
 * 1. Multimodal Vision Analysis (Detects layout, furniture, chi blockages, coffin line, mirror reflections)
 * 2. Classical Feng Shui Engine (Eight Mansions Kua calculation, Bagua 9-sector mapping, 5 Elements)
 * 3. Photorealistic AI Relayout Inpainting (Rearranges user's actual room into Command Position)
 * 4. Architectural 2D Before & After Vector Floor Plan Generation
 * 5. Structured Action Plan with prioritized remedies and high-impact changes
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
      console.warn("Gemini vision parse error, falling back to UnoRouter:", err);
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

  // Step 2: Classical Feng Shui Reasoning Engine
  const fengShuiResult = evaluateFengShui(
    visionData,
    input.doorDirection,
    input.goal,
    input.birthYear
  );

  // Step 3: Photorealistic AI Room Relayout Inpainting
  let editedImageUrl: string;
  if (geminiKey) {
    try {
      editedImageUrl = await generateRoomInpaintingWithGemini(
        input.imageDataUrl,
        fengShuiResult.imageEditPrompt
      );
    } catch (err) {
      console.warn("Gemini image relayout error, falling back to UnoRouter:", err);
      editedImageUrl = await generateEditedRoomImage(
        input.imageDataUrl,
        fengShuiResult.imageEditPrompt
      );
    }
  } else {
    editedImageUrl = await generateEditedRoomImage(
      input.imageDataUrl,
      fengShuiResult.imageEditPrompt
    );
  }

  // Step 4: Fallback & Architectural 2D Floor Plan SVG Generation (Before & After)
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
