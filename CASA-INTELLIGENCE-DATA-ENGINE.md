# Casa Intelligence Data Engine — Master Plan

> **Version**: 1.0
> **Date**: 20 February 2026
> **Status**: Strategic Plan — Ready for Review
> **Classification**: Proprietary & Confidential

---

## Executive Summary

Casa Intelligence will build Queensland's most comprehensive proprietary property intelligence platform — a unified data engine that ingests, normalises, enriches, and analyses every publicly available data point about every property in South East Queensland (2.4M+ lots), starting with DA probability scoring and expanding into a full-stack intelligence system.

**The moat**: Nobody else is combining planning scheme rules + historical DA outcomes + physical site constraints + market data + AI reasoning into a single predictive engine for the Australian market at this granularity. CoreLogic has sales data. Archistar has design feasibility. PlanningAlerts has DA notifications. Nobody has the *decision intelligence layer* that predicts what you can build, whether council will approve it, what it will cost, and what it will be worth — all from a single address lookup.

**Revenue model**: Freemium public tool (lead gen) → Paid reports ($49-$399) → API subscriptions ($199-$2,999/mo) → Enterprise/council licensing ($25K-$100K/year) → Consultancy & advisory services.

**Year 1 target**: 10,000 free analyses/month, 200 paid reports/month ($30K MRR), 15 API subscribers ($15K MRR). **Total: ~$45K MRR / $540K ARR**.

---

## Part 1: The Data Foundation

### 1.1 Data Sources — What We Can Get (and How)

Every data source below is publicly available or purchasable. This is the raw material of our intelligence advantage.

#### Tier 1: Free Public APIs (Available Now)

| Source | Data | Access Method | Coverage | Update Freq |
|--------|------|---------------|----------|-------------|
| **QLD Cadastral (DCDB)** | Lot boundaries, areas, lot/plan IDs | ArcGIS REST (`spatial-gis.information.qld.gov.au`) | All QLD | Nightly |
| **QLD Address Framework** | Addresses, geocoding | ArcGIS REST (same server) | All QLD | Nightly |
| **Council Zoning** | Zone names, boundaries | ArcGIS REST (per-council endpoints) | SEQ councils | Varies |
| **Council Overlays** | Heritage, flood, bushfire, environment | ArcGIS REST (per-council endpoints) | SEQ councils | Varies |
| **State Planning Policy** | SPP mapping layers | ArcGIS REST (`spatial-gis.information.qld.gov.au`) | All QLD | Quarterly |
| **Priority Development Areas** | PDA boundaries, land-use plans | ArcGIS REST (State Dev) | QLD-wide | Quarterly |
| **Logan DA Data** | Decided & undecided DAs, all types | ArcGIS REST (`data-logancity.opendata.arcgis.com`) | Logan LGA | Weekly |
| **Moreton Bay DA Data** | Development applications | ArcGIS REST (`datahub.moretonbay.qld.gov.au`) | MBRC | Weekly |
| **SCC DA Data** | Development, building, plumbing apps | ArcGIS REST (`gislegacy.scc.qld.gov.au`) | SCC | Varies |
| **PlanningAlerts.org.au** | DA feed across 208 authorities | REST API (JSON/GeoJSON) | 88% of Aust pop | Daily |
| **Bushfire Prone Areas** | CSIRO bushfire hazard mapping | Shapefile download (`data.qld.gov.au`) | All QLD | Annual |
| **Flood Mapping** | QFAO + historic flood mapping | ArcGIS REST (FloodCheck) | All QLD | Varies |
| **Contaminated Land Register** | CLR & EMR listings | Public Register Portal (DES) | All QLD | Live |
| **LGA Boundaries** | Local government area polygons | Shapefile (`data.qld.gov.au`) | All QLD | Quarterly |
| **Vegetation Management** | Regulated vegetation mapping | ArcGIS REST (DNRM) | All QLD | Annual |
| **Koala Habitat** | Priority & non-priority areas | ArcGIS REST (DES) | SEQ | Annual |
| **SCC Open Data** | Multiple planning datasets | Open Data Portal (`data.sunshinecoast.qld.gov.au`) | SCC | Varies |
| **Elevation/Contours** | DEM, contour lines | QLD Globe / SRTM / ELVIS | All QLD | Static |
| **RTA Median Rents** | Median weekly rents by suburb, type, beds | CSV download (`rta.qld.gov.au/median-rents`) | All QLD | Quarterly |
| **QLD Property Sales** | Actual sale prices, dates, lot/plan | CSV download (`data.qld.gov.au/dataset/property-sales-data`) | All QLD | Quarterly |
| **QLD Land Valuations** | Unimproved land values per lot | QLD Globe / `data.qld.gov.au` | All QLD | Annual |
| **TransLink GTFS** | All bus/train/ferry routes + stops + timetables | GTFS feed (`gtfsrt.api.translink.com.au`) | SEQ | Per timetable change |
| **BCC ePlan** | Full digital planning scheme (zones, codes, AOs) | HTML (`eplan.brisbane.qld.gov.au`) | BCC | With amendments |
| **QGSO Population Projections** | Population + household + dwelling projections by LGA/SA2 | Excel/CSV (`qgso.qld.gov.au`) | All QLD | 2-3 years |
| **ABS Census / Stat API** | Demographics, income, dwelling counts, household comp | REST API (`stat.data.abs.gov.au`) | All Australia | 5 years |
| **QTRIP Infrastructure** | 4-year forward program of road/transport projects | PDF/Excel (`tmr.qld.gov.au`) | All QLD | Annual |
| **School Directory** | School locations, catchments, enrolment data | Web (`schoolsdirectory.eq.edu.au`) | All QLD | Annual |
| **Wetlands & Waterways** | Wetland mapping, waterway health | WMS (`wetlandinfo.des.qld.gov.au`) | All QLD | Periodic |
| **BCC & Council DA Portals** | DAs for BCC, Gold Coast, Ipswich, Redland | Development.i / ePathway / ArcGIS | Per council | Near real-time |

#### Tier 2: Purchasable/Licensed Data

| Source | Data | Access | Cost Estimate |
|--------|------|--------|---------------|
| **QVAS (Valuer-General)** | Property sales, valuations, unimproved values | Licensed brokers (InfoTrack, CITEC) | $2-5 per search, or bulk licence $5K-$20K/yr |
| **CoreLogic/RPData** | Sales history, AVM, rental data | API subscription | $500-$5,000/mo depending on usage |
| **PropTrack** | AVM, rental estimates, market trends | API via REA Group | Custom pricing |
| **Domain API** | Listings, price guides, market data | Free tier + commercial | Free (limited) to $500+/mo |
| **Nearmap** | High-res aerial imagery, AI features | API subscription | $2,000-$10,000/yr |
| **QBCC** | Building approvals, licences | FOI / bulk request | Free-$500 |
| **ABS Census** | Demographics, income, household comp | Free API (TableBuilder) | Free |
| **Unity Water** | Sewer/water connection availability | Per-request or bulk | $50-200 per search |
| **Urban Utilities** | Sewer/water for BCC/Ipswich/Lockyer/etc | Per-request | $50-200 per search |

