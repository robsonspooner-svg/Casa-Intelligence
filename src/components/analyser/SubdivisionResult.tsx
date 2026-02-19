'use client';

import { useEffect, useRef, useState } from 'react';
import Brand from '@/components/brand/Brand';
import Link from 'next/link';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Scissors,
  ArrowRight,
  MapPin,
  Layers,
  Ruler,
  Droplets,
  Flame,
  Landmark,
  TreePine,
  Shield,
  Minus,
  Plus,
} from 'lucide-react';
import type { SubdivisionEligibility, OverlayImpact } from '@/lib/subdivision-rules';
import { formatCurrency } from '@/lib/feasibility-calc';
import ServiceCheckout from './ServiceCheckout';

interface OverlayHit {
  layerId: number;
  layerName: string;
  bucket: string;
  attributes: Record<string, unknown>;
}

interface ZoneData {
  name: string;
  code: string | null;
  precinct: string | null;
  localPlan: string | null;
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

interface SubdivisionResultProps {
  address: string;
  eligibility: SubdivisionEligibility;
  zone: ZoneData | null;
  overlays: OverlayHit[];
  parcel: ParcelData;
  lga: string | null;
  subdivided: boolean;
  uplift: { propertyValue: number; totalValueAfter: number; uplift: number; valueSource: string; perLotValue: number } | null;
  onSubdivide: () => void;
  lotCount: number;
  maxLots: number;
  onLotCountChange: (count: number) => void;
}

const OVERLAY_ICONS: Record<string, typeof Droplets> = {
  flood: Droplets,
  bushfire: Flame,
  heritage: Landmark,
  character: Landmark,
  biodiversity: TreePine,
  environment: TreePine,
  wetlands: Droplets,
  waterways: Droplets,
  coastal: Droplets,
  landslide: AlertTriangle,
  slope: AlertTriangle,
  infrastructure: Shield,
};

function AnimatedCounter({ value, prefix = '' }: { value: number; prefix?: string }) {
  const [displayed, setDisplayed] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const duration = 1200;
    const start = Date.now();
    const step = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayed(Math.round(value * eased));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [value]);

  return (
    <span ref={ref}>
      {prefix}{displayed.toLocaleString()}
    </span>
  );
}

