import { getZoneRule } from './zoning-rules';

export interface CostRange {
  min: number;
  mid: number;
  max: number;
}

export type ProductType = 'townhouse' | 'low_rise_apartment' | 'medium_rise_apartment' | 'duplex';

// Current Sunshine Coast construction costs (per m², 2025-2026)
// Duplex = detached freestanding dwellings, priced at house-equivalent rates
const CONSTRUCTION_COSTS: Record<ProductType, CostRange> = {
  townhouse: { min: 2200, mid: 2500, max: 2800 },
  low_rise_apartment: { min: 2800, mid: 3150, max: 3500 },
  medium_rise_apartment: { min: 3500, mid: 4000, max: 4500 },
  duplex: { min: 2600, mid: 3000, max: 3400 },
};

// Pre-development consultant costs (per engagement, not per dwelling)
export const PRE_DEV_COSTS = {
  townPlanner: { min: 8000, mid: 11500, max: 15000, label: 'Town planner' },
  architect: { min: 15000, mid: 22500, max: 30000, label: 'Architect (concept)' },
  quantitySurveyor: { min: 5000, mid: 8500, max: 12000, label: 'Quantity surveyor' },
  civilEngineer: { min: 8000, mid: 11500, max: 15000, label: 'Civil engineer' },
  geotech: { min: 3000, mid: 5500, max: 8000, label: 'Geotechnical investigation' },
  survey: { min: 3000, mid: 4500, max: 6000, label: 'Survey (cadastral + contour)' },
  trafficEngineer: { min: 5000, mid: 8500, max: 12000, label: 'Traffic engineer' },
};

// Per-dwelling costs
const INFRASTRUCTURE_CHARGE_PER_DWELLING: CostRange = { min: 20000, mid: 28000, max: 35000 };
const DA_LODGEMENT_BASE: CostRange = { min: 10000, mid: 18000, max: 30000 };

// External works (driveways, crossovers, landscaping, fencing, retaining, stormwater)
// These are per-project costs that scale with number of units
const EXTERNAL_WORKS_PER_UNIT: Record<ProductType, CostRange> = {
  duplex: { min: 35000, mid: 50000, max: 70000 },         // Dual driveways, crossovers, landscaping (DA compliance), fencing, retaining
  townhouse: { min: 20000, mid: 30000, max: 45000 },      // Shared driveway, landscaping, visitor parking
  low_rise_apartment: { min: 15000, mid: 22000, max: 32000 },  // Shared basement/parking, communal landscaping
  medium_rise_apartment: { min: 12000, mid: 18000, max: 25000 }, // Mostly internal, shared external
};

// Subdivision / strata / body corporate setup costs (per project, not per dwelling)
const SUBDIVISION_COSTS: Record<ProductType, CostRange> = {
  duplex: { min: 25000, mid: 40000, max: 55000 },         // Community title survey, legal, plan sealing, body corp setup
  townhouse: { min: 20000, mid: 35000, max: 50000 },      // Community title / building format plan
  low_rise_apartment: { min: 25000, mid: 40000, max: 55000 },  // Building format plan, body corp
  medium_rise_apartment: { min: 30000, mid: 45000, max: 65000 }, // More complex strata
};

// Sale price assumptions (Sunshine Coast, 2025-2026)
// Duplex = detached dwelling on own title (post-subdivision), priced as freestanding house
const SALE_PRICES: Record<string, CostRange> = {
  '2bed_townhouse': { min: 650000, mid: 750000, max: 850000 },
  '3bed_townhouse': { min: 800000, mid: 950000, max: 1100000 },
  '2bed_apartment': { min: 550000, mid: 650000, max: 750000 },
  '3bed_apartment': { min: 700000, mid: 825000, max: 950000 },
  '2bed_duplex': { min: 850000, mid: 1000000, max: 1150000 },
  '3bed_duplex': { min: 1050000, mid: 1250000, max: 1450000 },
};

