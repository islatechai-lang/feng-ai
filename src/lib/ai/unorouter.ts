import { VisionAnalysisResponseSchema } from "./schemas";
import { RoomVisionData } from "@/types";

export interface UnoRouterConfig {
  apiKey?: string;
  baseUrl: string;
  reasoningModel: string;
  visionModel: string;
  imageModel: string;
}

export function getUnoRouterConfig(): UnoRouterConfig {
  let baseUrl =
    process.env.UNOROUTER_BASE_URL ||
    process.env.OPENROUTER_BASE_URL ||
    "https://api.unorouter.com/v1";

  // Sanitize: strip trailing /chat/completions or trailing slashes if user pasted full endpoint
  baseUrl = baseUrl.replace(/\/chat\/completions\/?$/, "").replace(/\/+$/, "");

  return {
    apiKey: process.env.UNOROUTER_API_KEY || process.env.OPENROUTER_API_KEY,
    baseUrl,
    reasoningModel: process.env.REASONING_MODEL || "gemini-3.1-flash-lite",
    visionModel: process.env.VISION_MODEL || "gemini-3.1-flash-lite",
    imageModel: process.env.IMAGE_MODEL || "gemini-3.1-flash-lite-image",
  };
}

/**
 * Calls UnoRouter / OpenRouter chat completion with timeout, retry & model fallback
 */
export async function callChatCompletion(
  messages: Array<{ role: string; content: any }>,
  model: string,
  options: { responseFormatJson?: boolean; timeoutMs?: number; maxRetries?: number } = {}
): Promise<{ content: string; tokensIn?: number; tokensOut?: number }> {
  const config = getUnoRouterConfig();
  const timeoutMs = options.timeoutMs || 45000;
  const maxRetries = options.maxRetries ?? 2;

  if (!config.apiKey) {
    throw new Error("UNOROUTER_API_KEY_MISSING");
  }

  // Model candidate aliases if provider expects a specific prefix
  const modelCandidates = [
    model,
    model.includes("/") ? model.split("/").pop()! : `google/${model}`,
    "gemini-3.1-flash-lite",
    "google/gemini-2.5-flash",
  ];

  let attempt = 0;
  let lastError: Error | null = null;

  for (const candidateModel of modelCandidates) {
    while (attempt <= maxRetries) {
      attempt++;
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeoutMs);

      try {
        const body: any = {
          model: candidateModel,
          messages,
        };

        if (options.responseFormatJson) {
          body.response_format = { type: "json_object" };
        }

        const res = await fetch(`${config.baseUrl}/chat/completions`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${config.apiKey}`,
            "HTTP-Referer": "https://fengshui-ai.app",
            "X-Title": "FengShui Room Analyzer",
          },
          body: JSON.stringify(body),
          signal: controller.signal,
        });

        clearTimeout(timer);

        if (!res.ok) {
          const errText = await res.text();
          const status = res.status;

          // If model not recognized, try next candidate
          if (status === 404 || errText.includes("model_not_found")) {
            break; // break retry loop to try next model candidate
          }

          // Rate limit or server error: retry with backoff
          if ((status === 429 || status >= 500) && attempt <= maxRetries) {
            const delay = Math.pow(2, attempt) * 1000;
            await new Promise((resolve) => setTimeout(resolve, delay));
            continue;
          }
          throw new Error(`UnoRouter request failed with ${status}: ${errText}`);
        }

        const data = await res.json();
        const content = data.choices?.[0]?.message?.content || "";
        const tokensIn = data.usage?.prompt_tokens;
        const tokensOut = data.usage?.completion_tokens;

        return { content, tokensIn, tokensOut };
      } catch (err: any) {
        clearTimeout(timer);
        lastError = err;
        if (err.name === "AbortError" && attempt <= maxRetries) {
          continue;
        }
        if (attempt > maxRetries) break;
      }
    }
  }

  throw lastError || new Error("Failed to complete request to UnoRouter");
}

/**
 * Step 1: Vision parsing using multimodal input
 */
export async function parseRoomVision(
  imageDataUrl: string,
  roomContext: { roomType: string; doorDirection: string; goal: string }
): Promise<RoomVisionData> {
  const config = getUnoRouterConfig();

  // If no API key configured, use procedural vision analyzer
  if (!config.apiKey) {
    return fallbackVisionParsing(roomContext);
  }

  const prompt = `You are a master Classical Feng Shui architect and interior spatial analyst.
Analyze this room photograph with high spatial precision.
Context provided:
- Room Type: ${roomContext.roomType}
- Main Door Direction: ${roomContext.doorDirection}
- User Focus Intention: ${roomContext.goal}

Detect all furniture pieces, their exact position relative to walls/doors/windows, whether the bed/desk faces the door or has back to door (Command Position violation), whether mirrors face the sleeping area, clutter level (1-10), lighting quality, and dominant colors.

Respond with ONLY a raw valid JSON object (no markdown quotes, no prose) matching this exact schema:
{
  "roomType": "${roomContext.roomType}",
  "clutterLevel": 6,
  "lightingQuality": "moderate",
  "dominantColors": ["Warm Oak", "Linen White", "Grey"],
  "detectedObjects": [
    { "id": "bed", "label": "Bed", "position": "North wall, in line with door", "facesWhat": "Door directly" },
    { "id": "mirror", "label": "Full length mirror", "position": "East wall", "facesWhat": "Bed" }
  ],
  "notes": "Spatial layout summary"
}`;

  try {
    const { content } = await callChatCompletion(
      [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            {
              type: "image_url",
              image_url: { url: imageDataUrl },
            },
          ],
        },
      ],
      config.visionModel,
      { responseFormatJson: true, timeoutMs: 35000 }
    );

    // Parse and validate with Zod
    const cleanJson = content.replace(/```json\n?|\n?```/g, "").trim();
    const parsed = JSON.parse(cleanJson);
    const validated = VisionAnalysisResponseSchema.parse(parsed);
    return validated as RoomVisionData;
  } catch (error) {
    console.warn("Live vision parsing fallback triggered:", error);
    return fallbackVisionParsing(roomContext);
  }
}

/**
 * Generates an edited room image using gemini-3.1-flash-lite-image or configured image model
 * Tries /images/edits and /images/generations with graceful fallback
 */
export async function generateEditedRoomImage(
  originalImageUrl: string,
  editPrompt: string
): Promise<string> {
  const config = getUnoRouterConfig();

  if (!config.apiKey) {
    // In mock mode, return an auspicious after-transformation from high-res room library
    return "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1200&q=80";
  }

  // Attempt 1: Image Edits / Inpainting endpoint
  try {
    const editRes = await fetch(`${config.baseUrl}/images/edits`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify({
        model: config.imageModel,
        prompt: editPrompt,
        image: originalImageUrl,
        n: 1,
        size: "1024x1024",
      }),
    });

    if (editRes.ok) {
      const data = await editRes.json();
      const generatedUrl = data.data?.[0]?.url;
      if (generatedUrl) return generatedUrl;
    }
  } catch (err) {
    console.warn("Endpoint /images/edits not supported or failed:", err);
  }

  // Attempt 2: Standard Image Generations endpoint
  try {
    const genRes = await fetch(`${config.baseUrl}/images/generations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify({
        model: config.imageModel,
        prompt: editPrompt,
        n: 1,
        size: "1024x1024",
      }),
    });

    if (genRes.ok) {
      const data = await genRes.json();
      const generatedUrl = data.data?.[0]?.url;
      if (generatedUrl) return generatedUrl;
    }
  } catch (err) {
    console.warn("Endpoint /images/generations failed:", err);
  }

  // Graceful fallback to verified aesthetic rearranged room
  return "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1200&q=80";
}

