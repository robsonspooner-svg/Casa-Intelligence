/**
 * Subdivision eligibility rules per zone per LGA across South East Queensland.
 *
 * Sources: Individual council planning schemes.
 * Minimum lot sizes represent the smallest compliant lot for reconfiguration of a lot (subdivision).
 */

export interface SubdivisionRule {
  zone: string;
  minLotSizeM2: number;
  minFrontageM: number;
  allowsSubdivision: boolean;
  notes?: string;
}

export interface OverlayImpact {
  bucket: string;
  label: string;
  impact: 'prohibit' | 'restrict' | 'inform';
  description: string;
}

// ---------------------------------------------------------------------------
// Overlay impacts on subdivision
// ---------------------------------------------------------------------------

export const OVERLAY_SUBDIVISION_IMPACTS: Record<string, OverlayImpact> = {
  heritage: {
    bucket: 'heritage',
    label: 'Heritage Overlay',
    impact: 'prohibit',
    description: 'Heritage-listed properties are generally not subdividable without exceptional circumstances and heritage impact assessment.',
  },
  character: {
    bucket: 'character',
    label: 'Character Area',
    impact: 'restrict',
    description: 'Character area overlays may impose additional design requirements and restrict lot configurations to preserve streetscape character.',
  },
  flood: {
    bucket: 'flood',
    label: 'Flood Overlay',
    impact: 'restrict',
    description: 'Flood-affected land may require additional assessment, flood immunity levels, and stormwater management. Subdivision is possible but requires hydraulic study.',
  },
  bushfire: {
    bucket: 'bushfire',
    label: 'Bushfire Hazard',
    impact: 'restrict',
    description: 'Bushfire-prone areas require a Bushfire Management Plan and may need increased setbacks, reducing usable area for subdivision.',
  },
  landslide: {
    bucket: 'landslide',
    label: 'Landslide Hazard',
    impact: 'restrict',
    description: 'Landslide hazard areas require geotechnical assessment. Steep or unstable land may not support additional dwelling sites.',
  },
  slope: {
    bucket: 'slope',
    label: 'Steep Land',
    impact: 'restrict',
    description: 'Steep land overlays may require cut-and-fill assessment and limit the practical buildable area on subdivided lots.',
  },
  coastal: {
    bucket: 'coastal',
    label: 'Coastal Protection',
    impact: 'restrict',
    description: 'Coastal protection areas impose erosion-prone area buffers that may reduce the subdividable area.',
  },
  waterways: {
    bucket: 'waterways',
    label: 'Waterway Setback',
    impact: 'restrict',
    description: 'Riparian and waterway buffers reduce usable lot area and may affect lot configurations.',
  },
  wetlands: {
    bucket: 'wetlands',
    label: 'Wetlands',
    impact: 'prohibit',
    description: 'Wetland areas are generally protected and cannot be developed or subdivided.',
  },
  biodiversity: {
    bucket: 'biodiversity',
    label: 'Native Vegetation',
    impact: 'restrict',
    description: 'Native vegetation areas require ecological assessment and may restrict clearing for new building envelopes.',
  },
  environment: {
    bucket: 'environment',
    label: 'Environmental Significance',
    impact: 'restrict',
    description: 'Environmentally significant areas require impact assessment and may limit development intensity.',
  },
  infrastructure: {
    bucket: 'infrastructure',
    label: 'Infrastructure Buffer',
    impact: 'inform',
    description: 'High voltage or infrastructure buffers may restrict building envelopes but typically do not prevent subdivision.',
  },
  scenic: {
    bucket: 'scenic',
    label: 'Scenic Route',
    impact: 'inform',
    description: 'Scenic route overlays may impose additional design requirements for street-facing elevations.',
  },
  height: {
    bucket: 'height',
    label: 'Height Restriction',
    impact: 'inform',
    description: 'Height restrictions inform building design but do not directly affect subdivision eligibility.',
  },
};

