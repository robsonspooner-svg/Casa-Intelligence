'use client';

import Card from '@/components/ui/Card';
import FadeIn from '@/components/ui/FadeIn';
import SectionHeading from '@/components/ui/SectionHeading';
import Container from '@/components/layout/Container';
import { ArrowRight, ClipboardCheck, Layers, TrendingUp } from 'lucide-react';
import Link from 'next/link';

const services = [
  {
    icon: ClipboardCheck,
    title: 'Development Feasibility Reports',
    price: 'From $8,000',
    description:
      'Comprehensive planning, architectural, and financial analysis for your site. Delivered in 5–7 business days.',
    features: [
      'Planning overlay analysis',
      'Architectural yield studies',
      'Financial pro forma modelling',
      'Risk and constraint mapping',
    ],
    href: '/services#feasibility',
  },
  {
    icon: Layers,
    title: 'Pre-Development Management',
    price: '3–5% of development cost',
    description:
      'End-to-end management from site acquisition through to DA approval. We handle the complexity so you can focus on the deal.',
    features: [
      'Consultant coordination',
      'Council liaison and advocacy',
      'DA preparation and lodgement',
      'Timeline and budget management',
    ],
    href: '/services#management',
  },
  {
    icon: TrendingUp,
    title: 'Proprietary Development',
    price: 'Joint Ventures',
    badge: 'Coming 2027',
    description:
      'Joint ventures and proprietary development on high-potential sites identified through our advisory work.',
    features: [
      'Site identification and acquisition',
      'Capital structuring',
      'Development delivery',
      'Profit share models',
    ],
    href: '/services#development',
  },
];

export default function ServicesOverview() {
  return (
    <section className="section-padding bg-canvas">
      <Container>
        <SectionHeading
          badge="Our Services"
          title="From feasibility to finished development"
          subtitle="Three integrated service tiers, each building on the last. Start with the intelligence you need today."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {services.map((service, index) => (
            <FadeIn key={service.title} delay={index * 0.1}>
              <Card hover className="h-full flex flex-col">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-casa-navy/5 flex items-center justify-center">
                    <service.icon className="w-6 h-6 text-casa-navy" />
                  </div>
                  {service.badge && (
                    <span className="text-[10px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full bg-gold/10 text-gold">
                      {service.badge}
                    </span>
                  )}
                </div>

                <h3 className="font-serif text-xl mb-1">{service.title}</h3>
                <p className="text-sm font-medium text-casa-navy mb-3">{service.price}</p>
                <p className="text-sm text-text-secondary leading-relaxed mb-5">
                  {service.description}
                </p>

                <ul className="space-y-2.5 mb-6 flex-1">
                  {service.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2.5 text-sm text-text-secondary"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-casa-navy/30 mt-1.5 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link
                  href={service.href}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-casa-navy hover:gap-2.5 transition-all"
                >
                  Learn more
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Card>
            </FadeIn>
          ))}
        </div>
      </Container>
    </section>
  );
}
