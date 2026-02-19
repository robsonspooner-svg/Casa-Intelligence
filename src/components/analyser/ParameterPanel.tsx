'use client';

import { inferProductType, formatCurrency, calculateMaxDensity, getEstimatedSalePrice, type ProductType } from '@/lib/feasibility-calc';

export interface SiteParameters {
  numberOfUnits: number;
  storeys: number;
  floorAreaPerUnit: number;
  landCost: number;
  productType: ProductType;
  bedroomMix: '2bed' | '3bed' | 'mixed';
  roofType: 'flat' | 'gable' | 'hip';
  materialPreset: 'modern' | 'traditional' | 'coastal';
  salePriceOverride: number | null; // per-unit sale price override (null = use model defaults)
}

interface ParameterPanelProps {
  params: SiteParameters;
  onChange: (params: SiteParameters) => void;
  maxHeight?: number | null;
  parcelAreaSqm?: number | null;
  zoneName?: string | null;
  suburb?: string | null;
}

// Logarithmic slider helpers for wide-range inputs
const LAND_COST_MIN = 200000;
const LAND_COST_MAX = 40000000;
const SALE_PRICE_MIN = 200000;
const SALE_PRICE_MAX = 10000000;

function logToLinear(value: number, min: number, max: number): number {
  return (Math.log(value) - Math.log(min)) / (Math.log(max) - Math.log(min));
}

function linearToLog(position: number, min: number, max: number): number {
  return Math.round(min * Math.pow(max / min, position));
}

function roundToNearestStep(value: number): number {
  if (value < 500000) return Math.round(value / 10000) * 10000;
  if (value < 2000000) return Math.round(value / 25000) * 25000;
  if (value < 5000000) return Math.round(value / 50000) * 50000;
  if (value < 10000000) return Math.round(value / 100000) * 100000;
  return Math.round(value / 250000) * 250000;
}