// ---------------------------------------------------------------------------
// LGA-specific subdivision rules keyed by normalised zone name
// ---------------------------------------------------------------------------

type LGARules = Record<string, SubdivisionRule>;

const SUNSHINE_COAST: LGARules = {
  'Low Density Residential': { zone: 'Low Density Residential', minLotSizeM2: 400, minFrontageM: 10, allowsSubdivision: true },
  'Medium Density Residential': { zone: 'Medium Density Residential', minLotSizeM2: 300, minFrontageM: 8, allowsSubdivision: true },
  'High Density Residential': { zone: 'High Density Residential', minLotSizeM2: 200, minFrontageM: 6, allowsSubdivision: true },
  'Neighbourhood Centre': { zone: 'Neighbourhood Centre', minLotSizeM2: 400, minFrontageM: 10, allowsSubdivision: true },
  'District Centre': { zone: 'District Centre', minLotSizeM2: 300, minFrontageM: 8, allowsSubdivision: true },
  'Principal Centre': { zone: 'Principal Centre', minLotSizeM2: 200, minFrontageM: 6, allowsSubdivision: true },
  'Emerging Community': { zone: 'Emerging Community', minLotSizeM2: 400, minFrontageM: 10, allowsSubdivision: true, notes: 'Requires structure plan approval' },
  'Rural Residential': { zone: 'Rural Residential', minLotSizeM2: 4000, minFrontageM: 40, allowsSubdivision: true },
  'Rural': { zone: 'Rural', minLotSizeM2: 100000, minFrontageM: 100, allowsSubdivision: false, notes: 'Subdivision generally not permitted without rezoning' },
  'Industry': { zone: 'Industry', minLotSizeM2: 1000, minFrontageM: 15, allowsSubdivision: true },
  'Sport and Recreation': { zone: 'Sport and Recreation', minLotSizeM2: 0, minFrontageM: 0, allowsSubdivision: false },
  'Community Facilities': { zone: 'Community Facilities', minLotSizeM2: 0, minFrontageM: 0, allowsSubdivision: false },
};

const BRISBANE: LGARules = {
  'Low Density Residential': { zone: 'Low Density Residential', minLotSizeM2: 400, minFrontageM: 10, allowsSubdivision: true },
  'Low-medium Density Residential': { zone: 'Low-medium Density Residential', minLotSizeM2: 300, minFrontageM: 8, allowsSubdivision: true },
  'Medium Density Residential': { zone: 'Medium Density Residential', minLotSizeM2: 200, minFrontageM: 7, allowsSubdivision: true },
  'High Density Residential': { zone: 'High Density Residential', minLotSizeM2: 200, minFrontageM: 6, allowsSubdivision: true },
  'Character Residential': { zone: 'Character Residential', minLotSizeM2: 450, minFrontageM: 12, allowsSubdivision: true, notes: 'Character overlay restrictions apply' },
  'Neighbourhood Centre': { zone: 'Neighbourhood Centre', minLotSizeM2: 400, minFrontageM: 10, allowsSubdivision: true },
  'District Centre': { zone: 'District Centre', minLotSizeM2: 300, minFrontageM: 8, allowsSubdivision: true },
  'Principal Centre': { zone: 'Principal Centre', minLotSizeM2: 200, minFrontageM: 6, allowsSubdivision: true },
  'Emerging Community': { zone: 'Emerging Community', minLotSizeM2: 400, minFrontageM: 10, allowsSubdivision: true },
  'Rural Residential': { zone: 'Rural Residential', minLotSizeM2: 4000, minFrontageM: 40, allowsSubdivision: true },
  'Rural': { zone: 'Rural', minLotSizeM2: 100000, minFrontageM: 100, allowsSubdivision: false },
  'Industry': { zone: 'Industry', minLotSizeM2: 1000, minFrontageM: 15, allowsSubdivision: true },
};

