import { CompassDirection, RoomType } from "@/types";

interface DiagramOptions {
  roomType: RoomType;
  doorDirection: CompassDirection;
  issues: string[];
}

export function generateRoomFloorPlanSvg(
  state: "before" | "after",
  options: DiagramOptions
): string {
  const isBefore = state === "before";
  const title = isBefore ? "BEFORE: Disrupted Chi Flow" : "AFTER: Auspicious Command Position";
  const themeColor = isBefore ? "#ef4444" : "#10b981";
  const bgFill = "#0f172a";
  const wallStroke = "#334155";

  // Furniture placement depends on state and roomType
  let furnitureElements = "";
  let energyFlowPath = "";

  if (options.roomType === "bedroom") {
    if (isBefore) {
      // Bed is directly in line with door at bottom right
      furnitureElements = `
        <!-- Doorway -->
        <path d="M 280 380 L 280 340 A 40 40 0 0 0 240 380 Z" fill="none" stroke="#64748b" stroke-width="2" />
        <line x1="280" y1="380" x2="280" y2="340" stroke="#94a3b8" stroke-width="3" />
        <text x="290" y="365" fill="#94a3b8" font-size="11" font-family="sans-serif">Door</text>

        <!-- Window -->
        <rect x="130" y="20" width="140" height="8" fill="#38bdf8" rx="2" opacity="0.8"/>
        <text x="175" y="15" fill="#38bdf8" font-size="11" font-family="sans-serif">Window</text>

        <!-- Bed in Line with Door (Coffin Position) -->
        <g id="bed-before">
          <rect x="230" y="140" width="100" height="150" rx="6" fill="#1e293b" stroke="#ef4444" stroke-width="2.5" />
          <!-- Pillows -->
          <rect x="240" y="148" width="35" height="25" rx="3" fill="#334155" />
          <rect x="285" y="148" width="35" height="25" rx="3" fill="#334155" />
          <!-- Blanket fold -->
          <line x1="230" y1="210" x2="330" y2="210" stroke="#475569" stroke-width="1.5" />
          <text x="257" y="250" fill="#f87171" font-size="12" font-weight="bold" font-family="sans-serif">Bed</text>
          <!-- Warning marker -->
          <circle cx="280" cy="275" r="10" fill="#ef4444" />
          <text x="277" y="279" fill="#ffffff" font-size="11" font-weight="bold">!</text>
        </g>

        <!-- Mirror reflecting bed -->
        <g id="mirror">
          <line x1="70" y1="200" x2="70" y2="280" stroke="#a855f7" stroke-width="4" />
          <text x="30" y="245" fill="#c084fc" font-size="10" font-family="sans-serif">Mirror</text>
          <!-- Reflection dashed beam -->
          <line x1="70" y1="240" x2="230" y2="215" stroke="#ef4444" stroke-width="1.5" stroke-dasharray="4,4" opacity="0.7"/>
        </g>

        <!-- Clutter zone -->
        <circle cx="160" cy="300" r="28" fill="#dc2626" opacity="0.15" />
        <text x="135" y="304" fill="#fca5a5" font-size="10" font-family="sans-serif">Clutter Pile</text>
      `;

      // Violent straight Sha Chi rushing from door directly onto bed
      energyFlowPath = `
        <!-- Sha Chi rushing arrow -->
        <path d="M 280 340 L 280 180" fill="none" stroke="#ef4444" stroke-width="3" stroke-dasharray="6,4" marker-end="url(#red-arrow)" />
        <text x="290" y="240" fill="#f87171" font-size="11" font-family="sans-serif">Sha Chi (Rushing)</text>
      `;
    } else {
      // AFTER: Bed shifted diagonally to command position, solid wall backing, side tables, plant
      furnitureElements = `
        <!-- Doorway -->
        <path d="M 280 380 L 280 340 A 40 40 0 0 0 240 380 Z" fill="none" stroke="#64748b" stroke-width="2" />
        <line x1="280" y1="380" x2="280" y2="340" stroke="#94a3b8" stroke-width="3" />
        <text x="290" y="365" fill="#94a3b8" font-size="11" font-family="sans-serif">Door</text>

        <!-- Window -->
        <rect x="130" y="20" width="140" height="8" fill="#38bdf8" rx="2" opacity="0.8"/>
        <text x="175" y="15" fill="#38bdf8" font-size="11" font-family="sans-serif">Window</text>

        <!-- Bed in Solid Command Position on Left Wall -->
        <g id="bed-after">
          <!-- Headboard backing solid wall -->
          <rect x="50" y="70" width="10" height="130" rx="2" fill="#10b981" />
          <rect x="60" y="80" width="130" height="110" rx="6" fill="#1e293b" stroke="#10b981" stroke-width="2.5" />
          <!-- Pillows -->
          <rect x="68" y="90" width="26" height="36" rx="3" fill="#334155" />
          <rect x="68" y="144" width="26" height="36" rx="3" fill="#334155" />
          <!-- Blanket -->
          <line x1="125" y1="80" x2="125" y2="190" stroke="#475569" stroke-width="1.5" />
          <text x="105" y="140" fill="#34d399" font-size="12" font-weight="bold" font-family="sans-serif">Bed (Command)</text>
          
          <!-- Symmetrical Nightstands -->
          <rect x="60" y="45" width="25" height="25" rx="3" fill="#334155" stroke="#64748b" />
          <rect x="60" y="200" width="25" height="25" rx="3" fill="#334155" stroke="#64748b" />
          <circle cx="72" cy="57" r="4" fill="#f59e0b" />
          <circle cx="72" cy="212" r="4" fill="#f59e0b" />
        </g>

        <!-- Relocated Safe Mirror -->
        <g id="mirror-safe">
          <line x1="330" y1="90" x2="330" y2="150" stroke="#a855f7" stroke-width="4" />
          <text x="280" y="85" fill="#c084fc" font-size="10" font-family="sans-serif">Mirror (Safe)</text>
        </g>

        <!-- Calming Potted Plant in Wealth Corner -->
        <g id="plant">
          <circle cx="330" cy="50" r="14" fill="#065f46" stroke="#34d399" stroke-width="2" />
          <circle cx="330" cy="50" r="6" fill="#10b981" />
          <text x="290" y="35" fill="#34d399" font-size="10" font-family="sans-serif">Money Plant</text>
        </g>

        <!-- Round Center Rug for Centering Chi -->
        <ellipse cx="230" cy="240" rx="45" ry="35" fill="#334155" opacity="0.3" stroke="#64748b" stroke-dasharray="3,3" />
        <text x="200" y="244" fill="#94a3b8" font-size="9" font-family="sans-serif">Tai Chi Rug</text>
      `;

      // Gentle meandering Sheng Chi entering and nourishing room without striking bed
      energyFlowPath = `
        <path d="M 280 340 Q 230 260 210 200 T 195 130" fill="none" stroke="#10b981" stroke-width="2.5" stroke-dasharray="5,4" marker-end="url(#green-arrow)" />
        <text x="225" y="295" fill="#34d399" font-size="11" font-family="sans-serif">Sheng Chi (Gentle)</text>
      `;
    }
  } else {
    // Office / Desk Layout
    if (isBefore) {
      furnitureElements = `
        <!-- Door -->
        <path d="M 80 380 L 80 340 A 40 40 0 0 1 120 380 Z" fill="none" stroke="#64748b" stroke-width="2" />
        <line x1="80" y1="380" x2="80" y2="340" stroke="#94a3b8" stroke-width="3" />
        <text x="45" y="365" fill="#94a3b8" font-size="11">Door</text>

        <!-- Desk facing wall with back to door -->
        <g id="desk-before">
          <rect x="130" y="30" width="140" height="50" rx="4" fill="#1e293b" stroke="#ef4444" stroke-width="2" />
          <!-- Chair with back to door -->
          <circle cx="200" cy="100" r="16" fill="#ef4444" opacity="0.8" />
          <line x1="200" y1="100" x2="200" y2="120" stroke="#f87171" stroke-width="2" />
          <text x="175" y="60" fill="#f87171" font-size="11" font-weight="bold">Desk (Wall)</text>
          <text x="160" y="138" fill="#fca5a5" font-size="10">Vulnerable Back</text>
        </g>
      `;
      energyFlowPath = `
        <path d="M 80 340 Q 140 220 195 120" fill="none" stroke="#ef4444" stroke-width="2.5" stroke-dasharray="4,4" marker-end="url(#red-arrow)" />
      `;
    } else {
      furnitureElements = `
        <!-- Door -->
        <path d="M 80 380 L 80 340 A 40 40 0 0 1 120 380 Z" fill="none" stroke="#64748b" stroke-width="2" />
        <line x1="80" y1="380" x2="80" y2="340" stroke="#94a3b8" stroke-width="3" />
        <text x="45" y="365" fill="#94a3b8" font-size="11">Door</text>

        <!-- Desk in Command: Solid wall behind chair, clear view of entry -->
        <g id="desk-after">
          <!-- Supportive Wall Shelf Behind -->
          <rect x="180" y="40" width="150" height="15" rx="2" fill="#334155" />
          <!-- Chair with solid backing -->
          <circle cx="255" cy="85" r="16" fill="#10b981" />
          <!-- Desk in front of user -->
          <rect x="185" y="115" width="140" height="50" rx="4" fill="#1e293b" stroke="#10b981" stroke-width="2" />
          <text x="215" y="145" fill="#34d399" font-size="11" font-weight="bold">Command Desk</text>
          <!-- Clear Sightline to door -->
          <line x1="255" y1="85" x2="100" y2="350" stroke="#38bdf8" stroke-width="1.5" stroke-dasharray="3,3" />
          <text x="150" y="240" fill="#7dd3fc" font-size="10">Command Sightline</text>
        </g>
      `;
      energyFlowPath = `
        <path d="M 80 340 Q 140 290 220 220" fill="none" stroke="#10b981" stroke-width="2" stroke-dasharray="4,4" marker-end="url(#green-arrow)" />
      `;
    }
  }

  return `
<svg viewBox="0 0 400 400" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style="background: ${bgFill}; border-radius: 12px;">
  <defs>
    <marker id="red-arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#ef4444" />
    </marker>
    <marker id="green-arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#10b981" />
    </marker>
  </defs>

  <!-- Architectural Outer Room Walls -->
  <rect x="20" y="20" width="360" height="360" rx="8" fill="none" stroke="${wallStroke}" stroke-width="6" />

  <!-- Grid overlay subtle -->
  <g stroke="#1e293b" stroke-width="1" opacity="0.4">
    <line x1="140" y1="20" x2="140" y2="380" />
    <line x1="260" y1="20" x2="260" y2="380" />
    <line x1="20" y1="140" x2="380" y2="140" />
    <line x1="20" y1="260" x2="380" y2="260" />
  </g>

  <!-- Title Badge -->
  <rect x="25" y="25" width="220" height="24" rx="4" fill="#020617" opacity="0.8" />
  <text x="32" y="41" fill="${themeColor}" font-size="11" font-weight="bold" font-family="sans-serif">${title}</text>

  <!-- Compass indicator -->
  <g transform="translate(355, 45)">
    <circle cx="0" cy="0" r="14" fill="#1e293b" stroke="#475569" stroke-width="1" />
    <polygon points="0,-10 3,0 0,-2 -3,0" fill="#ef4444" />
    <polygon points="0,10 3,0 0,2 -3,0" fill="#94a3b8" />
    <text x="-4" y="-12" fill="#ef4444" font-size="8" font-weight="bold">N</text>
  </g>

  ${furnitureElements}
  ${energyFlowPath}
</svg>
  `.trim();
}
