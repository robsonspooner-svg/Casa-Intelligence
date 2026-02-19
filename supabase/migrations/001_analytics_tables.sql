-- Casa Intelligence Website Analytics Tables
-- Tracks property searches, leads, and checkout attempts

-- 1. searches — every property analysis performed on the site
create table if not exists searches (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  address text,
  lat float8,
  lng float8,
  suburb text,
  lga text,
  zone_name text,
  zone_code text,
  lot_area_sqm float8,
  lot_plan text,
  overlays text[],
  eligible boolean,
  max_lots int,
  land_value bigint,
  market_value bigint,
  property_type text,
  valuation_source text,
  tab text,  -- 'subdivision' | 'development' | 'site'
  session_id text,
  referrer text,
  user_agent text
);

-- 2. leads — contact form submissions
create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text,
  email text,
  phone text,
  address text,
  message text,
  source text,  -- 'contact_form' | 'checkout' | 'subscribe'
  referrer text
);

-- 3. checkouts — service checkout attempts (before payment)
create table if not exists checkouts (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  email text,
  service text,  -- 'preliminary' | 'subdivision' | 'feasibility'
  address text,
  stripe_session_id text,
  amount_cents int,
  referrer text
);

-- Indexes for common queries
create index if not exists idx_searches_created_at on searches (created_at desc);
create index if not exists idx_searches_suburb on searches (suburb);
create index if not exists idx_searches_lga on searches (lga);
create index if not exists idx_searches_eligible on searches (eligible);
create index if not exists idx_leads_created_at on leads (created_at desc);
create index if not exists idx_leads_email on leads (email);
create index if not exists idx_checkouts_created_at on checkouts (created_at desc);
create index if not exists idx_checkouts_email on checkouts (email);

-- RLS: service role only (no anon access needed — all inserts are server-side)
alter table searches enable row level security;
alter table leads enable row level security;
alter table checkouts enable row level security;

-- No RLS policies needed — we use the service_role key which bypasses RLS
