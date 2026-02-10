'use client';

import { useCallback, useState } from 'react';
import { Loader2, MapPin, AlertCircle, AlertTriangle, Building2 } from 'lucide-react';
import dynamic from 'next/dynamic';

import AddressSearch from './AddressSearch';
import ParameterPanel, { type SiteParameters } from './ParameterPanel';
import KeyMetrics from './KeyMetrics';
import OverlayFlags from './OverlayFlags';
import FeasibilitySummary from './FeasibilitySummary';
import ZoningSummary from './ZoningSummary';
import CTAPrompt from './CTAPrompt';
import { inferProductType, calculateMaxDensity } from '@/lib/feasibility-calc';

const ParcelMap = dynamic(() => import('./ParcelMap'), {
  ssr: false,
  loading: () => (
    <div className="bg-surface rounded-xl border border-border/50 h-[400px] flex items-center justify-center">
      <Loader2 className="w-5 h-5 text-casa-navy animate-spin" />
    </div>
  ),
});

const MassingViewer = dynamic(() => import('./MassingViewer'), {
  ssr: false,
  loading: () => (
    <div className="bg-surface rounded-xl border border-border/50 h-[400px] flex items-center justify-center">
      <Loader2 className="w-5 h-5 text-casa-navy animate-spin" />
    </div>
  ),
});

interface Candidate {
  address: string;
  lat: number;
  lng: number;
  score: number;
  suburb: string;
}

interface ParcelData {
  lot: string;
  plan: string;
  lotPlan: string;
  areaSqm: number | null;
  tenure: string | null;
  lga: string | null;
  locality: string | null;
  geometry: GeoJSON.Geometry | null;
}

interface ZoneData {
  name: string;
  code: string | null;
  precinct: string | null;
  localPlan: string | null;
}

interface OverlayHit {
  layerId: number;
  layerName: string;
  bucket: string;
  attributes: Record<string, unknown>;
}

type AnalysisPhase = 'idle' | 'loading' | 'loaded' | 'error';