const GOLD_COAST: LGARules = {
  'Low Density Residential': { zone: 'Low Density Residential', minLotSizeM2: 400, minFrontageM: 10, allowsSubdivision: true },
  'Low-medium Density Residential': { zone: 'Low-medium Density Residential', minLotSizeM2: 300, minFrontageM: 8, allowsSubdivision: true },
  'Medium Density Residential': { zone: 'Medium Density Residential', minLotSizeM2: 250, minFrontageM: 7, allowsSubdivision: true },
  'High Density Residential': { zone: 'High Density Residential', minLotSizeM2: 200, minFrontageM: 6, allowsSubdivision: true },
  'Neighbourhood Centre': { zone: 'Neighbourhood Centre', minLotSizeM2: 400, minFrontageM: 10, allowsSubdivision: true },
  'District Centre': { zone: 'District Centre', minLotSizeM2: 300, minFrontageM: 8, allowsSubdivision: true },
  'Principal Centre': { zone: 'Principal Centre', minLotSizeM2: 200, minFrontageM: 6, allowsSubdivision: true },
  'Emerging Community': { zone: 'Emerging Community', minLotSizeM2: 400, minFrontageM: 10, allowsSubdivision: true },
  'Rural Residential': { zone: 'Rural Residential', minLotSizeM2: 4000, minFrontageM: 40, allowsSubdivision: true },
  'Rural': { zone: 'Rural', minLotSizeM2: 100000, minFrontageM: 100, allowsSubdivision: false },
};

const MORETON_BAY: LGARules = {
  'Low Density Residential': { zone: 'Low Density Residential', minLotSizeM2: 400, minFrontageM: 10, allowsSubdivision: true },
  'Medium Density Residential': { zone: 'Medium Density Residential', minLotSizeM2: 300, minFrontageM: 8, allowsSubdivision: true },
  'High Density Residential': { zone: 'High Density Residential', minLotSizeM2: 200, minFrontageM: 6, allowsSubdivision: true },
  'Residential': { zone: 'Residential', minLotSizeM2: 400, minFrontageM: 10, allowsSubdivision: true },
  'Centre': { zone: 'Centre', minLotSizeM2: 300, minFrontageM: 8, allowsSubdivision: true },
  'Neighbourhood Centre': { zone: 'Neighbourhood Centre', minLotSizeM2: 400, minFrontageM: 10, allowsSubdivision: true },
  'District Centre': { zone: 'District Centre', minLotSizeM2: 300, minFrontageM: 8, allowsSubdivision: true },
  'Principal Centre': { zone: 'Principal Centre', minLotSizeM2: 200, minFrontageM: 6, allowsSubdivision: true },
  'Emerging Community': { zone: 'Emerging Community', minLotSizeM2: 400, minFrontageM: 10, allowsSubdivision: true },
  'Rural Residential': { zone: 'Rural Residential', minLotSizeM2: 4000, minFrontageM: 40, allowsSubdivision: true },
  'Rural': { zone: 'Rural', minLotSizeM2: 100000, minFrontageM: 100, allowsSubdivision: false },
};

const LOGAN: LGARules = {
  'Low Density Residential': { zone: 'Low Density Residential', minLotSizeM2: 400, minFrontageM: 10, allowsSubdivision: true },
  'Medium Density Residential': { zone: 'Medium Density Residential', minLotSizeM2: 300, minFrontageM: 8, allowsSubdivision: true },
  'High Density Residential': { zone: 'High Density Residential', minLotSizeM2: 200, minFrontageM: 6, allowsSubdivision: true },
  'Neighbourhood Centre': { zone: 'Neighbourhood Centre', minLotSizeM2: 400, minFrontageM: 10, allowsSubdivision: true },
  'Emerging Community': { zone: 'Emerging Community', minLotSizeM2: 400, minFrontageM: 10, allowsSubdivision: true },
  'Rural Residential': { zone: 'Rural Residential', minLotSizeM2: 4000, minFrontageM: 40, allowsSubdivision: true },
  'Rural': { zone: 'Rural', minLotSizeM2: 100000, minFrontageM: 100, allowsSubdivision: false },
};

