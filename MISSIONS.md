# Casa Intelligence — Engine Missions

> **Version**: 1.0
> **Date**: 20 February 2026
> **Classification**: Proprietary & Confidential
>
> Each mission is sequential and must be completed fully before the next begins.
> The engine should be usable by Robbie at the end of every mission — no dead code, no stubs.

---

## How You (Robbie) Will Use the Engine

### Phase 1: Internal Console (Missions 01-03)

During early development, you interact with the engine through a **private admin dashboard** built into the existing Next.js website at `/engine`. This is password-protected (not publicly accessible) and gives you:

- A search bar where you type any SEQ address
- A full intelligence readout for that property (everything we know)
- Raw data inspection (see exactly what came from which API)
- DA history for that property and nearby properties
- A "Generate Report" button to produce a PDF
- Data ingestion status (what's been ingested, what's pending, errors)
- Query console to run ad-hoc searches across the database

This is your primary interface. You can test any address, verify accuracy, compare against real DA outcomes, and iterate on the scoring model — all from a browser.

### Phase 2: Public Products (Missions 04-07)

Once the engine is validated and accurate:

1. **Website integration** — DA probability score + comparable DAs appear on the existing Site Analyser / Subdivision Analyser pages (the free public tools)
2. **Paid reports** — "Generate Intelligence Report" button triggers a PDF report, gated behind Stripe checkout ($49-$399)
3. **API** — REST endpoints with API key auth, documented with Swagger/OpenAPI
4. **Prospecting Engine** — Map-based search tool for agents/developers (separate page or app)

### Phase 3: Scale Products (Missions 08-10)

1. **Market Intelligence Dashboard** — Analytics dashboard for developers/investors
2. **API marketplace** — Self-service API key provisioning, usage dashboard, billing
3. **Council/Enterprise packages** — White-label dashboards, custom data feeds

---

## Mission 00: Overview & Dependencies

```
Mission 01: Database Foundation + DA Ingestion Pipeline
    ↓
Mission 02: Property Intelligence Engine + Internal Console
    ↓
Mission 03: DA Probability Scoring + Comparable DA Search
    ↓
Mission 04: Public Website Integration (Free Tier)
    ↓
Mission 05: Paid Reports + Stripe Checkout
    ↓
Mission 06: REST API Platform + Auth + Metering
    ↓
Mission 07: Prospecting Engine (Agent/Developer Tool)
    ↓
Mission 08: Market Intelligence Dashboard
    ↓
Mission 09: Go-to-Market Systems (Email, CRM, Analytics, SEO)
    ↓
Mission 10: Scale, Expand, Enterprise
```

**Estimated total build time**: 12-16 weeks for Missions 01-07 (revenue-generating). Missions 08-10 are ongoing.

---

## Mission 01: Database Foundation + DA Ingestion Pipeline

**Goal**: Stand up the core database and ingest 20,000+ historical DA records from real government sources. At the end of this mission, we have a populated database of DA history that we can query.

**Duration**: 1 week

### 1.1 Database Schema (Supabase Migration)

Create the following tables in the existing Casa Intelligence Supabase project:

| Table | Purpose |
|-------|---------|
| `ci_properties` | Master property table — every lot in SEQ. Physical attributes, zoning, scores. |
| `ci_da_applications` | Historical DA records from all sources. |
| `ci_planning_rules` | Machine-readable planning scheme rules per zone per LGA. |
| `ci_da_predictions` | Cached DA probability scores. |
| `ci_market_data` | Sales and rental transaction data. |
| `ci_rta_rents` | RTA authoritative rental data (quarterly CSV). |
| `ci_ingestion_runs` | Tracking table for data pipeline runs. |
| `ci_api_keys` | API key management (for later). |
| `ci_api_usage` | API usage metering (for later). |
| `ci_reports` | Generated report tracking + payments. |

**PostGIS extension** must be enabled for spatial queries (geometry columns on ci_properties).

Full SQL in `CASA-INTELLIGENCE-DATA-ENGINE.md` Part 3.2.

### 1.2 DA Ingestion Workers

Build as **Next.js API routes** (not Cloudflare Workers — keeps everything in one codebase for now, move to Workers later for cron).

| Worker | Source | Method | Target Volume |
|--------|--------|--------|---------------|
| `POST /api/engine/ingest/logan-da` | Logan ArcGIS Open Data | ArcGIS REST API query (paginated, all records) | 10,000+ decided DAs |
| `POST /api/engine/ingest/planning-alerts` | PlanningAlerts.org.au | REST API (JSON, paginated by authority) | 5,000+ QLD DAs |
| `POST /api/engine/ingest/scc-da` | Sunshine Coast ArcGIS | ArcGIS REST API query | 3,000+ DAs |
| `POST /api/engine/ingest/moreton-bay-da` | Moreton Bay | ArcGIS REST API query | 3,000+ DAs |

Each worker:
1. Creates a `ci_ingestion_runs` record (status: 'running')
2. Fetches data from source API (paginated, handles rate limits)
3. Normalises each record to `ci_da_applications` schema
4. Upserts into database (UNIQUE on source + source_id)
5. Updates `ci_ingestion_runs` with stats (records_fetched, records_new, records_failed)
6. Returns summary JSON

