import { NextRequest, NextResponse } from 'next/server';
import { logSearch } from '@/lib/db';

/**
 * Logs a property search/analysis to the database.
 * Called from the client after analysis completes.
 * Fire-and-forget — always returns 200 even if logging fails.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const referrer = request.headers.get('referer') || null;
    const userAgent = request.headers.get('user-agent') || null;

    await logSearch({
      address: body.address || null,
      lat: body.lat || 0,
      lng: body.lng || 0,
      suburb: body.suburb || null,
      lga: body.lga || null,
      zone_name: body.zone_name || null,
      zone_code: body.zone_code || null,
      lot_area_sqm: body.lot_area_sqm || null,
      lot_plan: body.lot_plan || null,
      overlays: body.overlays || [],
      eligible: body.eligible ?? null,
      max_lots: body.max_lots || null,
      land_value: body.land_value || null,
      market_value: body.market_value || null,
      property_type: body.property_type || null,
      valuation_source: body.valuation_source || null,
      tab: body.tab || null,
      session_id: body.session_id || null,
      referrer,
      user_agent: userAgent,
    });
  } catch {
    // Silently ignore — logging should never break the user experience
  }

  return NextResponse.json({ ok: true });
}
