export interface DemoItem {
  id: string;
  name: string;
  description: string;
  style: string;
  sourceImage: string;
  renderedImage: string;
}

const placeholderSvg = (text: string, bg: string, fg: string): string => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
    <rect width="1024" height="1024" fill="${bg}"/>
    <rect x="120" y="120" width="340" height="280" rx="4" fill="none" stroke="${fg}" stroke-width="3"/>
    <rect x="560" y="120" width="340" height="280" rx="4" fill="none" stroke="${fg}" stroke-width="3"/>
    <rect x="120" y="500" width="340" height="400" rx="4" fill="none" stroke="${fg}" stroke-width="3"/>
    <rect x="560" y="500" width="340" height="400" rx="4" fill="none" stroke="${fg}" stroke-width="3"/>
    <line x1="460" y1="200" x2="560" y2="200" stroke="${fg}" stroke-width="2" stroke-dasharray="8,4"/>
    <line x1="290" y1="400" x2="290" y2="500" stroke="${fg}" stroke-width="2" stroke-dasharray="8,4"/>
    <line x1="730" y1="400" x2="730" y2="500" stroke="${fg}" stroke-width="2" stroke-dasharray="8,4"/>
    <text x="290" y="270" text-anchor="middle" fill="${fg}" font-family="sans-serif" font-size="22" opacity="0.7">${text}</text>
  </svg>`;
  return `data:image/svg+xml;base64,${btoa(svg)}`;
};

const renderSvg = (text: string, accentBg: string, accent: string): string => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${accentBg}"/>
        <stop offset="100%" stop-color="#0a0a0a"/>
      </linearGradient>
    </defs>
    <rect width="1024" height="1024" fill="url(#g)"/>
    <rect x="120" y="120" width="340" height="280" rx="8" fill="${accent}" opacity="0.15"/>
    <rect x="560" y="120" width="340" height="280" rx="8" fill="${accent}" opacity="0.1"/>
    <rect x="120" y="500" width="340" height="400" rx="8" fill="${accent}" opacity="0.12"/>
    <rect x="560" y="500" width="340" height="400" rx="8" fill="${accent}" opacity="0.08"/>
    <rect x="140" y="140" width="100" height="60" rx="4" fill="${accent}" opacity="0.3"/>
    <rect x="280" y="180" width="60" height="40" rx="4" fill="${accent}" opacity="0.25"/>
    <circle cx="620" cy="200" r="30" fill="${accent}" opacity="0.2"/>
    <rect x="700" y="160" width="80" height="80" rx="4" fill="${accent}" opacity="0.15"/>
    <rect x="160" y="560" width="120" height="80" rx="4" fill="${accent}" opacity="0.2"/>
    <rect x="600" y="600" width="140" height="100" rx="4" fill="${accent}" opacity="0.18"/>
    <text x="512" y="475" text-anchor="middle" fill="${accent}" font-family="sans-serif" font-size="20" opacity="0.6">${text}</text>
  </svg>`;
  return `data:image/svg+xml;base64,${btoa(svg)}`;
};

export const DEMO_ITEMS: DemoItem[] = [
  {
    id: "demo-studio-apt",
    name: "Studio Apartment",
    description:
      "Compact studio layout with open kitchen, living area, and a separated bathroom. Demonstrates how Planora handles small, efficient spaces.",
    style: "Modern",
    sourceImage: placeholderSvg("Studio - Floor Plan", "#1a1a1a", "#666"),
    renderedImage: renderSvg("Studio - 3D Render", "#1a1410", "#d4a574"),
  },
  {
    id: "demo-family-home",
    name: "Family Home",
    description:
      "Three-bedroom family residence with spacious living room, dining area, and attached garage. Shows multi-room geometry handling.",
    style: "Scandinavian",
    sourceImage: placeholderSvg("Family Home - Floor Plan", "#1a1a1a", "#666"),
    renderedImage: renderSvg("Family Home - 3D Render", "#141518", "#8ba5b5"),
  },
  {
    id: "demo-penthouse",
    name: "Luxury Penthouse",
    description:
      "Open-plan penthouse with panoramic terrace, master suite, and walk-in closet. Highlights how the AI renders premium finishes.",
    style: "Industrial",
    sourceImage: placeholderSvg("Penthouse - Floor Plan", "#1a1a1a", "#666"),
    renderedImage: renderSvg("Penthouse - 3D Render", "#18140f", "#c4956a"),
  },
  {
    id: "demo-office",
    name: "Co-working Office",
    description:
      "Modern co-working layout with private offices, meeting rooms, and communal spaces. Tests commercial floor plan interpretation.",
    style: "Minimalist",
    sourceImage: placeholderSvg("Office - Floor Plan", "#1a1a1a", "#666"),
    renderedImage: renderSvg("Office - 3D Render", "#121416", "#a0a8b0"),
  },
  {
    id: "demo-cabin",
    name: "Mountain Cabin",
    description:
      "Rustic cabin with a central fireplace, open loft, and wraparound porch. Showcases the Rustic style preset in action.",
    style: "Rustic",
    sourceImage: placeholderSvg("Cabin - Floor Plan", "#1a1a1a", "#666"),
    renderedImage: renderSvg("Cabin - 3D Render", "#1a1612", "#b89070"),
  },
];