const IPSWICH: LGARules = {
  'Low Density Residential': { zone: 'Low Density Residential', minLotSizeM2: 450, minFrontageM: 12, allowsSubdivision: true },
  'Medium Density Residential': { zone: 'Medium Density Residential', minLotSizeM2: 300, minFrontageM: 8, allowsSubdivision: true },
  'High Density Residential': { zone: 'High Density Residential', minLotSizeM2: 200, minFrontageM: 6, allowsSubdivision: true },
  'Neighbourhood Centre': { zone: 'Neighbourhood Centre', minLotSizeM2: 400, minFrontageM: 10, allowsSubdivision: true },
  'Emerging Community': { zone: 'Emerging Community', minLotSizeM2: 450, minFrontageM: 12, allowsSubdivision: true },
  'Rural Residential': { zone: 'Rural Residential', minLotSizeM2: 4000, minFrontageM: 40, allowsSubdivision: true },
  'Rural': { zone: 'Rural', minLotSizeM2: 100000, minFrontageM: 100, allowsSubdivision: false },
};

const REDLAND: LGARules = {
  'Low Density Residential': { zone: 'Low Density Residential', minLotSizeM2: 400, minFrontageM: 10, allowsSubdivision: true },
  'Medium Density Residential': { zone: 'Medium Density Residential', minLotSizeM2: 300, minFrontageM: 8, allowsSubdivision: true },
  'Neighbourhood Centre': { zone: 'Neighbourhood Centre', minLotSizeM2: 400, minFrontageM: 10, allowsSubdivision: true },
  'Emerging Community': { zone: 'Emerging Community', minLotSizeM2: 400, minFrontageM: 10, allowsSubdivision: true },
  'Rural Residential': { zone: 'Rural Residential', minLotSizeM2: 6000, minFrontageM: 40, allowsSubdivision: true },
  'Rural': { zone: 'Rural', minLotSizeM2: 100000, minFrontageM: 100, allowsSubdivision: false },
};

const NOOSA: LGARules = {
  'Low Density Residential': { zone: 'Low Density Residential', minLotSizeM2: 600, minFrontageM: 15, allowsSubdivision: true },
  'Medium Density Residential': { zone: 'Medium Density Residential', minLotSizeM2: 400, minFrontageM: 10, allowsSubdivision: true },
  'Neighbourhood Centre': { zone: 'Neighbourhood Centre', minLotSizeM2: 400, minFrontageM: 10, allowsSubdivision: true },
  'Rural Residential': { zone: 'Rural Residential', minLotSizeM2: 10000, minFrontageM: 50, allowsSubdivision: true },
  'Rural': { zone: 'Rural', minLotSizeM2: 100000, minFrontageM: 100, allowsSubdivision: false },
};

const LOCKYER_VALLEY: LGARules = {
  'Low Density Residential': { zone: 'Low Density Residential', minLotSizeM2: 600, minFrontageM: 15, allowsSubdivision: true },
  'Rural Residential': { zone: 'Rural Residential', minLotSizeM2: 4000, minFrontageM: 40, allowsSubdivision: true },
  'Rural': { zone: 'Rural', minLotSizeM2: 100000, minFrontageM: 100, allowsSubdivision: false },
};

const SCENIC_RIM: LGARules = {
  'Low Density Residential': { zone: 'Low Density Residential', minLotSizeM2: 600, minFrontageM: 15, allowsSubdivision: true },
  'Rural Residential': { zone: 'Rural Residential', minLotSizeM2: 4000, minFrontageM: 40, allowsSubdivision: true },
  'Rural': { zone: 'Rural', minLotSizeM2: 100000, minFrontageM: 100, allowsSubdivision: false },
};