### 1.3 Planning Rules Seed

Populate `ci_planning_rules` from our existing `subdivision-rules.ts` data. This is a one-time seed — the existing TypeScript rules become the initial rows. Add columns for setbacks, height, site cover that we'll fill in over subsequent missions.

### 1.4 Auth Protection

All `/api/engine/*` routes are protected by a simple shared secret (environment variable `ENGINE_ADMIN_SECRET`). Requests must include `Authorization: Bearer <secret>`. This is NOT user auth — it's just to prevent public access to admin endpoints.

### Mission 01 Complete When:

- [ ] All database tables created and migrated
- [ ] PostGIS enabled, spatial indexes working
- [ ] Logan DA ingestion returns 10,000+ records
- [ ] PlanningAlerts ingestion returns 5,000+ QLD records
- [ ] SCC DA ingestion returns 3,000+ records
- [ ] Moreton Bay DA ingestion returns 3,000+ records
- [ ] Total: 20,000+ DA records in `ci_da_applications`
- [ ] `ci_ingestion_runs` has records for each successful run
- [ ] `ci_planning_rules` seeded with all SEQ LGA zone rules
- [ ] All admin endpoints protected by ENGINE_ADMIN_SECRET
- [ ] Can query DAs by LGA, zone, type, decision, date range

---

## Mission 02: Property Intelligence Engine + Internal Console

**Goal**: Build the enrichment pipeline and the internal admin dashboard (`/engine`) so Robbie can look up any SEQ property and see everything the engine knows about it.

**Duration**: 1.5 weeks

### 2.1 Property Enrichment Pipeline

Build `POST /api/engine/enrich` that takes a lot_plan or address and:

1. Fetches/creates the `ci_properties` record (from DCDB if new)
2. Fetches zoning from council ArcGIS (reuse existing `zoning-qld` route logic)
3. Fetches overlays from council ArcGIS (reuse existing `overlays-qld` route logic)
4. Fetches slope from elevation API (reuse existing `slope` route logic)
5. Runs subdivision eligibility check (reuse existing `subdivision-rules.ts`)
6. Matches to any existing DA records in `ci_da_applications` (by lot_plan or proximity)
7. Calculates property value estimate (reuse existing `property-value-estimates.ts`)
8. Calculates data quality score (what % of fields are populated)
9. Stores all enriched data back to `ci_properties`
10. Returns the full enriched property object

This pipeline unifies all our existing API routes into a single enrichment flow.

### 2.2 Bulk Enrichment

Build `POST /api/engine/enrich/bulk` that takes a list of lot_plans (or an LGA + zone filter) and enriches them all. Uses a queue pattern — kicks off background processing and returns a job ID. Progress trackable via `ci_ingestion_runs`.

### 2.3 Property Lookup API

Build `GET /api/engine/property?address=X` and `GET /api/engine/property?lot_plan=X`:

Returns the full intelligence readout for a property:

```json
{
  "property": { /* ci_properties record */ },
  "planning": { /* zone, overlays, rules */ },
  "subdivision": { /* eligibility, pathway, max_lots */ },
  "da_history": [ /* DAs on this property */ ],
  "nearby_das": [ /* DAs within 500m, similar zone */ ],
  "market": { /* recent sales nearby, rental yields */ },
  "scores": {
    "development_potential": 0.78,
    "data_quality": 0.85
  }
}
```

### 2.4 Internal Console UI (`/engine`)

Build a private admin page at `/engine` in the Next.js app:

**Layout**:
```
┌─────────────────────────────────────────────────────────┐
│  🔍 Search: [address or lot/plan]            [Search]   │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────────┐  ┌──────────────────────────────┐ │
│  │  PROPERTY CARD    │  │  MAP (parcel boundary)       │ │
│  │  Address          │  │                              │ │
│  │  Lot/Plan         │  │                              │ │
│  │  Area: 780m²      │  │                              │ │
│  │  Zone: LDR        │  │                              │ │
│  │  LGA: SCC         │  └──────────────────────────────┘ │
│  │  Overlays: flood  │                                   │
│  │  Slope: 3.2%      │  ┌──────────────────────────────┐ │
│  │                    │  │  DA HISTORY                  │ │
│  │  SCORES:           │  │  ┌─────────────────────────┐ │ │
│  │  Dev Potential: 78 │  │  │ ROL - 2024-08 - Approved│ │ │
│  │  DA Probability: — │  │  │ MCU - 2023-11 - Approved│ │ │
│  │  Data Quality: 85% │  │  │ ...                     │ │ │
│  │                    │  │  └─────────────────────────┘ │ │
│  │  SUBDIVISION:      │  └──────────────────────────────┘ │
│  │  Eligible: ✓       │                                   │
│  │  Pathway: Dual Occ │  ┌──────────────────────────────┐ │
│  │  Max Lots: 2       │  │  NEARBY DAs (500m)           │ │
│  │                    │  │  [List of recent DAs nearby]  │ │
│  └──────────────────┘  └──────────────────────────────┘ │
│                                                          │
│  ┌──────────────────────────────────────────────────────┐│
│  │  RAW DATA  (collapsible)                             ││
│  │  { full JSON response from enrichment pipeline }     ││
│  └──────────────────────────────────────────────────────┘│
│                                                          │
│  ┌──────────────────────────────────────────────────────┐│
│  │  INGESTION STATUS                                    ││
│  │  Logan: 10,234 records (last run: 2h ago) ✓          ││
│  │  PlanningAlerts: 5,102 records (last run: 1h ago) ✓  ││
│  │  SCC: 3,456 records (last run: 6h ago) ✓             ││
│  └──────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────┘
```