// ─── Slope Escalation ────────────────────────────────────────
const SLOPE_ESCALATION: { maxPercent: number; factor: number; label: string }[] = [
  { maxPercent: 5, factor: 0, label: 'Flat to gentle' },
  { maxPercent: 10, factor: 0.05, label: 'Moderate slope' },
  { maxPercent: 15, factor: 0.12, label: 'Steep' },
  { maxPercent: 25, factor: 0.20, label: 'Very steep' },
  { maxPercent: Infinity, factor: 0.30, label: 'Extreme, specialist geotech required' },
];

function getSlopeEscalation(slopePercent: number | null): { factor: number; label: string } {
  if (slopePercent === null || slopePercent === undefined) return { factor: 0, label: 'Unknown' };
  for (const tier of SLOPE_ESCALATION) {
    if (slopePercent <= tier.maxPercent) return tier;
  }
  return SLOPE_ESCALATION[SLOPE_ESCALATION.length - 1];
}

// ─── Overlay Cost Escalation ─────────────────────────────────
const OVERLAY_COST_FACTORS: Record<string, { factor: number; label: string }> = {
  flood: { factor: 0.08, label: 'Flood-resilient design (+8%)' },
  bushfire: { factor: 0.05, label: 'BAL compliance (+5%)' },
  landslide: { factor: 0.15, label: 'Geotechnical + retaining (+15%)' },
  environment: { factor: 0.03, label: 'Acid sulfate treatment (+3%)' },
  heritage: { factor: 0.05, label: 'Heritage design compliance (+5%)' },
  character: { factor: 0.05, label: 'Character area compliance (+5%)' },
  coastal: { factor: 0.04, label: 'Coastal resilience (+4%)' },
};

export function getOverlayCostLabel(bucket: string): string | null {
  return OVERLAY_COST_FACTORS[bucket]?.label || null;
}

function getOverlayFactor(buckets: string[]): number {
  let total = 0;
  const seen = new Set<string>();
  for (const bucket of buckets) {
    if (seen.has(bucket)) continue;
    seen.add(bucket);
    const entry = OVERLAY_COST_FACTORS[bucket];
    if (entry) total += entry.factor;
  }
  return Math.min(total, 0.35);
}

// ─── Suburb Price Tiers ──────────────────────────────────────
const SUBURB_PRICE_TIERS: Record<string, { tier: string; factor: number }> = {
  // Premium tier (+8-15%)
  'NOOSA HEADS': { tier: 'premium', factor: 1.15 },
  'NOOSA': { tier: 'premium', factor: 1.15 },
  'NOOSAVILLE': { tier: 'premium', factor: 1.12 },
  'SUNSHINE BEACH': { tier: 'premium', factor: 1.15 },
  'MOOLOOLABA': { tier: 'premium', factor: 1.12 },
  'ALEXANDRA HEADLAND': { tier: 'premium', factor: 1.10 },
  'COOLUM BEACH': { tier: 'premium', factor: 1.10 },
  'PEREGIAN BEACH': { tier: 'premium', factor: 1.12 },
  'MARCUS BEACH': { tier: 'premium', factor: 1.10 },
  'BUDERIM': { tier: 'premium', factor: 1.08 },
  'TWIN WATERS': { tier: 'premium', factor: 1.08 },
  'PACIFIC PARADISE': { tier: 'premium', factor: 1.05 },
  // Standard tier (base — factor 1.0)
  'MAROOCHYDORE': { tier: 'standard', factor: 1.0 },
  'CALOUNDRA': { tier: 'standard', factor: 1.0 },
  'CURRIMUNDI': { tier: 'standard', factor: 1.0 },
  'NAMBOUR': { tier: 'standard', factor: 0.95 },
  'WOOMBYE': { tier: 'standard', factor: 0.97 },
  'BLI BLI': { tier: 'standard', factor: 1.0 },
  'KAWANA': { tier: 'standard', factor: 1.02 },
  'BIRTINYA': { tier: 'standard', factor: 1.02 },
  'WARANA': { tier: 'standard', factor: 1.02 },
  'BOKARINA': { tier: 'standard', factor: 1.02 },
  'WURTULLA': { tier: 'standard', factor: 1.0 },
  'BUDDINA': { tier: 'standard', factor: 1.02 },
  'MOUNTAIN CREEK': { tier: 'standard', factor: 1.0 },
  // Growth tier (-8-12%)
  'BARINGA': { tier: 'growth', factor: 0.90 },
  'PALMVIEW': { tier: 'growth', factor: 0.90 },
  'AURA': { tier: 'growth', factor: 0.88 },
  'SIPPY DOWNS': { tier: 'growth', factor: 0.92 },
  'NIRIMBA': { tier: 'growth', factor: 0.88 },
  'CALOUNDRA WEST': { tier: 'growth', factor: 0.90 },
  'BELLS CREEK': { tier: 'growth', factor: 0.90 },
  // Value tier (-15%)
  'BEERWAH': { tier: 'value', factor: 0.85 },
  'LANDSBOROUGH': { tier: 'value', factor: 0.85 },
  'GLASS HOUSE MOUNTAINS': { tier: 'value', factor: 0.85 },
  'MALENY': { tier: 'value', factor: 0.92 },
  'MAPLETON': { tier: 'value', factor: 0.88 },
  'MONTVILLE': { tier: 'value', factor: 0.90 },
  'KENILWORTH': { tier: 'value', factor: 0.82 },
  'EUDLO': { tier: 'value', factor: 0.88 },
};

