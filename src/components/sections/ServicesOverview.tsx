'use client';

import Brand from '@/components/brand/Brand';
import Card from '@/components/ui/Card';
import FadeIn from '@/components/ui/FadeIn';
import SectionHeading from '@/components/ui/SectionHeading';
import Container from '@/components/layout/Container';
import { ArrowRight, FileSearch, Scissors, Building2, Users } from 'lucide-react';
import Link from 'next/link';

const services = [
  {
    icon: FileSearch,
    title: 'Preliminary Report',
    price: '$1,500 + GST',
    description:
      'Desktop assessment confirming zoning, overlays, lot yield, and high-level feasibility. Know whether your site has potential before you commit a dollar.',
    features: [
      'Zoning & overlay confirmation',
      'Lot yield estimate',
      'High-level feasibility summary',
      'Delivered in 5 business days',
    ],
    href: '/services#preliminary',
  },
  {
    icon: Scissors,
    title: 'Subdivision Consulting',
    price: '$10,000 + GST',
    highlight: true,
    description:
      'Expert subdivision consulting from DA strategy through to new title registration. We guide you through every step with council liaison, planning advice, and project oversight.',
    features: [
      'Everything in Preliminary Report',
      'DA strategy & lodgement support',
      'Council liaison & negotiation',
      'End-to-end consulting to completion',
    ],
    href: '/services#subdivision',
  },
  {
    icon: Building2,
    title: 'Development Feasibility',
    price: 'Custom quote',
    description:
      'Comprehensive feasibility study integrating planning, architecture, and financial analysis. Scope and pricing tailored to your project\u2019s complexity.',
    features: [
      'Detailed yield study & massing',
      'Financial modelling & sensitivity',
      'Infrastructure assessment',
      'Go / no-go recommendation',
    ],
    href: '/services#feasibility',
  },
  {
    icon: Users,
    title: 'For Agents',
    price: 'Contact for pricing',
    description:
      'White-label subdivision and feasibility tools for your agency website. Generate qualified leads and differentiate your brand with development intelligence.',
    features: [
      'Subdivision eligibility checker',
      'Development feasibility tool',
      'Lead capture & CRM integration',
      'Your brand or co-branded',
    ],
    href: '/for-agents',
  },
];

export default function ServicesOverview() {
  return (
    <section className="section-padding bg-canvas">
      <Container variant="wide">
        <SectionHeading
          badge="Our Services"
          title={<><Brand>Intelligence</Brand> applied at every stage</>}
          subtitle="From a quick feasibility check to full project delivery. Every service backed by our proprietary intelligence engine."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <FadeIn key={service.title} delay={index * 0.1}>
              <Card hover className="h-full flex flex-col">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-casa-navy/5 flex items-center justify-center">
                    <service.icon className="w-6 h-6 text-casa-navy" />
                  </div>
                  {service.highlight && (
                    <span className="text-[10px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full bg-casa-navy/10 text-casa-navy">
                      Popular
                    </span>
                  )}
                </div>

                <h3 className="font-serif text-xl mb-1">{service.title}</h3>
                <p className="text-sm font-semibold text-casa-navy mb-3">
                  {service.price}
                </p>
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
