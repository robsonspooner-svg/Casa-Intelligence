import Brand from '@/components/brand/Brand';
import { Metadata } from 'next';
import Container from '@/components/layout/Container';
import FadeIn from '@/components/ui/FadeIn';
import Button from '@/components/ui/Button';
import ContactCTA from '@/components/sections/ContactCTA';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, Clock } from 'lucide-react';

export const metadata: Metadata = {
  title:
    'Development Feasibility Reports | Sunshine Coast | From $8,000 | Casa Intelligence',
  description:
    'Professional development feasibility reports for the Sunshine Coast from $8,000. Planning, architecture, and financial analysis integrated into one assessment. Delivered in 5-7 business days.',
  keywords: [
    'development feasibility sunshine coast',
    'feasibility report sunshine coast',
    'development feasibility report',
    'feasibility study sunshine coast',
    'property feasibility sunshine coast',
    'development feasibility queensland',
    'feasibility report queensland',
    'feasibility assessment sunshine coast',
    'site feasibility sunshine coast',
    'development feasibility cost',
    'how much does a feasibility report cost',
    'feasibility report cost sunshine coast',
    'development feasibility analysis',
    'property development feasibility report',
    'feasibility study queensland',
  ],
  alternates: {
    canonical:
      'https://casaintelligence.com.au/development-feasibility-sunshine-coast',
  },
  openGraph: {
    title: 'Development Feasibility Reports | Sunshine Coast | From $8,000',
    description:
      'Integrated planning, architectural, and financial feasibility reports. Delivered in 5-7 business days from local specialists.',
    type: 'website',
    url: 'https://casaintelligence.com.au/development-feasibility-sunshine-coast',
  },
};

const deliverables = [
  'Planning scheme analysis and zoning assessment',
  'Full overlay mapping with cost impact analysis',
  'Architectural yield study with 3D concept massing',
  'Infrastructure charges and DA cost estimation',
  'Financial pro forma with sensitivity analysis',
  'Comparable sales data and revenue benchmarking',
  'Risk register with overlay interaction assessment',
  'Definitive go/no-go recommendation',
];

const comparisons = [
  {
    label: 'Cost',
    traditional: '$30,000 - $50,000 across three consultants',
    casa: 'From $8,000 for an integrated assessment',
  },
  {
    label: 'Timeframe',
    traditional: '4 - 8 weeks minimum',
    casa: '5 - 7 business days',
  },
  {
    label: 'Scope',
    traditional: 'Three separate reports that do not cross-reference',
    casa: 'One integrated assessment: planning + architecture + finance',
  },
  {
    label: 'Data depth',
    traditional: 'Manual desktop review of planning documents',
    casa: 'Proprietary system processing hundreds of data points per site',
  },
  {
    label: 'Risk assessment',
    traditional: 'Gaps between disciplines where surprises hide',
    casa: 'Overlay interactions, council patterns, and cost sensitivities all quantified',
  },
];

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How much does a development feasibility report cost on the Sunshine Coast?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Casa Intelligence feasibility reports start at $8,000. This compares to $30,000-$50,000 when engaging a planner, architect, and quantity surveyor separately. Our integrated approach covers all three disciplines in a single assessment.',
      },
    },
    {
      '@type': 'Question',
      name: 'How long does a feasibility report take to complete?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Our feasibility assessments are delivered in 5-7 business days. This is possible because our proprietary system pre-processes each site against planning data, overlays, construction cost benchmarks, and market data before our analysts begin their review.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is included in a development feasibility report?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Our reports include planning scheme analysis, overlay mapping with cost impact, architectural yield study with 3D massing, infrastructure charge estimation, financial pro forma with sensitivity analysis, comparable sales benchmarking, risk register, and a definitive go/no-go recommendation.',
      },
    },
    {
      '@type': 'Question',
      name: 'When should I get a feasibility report?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A feasibility assessment is recommended before committing capital to any development site, especially if the land cost exceeds $500,000, the site has planning overlays, or you are planning a multi-dwelling development. The cost of the assessment is trivial compared to the risk of proceeding without proper analysis.',
      },
    },
    {
      '@type': 'Question',
      name: 'Why is an integrated feasibility assessment better than hiring three separate consultants?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'When three consultants work independently, each makes assumptions about the other disciplines that may not hold. A planner might not flag a flood overlay that affects your driveway location. An architect might not account for infrastructure easements. Our integrated approach cross-references planning, architecture, and financial analysis from the start, eliminating the gaps where costly surprises hide.',
      },
    },
  ],
};

export default function DevelopmentFeasibilityPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* Hero */}
      <section className="gradient-hero pt-32 pb-20 md:pt-40 md:pb-28">
        <Container variant="wide">
          <div className="max-w-3xl">
            <FadeIn>
              <span className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-white/40 mb-4">
                Development Feasibility
              </span>
            </FadeIn>
            <FadeIn delay={0.1}>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white leading-[1.1] mb-6">
                Development feasibility reports
                <br />
                <span className="text-white/60">for the Sunshine Coast</span>
              </h1>
            </FadeIn>
            <FadeIn delay={0.2}>
              <p className="text-lg md:text-xl text-white/50 leading-relaxed max-w-2xl mb-4">
                Integrated planning, architecture, and financial analysis in one
                assessment. Know exactly what your site can deliver before you commit
                a dollar.
              </p>
              <p className="text-sm text-white/30 mb-10">
                From $8,000 | Delivered in 5-7 business days
              </p>
            </FadeIn>
            <FadeIn delay={0.3}>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  variant="primary"
                  size="lg"
                  href="/contact"
                  className="bg-white text-casa-navy hover:bg-white/90"
                >
                  Request a Feasibility Assessment
                  <ArrowRight className="w-5 h-5" />
                </Button>
                <Button variant="outline" size="lg" href="/site-analyser">
                  Try the Free Site Analyser
                </Button>
              </div>
            </FadeIn>
          </div>
        </Container>
      </section>

      {/* What you receive */}
      <section className="section-padding bg-canvas">
        <Container variant="wide">
          <div className="max-w-3xl mx-auto">
            <FadeIn>
              <h2 className="font-serif text-2xl md:text-3xl text-text-primary mb-8 text-center">
                What you receive in a <Brand>Casa Intelligence</Brand> feasibility report
              </h2>
            </FadeIn>
            <FadeIn delay={0.1}>
              <div className="bg-surface rounded-card border border-border/50 p-8">
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {deliverables.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-3 text-sm text-text-secondary"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>
          </div>
        </Container>
      </section>

      {/* Comparison */}
      <section className="section-padding bg-surface">
        <Container variant="wide">
          <FadeIn>
            <h2 className="font-serif text-2xl md:text-3xl text-text-primary mb-8 text-center">
              How we compare to the traditional approach
            </h2>
          </FadeIn>
          <div className="max-w-4xl mx-auto space-y-4">
            {comparisons.map((row, i) => (
              <FadeIn key={row.label} delay={i * 0.05}>
                <div className="grid grid-cols-1 md:grid-cols-[140px_1fr_1fr] gap-4 bg-canvas rounded-card border border-border/50 p-5">
                  <div className="text-sm font-semibold text-text-primary">
                    {row.label}
                  </div>
                  <div className="text-sm text-text-tertiary">
                    <span className="text-[10px] font-semibold tracking-wider uppercase text-text-tertiary/60 block mb-1">
                      Traditional
                    </span>
                    {row.traditional}
                  </div>
                  <div className="text-sm text-text-primary">
                    <span className="text-[10px] font-semibold tracking-wider uppercase text-casa-navy block mb-1">
                      <Brand>Casa Intelligence</Brand>
                    </span>
                    {row.casa}
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </Container>
      </section>

      {/* Why it matters */}
      <section className="section-padding bg-canvas">
        <Container variant="wide">
          <div className="max-w-3xl mx-auto">
            <FadeIn>
              <h2 className="font-serif text-2xl md:text-3xl text-text-primary mb-6 text-center">
                Why feasibility matters before you commit capital
              </h2>
            </FadeIn>
            <FadeIn delay={0.1}>
              <div className="text-text-secondary leading-relaxed space-y-4">
                <p>
                  The period before commitment is the only time you have full optionality.
                  You can walk away. You can negotiate the land price. You can adjust the
                  product type. Once you have committed capital, every decision gets more
                  expensive and your negotiating position weakens.
                </p>
                <p>
                  On the Sunshine Coast, the most common pattern we see is developers who
                  commit to a site based on the zoning, only to discover overlays, setback
                  requirements, or infrastructure costs that fundamentally change the
                  project economics. A $40,000 discovery after lodging a DA is far more
                  expensive than an $8,000 feasibility report before signing the contract.
                </p>
                <p>
                  Our assessments give you a definitive answer: proceed with confidence,
                  renegotiate the price, or walk away early. That clarity is worth
                  significantly more than the cost of the report.
                </p>
              </div>
            </FadeIn>
            <FadeIn delay={0.2}>
              <div className="text-center mt-10">
                <Button href="/contact" size="lg">
                  Book a Free Consultation
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </div>
            </FadeIn>
          </div>
        </Container>
      </section>

      {/* Related reading */}
      <section className="section-padding bg-surface">
        <Container variant="wide">
          <FadeIn>
            <h2 className="font-serif text-2xl text-text-primary mb-6 text-center">
              Further reading
            </h2>
          </FadeIn>
          <div className="flex flex-col md:flex-row gap-4 justify-center max-w-3xl mx-auto">
            <FadeIn delay={0.1}>
              <Link
                href="/articles/most-development-mistakes-happen-before-you-break-ground"
                className="group block bg-canvas rounded-card border border-border/50 p-5 hover:shadow-card-hover transition-shadow"
              >
                <h3 className="font-serif text-base text-text-primary group-hover:text-casa-navy transition-colors mb-1">
                  Most development mistakes happen before you break ground
                </h3>
                <span className="flex items-center gap-1 text-xs text-text-tertiary">
                  <Clock className="w-3 h-3" /> 6 min read
                </span>
              </Link>
            </FadeIn>
            <FadeIn delay={0.15}>
              <Link
                href="/articles/queensland-development-feasibility-what-the-numbers-need-to-show"
                className="group block bg-canvas rounded-card border border-border/50 p-5 hover:shadow-card-hover transition-shadow"
              >
                <h3 className="font-serif text-base text-text-primary group-hover:text-casa-navy transition-colors mb-1">
                  Queensland development feasibility: what the numbers actually
                  need to show
                </h3>
                <span className="flex items-center gap-1 text-xs text-text-tertiary">
                  <Clock className="w-3 h-3" /> 7 min read
                </span>
              </Link>
            </FadeIn>
          </div>
        </Container>
      </section>

      <ContactCTA />
    </>
  );
}
