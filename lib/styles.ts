export interface StylePreset {
  id: string;
  name: string;
  description: string;
  icon: string;
  promptModifier: string;
}

export const STYLE_PRESETS: StylePreset[] = [
  {
    id: "default",
    name: "Default",
    description: "Clean, neutral architectural visualization",
    icon: "🏠",
    promptModifier: "",
  },
  {
    id: "modern",
    name: "Modern",
    description: "Sleek lines, open spaces, glass and steel",
    icon: "🏢",
    promptModifier: `
STYLE OVERRIDE — MODERN:
- Materials: polished concrete floors, floor-to-ceiling glass, steel accents, white or light grey walls.
- Furniture: clean geometric shapes, monochrome palette with occasional bold accent color.
- Lighting: bright, cool-toned daylight with sharp shadows.
- Feel: luxurious, urban, high-end apartment or penthouse aesthetic.`.trim(),
  },
  {
    id: "minimalist",
    name: "Minimalist",
    description: "Bare essentials, muted tones, serene spaces",
    icon: "◻️",
    promptModifier: `
STYLE OVERRIDE — MINIMALIST:
- Materials: smooth white walls, light oak or pale wood floors, minimal trim.
- Furniture: only essential pieces, low-profile, neutral earth tones (white, beige, soft grey).
- Lighting: soft, diffused natural light, no harsh shadows.
- Feel: calm, zen-like, uncluttered with generous negative space.`.trim(),
  },
  {
    id: "rustic",
    name: "Rustic",
    description: "Warm wood, stone accents, cozy atmosphere",
    icon: "🪵",
    promptModifier: `
STYLE OVERRIDE — RUSTIC:
- Materials: exposed wood beams on ceilings, natural stone or brick accent walls, hardwood plank floors with visible grain.
- Furniture: sturdy wood tables, leather upholstery, woven textiles, vintage-inspired pieces.
- Lighting: warm golden-toned light, as if from late afternoon sun and ambient lamps.
- Feel: cozy cabin or countryside cottage, inviting and warm.`.trim(),
  },
  {
    id: "industrial",
    name: "Industrial",
    description: "Raw concrete, exposed brick, metal fixtures",
    icon: "🏭",
    promptModifier: `
STYLE OVERRIDE — INDUSTRIAL:
- Materials: raw concrete walls and floors, exposed red brick, visible ductwork and pipes on ceiling, black metal fixtures.
- Furniture: metal-frame furniture, distressed leather, reclaimed wood surfaces.
- Lighting: pendant Edison bulbs, directional spotlights, warm but slightly dim ambiance.
- Feel: converted warehouse loft, raw and edgy with urban character.`.trim(),
  },
  {
    id: "scandinavian",
    name: "Scandinavian",
    description: "Light wood, soft textiles, hygge comfort",
    icon: "🕯️",
    promptModifier: `
STYLE OVERRIDE — SCANDINAVIAN:
- Materials: light birch or ash wood floors, white painted walls, natural linen and wool textiles.
- Furniture: rounded organic shapes, mid-century modern legs, soft cushions and throws in muted pastels.
- Lighting: abundant natural daylight, warm white ambient lighting, candles on surfaces.
- Feel: hygge-inspired, cozy yet airy, functional simplicity with warmth.`.trim(),
  },
];

export const getStyleById = (id: string): StylePreset =>
  STYLE_PRESETS.find((s) => s.id === id) ?? STYLE_PRESETS[0];
