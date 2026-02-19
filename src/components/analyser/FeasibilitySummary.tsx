'use client';

import Brand from '@/components/brand/Brand';
import { calculateFeasibility, formatCurrency, formatRange, PRE_DEV_COSTS, getOverlayCostLabel, type FeasibilityResult } from '@/lib/feasibility-calc';
import type { SiteParameters } from './ParameterPanel';
import { TrendingUp, TrendingDown, AlertTriangle, ShieldAlert, ShieldCheck, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

interface FeasibilitySummaryProps {
  params: SiteParameters;
  parcelAreaSqm?: number | null;
  maxHeight?: number | null;
  slopePercent?: number | null;
  overlayBuckets?: string[];
  suburb?: string | null;
  zoneName?: string | null;
}

function ResultRow({ label, value, highlight, indent }: { label: React.ReactNode; value: string; highlight?: 'positive' | 'negative'; indent?: boolean }) {
  return (
    <div className={`flex justify-between items-center py-1.5 border-b border-border/30 last:border-b-0 ${indent ? 'ml-3' : ''}`}>
      <span className={`text-[11px] ${indent ? 'text-text-tertiary' : 'text-text-secondary'}`}>{label}</span>
      <span className={`text-[11px] font-semibold ${
        highlight === 'positive' ? 'text-emerald-600' :
        highlight === 'negative' ? 'text-red-600' :
        'text-text-primary'
      }`}>
        {value}
      </span>
    </div>
  );
}

const CONFIDENCE_CONFIG = {
  green: {
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    dot: 'bg-emerald-500',
    text: 'text-emerald-800',
    subtext: 'text-emerald-600',
    label: 'High confidence',
    Icon: ShieldCheck,
  },
  amber: {
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    dot: 'bg-amber-500',
    text: 'text-amber-800',
    subtext: 'text-amber-600',
    label: 'Review needed',
    Icon: AlertTriangle,
  },
  red: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    dot: 'bg-red-500',
    text: 'text-red-800',
    subtext: 'text-red-600',
    label: 'Low confidence',
    Icon: ShieldAlert,
  },
} as const;

const TIER_LABELS: Record<string, string> = {
  premium: 'Premium area',
  standard: 'Standard area',
  growth: 'Growth corridor',
  value: 'Value area',
  unknown: 'Unknown area',
};