export default function ParameterPanel({ params, onChange, maxHeight, parcelAreaSqm, zoneName, suburb }: ParameterPanelProps) {
  const storeyHeight = 3.2;
  const maxStoreys = maxHeight ? Math.floor(maxHeight / storeyHeight) : null;

  // Density guard
  const densityAssessment = parcelAreaSqm
    ? calculateMaxDensity(parcelAreaSqm, params.productType, params.storeys, params.floorAreaPerUnit, zoneName)
    : null;
  const maxRealisticUnits = densityAssessment?.maxRealisticUnits ?? null;
  const isOverDense = maxRealisticUnits !== null && params.numberOfUnits > maxRealisticUnits;

  // Estimated per-unit sale price from model (shown as default)
  const estimatedPrice = getEstimatedSalePrice(params.productType, params.bedroomMix, suburb);
  const displayPrice = params.salePriceOverride ?? estimatedPrice;

  const update = (key: keyof SiteParameters, value: number | string) => {
    const next = { ...params, [key]: value };
    const nextStoreys = key === 'storeys' && typeof value === 'number' ? value : next.storeys;
    const nextUnits = key === 'numberOfUnits' && typeof value === 'number' ? value : next.numberOfUnits;
    if (key === 'storeys' || key === 'numberOfUnits') {
      next.productType = inferProductType(nextStoreys, nextUnits);
    }
    onChange(next);
  };

  return (
    <div className="space-y-3">
      <p className="text-[10px] text-text-tertiary uppercase tracking-wider font-medium">Parameters</p>

      {/* Site area badge */}
      {parcelAreaSqm && (
        <div className="bg-casa-navy/[0.03] rounded-lg px-2.5 py-1.5 flex items-center justify-between">
          <span className="text-[10px] text-text-tertiary uppercase tracking-wider">Site</span>
          <span className="text-[11px] font-semibold text-casa-navy">{parcelAreaSqm.toLocaleString()}m²</span>
        </div>
      )}

      {/* Number of units */}
      <div>
        <div className="flex justify-between mb-1">
          <label className="text-[11px] text-text-secondary">Units</label>
          <span className={`text-[11px] font-semibold ${isOverDense ? 'text-red-600' : 'text-casa-navy'}`}>
            {params.numberOfUnits}
            {isOverDense && <span className="text-red-500 ml-1">!</span>}
          </span>
        </div>
        <input
          type="range"
          min={2}
          max={200}
          value={params.numberOfUnits}
          onChange={(e) => update('numberOfUnits', parseInt(e.target.value))}
          className={`w-full h-1 ${isOverDense ? 'accent-red-500' : 'accent-casa-navy'}`}
        />
        {maxRealisticUnits !== null && (
          <p className={`text-[9px] mt-0.5 ${isOverDense ? 'text-red-500 font-medium' : 'text-text-tertiary'}`}>
            {isOverDense ? `Exceeds site capacity` : `Realistic max: ~${maxRealisticUnits} units`}
          </p>
        )}
      </div>

      {/* Storeys */}
      <div>
        <div className="flex justify-between mb-1">
          <label className="text-[11px] text-text-secondary">Storeys</label>
          <span className="text-[11px] font-semibold text-casa-navy">
            {params.storeys}
            {maxStoreys && params.storeys > maxStoreys && (
              <span className="text-red-500 ml-1">!</span>
            )}
          </span>
        </div>
        <input
          type="range"
          min={1}
          max={12}
          value={params.storeys}
          onChange={(e) => update('storeys', parseInt(e.target.value))}
          className="w-full accent-casa-navy h-1"
        />
        {maxStoreys && (
          <p className="text-[9px] text-red-400 mt-0.5">Limit: {maxStoreys} storeys</p>
        )}
      </div>

      {/* Floor area per unit */}
      <div>
        <div className="flex justify-between mb-1">
          <label className="text-[11px] text-text-secondary">Unit Area</label>
          <span className="text-[11px] font-semibold text-casa-navy">{params.floorAreaPerUnit}m²</span>
        </div>
        <input
          type="range"
          min={50}
          max={500}
          step={5}
          value={params.floorAreaPerUnit}
          onChange={(e) => update('floorAreaPerUnit', parseInt(e.target.value))}
          className="w-full accent-casa-navy h-1"
        />
      </div>

      {/* Land cost (logarithmic scale) */}
      <div>
        <div className="flex justify-between mb-1">
          <label className="text-[11px] text-text-secondary">Land Cost</label>
          <span className="text-[11px] font-semibold text-casa-navy">
            {formatCurrency(params.landCost)}
          </span>
        </div>
        <input
          type="range"
          min={0}
          max={1000}
          value={Math.round(logToLinear(params.landCost, LAND_COST_MIN, LAND_COST_MAX) * 1000)}
          onChange={(e) => {
            const raw = linearToLog(parseInt(e.target.value) / 1000, LAND_COST_MIN, LAND_COST_MAX);
            update('landCost', roundToNearestStep(raw));
          }}
          className="w-full accent-casa-navy h-1"
        />
      </div>

      {/* Bedroom mix */}
      <div>
        <label className="text-[11px] text-text-secondary mb-1 block">Bedroom Mix</label>
        <div className="grid grid-cols-3 gap-1">
          {(['2bed', '3bed', 'mixed'] as const).map((mix) => (
            <button
              key={mix}
              onClick={() => update('bedroomMix', mix)}
              className={`text-[10px] py-1.5 rounded-md border transition-colors ${
                params.bedroomMix === mix
                  ? 'border-casa-navy bg-casa-navy/5 text-casa-navy font-medium'
                  : 'border-border text-text-tertiary hover:border-casa-navy/30'
              }`}
            >
              {mix === '2bed' ? '2 Bed' : mix === '3bed' ? '3 Bed' : 'Mixed'}
            </button>
          ))}
        </div>
      </div>

      {/* Product type */}
      <div className="pt-2 border-t border-border/30">
        <label className="text-[11px] text-text-secondary mb-1 block">Product</label>
        <div className="grid grid-cols-2 gap-1">
          {([
            { key: 'duplex' as ProductType, label: 'Duplex' },
            { key: 'townhouse' as ProductType, label: 'Townhouses' },
            { key: 'low_rise_apartment' as ProductType, label: 'Low-Rise Apts' },
            { key: 'medium_rise_apartment' as ProductType, label: 'Med-Rise Apts' },
          ]).map(({ key, label }) => (
            <button
              key={key}
              onClick={() => update('productType', key)}
              className={`text-[10px] py-1.5 rounded-md border transition-colors ${
                params.productType === key
                  ? 'border-casa-navy bg-casa-navy/5 text-casa-navy font-medium'
                  : 'border-border text-text-tertiary hover:border-casa-navy/30'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Sale price per unit */}
      <div>
        <div className="flex justify-between items-center mb-1">
          <label className="text-[11px] text-text-secondary">Est. Sale Price / Unit</label>
          <div className="flex items-center gap-1.5">
            {params.salePriceOverride !== null && (
              <button
                onClick={() => onChange({ ...params, salePriceOverride: null })}
                className="text-[9px] text-casa-navy underline"
              >
                Reset
              </button>
            )}
            <span className="text-[11px] font-semibold text-casa-navy">
              {formatCurrency(displayPrice)}
            </span>
          </div>
        </div>
        <input
          type="range"
          min={0}
          max={1000}
          value={Math.round(logToLinear(displayPrice, SALE_PRICE_MIN, SALE_PRICE_MAX) * 1000)}
          onChange={(e) => {
            const raw = linearToLog(parseInt(e.target.value) / 1000, SALE_PRICE_MIN, SALE_PRICE_MAX);
            onChange({ ...params, salePriceOverride: roundToNearestStep(raw) });
          }}
          className="w-full accent-casa-navy h-1"
        />
        <p className="text-[9px] text-text-tertiary mt-0.5">
          {params.salePriceOverride !== null
            ? 'Adjusted by user'
            : 'Estimated from product type, bedrooms & suburb'}
        </p>
      </div>

      {/* Roof type */}
      <div>
        <label className="text-[11px] text-text-secondary mb-1 block">Roof Style</label>
        <div className="grid grid-cols-3 gap-1">
          {(['flat', 'gable', 'hip'] as const).map((roof) => (
            <button
              key={roof}
              onClick={() => update('roofType', roof)}
              className={`text-[10px] py-1.5 rounded-md border transition-colors ${
                params.roofType === roof
                  ? 'border-casa-navy bg-casa-navy/5 text-casa-navy font-medium'
                  : 'border-border text-text-tertiary hover:border-casa-navy/30'
              }`}
            >
              {roof === 'flat' ? 'Flat' : roof === 'gable' ? 'Gable' : 'Hip'}
            </button>
          ))}
        </div>
      </div>

      {/* Material preset */}
      <div>
        <label className="text-[11px] text-text-secondary mb-1 block">Material</label>
        <div className="grid grid-cols-3 gap-1">
          {(['modern', 'traditional', 'coastal'] as const).map((mat) => (
            <button
              key={mat}
              onClick={() => update('materialPreset', mat)}
              className={`text-[10px] py-1.5 rounded-md border transition-colors ${
                params.materialPreset === mat
                  ? 'border-casa-navy bg-casa-navy/5 text-casa-navy font-medium'
                  : 'border-border text-text-tertiary hover:border-casa-navy/30'
              }`}
            >
              {mat.charAt(0).toUpperCase() + mat.slice(1)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
