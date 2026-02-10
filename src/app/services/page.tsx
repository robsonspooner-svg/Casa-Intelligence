import Brand from '@/components/brand/Brand';
import { Metadata } from 'next';
import Container from '@/components/layout/Container';
import SectionHeading from '@/components/ui/SectionHeading';
import FadeIn from '@/components/ui/FadeIn';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import ContactCTA from '@/components/sections/ContactCTA';
import {
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  FileText,
  Layers,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Development Feasibility & Advisory Services | Sunshine Coast',
  description:
    'Development feasibility reports, pre-development management, and development partnership services on the Sunshine Coast. Planning, architecture, and financial analysis integrated into one assessment.',
  keywords: [
    'development feasibility report sunshine coast',
    'pre-development management queensland',
    'development advisory services',
    'property development consulting sunshine coast',
    'feasibility study sunshine coast',
    'development partnership queensland',
    'planning assessment sunshine coast',
    'architectural feasibility report',
    'development site assessment',
    'property development services SEQ',
  ],
  alternates: {
    canonical: 'https://casaintelligence.com.au/services',
  },
  openGraph: {
    title: 'Development Feasibility & Advisory Services | Sunshine Coast',
    description:
      'Feasibility reports from $8,000 in 5-7 days. Planning, architecture, and financial analysis in one integrated assessment.',
    type: 'website',
    url: 'https://casaintelligence.com.au/services',
  },
};

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How much does a development feasibility report cost on the Sunshine Coast?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Casa Intelligence feasibility assessments start at $8,000 and are delivered in 5-7 business days. This compares to $30,000-$50,000 and 4-8 weeks when engaging three separate consultants (planner, architect, and quantity surveyor).',
      },
    },
    {
      '@type': 'Question',
      name: 'What is included in a development feasibility report?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Our reports include planning scheme analysis and zoning assessment, site constraint and overlay mapping, architectural yield study with concept massing, infrastructure and services capacity assessment, financial pro forma with sensitivity analysis, market analysis, risk register, and a definitive go/no-go recommendation.',
      },
    },
    {
      '@type': 'Question',
      name: 'How long does a feasibility assessment take?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Our integrated feasibility assessments are delivered in 5-7 business days. This is possible because our proprietary intelligence system pre-processes every site against planning data, overlays, construction costs, and market data before an analyst begins their review.',
      },
    },
    {
      '@type': 'Question',
      name: 'What areas does Casa Intelligence service?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Casa Intelligence specialises in the Sunshine Coast and the broader South East Queensland corridor. Our deep local knowledge of Sunshine Coast planning schemes, council processes, construction costs, and market conditions is our core advantage.',
      },
    },
    {
      '@type': 'Question',
      name: 'How is Casa Intelligence different from hiring a planner, architect, and QS separately?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'When you engage three separate consultants, each works in isolation making assumptions about the other disciplines. The result is often three reports that do not account for each other, with costly gaps between them. Our integrated assessment cross-references planning, architecture, and financial analysis from the start, producing a single coherent assessment that reflects what can actually be built, approved, and sold on your specific site.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do I need a feasibility report before buying a development site?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'If you are considering spending more than $500,000 on land, looking at a site with planning overlays, or planning a multi-dwelling development, a feasibility assessment before committing capital is strongly recommended. The cost of the assessment is trivial compared to the risk of discovering constraints after you have committed.',
      },
    },
  ],
};

const feasibilityDeliverables = [
  'Planning scheme analysis and zoning assessment',
  'Site constraint and overlay mapping',
  'Architectural yield study with concept massing',
  'Infrastructure and services capacity assessment',
  'Financial pro forma with sensitivity analysis',
  'Market analysis and end-product positioning',
  'Risk register and constraint summary',
  'Go/no-go recommendation with clear reasoning',
];

const managementBenefits = [
  'Single point of accountability for the entire pre-construction phase',
  'Consultant procurement at competitive rates through established relationships',
  'Council liaison: we know the process, the people, and the pitfalls',
  'DA preparation that gets approved first time, avoiding costly delays',
  'Builder tendering with local market intelligence',
  'Budget and timeline protection with milestone tracking',
  'Risk mitigation: problems identified and resolved before they cost you',
  'Regular reporting so you always know where your project stands',
];