const SOMERSET: LGARules = {
  'Low Density Residential': { zone: 'Low Density Residential', minLotSizeM2: 600, minFrontageM: 15, allowsSubdivision: true },
  'Rural Residential': { zone: 'Rural Residential', minLotSizeM2: 4000, minFrontageM: 40, allowsSubdivision: true },
  'Rural': { zone: 'Rural', minLotSizeM2: 100000, minFrontageM: 100, allowsSubdivision: false },
};

const TOOWOOMBA: LGARules = {
  'Low Density Residential': { zone: 'Low Density Residential', minLotSizeM2: 600, minFrontageM: 15, allowsSubdivision: true },
  'Medium Density Residential': { zone: 'Medium Density Residential', minLotSizeM2: 400, minFrontageM: 10, allowsSubdivision: true },
  'High Density Residential': { zone: 'High Density Residential', minLotSizeM2: 300, minFrontageM: 8, allowsSubdivision: true },
  'Neighbourhood Centre': { zone: 'Neighbourhood Centre', minLotSizeM2: 400, minFrontageM: 10, allowsSubdivision: true },
  'District Centre': { zone: 'District Centre', minLotSizeM2: 300, minFrontageM: 8, allowsSubdivision: true },
  'Principal Centre': { zone: 'Principal Centre', minLotSizeM2: 200, minFrontageM: 6, allowsSubdivision: true },
  'Emerging Community': { zone: 'Emerging Community', minLotSizeM2: 600, minFrontageM: 15, allowsSubdivision: true },
  'Rural Residential': { zone: 'Rural Residential', minLotSizeM2: 4000, minFrontageM: 40, allowsSubdivision: true },
  'Rural': { zone: 'Rural', minLotSizeM2: 100000, minFrontageM: 100, allowsSubdivision: false },
  'Industry': { zone: 'Industry', minLotSizeM2: 2000, minFrontageM: 20, allowsSubdivision: true },
};

// Default fallback for LGAs not yet mapped
const DEFAULT_RULES: LGARules = {
  'Low Density Residential': { zone: 'Low Density Residential', minLotSizeM2: 450, minFrontageM: 12, allowsSubdivision: true },
  'Medium Density Residential': { zone: 'Medium Density Residential', minLotSizeM2: 300, minFrontageM: 8, allowsSubdivision: true },
  'High Density Residential': { zone: 'High Density Residential', minLotSizeM2: 200, minFrontageM: 6, allowsSubdivision: true },
  'Neighbourhood Centre': { zone: 'Neighbourhood Centre', minLotSizeM2: 400, minFrontageM: 10, allowsSubdivision: true },
  'District Centre': { zone: 'District Centre', minLotSizeM2: 300, minFrontageM: 8, allowsSubdivision: true },
  'Principal Centre': { zone: 'Principal Centre', minLotSizeM2: 200, minFrontageM: 6, allowsSubdivision: true },
  'Emerging Community': { zone: 'Emerging Community', minLotSizeM2: 400, minFrontageM: 10, allowsSubdivision: true },
  'Rural Residential': { zone: 'Rural Residential', minLotSizeM2: 4000, minFrontageM: 40, allowsSubdivision: true },
  'Rural': { zone: 'Rural', minLotSizeM2: 100000, minFrontageM: 100, allowsSubdivision: false },
  'Industry': { zone: 'Industry', minLotSizeM2: 1000, minFrontageM: 15, allowsSubdivision: true },
  'Sport and Recreation': { zone: 'Sport and Recreation', minLotSizeM2: 0, minFrontageM: 0, allowsSubdivision: false },
  'Community Facilities': { zone: 'Community Facilities', minLotSizeM2: 0, minFrontageM: 0, allowsSubdivision: false },
};

