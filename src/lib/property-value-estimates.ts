/**
 * Property valuation and subdivision uplift calculation.
 *
 * PRIMARY SOURCE: QLD Valuer-General statutory land valuations (via /api/valuation)
 * FALLBACK: Suburb/LGA median estimates from market data
 *
 * The uplift calculation models subdivision value creation:
 *   Before: One property worth X
 *   After:  N lots, each worth a per-lot value based on suburb medians
 *   Uplift: (N × per-lot value) - X
 */

// ---------------------------------------------------------------------------
// Suburb median values — used as FALLBACK when valuation API unavailable
// and for per-lot pricing in subdivision uplift calculations
// ---------------------------------------------------------------------------

const SUBURB_MEDIANS: Record<string, number> = {
  // Sunshine Coast — Premium
  'Noosa Heads': 1750000,
  'Sunshine Beach': 1850000,
  'Peregian Beach': 1400000,
  'Coolum Beach': 1100000,
  'Mooloolaba': 1200000,
  'Alexandra Headland': 1050000,
  'Maroochydore': 900000,
  'Buderim': 950000,
  'Mountain Creek': 850000,
  'Sippy Downs': 780000,
  'Caloundra': 850000,
  'Kings Beach': 900000,
  'Golden Beach': 780000,
  'Pelican Waters': 1050000,
  'Kawana Island': 1100000,
  'Birtinya': 750000,
  'Bokarina': 900000,
  'Wurtulla': 850000,
  'Currimundi': 900000,
  'Battery Hill': 800000,
  'Dicky Beach': 950000,
  'Shelly Beach': 900000,
  'Aroona': 800000,
  'Landsborough': 700000,
  'Beerwah': 680000,
  'Glass House Mountains': 700000,
  'Palmwoods': 780000,
  'Woombye': 750000,
  'Nambour': 650000,
  'Bli Bli': 850000,
  'Pacific Paradise': 750000,
  'Marcoola': 900000,
  'Mudjimba': 950000,
  'Twin Waters': 1000000,
  'Baringa': 700000,
  'Nirimba': 680000,
  'Palmview': 720000,
  'Aura': 700000,
  'Bells Creek': 700000,
  'Caloundra West': 700000,
  'Maleny': 850000,
  'Montville': 900000,

  // Brisbane — Premium
  'New Farm': 2200000,
  'Teneriffe': 1800000,
  'Ascot': 2100000,
  'Hamilton': 1900000,
  'Bulimba': 1700000,
  'Hawthorne': 1600000,
  'Paddington': 1500000,
  'Red Hill': 1350000,
  'Bardon': 1250000,
  'Ashgrove': 1200000,
  'The Gap': 950000,
  'Kenmore': 1000000,
  'Chapel Hill': 1050000,
  'Indooroopilly': 1200000,
  'St Lucia': 1350000,
  'Taringa': 1100000,
  'Toowong': 1050000,
  'Auchenflower': 1200000,
  'Milton': 1100000,
  'West End': 1300000,
  'Highgate Hill': 1250000,
  'Dutton Park': 1100000,
  'Woolloongabba': 1000000,
  'Coorparoo': 1100000,
  'Camp Hill': 1200000,
  'Carindale': 1050000,
  'Carina': 950000,
  'Holland Park': 950000,
  'Mount Gravatt': 800000,
  'Wishart': 850000,
  'Mansfield': 900000,
  'Rochedale': 950000,
  'Eight Mile Plains': 850000,
  'Sunnybank': 900000,
  'Sunnybank Hills': 850000,
  'Robertson': 850000,
  'Algester': 750000,
  'Forest Lake': 700000,
  'Darra': 650000,
  'Oxley': 700000,
  'Richlands': 620000,
  'Inala': 550000,
  'Springfield': 650000,
  'Springfield Lakes': 680000,

  // Brisbane — North
  'Chermside': 850000,
  'Nundah': 950000,
  'Wavell Heights': 1050000,
  'Kedron': 1100000,
  'Stafford': 900000,
  'Stafford Heights': 900000,
  'Everton Park': 850000,
  'McDowall': 900000,
  'Bridgeman Downs': 1000000,
  'Albany Creek': 850000,
  'Aspley': 800000,
  'Geebung': 750000,
  'Zillmere': 650000,
  'Bracken Ridge': 700000,
  'Sandgate': 800000,
  'Shorncliffe': 950000,
  'Brighton': 850000,
  'Deagon': 700000,

  // Gold Coast — Premium
  'Surfers Paradise': 1200000,
  'Broadbeach': 1100000,
  'Main Beach': 1500000,
  'Southport': 800000,
  'Bundall': 1200000,
  'Benowa': 1100000,
  'Ashmore': 850000,
  'Nerang': 700000,
  'Mudgeeraba': 900000,
  'Robina': 900000,
  'Varsity Lakes': 800000,
  'Merrimac': 750000,
  'Mermaid Beach': 1400000,
  'Mermaid Waters': 1200000,
  'Miami': 1100000,
  'Burleigh Heads': 1350000,
  'Burleigh Waters': 1050000,
  'Palm Beach': 1200000,
  'Elanora': 950000,
  'Currumbin': 1100000,
  'Tugun': 1000000,
  'Coolangatta': 1050000,
  'Coomera': 700000,
  'Upper Coomera': 750000,
  'Pimpama': 650000,
  'Ormeau': 680000,
  'Helensvale': 900000,
  'Oxenford': 750000,
  'Pacific Pines': 800000,
  'Hope Island': 1050000,
  'Sanctuary Cove': 1400000,

  // Moreton Bay
  'Redcliffe': 700000,
  'Scarborough': 800000,
  'Margate': 700000,
  'Clontarf': 750000,
  'Woody Point': 700000,
  'Kippa-Ring': 620000,
  'Rothwell': 600000,
  'Deception Bay': 550000,
  'Caboolture': 550000,
  'Morayfield': 580000,
  'Burpengary': 650000,
  'Narangba': 700000,
  'North Lakes': 750000,
  'Mango Hill': 750000,
  'Kallangur': 600000,
  'Petrie': 620000,
  'Strathpine': 650000,
  'Warner': 700000,
  'Eatons Hill': 850000,

  // Logan
  'Logan Village': 700000,
  'Jimboomba': 700000,
  'Shailer Park': 700000,
  'Daisy Hill': 750000,
  'Springwood': 600000,
  'Underwood': 750000,
  'Slacks Creek': 500000,
  'Woodridge': 500000,
  'Logan Central': 480000,
  'Beenleigh': 550000,
  'Eagleby': 520000,
  'Waterford West': 580000,
  'Marsden': 580000,
  'Crestmead': 550000,
  'Browns Plains': 600000,
  'Regents Park': 600000,

  // Ipswich
  'Ipswich': 500000,
  'Brassall': 520000,
  'Karalee': 650000,
  'Bellbird Park': 580000,
  'Brookwater': 800000,
  'Augustine Heights': 680000,
  'Ripley': 580000,
  'Redbank Plains': 530000,
  'Collingwood Park': 520000,
  'Goodna': 480000,

  // Redland
  'Cleveland': 850000,
  'Ormiston': 900000,
  'Wellington Point': 850000,
  'Birkdale': 780000,
  'Capalaba': 700000,
  'Alexandra Hills': 700000,
  'Thornlands': 800000,
  'Victoria Point': 750000,
  'Redland Bay': 700000,
};