export default function SiteAnalyser() {
  const [phase, setPhase] = useState<AnalysisPhase>('idle');
  const [loadingMessage, setLoadingMessage] = useState('');
  const [error, setError] = useState<string | null>(null);

  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const [lat, setLat] = useState<number>(0);
  const [lng, setLng] = useState<number>(0);
  const [parcel, setParcel] = useState<ParcelData | null>(null);
  const [zone, setZone] = useState<ZoneData | null>(null);
  const [overlays, setOverlays] = useState<OverlayHit[]>([]);
  const [maxHeight, setMaxHeight] = useState<number | null>(null);
  const [slopePercent, setSlopePercent] = useState<number | null>(null);

  const [params, setParams] = useState<SiteParameters>({
    numberOfUnits: 6,
    storeys: 3,
    floorAreaPerUnit: 120,
    landCost: 800000,
    productType: 'low_rise_apartment',
    bedroomMix: 'mixed',
    roofType: 'flat',
    materialPreset: 'modern',
    salePriceOverride: null,
  });

  const handleAddressSelect = useCallback(async (candidate: Candidate) => {
    setPhase('loading');
    setError(null);
    setSelectedAddress(candidate.address);
    setLat(candidate.lat);
    setLng(candidate.lng);

    try {
      setLoadingMessage('Fetching parcel boundary and planning data...');

      const safeFetch = async (url: string) => {
        try {
          const res = await fetch(url, { signal: AbortSignal.timeout(12000) });
          if (!res.ok) return null;
          return await res.json();
        } catch {
          return null;
        }
      };

      const [parcelData, zoningData, overlaysData, slopeData] = await Promise.all([
        safeFetch(`/api/parcel?lat=${candidate.lat}&lng=${candidate.lng}`),
        safeFetch(`/api/zoning?lat=${candidate.lat}&lng=${candidate.lng}`),
        safeFetch(`/api/overlays?lat=${candidate.lat}&lng=${candidate.lng}`),
        safeFetch(`/api/slope?lat=${candidate.lat}&lng=${candidate.lng}`),
      ]);

      setLoadingMessage('Analysing planning controls...');

      setParcel(parcelData?.parcel || null);
      setZone(zoningData?.zone || null);
      setSlopePercent(slopeData?.slope?.averageSlopePercent ?? null);

      const overlayHits: OverlayHit[] = overlaysData?.overlays || [];
      setOverlays(overlayHits);

      const heightOverlay = overlayHits.find((o) => o.bucket === 'height');
      if (heightOverlay) {
        const ha = heightOverlay.attributes;
        const heightValue =
          (ha.HeightRestrictionMetres as number) ||
          (ha.MAX_HEIGHT as number) ||
          (ha.Height as number) ||
          (ha.height_restriction_metres as number) ||
          parseFloat(String(ha.LABEL || '0').replace(/[^0-9.]/g, '')) ||
          0;
        setMaxHeight(heightValue > 0 ? heightValue : null);
      } else {
        setMaxHeight(null);
      }

      setPhase('loaded');
    } catch (err) {
      console.error('Analysis error:', err);
      setError('Something went wrong while analysing this site. Please try again.');
      setPhase('error');
    }
  }, []);

  return (
    <div className="space-y-4">
      {/* Address search */}
      <div className="max-w-2xl mx-auto">
        <AddressSearch onSelect={handleAddressSelect} />
        {phase === 'idle' && (
          <p className="text-xs text-text-tertiary text-center mt-2">
            Search any address on the Sunshine Coast
          </p>
        )}
      </div>

      {/* Loading */}
      {phase === 'loading' && (
        <div className="flex flex-col items-center justify-center py-16">
          <Loader2 className="w-8 h-8 text-casa-navy animate-spin mb-4" />
          <p className="text-sm text-text-secondary">{loadingMessage}</p>
          <p className="text-xs text-text-tertiary mt-1">Querying government databases...</p>
        </div>
      )}

      {/* Error */}
      {phase === 'error' && error && (
        <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-4 max-w-2xl mx-auto">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-red-800">Analysis failed</p>
            <p className="text-xs text-red-600 mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Dashboard */}
      {phase === 'loaded' && (() => {
        const COVENANT_ESTATES: Record<string, { name: string; developer: string }> = {
          'BARINGA': { name: 'Aura', developer: 'Stockland' },
          'NIRIMBA': { name: 'Aura / Nirimba', developer: 'Stockland' },
          'PALMVIEW': { name: 'Palmview', developer: 'AVID Property Group' },
          'SIPPY DOWNS': { name: 'Harmony', developer: 'AVID Property Group' },
          'CALOUNDRA WEST': { name: 'Aura', developer: 'Stockland' },
          'BELLS CREEK': { name: 'Aura', developer: 'Stockland' },
          'AURA': { name: 'Aura', developer: 'Stockland' },
        };
        const locality = parcel?.locality?.toUpperCase()?.trim() || '';
        const covenantEstate = COVENANT_ESTATES[locality] || null;
        const suburb = parcel?.locality || null;
        const overlayBuckets = overlays.map((o) => o.bucket);
        const zoneName = zone?.name || null;

        // Compute density assessment for passing to MassingViewer
        const densityAssessment = parcel?.areaSqm
          ? calculateMaxDensity(
              parcel.areaSqm,
              params.productType,
              params.storeys,
              params.floorAreaPerUnit,
              zoneName,
            )
          : null;
        const maxRealisticUnits = densityAssessment?.maxRealisticUnits ?? null;

        return (
        <div className="space-y-3">
          {/* Address bar with info pills */}
          <div className="flex items-center gap-2.5 bg-surface rounded-xl border border-border/50 px-4 py-2.5">
            <MapPin className="w-4 h-4 text-casa-navy flex-shrink-0" />
            <p className="text-sm font-serif font-semibold text-text-primary truncate flex-1">{selectedAddress}</p>
            <div className="hidden sm:flex gap-2 flex-shrink-0">
              {parcel?.lotPlan && (
                <span className="text-[10px] text-text-tertiary bg-subtle px-2 py-0.5 rounded-full">{parcel.lotPlan}</span>
              )}
              {parcel?.areaSqm && (
                <span className="text-[10px] text-text-tertiary bg-subtle px-2 py-0.5 rounded-full">{parcel.areaSqm.toLocaleString()}m²</span>
              )}
              {zone?.name && (
                <span className="text-[10px] text-text-tertiary bg-subtle px-2 py-0.5 rounded-full">{zone.name}</span>
              )}
            </div>
          </div>

          {/* Covenant estate warning */}
          {covenantEstate && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-amber-800">
                  Covenant Estate &mdash; {covenantEstate.name} ({covenantEstate.developer})
                </p>
                <p className="text-[11px] text-amber-700 mt-0.5">
                  This parcel may be subject to estate covenants that restrict building design,
                  materials, colours, fencing, and landscaping beyond council planning controls.
                  Check the estate&apos;s design guidelines before proceeding.
                </p>
              </div>
            </div>
          )}

          {/* Sidebar + Main content */}
          <div className="flex flex-col lg:flex-row gap-3">
            {/* Sticky sidebar — viewport height, scrollable */}
            <div className="w-full lg:w-[280px] flex-shrink-0 bg-surface rounded-xl border border-border/50 p-4 flex flex-col lg:sticky lg:top-4 lg:max-h-[calc(100vh-2rem)] lg:overflow-y-auto">
              <ParameterPanel
                params={params}
                onChange={setParams}
                maxHeight={maxHeight}
                parcelAreaSqm={parcel?.areaSqm || null}
                zoneName={zoneName}
                suburb={suburb}
              />
              <div className="border-t border-border/30 pt-3 mt-auto">
                <KeyMetrics
                  params={params}
                  parcelAreaSqm={parcel?.areaSqm || null}
                  maxHeight={maxHeight}
                  slopePercent={slopePercent}
                  overlayBuckets={overlayBuckets}
                  suburb={suburb}
                  zoneName={zoneName}
                />
              </div>
            </div>

            {/* Main content — all sections flow naturally */}
            <div className="flex-1 min-w-0 space-y-3">
              {/* 3D Massing + 2D Map side by side */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:h-[460px]">
                <MassingViewer
                  params={params}
                  parcelGeometry={parcel?.geometry || null}
                  maxHeight={maxHeight}
                  maxRealisticUnits={maxRealisticUnits}
                />
                <ParcelMap
                  lat={lat}
                  lng={lng}
                  parcelGeometry={parcel?.geometry || null}
                />
              </div>

              {/* Zoning + Overlays side by side */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-surface rounded-xl border border-border/50 p-4">
                  <ZoningSummary
                    zoneName={zone?.name || null}
                    zoneCode={zone?.code || null}
                    precinct={zone?.precinct || null}
                    localPlan={zone?.localPlan || null}
                  />
                </div>
                <div className="bg-surface rounded-xl border border-border/50 p-4">
                  <OverlayFlags overlays={overlays} zoneName={zone?.name || null} />
                </div>
              </div>

              {/* Feasibility */}
              <div className="bg-surface rounded-xl border border-border/50 p-4">
                <FeasibilitySummary
                  params={params}
                  parcelAreaSqm={parcel?.areaSqm || null}
                  maxHeight={maxHeight}
                  slopePercent={slopePercent}
                  overlayBuckets={overlayBuckets}
                  suburb={suburb}
                  zoneName={zoneName}
                />
              </div>

              {/* CTA */}
              <CTAPrompt address={selectedAddress || undefined} />
            </div>
          </div>
        </div>
        );
      })()}

      {/* Idle */}
      {phase === 'idle' && (
        <div className="text-center py-12">
          <div className="w-16 h-16 rounded-2xl bg-casa-navy/5 flex items-center justify-center mx-auto mb-5">
            <Building2 className="w-8 h-8 text-casa-navy/40" />
          </div>
          <h3 className="font-serif text-xl text-text-primary mb-2">
            Enter an address to begin
          </h3>
          <p className="text-sm text-text-secondary max-w-md mx-auto leading-relaxed">
            We&apos;ll fetch the parcel boundary, zoning, overlays, and height limits from
            government databases, then generate a 3D massing study and preliminary feasibility
            assessment in seconds.
          </p>
        </div>
      )}
    </div>
  );
}