export default function ServicesPage() {
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
                Our Services
              </span>
            </FadeIn>
            <FadeIn delay={0.1}>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white leading-[1.1] mb-6">
                Development feasibility
                <br />
                <span className="text-white/60">and advisory services</span>
              </h1>
            </FadeIn>
            <FadeIn delay={0.2}>
              <p className="text-lg md:text-xl text-white/50 leading-relaxed max-w-2xl">
                Every dollar you spend on development should be informed by proprietary
                <Brand>intelligence</Brand> that no other advisory firm can access. We make sure it is,
                from first enquiry through to DA approval.
              </p>
            </FadeIn>
          </div>
        </Container>
      </section>

      {/* Service 1: Feasibility */}
      <section className="section-padding bg-canvas" id="feasibility">
        <Container variant="wide">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            <FadeIn direction="left">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-casa-navy/5 flex items-center justify-center">
                    <ClipboardCheck className="w-6 h-6 text-casa-navy" />
                  </div>
                  <h2 className="font-serif text-2xl md:text-3xl">
                    Development Feasibility
                  </h2>
                </div>

                <p className="text-sm font-semibold text-casa-navy mb-4">From $8,000 | Delivered in 5-7 business days</p>

                <p className="text-text-secondary leading-relaxed mb-4">
                  Most developers spend $30,000-$50,000 across three separate consultants and
                  wait four to eight weeks just to understand whether a site has potential.
                  Many discover constraints too late, after they&apos;ve already committed capital.
                </p>

                <p className="text-text-secondary leading-relaxed mb-4">
                  Our feasibility assessment integrates planning, architecture, and financial
                  analysis into a single report. You get a clear, actionable picture of what
                  your site can deliver, what it will cost, and whether the numbers work
                  before you spend another dollar.
                </p>

                <p className="text-text-secondary leading-relaxed mb-4">
                  Our proprietary <Brand>intelligence</Brand> engine pre-processes every site before an analyst
                  begins by cross-referencing planning data, overlay interactions, comparable sales,
                  construction cost indices, and council decision patterns. The result is a
                  feasibility assessment with a depth and accuracy that manual analysis cannot replicate.
                </p>

                <p className="text-text-secondary leading-relaxed mb-8">
                  The result isn&apos;t just a report. It&apos;s a decision-making tool that protects
                  you from costly surprises and positions you to move with confidence.
                </p>

                <Button href="/contact" size="lg">
                  Request a Feasibility Assessment
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </div>
            </FadeIn>

            <FadeIn direction="right" delay={0.15}>
              <Card className="p-8">
                <div className="flex items-center gap-2 mb-6">
                  <FileText className="w-5 h-5 text-casa-navy" />
                  <h3 className="font-semibold">What You Receive</h3>
                </div>
                <ul className="space-y-3">
                  {feasibilityDeliverables.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-text-secondary">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </Card>
            </FadeIn>
          </div>
        </Container>
      </section>

      {/* Service 2: Pre-Development Management */}
      <section className="section-padding bg-surface" id="management">
        <Container variant="wide">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            <FadeIn direction="left" className="lg:order-2">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-casa-navy/5 flex items-center justify-center">
                    <Layers className="w-6 h-6 text-casa-navy" />
                  </div>
                  <h2 className="font-serif text-2xl md:text-3xl">
                    Pre-Development Management
                  </h2>
                </div>

                <p className="text-text-secondary leading-relaxed mb-4">
                  The period between buying a site and breaking ground is the most complex
                  and highest-risk phase of any development. One wrong consultant, one missed
                  council requirement, one avoidable delay can cost you hundreds of thousands.
                </p>

                <p className="text-text-secondary leading-relaxed mb-4">
                  We act as your single point of accountability for this entire phase:
                  procuring the right consultants, managing council interactions, preparing
                  your DA to approval standard, and tendering builders who actually deliver
                  on price and timeline.
                </p>

                <p className="text-text-secondary leading-relaxed mb-4">
                  Our system continuously tracks council decision timelines, consultant
                  performance metrics, and approval patterns, giving us <Brand>intelligence</Brand> that
                  accelerates approvals and protects your budget.
                </p>

                <p className="text-text-secondary leading-relaxed mb-8">
                  You stay focused on the opportunity. We handle the complexity, protect your
                  budget, and make sure nothing falls through the cracks.
                </p>

                <Button href="/contact" size="lg">
                  Discuss Your Project
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </div>
            </FadeIn>

            <FadeIn direction="right" delay={0.15} className="lg:order-1">
              <Card className="p-8">
                <div className="flex items-center gap-2 mb-6">
                  <ShieldCheck className="w-5 h-5 text-casa-navy" />
                  <h3 className="font-semibold">How We Protect Your Investment</h3>
                </div>
                <ul className="space-y-3">
                  {managementBenefits.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-text-secondary">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </Card>
            </FadeIn>
          </div>
        </Container>
      </section>

      {/* Service 3: Development Partnerships */}
      <section className="section-padding bg-canvas" id="development">
        <Container variant="wide">
          <div className="max-w-3xl mx-auto text-center">
            <FadeIn>
              <div className="w-12 h-12 rounded-xl bg-casa-navy/5 flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="w-6 h-6 text-casa-navy" />
              </div>
              <span className="inline-block text-[10px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full bg-gold/10 text-gold mb-4">
                Coming 2027
              </span>
              <h2 className="font-serif text-2xl md:text-3xl mb-4">
                Development Partnerships
              </h2>
              <p className="text-text-secondary leading-relaxed mb-4">
                For high-potential sites, we go beyond advisory. We co-invest alongside you,
                contributing capital, expertise, and hands-on management to deliver the
                development together.
              </p>
              <p className="text-text-secondary leading-relaxed mb-4">
                This means our incentives are fully aligned with yours. We succeed when
                you succeed. Our deep local knowledge of construction costs, market pricing,
                and council requirements means your project is managed by people who have
                real skin in the game.
              </p>
              <p className="text-text-secondary leading-relaxed mb-8">
                If you have a site with strong fundamentals and are looking for a development
                partner with genuine Sunshine Coast expertise, we&apos;d like to hear from you.
              </p>
              <Button href="/contact" variant="secondary" size="lg">
                Register Your Interest
                <ArrowRight className="w-5 h-5" />
              </Button>
            </FadeIn>
          </div>
        </Container>
      </section>

      <ContactCTA />
    </>
  );
}
