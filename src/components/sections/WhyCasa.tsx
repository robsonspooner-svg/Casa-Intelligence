'use client';

import Brand from '@/components/brand/Brand';
import FadeIn from '@/components/ui/FadeIn';
import SectionHeading from '@/components/ui/SectionHeading';
import Container from '@/components/layout/Container';
import { Check, Clock, DollarSign, MapPin, X } from 'lucide-react';

const comparisons = [
  {
    key: 'depth',
    icon: Check,
    label: 'Analysis Depth',
    traditional: '3 consultants producing disconnected reports from manual desktop reviews',
    casa: 'One integrated analysis powered by our proprietary intelligence engine',
  },
  {
    key: 'data',
    icon: Clock,
    label: 'Data Processing',
    traditional: 'Manual review of planning documents and market reports, often weeks of lag',
    casa: 'Automated ingestion of planning schemes, overlays, market data, and council decision patterns',
  },
  {
    key: 'cost',
    icon: DollarSign,
    label: 'Cost & Speed',
    traditional: '$30,000–$50,000 across three consultants over 4–8 weeks',
    casa: '$8,000–$25,000 in 5–7 business days. Our engine pre-processes before an analyst begins',
  },
  {
    key: 'local',
    icon: MapPin,
    label: <>Local <Brand>Intelligence</Brand></>,
    traditional: 'Generic interstate consultants with no local data advantage',
    casa: 'Deep Sunshine Coast knowledge amplified by a continuously learning data engine',
  },
];

export default function WhyCasa() {
  return (
    <section className="section-padding bg-surface">
      <Container variant="wide">
        <SectionHeading
          badge="Why Us"
          title={<>Why our <Brand>intelligence</Brand> is different</>}
          subtitle={<>Traditional advisory relies on experience and intuition. We augment deep local expertise with a proprietary <Brand>intelligence</Brand> engine that processes hundreds of data points per site.</>}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {comparisons.map((item, index) => (
            <FadeIn key={item.key} delay={index * 0.1}>
              <div className="bg-canvas rounded-card p-6 border border-border/50">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-casa-navy/5 flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-casa-navy" />
                  </div>
                  <h3 className="font-semibold text-text-primary">{item.label}</h3>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <X className="w-3 h-3 text-red-400" />
                    </div>
                    <p className="text-sm text-text-tertiary leading-relaxed">
                      {item.traditional}
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-emerald-500" />
                    </div>
                    <p className="text-sm text-text-primary font-medium leading-relaxed">
                      {item.casa}
                    </p>
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </Container>
    </section>
  );
}
