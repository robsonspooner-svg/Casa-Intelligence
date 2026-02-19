'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Loader2, AlertCircle, Scissors, Building2 } from 'lucide-react';
import dynamic from 'next/dynamic';
import { checkSubdivisionEligibility, type SubdivisionEligibility } from '@/lib/subdivision-rules';
import { calculateSubdivisionUplift, type ValuationData, type SubdivisionUpliftResult } from '@/lib/property-value-estimates';
import SubdivisionResult from './SubdivisionResult';

const SubdivisionMap = dynamic(() => import('./SubdivisionMap'), {
  ssr: false,
  loading: () => (
    <div className="bg-surface rounded-xl border border-border/50 h-[500px] flex items-center justify-center">
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

type Phase = 'idle' | 'loading' | 'loaded' | 'error';

interface SubdivisionAnalyserProps {
  selectedCandidate?: Candidate | null;
}

export default function SubdivisionAnalyser({ selectedCandidate }: SubdivisionAnalyserProps) {
  const [phase, setPhase] = useState<Phase>('idle');
  const [loadingMessage, setLoadingMessage] = useState('');
  const [error, setError] = useState<string | null>(null);

  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const [lat, setLat] = useState<number>(0);
  const [lng, setLng] = useState<number>(0);
  const [parcel, setParcel] = useState<ParcelData | null>(null);
  const [zone, setZone] = useState<ZoneData | null>(null);
  const [overlays, setOverlays] = useState<OverlayHit[]>([]);
  const [lga, setLga] = useState<string | null>(null);
  const [eligibility, setEligibility] = useState<SubdivisionEligibility | null>(null);
  const [subdivided, setSubdivided] = useState(false);
  const [lotCount, setLotCount] = useState(2);
  const [uplift, setUplift] = useState<SubdivisionUpliftResult | null>(null);
  const [valuation, setValuation] = useState<ValuationData | null>(null);

  const handleAnalyse = useCallback(async (candidate: Candidate) => {
    setPhase('loading');
    setError(null);
    setSelectedAddress(candidate.address);
    setLat(candidate.lat);
    setLng(candidate.lng);
    setSubdivided(false);
    setUplift(null);
    setValuation(null);

    try {
      setLoadingMessage('Fetching parcel and planning data...');

      const safeFetch = async (url: string) => {
        try {
          const res = await fetch(url, { signal: AbortSignal.timeout(12000) });
          if (!res.ok) return null;
          return await res.json();
        } catch {
          return null;
        }
      };

      // Fetch parcel, zoning, overlays, AND valuation in parallel
      const [parcelData, zoningData, overlaysSccData, overlaysQldData, valuationData] = await Promise.all([
        safeFetch(`/api/parcel?lat=${candidate.lat}&lng=${candidate.lng}`),
        safeFetch(`/api/zoning-qld?lat=${candidate.lat}&lng=${candidate.lng}`),
        safeFetch(`/api/overlays?lat=${candidate.lat}&lng=${candidate.lng}`),
        safeFetch(`/api/overlays-qld?lat=${candidate.lat}&lng=${candidate.lng}`),
        safeFetch(`/api/valuation?address=${encodeURIComponent(candidate.address)}&lat=${candidate.lat}&lng=${candidate.lng}`),
      ]);

      setLoadingMessage('Checking subdivision eligibility...');

      // Store valuation data if available
      if (valuationData?.valuation) {
        setValuation(valuationData.valuation);
      }

      const parcelInfo = parcelData?.parcel || null;
      setParcel(parcelInfo);
      setZone(zoningData?.zone || null);
      setLga(zoningData?.lga || parcelInfo?.lga || null);

      // Merge overlays from both SCC and QLD-wide sources, dedup by bucket
      const sccOverlays: OverlayHit[] = overlaysSccData?.overlays || [];
      const qldOverlays: OverlayHit[] = overlaysQldData?.overlays || [];
      const allOverlays = [...sccOverlays, ...qldOverlays];
      const seenBuckets = new Set<string>();
      const dedupedOverlays = allOverlays.filter((o) => {
        if (seenBuckets.has(o.bucket)) return false;
        seenBuckets.add(o.bucket);
        return true;
      });
      setOverlays(dedupedOverlays);

      // Check eligibility
      const zoneName = zoningData?.zone?.name || 'Unknown';
      const lotArea = parcelInfo?.areaSqm || 0;
      const lgaName = zoningData?.lga || parcelInfo?.lga || null;
      const overlayBuckets = dedupedOverlays.map((o) => o.bucket);

      const result = checkSubdivisionEligibility(zoneName, lotArea, lgaName, overlayBuckets);
      setEligibility(result);

      // Log search to analytics database (fire-and-forget)
      const val = valuationData?.valuation || null;
      fetch('/api/log-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address: candidate.address,
          lat: candidate.lat,
          lng: candidate.lng,
          suburb: parcelInfo?.locality || candidate.suburb || null,
          lga: lgaName,
          zone_name: zoneName,
          zone_code: zoningData?.zone?.code || null,
          lot_area_sqm: lotArea || null,
          lot_plan: parcelInfo?.lotPlan || null,
          overlays: overlayBuckets,
          eligible: result.eligible,
          max_lots: result.maxLots,
          land_value: val?.landValue || null,
          market_value: val?.estimatedMarketValue || null,
          property_type: val?.propertyType || null,
          valuation_source: val ? 'valuation_api' : null,
          tab: 'subdivision',
        }),
      }).catch(() => {});

      setPhase('loaded');
    } catch (err) {
      console.error('Subdivision analysis error:', err);
      setError('Something went wrong while analysing this site. Please try again.');
      setPhase('error');
    }
  }, []);

  // When driven by parent tab, auto-trigger analysis
  const lastCandidateRef = useRef<string | null>(null);
  useEffect(() => {
    if (selectedCandidate && selectedCandidate.address !== lastCandidateRef.current) {
      lastCandidateRef.current = selectedCandidate.address;
      handleAnalyse(selectedCandidate);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCandidate]);

  const handleSubdivide = useCallback((lots?: number) => {
    if (!parcel?.areaSqm || !eligibility) return;
    const suburb = parcel.locality || null;
    const lgaName = lga || parcel.lga || null;
    const useLots = lots || lotCount;
    setLotCount(useLots);
    const result = calculateSubdivisionUplift(suburb, lgaName, useLots, valuation);
    setUplift(result);
    setSubdivided(true);
  }, [parcel, eligibility, lga, lotCount, valuation]);

  const handleLotCountChange = useCallback((newCount: number) => {
    setLotCount(newCount);
    if (subdivided) {
      handleSubdivide(newCount);
    }
  }, [subdivided, handleSubdivide]);

  return (
    <div className="space-y-4">
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

      {/* Results */}
      {phase === 'loaded' && parcel && eligibility && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Map */}
          <SubdivisionMap
            lat={lat}
            lng={lng}
            parcelGeometry={parcel.geometry}
            overlays={overlays}
            zoneName={zone?.name || null}
            subdivided={subdivided}
            lotCount={lotCount}
          />

          {/* Result panel */}
          <div className="space-y-4">
            <SubdivisionResult
              address={selectedAddress || ''}
              eligibility={eligibility}
              zone={zone}
              overlays={overlays}
              parcel={parcel}
              lga={lga}
              subdivided={subdivided}
              uplift={uplift}
              onSubdivide={handleSubdivide}
              lotCount={lotCount}
              maxLots={eligibility.maxLots}
              onLotCountChange={handleLotCountChange}
            />
          </div>
        </div>
      )}

      {/* Idle */}
      {phase === 'idle' && (
        <div className="text-center py-12">
          <div className="w-16 h-16 rounded-2xl bg-casa-navy/5 flex items-center justify-center mx-auto mb-5">
            <Scissors className="w-8 h-8 text-casa-navy/40" />
          </div>
          <h3 className="font-serif text-xl text-text-primary mb-2">
            Is your property subdividable?
          </h3>
          <p className="text-sm text-text-secondary max-w-md mx-auto leading-relaxed">
            Enter your address above and we&apos;ll check the parcel size, zoning, and overlays
            to determine if your land meets the criteria for subdivision.
          </p>
        </div>
      )}
    </div>
  );
}