const LGA_MEDIANS: Record<string, number> = {
  'SUNSHINE COAST': 850000,
  'SUNSHINE COAST REGIONAL': 850000,
  'BRISBANE': 950000,
  'BRISBANE CITY': 950000,
  'GOLD COAST': 900000,
  'GOLD COAST CITY': 900000,
  'MORETON BAY': 650000,
  'MORETON BAY REGIONAL': 650000,
  'MORETON BAY CITY': 650000,
  'LOGAN': 600000,
  'LOGAN CITY': 600000,
  'IPSWICH': 550000,
  'IPSWICH CITY': 550000,
  'REDLAND': 750000,
  'REDLAND CITY': 750000,
  'NOOSA': 1100000,
  'NOOSA SHIRE': 1100000,
  'LOCKYER VALLEY': 500000,
  'LOCKYER VALLEY REGIONAL': 500000,
  'SCENIC RIM': 600000,
  'SCENIC RIM REGIONAL': 600000,
  'SOMERSET': 500000,
  'SOMERSET REGIONAL': 500000,
};

const SEQ_DEFAULT_MEDIAN = 750000;

/** Lookup suburb median house price (used for per-lot value in uplift calcs) */
export function getSuburbMedian(suburb: string | null, lga: string | null): number {
  if (suburb) {
    const direct = SUBURB_MEDIANS[suburb];
    if (direct) return direct;
    const lower = suburb.toLowerCase();
    for (const [key, value] of Object.entries(SUBURB_MEDIANS)) {
      if (key.toLowerCase() === lower) return value;
    }
  }
  if (lga) {
    const lgaKey = lga.toUpperCase().trim();
    if (LGA_MEDIANS[lgaKey]) return LGA_MEDIANS[lgaKey];
  }
  return SEQ_DEFAULT_MEDIAN;
}

