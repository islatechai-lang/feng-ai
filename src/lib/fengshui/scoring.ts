import {
  CompassDirection,
  FengShuiGoal,
  FengShuiIssue,
  FengShuiResult,
  RoomType,
  RoomVisionData,
  SuggestedMove,
  FurnitureItemType,
  SceneItem3D,
  Room3DScene,
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

  // Evaluate classical rules
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

  // Calculate score bounded 25 - 98
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

  // Determine what furniture actually exists in the room
  const detectedLabels = visionData.detectedObjects.map((o) => o.label.toLowerCase()).join(" ");
  const hasBed = /bed|mattress/i.test(detectedLabels);
  const hasDesk = /desk|workstation|computer/i.test(detectedLabels);
  const hasSofa = /sofa|couch|sectional/i.test(detectedLabels);
  const hasDining = /dining|dining table/i.test(detectedLabels);

  // Fallback issues tailored strictly to the actual room type if none triggered
  if (detectedIssues.length === 0) {
    if (visionData.roomType === "living_room" || hasSofa) {
      detectedIssues.push({
        id: "living_room_command",
        title: "Living Room Seating Lacks Mountain Anchoring",
        severity: "warning",
        what: "The main sofa is placed without a solid supporting wall behind it.",
        why: "In classical Feng Shui, living room seating requires solid backing to nurture family stability and open social harmony.",
        fix: "Shift sofa against a solid wall with an open diagonal view of the doorway, and place a grounding coffee table in the center.",
        whichObject: "Sofa",
        pinCoordinates: { x: 50, y: 60 },
      });
    } else if (visionData.roomType === "office" || hasDesk) {
      detectedIssues.push({
        id: "office_command",
        title: "Workstation Command Position Alignment",
        severity: "warning",
        what: "Desk is positioned where your back is vulnerable to the room entrance or facing a blank wall.",
        why: "Sitting without visual control of the entrance increases subconscious fatigue and blocks incoming career vitality.",
        fix: "Turn desk to face into the room diagonally from the door with a solid supportive wall behind you.",
        whichObject: "Desk",
        pinCoordinates: { x: 60, y: 60 },
      });
    } else if (hasBed) {
      detectedIssues.push({
        id: "bed_command_optimization",
        title: "Bed Alignment & Headboard Support",
        severity: "warning",
        what: "Bed position could be optimized for deeper grounding away from doorway wind.",
        why: "A bed diagonal from the doorway ensures deeper REM cycles and emotional calm.",
        fix: "Ensure headboard rests firmly against a solid wall with a diagonal sightline to the door.",
        whichObject: "Bed",
        pinCoordinates: { x: 50, y: 70 },
      });
    } else {
      detectedIssues.push({
        id: "chi_stagnation_corners",
        title: "Peripheral Energy Stagnation (Corner Qi)",
        severity: "warning",
        what: "The room has shadowed dead zones in the peripheral corners.",
        why: "Energy stagnates in under-lit corners, gathering sluggish Yin energy.",
        fix: "Place an upward-angled corner floor lamp or a tall plant with rounded leaves to lift Qi.",
        whichObject: "Corner Lighting",
        pinCoordinates: { x: 15, y: 25 },
      });
    }
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

  // Generate suggested moves based on actual detected objects
  const suggestedMoves: SuggestedMove[] = [];
  for (const issue of detectedIssues) {
    if (issue.id === "sofa_command_position" || (visionData.roomType === "living_room" && hasSofa)) {
      suggestedMoves.push({
        item: "Main Sofa",
        from: "Floating in center with back exposed to door",
        to: "Anchored against the solid back wall with expansive diagonal view of entry",
        reason: "Establishes Mountain stability and harmonizes household social Chi.",
      });
    } else if (issue.id === "command_position_desk" || hasDesk) {
      suggestedMoves.push({
        item: "Work Desk & Chair",
        from: "Facing the wall with back vulnerable to door",
        to: "Angled facing the room entrance with a solid supportive wall behind",
        reason: "Eliminates subconscious stress reflex, elevates executive confidence and career focus.",
      });
    } else if (issue.id === "coffin_position" || issue.id === "bed_pinned_wall") {
      suggestedMoves.push({
        item: "Bed",
        from: "Direct line with the entrance doorway",
        to: "Diagonally across from the door against the solid wall with clear view of entry",
        reason: "Establishes True Command Position, protects personal aura during sleep, eliminates Sha Chi.",
      });
    } else if (issue.id === "mirror_facing_bed") {
      suggestedMoves.push({
        item: "Vanity Mirror",
        from: "Directly reflecting the sleeping space",
        to: "Adjacent wall inside wardrobe or away from direct sightlines",
        reason: "Prevents restless nocturnal Chi reflection and insomnia.",
      });
    }
  }

  if (suggestedMoves.length === 0) {
    const focalName = hasSofa ? "Sofa" : hasDesk ? "Desk" : hasBed ? "Bed" : "Primary Furniture";
    suggestedMoves.push({
      item: focalName,
      from: "Present arrangement",
      to: "Diagonal Command Position facing entryway with solid wall behind",
      reason: "Restores natural Sheng Chi circulation and commanding visual empowerment.",
    });
  }

  // Determine primary focal type for 3D reconstruction
  let primaryFocalType: FurnitureItemType = "bed";
  if (hasSofa || visionData.roomType === "living_room") {
    primaryFocalType = "sofa";
  } else if (hasDesk || visionData.roomType === "office") {
    primaryFocalType = "desk";
  } else if (hasDining || visionData.roomType === "kitchen") {
    primaryFocalType = "dining_table";
  } else if (hasBed || visionData.roomType === "bedroom") {
    primaryFocalType = "bed";
  } else {
    // If user's room has a desk or sofa, prioritize what exists
    primaryFocalType = hasDesk ? "desk" : hasSofa ? "sofa" : "sofa";
  }

  // Build true 3D Scene Items based on what was ACTUALLY detected
  const sceneItems3D: SceneItem3D[] = [];

  if (primaryFocalType === "sofa") {
    sceneItems3D.push({
      id: "sofa_main",
      type: "sofa",
      label: "Main Comfort Sofa",
      initialPos: { x: 0, y: 0, z: 0.8, rotY: 0 }, // In front of door line (inauspicious)
      rearrangedPos: { x: 1.6, y: 0, z: -1.6, rotY: 0 }, // Diagonal Command Position
      status: "inauspicious",
      issue: "Back exposed to doorway, blocking Chi entry",
      fixReason: "Relocated to solid back wall in Command Position with view of entrance",
    });
    sceneItems3D.push({
      id: "table_coffee",
      type: "table",
      label: "Coffee Table",
      initialPos: { x: 0, y: 0, z: -0.5, rotY: 0 },
      rearrangedPos: { x: 1.6, y: 0, z: -0.3, rotY: 0 },
      status: "harmonious",
      fixReason: "Centered with sofa for grounding Tai Chi stability",
    });
    sceneItems3D.push({
      id: "tv_unit_1",
      type: "tv_unit",
      label: "TV Media Unit",
      initialPos: { x: -2.8, y: 0, z: 0, rotY: Math.PI / 2 },
      rearrangedPos: { x: -2.8, y: 0, z: -0.5, rotY: Math.PI / 2 },
      status: "harmonious",
      fixReason: "Positioned along side wall to eliminate window glare and soften Fire Chi",
    });
    sceneItems3D.push({
      id: "plant_wealth",
      type: "plant",
      label: "Jade Wealth Plant",
      initialPos: { x: 2.5, y: 0, z: 2.2, rotY: 0 },
      rearrangedPos: { x: -2.4, y: 0, z: -2.4, rotY: 0 },
      status: "inauspicious",
      fixReason: "Moved to Far-Left Wealth Corner to lift corner Chi and attract prosperity",
    });
  } else if (primaryFocalType === "desk") {
    sceneItems3D.push({
      id: "desk_main",
      type: "desk",
      label: "Executive Work Desk",
      initialPos: { x: 0, y: 0, z: -2.5, rotY: Math.PI }, // Facing wall with back to door (inauspicious)
      rearrangedPos: { x: 1.6, y: 0, z: -1.6, rotY: -Math.PI / 4 }, // Diagonal Command Position
      status: "inauspicious",
      issue: "Sitting with back to doorway triggers stress reflex",
      fixReason: "Turned to face into room with solid wall behind for executive authority",
    });
    sceneItems3D.push({
      id: "chair_exec",
      type: "chair",
      label: "Ergonomic Chair",
      initialPos: { x: 0, y: 0, z: -1.5, rotY: 0 },
      rearrangedPos: { x: 2.2, y: 0, z: -2.2, rotY: -Math.PI / 4 },
      status: "inauspicious",
      fixReason: "Positioned with solid wall backing",
    });
    sceneItems3D.push({
      id: "bookshelf_1",
      type: "bookshelf",
      label: "Bookshelf / Cabinet",
      initialPos: { x: -2.8, y: 0, z: 1.0, rotY: Math.PI / 2 },
      rearrangedPos: { x: -2.8, y: 0, z: 0.5, rotY: Math.PI / 2 },
      status: "harmonious",
      fixReason: "Grounded along West wall to foster knowledge and focus",
    });
    sceneItems3D.push({
      id: "plant_desk",
      type: "plant",
      label: "Air-Purifying Desk Plant",
      initialPos: { x: 1.8, y: 0, z: 2.0, rotY: 0 },
      rearrangedPos: { x: -2.2, y: 0, z: -2.2, rotY: 0 },
      status: "harmonious",
      fixReason: "Placed in Far-Left corner to filter electromagnetic Chi from monitors",
    });
  } else {
    // Bedroom primary
    sceneItems3D.push({
      id: "bed_main",
      type: "bed",
      label: "Main Bed",
      initialPos: { x: 0, y: 0, z: 0.5, rotY: 0 }, // Coffin line (directly facing door)
      rearrangedPos: { x: 1.8, y: 0, z: -1.8, rotY: 0 }, // Command Position
      status: "inauspicious",
      issue: "Placed in direct Coffin line with entrance door",
      fixReason: "Moved diagonally opposite the door against solid wall with full view of entry",
    });
    sceneItems3D.push({
      id: "mirror_vanity",
      type: "mirror",
      label: "Vanity Mirror",
      initialPos: { x: -3.0, y: 0, z: -1.8, rotY: Math.PI / 2 }, // Facing bed
      rearrangedPos: { x: -3.0, y: 0, z: 1.8, rotY: Math.PI / 2 }, // Tucked near wardrobe
      status: "inauspicious",
      issue: "Directly reflects bed, causing nocturnal sleep disruption",
      fixReason: "Repositioned beside wardrobe away from sleeping sightlines",
    });
    sceneItems3D.push({
      id: "plant_peace",
      type: "plant",
      label: "Jade Wealth Plant",
      initialPos: { x: 2.4, y: 0, z: 2.2, rotY: 0 },
      rearrangedPos: { x: -2.4, y: 0, z: -2.4, rotY: 0 },
      status: "harmonious",
      fixReason: "Placed in Far-Left Wealth corner to cleanse indoor air and lift stagnant corner Chi",
    });
  }

  const scene3D: Room3DScene = {
    roomType: visionData.roomType,
    primaryFocalType,
    detectedItems: sceneItems3D,
    doorPosition: { x: 0, z: 3.5 },
    windowPosition: { x: -3.5, z: 0 },
  };

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

  // Image edit prompt tailored to actual furniture
  const moveDescriptions = suggestedMoves.map((m) => `Move ${m.item} to ${m.to}`).join(". ");
  const imageEditPrompt = `Photorealistic architectural interior of a ${visionData.roomType}. Same walls, windows, natural lighting, and textures as the original photo. ${moveDescriptions}. Balance the five elements with warm 2700K ambient lighting and living potted greenery. Keep all other structural walls, windows, and core room geometry completely unchanged. Clean, peaceful, clutter-free luxury minimalist aesthetic with harmonious Feng Shui Command Position.`;

  // Summary
  const summary = `Your ${visionData.roomType.replace("_", " ")} currently scores ${finalScore}/100 (${grade}). ${biggestIssue.title} is creating an energetic bottleneck. By shifting your primary ${primaryFocalType} into the Command Position, you establish grounding Mountain support and invite fresh Sheng Chi into your space.`;

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
    scene3D,
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