function getSuburbPriceTier(suburb: string | null): { tier: string; factor: number } {
  if (!suburb) return { tier: 'unknown', factor: 1.0 };
  const normalized = suburb.toUpperCase().trim();
  return SUBURB_PRICE_TIERS[normalized] || { tier: 'standard', factor: 1.0 };
}

// ─── Types ───────────────────────────────────────────────────

export interface FeasibilityInputs {
  numberOfUnits: number;
  storeys: number;
  floorAreaPerUnit: number; // m²
  landCost: number;
  productType: ProductType;
  bedroomMix?: '2bed' | '3bed' | 'mixed';
  parcelAreaSqm?: number | null;
  maxHeight?: number | null;
  slopePercent?: number | null;
  overlayBuckets?: string[];
  suburb?: string | null;
  zoneName?: string | null;
  salePriceOverride?: number | null; // per-unit price override (null = use model defaults)
}

export interface SiteMetrics {
  parcelAreaSqm: number;
  buildingFootprint: number;
  siteCoverage: number; // percentage
  plotRatio: number; // GFA / site area
  isCoverageExcessive: boolean;
  isOverHeight: boolean;
  maxStoreys: number | null;
}

export interface DensityAssessment {
  maxRealisticUnits: number;
  requestedUnits: number;
  isOverDense: boolean;
  reason: string;
  buildableAreaSqm: number;
}

export interface FeasibilityResult {
  totalGFA: number;
  constructionCost: CostRange;
  slopePremium: CostRange;
  overlayPremium: CostRange;
  adjustedConstructionCost: CostRange;
  externalWorks: CostRange;
  subdivisionCosts: CostRange;
  preDevelopmentCost: CostRange;
  infrastructureCharges: CostRange;
  daFees: CostRange;
  contingency: CostRange;
  professionalFees: CostRange;
  financeCosts: CostRange;
  marketingAndSelling: CostRange;
  totalDevelopmentCost: CostRange;
  totalRevenue: CostRange;
  profit: CostRange;
  margin: CostRange; // percentage
  returnOnCost: CostRange; // percentage
  statusQuoPreDevCost: CostRange;
  siteMetrics: SiteMetrics | null;
  densityAssessment: DensityAssessment | null;
  confidenceLevel: 'green' | 'amber' | 'red';
  confidenceReasons: string[];
  salePriceTier: string;
  slopeLabel: string;
}

// ─── Helpers ─────────────────────────────────────────────────

function sumCostRanges(...ranges: CostRange[]): CostRange {
  return {
    min: ranges.reduce((sum, r) => sum + r.min, 0),
    mid: ranges.reduce((sum, r) => sum + r.mid, 0),
    max: ranges.reduce((sum, r) => sum + r.max, 0),
  };
}

