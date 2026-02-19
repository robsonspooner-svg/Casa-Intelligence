import { NextRequest, NextResponse } from 'next/server';

/**
 * QLD Valuer-General land valuation API.
 *
 * This queries the public (unauthenticated) RPC endpoint that backs the
 * "Find your land valuation" tool on the QLD Government website.
 * It returns the statutory land value (unimproved) for any QLD property.
 *
 * Flow: address search → property ID → valuation + surrounding properties
 */

const BASE_URL =
  'https://apps.resources.qld.gov.au/valuations/land-valuations/valuation.rpc.php';

const HEADERS: Record<string, string> = {
  'Referer': 'https://www.qld.gov.au/environment/land/title/valuation/annual/find-your-land-valuation',
  'Origin': 'https://www.qld.gov.au',
  'Accept': 'application/json, text/javascript, */*',
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
};

interface AddressResult {
  id: string;
  street: string;
  locality_name: string;
  postcode: string;
  address: string;
}

interface PropertyValuation {
  id: string;
  address: string;
  rpd: string;
  property_area: string;
  property_type: string;
  current_value_date: string;
  current_value: string;
  new_value_date: string;
  new_value: string;
  lga_name: string;
  lat: string;
  lng: string;
  total_lots: string;
}

interface SurroundingProperty {
  id: string;
  address: string;
  property_area: string;
  property_type: string;
  current_value: string;
  new_value: string;
}

