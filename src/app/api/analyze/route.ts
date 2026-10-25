import { NextRequest, NextResponse } from "next/server";
import { runFengShuiPipeline } from "@/lib/ai/pipeline";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { imageDataUrl, roomType, doorDirection, goal, birthYear } = body;

    if (!imageDataUrl) {
      return NextResponse.json(
        { error: "Image data is required" },
        { status: 400 }
      );
    }

    // Run 5-step AI pipeline
    const startTime = Date.now();
    const pipelineOutput = await runFengShuiPipeline({
      imageDataUrl,
      roomType: roomType || "bedroom",
      doorDirection: doorDirection || "UNKNOWN",
      goal: goal || "sleep",
      birthYear: birthYear ? parseInt(birthYear) : undefined,
    });
    const durationMs = Date.now() - startTime;

    const analysisId = "analysis_" + Math.random().toString(36).substring(2, 11);

    // Save to Supabase if configured
    const supabase = getSupabaseServerClient();
    if (supabase) {
      try {
        await supabase.from("analyses").insert({
          id: analysisId,
          room_type: roomType,
          door_direction: doorDirection,
          goal,
          birth_year: birthYear ? parseInt(birthYear) : null,
          input_image_path: imageDataUrl.substring(0, 50) + "...",
          score: pipelineOutput.result.score,
          result_json: pipelineOutput.result,
          status: "completed",
          is_unlocked: false,
        });

        // Record usage log
        await supabase.from("usage_logs").insert({
          analysis_id: analysisId,
          step: "reasoning",
          model: process.env.REASONING_MODEL || "qwen3.6-35b-a3b:free",
          duration_ms: durationMs,
          cost_estimate: 0.0012,
        });
      } catch (dbErr) {
        console.warn("Supabase record write skipped:", dbErr);
      }
    }

    // Return result
    return NextResponse.json({
      success: true,
      analysisId,
      result: pipelineOutput.result,
      originalImageUrl: pipelineOutput.originalImageUrl,
      editedImageUrl: pipelineOutput.editedImageUrl,
      svgBefore: pipelineOutput.svgBefore,
      svgAfter: pipelineOutput.svgAfter,
      isUnlocked: false,
    });
  } catch (error: any) {
    console.error("Analysis pipeline error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to analyze room" },
      { status: 500 }
    );
  }
}
