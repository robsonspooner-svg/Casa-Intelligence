'use client';

import Brand from '@/components/brand/Brand';
import AnimatedCounter from '@/components/ui/AnimatedCounter';
import FadeIn from '@/components/ui/FadeIn';
import SectionHeading from '@/components/ui/SectionHeading';
import Container from '@/components/layout/Container';
import { AlertTriangle } from 'lucide-react';

const stats = [
  {
    value: 84800,
    suffix: '',
    label: 'New dwellings required',
    detail: 'Sunshine Coast by 2046',
  },
  {
    value: 60,
    suffix: '%',
    label: 'Must be infill development',
    detail: 'Existing urban sites to be redeveloped',
  },
  {
    value: 76,
    suffix: '%',
    label: 'Price growth in 5 years',
    detail: 'Land values rising faster than builds',
  },
  {
    value: 1.08,
    suffix: 'M',
    prefix: '$',
    label: 'Median house price',
    detail: 'And climbing. Development demand is real',
  },
];

export default function MarketContext() {
  return (
    <section className="section-padding bg-canvas">
      <Container variant="wide">
        <SectionHeading
          badge={<>Market <Brand>Intelligence</Brand></>}
          title="This opportunity won't last forever"
          subtitle={<>Our market <Brand>intelligence</Brand> system tracks these dynamics in real-time so you can act on data, not speculation. Planning windows close, land values rise, and the developers who move on <Brand>intelligence</Brand> capture the best margins.</>}
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
          <div className="max-w-3xl mx-auto">
            <div className="bg-warm border border-gold/20 rounded-card p-6 md:p-8">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <h3 className="font-semibold text-text-primary mb-2">
                    What our data shows about inaction
                  </h3>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    Every month you delay, land prices increase, construction costs rise,
                    and competing developers lock in the best sites. A feasibility assessment
                    today gives you the intelligence to act decisively, or to avoid a costly
                    mistake. Either way, you&apos;re better off knowing.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </FadeIn>
      </Container>
    </section>
  );
}