// ---------------------------------------------------------------------------
// Valuation data types (from /api/valuation response)
// ---------------------------------------------------------------------------

export interface ValuationData {
  propertyId: string;
  address: string;
  rpd: string;
  areaSqm: number;
  propertyType: string;
  lga: string;
  totalLots: number;
  landValue: number;
  landValueDate: string;
  estimatedMarketValue: number;
  confidence: 'high' | 'medium' | 'low';
  method: string;
  surroundingMedianLandValue: number | null;
  surroundingCount: number;
}

// ---------------------------------------------------------------------------
// Subdivision uplift calculation
// ---------------------------------------------------------------------------

export interface SubdivisionUpliftResult {
  /** Current land value (unimproved — what subdivision economics are based on) */
  propertyValue: number;
  /** Total value of all lots after subdivision */
  totalValueAfter: number;
  /** Raw uplift in dollars */
  uplift: number;
  /** Uplift as a percentage */
  upliftPercentage: number;
  /** How the property value was determined */
  valueSource: 'valuation_api' | 'suburb_median';
  /** Per-lot estimated value */
  perLotValue: number;
}

/**
 * Calculate subdivision uplift using real valuation data when available.
 *
 * Key insight: subdivision is about splitting LAND, not buildings.
 * We use statutory land value (unimproved) as the baseline, because:
 *   - A $16M apartment building on $5M land doesn't become worth more
 *     if you split it into 2 residential lots
 *   - The real question is: is N × (per-lot land value) > current land value?
 *
 * Logic:
 *   currentLandValue = valuation API land value OR suburb median fallback
 *   perLotValue      = suburb median × lot discount factor
 *   totalAfter       = numberOfLots × perLotValue
 *   uplift           = totalAfter - currentLandValue
 */
export function calculateSubdivisionUplift(
  suburb: string | null,
  lga: string | null,
  numberOfLots: number,
  valuation?: ValuationData | null,
): SubdivisionUpliftResult {
  const suburbMedian = getSuburbMedian(suburb, lga);

  // Current property LAND value — use statutory land value from the valuation API.
  // This is the unimproved value — what the land alone is worth without buildings.
  // This is the correct baseline for subdivision economics.
  //
  // IMPORTANT: QLD statutory valuations can be significantly outdated, especially
  // in premium areas (e.g. Noosa showing $335K for land worth $3M+). We apply a
  // sanity check: if the statutory value is less than 25% of the suburb median,
  // it's likely a stale valuation. In that case we fall back to suburb median.
  let propertyValue: number;
  let valueSource: 'valuation_api' | 'suburb_median';

  if (valuation && valuation.landValue > 0) {
    // Sanity check: statutory value should be a reasonable fraction of suburb median.
    // Land is typically 40-70% of total property value, so the statutory land value
    // should be at least ~25% of the suburb median house+land price.
    // If it's less, the statutory valuation is likely stale/outdated.
    const minReasonableLandValue = suburbMedian * 0.25;
    if (valuation.landValue >= minReasonableLandValue) {
      propertyValue = valuation.landValue;
      valueSource = 'valuation_api';
    } else {
      // Stale statutory valuation — use suburb median as a more realistic baseline.
      // Land-only is roughly 50-60% of median house+land in premium areas.
      propertyValue = Math.round(suburbMedian * 0.55);
      valueSource = 'suburb_median';
    }
  } else {
    propertyValue = suburbMedian;
    valueSource = 'suburb_median';
  }

  // Per-lot value after subdivision
  // New lots are smaller than the original so they sell for less per lot,
  // but the total across multiple lots exceeds the original single-lot value.
  //
  // We use suburb median (house+land) as the per-lot value proxy, because
  // after subdivision, each new lot is typically sold with a new dwelling —
  // the buyer pays for land + new build, approximating the suburb median.
  //
  // Discount by lot count: more lots = smaller each = lower per-lot value
  const lotDiscount = numberOfLots <= 2 ? 0.90
    : numberOfLots <= 4 ? 0.82
    : numberOfLots <= 6 ? 0.75
    : 0.70;

  const perLotValue = Math.round(suburbMedian * lotDiscount);
  const totalValueAfter = perLotValue * numberOfLots;
  const uplift = Math.max(0, totalValueAfter - propertyValue);

  return {
    propertyValue,
    totalValueAfter,
    uplift,
    upliftPercentage: propertyValue > 0 ? Math.round((uplift / propertyValue) * 100) : 0,
    valueSource,
    perLotValue,
  };
}