#### Tier 3: Derived/Scraped Data (Build Ourselves)

| Source | Data | Method |
|--------|------|--------|
| **Council Planning Schemes** | Zone intent, acceptable outcomes, minimum lot sizes, height limits, setbacks, site cover | PDF parsing (one-time) + Claude extraction + manual validation |
| **Development.i** | SCC/BCC DA details (conditions, approvals, timelines) | HTML scraping of public records |
| **QLD Globe** | Valuation data displayed on map | ArcGIS REST (where available) |
| **Real estate listings** | Current asking prices, days on market | Domain/REA API or scraping |
| **Google Maps** | Amenity proximity (schools, shops, transport) | Google Places API ($0.003/req) |
| **School catchments** | NAPLAN results, school zones | Dept of Education data + geocoding |

### 1.2 Data We Already Have (Casa Intelligence Website)

The current `casa-intelligence-website` codebase already has working integrations for:

- **QLD Cadastral API** → `src/app/api/parcel/route.ts` — lot boundaries, areas
- **Council zoning** → `src/app/api/zoning-qld/route.ts` — zone names from ArcGIS
- **Council overlays** → `src/app/api/overlays-qld/route.ts` — overlay buckets
- **Slope analysis** → `src/app/api/slope/route.ts` — terrain slope from elevation data
- **Geocoding** → `src/app/api/geocode/route.ts` — address to coordinates
- **Planning scheme rules** → `src/lib/subdivision-rules.ts` — SEQ-wide rule engine
- **Property valuations** → `src/app/api/valuation/route.ts` — basic value estimates
- **LGA registry** → `src/lib/lga-registry.ts` — 7 SEQ councils mapped to ArcGIS endpoints
- **Overlay impact engine** → `src/lib/subdivision-rules.ts` — heritage, flood, bushfire, etc. impact assessment
- **Subdivision feasibility** → `src/lib/property-value-estimates.ts` — uplift calculations
- **Search logging** → `src/app/api/log-search/route.ts` + `src/lib/db.ts` + `src/lib/supabase-admin.ts` — already writing to Supabase

### 1.3 Data We Already Have (Propbot/Casa App)

The propbot codebase has extensive Supabase infrastructure (80+ migrations) including:

- Financial summary materialized views
- Property metrics views
- Event-driven agent orchestration (agent_event_queue)
- pgvector for semantic search on agent decisions
- 40+ Edge Functions for background processing
- pg_cron for scheduled jobs

This infrastructure provides the backbone for the data engine — we extend, not rebuild.

---

## Part 2: The Intelligence Products

### Product 1: DA Probability Score (Phase 1 — Build First)

**What it does**: For any address in SEQ, predicts the probability of a development application being approved, the likely conditions, and estimated timeline.

**How it works**:

```
Input: Address
    ↓
[1] Resolve → Lot/Plan, LGA, coordinates
    ↓
[2] Fetch → Zone, overlays, lot area, frontage, slope, flood, bushfire
    ↓
[3] Match → Planning scheme rules (min lot size, setbacks, height, site cover)
    ↓
[4] Compare → Historical DA outcomes for similar properties in same zone/LGA
    ↓
[5] Score → ML model outputs:
    • Approval probability: 0-100%
    • Expected conditions: [list]
    • Estimated timeline: X months
    • Risk factors: [list]
    • Comparable DAs: [list with outcomes]
```

**Training data** (what makes this defensible):

1. **Logan decided DAs** — 10,000+ records with outcomes, conditions, decision dates
2. **Moreton Bay DAs** — 5,000+ records
3. **SCC DAs** — via ArcGIS + Development.i scraping
4. **PlanningAlerts national feed** — 200,000+ records across Australia
5. **Our own planning scheme rule engine** — encodes what *should* be approved
6. **Physical site analysis** — slope, flood, overlays that affect outcomes

**Features for the ML model**:

```
PROPERTY FEATURES:
- lot_area_m2
- frontage_m
- lot_depth_m
- slope_percent
- elevation_m
- shape_regularity_score (compact vs irregular)
- corner_lot (boolean)
- battle_axe (boolean)

PLANNING FEATURES:
- zone_code
- lga
- min_lot_size_standard_rol_m2
- min_lot_size_dual_occ_m2
- overlay_count
- has_flood_overlay
- has_heritage_overlay
- has_bushfire_overlay
- has_character_overlay
- has_vegetation_overlay
- is_in_pda
- infrastructure_charges_area

DA REQUEST FEATURES:
- application_type (ROL, MCU, OPW, combined)
- number_of_lots_proposed
- is_code_assessable (vs impact)
- is_dual_occ_pathway
- exceeds_acceptable_outcomes (boolean)

HISTORICAL FEATURES:
- approval_rate_zone_lga (last 5 years)
- avg_decision_time_zone_lga
- avg_conditions_count
- similar_da_outcomes (k-nearest in feature space)
- council_assessment_load (pending DAs)
```

**Output**:

```json
{
  "approval_probability": 0.87,
  "confidence": "high",
  "pathway": "dual_occupancy_mcu_subsequent_rol",
  "estimated_timeline_months": 4,
  "estimated_infrastructure_charges": 28500,
  "risk_factors": [
    { "factor": "Flood overlay", "impact": "moderate", "mitigation": "Hydraulic study required" }
  ],
  "likely_conditions": [
    "Stormwater management plan",
    "Landscaping plan within 6 months",
    "Acoustic barrier if near arterial road"
  ],
  "comparable_das": [
    { "address": "123 Example St", "lots": 2, "outcome": "approved", "date": "2024-08" },
    { "address": "456 Sample Ave", "lots": 2, "outcome": "approved_with_conditions", "date": "2024-11" }
  ]
}
```

---

### Product 2: Site Intelligence Report

**What it does**: A comprehensive PDF/interactive report for any property — everything a developer, agent, or owner needs to know before making a decision.

**Contents**:

1. **Property Overview** — Address, lot/plan, area, dimensions, aerial photo
2. **Planning Intelligence** — Zone, overlays, acceptable outcomes, performance outcomes
3. **Subdivision Feasibility** — Standard ROL vs dual occ pathways, max lots, estimated layout
4. **DA Probability** — Approval score, risk factors, comparable outcomes
5. **Financial Feasibility** — Land value, estimated build costs, end values, uplift range
6. **Infrastructure** — Sewer/water availability, road access, stormwater
7. **Environmental** — Flood, bushfire, contamination, vegetation constraints
8. **Market Context** — Recent sales nearby, rental yields, vacancy rates, growth trends
9. **Recommendations** — Best development pathway, key risks, next steps

**Pricing tiers**:

