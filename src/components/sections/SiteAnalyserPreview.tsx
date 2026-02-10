'use client';

import Brand from '@/components/brand/Brand';
import FadeIn from '@/components/ui/FadeIn';
import Container from '@/components/layout/Container';
import Button from '@/components/ui/Button';
import { ArrowRight, Layers, MapPin, Building2, BarChart3 } from 'lucide-react';
import Link from 'next/link';

const features = [
  {
    key: 'cadastral',
    icon: MapPin,
    title: <>Cadastral <Brand>Intelligence</Brand></>,
    description: 'Real-time boundary, lot, and parcel data from government databases',
  },
  {
    key: 'constraint',
    icon: Layers,
    title: 'Constraint Detection',
    description: 'Flood, bushfire, heritage, and height limits, auto-identified and costed',
  },
  {
    key: 'yield',
    icon: Building2,
    title: 'Yield Modelling',
    description: 'Interactive building mass calibrated to site geometry and setbacks',
  },
  {
    key: 'financial',
    icon: BarChart3,
    title: <>Financial <Brand>Intelligence</Brand></>,
    description: 'Cost and revenue estimates from our proprietary market pricing models',
  },
];

export default function SiteAnalyserPreview() {
  return (
    <section className="section-padding bg-canvas relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, #1B1464 1px, transparent 0)`,
        backgroundSize: '24px 24px',
      }} />

      <Container variant="wide" className="relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Content */}
          <div>
            <FadeIn>
              <span className="inline-block text-xs font-semibold tracking-[0.15em] uppercase text-casa-navy bg-casa-navy/5 px-3 py-1 rounded-full mb-4">
                <Brand>Intelligence</Brand> Preview
              </span>
            </FadeIn>

            <FadeIn delay={0.1}>
              <h2 className="font-serif text-3xl md:text-4xl lg:text-[42px] leading-tight text-text-primary mb-4">
                A glimpse of the full system
              </h2>
            </FadeIn>

            <FadeIn delay={0.2}>
              <p className="text-lg text-text-secondary leading-relaxed mb-8">
                Our public Site Analyser queries live government databases and applies a subset
                of our proprietary intelligence models. Real-time zoning analysis, overlay
                detection, 3D massing, and preliminary feasibility: a taste of what our
                full engine delivers. No login required.
              </p>
            </FadeIn>

            <FadeIn delay={0.3}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {features.map((feature, i) => (
                  <div key={feature.key} className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-casa-navy/5 flex items-center justify-center flex-shrink-0">
                      <feature.icon className="w-4.5 h-4.5 text-casa-navy" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-text-primary">{feature.title}</p>
                      <p className="text-xs text-text-tertiary leading-relaxed mt-0.5">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </FadeIn>

            <FadeIn delay={0.4}>
              <Button href="/site-analyser" size="lg">
                Try the Site Analyser, Free
                <ArrowRight className="w-5 h-5" />
              </Button>
            </FadeIn>
          </div>

          {/* Right: Visual preview */}
          <FadeIn delay={0.2} direction="right">
            <Link href="/site-analyser" className="block group">
              <div className="bg-surface rounded-card border border-border/50 shadow-card group-hover:shadow-card-hover transition-shadow overflow-hidden">
                {/* Fake analyser preview */}
                <div className="bg-casa-navy/[0.03] p-6">
                  {/* Mini search bar */}
                  <div className="flex items-center gap-3 bg-white rounded-xl border border-border px-4 py-3 shadow-sm mb-5">
                    <MapPin className="w-4 h-4 text-casa-navy" />
                    <span className="text-sm text-text-tertiary">Enter a Sunshine Coast address...</span>
                  </div>

                  {/* Mini result cards */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white rounded-xl border border-border/50 p-4">
                      <p className="text-[10px] text-text-tertiary uppercase tracking-wider mb-1">Zone</p>
                      <p className="text-sm font-serif font-semibold text-casa-navy">Medium Density Residential</p>
                    </div>
                    <div className="bg-white rounded-xl border border-border/50 p-4">
                      <p className="text-[10px] text-text-tertiary uppercase tracking-wider mb-1">Overlays</p>
                      <p className="text-sm font-serif font-semibold text-emerald-600">0 constraints</p>
                    </div>
                  </div>
                </div>

                {/* 3D preview placeholder */}
                <div className="relative h-48 bg-gradient-to-b from-[#f8f7f5] to-[#f0eeea] flex items-center justify-center">
                  {/* Decorative building shapes */}
                  <div className="flex items-end gap-2">
                    <div className="w-12 h-20 bg-casa-navy/80 rounded-t-sm" />
                    <div className="w-16 h-28 bg-casa-navy rounded-t-sm" />
                    <div className="w-10 h-16 bg-casa-navy/70 rounded-t-sm" />
                    <div className="w-14 h-24 bg-casa-navy/85 rounded-t-sm" />
                  </div>
                  {/* Ground line */}
                  <div className="absolute bottom-0 left-0 right-0 h-px bg-border" />
                  <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-[#e8e5dc]/50 to-transparent" />
                </div>

                {/* Bottom bar */}
                <div className="px-6 py-4 bg-white border-t border-border/50 flex items-center justify-between">
                  <span className="text-xs font-medium text-text-secondary">Preview the <Brand>intelligence</Brand>. Instant results</span>
                  <ArrowRight className="w-4 h-4 text-casa-navy group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          </FadeIn>
        </div>
      </Container>
    </section>
  );
}
