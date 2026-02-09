'use client';

import Button from '@/components/ui/Button';
import FadeIn from '@/components/ui/FadeIn';
import Container from '@/components/layout/Container';
import { ArrowRight, Phone } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center gradient-hero overflow-hidden">
      {/* Subtle geometric pattern overlay */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      {/* Gradient orbs */}
      <div className="absolute top-1/4 -right-32 w-96 h-96 bg-casa-navy-light/20 rounded-full blur-[128px]" />
      <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-casa-navy-light/10 rounded-full blur-[128px]" />

      <Container className="relative z-10 py-32 md:py-40">
        <div className="max-w-4xl">
          <FadeIn delay={0.1}>
            <span className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-white/50 mb-6">
              Sunshine Coast Development Advisory
            </span>
          </FadeIn>

          <FadeIn delay={0.2}>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-white leading-[1.1] text-balance mb-6">
              Development Intelligence
              <br />
              <span className="text-white/60">for the Sunshine Coast</span>
            </h1>
          </FadeIn>

          <FadeIn delay={0.35}>
            <p className="text-lg md:text-xl text-white/60 leading-relaxed max-w-2xl mb-10">
              Planning, architecture, and financial feasibility — integrated
              into one report. Know what your site can do before you spend a
              dollar.
            </p>
          </FadeIn>

          <FadeIn delay={0.5}>
            <div className="flex flex-col sm:flex-row items-start gap-4">
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
        </div>

        {/* Scroll indicator */}
        <FadeIn delay={0.8} className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <div className="flex flex-col items-center gap-2">
            <span className="text-[10px] tracking-[0.2em] uppercase text-white/30">Scroll</span>
            <div className="w-px h-8 bg-gradient-to-b from-white/30 to-transparent" />
          </div>
        </FadeIn>
      </Container>
    </section>
  );
}
