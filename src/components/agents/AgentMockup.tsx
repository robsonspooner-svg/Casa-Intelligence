'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Brand from '@/components/brand/Brand';
import Container from '@/components/layout/Container';
import FadeIn from '@/components/ui/FadeIn';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2,
  MapPin,
  Search,
  BarChart3,
  Layers,
  Loader2,
  Scissors,
  TrendingUp,
  CheckCircle2,
} from 'lucide-react';

// ---------------------------------------------------------------------------
// Mock listings — these are the pre-loaded property cards
// ---------------------------------------------------------------------------

interface MockListing {
  address: string;
  fullAddress: string;
  price: string;
  area: string;
  tag: 'Subdividable' | 'Development Potential';
  image: string; // gradient color combo
  zone: string;
  overlays: string[];
  eligible: boolean;
  maxLots: number;
  lotArea: number;
  landValue: number;
  uplift: number;
  perLotValue: number;
}

const mockListings: MockListing[] = [
  {
    address: '14 Coral St, Maroochydore',
    fullAddress: '14 Coral Street, Maroochydore QLD 4558',
    price: '$1,250,000',
    area: '810m²',
    tag: 'Subdividable',
    image: 'from-teal-50 to-cyan-100',
    zone: 'Low Density Residential',
    overlays: ['Acid Sulfate Soils'],
    eligible: true,
    maxLots: 2,
    lotArea: 810,
    landValue: 720000,
    uplift: 487000,
    perLotValue: 765000,
  },
  {
    address: '7 Palm Ave, Buderim',
    fullAddress: '7 Palm Avenue, Buderim QLD 4556',
    price: '$985,000',
    area: '650m²',
    tag: 'Development Potential',
    image: 'from-amber-50 to-orange-100',
    zone: 'Medium Density Residential',
    overlays: ['Bushfire Hazard', 'Steep Land'],
    eligible: true,
    maxLots: 4,
    lotArea: 650,
    landValue: 540000,
    uplift: 215000,
    perLotValue: 780000,
  },
  {
    address: '22 Banksia Dr, Caloundra',
    fullAddress: '22 Banksia Drive, Caloundra QLD 4551',
    price: '$1,680,000',
    area: '1,120m²',
    tag: 'Subdividable',
    image: 'from-emerald-50 to-green-100',
    zone: 'Low-Medium Density Residential',
    overlays: ['Flooding and Inundation'],
    eligible: true,
    maxLots: 3,
    lotArea: 1120,
    landValue: 920000,
    uplift: 635000,
    perLotValue: 697000,
  },
];

// ---------------------------------------------------------------------------
// Analysis steps and types
// ---------------------------------------------------------------------------

type AnalysisPhase =
  | 'idle'
  | 'searching'
  | 'fetching_parcel'
  | 'checking_zoning'
  | 'scanning_overlays'
  | 'calculating'
  | 'done';

const PHASE_LABELS: Record<AnalysisPhase, string> = {
  idle: '',
  searching: 'Searching address...',
  fetching_parcel: 'Fetching parcel boundary...',
  checking_zoning: 'Checking zoning controls...',
  scanning_overlays: 'Scanning planning overlays...',
  calculating: 'Calculating subdivision potential...',
  done: 'Analysis complete',
};

interface AnalysisResult {
  address: string;
  lotArea: number;
  zone: string;
  overlays: string[];
  eligible: boolean;
  maxLots: number;
  landValue: number;
  uplift: number;
  perLotValue: number;
  tag: 'Subdividable' | 'Development Potential';
}

// ---------------------------------------------------------------------------
// Animated number counter (inline for the mockup)
// ---------------------------------------------------------------------------

function CountUp({ value, prefix = '', suffix = '', duration = 800 }: {
  value: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
}) {
  const [display, setDisplay] = useState(0);
  const startRef = useRef(0);
  const frameRef = useRef<number>(0);
  const startTimeRef = useRef(0);

  useEffect(() => {
    startRef.current = 0;
    startTimeRef.current = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * value));
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      }
    };

    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, [value, duration]);

  const formatted = display >= 1000
    ? `${prefix}${display.toLocaleString()}${suffix}`
    : `${prefix}${display}${suffix}`;

  return <span>{formatted}</span>;
}

// ---------------------------------------------------------------------------
// Fake parcel SVG — a simple lot split visualization
// ---------------------------------------------------------------------------

