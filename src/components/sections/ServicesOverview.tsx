'use client';

import Brand from '@/components/brand/Brand';
import Card from '@/components/ui/Card';
import FadeIn from '@/components/ui/FadeIn';
import SectionHeading from '@/components/ui/SectionHeading';
import Container from '@/components/layout/Container';
import { ArrowRight, ClipboardCheck, Layers, TrendingUp } from 'lucide-react';
import Link from 'next/link';

const services = [
  {
    icon: ClipboardCheck,
    title: 'Development Feasibility',
    subtitle: <><Brand>Intelligence</Brand> before commitment</>,
    description:
      'Our intelligence engine cross-references planning data, construction cost indices, comparable sales, and overlay interactions to produce a feasibility assessment with accuracy no manual process can match. You get a clear, data-driven picture of what your site can deliver before you spend a dollar.',
    features: [
      'Automated planning and overlay analysis',
      'Data-calibrated yield and massing studies',
      'Market-benchmarked financial pro forma',
      'Definitive go/no-go recommendation',
    ],
    href: '/services#feasibility',
  },
  {
    icon: Layers,
    title: 'Pre-Development Management',
    subtitle: <><Brand>Intelligence</Brand>-driven approvals</>,
    description:
      'Intelligence doesn\u2019t stop at the report. Our engine tracks council decision patterns, consultant performance, and timeline benchmarks \u2014 giving us an edge in managing your approvals. One point of accountability, powered by data.',
    features: [
      'Data-driven consultant procurement',
      'Council liaison with decision pattern intelligence',
      'Builder tendering with cost benchmarking',
      'Milestone tracking and budget protection',
    ],
    href: '/services#management',
  },
  {
    icon: TrendingUp,
    title: 'Development Partnerships',
    subtitle: 'Data-backed conviction',
    badge: 'Coming 2027',
    description:
      'We deploy capital where our data tells us the risk-adjusted returns are strongest. Our intelligence engine identifies opportunities before the market prices them in \u2014 and our incentives are fully aligned with yours.',
    features: [
      'Intelligence-led site selection',
      'End-to-end development delivery',
      'Risk sharing from day one',
      'Returns maximised through proprietary analysis',
    ],
    href: '/services#development',
  },
];

export default function ServicesOverview() {
  return (
    <section className="section-padding bg-canvas">
      <Container variant="wide">
        <SectionHeading
          badge="Our Services"
          title={<><Brand>Intelligence</Brand> applied at every stage</>}
          subtitle={<>Powered by the most comprehensive development <Brand>intelligence</Brand> engine on the Sunshine Coast. Every service we deliver is backed by proprietary analysis no other firm can access.</>}
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
                <p className="text-xs font-semibold tracking-wide uppercase text-casa-navy/60 mb-3">
                  {service.subtitle}
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
