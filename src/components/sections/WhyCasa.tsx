'use client';

import FadeIn from '@/components/ui/FadeIn';
import SectionHeading from '@/components/ui/SectionHeading';
import Container from '@/components/layout/Container';
import { Check, Clock, DollarSign, MapPin, X } from 'lucide-react';

const comparisons = [
  {
    icon: Check,
    label: 'Scope',
    traditional: '3 separate consultants — planner, architect, quantity surveyor',
    casa: 'One integrated report covering all three disciplines',
  },
  {
    icon: Clock,
    label: 'Timeline',
    traditional: '4–8 weeks to coordinate and compile',
    casa: '5–7 business days',
  },
  {
    icon: DollarSign,
    label: 'Cost',
    traditional: '$30,000–$50,000 across three consultants',
    casa: '$8,000–$25,000 for a complete feasibility',
  },
  {
    icon: MapPin,
    label: 'Local Expertise',
    traditional: 'Generic interstate consultants unfamiliar with local council',
    casa: 'Sunshine Coast specialists with deep local knowledge',
  },
];

export default function WhyCasa() {
  return (
    <section className="section-padding bg-surface">
      <Container>
        <SectionHeading
          badge="Why Us"
          title="One team. One report. One week."
          subtitle="Traditional feasibility requires three separate consultants, weeks of coordination, and tens of thousands of dollars. We do it better."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {comparisons.map((item, index) => (
            <FadeIn key={item.label} delay={index * 0.1}>
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