async function fetchRPC<T>(params: string): Promise<T | null> {
  try {
    const res = await fetch(`${BASE_URL}?${params}`, {
      headers: HEADERS,
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data;
  } catch {
    return null;
  }
}

/**
 * Estimate improved (market) value from statutory land value.
 *
 * Statutory valuations reflect unimproved land value. Actual market value
 * depends on improvements (buildings). We apply property-type multipliers
 * derived from the typical land-to-total-value ratio for QLD:
 *
 *   - Vacant land: 1.0x  (land value IS market value)
 *   - Residential house: ~1.8-2.5x (house adds 80-150% of land value)
 *   - Multi-unit: ~2.5-3.5x (buildings add significant value)
 *   - Commercial: ~2.0-3.0x
 *
 * These are conservative estimates. The multiplier is applied to give users
 * a reasonable ballpark, clearly labelled as an estimate.
 */
function estimateMarketValue(
  landValue: number,
  propertyType: string,
  totalLots: number,
  areaSqm: number,
): { estimatedValue: number; confidence: 'high' | 'medium' | 'low'; method: string } {
  const type = propertyType.toLowerCase();

  // Vacant land — land value is effectively the market value
  if (type.includes('vacant') || type.includes('broadacre') || areaSqm > 10000) {
    return {
      estimatedValue: landValue,
      confidence: 'high',
      method: 'statutory_land_value',
    };
  }

  // Multi-unit residential — significant improvement value
  if (type.includes('multi unit') || type.includes('multi-unit') || totalLots > 2) {
    // For multi-unit, the land value is typically 30-40% of total value
    // Use 2.8x as a conservative multiplier
    const multiplier = totalLots >= 10 ? 3.2 : totalLots >= 4 ? 2.8 : 2.2;
    return {
      estimatedValue: Math.round(landValue * multiplier),
      confidence: 'medium',
      method: 'multi_unit_multiplier',
    };
  }

  // Standard residential — house on a single lot
  if (type.includes('residential') || type.includes('dwelling')) {
    // Residential: land is typically 40-60% of total value in SEQ
    // Higher-value areas tend to have higher land-to-value ratios
    const multiplier = landValue > 1500000 ? 1.6 : landValue > 800000 ? 1.9 : 2.2;
    return {
      estimatedValue: Math.round(landValue * multiplier),
      confidence: 'medium',
      method: 'residential_multiplier',
    };
  }

  // Commercial / industrial
  if (type.includes('commercial') || type.includes('retail') || type.includes('industrial')) {
    return {
      estimatedValue: Math.round(landValue * 2.5),
      confidence: 'low',
      method: 'commercial_multiplier',
    };
  }

  // Rural / primary production
  if (type.includes('rural') || type.includes('primary') || type.includes('farm')) {
    return {
      estimatedValue: Math.round(landValue * 1.3),
      confidence: 'medium',
      method: 'rural_multiplier',
    };
  }

  // Fallback — use a moderate multiplier
  return {
    estimatedValue: Math.round(landValue * 2.0),
    confidence: 'low',
    method: 'generic_multiplier',
  };
}

// ---------------------------------------------------------------------------
// Street type expansion — the QLD API requires full names (e.g. "Street" not "St")
// ---------------------------------------------------------------------------

const STREET_ABBREV: Record<string, string> = {
  'St': 'Street', 'St.': 'Street',
  'Rd': 'Road', 'Rd.': 'Road',
  'Ave': 'Avenue', 'Ave.': 'Avenue', 'Av': 'Avenue',
  'Dr': 'Drive', 'Dr.': 'Drive',
  'Ct': 'Court', 'Ct.': 'Court',
  'Cres': 'Crescent', 'Cr': 'Crescent',
  'Pl': 'Place', 'Pl.': 'Place',
  'Pde': 'Parade',
  'Tce': 'Terrace', 'Ter': 'Terrace',
  'Cl': 'Close',
  'Cir': 'Circuit', 'Cct': 'Circuit',
  'Blvd': 'Boulevard',
  'Hwy': 'Highway',
  'Ln': 'Lane',
  'Esp': 'Esplanade',
  'Prom': 'Promenade',
  'Way': 'Way',
  'Gr': 'Grove',
  'Grv': 'Grove',
  'Pkt': 'Pocket',
  'Mews': 'Mews',
  'Rw': 'Row',
  'Gdns': 'Gardens',
  'Sq': 'Square',
  'Bvd': 'Boulevard',
  'Cnr': 'Corner',
};

/** Expand abbreviated street types to full form (e.g. "10 Smith St" → "10 Smith Street") */
function expandStreetType(addr: string): string {
  // Match word boundaries for abbreviations — case-insensitive
  return addr.replace(/\b(\w+\.?)\b/g, (match) => {
    // Check case-insensitive but preserve only known abbreviations
    for (const [abbr, full] of Object.entries(STREET_ABBREV)) {
      if (match.toLowerCase() === abbr.toLowerCase()) {
        return full;
      }
    }
    return match;
  });
}

/** Clean geocoder address into QLD API search format */
function prepareSearchQueries(rawAddress: string): string[] {
  // Remove state/country suffixes, postcodes
  let cleaned = rawAddress
    .replace(/,?\s*(Queensland|QLD|Australia)\s*,?\s*\d{0,4}\s*$/i, '')
    .replace(/\s+\d{4}\s*$/, '')  // trailing postcode
    .replace(/,\s*$/, '')
    .trim();

  // Remove all commas — the QLD API doesn't use them
  cleaned = cleaned.replace(/,/g, '').replace(/\s+/g, ' ').trim();

  const expanded = expandStreetType(cleaned);
  const queries: string[] = [];

  // Attempt 1: Full expanded address (e.g. "4 Maloja Avenue Caloundra")
  if (expanded !== cleaned) {
    queries.push(expanded);
  }

  // Attempt 2: Original cleaned (in case it was already full form)
  queries.push(cleaned);

  // Attempt 3: Just street number + street name (first 3-4 words), expanded
  const words = expanded.split(' ');
  if (words.length > 3) {
    // Try number + street name + street type (first 3 words)
    queries.push(words.slice(0, 3).join(' '));
  }

  // Attempt 4: Just number + surname for partial match
  if (words.length >= 2) {
    queries.push(words.slice(0, 2).join(' '));
  }

  // Deduplicate
  return Array.from(new Set(queries));
}

/** Extract suburb from an address string (last meaningful word(s) after street type) */
function extractSuburb(rawAddress: string): string | null {
  // Addresses from geocoder look like: "4 Maloja Ave, Caloundra, QLD 4551, Australia"
  // or "10 Smith Place, Cannon Hill, QLD"
  const cleaned = rawAddress
    .replace(/,?\s*(Queensland|QLD|Australia)\s*,?\s*\d{0,4}\s*$/i, '')
    .replace(/\s+\d{4}\s*$/, '')
    .replace(/,\s*$/, '')
    .trim();

  const parts = cleaned.split(',').map((p) => p.trim()).filter(Boolean);
  // Suburb is typically the second-to-last or last comma-separated part
  if (parts.length >= 2) {
    return parts[parts.length - 1];
  }
  return null;
}

async function searchAddress(queries: string[], suburb: string | null): Promise<AddressResult | null> {
  for (const query of queries) {
    const data = await fetchRPC<{ jcb: AddressResult[] } | string>(
      `type=address_search&code=${encodeURIComponent(query)}`
    );
    // API returns "0 results" string or { jcb: [...] }
    if (data && typeof data === 'object' && 'jcb' in data && data.jcb.length > 0) {
      // If we have a suburb hint, prefer results matching that suburb
      if (suburb) {
        const suburbUpper = suburb.toUpperCase();
        const localityMatch = data.jcb.find(
          (r) => r.locality_name.toUpperCase() === suburbUpper
        );
        if (localityMatch) return localityMatch;
      }
      // Otherwise return first result
      return data.jcb[0];
    }
  }
  return null;
}

export async function GET(request: NextRequest) {
  const address = request.nextUrl.searchParams.get('address');

  if (!address) {
    return NextResponse.json({ error: 'address parameter required' }, { status: 400 });
  }

  try {
    const queries = prepareSearchQueries(address);
    const suburb = extractSuburb(address);
    const match = await searchAddress(queries, suburb);

    if (!match) {
      return NextResponse.json({
        valuation: null,
        message: 'No valuation found for this address',
      });
    }

    return await processValuation(match);
  } catch (error) {
    console.error('Valuation API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch valuation data' },
      { status: 500 }
    );
  }
}

async function processValuation(addressMatch: AddressResult) {
  // Step 2: Get the property valuation
  // The API wraps results in a { jcb: [...] } array
  const propWrapper = await fetchRPC<{ jcb: PropertyValuation[] }>(
    `type=property&code=${addressMatch.id}`
  );

  const propData = propWrapper?.jcb?.[0] ?? null;

  if (!propData || !propData.current_value) {
    return NextResponse.json({
      valuation: null,
      message: 'No valuation data available for this property',
    });
  }

  const landValue = parseInt(propData.current_value, 10) || 0;
  const totalLots = parseInt(propData.total_lots, 10) || 1;
  const areaSqm = parseInt(propData.property_area, 10) || 0;

  // Step 3: Get surrounding properties for context
  const surroundingData = await fetchRPC<{ jcb: SurroundingProperty[] }>(
    `type=surrounding_property&code=${addressMatch.id}`
  );

  const surroundingValues: number[] = [];
  if (surroundingData?.jcb) {
    for (const sp of surroundingData.jcb) {
      const val = parseInt(sp.current_value, 10);
      if (val > 0) surroundingValues.push(val);
    }
  }

  // Calculate surrounding stats
  const surroundingMedian = surroundingValues.length > 0
    ? surroundingValues.sort((a, b) => a - b)[Math.floor(surroundingValues.length / 2)]
    : null;

  // Step 4: Estimate improved (market) value
  const marketEstimate = estimateMarketValue(
    landValue,
    propData.property_type,
    totalLots,
    areaSqm,
  );

  // Use the newer valuation if available
  const newValue = parseInt(propData.new_value, 10) || 0;
  const effectiveLandValue = newValue > 0 ? newValue : landValue;
  const valuationDate = newValue > 0 ? propData.new_value_date : propData.current_value_date;

  // Recalculate with effective value if new value exists
  const effectiveMarket = newValue > 0
    ? estimateMarketValue(newValue, propData.property_type, totalLots, areaSqm)
    : marketEstimate;

  return NextResponse.json({
    valuation: {
      propertyId: addressMatch.id,
      address: propData.address,
      rpd: propData.rpd,
      areaSqm,
      propertyType: propData.property_type,
      lga: propData.lga_name,
      totalLots,
      // Statutory land value (unimproved)
      landValue: effectiveLandValue,
      landValueDate: valuationDate,
      // Estimated market value (improved)
      estimatedMarketValue: effectiveMarket.estimatedValue,
      confidence: effectiveMarket.confidence,
      method: effectiveMarket.method,
      // Surrounding context
      surroundingMedianLandValue: surroundingMedian,
      surroundingCount: surroundingValues.length,
    },
  });
}
