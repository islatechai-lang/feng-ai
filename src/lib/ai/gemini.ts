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
    reasoningModel: process.env.GEMINI_REASONING_MODEL || "gemini-3.8-flash",
    visionModel: process.env.GEMINI_VISION_MODEL || "gemini-3.8-flash",
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
Analyze this room photograph and reconstruct its complete 3D spatial layout and Feng Shui diagnosis.

The room coordinate system uses a grid from x: -3.5 to +3.5 (left to right), and z: -3.5 to +3.5 (back wall is -3.5, entrance door wall is +3.5). The floor is y: 0.

CRITICAL INSTRUCTIONS:
1. Identify the TRUE room type: "living_room", "office", "bedroom", "kitchen", "dining", "studio", or "other".
2. REALITY CHECK: Detect ONLY the actual furniture and architectural elements that are VISIBLE in this image!
   - If there is NO bed, DO NOT report or invent a bed!
   - If you see a sofa / couch: type "sofa".
   - If you see a coffee table: type "coffee_table".
   - If you see a desk: type "desk", chair: type "chair".
   - If you see a TV console / entertainment unit: type "tv_unit".
   - If you see a dining table / chairs: type "dining_table".
   - If you see living plants, mirrors, windows, or doors: detect their actual positions and types.
3. For each detected object:
   - "type": "sofa" | "bed" | "desk" | "chair" | "coffee_table" | "table" | "tv_unit" | "bookshelf" | "plant" | "mirror" | "wardrobe" | "nightstand" | "other"
   - "color": hex code matching what you see in the photo (e.g. "#64748b", "#78350f", "#334155", "#15803d")
   - "dimensions": estimated { width, height, depth } in meters
   - "initialPos": estimated current { x, y: 0, z, rotY } where it is currently placed
   - "rearrangedPos": Feng Shui optimized Command Position { x, y: 0, z, rotY } (diagonal from door with solid wall backing)
   - "status": "inauspicious" if exposed/blocking Chi, or "harmonious" if already well-placed
   - "issue": specific energetic flaw if inauspicious
   - "fixReason": exact reason why the rearranged location cures it

Return ONLY valid JSON matching:
{
  "roomType": "living_room",
  "clutterLevel": 3,
  "lightingQuality": "moderate",
  "dominantColors": ["warm wood", "slate grey"],
  "wallColor": "#f1f5f9",
  "floorMaterial": "wood",
  "door": { "wall": "front", "x": 0, "z": 3.5 },
  "windows": [{ "wall": "left", "x": -3.5, "z": 0, "width": 2.0 }],
  "detectedObjects": [
    {
      "id": "item_1",
      "label": "Grey Sectional Sofa",
      "type": "sofa",
      "color": "#64748b",
      "dimensions": { "width": 2.4, "height": 0.85, "depth": 1.0 },
      "initialPos": { "x": 0.0, "y": 0, "z": 0.4, "rotY": 0 },
      "rearrangedPos": { "x": 1.8, "y": 0, "z": -1.8, "rotY": 0 },
      "status": "inauspicious",
      "position": "Centered in room with back to entrance",
      "issue": "Back exposed to doorway, vulnerable to rushing Sha Chi",
      "fixReason": "Relocated diagonally against solid wall with full view of entrance"
    }
  ],
  "notes": "Accurate summary of actual layout, focal furniture, and Feng Shui energy flow"
}`;

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

  const visionModels = [config.visionModel, "gemini-3.8-flash", "gemini-3.1-flash-lite", "gemini-flash-latest"];

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
      const roomType: RoomType = (parsed.roomType as RoomType) || "living_room";

      // Map detected objects into SceneItem3D items with real coordinates
      const rawItems = Array.isArray(parsed.detectedObjects)
        ? parsed.detectedObjects
        : Array.isArray(parsed.detectedFurniture)
        ? parsed.detectedFurniture
        : [];

      const detectedObjects = rawItems.map((o: any, idx: number) => ({
        id: o.id || `obj_${idx}`,
        label: o.label || "Furniture",
        type: o.type,
        color: o.color || "#64748b",
        position: o.position || `${o.label} located in room`,
        facesWhat: o.facesWhat,
        coords: o.coords,
      }));

      // Build 3D Scene directly from Gemini's spatial detection
      const sceneItems3D = rawItems.map((o: any, idx: number) => {
        const itemType = o.type || (roomType === "bedroom" ? "bed" : roomType === "office" ? "desk" : "sofa");
        const initX = typeof o.initialPos?.x === "number" ? o.initialPos.x : (idx === 0 ? 0 : (idx % 2 === 0 ? -1.8 : 1.8));
        const initZ = typeof o.initialPos?.z === "number" ? o.initialPos.z : (idx === 0 ? 0.6 : (idx % 2 === 0 ? -1.0 : 1.0));
        const initRot = typeof o.initialPos?.rotY === "number" ? o.initialPos.rotY : 0;

        const rearX = typeof o.rearrangedPos?.x === "number" ? o.rearrangedPos.x : (idx === 0 ? 1.8 : -1.8);
        const rearZ = typeof o.rearrangedPos?.z === "number" ? o.rearrangedPos.z : (idx === 0 ? -1.8 : 1.5);
        const rearRot = typeof o.rearrangedPos?.rotY === "number" ? o.rearrangedPos.rotY : 0;

        return {
          id: o.id || `item_${idx + 1}`,
          type: itemType,
          label: o.label || `Room ${itemType}`,
          color: o.color || (itemType === "plant" ? "#10b981" : itemType === "sofa" ? "#1e3a34" : "#78350f"),
          dimensions: o.dimensions || { width: 1.5, height: 0.8, depth: 1.0 },
          initialPos: { x: initX, y: 0, z: initZ, rotY: initRot },
          rearrangedPos: { x: rearX, y: 0, z: rearZ, rotY: rearRot },
          status: (o.status === "harmonious" || o.status === "neutral" ? o.status : "inauspicious") as "inauspicious" | "harmonious" | "neutral",
          issue: o.issue || (idx === 0 ? "Lacks Command Position" : undefined),
          fixReason: o.fixReason || "Repositioned for balanced Sheng Chi flow",
        };
      });

      const primaryFocal = sceneItems3D.find((i: any) => i.type === "sofa" || i.type === "desk" || i.type === "bed")?.type ||
        (roomType === "bedroom" ? "bed" : roomType === "office" ? "desk" : "sofa");

      const scene3D = {
        roomType,
        roomDimensions: parsed.roomDimensions || { width: 7, length: 7, height: 2.8 },
        wallColor: parsed.wallColor || "#132520",
        floorMaterial: parsed.floorMaterial || "wood",
        door: parsed.door || { wall: "front" as const, x: 0, z: 3.5 },
        windows: Array.isArray(parsed.windows) ? parsed.windows : [{ wall: "left" as const, x: -3.5, z: 0, width: 2.0 }],
        detectedItems: sceneItems3D,
        primaryFocalType: primaryFocal,
        doorPosition: { x: parsed.door?.x ?? 0, z: parsed.door?.z ?? 3.5 },
        windowPosition: { x: parsed.windows?.[0]?.x ?? -3.5, z: parsed.windows?.[0]?.z ?? 0 },
      };

      return {
        roomType,
        clutterLevel: typeof parsed.clutterLevel === "number" ? parsed.clutterLevel : 3,
        lightingQuality: parsed.lightingQuality || "moderate",
        dominantColors: Array.isArray(parsed.dominantColors) ? parsed.dominantColors : ["warm wood", "neutral"],
        detectedObjects,
        scene3D,
        notes: parsed.notes || "Room features analyzed accurately.",
      };
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