export default function SubdivisionResult({
  address,
  eligibility,
  zone,
  overlays,
  parcel,
  lga,
  subdivided,
  uplift,
  onSubdivide,
  lotCount,
  maxLots,
  onLotCountChange,
}: SubdivisionResultProps) {
  const isEligible = eligibility.eligible || eligibility.eligibleWithConditions;
  const isUnknownZoning = eligibility.unknownZoning;
  // Always allow subdivision visualisation — even ineligible sites can preview a theoretical split
  const showSubdivideButton = true;

  return (
    <div className="space-y-3">
      {/* Address + parcel info */}
      <div className="bg-surface rounded-xl border border-border/50 p-4">
        <div className="flex items-start gap-2.5">
          <MapPin className="w-4 h-4 text-casa-navy flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-serif font-semibold text-text-primary truncate">{address}</p>
            <div className="flex flex-wrap gap-2 mt-1.5">
              {parcel.lotPlan && (
                <span className="text-[10px] text-text-tertiary bg-subtle px-2 py-0.5 rounded-full">{parcel.lotPlan}</span>
              )}
              {parcel.areaSqm && (
                <span className="text-[10px] text-text-tertiary bg-subtle px-2 py-0.5 rounded-full">{parcel.areaSqm.toLocaleString()}m²</span>
              )}
              {lga && (
                <span className="text-[10px] text-text-tertiary bg-subtle px-2 py-0.5 rounded-full">{lga}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Zoning info */}
      {zone && (
        <div className="bg-surface rounded-xl border border-border/50 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Layers className="w-4 h-4 text-casa-navy" />
            <h4 className="text-xs font-semibold text-text-primary">Zoning</h4>
          </div>
          <p className="text-sm font-medium text-casa-navy">{zone.name}</p>
          {eligibility.rule && (
            <div className="mt-2 flex gap-4">
              <div>
                <p className="text-[9px] text-text-tertiary uppercase tracking-wider">Min. Lot Size</p>
                <p className="text-xs font-semibold text-text-primary">{eligibility.minLotSizeM2.toLocaleString()}m²</p>
              </div>
              <div>
                <p className="text-[9px] text-text-tertiary uppercase tracking-wider">Min. Frontage</p>
                <p className="text-xs font-semibold text-text-primary">{eligibility.rule.minFrontageM}m</p>
              </div>
              <div>
                <p className="text-[9px] text-text-tertiary uppercase tracking-wider">Max Lots</p>
                <p className="text-xs font-semibold text-text-primary">{eligibility.maxLots}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Overlays */}
      {overlays.length > 0 && (
        <div className="bg-surface rounded-xl border border-border/50 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-4 h-4 text-casa-navy" />
            <h4 className="text-xs font-semibold text-text-primary">Planning Overlays</h4>
          </div>
          <div className="space-y-1.5">
            {overlays.map((o) => {
              const Icon = OVERLAY_ICONS[o.bucket] || Shield;
              const impact = eligibility.overlayProhibitions.find((p) => p.bucket === o.bucket)
                || eligibility.overlayRestrictions.find((r) => r.bucket === o.bucket);
              return (
                <div key={`${o.bucket}-${o.layerId}`} className="flex items-start gap-2">
                  <Icon className="w-3.5 h-3.5 text-text-tertiary flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-[11px] text-text-primary font-medium">{o.layerName}</p>
                    {impact && (
                      <p className={`text-[10px] mt-0.5 ${
                        impact.impact === 'prohibit' ? 'text-red-600' :
                        impact.impact === 'restrict' ? 'text-amber-600' :
                        'text-text-tertiary'
                      }`}>
                        {impact.impact === 'prohibit' ? 'May prohibit subdivision' :
                         impact.impact === 'restrict' ? 'Additional requirements apply' :
                         'For information'}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Eligibility result */}
      <div className={`rounded-xl border p-4 ${
        isEligible
          ? 'bg-emerald-50 border-emerald-200'
          : isUnknownZoning
          ? 'bg-amber-50 border-amber-200'
          : 'bg-red-50 border-red-200'
      }`}>
        <div className="flex items-center gap-2 mb-2">
          {isEligible ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          ) : isUnknownZoning ? (
            <AlertTriangle className="w-5 h-5 text-amber-600" />
          ) : (
            <XCircle className="w-5 h-5 text-red-600" />
          )}
          <h4 className={`text-sm font-semibold ${
            isEligible ? 'text-emerald-800' : isUnknownZoning ? 'text-amber-800' : 'text-red-800'
          }`}>
            {eligibility.eligible
              ? 'Eligible for Subdivision'
              : eligibility.eligibleWithConditions
              ? 'Eligible with Conditions'
              : isUnknownZoning
              ? 'May Be Subdividable'
              : 'Not Eligible for Subdivision'}
          </h4>
        </div>
        <p className={`text-xs leading-relaxed ${
          isEligible ? 'text-emerald-700' : isUnknownZoning ? 'text-amber-700' : 'text-red-700'
        }`}>
          {eligibility.reason}
        </p>

        {/* Overlay conditions */}
        {eligibility.eligibleWithConditions && eligibility.overlayRestrictions.length > 0 && (
          <div className="mt-3 pt-3 border-t border-emerald-200 space-y-1.5">
            <p className="text-[10px] text-emerald-800 font-semibold uppercase tracking-wider">Conditions</p>
            {eligibility.overlayRestrictions.map((r) => (
              <p key={r.bucket} className="text-[11px] text-emerald-700">{r.description}</p>
            ))}
          </div>
        )}
      </div>

      {/* Subdivide button */}
      {showSubdivideButton && !subdivided && (
        <button
          onClick={() => onSubdivide()}
          className="w-full py-4 rounded-xl bg-casa-navy text-white font-semibold text-base hover:bg-casa-navy-light transition-colors shadow-lg flex items-center justify-center gap-2"
        >
          <Scissors className="w-5 h-5" />
          Subdivide
        </button>
      )}

      {/* Lot count adjuster — visible after subdivide */}
      {subdivided && (
        <div className="bg-surface rounded-xl border border-border/50 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-text-primary">Number of lots</p>
              <p className="text-[10px] text-text-tertiary mt-0.5">
                {maxLots >= 2 ? `Max ${maxLots} lots based on min. lot size` : 'Adjust to preview subdivision layouts'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onLotCountChange(Math.max(2, lotCount - 1))}
                disabled={lotCount <= 2}
                className="w-8 h-8 rounded-lg border border-border/50 flex items-center justify-center text-text-secondary hover:bg-subtle disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-8 text-center text-sm font-semibold text-casa-navy">{lotCount}</span>
              <button
                onClick={() => onLotCountChange(Math.min(Math.max(maxLots, 4), lotCount + 1))}
                disabled={lotCount >= Math.max(maxLots, 4)}
                className="w-8 h-8 rounded-lg border border-border/50 flex items-center justify-center text-text-secondary hover:bg-subtle disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Uplift result */}
      {subdivided && uplift && (
        <div className="bg-emerald-50 border-2 border-emerald-300 rounded-xl p-6 text-center">
          <p className="text-sm text-emerald-700 font-medium mb-2">
            {isUnknownZoning ? 'Approx. Subdivision Uplift' : 'Estimated Subdivision Uplift'}
          </p>
          <p className="text-4xl font-serif font-bold text-emerald-600">
            {isUnknownZoning && <span className="text-xl font-normal">approx. </span>}
            +$<AnimatedCounter value={uplift.uplift} />
          </p>
          <div className="flex justify-center gap-6 mt-4 text-xs text-emerald-700">
            <div>
              <p className="text-[10px] text-emerald-600 uppercase tracking-wider">
                {uplift.valueSource === 'valuation_api' ? 'Land Value' : 'Current Value'}
              </p>
              <p className="font-semibold">{formatCurrency(uplift.propertyValue)}</p>
            </div>
            {uplift.perLotValue > 0 && (
              <div>
                <p className="text-[10px] text-emerald-600 uppercase tracking-wider">Per Lot Value</p>
                <p className="font-semibold">{formatCurrency(uplift.perLotValue)}</p>
              </div>
            )}
            <div>
              <p className="text-[10px] text-emerald-600 uppercase tracking-wider">After Subdivision</p>
              <p className="font-semibold">{formatCurrency(uplift.totalValueAfter)}</p>
            </div>
          </div>
          <p className="text-[10px] text-emerald-600/70 mt-3">
            {uplift.valueSource === 'valuation_api'
              ? 'Based on QLD Government land valuation data'
              : 'Based on suburb median estimates'}
            {isUnknownZoning && ' · Subject to formal zoning confirmation and council assessment'}
          </p>
        </div>
      )}

      {/* Service checkout CTA */}
      {showSubdivideButton && (
        <div className="bg-surface rounded-xl border border-border/50 p-5">
          <ServiceCheckout
            services={['preliminary', 'subdivision']}
            address={address}
          />
        </div>
      )}

      {/* Not eligible — suggest development */}
      {!isEligible && !isUnknownZoning && (
        <div className="bg-surface rounded-xl border border-border/50 p-5">
          <h4 className="font-serif text-base text-text-primary mb-2">
            Not subdividable? Consider development potential
          </h4>
          <p className="text-sm text-text-secondary leading-relaxed mb-3">
            Even if subdivision isn&apos;t an option, your site may have significant development potential.
            Switch to the Development tab to explore feasibility for townhouses, apartments, or mixed-use.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 text-sm font-medium text-casa-navy hover:underline"
          >
            Book a free consultation <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      {/* Disclaimer */}
      <p className="text-[10px] text-text-tertiary leading-relaxed">
        This assessment is indicative only, based on publicly available data. Actual subdivision
        eligibility depends on site-specific conditions, council assessment, and current planning
        scheme provisions. This does not constitute professional planning or legal advice.
        A formal <Brand>Casa Intelligence</Brand> assessment is recommended before proceeding.
      </p>
    </div>
  );
}
