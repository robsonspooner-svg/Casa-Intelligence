'use client';

import Brand from '@/components/brand/Brand';
import AnimatedCounter from '@/components/ui/AnimatedCounter';
import FadeIn from '@/components/ui/FadeIn';
import Container from '@/components/layout/Container';
import { Database, BarChart3, Zap } from 'lucide-react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const stats = [
  {
    value: 200,
    suffix: '+',
    label: 'Data points per assessment',
    detail: 'Every site analysed across planning, market, and cost dimensions',
  },
  {
    value: 12,
    suffix: '',
    label: 'Government & market sources',
    detail: 'Planning schemes, overlays, transactions, cost indices',
  },
  {
    value: 3400,
    suffix: '+',
    label: 'Planning provisions indexed',
    detail: 'Sunshine Coast planning scheme fully mapped',
  },
  {
    value: 24,
    suffix: 'hr',
    label: 'Data refresh cycle',
    detail: 'Market and regulatory data continuously updated',
  },
];

const capabilities = [
  {
    key: 'planning',
    icon: Database,
    title: <>Planning <Brand>Intelligence</Brand></>,
    description:
      'Every overlay, every provision, every council precedent \u2014 continuously indexed and cross-referenced. We know what gets approved, what gets refused, and why.',
  },
  {
    key: 'market',
    icon: BarChart3,
    title: <>Market <Brand>Intelligence</Brand></>,
    description:
      'Real-time construction cost tracking, comparable sale analysis, and suburb-level pricing models. Our revenue projections are calibrated to actual transaction data.',
  },
  {
    key: 'predictive',
    icon: Zap,
    title: 'Predictive Analysis',
    description:
      'Our system identifies risk factors and opportunity signals that manual analysis misses. Flood interactions, height limit edge cases, infrastructure capacity \u2014 all quantified before you commit.',
  },
];

export default function IntelligenceEngine() {
  return (
    <section className="section-padding gradient-navy text-white relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute top-1/4 -right-48 w-96 h-96 bg-white/[0.02] rounded-full blur-[100px]" />
      <div className="absolute bottom-1/3 -left-48 w-80 h-80 bg-white/[0.02] rounded-full blur-[100px]" />

      <Container variant="wide" className="relative">
        <FadeIn>
          <div className="text-center mb-16">
            <span className="inline-block text-xs font-semibold tracking-[0.15em] uppercase text-white/50 bg-white/5 px-3 py-1 rounded-full mb-4">
              Our Edge
            </span>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-[42px] leading-tight text-white mb-4">
              The <Brand>intelligence</Brand> behind every assessment
            </h2>
            <p className="text-lg text-white/50 max-w-2xl mx-auto leading-relaxed">
              We built a proprietary analytical engine that ingests, cross-references, and analyses development
              data at a scale no manual process can match. This is what powers every recommendation we make.
            </p>
          </div>
        </FadeIn>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto mb-16">
          {stats.map((stat, index) => (
            <FadeIn key={stat.label} delay={index * 0.1}>
              <div className="text-center">
                <div className="font-serif text-3xl md:text-4xl lg:text-5xl text-white mb-2">
                  <AnimatedCounter
                    target={stat.value}
                    suffix={stat.suffix}
                  />
                </div>
                <p className="text-sm font-semibold text-white/80 mb-1">
                  {stat.label}
                </p>
                <p className="text-xs text-white/40">{stat.detail}</p>
              </div>
            </FadeIn>
          ))}
        </div>

        {/* Capability cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12">
          {capabilities.map((cap, i) => (
            <FadeIn key={cap.key} delay={0.4 + i * 0.1}>
              <div className="bg-white/[0.04] border border-white/[0.08] rounded-card p-6 hover:bg-white/[0.06] transition-colors h-full">
                <div className="w-10 h-10 rounded-xl bg-white/[0.06] flex items-center justify-center mb-4">
                  <cap.icon className="w-5 h-5 text-white/70" />
                </div>
                <h3 className="text-base font-semibold text-white mb-2">{cap.title}</h3>
                <p className="text-sm text-white/40 leading-relaxed">{cap.description}</p>
              </div>
            </FadeIn>
          ))}
        </div>

        {/* Bottom CTA */}
        <FadeIn delay={0.7}>
          <div className="text-center">
            <p className="text-sm text-white/40 mb-6 max-w-xl mx-auto">
              The Site Analyser you can try for free uses a fraction of this system.
              Our full assessments deploy the complete intelligence engine.
            </p>
            <Link
              href="/site-analyser"
              className="inline-flex items-center gap-2 text-sm font-medium text-white/70 hover:text-white transition-colors"
            >
              Try the Site Analyser
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </FadeIn>
      </Container>
    </section>
  );
}