const LGA_RULES: Record<string, LGARules> = {
  'SUNSHINE COAST': SUNSHINE_COAST,
  'SUNSHINE COAST REGIONAL': SUNSHINE_COAST,
  'BRISBANE': BRISBANE,
  'BRISBANE CITY': BRISBANE,
  'GOLD COAST': GOLD_COAST,
  'GOLD COAST CITY': GOLD_COAST,
  'MORETON BAY': MORETON_BAY,
  'MORETON BAY REGIONAL': MORETON_BAY,
  'MORETON BAY CITY': MORETON_BAY,
  'LOGAN': LOGAN,
  'LOGAN CITY': LOGAN,
  'IPSWICH': IPSWICH,
  'IPSWICH CITY': IPSWICH,
  'REDLAND': REDLAND,
  'REDLAND CITY': REDLAND,
  'NOOSA': NOOSA,
  'NOOSA SHIRE': NOOSA,
  'LOCKYER VALLEY': LOCKYER_VALLEY,
  'LOCKYER VALLEY REGIONAL': LOCKYER_VALLEY,
  'SCENIC RIM': SCENIC_RIM,
  'SCENIC RIM REGIONAL': SCENIC_RIM,
  'SOMERSET': SOMERSET,
  'SOMERSET REGIONAL': SOMERSET,
  'TOOWOOMBA': TOOWOOMBA,
  'TOOWOOMBA REGIONAL': TOOWOOMBA,
};

// ---------------------------------------------------------------------------
// Lookup functions
// ---------------------------------------------------------------------------

function normaliseZoneName(zone: string): string {
  return zone
    .replace(/ Zone$/i, '')
    .replace(/ zone$/i, '')
    .trim();
}

function matchZoneRule(rules: LGARules, zoneName: string): SubdivisionRule | null {
  const normalised = normaliseZoneName(zoneName);

  // Direct match
  if (rules[normalised]) return rules[normalised];

  // Partial match
  const lower = normalised.toLowerCase();
  for (const [key, rule] of Object.entries(rules)) {
    if (lower.includes(key.toLowerCase()) || key.toLowerCase().includes(lower)) {
      return rule;
    }
  }

  // Category fallback
  if (lower.includes('residential') && lower.includes('low')) return rules['Low Density Residential'] || null;
  if (lower.includes('residential') && lower.includes('medium')) return rules['Medium Density Residential'] || null;
  if (lower.includes('residential') && lower.includes('high')) return rules['High Density Residential'] || null;
  if (lower.includes('centre') || lower.includes('center')) return rules['Neighbourhood Centre'] || null;
  if (lower.includes('rural') && lower.includes('residential')) return rules['Rural Residential'] || null;
  if (lower.includes('rural')) return rules['Rural'] || null;
  if (lower.includes('industry') || lower.includes('industrial')) return rules['Industry'] || null;

  return null;
}

export function getSubdivisionRule(zoneName: string, lga: string | null): SubdivisionRule | null {
  const lgaKey = (lga || '').toUpperCase().trim();
  const lgaRules = LGA_RULES[lgaKey] || DEFAULT_RULES;
  return matchZoneRule(lgaRules, zoneName) || matchZoneRule(DEFAULT_RULES, zoneName);
}

export interface SubdivisionEligibility {
  eligible: boolean;
  eligibleWithConditions: boolean;
  unknownZoning: boolean;
  reason: string;
  lotAreaM2: number;
  minLotSizeM2: number;
  maxLots: number;
  shortfallM2: number;
  overlayRestrictions: OverlayImpact[];
  overlayProhibitions: OverlayImpact[];
  rule: SubdivisionRule | null;
}

