import { getSupabaseAdmin } from './supabase-admin';

/**
 * Fire-and-forget database logging for analytics.
 *
 * All functions are non-blocking — if Supabase is down or unconfigured,
 * the site continues working exactly as before. Errors are logged to
 * console but never thrown to callers.
 */

function isConfigured(): boolean {
  return !!(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

// ---------------------------------------------------------------------------
// Log a property search / analysis
// ---------------------------------------------------------------------------

export interface SearchLog {
  address: string | null;
  lat: number;
  lng: number;
  suburb: string | null;
  lga: string | null;
  zone_name: string | null;
  zone_code: string | null;
  lot_area_sqm: number | null;
  lot_plan: string | null;
  overlays: string[];
  eligible: boolean | null;
  max_lots: number | null;
  land_value: number | null;
  market_value: number | null;
  property_type: string | null;
  valuation_source: string | null;
  tab: string | null;
  session_id: string | null;
  referrer: string | null;
  user_agent: string | null;
}

export async function logSearch(data: SearchLog): Promise<void> {
  if (!isConfigured()) return;
  try {
    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from('searches').insert(data);
    if (error) console.error('[db] logSearch error:', error.message);
  } catch (err) {
    console.error('[db] logSearch exception:', err);
  }
}

// ---------------------------------------------------------------------------
// Log a lead (contact form, subscribe, etc.)
// ---------------------------------------------------------------------------

export interface LeadLog {
  name: string | null;
  email: string;
  phone: string | null;
  address: string | null;
  message: string | null;
  source: string;
  referrer: string | null;
}

export async function logLead(data: LeadLog): Promise<void> {
  if (!isConfigured()) return;
  try {
    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from('leads').insert(data);
    if (error) console.error('[db] logLead error:', error.message);
  } catch (err) {
    console.error('[db] logLead exception:', err);
  }
}

// ---------------------------------------------------------------------------
// Log a checkout attempt
// ---------------------------------------------------------------------------

export interface CheckoutLog {
  email: string;
  service: string;
  address: string | null;
  stripe_session_id: string | null;
  amount_cents: number | null;
  referrer: string | null;
}

export async function logCheckout(data: CheckoutLog): Promise<void> {
  if (!isConfigured()) return;
  try {
    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from('checkouts').insert(data);
    if (error) console.error('[db] logCheckout error:', error.message);
  } catch (err) {
    console.error('[db] logCheckout exception:', err);
  }
}
