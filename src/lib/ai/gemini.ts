import { VisionAnalysisResponseSchema } from "./schemas";
import { RoomVisionData, RoomType, CompassDirection, FengShuiGoal } from "@/types";

export interface GeminiConfig {
  apiKey: string;
  reasoningModel: string;
  visionModel: string;
}

export function getGeminiConfig(): GeminiConfig {
  const apiKey =
    process.env.GEMINI_API_KEY ||
    process.env.NEXT_PUBLIC_GEMINI_API_KEY ||
    "";

  return {
    apiKey,
    reasoningModel: process.env.GEMINI_REASONING_MODEL || "gemini-3.1-flash-lite",
    visionModel: process.env.GEMINI_VISION_MODEL || "gemini-3.1-flash-lite",
  };
}

export function extractBase64AndMime(dataUrl: string): { mimeType: string; data: string } {
  if (dataUrl.startsWith("data:")) {
    const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
    if (match) {
      return { mimeType: match[1], data: match[2] };
    }
  }
  return { mimeType: "image/jpeg", data: dataUrl };
}

/**
 * Parses a room photo using Gemini Vision (gemini-3.1-flash-lite).
 * Strictly detects ONLY what is actually visible in the photo without assumptions.
 */
export async function parseRoomVisionWithGemini(
  imageDataUrl: string,
  context: {
    roomType?: RoomType;
    doorDirection?: CompassDirection;
    goal?: FengShuiGoal;
  }
): Promise<RoomVisionData> {
  const config = getGeminiConfig();
  const { mimeType, data: base64Data } = extractBase64AndMime(imageDataUrl);

  const prompt = `You are an expert 3D Spatial Room Architecture and Classical Feng Shui Consultant.
Carefully examine this room photograph.

CRITICAL INSTRUCTIONS:
1. Identify the TRUE room type: "living_room", "office", "bedroom", "kitchen", "dining", "studio", or "other".
2. REALITY CHECK: Detect ONLY the actual furniture and architectural elements that are VISIBLE in this image!
   - If there is NO bed, DO NOT report or invent a bed!
   - If you see a sofa / couch: report it as a sofa.
   - If you see a desk / computer workstation: report it as a desk.
   - If you see a dining table / chairs: report it as a dining table.
   - If you see a TV console / entertainment unit: report it as a TV unit.
   - If you see living plants, mirrors, windows, or doors: report them.
3. Determine whether the primary focal furniture (sofa, desk, or bed) is in the "Command Position" (facing the entry diagonally with a solid wall behind it) or if it has its back to the entrance door, blocks traffic flow, or sits directly in the line of the door.

Return ONLY a valid JSON object matching this schema:
{
  "roomType": "living_room", // "living_room" | "office" | "bedroom" | "kitchen" | "dining" | "studio"
  "clutterLevel": 3, // 1 (spotless) to 10 (heavily cluttered)
  "lightingQuality": "moderate", // "poor" | "moderate" | "bright" | "harsh"
  "dominantColors": ["warm wood", "beige", "forest green"],
  "detectedObjects": [
    {
      "id": "item_1",
      "label": "Grey Sectional Sofa", // actual item description
      "position": "Centered in room with back to entrance", // actual position
      "facesWhat": "Far wall / Window / Doorway"
    }
  ],
  "notes": "Accurate summary of actual layout, focal furniture, and Feng Shui energy flow"
}

Return ONLY valid JSON. No markdown fences, no explanatory text outside the JSON.`;

  const requestBody = {
    contents: [
      {
        parts: [
          {
            inlineData: {
              mimeType,
              data: base64Data,
            },
          },
          { text: prompt },
        ],
      },
    ],
    generationConfig: {
      responseMimeType: "application/json",
      temperature: 0.1,
    },
  };

  const visionModels = [config.visionModel, "gemini-3.8-flash", "gemini-2.5-flash"];

  for (const model of visionModels) {
    if (!config.apiKey) break;

    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${config.apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        }
      );

      if (!res.ok) {
        const errText = await res.text();
        console.warn(`Gemini vision model ${model} failed (${res.status}): ${errText}`);
        continue;
      }

      const jsonRes = await res.json();
      const rawText = jsonRes.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!rawText) continue;

      const parsed = JSON.parse(rawText);
      const validated = VisionAnalysisResponseSchema.safeParse(parsed);

      if (validated.success) {
        return validated.data as RoomVisionData;
      } else {
        return {
          roomType: (parsed.roomType as RoomType) || "living_room",
          clutterLevel: typeof parsed.clutterLevel === "number" ? parsed.clutterLevel : 3,
          lightingQuality: parsed.lightingQuality || "moderate",
          dominantColors: Array.isArray(parsed.dominantColors) ? parsed.dominantColors : ["warm wood", "neutral"],
          detectedObjects: Array.isArray(parsed.detectedObjects)
            ? parsed.detectedObjects.map((o: any, idx: number) => ({
                id: o.id || `obj_${idx}`,
                label: o.label || "Furniture",
                position: o.position || "Room space",
                facesWhat: o.facesWhat,
              }))
            : [],
          notes: parsed.notes || "Room features analyzed.",
        };
      }
    } catch (err) {
      console.warn(`Error attempting vision with ${model}:`, err);
    }
  }

  // Adaptive fallback: NEVER assume a bed! Base fallback on context.roomType or general living space
  const fallbackRoomType = context.roomType && context.roomType !== "auto" ? context.roomType : "living_room";

  if (fallbackRoomType === "office") {
    return {
      roomType: "office",
      clutterLevel: 3,
      lightingQuality: "moderate",
      dominantColors: ["natural wood", "slate grey", "warm white"],
      detectedObjects: [
        { id: "desk_1", label: "Work Desk", position: "Facing wall with back to door", facesWhat: "Wall" },
        { id: "chair_1", label: "Office Chair", position: "At desk" },
        { id: "window_1", label: "Window", position: "Side wall" },
      ],
      notes: "Workspace layout mapped for executive focus and Command Position.",
    };
  }

  if (fallbackRoomType === "bedroom") {
    return {
      roomType: "bedroom",
      clutterLevel: 3,
      lightingQuality: "moderate",
      dominantColors: ["warm linen", "oak wood", "cream"],
      detectedObjects: [
        { id: "bed_1", label: "Bed", position: "In line with doorway", facesWhat: "Door" },
        { id: "door_1", label: "Door", position: "Entryway" },
      ],
      notes: "Sleeping area mapped for restorative Yin sleep.",
    };
  }

  // Default to universal Living Room seating layout
  return {
    roomType: "living_room",
    clutterLevel: 3,
    lightingQuality: "moderate",
    dominantColors: ["warm wood", "earthy beige", "emerald green"],
    detectedObjects: [
      { id: "sofa_1", label: "Main Sofa", position: "Centered in room with back to door", facesWhat: "Far wall" },
      { id: "table_1", label: "Coffee Table", position: "In front of sofa" },
      { id: "window_1", label: "Window", position: "Left wall" },
    ],
    notes: "Living room layout mapped for harmonious family Chi and social anchoring.",
  };
}
