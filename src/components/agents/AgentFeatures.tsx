'use client';

import Brand from '@/components/brand/Brand';
import Container from '@/components/layout/Container';
import FadeIn from '@/components/ui/FadeIn';
import { Target, Brain, Award } from 'lucide-react';

const features = [
  {
    icon: Target,
    title: 'Lead Generation',
    description:
      'Every visitor who searches an address is a qualified lead. Capture interest from property owners exploring their development potential before they leave your website.',
  },
  {
    icon: Brain,
    title: <>Client <Brand>Intelligence</Brand></>,
    description:
      'Listed property analysis generates instant development insights. Help vendors and buyers understand true site potential with real government data, not guesswork.',
  },
  {
    icon: Award,
    title: 'Brand Differentiation',
    description:
      'Be the only agency in your market offering AI-powered development intelligence. Stand out from every competitor with tools that demonstrate genuine expertise.',
  },
];

export default function AgentFeatures() {
  return (
    <section className="section-padding bg-surface">
      <Container variant="wide">
        <FadeIn>
          <div className="text-center mb-10">
            <h2 className="font-serif text-3xl md:text-4xl text-text-primary mb-3">
              Why agents choose <Brand>Casa Intelligence</Brand>
            </h2>
            <p className="text-base text-text-secondary max-w-2xl mx-auto">
              Turn your website from a static brochure into an active lead generation
              machine that demonstrates your development expertise.
            </p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {features.map((feature, i) => (
            <FadeIn key={i} delay={0.1 + i * 0.1}>
              <div className="bg-canvas rounded-xl border border-border/50 p-6 h-full">
                <div className="w-12 h-12 rounded-xl bg-casa-navy/5 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-casa-navy" />
                </div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">{feature.title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{feature.description}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </Container>
    </section>
  );
}
