export interface ZoneRule {
  zone: string;
  category: 'residential' | 'centre' | 'industry' | 'rural' | 'special' | 'community';
  allowsMultipleDwellings: boolean;
  typicalProducts: string[];
  assessmentLevel: string;
  maxDensityHint: string;
  description: string;
}

const ZONE_RULES: Record<string, ZoneRule> = {
  'Low Density Residential': {
    zone: 'Low Density Residential',
    category: 'residential',
    allowsMultipleDwellings: false,
    typicalProducts: ['Detached house', 'Duplex', 'Secondary dwelling'],
    assessmentLevel: 'Code assessable for house; Impact assessable for dual occupancy',
    maxDensityHint: '1-2 dwellings per lot',
    description: 'Primarily for detached housing. Limited multi-dwelling opportunity, but duplexes and secondary dwellings may be achievable on larger lots.',
  },
  'Medium Density Residential': {
    zone: 'Medium Density Residential',
    category: 'residential',
    allowsMultipleDwellings: true,
    typicalProducts: ['Townhouses', 'Low-rise apartments (3-4 storeys)', 'Duplexes'],
    assessmentLevel: 'Code assessable for multiple dwellings up to 3 storeys',
    maxDensityHint: 'Up to site coverage and height limits',
    description: 'Designed for medium-density housing. Townhouses and low-rise apartments are generally code assessable, making this an attractive zone for development.',
  },
  'High Density Residential': {
    zone: 'High Density Residential',
    category: 'residential',
    allowsMultipleDwellings: true,
    typicalProducts: ['Apartments (4-8+ storeys)', 'Mixed-use with ground floor commercial'],
    assessmentLevel: 'Code assessable for multiple dwellings',
    maxDensityHint: 'Subject to building height overlay',
    description: 'Permits higher-density residential development. Apartment buildings are generally code assessable up to the height limit specified in the overlay.',
  },
  'Neighbourhood Centre': {
    zone: 'Neighbourhood Centre',
    category: 'centre',
    allowsMultipleDwellings: true,
    typicalProducts: ['Shop-top housing', 'Mixed-use (retail + residential)', 'Small-scale commercial'],
    assessmentLevel: 'Code assessable for mixed use',
    maxDensityHint: 'Typically 2-4 storeys',
    description: 'Local convenience centre. Mixed-use development with ground floor retail and upper-level residential is generally supported.',
  },
  'District Centre': {
    zone: 'District Centre',
    category: 'centre',
    allowsMultipleDwellings: true,
    typicalProducts: ['Mixed-use towers', 'Commercial offices', 'High-density apartments'],
    assessmentLevel: 'Code or impact assessable depending on scale',
    maxDensityHint: 'Subject to height overlay, often 6-15+ storeys',
    description: 'Major activity centre. High-density mixed-use development is anticipated and encouraged, subject to building height and design requirements.',
  },
  'Principal Centre': {
    zone: 'Principal Centre',
    category: 'centre',
    allowsMultipleDwellings: true,
    typicalProducts: ['Major mixed-use development', 'Commercial towers', 'High-density residential'],
    assessmentLevel: 'Varies by use and scale',
    maxDensityHint: 'Highest density permitted, subject to PDA/local plan',
    description: 'Regional centre with the highest development intensity. Significant mixed-use and high-rise development is anticipated.',
  },
  'Emerging Community': {
    zone: 'Emerging Community',
    category: 'residential',
    allowsMultipleDwellings: false,
    typicalProducts: ['Future residential subdivision', 'Master-planned community'],
    assessmentLevel: 'Impact assessable, requires structure plan approval',
    maxDensityHint: 'Subject to approved structure plan',
    description: 'Land identified for future urban development. Development requires a structure plan and is typically impact assessable. Significant opportunity for large-scale residential projects.',
  },
  'Rural': {
    zone: 'Rural',
    category: 'rural',
    allowsMultipleDwellings: false,
    typicalProducts: ['Rural residential', 'Agricultural uses'],
    assessmentLevel: 'Impact assessable for most non-rural uses',
    maxDensityHint: 'Very low density, one dwelling per lot',
    description: 'Rural and agricultural land. Development potential is limited unless a planning scheme amendment or rezoning is achieved.',
  },
  'Rural Residential': {
    zone: 'Rural Residential',
    category: 'rural',
    allowsMultipleDwellings: false,
    typicalProducts: ['Acreage residential', 'Hobby farms'],
    assessmentLevel: 'Code assessable for house',
    maxDensityHint: 'One dwelling per lot (large lots)',
    description: 'Large-lot residential living on the urban fringe. Limited development potential beyond single dwellings.',
  },
  'Industry': {
    zone: 'Industry',
    category: 'industry',
    allowsMultipleDwellings: false,
    typicalProducts: ['Warehousing', 'Manufacturing', 'Industrial units'],
    assessmentLevel: 'Code assessable for industrial uses',
    maxDensityHint: 'Not applicable, industrial use',
    description: 'Industrial uses. Residential development is not anticipated in this zone.',
  },
  'Sport and Recreation': {
    zone: 'Sport and Recreation',
    category: 'special',
    allowsMultipleDwellings: false,
    typicalProducts: ['Sporting facilities', 'Parks'],
    assessmentLevel: 'Impact assessable for most uses',
    maxDensityHint: 'Not applicable',
    description: 'Dedicated to sport and recreation. Development potential is very limited.',
  },
  'Community Facilities': {
    zone: 'Community Facilities',
    category: 'community',
    allowsMultipleDwellings: false,
    typicalProducts: ['Schools', 'Churches', 'Community centres'],
    assessmentLevel: 'Varies by use',
    maxDensityHint: 'Not applicable',
    description: 'Reserved for community and institutional uses. Residential development is not generally anticipated.',
  },
};

export function getZoneRule(zoneName: string): ZoneRule | null {
  // Direct match
  if (ZONE_RULES[zoneName]) return ZONE_RULES[zoneName];

  // Partial match
  const normalised = zoneName.toLowerCase();
  for (const [key, rule] of Object.entries(ZONE_RULES)) {
    if (normalised.includes(key.toLowerCase())) return rule;
  }

  // Category match
  if (normalised.includes('residential') && normalised.includes('low')) {
    return ZONE_RULES['Low Density Residential'];
  }
  if (normalised.includes('residential') && normalised.includes('medium')) {
    return ZONE_RULES['Medium Density Residential'];
  }
  if (normalised.includes('residential') && normalised.includes('high')) {
    return ZONE_RULES['High Density Residential'];
  }
  if (normalised.includes('centre') || normalised.includes('center')) {
    return ZONE_RULES['Neighbourhood Centre'];
  }

  return null;
}

export function getDefaultZoneRule(): ZoneRule {
  return {
    zone: 'Unknown',
    category: 'residential',
    allowsMultipleDwellings: false,
    typicalProducts: [],
    assessmentLevel: 'Assessment level unknown. Formal review recommended',
    maxDensityHint: 'Unknown',
    description: 'Zoning could not be determined from available data. A formal planning assessment is recommended.',
  };
}
