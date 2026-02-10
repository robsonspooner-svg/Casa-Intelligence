'use client';

import Brand from '@/components/brand/Brand';
import FadeIn from '@/components/ui/FadeIn';
import SectionHeading from '@/components/ui/SectionHeading';
import Container from '@/components/layout/Container';
import { FileSearch, MessageSquare, Route, Send } from 'lucide-react';

const steps = [
  {
    key: 'enquire',
    number: '01',
    icon: MessageSquare,
    title: 'Enquire',
    description:
      'Tell us about your site. Our system begins processing immediately \u2014 pulling planning data, overlays, and market intelligence before our first conversation.',
  },
  {
    key: 'intelligence',
    number: '02',
    icon: FileSearch,
    title: <><Brand>Intelligence</Brand> Gathering</>,
    description:
      'Our intelligence engine cross-references planning provisions, overlay interactions, construction cost benchmarks, and comparable transactions to build a comprehensive site intelligence profile.',
  },
  {
    key: 'analysis',
    number: '03',
    icon: Send,
    title: 'Analysis & Insight',
    description:
      'Our analysts apply deep local expertise to the engine\u2019s output \u2014 validating findings, identifying nuances the data can\u2019t capture, and producing a decisive recommendation.',
  },
  {
    key: 'pathway',
    number: '04',
    icon: Route,
    title: 'Development Pathway',
    description:
      'Armed with intelligence no other firm can produce, you move forward with conviction \u2014 or walk away early, with clarity.',
  },
];

export default function Process() {
  return (
    <section className="section-padding gradient-navy text-white overflow-hidden">
      <Container variant="wide">
        <SectionHeading
          badge="Our Process"
          title="Four steps to knowing your site's potential"
          light
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
          {steps.map((step, index) => (
            <FadeIn key={step.key} delay={index * 0.15}>
              <div className="relative">
                {/* Connector line (desktop only) */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-[calc(100%+4px)] w-[calc(100%-32px)] h-px bg-white/10" />
                )}

                <div className="mb-5">
                  <span className="text-xs font-mono text-white/30 tracking-wider">
                    {step.number}
                  </span>
                </div>

                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-5">
                  <step.icon className="w-6 h-6 text-white/70" />
                </div>

                <h3 className="font-serif text-xl text-white mb-3">{step.title}</h3>
                <p className="text-sm text-white/50 leading-relaxed">{step.description}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </Container>
    </section>
  );
}