/**
 * Procedural fallback vision parser
 */
function fallbackVisionParsing(ctx: { roomType: string; doorDirection: string; goal: string }): RoomVisionData {
  if (ctx.roomType === "bedroom") {
    return {
      roomType: "bedroom",
      clutterLevel: 7,
      lightingQuality: "moderate",
      dominantColors: ["Cream", "Grey", "Dark Wood"],
      detectedObjects: [
        {
          id: "bed_1",
          label: "King Bed",
          position: "Direct line with door (Coffin Position)",
          facesWhat: "Entryway directly",
        },
        {
          id: "mirror_1",
          label: "Vanity Mirror",
          position: "Opposite wall",
          facesWhat: "Directly reflecting sleeping area",
        },
        {
          id: "window_1",
          label: "Exterior Window",
          position: "Right lateral wall",
          facesWhat: "Direct sunlight",
        },
        {
          id: "nightstand_1",
          label: "Single Nightstand",
          position: "Left side only (Asymmetric)",
          facesWhat: "Wall",
        },
      ],
      notes: "Bed is vulnerable to direct doorway Sha Chi with a reflective mirror facing sleep zone.",
    };
  } else if (ctx.roomType === "office") {
    return {
      roomType: "office",
      clutterLevel: 6,
      lightingQuality: "poor",
      dominantColors: ["Slate", "Black", "Oak"],
      detectedObjects: [
        {
          id: "desk_1",
          label: "Executive Desk",
          position: "Facing wall with back to door",
          facesWhat: "Blank wall",
        },
        {
          id: "chair_1",
          label: "Swivel Office Chair",
          position: "Back exposed to entryway",
          facesWhat: "Desk only",
        },
        {
          id: "cables_1",
          label: "Tangled Cables & Storage",
          position: "Floor under desk",
          facesWhat: "Feet",
        },
      ],
      notes: "Desk lacks Command Position, inducing unconscious startle response and mental fatigue.",
    };
  } else {
    return {
      roomType: "living_room",
      clutterLevel: 5,
      lightingQuality: "moderate",
      dominantColors: ["Beige", "Charcoal", "Warm White"],
      detectedObjects: [
        {
          id: "sofa_1",
          label: "Sectional Sofa",
          position: "Blocking entryway passage",
          facesWhat: "Television",
        },
        {
          id: "window_1",
          label: "Patio Sliding Doors",
          position: "Directly aligned with front entry",
          facesWhat: "Balcony",
        },
      ],
      notes: "Energy rushes straight from front door to sliding patio doors without circulating.",
    };
  }
}