**Auth**: Simple password gate. Check `ENGINE_ADMIN_SECRET` via a login form that stores the secret in a cookie/localStorage. No Supabase Auth needed for this — it's an internal tool.

**Key features**:
- Search by address (using existing geocode API) or lot/plan
- One-click enrichment ("Enrich this property" button)
- See all matched DA records
- See nearby DAs on map
- See raw data (expandable JSON)
- Ingestion dashboard (last run times, record counts, errors)
- "Trigger Ingestion" buttons for each source

### Mission 02 Complete When:

- [ ] Property enrichment pipeline working end-to-end
- [ ] Bulk enrichment working with job tracking
- [ ] Property lookup API returns full intelligence readout
- [ ] `/engine` page loads with password gate
- [ ] Can search any SEQ address and see enriched results
- [ ] DA history for the property displayed
- [ ] Nearby DAs displayed
- [ ] Map shows parcel boundary
- [ ] Raw data inspection panel works
- [ ] Ingestion status dashboard shows all sources
- [ ] "Trigger Ingestion" buttons work from the UI
- [ ] Robbie can use the console to test any address

---

## Mission 03: DA Probability Scoring + Comparable DA Search

**Goal**: Build the DA probability scoring engine that predicts approval likelihood for any property. This is the core intelligence product.

**Duration**: 1.5 weeks

### 3.1 Comparable DA Finder

Build `GET /api/engine/comparable-das?lot_plan=X&scenario=subdivision_2_lot`:

1. Load the target property's attributes (zone, LGA, area, overlays)
2. Query `ci_da_applications` for DAs with similar characteristics:
   - Same LGA
   - Same or similar zone
   - Similar lot area (±30%)
   - Same application type (ROL for subdivision, MCU for dual occ)
   - Decided (has outcome)
3. Rank by similarity (weighted: zone match > area closeness > recency)
4. Return top 20 comparable DAs with outcomes, conditions, timelines

### 3.2 Statistical Model

Build a scoring function that calculates base approval probability:

```
For a given property + scenario:
1. Get all comparable DAs (from 3.1)
2. Calculate approval_rate = approved / total
3. Calculate avg_timeline = mean(days_to_decision) for approved
4. Calculate avg_conditions_count = mean(conditions.length) for approved
5. Apply modifiers:
   - Flood overlay: -10% probability, +30 days timeline
   - Heritage overlay: -40% probability
   - Bushfire overlay: -5% probability, +20 days
   - Character overlay: -15% probability
   - Slope > 15%: -10% probability
   - Battle-axe lot: -5% probability
   - Exceeds AO lot size by >50%: +10% probability
   - Code assessable (not impact): +15% probability
6. Clamp probability to 0.05 - 0.98
7. Set confidence based on comparable count:
   - <5 comparables: "low"
   - 5-20 comparables: "medium"
   - >20 comparables: "high"
```

### 3.3 Claude Reasoning Layer

For properties where the statistical model has low confidence, or where there are complex overlay interactions, call Claude API to reason about the property:

```
System prompt: You are a Queensland town planning expert...
User prompt: Assess the DA approval probability for this property:
  - Lot: 243RP187165, 780m², Low Density Residential, SCC
  - Overlays: [none]
  - Proposed: 2-lot subdivision via dual occupancy pathway
  - Comparable DAs: [list of 5 nearest with outcomes]
  - Planning rule: min parent lot 600m², min result lot 300m²

Provide:
  1. Approval probability (0-100%)
  2. Key risk factors
  3. Likely conditions
  4. Recommended pathway
  5. Brief reasoning (2-3 sentences)
```

### 3.4 Prediction API

Build `POST /api/engine/predict-da`:

```json
// Request
{
  "lot_plan": "243RP187165",
  "scenario": "subdivision_2_lot"  // or "dual_occ", "multi_unit_4", etc.
}

// Response
{
  "approval_probability": 0.87,
  "confidence": "high",
  "pathway": "dual_occupancy_mcu_subsequent_rol",
  "estimated_timeline_months": 4,
  "estimated_infrastructure_charges": 28500,
  "risk_factors": [
    { "factor": "Standard lot size shortfall", "impact": "low", "detail": "20m² under standard ROL minimum but dual occ pathway available" }
  ],
  "likely_conditions": [
    "Stormwater management plan",
    "Landscaping plan within 6 months of practical completion"
  ],
  "comparable_das": [
    { "address": "123 Example St, Kuluin", "lots": 2, "decision": "approved", "date": "2024-08", "days": 45 }
  ],
  "reasoning": "This 780m² lot exceeds the 600m² dual occupancy minimum...",
  "model_version": "v1.0",
  "computed_at": "2026-02-20T10:00:00Z"
}
```

