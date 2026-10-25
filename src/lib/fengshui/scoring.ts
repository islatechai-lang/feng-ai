import {
  CompassDirection,
  FengShuiGoal,
  FengShuiIssue,
  FengShuiResult,
  RoomType,
  RoomVisionData,
  SuggestedMove,
} from "@/types";
import { BAGUA_MAP, generateDecorSuggestions, getGoalAuspiciousProfile } from "./bagua";
import { calculateKua } from "./kua";
import { CLASSICAL_RULES, RuleEvaluationContext } from "./rules";

export function evaluateFengShui(
  visionData: RoomVisionData,
  doorDirection: CompassDirection,
  goal: FengShuiGoal,
  birthYear?: number
): FengShuiResult {
  const ctx: RuleEvaluationContext = {
    roomType: visionData.roomType,
    doorDirection,
    clutterLevel: visionData.clutterLevel,
    detectedObjects: visionData.detectedObjects,
    lighting: visionData.lightingQuality,
    colors: visionData.dominantColors,
  };

  // Evaluate rules
  const detectedIssues: FengShuiIssue[] = [];
  let scoreDeduction = 0;

  for (const rule of CLASSICAL_RULES) {
    const issue = rule.check(ctx);
    if (issue) {
      detectedIssues.push(issue);
      scoreDeduction += rule.penalty;
    }
  }

  // Clutter penalty baseline
  if (visionData.clutterLevel > 4) {
    scoreDeduction += (visionData.clutterLevel - 4) * 3;
  }

  // Poor lighting penalty
  if (visionData.lightingQuality === "poor") {
    scoreDeduction += 8;
  }

  // Calculate score bounded 15 - 98
  let rawScore = 96 - scoreDeduction;
  if (rawScore < 25) rawScore = 25;
  if (rawScore > 98) rawScore = 98;
  const finalScore = Math.round(rawScore);

  // Grade calculation
  let grade: FengShuiResult["grade"] = "B";
  if (finalScore >= 90) grade = "A+";
  else if (finalScore >= 80) grade = "A";
  else if (finalScore >= 70) grade = "B";
  else if (finalScore >= 58) grade = "C";
  else if (finalScore >= 45) grade = "D";
  else grade = "F";

  // If no critical issues detected from generic parsing, populate realistic contextual issues
  if (detectedIssues.length === 0) {
    detectedIssues.push({
      id: "chi_stagnation_corners",
      title: "Inactive Qi in Peripheral Corners",
      severity: "warning",
      what: "The room has shadowed dead zones in the peripheral corners.",
      why: "Energy stagnates in under-lit 90-degree corners, gathering sluggish Yin energy.",
      fix: "Place an upward-angled corner floor lamp or a tall plant with rounded leaves to lift Qi.",
      whichObject: "Corner Lighting",
      pinCoordinates: { x: 15, y: 25 },
    });
    detectedIssues.push({
      id: "balance_five_elements",
      title: "Five-Element Color Imbalance",
      severity: "info",
      what: "The space leans heavily towards monochrome or cool tones without grounding warm tones.",
      why: "A balanced space requires subtle representation of all five elements (Wood, Fire, Earth, Metal, Water).",
      fix: "Introduce warm earthy terracotta cushions, warm 2700K lighting, and living plants.",
      whichObject: "Palette Accents",
      pinCoordinates: { x: 80, y: 40 },
    });
  }

  // Identify #1 biggest problem
  const critical = detectedIssues.find((i) => i.severity === "critical");
  const biggestIssue = critical || detectedIssues[0];

  const biggestProblem = {
    title: biggestIssue.title,
    description: biggestIssue.what + " " + biggestIssue.why,
    quickFix: biggestIssue.fix,
    severity: biggestIssue.severity,
  };

  // Generate suggested moves
  const suggestedMoves: SuggestedMove[] = [];
  for (const issue of detectedIssues) {
    if (issue.id === "coffin_position" || issue.id === "bed_pinned_wall") {
      suggestedMoves.push({
        item: "Bed",
        from: "Direct line with the entrance doorway",
        to: "Diagonally across from the door against the solid North-East wall with clear view of entry",
        reason: "Establishes True Command Position, protects personal aura during sleep, eliminates Sha Chi.",
      });
    } else if (issue.id === "command_position_desk") {
      suggestedMoves.push({
        item: "Work Desk & Chair",
        from: "Facing the wall with back vulnerable to door",
        to: "Angled facing the room entrance with a solid supportive wall behind",
        reason: "Eliminates subconscious stress reflex, elevates executive confidence and career focus.",
      });
    } else if (issue.id === "mirror_facing_bed") {
      suggestedMoves.push({
        item: "Vanity / Floor Mirror",
        from: "Directly reflecting the mattress",
        to: "Adjacent wall inside wardrobe or beside door away from sleep sightlines",
        reason: "Prevents restless nocturnal Chi reflection and insomnia.",
      });
    }
  }

  if (suggestedMoves.length === 0) {
    suggestedMoves.push({
      item: "Main Focal Furniture",
      from: "Present arrangement",
      to: "Command Position facing entryway diagonally",
      reason: "Optimizes natural energy flow and visual empowerment.",
    });
  }

  // Kua info if birth year provided
  const kuaInfo = birthYear ? calculateKua(birthYear) : undefined;
  const goalProfile = getGoalAuspiciousProfile(goal);
  const decorSuggestions = generateDecorSuggestions(goal, doorDirection);

  // Lucky directions
  const luckyDirections: CompassDirection[] = kuaInfo
    ? [
        kuaInfo.luckyDirections.shengChi,
        kuaInfo.luckyDirections.tianYi,
        kuaInfo.luckyDirections.yanNian,
        kuaInfo.luckyDirections.fuWei,
      ]
    : [goalProfile.targetDirection, "SE", "S", "E"];

  // Image edit prompt
  const moveDescriptions = suggestedMoves.map((m) => `Move ${m.item} to ${m.to}`).join(". ");
  const imageEditPrompt = `Photorealistic, clean, peaceful room interior. Same architectural room, walls, floor, windows and natural lighting as the original photo. ${moveDescriptions}. Declutter all floor surfaces. Remove harsh reflective angles facing the bed. Add warm ambient 2700K lamp lighting and one vibrant potted plant. Keep all other structural walls, windows, and core room geometry completely unchanged. Highly aesthetic, serene, balanced feng shui harmony.`;

  // Summary
  const summary = `Your room currently scores ${finalScore}/100 (${grade}). While the space holds great structural potential, ${biggestIssue.title.toLowerCase()} is creating a significant energetic bottleneck that disrupts your ${goal} intention. By implementing the Command Position layout and introducing stabilizing ${goalProfile.primaryElement} elements, you will restore harmonious Sheng Chi flow.`;

  // 9 Bagua sectors
  const baguaSectors = Object.values(BAGUA_MAP).map((sec) => ({
    direction: sec.direction,
    name: sec.name,
    lifeArea: sec.lifeArea,
    element: sec.element,
    colors: sec.colors,
    recommendation: sec.remedies[0],
  }));

  return {
    score: finalScore,
    grade,
    summary,
    biggestProblem,
    issues: detectedIssues,
    suggestedMoves,
    imageEditPrompt,
    luckyGuide: {
      primaryElement: goalProfile.primaryElement,
      luckyColors: goalProfile.luckyColors,
      luckyDirections,
      baguaSectors,
      kuaInfo,
      decorSuggestions,
    },
  };
}
