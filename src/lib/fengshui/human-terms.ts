import { CompassDirection, FengShuiGoal } from "@/types";

export interface HumanSpatialZone {
  code: CompassDirection;
  humanTitle: string; // e.g. "Far-Left Corner"
  roomPerspective: string; // "When standing at your doorway looking into the room"
  lifeArea: string; // "Wealth & Money Flow"
  whatToDo: string; // Plain English instruction
  whatToAvoid: string; // Plain English warning
  colorPill: string;
}

/**
 * Translates classical compass directions into intuitive everyday room locations
 * based on the entrance doorway perspective so anyone can immediately understand without jargon.
 */
export const SPATIAL_ZONES: Record<CompassDirection, HumanSpatialZone> = {
  SE: {
    code: "SE",
    humanTitle: "Far-Left Corner",
    roomPerspective: "Look at the back-left corner from your doorway",
    lifeArea: "Wealth, Abundance & Income",
    whatToDo: "Place a healthy round-leaf plant (like a Jade plant or Money Tree), a warm lamp, or your valuables here.",
    whatToAvoid: "Never leave trash cans, laundry piles, or broken items in this corner.",
    colorPill: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
  },
  S: {
    code: "S",
    humanTitle: "Far Center Wall",
    roomPerspective: "The center of the wall directly across from your door",
    lifeArea: "Reputation, Energy & Confidence",
    whatToDo: "Use warm ambient lighting, inspiring art, or warm earthy/terracotta tones.",
    whatToAvoid: "Avoid dark shadowed corners or heavy black/water decor.",
    colorPill: "text-amber-400 bg-amber-500/10 border-amber-500/30",
  },
  SW: {
    code: "SW",
    humanTitle: "Far-Right Corner",
    roomPerspective: "The back-right corner across from your doorway",
    lifeArea: "Love, Relationships & Partnership",
    whatToDo: "Keep things in pairs: 2 matching nightstands, 2 warm lamps, soft cozy textures.",
    whatToAvoid: "Avoid solitary portraits, single pillows, or sharp thorny cacti.",
    colorPill: "text-rose-400 bg-rose-500/10 border-rose-500/30",
  },
  E: {
    code: "E",
    humanTitle: "Left-Hand Wall",
    roomPerspective: "The entire wall on your left side as you enter",
    lifeArea: "Health, Vitality & Family Harmony",
    whatToDo: "Add living green plants, wooden furniture, and plenty of natural daylight.",
    whatToAvoid: "Avoid heavy, sharp metallic clutter that creates harsh cutting energy.",
    colorPill: "text-teal-400 bg-teal-500/10 border-teal-500/30",
  },
  W: {
    code: "W",
    humanTitle: "Right-Hand Wall",
    roomPerspective: "The entire wall on your right side as you enter",
    lifeArea: "Creativity, Projects & Joy",
    whatToDo: "Clean white, brass, metallic accents, cozy rugs, framed achievements.",
    whatToAvoid: "Excessive red candles or clutter that scatters focus.",
    colorPill: "text-cyan-400 bg-cyan-500/10 border-cyan-500/30",
  },
  NE: {
    code: "NE",
    humanTitle: "Front-Left Corner",
    roomPerspective: "Near the door on your left side as you walk in",
    lifeArea: "Study, Wisdom & Inner Calm",
    whatToDo: "Great spot for bookshelves, a reading chair, crystals, or meditation corner.",
    whatToAvoid: "Don't pile dirty laundry, shoes, or clutter here.",
    colorPill: "text-indigo-400 bg-indigo-500/10 border-indigo-500/30",
  },
  N: {
    code: "N",
    humanTitle: "Doorway Wall",
    roomPerspective: "The wall surrounding your room entrance door",
    lifeArea: "Career, Purpose & Opportunities",
    whatToDo: "Keep the doorway pathway completely clear so fresh energy flows into the room effortlessly.",
    whatToAvoid: "Never block the door swing with bags, hampers, or furniture.",
    colorPill: "text-blue-400 bg-blue-500/10 border-blue-500/30",
  },
  NW: {
    code: "NW",
    humanTitle: "Front-Right Corner",
    roomPerspective: "Near the door on your right side as you walk in",
    lifeArea: "Helpful Mentors, Networking & Travel",
    whatToDo: "Metallic decor, clean minimalist nightstand, organizers, travel mementos.",
    whatToAvoid: "Cluttered cords, broken chargers, or chaotic storage.",
    colorPill: "text-slate-300 bg-slate-500/10 border-slate-500/30",
  },
  UNKNOWN: {
    code: "UNKNOWN",
    humanTitle: "Diagonal Command Corner",
    roomPerspective: "Diagonally across from the entrance door",
    lifeArea: "Universal Command & Rest",
    whatToDo: "Place your headboard against a solid wall with a clear diagonal sightline to the door.",
    whatToAvoid: "Never sleep with your feet pointing directly out the open doorway.",
    colorPill: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
  },
};

/**
 * Returns a human-friendly plain-English description of any direction or location
 */
export function getHumanSpatialZone(direction: CompassDirection | string): HumanSpatialZone {
  const key = (direction || "SE").toUpperCase() as CompassDirection;
  return SPATIAL_ZONES[key] || SPATIAL_ZONES.SE;
}

/**
 * Plain English explanation of the #1 Rule: The Command Position
 */
export const COMMAND_POSITION_PLAIN_ENGLISH = {
  title: "The Golden Command Position",
  simpleRule: "You must be able to see who enters the room without being directly in front of the door.",
  whyItMatters: "When your bed or desk faces the door diagonally with a solid wall behind you, your brain relaxes deeply. If you sleep in line with the door or with your back to the door, your subconscious stays on guard all night, causing restless sleep and fatigue.",
  threeGoldenChecklist: [
    "Solid Wall: Your headboard or desk back is supported by a real wall (not floating in the middle or under a window).",
    "Clear View: You can see the bedroom door easily without twisting your neck.",
    "Out of the Wind Tunnel: You are NOT directly in line with the door swing.",
  ],
};