### 3.5 Cache Layer

Store predictions in `ci_da_predictions` with a `valid_until` timestamp (30 days). Subsequent requests for the same property + scenario return cached results unless expired.

### 3.6 Console Integration

Add DA probability score to the `/engine` console:
- Show the score prominently on the property card
- Show comparable DAs in a dedicated panel
- Show risk factors and likely conditions
- "Recalculate" button to force fresh prediction
- Toggle between scenarios (subdivision 2-lot, 3-lot, dual occ, etc.)

### 3.7 Validation

Create a validation dataset:
- Take 100 decided DAs from our database (50 approved, 50 refused)
- Hide their outcomes from the model
- Run predictions
- Compare predictions to actual outcomes
- Calculate accuracy, precision, recall
- Target: >75% accuracy

### Mission 03 Complete When:

- [ ] Comparable DA finder returns relevant matches
- [ ] Statistical model produces probability scores
- [ ] Claude reasoning layer handles edge cases
- [ ] Prediction API returns full response structure
- [ ] Predictions cached in ci_da_predictions
- [ ] `/engine` console shows DA probability score
- [ ] `/engine` shows comparable DAs panel
- [ ] `/engine` shows risk factors and conditions
- [ ] Validation set tested: accuracy >75%
- [ ] 119 Tallow Wood Dr correctly shows high approval probability

---

## Mission 04: Public Website Integration (Free Tier)

**Goal**: Surface the DA intelligence on the existing public-facing Site Analyser and Subdivision Analyser. Free users get a taste; the full intelligence is gated.

**Duration**: 1 week

### 4.1 Subdivision Analyser Integration

On `SubdivisionResult.tsx`, add below the existing eligibility display:

- **DA Approval Confidence**: Traffic light indicator (green/amber/red) with label "High/Medium/Low likelihood of approval"
- **Comparable Outcomes**: "X similar properties in your area were approved for subdivision" (with link to upgrade for details)
- **Key Risk**: Top 1 risk factor shown free, rest gated

This data comes from the prediction API (Mission 03).

### 4.2 Site Analyser Integration

On `SiteAnalyser.tsx`, add a new panel "Development Intelligence":

- DA approval indicator (traffic light)
- "Based on X comparable applications in [LGA]"
- Estimated timeline range
- CTA: "Get full Intelligence Report with detailed DA analysis, comparable outcomes, and risk assessment"

### 4.3 Free vs Paid Boundary

**Free** (shown on website):
- DA approval indicator: Low / Medium / High (no number)
- Number of comparable DAs found
- Top 1 risk factor
- Estimated timeline range (e.g. "3-6 months")

**Paid** (in reports / API):
- Exact probability score (0-100%)
- Full list of comparable DAs with addresses, outcomes, conditions
- All risk factors with mitigation strategies
- Detailed conditions analysis
- Infrastructure charges estimate
- Claude reasoning narrative
- PDF report

### 4.4 CTA Components

Build a reusable `<IntelligenceUpsell>` component that appears after the free preview:

```
┌──────────────────────────────────────────────────────────┐
│  🧠 Want the full intelligence picture?                  │
│                                                          │
│  Your free analysis shows this property has HIGH          │
│  development potential. Our full Intelligence Report      │
│  includes:                                               │
│                                                          │
│  ✓ DA approval probability score (87%)                   │
│  ✓ 12 comparable DA outcomes with conditions             │
│  ✓ Infrastructure charges estimate ($28,500)             │
│  ✓ Risk register with mitigations                        │
│  ✓ Recommended development pathway                       │
│  ✓ Professional PDF report                               │
│                                                          │
│  [Get Intelligence Report — $149]    [Learn more]        │
└──────────────────────────────────────────────────────────┘
```

### Mission 04 Complete When:

- [ ] Subdivision Analyser shows DA approval indicator
- [ ] Subdivision Analyser shows comparable DA count
- [ ] Subdivision Analyser shows top risk factor
- [ ] Site Analyser shows Development Intelligence panel
- [ ] Free/paid boundary clearly defined in UI
- [ ] `<IntelligenceUpsell>` component built and integrated
- [ ] CTA links to report purchase flow (wired in Mission 05)
- [ ] Mobile responsive
- [ ] Build passes, deployed to production

---

## Mission 05: Paid Reports + Stripe Checkout

**Goal**: Generate and sell PDF intelligence reports. This is the first revenue stream.

**Duration**: 1.5 weeks

### 5.1 Report Generator

Build `POST /api/engine/generate-report`:

1. Accepts: `{ lot_plan, report_type, email }`
2. Runs full enrichment pipeline (Mission 02)
3. Runs DA prediction (Mission 03)
4. Fetches market data (comparable sales, rental yields)
5. Generates a structured report object
6. Renders to PDF (using React-PDF or Puppeteer)
7. Uploads PDF to Supabase Storage
8. Creates `ci_reports` record
9. Sends email with download link
10. Returns report ID + download URL

### 5.2 Report Tiers

