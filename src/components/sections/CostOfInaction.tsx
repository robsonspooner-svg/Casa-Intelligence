'use client';

import FadeIn from '@/components/ui/FadeIn';
import Container from '@/components/layout/Container';
import Button from '@/components/ui/Button';
import { ArrowRight, TrendingDown, Clock, XCircle, AlertTriangle } from 'lucide-react';

const costs = [
  {
    icon: TrendingDown,
    amount: '$50K–$80K',
    title: 'Lost on a site that was never feasible',
    description:
      'Without proper feasibility analysis, developers commit to sites that cannot deliver a viable return. By the time the numbers are clear, deposits are paid and consultants are engaged.',
  },
  {
    icon: Clock,
    amount: '12–18 months',
    title: 'Wasted on a DA that gets refused',
    description:
      'An application lodged without understanding the planning scheme, overlays, and council expectations is an application that gets sent back or refused outright.',
  },
  {
    icon: XCircle,
    amount: '$30K–$50K',
    title: 'Spent on consultants who don\'t coordinate',
    description:
      'Engaging a planner, architect, and surveyor separately means paying three firms to produce reports that don\'t speak to each other. Rework and misalignment are inevitable.',
  },
  {
    icon: AlertTriangle,
    amount: '20–40%',
    title: 'Development margin eroded by the unexpected',
    description:
      'Flood overlays, heritage constraints, insufficient infrastructure: each one adds cost and delays. Developers who discover these mid-project rarely recover their projected returns.',
  },
];

export default function CostOfInaction() {
  return (
    <section className="section-padding gradient-navy relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute top-1/3 -right-48 w-96 h-96 bg-white/[0.02] rounded-full blur-[100px]" />
      {/* Watermark C */}
      <div className="absolute -bottom-16 -right-8 text-[280px] font-logo font-medium text-white opacity-[0.025] leading-none select-none pointer-events-none" aria-hidden="true">
        C
      </div>

      <Container variant="wide" className="relative">
        <FadeIn>
          <div className="text-center mb-16">
            <span className="inline-block text-xs font-semibold tracking-[0.15em] uppercase text-white/50 bg-white/5 px-3 py-1 rounded-full mb-4">
              The Cost of Doing Nothing
            </span>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-[42px] leading-tight text-white mb-4">
              What does inaction actually cost?
            </h2>
            <p className="text-lg text-white/50 max-w-2xl mx-auto leading-relaxed">
              Our data shows that the majority of development losses aren&apos;t caused by bad sites.
              They&apos;re caused by inadequate intelligence at the decision point.
            </p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto mb-12">
          {costs.map((cost, i) => (
            <FadeIn key={cost.title} delay={i * 0.1}>
              <div className="bg-white/[0.04] border border-white/[0.08] rounded-card p-6 hover:bg-white/[0.06] transition-colors h-full">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-white/[0.06] flex items-center justify-center">
                    <cost.icon className="w-5 h-5 text-white/60" />
                  </div>
                  <span className="text-2xl font-serif font-bold text-gold">{cost.amount}</span>
                </div>
                <h3 className="text-base font-semibold text-white mb-2">{cost.title}</h3>
                <p className="text-sm text-white/40 leading-relaxed">{cost.description}</p>
              </div>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={0.5}>
          <div className="text-center">
            <p className="text-sm text-white/40 mb-6 max-w-xl mx-auto">
              Our intelligence engine identifies these risks before you commit a dollar. The cost
              of our assessment is a fraction of a single mistake.
            </p>
            <Button
              href="/contact"
              size="lg"
              className="bg-white text-casa-navy hover:bg-white/90"
            >
              Protect Your Investment
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </FadeIn>
      </Container>
    </section>
  );
}
