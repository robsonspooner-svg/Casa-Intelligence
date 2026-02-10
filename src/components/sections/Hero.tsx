'use client';

import Brand from '@/components/brand/Brand';
import Button from '@/components/ui/Button';
import FadeIn from '@/components/ui/FadeIn';
import Container from '@/components/layout/Container';
import AnimatedContours from '@/components/hero/AnimatedContours';
import { ArrowRight, Phone, Search } from 'lucide-react';
import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center gradient-hero overflow-hidden">
      {/* Animated contour background */}
      <AnimatedContours />

      {/* Gradient orbs */}
      <div className="absolute top-1/4 -right-32 w-96 h-96 bg-casa-navy-light/20 rounded-full blur-[128px]" />
      <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-casa-navy-light/10 rounded-full blur-[128px]" />

      <Container variant="wide" className="relative z-10 py-32 md:py-40">
        <div className="max-w-4xl">
          <FadeIn delay={0.1}>
            <span className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-white/50 mb-6">
              Development <Brand>Intelligence</Brand>
            </span>
          </FadeIn>

          <FadeIn delay={0.2}>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-white leading-[1.1] text-balance mb-6">
              Development <Brand>intelligence</Brand>
              <br />
              <span className="text-white/60">that gives you an unfair advantage</span>
            </h1>
          </FadeIn>

          <FadeIn delay={0.35}>
            <p className="text-lg md:text-xl text-white/60 leading-relaxed max-w-2xl mb-10">
              Our proprietary system ingests planning schemes, overlays, market
              transactions, construction costs, and council patterns to produce
              insights no manual process can replicate. Every site assessed through
              hundreds of data points before you commit a dollar.
            </p>
          </FadeIn>

          <FadeIn delay={0.5}>
            <div className="flex flex-col sm:flex-row items-start gap-4 mb-12">
              <Button variant="primary" size="lg" href="/contact" className="bg-white text-casa-navy hover:bg-white/90">
                Book a Free Consultation
                <ArrowRight className="w-5 h-5" />
              </Button>
              <Button variant="outline" size="lg" href="tel:+61400000000">
                <Phone className="w-5 h-5" />
                0400 000 000
              </Button>
            </div>
          </FadeIn>

          {/* Site Analyser teaser */}
          <FadeIn delay={0.65}>
            <Link
              href="/site-analyser"
              className="group flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-2xl px-5 py-4 transition-all max-w-md"
            >
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0 group-hover:bg-white/20 transition-colors">
                <Search className="w-5 h-5 text-white/70" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white/90">
                  Preview our <Brand>intelligence</Brand> engine
                </p>
                <p className="text-xs text-white/40">
                  See a fraction of what our system can do. Free, for any Sunshine Coast address
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-white/30 group-hover:text-white/60 transition-colors flex-shrink-0" />
            </Link>
          </FadeIn>
        </div>

        {/* Scroll indicator */}
        <FadeIn delay={0.9} className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <div className="flex flex-col items-center gap-2">
            <span className="text-[10px] tracking-[0.2em] uppercase text-white/30">Scroll</span>
            <div className="w-px h-8 bg-gradient-to-b from-white/30 to-transparent" />
          </div>
        </FadeIn>
      </Container>
    </section>
  );
}