| Tier | Price | Contents | PDF Pages |
|------|-------|----------|-----------|
| **Site Snapshot** | $49 | Property overview, zone/overlays, DA probability score, 3 comparable DAs, basic feasibility, key constraints | 4-6 pages |
| **Intelligence Report** | $149 | Everything Snapshot + full comparable DA analysis (10+), all risk factors with mitigations, detailed conditions analysis, infrastructure charges, development pathway recommendation, financial feasibility | 10-15 pages |
| **Professional Report** | $399 | Everything Intelligence + detailed planning scheme analysis, performance outcomes assessment, services/infrastructure assessment, full risk register, recommended consultants, CAD-ready site data appendix | 20-30 pages |

### 5.3 Report PDF Design

Professional branded PDF with:
- Casa Intelligence header/footer with logo
- Property hero section (address, aerial, key stats)
- Executive summary (1 paragraph)
- Section-by-section analysis with charts/tables
- DA probability gauge graphic
- Comparable DA table
- Risk register table
- Financial feasibility table
- Disclaimers and methodology notes
- Call to action for consultation

### 5.4 Stripe Checkout Integration

Extend existing Stripe integration (`src/lib/stripe.ts`, `/api/create-checkout`):

1. User clicks "Get Intelligence Report — $149" on the website
2. Collect email address
3. Create Stripe Checkout session with:
   - Line item for report tier
   - Metadata: lot_plan, report_type, email
   - Success URL: `/engine/report/{report_id}`
   - Cancel URL: back to analyser
4. On payment success (webhook), trigger report generation
5. Email download link to user
6. Track in `ci_reports` table

### 5.5 Report Download Page

Build `/engine/report/[id]` page:
- Shows report status (generating / completed)
- Download button when ready
- "Your report is being generated, we'll email you when it's ready" message
- No auth required — the URL is the auth (unique report ID)

### 5.6 Report Email

Send via Resend (already installed):
- Subject: "Your Casa Intelligence Report is ready"
- Body: Property address, report type, download link, expiry (30 days)
- Professional branded template

### Mission 05 Complete When:

- [ ] Report generator produces PDF for all 3 tiers
- [ ] PDFs are professionally branded and well-formatted
- [ ] Stripe checkout flow works end-to-end
- [ ] Payment webhook triggers report generation
- [ ] Report download page shows status + download button
- [ ] Email sent with download link on completion
- [ ] `ci_reports` tracks all reports
- [ ] Report generation <60 seconds
- [ ] A real report for 119 Tallow Wood Dr looks accurate and professional
- [ ] Revenue is being collected

---

## Mission 06: REST API Platform + Auth + Metering

**Goal**: Expose the intelligence engine as a public REST API that developers, agents, and platforms can integrate with. API keys, rate limiting, usage metering, billing.

**Duration**: 1.5 weeks

### 6.1 API Key Management

Build admin endpoints:
- `POST /api/engine/admin/api-keys` — Create new API key (returns key once, stores hash)
- `GET /api/engine/admin/api-keys` — List all keys with usage stats
- `DELETE /api/engine/admin/api-keys/[id]` — Revoke a key

API key format: `ci_live_` + 32 random hex chars. Store bcrypt hash in `ci_api_keys`.

### 6.2 API Gateway Middleware

Build middleware for all `/api/v1/*` routes:
1. Extract API key from `Authorization: Bearer <key>` header
2. Look up key hash in `ci_api_keys`
3. Check tier limits (monthly request count)
4. Log request to `ci_api_usage`
5. If over limit: return 429 Too Many Requests
6. If invalid key: return 401 Unauthorized
7. Pass request to handler

### 6.3 Public API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/property` | GET | Full property intelligence by address or lot_plan |
| `/api/v1/property/da-score` | GET | DA probability score only |
| `/api/v1/property/feasibility` | GET | Subdivision feasibility only |
| `/api/v1/property/report` | POST | Generate and return a report |
| `/api/v1/search/opportunities` | GET | Prospecting search (filters) |
| `/api/v1/market/suburb` | GET | Suburb market stats |
| `/api/v1/market/lga` | GET | LGA-level analytics |
| `/api/v1/batch/properties` | POST | Bulk property analysis (up to 100) |

### 6.4 API Documentation

Build a Swagger/OpenAPI spec and serve it at `/api/v1/docs`:
- Interactive documentation
- Try-it-out functionality
- Code examples in curl, Python, JavaScript, Ruby
- Authentication guide
- Rate limiting info
- Response schemas

### 6.5 Usage Dashboard (Admin)

Add to `/engine` console:
- API keys list with creation date, tier, usage count
- Usage chart (requests per day/week/month)
- Top endpoints by usage
- Error rate monitoring

### 6.6 API Pricing Tiers

| Tier | Requests/mo | Rate Limit | Price/mo |
|------|-------------|------------|----------|
| Starter | 1,000 | 10/min | $199 |
| Professional | 10,000 | 60/min | $599 |
| Business | 50,000 | 300/min | $1,499 |
| Enterprise | Unlimited | Custom | $2,999+ |

Billing via Stripe subscriptions with metered add-ons for overages.

