import { CompassDirection, FengShuiGoal, RoomType } from "@/types";

export interface SampleRoom {
  id: string;
  name: string;
  roomType: RoomType;
  doorDirection: CompassDirection;
  goal: FengShuiGoal;
  birthYear: number;
  previewUrl: string;
  afterUrl: string;
  score: number;
  grade: "A+" | "A" | "B" | "C" | "D" | "F";
  problemSummary: string;
  description: string;
}

export const SAMPLE_ROOMS: SampleRoom[] = [
  {
    id: "bedroom-coffin",
    name: "Master Bedroom with Bed in Line of Door",
    roomType: "bedroom",
    doorDirection: "SW",
    goal: "sleep",
    birthYear: 1992,
    previewUrl: "https://images.unsplash.com/photo-1540518614846-7ede433c4570?auto=format&fit=crop&w=1200&q=80",
    afterUrl: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1200&q=80",
    score: 54,
    grade: "D",
    problemSummary: "Bed in direct alignment with bedroom door ('Coffin Position') + mirror reflecting mattress.",
    description: "The bed is situated straight across the bedroom door, leaving the occupant vulnerable to rushing nocturnal Chi. A large dresser mirror amplifies insomnia by bouncing light directly onto the bed.",
  },
  {
    id: "office-command",
    name: "Home Office with Back to Room Entrance",
    roomType: "office",
    doorDirection: "N",
    goal: "career",
    birthYear: 1988,
    previewUrl: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80",
    afterUrl: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=1200&q=80",
    score: 61,
    grade: "C",
    problemSummary: "Work chair sits with back exposed to doorway; screen hidden from natural light.",
    description: "Sitting facing a blank wall with an open door behind the chair creates subconscious tension and constant distraction, severely impeding deep executive focus and leadership Chi.",
  },
  {
    id: "living-chi-rush",
    name: "Apartment Living Room with Blocked Chi Flow",
    roomType: "living_room",
    doorDirection: "SE",
    goal: "money",
    birthYear: 1995,
    previewUrl: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80",
    afterUrl: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80",
    score: 68,
    grade: "C",
    problemSummary: "Door-to-window rushing energy + entryway shoes blocking the Wealth sector.",
    description: "Entering energy shoots straight past the sofa and out through the large balcony doors without circulating, symbolizing incoming wealth quickly draining out of the household.",
  },
];