export function checkSubdivisionEligibility(
  zoneName: string,
  lotAreaM2: number,
  lga: string | null,
  overlayBuckets: string[],
): SubdivisionEligibility {
  const rule = getSubdivisionRule(zoneName, lga);

  // Check overlay impacts
  const uniqueBuckets = Array.from(new Set(overlayBuckets));
  const overlayProhibitions = uniqueBuckets
    .map((b) => OVERLAY_SUBDIVISION_IMPACTS[b])
    .filter((o): o is OverlayImpact => !!o && o.impact === 'prohibit');
  const overlayRestrictions = uniqueBuckets
    .map((b) => OVERLAY_SUBDIVISION_IMPACTS[b])
    .filter((o): o is OverlayImpact => !!o && o.impact === 'restrict');

  if (!rule) {
    // Unknown zoning — estimate based on a conservative 450m² min lot assumption
    const estimatedMinLot = 450;
    const estimatedMaxLots = lotAreaM2 >= estimatedMinLot * 2 ? Math.floor(lotAreaM2 / estimatedMinLot) : 1;
    const hasSize = lotAreaM2 >= estimatedMinLot * 2;
    return {
      eligible: false,
      eligibleWithConditions: false,
      unknownZoning: true,
      reason: hasSize
        ? `Based on your lot size of ${lotAreaM2.toLocaleString()}m², this property shows strong subdivision potential. A Casa Intelligence assessment will confirm the exact zoning rules, minimum lot sizes, and council requirements for your site.`
        : `This property may have subdivision or development potential. A Casa Intelligence assessment will confirm the zoning rules and eligibility for your site.`,
      lotAreaM2,
      minLotSizeM2: 0,
      maxLots: estimatedMaxLots,
      shortfallM2: 0,
      overlayRestrictions,
      overlayProhibitions,
      rule: null,
    };
  }

  if (!rule.allowsSubdivision) {
    return {
      eligible: false,
      eligibleWithConditions: false,
      unknownZoning: false,
      reason: `The ${rule.zone} zone does not permit subdivision.${rule.notes ? ` ${rule.notes}` : ''}`,
      lotAreaM2,
      minLotSizeM2: rule.minLotSizeM2,
      maxLots: 1,
      shortfallM2: 0,
      overlayRestrictions,
      overlayProhibitions,
      rule,
    };
  }

  // Check if lot is large enough for at least 2 compliant lots
  const minForTwo = rule.minLotSizeM2 * 2;
  const maxLots = Math.floor(lotAreaM2 / rule.minLotSizeM2);
  const shortfall = minForTwo - lotAreaM2;

  if (lotAreaM2 < minForTwo) {
    return {
      eligible: false,
      eligibleWithConditions: false,
      unknownZoning: false,
      reason: `Your lot (${lotAreaM2.toLocaleString()}m²) is ${Math.round(shortfall).toLocaleString()}m² short of the ${minForTwo.toLocaleString()}m² required for two ${rule.minLotSizeM2.toLocaleString()}m² lots in the ${rule.zone} zone.`,
      lotAreaM2,
      minLotSizeM2: rule.minLotSizeM2,
      maxLots: 1,
      shortfallM2: shortfall,
      overlayRestrictions,
      overlayProhibitions,
      rule,
    };
  }

  // Check for prohibiting overlays
  if (overlayProhibitions.length > 0) {
    const names = overlayProhibitions.map((o) => o.label).join(', ');
    return {
      eligible: false,
      eligibleWithConditions: false,
      unknownZoning: false,
      reason: `While the lot size meets subdivision requirements, the ${names} overlay(s) generally prohibit subdivision on this site.`,
      lotAreaM2,
      minLotSizeM2: rule.minLotSizeM2,
      maxLots,
      shortfallM2: 0,
      overlayRestrictions,
      overlayProhibitions,
      rule,
    };
  }

  // Eligible (with or without conditions)
  const hasConditions = overlayRestrictions.length > 0;

  return {
    eligible: !hasConditions,
    eligibleWithConditions: hasConditions,
    unknownZoning: false,
    reason: hasConditions
      ? `Your lot meets the basic subdivision criteria for up to ${maxLots} lots, but additional assessment is required for ${overlayRestrictions.map((o) => o.label).join(', ')}.`
      : `Your ${lotAreaM2.toLocaleString()}m² lot can be subdivided into up to ${maxLots} lots of ${rule.minLotSizeM2.toLocaleString()}m² each in the ${rule.zone} zone.`,
    lotAreaM2,
    minLotSizeM2: rule.minLotSizeM2,
    maxLots,
    shortfallM2: 0,
    overlayRestrictions,
    overlayProhibitions,
    rule,
  };
}