### Mission 06 Complete When:

- [ ] API key creation/revocation working
- [ ] API gateway middleware validates keys and enforces limits
- [ ] All 8 public endpoints working and returning correct data
- [ ] Request logging in ci_api_usage
- [ ] Rate limiting enforced per tier
- [ ] Swagger/OpenAPI docs served at /api/v1/docs
- [ ] Usage dashboard in /engine console
- [ ] A test API key can be used to query properties programmatically
- [ ] Batch endpoint handles 100 properties efficiently

---

## Mission 07: Prospecting Engine (Agent/Developer Tool)

**Goal**: Build a map-based search tool that finds development opportunities across SEQ. This is the killer tool for real estate agents and developers.

**Duration**: 1.5 weeks

### 7.1 Spatial Search API

Build `GET /api/v1/search/opportunities`:

**Query parameters**:
- `lga` — Filter by LGA
- `zone` — Filter by zone name
- `min_area` / `max_area` — Lot area range
- `min_da_score` — Minimum DA approval probability
- `min_uplift` — Minimum estimated uplift
- `max_lots` — Minimum possible lots from subdivision
- `exclude_overlays` — Comma-separated overlays to exclude (e.g. "heritage,wetlands")
- `sort` — Sort by: `da_score`, `uplift`, `potential`, `area`
- `bbox` — Bounding box for map view (lat1,lng1,lat2,lng2)
- `limit` / `offset` — Pagination

Returns GeoJSON FeatureCollection for map display + ranked list.

### 7.2 Pre-enrichment

For the Prospecting Engine to work, we need enriched properties. Build a bulk enrichment pipeline that:
1. Loads all lots in an LGA from DCDB
2. Enriches each with zoning + overlays
3. Runs subdivision eligibility check
4. Stores in `ci_properties`
5. Start with SCC (50K lots), then expand to Logan, Moreton Bay, Gold Coast, Brisbane

### 7.3 Prospecting UI

Build `/prospecting` page (password-protected initially, then subscription-gated):

```
┌──────────────────────────────────────────────────────────┐
│  FILTERS                          │  MAP VIEW            │
│  ┌─────────────────────────────┐  │  ┌────────────────┐ │
│  │ LGA: [Sunshine Coast   ▾]  │  │  │                │ │
│  │ Zone: [Low Density Res ▾]  │  │  │   MapLibre     │ │
│  │ Area: [600] - [1200] m²    │  │  │   with dots    │ │
│  │ DA Score: [70]% +          │  │  │   for each     │ │
│  │ Min Uplift: [$50K]         │  │  │   opportunity  │ │
│  │ Exclude: ☑ Heritage        │  │  │                │ │
│  │          ☑ Wetlands         │  │  │   Click dot    │ │
│  │ Sort: [DA Score ▾]         │  │  │   → property   │ │
│  │                             │  │  │   card popup   │ │
│  │ [Search] [Reset]           │  │  │                │ │
│  └─────────────────────────────┘  │  └────────────────┘ │
│                                    │                      │
│  RESULTS (342 properties)          │                      │
│  ┌─────────────────────────────┐  │                      │
│  │ 1. 45 Palm St, Maroochydore│  │                      │
│  │    820m² | LDR | DA: 91%   │  │                      │
│  │    Uplift: $120K-$250K     │  │                      │
│  │    [View Details]           │  │                      │
│  ├─────────────────────────────┤  │                      │
│  │ 2. 12 Oak Ave, Buderim     │  │                      │
│  │    ...                      │  │                      │
│  └─────────────────────────────┘  │                      │
└──────────────────────────────────────────────────────────┘
```

### 7.4 Property Detail Modal

Clicking a property in the list or on the map opens a modal with:
- Full property card (same as `/engine` console)
- DA probability score
- Comparable DAs
- Subdivision layout preview (reuse SubdivisionMap)
- "Generate Report" button
- "Save to Shortlist" button (localStorage for now)

### 7.5 Subscription Gating

Prospecting Engine requires a subscription:
- Free: Search but only see top 3 results (blurred/locked rest)
- Paid ($299/mo): Full access, unlimited searches, save shortlists
- Stripe subscription management

### Mission 07 Complete When:

- [ ] Spatial search API returns filtered, sorted, paginated results
- [ ] GeoJSON response works with MapLibre
- [ ] SCC fully enriched (50K+ lots) with subdivision eligibility
- [ ] At least 2 more LGAs enriched (Logan, Gold Coast or Moreton Bay)
- [ ] Prospecting UI loads with filters + map + results list
- [ ] Property detail modal shows full intelligence
- [ ] Subscription gating works (free preview + paid full access)
- [ ] Stripe subscription checkout for Prospecting tier
- [ ] Mobile responsive
- [ ] <3 second search response time

---

## Mission 08: Market Intelligence Dashboard

**Goal**: Build an analytics dashboard showing DA activity trends, market analytics, and growth intelligence across SEQ.

**Duration**: 1.5 weeks

### 8.1 Analytics Materialized Views

Create Supabase materialized views:

- `ci_da_activity_by_lga_month` — DA lodgements, approvals, refusals by LGA by month
- `ci_da_timelines_by_lga` — Average decision times by LGA, trending
- `ci_approval_rates_by_zone` — Approval rates by zone type across all LGAs
- `ci_subdivision_activity` — ROL applications by LGA, lot counts, trending
- `ci_suburb_market_summary` — Median sale price, rental yield, sales volume, growth rate by suburb

Refresh via pg_cron (daily).

### 8.2 Dashboard UI

Build `/dashboard` page (subscription-gated):

**Sections**:
1. **SEQ Overview** — Total DAs this month, approval rate, avg timeline, heat map
2. **LGA Comparison** — Table/chart comparing all SEQ councils on key metrics
3. **DA Activity Trends** — Time series chart of DA lodgements by type
4. **Approval Rate Trends** — Which councils are getting stricter/looser
5. **Subdivision Hotspots** — Map showing where subdivision is most active
6. **Market Trends** — Median prices, rental yields, growth by suburb
7. **Infrastructure Impact** — Overlay infrastructure spending with DA activity

### 8.3 Chart Library

Use a lightweight chart library (Recharts or Chart.js via react-chartjs-2) for:
- Line charts (trends over time)
- Bar charts (LGA comparisons)
- Heat maps (spatial activity density)
- Gauge charts (scores)

### 8.4 Subscription Tier

Market Intelligence Dashboard: $999-$2,999/mo (premium tier).
Bundle with Prospecting Engine for developer/investor customers.

### Mission 08 Complete When:

- [ ] Materialized views created and refreshing daily
- [ ] Dashboard loads with all 7 sections
- [ ] Charts render correctly with real data
- [ ] LGA comparison is accurate against known DA stats
- [ ] Heat map shows spatial distribution of DA activity
- [ ] Market trends show real suburb-level data
- [ ] Subscription gating enforced
- [ ] Mobile responsive

---

## Mission 09: Go-to-Market Systems

**Goal**: Build all the systems needed to acquire customers, nurture leads, track conversions, and scale revenue. Without this mission, we have a product but no way to sell it.

**Duration**: 2 weeks

### 9.1 Automated SEO Content Engine

Build a system that automatically generates suburb-level landing pages:

- `/suburbs/[suburb-slug]` — e.g. `/suburbs/maroochydore`
- Each page auto-generated from engine data:
  - Subdivision eligibility overview for the suburb
  - DA activity summary
  - Median prices and rental yields
  - Development potential score for the area
  - CTA to run the analyser for a specific address
- 500+ suburb pages across SEQ → massive organic traffic

### 9.2 Lead Capture & Nurture

Build lead capture flows:
1. **Email capture** on every free analysis (optional, incentivised: "Email your results")
2. **Lead scoring** based on:
   - Searched a high-value property (>$200K uplift potential)
   - Searched multiple properties
   - Visited pricing page
   - Downloaded free report preview
3. **Automated email sequences** (via Resend):
   - Welcome: "Your property analysis results + what else we can tell you"
   - Day 3: "3 things you might not know about [suburb] development"
   - Day 7: "How one owner turned $X into $Y with subdivision"
   - Day 14: "Limited time: 20% off your first Intelligence Report"

### 9.3 CRM / Contact Management

Build into `/engine` admin console:
- Lead list (name, email, properties searched, lead score)
- Lead detail (full search history, interactions)
- Manual note adding
- Tag/segment leads
- Export to CSV

### 9.4 Analytics & Attribution

Implement tracking:
- Google Analytics 4 (or Plausible for privacy)
- Conversion tracking: Free analysis → Email capture → Report purchase → API signup
- UTM parameter tracking for campaigns
- Revenue attribution by source

### 9.5 Agent/Developer Outreach Kit

Build sales collateral:
- Prospecting Engine demo video / screenshots
- API documentation landing page
- Case study template
- ROI calculator ("How much time you'll save")
- Partnership proposal template (for real estate franchises)

### 9.6 Content Marketing Pipeline

- Blog post generator (Claude-powered from engine data):
  - "Top 10 subdivision opportunities in [suburb] right now"
  - "Which Sunshine Coast suburbs have the highest DA approval rates?"
  - "Development activity surges in [LGA] — what it means for investors"
- Auto-publish to blog (existing `/articles` infrastructure)

### Mission 09 Complete When:

- [ ] 50+ suburb landing pages generated and live
- [ ] Suburb pages ranking in search for "[suburb] subdivision" queries
- [ ] Email capture working on free analysis flow
- [ ] Lead scoring system operational
- [ ] 4-email automated sequence configured
- [ ] CRM in admin console with lead list and detail views
- [ ] Analytics tracking installed and reporting
- [ ] Conversion funnel visible (search → capture → purchase)
- [ ] At least 1 outreach template/kit ready
- [ ] Content marketing pipeline producing articles

---

## Mission 10: Scale, Expand, Enterprise

**Goal**: Expand beyond SEQ, pursue enterprise deals, and build the infrastructure for $3-5M ARR.

**Duration**: Ongoing

### 10.1 Geographic Expansion

