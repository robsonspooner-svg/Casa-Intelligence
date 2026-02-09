'use client';

import AnimatedCounter from '@/components/ui/AnimatedCounter';
import FadeIn from '@/components/ui/FadeIn';
import SectionHeading from '@/components/ui/SectionHeading';
import Container from '@/components/layout/Container';

const stats = [
  {
    value: 84800,
    suffix: '',
    label: 'New dwellings needed',
    detail: 'Sunshine Coast by 2046',
  },
  {
    value: 60,
    suffix: '%',
    label: 'Infill development target',
    detail: 'Of new housing must be infill',
  },
  {
    value: 76,
    suffix: '%',
    label: 'Price growth (5 years)',
    detail: 'Median house price increase',
  },
  {
    value: 1.08,
    suffix: 'M',
    prefix: '$',
    label: 'Median house price',
    detail: 'Sunshine Coast 2025',
  },
];

export default function MarketContext() {
  return (
    <section className="section-padding bg-canvas">
      <Container>
        <SectionHeading
          badge="The Opportunity"
          title="South East Queensland is booming"
          subtitle="The Sunshine Coast must deliver tens of thousands of new dwellings over the next two decades. A new planning scheme has unlocked development potential across the region."
        />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 max-w-5xl mx-auto mb-16">
          {stats.map((stat, index) => (
            <FadeIn key={stat.label} delay={index * 0.1}>
              <div className="text-center">
                <div className="font-serif text-3xl md:text-4xl lg:text-5xl text-casa-navy mb-2">
                  <AnimatedCounter
                    target={stat.value}
                    suffix={stat.suffix}
                    prefix={stat.prefix}
                  />
                </div>
                <p className="text-sm font-semibold text-text-primary mb-1">
                  {stat.label}
                </p>
                <p className="text-xs text-text-tertiary">{stat.detail}</p>
              </div>
            </FadeIn>
          ))}
        </div>

        <FadeIn>
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-text-secondary leading-relaxed">
              The convergence of population growth, planning reform, and supply constraints
              has created one of the most active development markets in Australia. Casa
              Intelligence exists to help landowners and developers navigate this opportunity
              with clarity and confidence.
            </p>
          </div>
        </FadeIn>
      </Container>
    </section>
  );
}