| Report Level | Price | Contents | Target |
|-------------|-------|----------|--------|
| **Quick Check** | Free | Zone, overlays, basic eligibility, max lots | Lead generation |
| **Site Snapshot** | $49 | + DA probability, basic feasibility, constraints | Curious owners |
| **Intelligence Report** | $149 | + comparable DAs, financial feasibility, recommendations | Serious owners, agents |
| **Professional Report** | $399 | + infrastructure details, detailed conditions analysis, CAD-ready data | Developers, planners |

---

### Product 3: Prospecting Engine (For Agents & Developers)

**What it does**: Searches all properties in a geographic area and filters by development potential — finds the *best* subdivision/development opportunities before anyone else.

**Search criteria**:

- Zone + minimum lot size (find all properties with dual-occ potential)
- Lot area range
- Overlay exclusions (no flood, no heritage)
- DA probability minimum (>70% approval likely)
- Financial minimum (>$100K estimated uplift)
- Owner type (long-term hold, estate, investor)
- Last sold (estate value vs current, indicating motivation)

**Output**: Map view + ranked list of opportunities with scores.

**Pricing**: $199-$599/mo subscription (agent/developer tier).

---

### Product 4: Market Intelligence Dashboard

**What it does**: Real-time analytics on development activity, approval trends, market shifts across SEQ.

**Metrics**:

- DA lodgment volume by LGA/zone/type (trending up/down)
- Approval rates by LGA (which councils are developer-friendly)
- Average decision timeframes (and which are blowing out)
- Infrastructure charges by LGA (tracking increases)
- Subdivision activity heat maps
- Price per m2 trends for subdivided lots
- Rental yield maps
- Population growth corridors

**Target**: Developers, institutional investors, consultancies, councils.

**Pricing**: $999-$2,999/mo.

---

### Product 5: API Platform

**What it does**: Exposes all Casa Intelligence data and analysis as REST APIs for integration into third-party platforms.

**Endpoints**:

```
GET  /api/v1/property/{lot_plan}           → Full property intelligence
GET  /api/v1/property/{lot_plan}/da-score  → DA probability score
GET  /api/v1/property/{lot_plan}/feasibility → Subdivision feasibility
GET  /api/v1/property/{lot_plan}/report    → Generate PDF report
GET  /api/v1/search/opportunities          → Prospecting search
GET  /api/v1/market/suburb/{suburb}        → Suburb market stats
GET  /api/v1/market/lga/{lga}             → LGA-level analytics
POST /api/v1/batch/properties              → Bulk property analysis
```

**Pricing**:

| Tier | Requests/mo | Price/mo | Target |
|------|-------------|----------|--------|
| Starter | 1,000 | $199 | Small agents, hobbyists |
| Professional | 10,000 | $599 | Agencies, developers |
| Business | 50,000 | $1,499 | Platforms, portals |
| Enterprise | Unlimited | $2,999+ | CoreLogic-scale integrations |

---

### Product 6: Council Intelligence Package

**What it does**: White-label analytics for councils themselves — helps them understand their own development pipeline, compare against other LGAs, and forecast infrastructure needs.

**Features**:

