'use client';

import Brand from '@/components/brand/Brand';
import Container from '@/components/layout/Container';
import FadeIn from '@/components/ui/FadeIn';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function AgentHeroSection() {
  return (
    <section className="gradient-hero pt-28 pb-16 md:pt-36 md:pb-24 relative overflow-hidden">
      <div className="absolute top-1/4 -right-32 w-96 h-96 bg-casa-navy-light/20 rounded-full blur-[128px]" />
      <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-casa-navy-light/10 rounded-full blur-[128px]" />

      <Container variant="wide" className="relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <FadeIn delay={0.1}>
            <span className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-white/50 mb-4">
              White-Label <Brand>Intelligence</Brand>
            </span>
          </FadeIn>

          <FadeIn delay={0.2}>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white leading-tight mb-5">
              Give your clients development <Brand>intelligence</Brand>
            </h1>
          </FadeIn>

          <FadeIn delay={0.35}>
            <p className="text-lg md:text-xl text-white/60 leading-relaxed max-w-2xl mx-auto mb-8">
              Embed our subdivision and development feasibility tools on your agency
              website. Capture qualified leads, differentiate your brand, and give
              every listing instant development insight.
            </p>
          </FadeIn>

          <FadeIn delay={0.5}>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 text-base font-medium rounded-2xl bg-white text-casa-navy hover:bg-white/90 transition-colors shadow-lg"
            >
              Book a Demo <ArrowRight className="w-5 h-5" />
            </Link>
          </FadeIn>
        </div>
      </Container>
    </section>
  );
}
