'use client';

import Brand from '@/components/brand/Brand';
import Container from '@/components/layout/Container';
import FadeIn from '@/components/ui/FadeIn';
import { Building2, MapPin, Search, BarChart3 } from 'lucide-react';

const mockListings = [
  { address: '14 Coral Street, Maroochydore', price: '$1,250,000', area: '810m²', tag: 'Subdividable' },
  { address: '7 Palm Avenue, Buderim', price: '$985,000', area: '650m²', tag: 'Development Potential' },
  { address: '22 Banksia Drive, Caloundra', price: '$1,680,000', area: '1,120m²', tag: 'Subdividable' },
];

export default function AgentMockup() {
  return (
    <section className="section-padding bg-canvas">
      <Container variant="wide">
        <FadeIn>
          <div className="text-center mb-10">
            <span className="inline-block text-xs font-semibold tracking-[0.15em] uppercase text-casa-navy bg-casa-navy/5 px-3 py-1 rounded-full mb-4">
              Your Brand, Our <Brand>Intelligence</Brand>
            </span>
            <h2 className="font-serif text-3xl md:text-4xl text-text-primary mb-3">
              See how it looks on your website
            </h2>
            <p className="text-base text-text-secondary max-w-2xl mx-auto">
              The full Site Analyser, embedded in your agency website with your branding.
              Every visitor who searches an address becomes a qualified lead.
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
                  {mockListings.map((listing) => (
                    <div
                      key={listing.address}
                      className="bg-white rounded-xl border border-border/50 p-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
                    >
                      <div className="w-full h-20 bg-gradient-to-br from-teal-50 to-teal-100 rounded-lg mb-3 flex items-center justify-center">
                        <Building2 className="w-6 h-6 text-teal-600/40" />
                      </div>
                      <p className="text-xs font-medium text-text-primary truncate">{listing.address}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm font-serif font-bold text-teal-700">{listing.price}</span>
                        <span className="text-[10px] text-text-tertiary">{listing.area}</span>
                      </div>
                      <span className="inline-block mt-2 text-[10px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                        {listing.tag}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mini analyser preview */}
              <div className="px-6 py-5 border-t border-border/50">
                <div className="flex items-center gap-2 bg-surface rounded-xl border border-border px-4 py-3 mb-4">
                  <Search className="w-4 h-4 text-text-tertiary" />
                  <span className="text-sm text-text-tertiary flex-1">Enter any SEQ address...</span>
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-surface rounded-lg border border-border/50 p-3">
                    <div className="flex items-center gap-1.5 mb-1">
                      <MapPin className="w-3 h-3 text-teal-600" />
                      <p className="text-[9px] text-text-tertiary uppercase tracking-wider">Parcel</p>
                    </div>
                    <p className="text-xs font-semibold text-text-primary">810m²</p>
                  </div>
                  <div className="bg-surface rounded-lg border border-border/50 p-3">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Building2 className="w-3 h-3 text-teal-600" />
                      <p className="text-[9px] text-text-tertiary uppercase tracking-wider">Zone</p>
                    </div>
                    <p className="text-xs font-semibold text-text-primary">Low Density</p>
                  </div>
                  <div className="bg-surface rounded-lg border border-border/50 p-3">
                    <div className="flex items-center gap-1.5 mb-1">
                      <BarChart3 className="w-3 h-3 text-teal-600" />
                      <p className="text-[9px] text-text-tertiary uppercase tracking-wider">Eligible</p>
                    </div>
                    <p className="text-xs font-semibold text-emerald-600">Yes — 2 lots</p>
                  </div>
                  <div className="bg-emerald-50 rounded-lg border border-emerald-200 p-3">
                    <div className="flex items-center gap-1.5 mb-1">
                      <BarChart3 className="w-3 h-3 text-emerald-600" />
                      <p className="text-[9px] text-emerald-600 uppercase tracking-wider">Uplift</p>
                    </div>
                    <p className="text-xs font-bold text-emerald-700">+$487,000</p>
                  </div>
                </div>
              </div>

              {/* "Your brand here" callout */}
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
