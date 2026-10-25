import { FengShuiIssue, IssueSeverity } from "@/types";

export interface FengShuiRuleCheck {
  id: string;
  name: string;
  penalty: number; // points deducted if violated (0-100 scale)
  severity: IssueSeverity;
  check: (context: RuleEvaluationContext) => FengShuiIssue | null;
}

export interface RuleEvaluationContext {
  roomType: string;
  doorDirection: string;
  clutterLevel: number;
  detectedObjects: { id: string; label: string; position: string; facesWhat?: string }[];
  lighting: string;
  colors: string[];
}

export const CLASSICAL_RULES: FengShuiRuleCheck[] = [
  {
    id: "coffin_position",
    name: "The Coffin Position (Door-in-line Bed Alignment)",
    penalty: 25,
    severity: "critical",
    check: (ctx) => {
      const bed = ctx.detectedObjects.find((o) =>
        /bed|mattress/i.test(o.label)
      );
      if (!bed) return null;

      const isAlignedWithDoor =
        /in line with door|facing door directly|feet pointing to door|direct line with door/i.test(
          bed.position + " " + (bed.facesWhat || "")
        );

      if (isAlignedWithDoor || /coffin/i.test(bed.position)) {
        return {
          id: "coffin_position",
          title: "Critical: The 'Coffin Position' (Bed in Line with Door)",
          severity: "critical",
          what: "Your bed is placed directly in line with the entryway, with the feet or head pointing straight out the door.",
          why: "In classical Feng Shui, rushing energy (Sha Chi) enters violently through the doorway like a wind tunnel, striking your body while you sleep. This depletes vital life-force, sparks anxiety, and disrupts deep REM rejuvenation.",
          fix: "Shift the bed diagonally opposite the doorway against a solid wall. If the room layout physically prevents this, place a solid footboard, a high bench, or an opaque folding screen between the bed foot and the door.",
          whichObject: "Bed",
          pinCoordinates: { x: 50, y: 70 },
        };
      }
      return null;
    },
  },
  {
    id: "mirror_facing_bed",
    name: "Mirror Directly Reflecting Bed or Entry",
    penalty: 18,
    severity: "warning",
    check: (ctx) => {
      const mirror = ctx.detectedObjects.find((o) =>
        /mirror|reflective wardrobe|vanity mirror/i.test(o.label)
      );
      if (!mirror) return null;

      const reflectsBed = /facing bed|reflects bed|opposite bed|facing door/i.test(
        mirror.position + " " + (mirror.facesWhat || "")
      );

      if (reflectsBed || ctx.detectedObjects.some(o => /mirror facing bed/i.test(o.position))) {
        return {
          id: "mirror_facing_bed",
          title: "Mirror Reflecting the Sleeping Area",
          severity: "warning",
          what: "A full-length or dresser mirror directly reflects your bed while lying down.",
          why: "Mirrors are potent Water-element activators that continuously bounce energetic Chi around the space. When reflecting your body, they disrupt subconscious rest, encourage restless nightmares, and in partnerships can invite symbolic third-party intrusion.",
          fix: "Relocate the mirror to an adjacent wall so it never catches your reflection in bed, or cover it with a decorative linen throw before sleeping.",
          whichObject: "Mirror",
          pinCoordinates: { x: 25, y: 35 },
        };
      }
      return null;
    },
  },
  {
    id: "command_position_desk",
    name: "Desk Command Position Deficit",
    penalty: 20,
    severity: "critical",
    check: (ctx) => {
      const desk = ctx.detectedObjects.find((o) =>
        /desk|workstation|office table|computer/i.test(o.label)
      );
      if (!desk) return null;

      const backToDoor = /back to door|facing wall with back to door|facing window back to entry/i.test(
        desk.position + " " + (desk.facesWhat || "")
      );

      if (backToDoor) {
        return {
          id: "command_position_desk",
          title: "Workstation Lacks Command Position (Back to Entry)",
          severity: "critical",
          what: "Your office chair and desk force your back to face the room's main entrance.",
          why: "Sitting with your back exposed to an entrance triggers subconscious hyper-vigilance in the amygdala. Energetically, you cannot see incoming opportunities or threats, leading to workplace fatigue, surprise obstacles, and lower authority.",
          fix: "Angle your desk so you have a solid wall behind your chair and can clearly see anyone entering the room without turning your head more than 45 degrees.",
          whichObject: "Desk",
          pinCoordinates: { x: 75, y: 65 },
        };
      }
      return null;
    },
  },
  {
    id: "headboard_under_window",
    name: "Headboard Positioned Under Window",
    penalty: 15,
    severity: "warning",
    check: (ctx) => {
      const bed = ctx.detectedObjects.find((o) =>
        /bed|mattress/i.test(o.label)
      );
      if (!bed) return null;

      const underWindow = /under window|headboard at window|against window/i.test(
        bed.position + " " + (bed.facesWhat || "")
      );

      if (underWindow) {
        return {
          id: "headboard_under_window",
          title: "Vulnerable Headboard (Placed Beneath a Window)",
          severity: "warning",
          what: "The head of the bed is placed directly against or under an exterior window.",
          why: "In classical Feng Shui, the head requires a 'Tortoise Backing' (a solid, immovable wall) to cultivate psychological grounding and steady support from family and career. Windows cause drafty Chi leakage and subtle insecurity.",
          fix: "Move the bed to a solid interior partition wall. If immovable, install heavy blackout thermal curtains and secure a tall, solid wooden or upholstered headboard.",
          whichObject: "Headboard",
          pinCoordinates: { x: 50, y: 30 },
        };
      }
      return null;
    },
  },
  {
    id: "heavy_overhead_beam",
    name: "Oppressive Overhead Beam or Slanted Ceiling",
    penalty: 16,
    severity: "warning",
    check: (ctx) => {
      const beam = ctx.detectedObjects.find((o) =>
        /beam|slanted ceiling|soffit|overhead duct/i.test(o.label)
      );
      if (!beam) return null;

      return {
        id: "heavy_overhead_beam",
        title: "Oppressive Overhead Beam Pressure",
        severity: "warning",
        what: "An exposed architectural beam or acute ceiling slope hangs directly above the bed or desk.",
        why: "Structural beams create heavy downward pressure (cutting Chi) on whichever body part lies beneath them, frequently manifesting as morning headaches, neck tension, or chronic emotional burden.",
        fix: "Shift the bed or chair outside the beam's footprint. If unmovable, hang a soft fabric canopy or suspend two bamboo flutes angled at 45 degrees with red ribbon to redirect the upward lift.",
        whichObject: "Overhead Beam",
        pinCoordinates: { x: 48, y: 15 },
      };
    },
  },
  {
    id: "clutter_and_chi_choke",
    name: "Excessive Clutter & Obstructed Flow",
    penalty: 15,
    severity: "warning",
    check: (ctx) => {
      if (ctx.clutterLevel >= 6) {
        return {
          id: "clutter_and_chi_choke",
          title: "Stagnant Chi Accumulation (Clutter Level: High)",
          severity: ctx.clutterLevel >= 8 ? "critical" : "warning",
          what: "Excess piles, disordered floor pathways, or crammed surfaces are impeding natural airflow.",
          why: "Chi (vital life force) flows through a home like clean spring water. Clutter acts as a psychological dam, accumulating stagnant, muddy energy (Si Chi) that induces mental fog, procrastination, and delayed cash flow.",
          fix: "Free up 30% of flat floor and surface areas. Clear anything stored directly under the bed so air and energy can circulate unimpeded while you sleep.",
          whichObject: "Floor & Pathways",
          pinCoordinates: { x: 30, y: 80 },
        };
      }
      return null;
    },
  },
  {
    id: "door_window_chi_rush",
    name: "Direct Door-to-Window Chi Tunnel",
    penalty: 12,
    severity: "info",
    check: (ctx) => {
      const hasDoorWindowAlignment = ctx.detectedObjects.some((o) =>
        /door to window aligned|window opposite door|straight shot/i.test(o.position)
      );
      if (hasDoorWindowAlignment) {
        return {
          id: "door_window_chi_rush",
          title: "Chi Rush (Direct Door-to-Window Alignment)",
          severity: "info",
          what: "The room door opens directly in front of an unobstructed window opposite it.",
          why: "Good fortune and prosperity enter through the doorway, but escape immediately out the opposite window before nourishing the room, symbolizing money coming in and promptly slipping away.",
          fix: "Place a lush leafy plant, an attractive area rug, or hang sheer curtains on the window to slow down and diffuse Chi throughout the room.",
          whichObject: "Window Line",
          pinCoordinates: { x: 70, y: 20 },
        };
      }
      return null;
    },
  },
  {
    id: "bed_pinned_wall",
    name: "Bed Pinned Against Side Wall",
    penalty: 10,
    severity: "info",
    check: (ctx) => {
      if (ctx.roomType !== "bedroom") return null;
      const bed = ctx.detectedObjects.find((o) =>
        /bed|mattress/i.test(o.label)
      );
      if (!bed) return null;

      const pinned = /pushed against corner|pinned to side wall|corner bed/i.test(
        bed.position
      );

      if (pinned) {
        return {
          id: "bed_pinned_wall",
          title: "Asymmetrical Bed Placement (Pinned in Corner)",
          severity: "info",
          what: "The bed is pushed flush against a side corner wall, leaving only one side accessible.",
          why: "In adult bedrooms, having only one accessible side restricts romantic balance, making one partner feel trapped or symbolically shutting out the entry of a romantic companion.",
          fix: "Center the headboard on the wall with at least 18-24 inches of clearance and equal nightstands on both sides.",
          whichObject: "Bed Access",
          pinCoordinates: { x: 20, y: 60 },
        };
      }
      return null;
    },
  },
];