function ParcelGraphic({ lots, phase }: { lots: number; phase: AnalysisPhase }) {
  const showSplit = phase === 'done' && lots >= 2;
  return (
    <div className="relative w-full h-32 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-lg border border-emerald-200 overflow-hidden">
      {/* Parcel outline */}
      <svg viewBox="0 0 200 100" className="w-full h-full" preserveAspectRatio="none">
        {/* Base parcel */}
        <motion.rect
          x="10" y="10" width="180" height="80"
          rx="4" ry="4"
          fill="none"
          stroke="#10b981"
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />

        {/* Split lines */}
        <AnimatePresence>
          {showSplit && lots >= 2 && (
            <motion.line
              x1="100" y1="10" x2="100" y2="90"
              stroke="#f59e0b"
              strokeWidth="2"
              strokeDasharray="6 3"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              exit={{ pathLength: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            />
          )}
          {showSplit && lots >= 3 && (
            <motion.line
              x1="10" y1="50" x2="100" y2="50"
              stroke="#f59e0b"
              strokeWidth="2"
              strokeDasharray="6 3"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              exit={{ pathLength: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            />
          )}
          {showSplit && lots >= 4 && (
            <motion.line
              x1="100" y1="50" x2="190" y2="50"
              stroke="#f59e0b"
              strokeWidth="2"
              strokeDasharray="6 3"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              exit={{ pathLength: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            />
          )}
        </AnimatePresence>

        {/* Lot labels */}
        <AnimatePresence>
          {showSplit && Array.from({ length: Math.min(lots, 4) }).map((_, i) => {
            const positions = lots === 2
              ? [{ x: 50, y: 55 }, { x: 150, y: 55 }]
              : lots === 3
              ? [{ x: 50, y: 30 }, { x: 50, y: 70 }, { x: 150, y: 55 }]
              : [{ x: 50, y: 30 }, { x: 50, y: 70 }, { x: 150, y: 30 }, { x: 150, y: 70 }];
            const pos = positions[i] || { x: 100, y: 50 };
            return (
              <motion.text
                key={`lot-${i}`}
                x={pos.x}
                y={pos.y}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="#0d9488"
                fontSize="11"
                fontWeight="bold"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.6 + i * 0.15 }}
              >
                Lot {i + 1}
              </motion.text>
            );
          })}
        </AnimatePresence>
      </svg>

      {/* Map texture overlay */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 19px, #000 19px, #000 20px), repeating-linear-gradient(90deg, transparent, transparent 19px, #000 19px, #000 20px)',
        }}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Analysis progress steps
// ---------------------------------------------------------------------------

function ProgressSteps({ phase }: { phase: AnalysisPhase }) {
  const steps: { key: AnalysisPhase; label: string }[] = [
    { key: 'fetching_parcel', label: 'Parcel' },
    { key: 'checking_zoning', label: 'Zoning' },
    { key: 'scanning_overlays', label: 'Overlays' },
    { key: 'calculating', label: 'Analysis' },
  ];

  const phaseOrder: AnalysisPhase[] = [
    'idle', 'searching', 'fetching_parcel', 'checking_zoning', 'scanning_overlays', 'calculating', 'done',
  ];
  const currentIdx = phaseOrder.indexOf(phase);

  return (
    <div className="flex items-center gap-1 mb-3">
      {steps.map((step) => {
        const stepIdx = phaseOrder.indexOf(step.key);
        const isComplete = currentIdx > stepIdx;
        const isActive = currentIdx === stepIdx;
        return (
          <div key={step.key} className="flex items-center gap-1 flex-1">
            <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-[9px] font-medium transition-all duration-300 ${
              isComplete
                ? 'bg-emerald-100 text-emerald-700'
                : isActive
                ? 'bg-teal-100 text-teal-700'
                : 'bg-surface text-text-tertiary'
            }`}>
              {isComplete ? (
                <CheckCircle2 className="w-2.5 h-2.5" />
              ) : isActive ? (
                <Loader2 className="w-2.5 h-2.5 animate-spin" />
              ) : (
                <div className="w-2.5 h-2.5 rounded-full border border-current opacity-40" />
              )}
              {step.label}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export default function AgentMockup() {
  const [phase, setPhase] = useState<AnalysisPhase>('idle');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [searchValue, setSearchValue] = useState('');
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const analyserRef = useRef<HTMLDivElement>(null);

  const clearTimers = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  // Simulate the analysis pipeline with realistic timing
  const runAnalysis = useCallback((listing: MockListing, fromSearch = false) => {
    clearTimers();
    setResult(null);

    // Smooth scroll the analyser section into view
    setTimeout(() => {
      analyserRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);

    if (fromSearch) {
      setSearchValue(listing.fullAddress);
    }

    const phases: { phase: AnalysisPhase; delay: number }[] = [
      { phase: 'searching', delay: 0 },
      { phase: 'fetching_parcel', delay: 600 },
      { phase: 'checking_zoning', delay: 1400 },
      { phase: 'scanning_overlays', delay: 2200 },
      { phase: 'calculating', delay: 3000 },
      { phase: 'done', delay: 3800 },
    ];

    phases.forEach(({ phase: p, delay }) => {
      timerRef.current = setTimeout(() => {
        setPhase(p);
        if (p === 'done') {
          setResult({
            address: listing.fullAddress,
            lotArea: listing.lotArea,
            zone: listing.zone,
            overlays: listing.overlays,
            eligible: listing.eligible,
            maxLots: listing.maxLots,
            landValue: listing.landValue,
            uplift: listing.uplift,
            perLotValue: listing.perLotValue,
            tag: listing.tag,
          });
        }
      }, delay);
    });
  }, [clearTimers]);

  // Handle clicking a property card
  const handleCardClick = useCallback((index: number) => {
    setSelectedCard(index);
    runAnalysis(mockListings[index], false);
  }, [runAnalysis]);

  // Handle search submit
  const handleSearchSubmit = useCallback(() => {
    if (!searchValue.trim()) return;
    // Pick a random listing to simulate results for any address
    const randomListing = mockListings[Math.floor(Math.random() * mockListings.length)];
    const simulatedListing: MockListing = {
      ...randomListing,
      address: searchValue.split(',')[0] || searchValue,
      fullAddress: searchValue,
    };
    setSelectedCard(null);
    runAnalysis(simulatedListing, true);
  }, [searchValue, runAnalysis]);

  useEffect(() => {
    return clearTimers;
  }, [clearTimers]);

  const isAnalysing = phase !== 'idle' && phase !== 'done';

  return (
    <section className="section-padding bg-canvas">
      <Container variant="wide">
        <FadeIn>
          <div className="text-center mb-10">
            <span className="inline-block text-xs font-semibold tracking-[0.15em] uppercase text-casa-navy bg-casa-navy/5 px-3 py-1 rounded-full mb-4">
              Your Brand, Our <Brand>Intelligence</Brand>
            </span>
            <h2 className="font-serif text-3xl md:text-4xl text-text-primary mb-3">
              See how it works on your website
            </h2>
            <p className="text-base text-text-secondary max-w-2xl mx-auto">
              Try it yourself — click a listing or search any address. This is exactly what your
              clients see, white-labelled with your agency brand.
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={0.2}>
          <div className="max-w-5xl mx-auto">
            {/* Browser frame */}
            <div className="rounded-2xl border border-border shadow-elevated overflow-hidden bg-white">
              {/* Browser chrome */}
              <div className="flex items-center gap-2 px-4 py-3 bg-subtle border-b border-border/50">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400/60" />
                  <div className="w-3 h-3 rounded-full bg-amber-400/60" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400/60" />
                </div>
                <div className="flex-1 mx-4">
                  <div className="bg-white rounded-lg border border-border/50 px-4 py-1.5 text-xs text-text-tertiary">
                    coastalpropertygroup.com.au/development-intelligence
                  </div>
                </div>
              </div>

              {/* Agency header */}
              <div className="px-6 py-4 bg-white border-b border-border/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-teal-600 flex items-center justify-center">
                    <span className="text-white font-bold text-sm">CP</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-text-primary">Coastal Property Group</p>
                    <p className="text-[10px] text-text-tertiary">Development Intelligence Portal</p>
                  </div>
                </div>
                <div className="hidden sm:flex items-center gap-1 text-[10px] text-text-tertiary">
                  Powered by <Brand>Casa Intelligence</Brand>
                </div>
              </div>

              {/* Property tiles */}
              <div className="px-6 py-5 bg-canvas/50">
                <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-3">
                  Listed Properties — Click to analyse
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {mockListings.map((listing, index) => {
                    const isSelected = selectedCard === index;
                    return (
                      <motion.div
                        key={listing.address}
                        onClick={() => handleCardClick(index)}
                        className={`bg-white rounded-xl border p-4 cursor-pointer transition-colors duration-200 ${
                          isSelected
                            ? 'border-teal-400 ring-2 ring-teal-400/20 shadow-md'
                            : 'border-border/50 hover:shadow-md hover:border-teal-200'
                        }`}
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className={`w-full h-20 bg-gradient-to-br ${listing.image} rounded-lg mb-3 flex items-center justify-center relative overflow-hidden`}>
                          <Building2 className="w-6 h-6 text-teal-600/40" />
                          {isSelected && phase !== 'idle' && (
                            <motion.div
                              className="absolute inset-0 bg-teal-600/10"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: [0, 0.3, 0] }}
                              transition={{ duration: 1.5, repeat: Infinity }}
                            />
                          )}
                        </div>
                        <p className="text-xs font-medium text-text-primary truncate">{listing.address}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-sm font-serif font-bold text-teal-700">{listing.price}</span>
                          <span className="text-[10px] text-text-tertiary">{listing.area}</span>
                        </div>
                        <span className={`inline-block mt-2 text-[10px] font-medium px-2 py-0.5 rounded-full ${
                          listing.tag === 'Subdividable'
                            ? 'text-emerald-700 bg-emerald-50'
                            : 'text-amber-700 bg-amber-50'
                        }`}>
                          {listing.tag}
                        </span>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Interactive analyser section */}
              <div ref={analyserRef} className="px-6 py-5 border-t border-border/50">
                {/* Search bar */}
                <form
                  onSubmit={(e) => { e.preventDefault(); handleSearchSubmit(); }}
                  className="flex items-center gap-2 bg-surface rounded-xl border border-border px-4 py-3 mb-4 focus-within:ring-2 focus-within:ring-teal-400/20 focus-within:border-teal-300 transition-all"
                >
                  <Search className="w-4 h-4 text-text-tertiary flex-shrink-0" />
                  <input
                    type="text"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    placeholder="Enter any SEQ address to analyse..."
                    className="flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-tertiary outline-none"
                  />
                  {isAnalysing ? (
                    <Loader2 className="w-4 h-4 text-teal-600 animate-spin flex-shrink-0" />
                  ) : (
                    <button
                      type="submit"
                      className="text-[10px] font-semibold text-white bg-teal-600 hover:bg-teal-700 px-3 py-1.5 rounded-lg transition-colors flex-shrink-0"
                    >
                      Analyse
                    </button>
                  )}
                </form>

                {/* Progress steps */}
                <AnimatePresence>
                  {phase !== 'idle' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ProgressSteps phase={phase} />

                      {/* Loading status text */}
                      {isAnalysing && (
                        <motion.p
                          className="text-xs text-teal-600 mb-3 flex items-center gap-1.5"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          key={phase}
                        >
                          <Loader2 className="w-3 h-3 animate-spin" />
                          {PHASE_LABELS[phase]}
                        </motion.p>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Results panel */}
                <AnimatePresence mode="wait">
                  {phase === 'done' && result && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.4 }}
                    >
                      {/* Address header */}
                      <div className="flex items-start gap-2 mb-3">
                        <MapPin className="w-3.5 h-3.5 text-teal-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs font-semibold text-text-primary">{result.address}</p>
                          <p className="text-[10px] text-text-tertiary mt-0.5">{result.zone}</p>
                        </div>
                      </div>

                      {/* Parcel visualization + stats grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                        {/* Left: Parcel graphic */}
                        <ParcelGraphic lots={result.maxLots} phase={phase} />

                        {/* Right: Stats grid */}
                        <div className="grid grid-cols-2 gap-2">
                          <div className="bg-surface rounded-lg border border-border/50 p-3">
                            <div className="flex items-center gap-1.5 mb-1">
                              <MapPin className="w-3 h-3 text-teal-600" />
                              <p className="text-[9px] text-text-tertiary uppercase tracking-wider">Parcel</p>
                            </div>
                            <p className="text-xs font-semibold text-text-primary">
                              <CountUp value={result.lotArea} suffix="m²" />
                            </p>
                          </div>
                          <div className="bg-surface rounded-lg border border-border/50 p-3">
                            <div className="flex items-center gap-1.5 mb-1">
                              <Building2 className="w-3 h-3 text-teal-600" />
                              <p className="text-[9px] text-text-tertiary uppercase tracking-wider">Zone</p>
                            </div>
                            <p className="text-xs font-semibold text-text-primary truncate" title={result.zone}>
                              {result.zone.replace('Residential', 'Res.')}
                            </p>
                          </div>
                          <div className="bg-surface rounded-lg border border-border/50 p-3">
                            <div className="flex items-center gap-1.5 mb-1">
                              <Layers className="w-3 h-3 text-teal-600" />
                              <p className="text-[9px] text-text-tertiary uppercase tracking-wider">Overlays</p>
                            </div>
                            <p className="text-xs font-semibold text-text-primary">
                              {result.overlays.length}
                            </p>
                          </div>
                          <div className={`rounded-lg border p-3 ${
                            result.eligible
                              ? 'bg-emerald-50 border-emerald-200'
                              : 'bg-red-50 border-red-200'
                          }`}>
                            <div className="flex items-center gap-1.5 mb-1">
                              <Scissors className="w-3 h-3 text-emerald-600" />
                              <p className={`text-[9px] uppercase tracking-wider ${
                                result.eligible ? 'text-emerald-600' : 'text-red-600'
                              }`}>Eligible</p>
                            </div>
                            <p className={`text-xs font-semibold ${
                              result.eligible ? 'text-emerald-700' : 'text-red-700'
                            }`}>
                              {result.eligible ? `Yes — ${result.maxLots} lots` : 'No'}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Uplift banner */}
                      {result.eligible && result.uplift > 0 && (
                        <motion.div
                          className="bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-300 rounded-xl p-4 text-center"
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.3 }}
                        >
                          <p className="text-[10px] text-emerald-600 uppercase tracking-wider font-semibold mb-1">
                            Estimated Subdivision Uplift
                          </p>
                          <p className="text-2xl font-serif font-bold text-emerald-600">
                            +$<CountUp value={result.uplift} duration={1200} />
                          </p>
                          <div className="flex justify-center gap-6 mt-2 text-[10px] text-emerald-700">
                            <div>
                              <p className="text-[8px] text-emerald-500 uppercase">Land Value</p>
                              <p className="font-semibold">${(result.landValue / 1000).toFixed(0)}K</p>
                            </div>
                            <div>
                              <p className="text-[8px] text-emerald-500 uppercase">Per Lot</p>
                              <p className="font-semibold">${(result.perLotValue / 1000).toFixed(0)}K</p>
                            </div>
                            <div>
                              <p className="text-[8px] text-emerald-500 uppercase">Total After</p>
                              <p className="font-semibold">
                                ${((result.perLotValue * result.maxLots) / 1000).toFixed(0)}K
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {/* Mock CTA */}
                      <motion.div
                        className="mt-3 flex items-center gap-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                      >
                        <button className="flex-1 py-2.5 bg-teal-600 text-white text-xs font-semibold rounded-lg hover:bg-teal-700 transition-colors flex items-center justify-center gap-1.5">
                          <TrendingUp className="w-3.5 h-3.5" />
                          Get Full Report
                        </button>
                        <button className="py-2.5 px-4 bg-surface border border-border/50 text-xs font-semibold text-text-primary rounded-lg hover:bg-subtle transition-colors">
                          Contact Agent
                        </button>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Idle state */}
                {phase === 'idle' && (
                  <div className="text-center py-4">
                    <p className="text-xs text-text-tertiary">
                      Click a listed property above or search any address to see the analysis in action
                    </p>
                  </div>
                )}
              </div>

              {/* Footer callout */}
              <div className="px-6 py-3 bg-subtle border-t border-border/50 flex items-center justify-between">
                <p className="text-[10px] text-text-tertiary">
                  Fully white-labelled with your agency branding, colours, and domain
                </p>
                <span className="text-[10px] font-medium text-casa-navy bg-casa-navy/5 px-2.5 py-1 rounded-full">
                  Your Brand Here
                </span>
              </div>
            </div>
          </div>
        </FadeIn>
      </Container>
    </section>
  );
}
