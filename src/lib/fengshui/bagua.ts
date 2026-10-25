import { BaguaSector, CompassDirection, DecorSuggestion, FengShuiGoal, FiveElement } from "@/types";

export interface SectorDefinition {
  direction: CompassDirection;
  name: string;
  lifeArea: string;
  element: FiveElement;
  colors: string[];
  attributes: string[];
  remedies: string[];
}

export const BAGUA_MAP: Record<CompassDirection, SectorDefinition> = {
  N: {
    direction: "N",
    name: "Kan (Career & Life Path)",
    lifeArea: "Career, Ambition, Wisdom",
    element: "water",
    colors: ["Deep Blue", "Black", "Charcoal"],
    attributes: ["Flow", "Depth", "Adaptability"],
    remedies: ["Water fountain", "Wavy mirrors", "Dark blue accents", "Metal decor to nourish water"],
  },
  NE: {
    direction: "NE",
    name: "Gen (Knowledge & Spiritual Growth)",
    lifeArea: "Skills, Inner Wisdom, Meditation",
    element: "earth",
    colors: ["Terracotta", "Warm Beige", "Sandy Yellow"],
    attributes: ["Stillness", "Quiet focus", "Steadiness"],
    remedies: ["Bookshelf", "Natural crystals (Citrine/Clear Quartz)", "Ceramic pots", "Warm low-temperature lighting"],
  },
  E: {
    direction: "E",
    name: "Zhen (Family & Vitality)",
    lifeArea: "Health, Ancestry, New Beginnings",
    element: "wood",
    colors: ["Forest Green", "Jade", "Vibrant Teal"],
    attributes: ["Growth", "Renewal", "Spring energy"],
    remedies: ["Lush living indoor plants", "Botanical wall art", "Solid oak/bamboo wood frames"],
  },
  SE: {
    direction: "SE",
    name: "Xun (Wealth & Abundance)",
    lifeArea: "Prosperity, Financial Flow, Gratitude",
    element: "wood",
    colors: ["Emerald Green", "Purple", "Gold"],
    attributes: ["Expanding wealth", "Opportunity", "Fruitfulness"],
    remedies: ["Money tree (Pachira)", "Amethyst cluster", "Flowing brass coins", "Sunlight enhancement"],
  },
  S: {
    direction: "S",
    name: "Li (Fame & Recognition)",
    lifeArea: "Reputation, Passion, Visibility",
    element: "fire",
    colors: ["Crimson Red", "Coral", "Warm Amber"],
    attributes: ["Radiance", "Warmth", "Clarity"],
    remedies: ["Warm accent lamp", "Red scented candles", "Framed achievements", "Triangular or angular decor"],
  },
  SW: {
    direction: "SW",
    name: "Kun (Love & Relationships)",
    lifeArea: "Marriage, Partnership, Self-Love",
    element: "earth",
    colors: ["Rose Pink", "Peach", "Earthy Ochre"],
    attributes: ["Nurturing", "Receptivity", "Harmony"],
    remedies: ["Pairs of nightstands or cushions", "Rose quartz stone", "Warm paired lamps", "No single solitary figures"],
  },
  W: {
    direction: "W",
    name: "Dui (Creativity & Children)",
    lifeArea: "Joy, Innovation, Projects",
    element: "metal",
    colors: ["White", "Sterling Silver", "Pastels"],
    attributes: ["Clarity", "Sharpness", "Inspiration"],
    remedies: ["Metal framed gallery wall", "Round brass tray", "Art supplies or musical instruments"],
  },
  NW: {
    direction: "NW",
    name: "Qian (Helpful People & Travel)",
    lifeArea: "Mentors, Blessings, Global Opportunities",
    element: "metal",
    colors: ["Metallic Gold", "Titanium Grey", "Crisp White"],
    attributes: ["Leadership", "Protection", "Generosity"],
    remedies: ["Round silver bowl", "Travel photos / globe", "Wind chime with 6 hollow metal rods"],
  },
  UNKNOWN: {
    direction: "UNKNOWN",
    name: "Tai Chi (Center - Equilibrium)",
    lifeArea: "Core Health & Harmonious Chi",
    element: "earth",
    colors: ["Earthy Yellow", "Sand", "Cream"],
    attributes: ["Centering", "Groundedness"],
    remedies: ["Central round rug", "Keep center floor uncluttered for free Chi circulation"],
  },
};

/**
 * Returns primary element and lucky colors based on the user's focus goal
 */