Extend the engine to cover:
1. **Regional QLD**: Cairns, Townsville, Toowoomba, Mackay, Rockhampton
2. **Interstate**: Northern Rivers NSW, Northern NSW, Greater Sydney
3. **National**: Victoria, South Australia, Western Australia

For each new region:
- Map council ArcGIS endpoints
- Encode planning scheme rules
- Ingest DA data
- Validate against local knowledge

### 10.2 Council Intelligence Package

Build white-label dashboard for councils:
- Their own DA pipeline analytics
- Benchmarking against other SEQ councils
- Infrastructure charges revenue forecasting
- Growth corridor identification
- Community impact modelling

**Sales approach**: Approach council planning departments directly. Price: $25K-$100K/yr.

### 10.3 Enterprise API Partnerships

Target:
- Real estate franchises (Ray White, LJ Hooker, etc.) — embed intelligence in their agent tools
- Mortgage brokers/banks — property feasibility as part of lending assessment
- Insurance companies — risk assessment data
- Proptech platforms — embed our API in their products

### 10.4 Data Moat Deepening

- Continuously ingest DA outcomes (every DA that gets decided makes the model better)
- Track prediction accuracy and auto-calibrate
- Add user feedback loops (report accuracy ratings)
- Build proprietary datasets that don't exist elsewhere:
  - Infrastructure charges by LGA by year (tracking increases)
  - Council assessment team capacity (pending DAs / assessors)
  - Seasonal DA patterns
  - Planning scheme amendment tracking

### 10.5 Advanced Products

- **Investment Portfolio Analyser**: For investors with multiple properties — portfolio-level intelligence
- **Due Diligence Automator**: One-click comprehensive due diligence report for property purchases
- **Planning Alert Service**: Real-time notifications when a property's planning context changes (scheme amendment, new PDA, overlay change)
- **AI Town Planner**: Chat interface where users can ask planning questions, powered by the engine's data

### Mission 10 Complete When:

- [ ] Engine covers at least 3 regions beyond SEQ
- [ ] 1+ council licensing deal signed
- [ ] 1+ enterprise API partnership live
- [ ] Prediction accuracy >85% (measured on validation set)
- [ ] $100K+ MRR achieved

---

## System Requirements Summary

For each mission to succeed, these systems must be working:

| System | Built In | Purpose |
|--------|----------|---------|
| **Supabase PostgreSQL + PostGIS** | Mission 01 | Core database with spatial queries |
| **DA Ingestion Pipeline** | Mission 01 | Automated data collection from government APIs |
| **Property Enrichment Pipeline** | Mission 02 | Unifies all data sources into single property record |
| **Internal Admin Console** | Mission 02 | Robbie's testing and management interface |
| **DA Probability Engine** | Mission 03 | Core prediction model (rules + stats + AI) |
| **Comparable DA Search** | Mission 03 | k-nearest DA matching in feature space |
| **Free Website Intelligence** | Mission 04 | Public-facing lead generation tools |
| **Report Generator (PDF)** | Mission 05 | Paid report production pipeline |
| **Stripe Payments** | Mission 05 | Report purchases + subscriptions |
| **Report Delivery (Email)** | Mission 05 | Email with download link |
| **REST API + Auth** | Mission 06 | Public API with key management |
| **API Metering + Billing** | Mission 06 | Usage tracking and rate limiting |
| **API Documentation** | Mission 06 | Swagger/OpenAPI interactive docs |
| **Spatial Search (PostGIS)** | Mission 07 | Find opportunities by geo + attributes |
| **Prospecting Map UI** | Mission 07 | Agent/developer search tool |
| **Subscription Management** | Mission 07 | Stripe subscriptions for recurring products |
| **Analytics Views** | Mission 08 | Materialized views for market intelligence |
| **Dashboard Charts** | Mission 08 | Time series, comparisons, heat maps |
| **SEO Landing Pages** | Mission 09 | Auto-generated suburb pages |
| **Lead Capture + Scoring** | Mission 09 | Email capture, scoring, segmentation |
| **Email Automation** | Mission 09 | Nurture sequences via Resend |
| **CRM** | Mission 09 | Lead management in admin console |
| **Analytics/Attribution** | Mission 09 | Conversion tracking, revenue attribution |
| **Content Pipeline** | Mission 09 | AI-generated blog posts from engine data |

---

## Revenue Milestones

| Milestone | Target MRR | Expected By |
|-----------|-----------|-------------|
| First paid report sold | $149 | End of Mission 05 |
| 10 reports/month | $1,500 | Mission 05 + 2 weeks |
| First API subscriber | $199 | End of Mission 06 |
| Prospecting launch (10 subs) | $3,000 | Mission 07 + 2 weeks |
| 50 reports + 5 API subs | $10,000 | End of Mission 08 |
| SEO traffic driving 100 reports/mo | $20,000 | End of Mission 09 |
| First enterprise deal | $2,000+ | Mission 10 |
| $50K MRR | $50,000 | Mission 10 + 3 months |
| $100K MRR | $100,000 | Mission 10 + 6 months |

---

*These missions are designed to be executed sequentially, each building on the last. Every mission ends with working, usable functionality — never dead code, never stubs, never "we'll finish this later." Follow them in order and the engine will be generating revenue by Mission 05.*