export default function FeasibilitySummary({
  params, parcelAreaSqm, maxHeight,
  slopePercent, overlayBuckets = [], suburb, zoneName,
}: FeasibilitySummaryProps) {
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
  const hasWarnings = sm && (sm.isCoverageExcessive || sm.isOverHeight);
  const conf = CONFIDENCE_CONFIG[result.confidenceLevel];
  const hasSlopePremium = result.slopePremium.mid > 0;
  const hasOverlayPremium = result.overlayPremium.mid > 0;
  const [showBreakdown, setShowBreakdown] = useState(false);

  return (
    <div className="space-y-3">
      <h3 className="text-xs font-semibold text-text-primary">Preliminary Feasibility</h3>

      {/* Confidence badge */}
      <div className={`${conf.bg} border ${conf.border} rounded-xl p-3`}>
        <div className="flex items-center gap-2 mb-1">
          <conf.Icon className={`w-4 h-4 ${conf.subtext} flex-shrink-0`} />
          <span className={`text-xs font-semibold ${conf.text}`}>{conf.label}</span>
          <div className={`w-2 h-2 rounded-full ${conf.dot}`} />
        </div>
        <ul className="space-y-0.5 ml-6">
          {result.confidenceReasons.map((reason, i) => (
            <li key={i} className={`text-[10px] ${conf.subtext}`}>{reason}</li>
          ))}
        </ul>
      </div>

      {/* Density over-capacity alert */}
      {da?.isOverDense && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex gap-2.5">
          <ShieldAlert className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-semibold text-red-800">Exceeds site capacity</p>
            <p className="text-[10px] text-red-600 mt-0.5">
              {da.requestedUnits} units requested but this site realistically supports ~{da.maxRealisticUnits} units.
              {da.reason && ` ${da.reason}.`}
            </p>
          </div>
        </div>
      )}

      {/* Site compliance warnings */}
      {hasWarnings && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 space-y-1.5">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span className="text-xs font-semibold text-amber-800">Planning compliance flags</span>
          </div>
          {sm.isCoverageExcessive && (
            <p className="text-[10px] text-amber-700 ml-6">
              Site coverage ({sm.siteCoverage}%) exceeds the typical 50% maximum.
              Reduce units or increase storeys to improve coverage.
            </p>
          )}
          {sm.isOverHeight && (
            <p className="text-[10px] text-amber-700 ml-6">
              Building height ({(params.storeys * 3.2).toFixed(1)}m) exceeds the
              {maxHeight}m height limit. Maximum {sm.maxStoreys} storeys permitted.
            </p>
          )}
        </div>
      )}

      {/* Site metrics — only shown when we have parcel data */}
      {sm && (
        <div className="bg-casa-navy/[0.03] rounded-xl p-4 space-y-0">
          <p className="text-[10px] text-text-tertiary uppercase tracking-wider mb-2">Site Metrics</p>
          <ResultRow label="Site area" value={`${sm.parcelAreaSqm.toLocaleString()}m²`} />
          <ResultRow
            label="Building footprint"
            value={`${sm.buildingFootprint.toLocaleString()}m²`}
          />
          <ResultRow
            label="Site coverage"
            value={`${sm.siteCoverage}%`}
            highlight={sm.isCoverageExcessive ? 'negative' : 'positive'}
          />
          <ResultRow label="Plot ratio (GFA:site)" value={`${sm.plotRatio}:1`} />
          <ResultRow label="Total GFA" value={`${result.totalGFA.toLocaleString()}m²`} />
        </div>
      )}

      {/* Key metrics */}
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-surface rounded-xl border border-border/50 p-3 text-center">
          <p className="text-[9px] text-text-tertiary uppercase tracking-wider mb-0.5">Est. Profit</p>
          <p className={`text-base font-serif font-bold ${isProfitable ? 'text-emerald-600' : 'text-red-600'}`}>
            {formatCurrency(result.profit.mid)}
          </p>
          <div className="flex items-center justify-center gap-1 mt-1">
            {isProfitable ? (
              <TrendingUp className="w-3 h-3 text-emerald-500" />
            ) : (
              <TrendingDown className="w-3 h-3 text-red-500" />
            )}
            <span className={`text-[10px] ${isProfitable ? 'text-emerald-500' : 'text-red-500'}`}>
              {result.margin.mid}% margin
            </span>
          </div>
        </div>

        <div className="bg-surface rounded-xl border border-border/50 p-3 text-center">
          <p className="text-[9px] text-text-tertiary uppercase tracking-wider mb-0.5">Total Revenue</p>
          <p className="text-base font-serif font-bold text-casa-navy">
            {formatCurrency(result.totalRevenue.mid)}
          </p>
          <div className="flex items-center justify-center gap-1 mt-1">
            <span className="text-[10px] text-text-tertiary">
              {TIER_LABELS[result.salePriceTier] || result.salePriceTier}
            </span>
          </div>
        </div>
      </div>

      {/* Cost breakdown (collapsed by default) */}
      <div className="bg-surface rounded-xl border border-border/50 p-3">
        <div className="flex justify-between items-center py-1">
          <span className="text-xs font-semibold text-text-primary">Total Development Cost</span>
          <span className="text-xs font-bold text-casa-navy">{formatRange(result.totalDevelopmentCost)}</span>
        </div>
        <button
          onClick={() => setShowBreakdown(!showBreakdown)}
          className="flex items-center gap-1 text-[10px] text-casa-navy font-medium mt-1 hover:underline"
        >
          {showBreakdown ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          {showBreakdown ? 'Hide detailed breakdown' : 'View detailed breakdown'}
        </button>
        {showBreakdown && (
          <div className="mt-2 pt-2 border-t border-border/30">
            <ResultRow label="Land cost" value={formatCurrency(params.landCost)} />
            <ResultRow label={`Construction (${result.totalGFA.toLocaleString()}m² GFA)`} value={formatRange(result.constructionCost)} />
            {hasSlopePremium && (
              <ResultRow label={`Slope premium (${result.slopeLabel})`} value={formatRange(result.slopePremium)} indent />
            )}
            {hasOverlayPremium && (
              <ResultRow label="Overlay premium" value={formatRange(result.overlayPremium)} indent />
            )}
            <ResultRow label="External works (driveways, landscaping, etc.)" value={formatRange(result.externalWorks)} />
            <ResultRow label="Subdivision / strata" value={formatRange(result.subdivisionCosts)} />
            <ResultRow label="Contingency (10%)" value={formatRange(result.contingency)} />
            <ResultRow label="Professional fees (5%)" value={formatRange(result.professionalFees)} />
            <ResultRow label="Finance costs (8%)" value={formatRange(result.financeCosts)} />
            <ResultRow label={<>Pre-development (<Brand>Casa Intelligence</Brand>)</>} value={formatRange(result.preDevelopmentCost)} />
            <ResultRow label={`Infrastructure charges (${params.numberOfUnits} dwellings)`} value={formatRange(result.infrastructureCharges)} />
            <ResultRow label="DA lodgement fees" value={formatRange(result.daFees)} />
            <ResultRow label="Marketing & selling (3%)" value={formatRange(result.marketingAndSelling)} />
          </div>
        )}
      </div>

      {/* Status quo comparison */}
      <div className="bg-warm rounded-xl border border-gold/20 p-3">
        <p className="text-xs font-semibold text-text-primary mb-2">
          What this would cost without <Brand>Casa Intelligence</Brand>
        </p>
        <p className="text-[10px] text-text-secondary mb-3">
          Engaging all consultants separately for a site like this:
        </p>
        {Object.values(PRE_DEV_COSTS).map((cost) => (
          <ResultRow key={cost.label} label={cost.label} value={formatRange(cost)} />
        ))}
        <div className="flex justify-between items-center py-2 mt-1 border-t border-gold/20">
          <span className="text-xs font-semibold text-text-primary">Total (Status Quo)</span>
          <span className="text-xs font-bold text-red-600">{formatRange(result.statusQuoPreDevCost)}</span>
        </div>
        <div className="flex justify-between items-center py-2 border-t border-gold/20">
          <span className="text-xs font-semibold text-emerald-700">You save with <Brand>Casa Intelligence</Brand></span>
          <span className="text-xs font-bold text-emerald-600">
            {formatCurrency(result.statusQuoPreDevCost.mid - result.preDevelopmentCost.mid)}+
          </span>
        </div>
      </div>

      {/* Disclaimer */}
      <p className="text-[10px] text-text-tertiary leading-relaxed">
        These figures are indicative estimates based on current Sunshine Coast market data and typical
        development costs. Actual costs will vary based on site-specific conditions, market conditions
        at time of sale, and scope of works. This does not constitute financial or investment advice.
        A formal <Brand>Casa Intelligence</Brand> feasibility assessment provides detailed, site-specific analysis.
      </p>
    </div>
  );
}