function multiplyCostRange(range: CostRange, factor: number): CostRange {
  return {
    min: Math.round(range.min * factor),
    mid: Math.round(range.mid * factor),
    max: Math.round(range.max * factor),
  };
}

// Typical SCC setbacks by product type (metres from each boundary)
export const TYPICAL_SETBACKS: Record<ProductType, { front: number; side: number; rear: number }> = {
  duplex: { front: 6, side: 1.5, rear: 3 },
  townhouse: { front: 6, side: 2, rear: 3 },
  low_rise_apartment: { front: 6, side: 3, rear: 6 },
  medium_rise_apartment: { front: 6, side: 4.5, rear: 6 },
};

// Maximum site coverage by product type (SCC planning scheme typical)
const MAX_SITE_COVERAGE: Record<ProductType, number> = {
  duplex: 50,
  townhouse: 50,
  low_rise_apartment: 50,
  medium_rise_apartment: 50,
};

// ─── Density Guard ───────────────────────────────────────────

export function calculateMaxDensity(
  parcelAreaSqm: number,
  productType: ProductType,
  storeys: number,
  floorAreaPerUnit: number,
  zoneName?: string | null,
): DensityAssessment {
  const setbacks = TYPICAL_SETBACKS[productType];
  // Estimate buildable area assuming roughly square parcel
  const sqrtArea = Math.sqrt(parcelAreaSqm);
  const buildableWidth = Math.max(sqrtArea - setbacks.side * 2, 0);
  const buildableDepth = Math.max(sqrtArea - setbacks.front - setbacks.rear, 0);
  const buildableArea = buildableWidth * buildableDepth;

  const maxCoverage = (MAX_SITE_COVERAGE[productType] || 50) / 100;
  const maxFootprint = buildableArea * maxCoverage;

  // Each unit needs floorAreaPerUnit / storeys of footprint
  const footprintPerUnit = floorAreaPerUnit / Math.max(storeys, 1);
  // Add circulation/common area factor for apartments
  const circulationFactor = productType === 'townhouse' || productType === 'duplex' ? 1.0 : 1.2;
  const effectiveFootprintPerUnit = footprintPerUnit * circulationFactor;

  let maxUnits = effectiveFootprintPerUnit > 0
    ? Math.max(1, Math.floor(maxFootprint / effectiveFootprintPerUnit))
    : 1;

  // Zone-based caps
  let zoneCap = Infinity;
  let zoneReason = '';
  if (zoneName) {
    const zoneRule = getZoneRule(zoneName);
    if (zoneRule) {
      if (!zoneRule.allowsMultipleDwellings) {
        zoneCap = 2;
        zoneReason = `${zoneRule.zone} zone limits to ${zoneCap} dwellings`;
      }
    }
  }

  const finalMax = Math.min(maxUnits, zoneCap);
  const reason = zoneCap < maxUnits
    ? zoneReason
    : `Site geometry supports ~${finalMax} units at ${Math.round(maxCoverage * 100)}% coverage with ${productType.replace(/_/g, ' ')} setbacks`;

  return {
    maxRealisticUnits: finalMax,
    requestedUnits: 0, // set by caller
    isOverDense: false, // set by caller
    reason,
    buildableAreaSqm: Math.round(buildableArea),
  };
}

// ─── Confidence Scoring ──────────────────────────────────────