- DA pipeline forecasting (what's coming based on enquiry patterns)
- Approval timeline benchmarking vs other SEQ councils
- Infrastructure charges revenue forecasting
- Growth corridor identification
- Community impact modelling

**Pricing**: $25K-$100K/year per council (enterprise licence).

---

## Part 3: Technical Architecture

### 3.1 System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                        CASA INTELLIGENCE ENGINE                      │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────┐                 │
│  │   INGEST     │  │   PROCESS    │  │   SERVE     │                 │
│  │   LAYER      │  │   LAYER      │  │   LAYER     │                 │
│  │              │  │              │  │             │                 │
│  │ • Scrapers   │→ │ • Normalise  │→ │ • REST API  │                 │
│  │ • API pulls  │  │ • Enrich     │  │ • Reports   │                 │
│  │ • Webhooks   │  │ • ML models  │  │ • Dashboard │                 │
│  │ • File parse │  │ • Scoring    │  │ • Website   │                 │
│  │ • Manual     │  │ • Cache      │  │ • Exports   │                 │
│  └─────────────┘  └──────────────┘  └─────────────┘                 │
│         │                │                  │                         │
│  ┌──────┴──────────────────┴──────────────────┴───────┐              │
│  │              SUPABASE (PostgreSQL + pgvector)       │              │
│  │                                                     │              │
│  │  • properties (master table — every QLD lot)        │              │
│  │  • da_applications (historical DA records)          │              │
│  │  • property_enrichments (computed attributes)       │              │
│  │  • da_predictions (cached ML scores)                │              │
│  │  • planning_rules (encoded scheme rules)            │              │
│  │  • market_data (sales, rentals, valuations)         │              │
│  │  • api_usage (metering, billing)                    │              │
│  │  • reports (generated documents)                    │              │
│  │  • search_queries (analytics)                       │              │
│  └─────────────────────────────────────────────────────┘              │
│         │                                                             │
│  ┌──────┴──────────────────────────────────────────────┐              │
│  │           CLOUDFLARE WORKERS (Edge Compute)          │              │
│  │                                                     │              │
│  │  • API gateway (auth, rate limiting, metering)      │              │
│  │  • Report generator (PDF via Puppeteer)             │              │
│  │  • DA scraper orchestrator                          │              │
│  │  • ML inference (Claude API for reasoning)          │              │
│  │  • Webhook receivers                                │              │
│  └─────────────────────────────────────────────────────┘              │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
```

### 3.2 Database Schema (New Tables for Data Engine)

```sql
-- =============================================================
-- MASTER PROPERTY TABLE
-- Every lot in QLD. 2.4M+ rows. Updated nightly from DCDB.
-- =============================================================
CREATE TABLE ci_properties (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lot_plan        TEXT UNIQUE NOT NULL,        -- '243RP187165'
  lot             TEXT,                         -- '243'
  plan            TEXT,                         -- 'RP187165'
  address         TEXT,
  suburb          TEXT,
  postcode        TEXT,
  lga             TEXT NOT NULL,
  state           TEXT DEFAULT 'QLD',

  -- Physical attributes
  area_m2         NUMERIC,
  frontage_m      NUMERIC,
  depth_m         NUMERIC,
  shape_factor    NUMERIC,                     -- 0-1 (1 = perfect rectangle)
  is_corner       BOOLEAN DEFAULT false,
  is_battle_axe   BOOLEAN DEFAULT false,
  elevation_m     NUMERIC,
  slope_pct       NUMERIC,

  -- Planning attributes
  zone_code       TEXT,
  zone_name       TEXT,
  overlays        TEXT[],                       -- ['flood', 'bushfire', ...]
  overlay_details JSONB,                        -- Detailed overlay info
  is_in_pda       BOOLEAN DEFAULT false,
  pda_name        TEXT,

  -- Geometry
  centroid        GEOMETRY(Point, 4326),
  boundary        GEOMETRY(Polygon, 4326),

  -- Valuation (from QVAS or estimates)
  unimproved_value   NUMERIC,
  improved_value     NUMERIC,
  valuation_date     DATE,

  -- Computed scores (refreshed by enrichment pipeline)
  subdivision_eligible     BOOLEAN,
  subdivision_pathway      TEXT,              -- 'standard_rol', 'dual_occ', 'not_eligible'
  max_lots                 INTEGER,
  da_approval_probability  NUMERIC(4,2),      -- 0.00 - 1.00
  development_potential    NUMERIC(4,2),      -- 0.00 - 1.00 composite score
  estimated_uplift_low     NUMERIC,
  estimated_uplift_high    NUMERIC,

  -- Metadata
  last_enriched    TIMESTAMPTZ,
  data_quality     NUMERIC(3,2),              -- 0-1 confidence in data completeness
  created_at       TIMESTAMPTZ DEFAULT now(),
  updated_at       TIMESTAMPTZ DEFAULT now()
);

-- Spatial index for geo queries
CREATE INDEX idx_ci_properties_centroid ON ci_properties USING GIST (centroid);
CREATE INDEX idx_ci_properties_boundary ON ci_properties USING GIST (boundary);
CREATE INDEX idx_ci_properties_lga ON ci_properties (lga);
CREATE INDEX idx_ci_properties_zone ON ci_properties (zone_code);
CREATE INDEX idx_ci_properties_da_score ON ci_properties (da_approval_probability DESC);
CREATE INDEX idx_ci_properties_potential ON ci_properties (development_potential DESC);

-- =============================================================
-- HISTORICAL DA RECORDS
-- Ingested from council ArcGIS + PlanningAlerts + scraping
-- =============================================================
CREATE TABLE ci_da_applications (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source            TEXT NOT NULL,              -- 'logan_arcgis', 'planning_alerts', 'scc_devt_i'
  source_id         TEXT,                       -- External reference number

  -- Property link
  property_id       UUID REFERENCES ci_properties(id),
  lot_plan          TEXT,
  address           TEXT,
  lga               TEXT,

  -- Application details
  application_number TEXT,
  application_type   TEXT,                      -- 'ROL', 'MCU', 'OPW', 'Combined'
  description        TEXT,
  lodgement_date     DATE,
  decision_date      DATE,
  decision           TEXT,                      -- 'approved', 'refused', 'withdrawn', 'pending'
  conditions         JSONB,                     -- Structured conditions
  conditions_text    TEXT,                       -- Raw conditions text

  -- DA specifics
  lots_proposed      INTEGER,
  lots_existing      INTEGER,
  dwellings_proposed INTEGER,
  storeys_proposed   INTEGER,
  category           TEXT,                      -- 'code', 'impact', 'compliance'

  -- Property attributes at time of DA
  zone_at_lodgement  TEXT,
  area_m2            NUMERIC,
  overlays_at_lodgement TEXT[],

  -- Assessment details
  assessment_manager TEXT,
  referral_agencies  TEXT[],
  submitter_count    INTEGER,
  appeal_filed       BOOLEAN DEFAULT false,
  appeal_outcome     TEXT,

  -- Processing
  days_to_decision   INTEGER,

  -- Metadata
  raw_data           JSONB,                     -- Full original record
  created_at         TIMESTAMPTZ DEFAULT now(),
  updated_at         TIMESTAMPTZ DEFAULT now(),

  UNIQUE(source, source_id)
);

CREATE INDEX idx_ci_da_lga ON ci_da_applications (lga);
CREATE INDEX idx_ci_da_type ON ci_da_applications (application_type);
CREATE INDEX idx_ci_da_decision ON ci_da_applications (decision);
CREATE INDEX idx_ci_da_lodgement ON ci_da_applications (lodgement_date);
CREATE INDEX idx_ci_da_property ON ci_da_applications (property_id);

-- =============================================================
-- PLANNING SCHEME RULES (Machine-readable)
-- Encoded from council planning scheme PDFs
-- =============================================================
CREATE TABLE ci_planning_rules (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lga             TEXT NOT NULL,
  zone_code       TEXT NOT NULL,
  zone_name       TEXT NOT NULL,

  -- Subdivision rules
  min_lot_area_m2           NUMERIC,
  min_frontage_m            NUMERIC,
  max_site_cover_pct        NUMERIC,
  max_height_m              NUMERIC,
  max_storeys               INTEGER,
  min_setback_front_m       NUMERIC,
  min_setback_side_m        NUMERIC,
  min_setback_rear_m        NUMERIC,

  -- Dual occupancy rules
  dual_occ_permitted        BOOLEAN,
  dual_occ_min_parent_m2    NUMERIC,
  dual_occ_min_result_m2    NUMERIC,
  dual_occ_assessment_level TEXT,             -- 'accepted', 'code', 'impact'

  -- Multi-unit rules
  multi_unit_permitted      BOOLEAN,
  multi_unit_density        NUMERIC,          -- dwellings per hectare
  multi_unit_assessment     TEXT,

  -- Other
  home_business_permitted   BOOLEAN,
  secondary_dwelling        BOOLEAN,

  -- Source tracking
  scheme_name               TEXT,             -- 'Sunshine Coast Planning Scheme 2014'
  scheme_version            TEXT,
  table_reference           TEXT,             -- 'Table 6.2.1.3.1'
  last_verified             DATE,
  verified_by               TEXT,

  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now(),

  UNIQUE(lga, zone_code)
);

-- =============================================================
-- DA PREDICTIONS (Cached ML outputs)
-- =============================================================
CREATE TABLE ci_da_predictions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id     UUID REFERENCES ci_properties(id) NOT NULL,

  -- Prediction inputs
  scenario        TEXT NOT NULL,               -- 'subdivision_2_lot', 'dual_occ', 'multi_unit'
  lots_proposed   INTEGER,

  -- Prediction outputs
  approval_probability    NUMERIC(4,2),
  confidence              TEXT,                -- 'high', 'medium', 'low'
  estimated_timeline_months INTEGER,
  estimated_infra_charges NUMERIC,
  risk_factors            JSONB,
  likely_conditions       JSONB,
  comparable_da_ids       UUID[],
  reasoning               TEXT,               -- AI reasoning summary

  -- Model info
  model_version           TEXT,
  features_used           JSONB,

  -- Validity
  valid_until             TIMESTAMPTZ,
  created_at              TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_ci_pred_property ON ci_da_predictions (property_id);
CREATE INDEX idx_ci_pred_score ON ci_da_predictions (approval_probability DESC);

-- =============================================================
-- MARKET DATA
-- Sales, rentals, valuations from external sources
-- =============================================================
CREATE TABLE ci_market_data (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id     UUID REFERENCES ci_properties(id),
  lot_plan        TEXT,
  address         TEXT,
  suburb          TEXT,
  lga             TEXT,

  -- Transaction
  data_type       TEXT NOT NULL,               -- 'sale', 'rental', 'valuation'
  date            DATE,
  price           NUMERIC,
  price_per_m2    NUMERIC,

  -- Property details at transaction
  bedrooms        INTEGER,
  bathrooms       INTEGER,
  car_spaces      INTEGER,
  property_type   TEXT,
  land_area_m2    NUMERIC,
  floor_area_m2   NUMERIC,
  year_built      INTEGER,

  -- Source
  source          TEXT,                         -- 'qvas', 'domain', 'realestate'
  source_id       TEXT,
  raw_data        JSONB,

  created_at      TIMESTAMPTZ DEFAULT now(),

  UNIQUE(source, source_id)
);

CREATE INDEX idx_ci_market_suburb ON ci_market_data (suburb, data_type, date);
CREATE INDEX idx_ci_market_lga ON ci_market_data (lga, data_type, date);
CREATE INDEX idx_ci_market_property ON ci_market_data (property_id);

-- =============================================================
-- RTA RENTAL DATA (Authoritative QLD rental data — FREE)
-- Ingested quarterly from rta.qld.gov.au/median-rents
-- =============================================================
CREATE TABLE ci_rta_rents (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quarter         TEXT NOT NULL,               -- '2025-Q4'
  lga             TEXT NOT NULL,
  suburb          TEXT NOT NULL,
  property_type   TEXT NOT NULL,               -- 'House', 'Unit', 'Townhouse'
  bedrooms        INTEGER,
  median_rent     NUMERIC,
  new_bonds       INTEGER,                     -- Number of new bonds lodged (proxy for rental volume)
  quarterly_change_pct NUMERIC,
  created_at      TIMESTAMPTZ DEFAULT now(),
  UNIQUE(quarter, suburb, property_type, bedrooms)
);

CREATE INDEX idx_ci_rta_suburb ON ci_rta_rents (suburb, property_type);
CREATE INDEX idx_ci_rta_lga ON ci_rta_rents (lga, quarter);

-- =============================================================
-- SUBURB ANALYTICS (Pre-computed)
-- Refreshed daily/weekly from market_data
-- =============================================================
CREATE MATERIALIZED VIEW ci_suburb_stats AS
SELECT
  suburb,
  lga,
  data_type,
  COUNT(*) as transaction_count,
  AVG(price) as avg_price,
  PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY price) as median_price,
  AVG(price_per_m2) as avg_price_per_m2,
  MIN(date) as earliest_date,
  MAX(date) as latest_date,
  -- Trend (last 12 months vs prior 12 months)
  AVG(CASE WHEN date >= CURRENT_DATE - INTERVAL '12 months' THEN price END) as avg_price_last_12m,
  AVG(CASE WHEN date >= CURRENT_DATE - INTERVAL '24 months'
       AND date < CURRENT_DATE - INTERVAL '12 months' THEN price END) as avg_price_prior_12m
