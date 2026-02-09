'use client';

import FadeIn from '@/components/ui/FadeIn';
import SectionHeading from '@/components/ui/SectionHeading';
import Container from '@/components/layout/Container';
import { FileSearch, MessageSquare, Route, Send } from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: MessageSquare,
    title: 'Enquire',
    description:
      'Tell us about your site. A quick call or email is all we need to understand your goals and assess whether a feasibility study is worthwhile.',
  },
  {
    number: '02',
    icon: FileSearch,
    title: 'Site Assessment',
    description:
      'We analyse planning overlays, site constraints, infrastructure capacity, and market context to build a complete picture of your site.',
  },
  {
    number: '03',
    icon: Send,
    title: 'Feasibility Report',
    description:
      'Receive a comprehensive report covering planning, architecture, and financial viability — with clear recommendations on your best path forward.',
  },
  {
    number: '04',
    icon: Route,
    title: 'Development Pathway',
    description:
      'We present your options. If the numbers work and you want to proceed, we can manage the entire pre-development process for you.',
  },
];

export default function Process() {
  return (
    <section className="section-padding gradient-navy text-white overflow-hidden">
      <Container>
        <SectionHeading
          badge="Our Process"
          title="Four steps to knowing your site's potential"
          light
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
          {steps.map((step, index) => (
            <FadeIn key={step.title} delay={index * 0.15}>
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