function computeConfidence(
  densityAssessment: DensityAssessment | null,
  overlayBuckets: string[],
  margin: CostRange,
  slopePercent: number | null,
  siteMetrics: SiteMetrics | null,
): { level: 'green' | 'amber' | 'red'; reasons: string[] } {
  const reasons: string[] = [];
  let score = 100;

  // Density check
  if (densityAssessment?.isOverDense) {
    score -= 40;
    reasons.push(`Units (${densityAssessment.requestedUnits}) exceed realistic max (${densityAssessment.maxRealisticUnits})`);
  }

  // Coverage check
  if (siteMetrics?.isCoverageExcessive) {
    score -= 20;
    reasons.push(`Site coverage (${siteMetrics.siteCoverage}%) exceeds 50% maximum`);
  }

  // Height check
  if (siteMetrics?.isOverHeight) {
    score -= 20;
    reasons.push('Building height exceeds overlay limit');
  }

  // Critical overlays
  const criticalOverlays = overlayBuckets.filter(b => ['flood', 'bushfire', 'landslide'].includes(b));
  const uniqueCritical = Array.from(new Set(criticalOverlays));
  if (uniqueCritical.length > 0) {
    score -= uniqueCritical.length * 10;
    reasons.push(`${uniqueCritical.length} critical overlay(s): ${uniqueCritical.join(', ')}`);
  }

  // Steep slope
  if (slopePercent !== null && slopePercent > 15) {
    score -= 15;
    reasons.push(`Steep site (${slopePercent.toFixed(0)}% slope), significant cost premium`);
  }

  // Thin margins
  if (margin.mid < 10 && margin.mid >= 0) {
    score -= 15;
    reasons.push(`Thin margin (${margin.mid}%), limited buffer for cost overruns`);
  }
  if (margin.mid < 0) {
    score -= 30;
    reasons.push('Negative profit on mid-case scenario');
  }

  const level: 'green' | 'amber' | 'red' =
    score >= 70 ? 'green' : score >= 40 ? 'amber' : 'red';

  if (reasons.length === 0) {
    reasons.push('Inputs appear realistic for this site');
  }

  return { level, reasons };
}

// ─── Main Calculation ────────────────────────────────────────

