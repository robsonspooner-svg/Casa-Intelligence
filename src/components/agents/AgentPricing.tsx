'use client';

import Brand from '@/components/brand/Brand';
import Container from '@/components/layout/Container';
import FadeIn from '@/components/ui/FadeIn';
import { ArrowRight, Check } from 'lucide-react';
import Link from 'next/link';

const tiers = [
  {
    name: 'Starter',
    description: 'Subdivision intelligence for your agency website',
    features: [
      'Subdivision eligibility checker',
      'Zoning and overlay detection',
      'Uplift value calculator',
      'Basic lead capture',
      'Casa Intelligence branding',
      'Email support',
    ],
    cta: 'Get Started',
    highlighted: false,
  },
  {
    name: 'Professional',
    description: 'Full development intelligence suite, white-labelled',
    features: [
      'Everything in Starter',
      'Development feasibility tool',
      '3D massing viewer',
      'Full white-label (your brand)',
      'Advanced lead capture & CRM',
      'Listed property integration',
      'Priority support',
    ],
    cta: 'Contact Us',
    highlighted: true,
  },
];

export default function AgentPricing() {
  return (
    <section className="section-padding bg-canvas">
      <Container variant="wide">
        <FadeIn>
          <div className="text-center mb-10">
            <h2 className="font-serif text-3xl md:text-4xl text-text-primary mb-3">
              Simple, agency-friendly pricing
            </h2>
            <p className="text-base text-text-secondary max-w-2xl mx-auto">
              Choose the plan that fits your agency. Scale up as you grow.
            </p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {tiers.map((tier, i) => (
            <FadeIn key={tier.name} delay={0.1 + i * 0.15}>
              <div
                className={`rounded-2xl border p-6 md:p-8 h-full flex flex-col ${
                  tier.highlighted
                    ? 'bg-casa-navy text-white border-casa-navy shadow-elevated'
                    : 'bg-surface border-border/50'
                }`}
              >
                <div className="mb-6">
                  <h3
                    className={`font-serif text-2xl mb-2 ${
                      tier.highlighted ? 'text-white' : 'text-text-primary'
                    }`}
                  >
                    {tier.name}
                  </h3>
                  <p
                    className={`text-sm ${
                      tier.highlighted ? 'text-white/70' : 'text-text-secondary'
                    }`}
                  >
                    {tier.description}
                  </p>
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5">
                      <Check
                        className={`w-4 h-4 flex-shrink-0 mt-0.5 ${
                          tier.highlighted ? 'text-emerald-400' : 'text-emerald-600'
                        }`}
                      />
                      <span
                        className={`text-sm ${
                          tier.highlighted ? 'text-white/90' : 'text-text-secondary'
                        }`}
                      >
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/contact"
                  className={`flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-colors ${
                    tier.highlighted
                      ? 'bg-white text-casa-navy hover:bg-white/90'
                      : 'bg-casa-navy text-white hover:bg-casa-navy-light'
                  }`}
                >
                  {tier.cta} <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={0.4}>
          <p className="text-center text-sm text-text-tertiary mt-8 max-w-lg mx-auto">
            All plans include setup assistance and onboarding. Contact us for custom
            enterprise pricing or multi-office deployments.
          </p>
        </FadeIn>
      </Container>
    </section>
  );
}