export function getGoalAuspiciousProfile(goal: FengShuiGoal): {
  targetDirection: CompassDirection;
  primaryElement: FiveElement;
  luckyColors: string[];
  keyActions: string[];
} {
  switch (goal) {
    case "money":
      return {
        targetDirection: "SE",
        primaryElement: "wood",
        luckyColors: ["Jade Green", "Royal Purple", "Gold", "Navy Blue"],
        keyActions: [
          "Activate the Southeast corner with living water or healthy broad-leaf plants.",
          "Ensure front door has an unblocked, welcoming threshold with zero shoes cluttering the entryway.",
          "Place a brass singing bowl or citrine cluster in the wealth sector.",
        ],
      };
    case "sleep":
      return {
        targetDirection: "SW",
        primaryElement: "earth",
        luckyColors: ["Soft Taupe", "Warm Linen", "Dusty Rose", "Sage Green"],
        keyActions: [
          "Anchor bed with a solid headboard against an unbroken solid wall (no windows behind head).",
          "Remove or cover mirrors that directly face you while lying in bed.",
          "Eliminate under-bed storage clutter so restful Yin Chi can circulate freely.",
        ],
      };
    case "love":
      return {
        targetDirection: "SW",
        primaryElement: "earth",
        luckyColors: ["Blush Pink", "Warm Terracotta", "Cream", "Peach"],
        keyActions: [
          "Establish balance with matched pairs (two bedside tables, two reading lamps, twin pillows).",
          "Clear away solitary or melancholic imagery in favor of warm, inviting art.",
          "Ensure equal walking access to both sides of the bed (no wall-pinned mattress).",
        ],
      };
    case "career":
      return {
        targetDirection: "N",
        primaryElement: "water",
        luckyColors: ["Midnight Blue", "Charcoal", "Metallic Silver", "Deep Teal"],
        keyActions: [
          "Position your work desk in the Command Position: facing the door diagonally with a solid wall behind you.",
          "Avoid sitting with your back exposed to the entrance or open hallway.",
          "Introduce a clear quartz point or small bubbling water fountain in the North sector.",
        ],
      };
    case "health":
    default:
      return {
        targetDirection: "E",
        primaryElement: "wood",
        luckyColors: ["Forest Green", "Earth Brown", "Warm Ochre", "Off-White"],
        keyActions: [
          "Open window airways each morning to flush stagnant Chi (Sha Chi).",
          "Introduce air-purifying plants (Snake Plant, ZZ Plant, Peace Lily) with soft rounded leaves.",
          "Keep the Tai Chi (physical center of the room) completely open and clear of heavy furniture.",
        ],
      };
  }
}

/**
 * Generates tailored decor suggestions based on room elements and goal
 */
export function generateDecorSuggestions(
  goal: FengShuiGoal,
  doorDir: CompassDirection
): DecorSuggestion[] {
  const goalProfile = getGoalAuspiciousProfile(goal);
  const doorSector = BAGUA_MAP[doorDir] || BAGUA_MAP["N"];

  return [
    {
      item: "Air-purifying Rounded Plant (e.g. ZZ Plant or Money Tree)",
      element: "wood",
      placement: `${BAGUA_MAP["SE"].direction} (Wealth corner) or near doorway`,
      purpose: "Nourishes vibrant Sheng Chi energy and filters environmental toxins",
      color: "Deep Jade Green",
    },
    {
      item: "Warm Ceramic / Clay Lamp with Soft Linen Shade",
      element: "earth",
      placement: "Bedside or Southwest partnership corner",
      purpose: "Grounds erratic energy, provides emotional stability and restful sleep",
      color: "Warm Cream / Terracotta",
    },
    {
      item: "Solid Brass Singing Bowl or Circular Metal Tray",
      element: "metal",
      placement: `${BAGUA_MAP["NW"].direction} (Helpful People sector) or desk`,
      purpose: "Sharpens mental clarity, disperses stagnant Chi, and attracts benefactor luck",
      color: "Brushed Champagne Gold",
    },
    {
      item: "Natural Crystal Cluster (Amethyst or Rose Quartz)",
      element: "earth",
      placement: goal === "love" ? "Southwest corner" : "Desk right corner",
      purpose: "Transmutes heavy vibration into calm, harmonious interpersonal attraction",
      color: goal === "love" ? "Soft Rose" : "Lavender Violet",
    },
    {
      item: "Oval Woven Natural Jute Rug",
      element: "earth",
      placement: "Room center (Tai Chi) or under bed foot",
      purpose: "Softens sharp floor edges, anchors Chi flow, and slows down rushed energy lines",
      color: "Natural Warm Sand",
    },
  ];
}
