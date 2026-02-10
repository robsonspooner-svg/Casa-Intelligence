'use client';

import { getZoneRule, getDefaultZoneRule, type ZoneRule } from '@/lib/zoning-rules';
import { Check, AlertTriangle, X, Building2, Info } from 'lucide-react';

interface ZoningSummaryProps {
  zoneName: string | null;
  zoneCode: string | null;
  precinct: string | null;
  localPlan: string | null;
}

export default function ZoningSummary({ zoneName, zoneCode, precinct, localPlan }: ZoningSummaryProps) {
  const rule: ZoneRule = zoneName ? getZoneRule(zoneName) || getDefaultZoneRule() : getDefaultZoneRule();

  const isKnown = zoneName && rule.zone !== 'Unknown';

  return (
    <div className="space-y-3">
      <h3 className="text-xs font-semibold text-text-primary">Zoning Assessment</h3>

      {/* Zone name badge */}
      <div className="bg-surface rounded-xl border border-border/50 p-3">
        <div className="flex items-start gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-casa-navy/5 flex items-center justify-center flex-shrink-0">
            <Building2 className="w-4 h-4 text-casa-navy" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-serif font-semibold text-casa-navy">
              {zoneName || 'Zone not identified'}
            </p>
            {zoneCode && (
              <p className="text-xs text-text-tertiary mt-0.5">Code: {zoneCode}</p>
            )}
            {localPlan && (
              <p className="text-xs text-text-tertiary">Local Plan: {localPlan}</p>
            )}
            {precinct && (
              <p className="text-xs text-text-tertiary">Precinct: {precinct}</p>
            )}
          </div>
        </div>
      </div>

      {/* Zone intelligence */}
      {isKnown && (
        <>
          {/* Multiple dwellings indicator */}
          <div className={`flex items-start gap-2.5 p-3 rounded-xl border ${
            rule.allowsMultipleDwellings
              ? 'bg-emerald-50 border-emerald-200'
              : 'bg-amber-50 border-amber-200'
          }`}>
            {rule.allowsMultipleDwellings ? (
              <Check className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
            )}
            <div>
              <p className={`text-sm font-medium ${rule.allowsMultipleDwellings ? 'text-emerald-800' : 'text-amber-800'}`}>
                {rule.allowsMultipleDwellings
                  ? 'Multiple dwellings anticipated in this zone'
                  : 'Multiple dwellings may require impact assessment'}
              </p>
              <p className={`text-xs mt-1 leading-relaxed ${rule.allowsMultipleDwellings ? 'text-emerald-600' : 'text-amber-600'}`}>
                {rule.description}
              </p>
            </div>
          </div>

          {/* Key zone details */}
          <div className="bg-surface rounded-xl border border-border/50 p-3 space-y-2">
            <div className="flex justify-between items-center py-1.5 border-b border-border/30">
              <span className="text-xs text-text-secondary">Assessment level</span>
              <span className="text-xs font-medium text-text-primary text-right max-w-[60%]">{rule.assessmentLevel}</span>
            </div>
            <div className="flex justify-between items-center py-1.5 border-b border-border/30">
              <span className="text-xs text-text-secondary">Density guide</span>
              <span className="text-xs font-medium text-text-primary">{rule.maxDensityHint}</span>
            </div>
            <div className="py-1.5">
              <span className="text-xs text-text-secondary block mb-2">Typical products</span>
              <div className="flex flex-wrap gap-1.5">
                {rule.typicalProducts.map((product) => (
                  <span
                    key={product}
                    className="text-[10px] font-medium text-casa-navy bg-casa-navy/5 px-2 py-1 rounded-full"
                  >
                    {product}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Disclaimer */}
      <div className="flex items-start gap-2 pt-2">
        <Info className="w-3.5 h-3.5 text-text-tertiary flex-shrink-0 mt-0.5" />
        <p className="text-[10px] text-text-tertiary leading-relaxed">
          Zoning information is sourced from the Sunshine Coast Planning Scheme via publicly available
          data. Zone categorisations and development potential are indicative only. Specific site
          circumstances, local plan provisions, and overlays may alter what is achievable. Formal
          planning advice is recommended before any commitments are made.
        </p>
      </div>
    </div>
  );
}