FROM ci_market_data
GROUP BY suburb, lga, data_type;

-- =============================================================
-- API USAGE & BILLING
-- =============================================================
CREATE TABLE ci_api_keys (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID,                        -- Link to auth user if applicable
  key_hash        TEXT UNIQUE NOT NULL,
  name            TEXT,
  tier            TEXT NOT NULL DEFAULT 'starter',
  monthly_limit   INTEGER NOT NULL DEFAULT 1000,
  is_active       BOOLEAN DEFAULT true,
  created_at      TIMESTAMPTZ DEFAULT now(),
  expires_at      TIMESTAMPTZ
);

CREATE TABLE ci_api_usage (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  api_key_id      UUID REFERENCES ci_api_keys(id),
  endpoint        TEXT NOT NULL,
  method          TEXT NOT NULL,
  status_code     INTEGER,
  response_time_ms INTEGER,
  ip_address      INET,
  user_agent      TEXT,
  request_params  JSONB,
  billed          BOOLEAN DEFAULT false,
  created_at      TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_ci_usage_key_date ON ci_api_usage (api_key_id, created_at);

-- =============================================================
-- GENERATED REPORTS
-- =============================================================
CREATE TABLE ci_reports (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id     UUID REFERENCES ci_properties(id),
  report_type     TEXT NOT NULL,               -- 'quick_check', 'snapshot', 'intelligence', 'professional'
  status          TEXT DEFAULT 'generating',    -- 'generating', 'completed', 'failed'

  -- Payment
  payment_intent  TEXT,
  amount_cents    INTEGER,
  paid            BOOLEAN DEFAULT false,

  -- Output
  storage_path    TEXT,                         -- Supabase Storage path
  download_url    TEXT,
  download_count  INTEGER DEFAULT 0,

  -- Report data (cached inputs)
  report_data     JSONB,

  -- Tracking
  requested_by    TEXT,                         -- email or api_key
  created_at      TIMESTAMPTZ DEFAULT now(),
  completed_at    TIMESTAMPTZ
);

-- =============================================================
-- DATA INGESTION TRACKING
-- =============================================================
CREATE TABLE ci_ingestion_runs (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source          TEXT NOT NULL,                -- 'logan_da', 'scc_zoning', 'planning_alerts'
  status          TEXT DEFAULT 'running',       -- 'running', 'completed', 'failed'
  records_fetched INTEGER DEFAULT 0,
  records_new     INTEGER DEFAULT 0,
  records_updated INTEGER DEFAULT 0,
  records_failed  INTEGER DEFAULT 0,
  error_log       JSONB,
  started_at      TIMESTAMPTZ DEFAULT now(),
  completed_at    TIMESTAMPTZ,
  next_run        TIMESTAMPTZ
);
```

### 3.3 Ingestion Pipeline Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                    INGESTION ORCHESTRATOR                      │
│                 (Cloudflare Worker + pg_cron)                  │
├──────────────────────────────────────────────────────────────┤
│                                                                │
│  SCHEDULE:                                                     │
│  ├── NIGHTLY (2am AEST):                                       │
│  │   ├── Sync QLD Cadastral DB → ci_properties                │
│  │   ├── Refresh zoning for changed lots                       │
│  │   └── Refresh overlays for changed lots                     │
│  │                                                             │
│  ├── HOURLY:                                                   │
│  │   ├── Pull Logan DA feed (ArcGIS REST)                     │
│  │   ├── Pull Moreton Bay DA feed (ArcGIS REST)               │
│  │   └── Pull PlanningAlerts feed (REST API)                  │
│  │                                                             │
│  ├── EVERY 6 HOURS:                                            │
│  │   ├── Scrape SCC Development.i (new DAs only)              │
│  │   └── Scrape BCC Development.i (new DAs only)              │
│  │                                                             │
│  ├── WEEKLY:                                                   │
│  │   ├── Re-enrich all properties with updated scores          │
│  │   ├── Refresh suburb analytics materialized view            │
│  │   └── Refresh DA prediction cache for hot properties        │
│  │                                                             │
│  └── MONTHLY:                                                  │
│      ├── Full QVAS sync (if licensed)                         │
│      ├── Refresh planning scheme rules (check for amendments) │
│      └── Generate market trend reports                         │
│                                                                │
│  EACH INGESTION RUN:                                           │
│  1. Create ci_ingestion_runs record                           │
│  2. Fetch data from source                                    │
│  3. Normalise to internal schema                              │
│  4. Upsert into target table                                  │
│  5. Link DA records to ci_properties via lot_plan/address     │
│  6. Trigger re-enrichment for affected properties             │
│  7. Update ingestion_runs with stats                          │
│  8. Alert on failures                                         │
└──────────────────────────────────────────────────────────────┘
```

### 3.4 Enrichment Pipeline

The enrichment pipeline takes raw property data and computes derived intelligence:

```
FOR EACH property in ci_properties WHERE needs_enrichment:

  1. PLANNING ANALYSIS
     ├── Match zone to ci_planning_rules
     ├── Determine subdivision eligibility (standard ROL + dual occ)
     ├── Calculate max lots
     └── Assess overlay impacts

  2. PHYSICAL ANALYSIS
     ├── Calculate shape factor from boundary geometry
     ├── Determine if corner lot (multiple road frontages)
     ├── Determine if battle-axe (access handle detection)
     ├── Calculate slope from DEM
     └── Assess usable area (excluding easements, steep areas)

  3. DA PROBABILITY
     ├── Fetch comparable DAs from ci_da_applications (same zone, LGA, similar area)
     ├── Calculate base approval rate
     ├── Apply modifiers for overlays, slope, shape
     ├── Use Claude API for reasoning about edge cases
     └── Store in ci_da_predictions

  4. FINANCIAL ANALYSIS
     ├── Estimate current value (from QVAS or market comparables)
     ├── Estimate per-lot value (from recent subdivided lot sales)
     ├── Calculate gross uplift
     ├── Apply development cost factors
     └── Calculate net uplift range

  5. COMPOSITE SCORE
     ├── development_potential = weighted average of:
     │   ├── 0.30 × da_approval_probability
     │   ├── 0.25 × financial_uplift_score
     │   ├── 0.20 × site_suitability_score
     │   ├── 0.15 × market_demand_score
     │   └── 0.10 × infrastructure_score
     └── Store in ci_properties.development_potential

  6. UPDATE METADATA
     ├── Set last_enriched = now()
     ├── Calculate data_quality score (completeness)
     └── Mark any missing data sources
```

### 3.5 ML/AI Approach

We are NOT building a traditional ML model from scratch. Instead, we use a **hybrid approach**:

1. **Rules Engine** (deterministic) — Planning scheme rules, overlay impacts, lot size checks. This is what we already have and is being extended. Handles 70% of the analysis.

2. **Statistical Model** (historical data) — Base approval rates, timeline distributions, condition frequency by zone/LGA/type. Simple aggregations on `ci_da_applications`. Handles 20%.

3. **Claude API** (reasoning layer) — For edge cases, nuanced site analysis, generating report narratives, and reasoning about performance outcomes vs acceptable outcomes. Handles 10% but provides the highest-value insights.

This approach means:
- No expensive model training infrastructure
- No ML ops complexity
- Results are explainable (rules + stats + reasoning)
- Can be improved incrementally by adding data
- Claude gets better with each API update

---

## Part 4: Implementation Roadmap

### Phase 1: DA Intelligence Foundation (Weeks 1-4)

**Goal**: Ingest historical DA data, build the prediction engine, ship DA probability on the website.

| Week | Deliverables |
|------|-------------|
| 1 | Database schema (ci_properties, ci_da_applications, ci_planning_rules, ci_da_predictions). Supabase migration. Logan DA ingestion pipeline (ArcGIS REST → ci_da_applications). |
| 2 | PlanningAlerts ingestion pipeline. SCC DA scraper (Development.i). Moreton Bay DA ingestion. Property → DA linking (match by lot_plan or geocoded address). |
| 3 | DA probability scoring engine: rules engine + statistical model + Claude reasoning. API endpoint: `POST /api/v1/da-score`. Integration into SubdivisionResult on website. |
| 4 | Testing against known DA outcomes (validation set). Calibration. Ship to production. Blog post announcing DA Intelligence. |

**Key metrics at end of Phase 1**:
- 20,000+ DA records ingested
- DA probability score available for all SEQ properties
- Score accuracy >75% on validation set (approved vs refused prediction)

### Phase 2: Property Intelligence Layer (Weeks 5-8)

**Goal**: Enrich every SEQ property with computed intelligence, launch paid reports.

| Week | Deliverables |
|------|-------------|
| 5 | ci_properties bulk load from DCDB (2.4M lots). Zoning + overlay bulk enrichment. Planning rules encoding (all SEQ councils from planning scheme PDFs via Claude extraction). |
| 6 | Enrichment pipeline: shape analysis, corner/battle-axe detection, slope, flood check. Financial analysis integration (market comparables from Domain/QVAS). |
| 7 | Site Intelligence Report generator (PDF). Stripe payment integration for reports. Quick Check (free) + Site Snapshot ($49) + Intelligence Report ($149). |
| 8 | Professional Report tier ($399). Report delivery via email + download. Marketing launch for paid reports. |

**Key metrics at end of Phase 2**:
- 2.4M properties with basic intelligence
- 500K properties with full enrichment (SEQ focus)
- Report generation <30 seconds
- First paid report revenue

### Phase 3: Prospecting & API (Weeks 9-12)

**Goal**: Launch the Prospecting Engine for agents/developers and the public API.

| Week | Deliverables |
|------|-------------|
| 9 | Spatial search engine (PostGIS queries). Prospecting UI: map + filters + ranked results. Agent onboarding flow. |
| 10 | API platform: auth (API keys), rate limiting, metering. Core endpoints: property lookup, DA score, feasibility, search. API documentation (OpenAPI/Swagger). |
| 11 | API billing integration (Stripe metered billing). Usage dashboard for API customers. Webhook notifications for DA status changes. |
| 12 | Beta launch with 10 pilot agents/developers. Iterate based on feedback. Marketing push for API + Prospecting. |

**Key metrics at end of Phase 3**:
- 5+ API beta customers
- 50+ Prospecting Engine users
- API uptime >99.5%

### Phase 4: Market Intelligence & Scale (Weeks 13-20)

**Goal**: Market Intelligence Dashboard, council licensing, geographic expansion.

| Week | Deliverables |
|------|-------------|
| 13-14 | Market Intelligence Dashboard UI. DA activity trends, approval rates, timeline analytics. Suburb-level market stats. |
| 15-16 | Council Intelligence Package (white-label). First council pilot engagement. Enterprise pricing and contracts. |
| 17-18 | Expand beyond SEQ: Cairns, Townsville, Toowoomba, Mackay. Then interstate: Northern Rivers NSW, Gold Coast hinterland. |
| 19-20 | Self-service onboarding for all products. Referral program for agents. Content marketing engine (automated suburb reports → SEO). |

---

## Part 5: Competitive Positioning

### 5.1 The Competitive Landscape

| Player | Strength | Gap We Exploit |
|--------|----------|----------------|
| **CoreLogic** | Sales data, valuations, 99% coverage | No planning intelligence, no DA prediction, no subdivision feasibility. Data-only, no actionable intelligence. |
| **Archistar** | 3D design, site feasibility, planning rules | Expensive ($200+/mo), focused on sophisticated developers, no DA probability scoring, no historical DA analysis. |
| **Landchecker** | Planning overlays, zoning data | No DA prediction, no financial feasibility, no agent-facing tools. Melbourne-centric. |
| **PropTrack** | AVM, rental estimates, REA integration | No planning/development intelligence at all. Pure valuation play. |
| **Domain** | Listings, price guides, free API | No planning intelligence, no development feasibility. Consumer-facing only. |
| **PlanningAlerts** | DA notifications, open source | Notification-only, no analysis, no prediction, no enrichment. Raw data feed. |
| **Pricefinder** | Property research, comparable sales | Agent tool, no planning intelligence, no DA prediction. |

### 5.2 Our Unique Position

**Nobody in Australia is combining**:

1. Physical site analysis (lot area, shape, slope, constraints) +
2. Planning scheme rules (zones, acceptable outcomes, overlays) +
3. Historical DA outcomes (approval rates, conditions, timelines) +
4. AI reasoning (edge case analysis, performance outcomes) +
5. Financial feasibility (uplift estimates, development costs) +
6. Market context (comparable sales, rental yields, growth)

Into a **single predictive intelligence layer** accessible via website, reports, and API.

**Our moat deepens over time** because:
- Every DA outcome we ingest makes predictions more accurate
- Every report generated gives us feedback on accuracy
- Every property enriched adds to the network effect
- Planning scheme rules are manually encoded — hard to replicate quickly
- AI reasoning improves as context grows

### 5.3 Pricing Strategy

**Principle**: Free tools drive traffic → Paid reports convert owners → API locks in businesses → Enterprise secures councils.

```
FREE (Website)
├── Address lookup + basic zone/overlay check
├── Subdivision eligibility (yes/no/dual-occ)
├── Estimated lot count
└── DA probability score (low/medium/high — no number)

$49 SITE SNAPSHOT
├── Everything free +
├── Exact DA probability score with confidence
├── Basic financial feasibility (uplift range)
├── Key constraints summary
└── 3 comparable DA outcomes

$149 INTELLIGENCE REPORT (Core product)
├── Everything Snapshot +
├── Detailed constraint analysis
├── 10+ comparable DAs with conditions
├── Infrastructure charges estimate
├── Development pathway recommendation
├── Timeline estimate
└── PDF report

$399 PROFESSIONAL REPORT
├── Everything Intelligence +
├── Detailed planning scheme analysis
├── Performance outcomes assessment
├── Infrastructure and services assessment
├── Risk register
├── Recommended consultants
└── CAD-ready site data

$199-$2,999/mo API ACCESS
├── Programmatic access to all intelligence
├── Bulk property analysis
├── Webhook DA notifications
└── Custom integrations

$25K-$100K/yr COUNCIL/ENTERPRISE
├── White-label dashboards
├── Pipeline forecasting
├── Benchmarking analytics
└── Custom data feeds
```

---

## Part 6: Revenue Projections

### Year 1 (Conservative)

| Revenue Stream | Monthly Volume | Price | Monthly Revenue |
|----------------|---------------|-------|-----------------|
| Site Snapshots | 100 reports | $49 | $4,900 |
| Intelligence Reports | 60 reports | $149 | $8,940 |
| Professional Reports | 15 reports | $399 | $5,985 |
| API Starter | 8 subscribers | $199 | $1,592 |
| API Professional | 4 subscribers | $599 | $2,396 |
| API Business | 2 subscribers | $1,499 | $2,998 |
| Prospecting Engine | 30 subscribers | $299 | $8,970 |
| **Total MRR** | | | **$35,781** |
| **Annualised** | | | **$429,372** |

### Year 2 (Growth)

| Revenue Stream | Monthly Volume | Price | Monthly Revenue |
|----------------|---------------|-------|-----------------|
| Reports (all tiers) | 500 reports | $120 avg | $60,000 |
| API (all tiers) | 40 subscribers | $600 avg | $24,000 |
| Prospecting Engine | 100 subscribers | $350 avg | $35,000 |
| Council Licences | 2 councils | $6,000/mo avg | $12,000 |
| **Total MRR** | | | **$131,000** |
| **Annualised** | | | **$1,572,000** |

### Year 3 (Scale)

Add interstate expansion (NSW, VIC), additional council contracts, enterprise API deals, and strategic partnerships with real estate franchises.

Target: **$3-5M ARR**.

---

## Part 7: Build Priorities (What to Build First)

### Priority 1: DA Data Ingestion (This Week)

This is the *irreducible first step*. Everything else depends on having historical DA data.

**Action items**:
1. Create Supabase migration with `ci_da_applications` table
2. Build Logan DA ingestion worker (ArcGIS REST → Supabase)
3. Build PlanningAlerts ingestion worker (REST API → Supabase)
4. Build SCC DA scraper (Development.i HTML → Supabase)
5. Run initial ingestion: target 20,000+ records

### Priority 2: DA Probability Engine (Week 2)

**Action items**:
1. Build statistical model: approval rates by zone × LGA × type
2. Build feature extractor: property attributes → feature vector
3. Build comparable DA finder: k-nearest DAs in feature space
4. Build scoring function: rules + stats + comparables → score
5. Add Claude reasoning layer for edge cases
6. Ship as API endpoint + integrate into website

### Priority 3: Property Enrichment (Week 3-4)

**Action items**:
1. Bulk load ci_properties from DCDB (start with SEQ ~800K lots)
2. Bulk zoning enrichment (batch ArcGIS queries)
3. Bulk overlay enrichment
4. Run enrichment pipeline on all properties
5. Build spatial search for prospecting

### Priority 4: Paid Reports (Week 5-6)

**Action items**:
1. Build PDF report generator (Puppeteer or React-PDF)
2. Build Stripe checkout for reports
3. Build report delivery (email + download link)
4. Launch 3 report tiers

---

## Part 8: Technical Decisions

### 8.1 Why Supabase (not a separate database)?

- Already have infrastructure, auth, storage, Edge Functions
- PostGIS support built-in for spatial queries
- pgvector for future embedding-based search
- pg_cron for scheduled ingestion
- Realtime for webhook-like notifications
- RLS for multi-tenant API access
- Cost-effective at this scale (100K rows = free tier)

### 8.2 Why Cloudflare Workers (for scrapers)?

- Already planned for propbot agent worker
- No cold start (instant execution)
- Cron triggers built-in
- KV storage for scraper state
- Cheap at scale (100K requests/day = ~$5/month)
- Globally distributed (low latency for API)

### 8.3 Why Claude (not a custom ML model)?

- DA approval prediction is a reasoning task, not a pattern matching task
- Each DA is unique — traditional ML struggles with sparse features
- Claude can read planning scheme rules and reason about edge cases
- Claude can generate human-readable explanations
- No training infrastructure needed
- Improves automatically with model updates
- Cost: ~$0.05 per property analysis (affordable at scale)

### 8.4 Data Freshness Strategy

| Data Type | Freshness Target | Method |
|-----------|-----------------|--------|
| DA applications | <1 hour | Hourly API polling |
| Property cadastral | <24 hours | Nightly DCDB sync |
| Zoning/overlays | <1 week | Weekly refresh |
| Market data (sales) | <1 month | Monthly QVAS + Domain sync |
| Planning scheme rules | <3 months | Quarterly manual review |
| Enrichment scores | <1 week | Weekly re-enrichment |

---

## Part 9: Risk Register

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Council blocks scraping | Medium | Medium | Use official APIs first; scraping only for Development.i. PlanningAlerts provides fallback. |
| CoreLogic restricts data | Medium | Low | Use QVAS (government source) + Domain API as alternatives. Don't depend on any single commercial source. |
| DA prediction accuracy < 70% | High | Medium | Start with simple rules + stats. Add Claude reasoning layer. Continuously validate against outcomes. Under-promise initially. |
| Low conversion on paid reports | High | Medium | Free tool must deliver genuine value. Paid reports must add substantial insight beyond free. A/B test pricing. |
| Supabase scale limits | Low | Low | PostgreSQL can handle millions of rows. Materialized views for aggregation. Partition tables if needed. |
| Legal challenge on data use | Low | Low | All data is publicly available. No scraping of copyrighted content. Comply with QLD property data code of conduct. |
| Competitor copies approach | Medium | Medium | Our moat is data accumulation + planning scheme encoding + AI reasoning quality. First-mover advantage on DA intelligence in QLD. |

---

## Part 10: Success Metrics

### Launch Criteria (Phase 1)

- [ ] 20,000+ DA records ingested from 3+ councils
- [ ] DA probability score available for any SEQ address
- [ ] Prediction accuracy >75% on validation set
- [ ] Score displayed on website subdivision analyser
- [ ] <3 second response time for DA score API

### Growth Criteria (Phase 2-3)

- [ ] 500K+ properties enriched with intelligence
- [ ] 100+ paid reports generated per month
- [ ] 10+ API subscribers
- [ ] 50+ prospecting engine users
- [ ] <$0.10 cost per property analysis

### Scale Criteria (Phase 4+)

- [ ] $50K+ MRR
- [ ] 1M+ properties in database
- [ ] 1 council licensing contract
- [ ] Interstate expansion begun
- [ ] DA prediction accuracy >85%

---

## Appendix A: API Endpoints Reference

### Council DA Data Endpoints (Confirmed Working)

```
LOGAN CITY COUNCIL:
  Decided: https://services5.arcgis.com/.../FeatureServer/0/query
  Undecided: https://services5.arcgis.com/.../FeatureServer/0/query
  Open Data: https://data-logancity.opendata.arcgis.com/

MORETON BAY:
  DA Data: https://datahub.moretonbay.qld.gov.au/
  ArcGIS: Council-specific ArcGIS REST endpoints

SUNSHINE COAST:
  ArcGIS: https://gislegacy.scc.qld.gov.au/arcgis/rest/services/PlanningCadastre/Applications_SCRC/MapServer
  Development.i: https://developmenti.sunshinecoast.qld.gov.au
  Open Data: https://data.sunshinecoast.qld.gov.au/
  Zoning: https://gislegacy.scc.qld.gov.au/arcgis/rest/services/PlanningCadastre/PlanningScheme_SunshineCoast_Zoning_SCC/MapServer

PLANNING ALERTS (National):
  API Docs: https://www.planningalerts.org.au/api/howto
  Format: JSON, GeoJSON, GeoRSS
  Coverage: 208 authorities, 88% of Australian population
  Limit: 1,000 records per request, daily quota per API key

QLD STATE:
  Cadastral: https://spatial-gis.information.qld.gov.au/arcgis/rest/services/PlanningCadastre/LandParcelPropertyFramework/MapServer
  PDAs: https://spatial-gis.information.qld.gov.au/arcgis/rest/services/PlanningCadastre/PriorityDevelopmentAreas/MapServer
  SDAs: https://spatial-gis.information.qld.gov.au/arcgis/rest/services/PlanningCadastre/StateDevelopmentAreas/MapServer
  Flood: https://floodcheck.information.qld.gov.au/
  Bushfire: https://www.data.qld.gov.au/dataset/bushfire-prone-area-queensland-series
  Contaminated Land: Public Register Portal (DES)
```

### Property Data Brokers

```
QVAS (Valuer-General):
  Access: Licensed brokers (InfoTrack, CITEC)
  Data: Sales, valuations, unimproved values
  Cost: $2-5/search or bulk licence $5K-$20K/yr
  Portal: https://www.qld.gov.au/environment/land/title/valuation/property-sales

DOMAIN API:
  Docs: https://developer.domain.com.au/
  Free tier: Public listing data, basic search
  Commercial: Price estimates, market data

PROPTECH DATA:
  API: https://proptechdata.com.au/api/
  Coverage: 13M+ properties Australia-wide
  Free trial: 100 requests/day for 30 days

PRICEFINDER:
  API: https://www.pricefinder.com.au/api/
  Data: Property research, comparable sales
```

---

## Appendix B: Existing Code to Leverage

### Casa Intelligence Website (`casa-intelligence-website/`)

| File | Can Reuse For |
|------|--------------|
| `src/app/api/parcel/route.ts` | Lot/plan lookup, area, boundary |
| `src/app/api/zoning-qld/route.ts` | Zone lookup per council |
| `src/app/api/overlays-qld/route.ts` | Overlay lookup per council |
| `src/app/api/slope/route.ts` | Slope analysis |
| `src/app/api/geocode/route.ts` | Address → coordinates |
| `src/app/api/valuation/route.ts` | Property value estimates |
| `src/lib/subdivision-rules.ts` | Planning scheme rule engine (dual occ + standard ROL) |
| `src/lib/property-value-estimates.ts` | Uplift calculations |
| `src/lib/lga-registry.ts` | Council → ArcGIS endpoint mapping |
| `src/lib/zoning-rules.ts` | Additional zoning logic |
| `src/lib/feasibility-calc.ts` | Financial feasibility |
| `src/lib/db.ts` + `supabase-admin.ts` | Supabase client for data storage |

### Propbot (`propbot/`)

| Component | Can Reuse For |
|-----------|--------------|
| Supabase infrastructure | Same project, add new tables |
| Edge Functions pattern | Scraper/ingestion workers |
| Materialized views | Suburb stats, DA analytics |
| Agent event queue | DA monitoring, enrichment triggers |
| pgvector setup | Comparable DA search |
| Stripe integration | Report payments, API billing |
| pg_cron | Scheduled ingestion jobs |

---

*This document is the strategic foundation for Casa Intelligence's data engine. It should be updated as decisions are made and phases are completed. Every line of code written for the data engine should trace back to a section in this plan.*
