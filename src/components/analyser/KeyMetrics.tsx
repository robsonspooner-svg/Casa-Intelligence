'use client';

import { calculateFeasibility, formatCurrency, type FeasibilityResult } from '@/lib/feasibility-calc';
import type { SiteParameters } from './ParameterPanel';
import { TrendingUp, TrendingDown, Ruler, LayoutGrid, Building2, Users } from 'lucide-react';

interface KeyMetricsProps {
  params: SiteParameters;
  parcelAreaSqm?: number | null;
  maxHeight?: number | null;
  slopePercent?: number | null;
  overlayBuckets?: string[];
  suburb?: string | null;
  zoneName?: string | null;
}

const CONFIDENCE_DOT: Record<string, string> = {
  green: 'bg-emerald-500',
  amber: 'bg-amber-500',
  red: 'bg-red-500',
};

export default function KeyMetrics({
  params, parcelAreaSqm, maxHeight,
  slopePercent, overlayBuckets = [], suburb, zoneName,
}: KeyMetricsProps) {
  const result: FeasibilityResult = calculateFeasibility({
    ...params,
    parcelAreaSqm,
    maxHeight,
    slopePercent,
    overlayBuckets,
    suburb,
    zoneName,
  });

  const isProfitable = result.profit.mid > 0;
  const sm = result.siteMetrics;
  const da = result.densityAssessment;
  const storeyHeight = 3.2;
  const buildingHeight = params.storeys * storeyHeight;
  const isOverHeight = maxHeight != null && buildingHeight > maxHeight;

  return (
    <div className="space-y-2">
      <p className="text-[10px] text-text-tertiary uppercase tracking-wider font-medium">Key Metrics</p>

      {/* Profit with confidence dot */}
      <div className="flex items-center justify-between py-1.5 border-b border-border/30">
        <div className="flex items-center gap-1.5">
          {isProfitable ? (
            <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
          ) : (
            <TrendingDown className="w-3.5 h-3.5 text-red-500" />
          )}
          <span className="text-[11px] text-text-secondary">Est. Profit</span>
          <div className={`w-1.5 h-1.5 rounded-full ${CONFIDENCE_DOT[result.confidenceLevel]}`} title={`Confidence: ${result.confidenceLevel}`} />
        </div>
        <span className={`text-[11px] font-bold ${isProfitable ? 'text-emerald-600' : 'text-red-600'}`}>
          {formatCurrency(result.profit.mid)} ({result.margin.mid}%)
        </span>
      </div>

      {/* Density metric */}
      {da && (
        <div className="flex items-center justify-between py-1.5 border-b border-border/30">
          <div className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-text-tertiary" />
            <span className="text-[11px] text-text-secondary">Density</span>
          </div>
          <span className={`text-[11px] font-bold ${da.isOverDense ? 'text-red-600' : 'text-text-primary'}`}>
            {da.requestedUnits} / {da.maxRealisticUnits} max
          </span>
        </div>
      )}

      {/* Site coverage */}
      {sm && (
        <div className="flex items-center justify-between py-1.5 border-b border-border/30">
          <div className="flex items-center gap-1.5">
            <LayoutGrid className="w-3.5 h-3.5 text-text-tertiary" />
            <span className="text-[11px] text-text-secondary">Site Coverage</span>
          </div>
          <span className={`text-[11px] font-bold ${sm.isCoverageExcessive ? 'text-red-600' : 'text-text-primary'}`}>
            {sm.siteCoverage}%
          </span>
        </div>
      )}

      {/* GFA */}
      <div className="flex items-center justify-between py-1.5 border-b border-border/30">
        <div className="flex items-center gap-1.5">
          <Building2 className="w-3.5 h-3.5 text-text-tertiary" />
          <span className="text-[11px] text-text-secondary">Total GFA</span>
        </div>
        <span className="text-[11px] font-bold text-text-primary">
          {result.totalGFA.toLocaleString()}m²
        </span>
      </div>

      {/* Height check */}
      {maxHeight !== null && (
        <div className="flex items-center justify-between py-1.5">
          <div className="flex items-center gap-1.5">
            <Ruler className="w-3.5 h-3.5 text-text-tertiary" />
            <span className="text-[11px] text-text-secondary">Height</span>
          </div>
          <span className={`text-[11px] font-bold ${isOverHeight ? 'text-red-600' : 'text-emerald-600'}`}>
            {buildingHeight.toFixed(1)}m / {maxHeight}m
          </span>
        </div>
      )}
    </div>
  );
}