export function calculateFeasibility(inputs: FeasibilityInputs): FeasibilityResult {
  const {
    numberOfUnits, storeys, floorAreaPerUnit, landCost, productType,
    bedroomMix = 'mixed', parcelAreaSqm, maxHeight,
    slopePercent = null, overlayBuckets = [], suburb = null, zoneName = null,
    salePriceOverride = null,
  } = inputs;

  const totalGFA = numberOfUnits * floorAreaPerUnit;
  const storeyHeight = 3.2;

  // ── Site metrics ─────────────────────────────────────
  let siteMetrics: SiteMetrics | null = null;
  if (parcelAreaSqm && parcelAreaSqm > 0) {
    const buildingFootprint = totalGFA / storeys;
    const siteCoverage = Math.round((buildingFootprint / parcelAreaSqm) * 100);
    const plotRatio = Math.round((totalGFA / parcelAreaSqm) * 100) / 100;
    const maxCoverage = MAX_SITE_COVERAGE[productType] || 50;
    const isOverHeight = maxHeight !== null && maxHeight !== undefined && (storeys * storeyHeight) > maxHeight;
    const maxStoreys = maxHeight ? Math.floor(maxHeight / storeyHeight) : null;

    siteMetrics = {
      parcelAreaSqm,
      buildingFootprint: Math.round(buildingFootprint),
      siteCoverage,
      plotRatio,
      isCoverageExcessive: siteCoverage > maxCoverage,
      isOverHeight,
      maxStoreys,
    };
  }

  // ── Density assessment ───────────────────────────────
  let densityAssessment: DensityAssessment | null = null;
  if (parcelAreaSqm && parcelAreaSqm > 0) {
    densityAssessment = calculateMaxDensity(parcelAreaSqm, productType, storeys, floorAreaPerUnit, zoneName);
    densityAssessment.requestedUnits = numberOfUnits;
    densityAssessment.isOverDense = numberOfUnits > densityAssessment.maxRealisticUnits;
  }

  // ── Base construction ────────────────────────────────
  const constructionRate = CONSTRUCTION_COSTS[productType];
  const constructionCost = multiplyCostRange(constructionRate, totalGFA);

  // ── Slope premium ────────────────────────────────────
  const slopeEscalation = getSlopeEscalation(slopePercent);
  const slopePremium = multiplyCostRange(constructionCost, slopeEscalation.factor);

  // ── Overlay premium ──────────────────────────────────
  const overlayFactor = getOverlayFactor(overlayBuckets);
  const overlayPremium = multiplyCostRange(constructionCost, overlayFactor);

  // ── Adjusted construction (base + slope + overlay) ───
  const adjustedConstructionCost = sumCostRanges(constructionCost, slopePremium, overlayPremium);

  // ── Pre-development costs (Casa Intelligence) ────────
  const preDevelopmentCost: CostRange = { min: 8000, mid: 15000, max: 25000 };

  // ── Status quo pre-development costs ─────────────────
  const statusQuoPreDevCost = sumCostRanges(
    PRE_DEV_COSTS.townPlanner,
    PRE_DEV_COSTS.architect,
    PRE_DEV_COSTS.quantitySurveyor,
    PRE_DEV_COSTS.civilEngineer,
    PRE_DEV_COSTS.geotech,
    PRE_DEV_COSTS.survey,
    PRE_DEV_COSTS.trafficEngineer,
  );

  // ── Infrastructure charges ───────────────────────────
  const infrastructureCharges = multiplyCostRange(INFRASTRUCTURE_CHARGE_PER_DWELLING, numberOfUnits);

  // ── DA fees ──────────────────────────────────────────
  const daFees = DA_LODGEMENT_BASE;

  // ── External works (driveways, landscaping, fencing, retaining, stormwater) ──
  const externalWorks = multiplyCostRange(EXTERNAL_WORKS_PER_UNIT[productType], numberOfUnits);

  // ── Subdivision / strata costs ──────────────────────
  const subdivisionCosts = SUBDIVISION_COSTS[productType];

  // ── New cost components ──────────────────────────────
  const contingency = multiplyCostRange(adjustedConstructionCost, 0.10);
  const professionalFees = multiplyCostRange(adjustedConstructionCost, 0.05);
  // Finance: land is fully drawn from day one; construction draws down progressively
  // ~55% average drawdown on construction over the build period
  const CONSTRUCTION_DRAWDOWN_FACTOR = 0.55;
  const landComponent = { min: landCost, mid: landCost, max: landCost };
  const constructionDrawdown = multiplyCostRange(adjustedConstructionCost, CONSTRUCTION_DRAWDOWN_FACTOR);
  const weightedPrincipal = sumCostRanges(landComponent, constructionDrawdown);
  const financeCosts = multiplyCostRange(weightedPrincipal, 0.08);

  // ── Revenue with suburb adjustment ───────────────────
  let totalRevenue: CostRange;
  let priceTier: { tier: string; factor: number };

  if (salePriceOverride !== null && salePriceOverride > 0) {
    // User has set an explicit per-unit sale price — use it directly with ±10% range
    priceTier = getSuburbPriceTier(suburb);
    const perUnit = salePriceOverride;
    totalRevenue = {
      min: Math.round(perUnit * 0.90) * numberOfUnits,
      mid: perUnit * numberOfUnits,
      max: Math.round(perUnit * 1.10) * numberOfUnits,
    };
  } else {
    // Model-based pricing from product type, bedrooms, and suburb
    let salePriceKey: string;
    if (productType === 'duplex') {
      salePriceKey = bedroomMix === '2bed' ? '2bed_duplex' : '3bed_duplex';
    } else if (productType === 'townhouse') {
      salePriceKey = bedroomMix === '2bed' ? '2bed_townhouse' : '3bed_townhouse';
    } else {
      salePriceKey = bedroomMix === '2bed' ? '2bed_apartment' : '3bed_apartment';
    }

    const baseSalePrice = SALE_PRICES[salePriceKey] || SALE_PRICES['3bed_townhouse'];
    priceTier = getSuburbPriceTier(suburb);
    const adjustedSalePrice = multiplyCostRange(baseSalePrice, priceTier.factor);
    totalRevenue = multiplyCostRange(adjustedSalePrice, numberOfUnits);
  }

  // ── Marketing & selling (3% of revenue) ──────────────
  const marketingAndSelling = multiplyCostRange(totalRevenue, 0.03);

  // ── Total development cost ───────────────────────────
  const totalDevelopmentCost = sumCostRanges(
    { min: landCost, mid: landCost, max: landCost },
    adjustedConstructionCost,
    externalWorks,
    subdivisionCosts,
    preDevelopmentCost,
    infrastructureCharges,
    daFees,
    contingency,
    professionalFees,
    financeCosts,
    marketingAndSelling,
  );

  // ── Profit ───────────────────────────────────────────
  const profit: CostRange = {
    min: totalRevenue.min - totalDevelopmentCost.max,
    mid: totalRevenue.mid - totalDevelopmentCost.mid,
    max: totalRevenue.max - totalDevelopmentCost.min,
  };

  // ── Margin (profit / revenue) ────────────────────────
  const margin: CostRange = {
    min: totalRevenue.min > 0 ? Math.round((profit.min / totalRevenue.min) * 100) : 0,
    mid: totalRevenue.mid > 0 ? Math.round((profit.mid / totalRevenue.mid) * 100) : 0,
    max: totalRevenue.max > 0 ? Math.round((profit.max / totalRevenue.max) * 100) : 0,
  };

  // ── Return on cost ───────────────────────────────────
  const returnOnCost: CostRange = {
    min: totalDevelopmentCost.max > 0 ? Math.round((profit.min / totalDevelopmentCost.max) * 100) : 0,
    mid: totalDevelopmentCost.mid > 0 ? Math.round((profit.mid / totalDevelopmentCost.mid) * 100) : 0,
    max: totalDevelopmentCost.min > 0 ? Math.round((profit.max / totalDevelopmentCost.min) * 100) : 0,
  };

  // ── Confidence scoring ───────────────────────────────
  const confidence = computeConfidence(densityAssessment, overlayBuckets, margin, slopePercent, siteMetrics);

  return {
    totalGFA,
    constructionCost,
    slopePremium,
    overlayPremium,
    adjustedConstructionCost,
    externalWorks,
    subdivisionCosts,
    preDevelopmentCost,
    infrastructureCharges,
    daFees,
    contingency,
    professionalFees,
    financeCosts,
    marketingAndSelling,
    totalDevelopmentCost,
    totalRevenue,
    profit,
    margin,
    returnOnCost,
    statusQuoPreDevCost,
    siteMetrics,
    densityAssessment,
    confidenceLevel: confidence.level,
    confidenceReasons: confidence.reasons,
    salePriceTier: priceTier.tier,
    slopeLabel: slopeEscalation.label,
  };
}

// ─── Formatters ──────────────────────────────────────────────

export function formatCurrency(value: number): string {
  if (Math.abs(value) >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`;
  }
  if (Math.abs(value) >= 1000) {
    return `$${Math.round(value / 1000)}K`;
  }
  return `$${value.toLocaleString()}`;
}

export function formatRange(range: CostRange): string {
  return `${formatCurrency(range.min)} – ${formatCurrency(range.max)}`;
}

export function inferProductType(storeys: number, numberOfUnits?: number): ProductType {
  if (storeys <= 2 && numberOfUnits !== undefined && numberOfUnits <= 2) return 'duplex';
  if (storeys <= 2) return 'townhouse';
  if (storeys <= 4) return 'low_rise_apartment';
  return 'medium_rise_apartment';
}

/** Returns the model's estimated mid-case per-unit sale price for display in the UI */
export function getEstimatedSalePrice(
  productType: ProductType,
  bedroomMix: '2bed' | '3bed' | 'mixed',
  suburb?: string | null | undefined,
): number {
  let salePriceKey: string;
  if (productType === 'duplex') {
    salePriceKey = bedroomMix === '2bed' ? '2bed_duplex' : '3bed_duplex';
  } else if (productType === 'townhouse') {
    salePriceKey = bedroomMix === '2bed' ? '2bed_townhouse' : '3bed_townhouse';
  } else {
    salePriceKey = bedroomMix === '2bed' ? '2bed_apartment' : '3bed_apartment';
  }
  const base = SALE_PRICES[salePriceKey] || SALE_PRICES['3bed_townhouse'];
  const priceTier = getSuburbPriceTier(suburb ?? null);
  return Math.round(base.mid * priceTier.factor);
}
