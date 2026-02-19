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
  FileSearch,
  Scissors,
  Building2,
  Users,
  Layers,
  ShieldCheck,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Services | Subdivision, Feasibility & Agent Intelligence | SEQ',
  description:
    'Preliminary reports from $1,500, subdivision consulting from $10,000, development feasibility studies custom-quoted. White-label intelligence tools for real estate agents. South East Queensland.',
  keywords: [
    'development feasibility report sunshine coast',
    'subdivision package queensland',
    'preliminary report property',
    'pre-development management queensland',
    'development advisory services',
    'property development consulting sunshine coast',
    'feasibility study sunshine coast',
    'real estate agent tools',
    'white label property tools',
    'property development services SEQ',
  ],
  alternates: {
    canonical: 'https://casaintelligence.com.au/services',
  },
  openGraph: {
    title: 'Services | Subdivision, Feasibility & Agent Intelligence',
    description:
      'Preliminary reports from $1,500, subdivision consulting from $10,000, development feasibility custom-quoted. Plus white-label intelligence for agents.',
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
      name: 'What is a Preliminary Report?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A Preliminary Report is a desktop assessment that confirms your property\'s zoning, identifies planning overlays, estimates lot yield potential, and provides a high-level feasibility summary. It costs $1,500 + GST and is delivered within 5 business days.',
      },
    },
    {
      '@type': 'Question',
      name: 'How much does subdivision consulting cost?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Our Subdivision Consulting service costs $10,000 + GST and provides expert guidance through the entire subdivision process \u2014 from DA strategy and council liaison to planning compliance and coordination of third-party specialists through to title registration.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is included in a Development Feasibility study?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Our Development Feasibility studies include detailed yield study and massing, financial modelling with sensitivity analysis, infrastructure assessment, market analysis, risk register, and a definitive go/no-go recommendation. Each study is scoped and priced to match your project\u2019s complexity \u2014 contact us for a tailored quote.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do you offer tools for real estate agents?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Our For Agents offering lets real estate agencies embed Casa Intelligence subdivision and development feasibility tools directly on their website. Available as white-label with your branding, it generates qualified leads and differentiates your agency.',
      },
    },
    {
      '@type': 'Question',
      name: 'What areas do you service?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Casa Intelligence services all of South East Queensland including the Sunshine Coast, Brisbane, Gold Coast, Moreton Bay, Logan, Redland, Noosa, and surrounding areas.',
      },
    },
  ],
};

const preliminaryFeatures = [
  'Zoning & overlay confirmation',
  'Lot yield estimate',
  'Constraint identification',
  'High-level feasibility summary',
  'Delivered within 5 business days',
];

const subdivisionFeatures = [
  'Everything in Preliminary Report',
  'DA strategy & lodgement support',
  'Council liaison & negotiation',
  'Planning advice & compliance guidance',
  'End-to-end consulting to title registration',
  'Coordination of third-party specialists',
];

const feasibilityFeatures = [
  'Everything in Preliminary Report',
  'Detailed yield study & concept massing',
  'Financial modelling & sensitivity analysis',
  'Infrastructure & services assessment',
  'Market analysis & end-product positioning',
  'Risk register & constraint summary',
  'Definitive go/no-go recommendation',
];

const agentFeatures = [
  'Subdivision eligibility checker',
  'Development feasibility tool',
  'Zoning and overlay detection',
  'Uplift value calculator',
  'Lead capture & CRM integration',
  'White-label with your agency brand',
  'Listed property integration',
  'Dedicated onboarding support',
];

const services = [
  {
    id: 'preliminary',
    icon: FileSearch,
    name: 'Preliminary Report',
    price: '$1,500 + GST',
    tagline: 'Know before you commit',
    description:
      'A desktop assessment that tells you whether your property has subdivision or development potential — before you engage consultants or commit capital. We confirm zoning, identify overlays, estimate lot yield, and provide a high-level feasibility summary.',
    features: preliminaryFeatures,
    cta: 'Order Preliminary Report',
    ctaHref: '/contact',
    highlight: false,
  },
  {
    id: 'subdivision',
    icon: Scissors,
    name: 'Subdivision Consulting',
    price: '$10,000 + GST',
    tagline: 'Expert guidance from DA to title',
    description:
      'Our subdivision consulting service guides you through every stage of the process. We handle DA strategy, council liaison, planning compliance, and coordinate the specialists you need \u2014 providing expert oversight from initial concept through to new title registration.',
    features: subdivisionFeatures,
    cta: 'Get Started',
    ctaHref: '/contact',
    highlight: true,
  },
  {
    id: 'feasibility',
    icon: Building2,
    name: 'Development Feasibility',
    price: 'Custom quote',
    tagline: 'Tailored to your project',
    description:
      'Every development project is different, and our feasibility studies are scoped to match. Our intelligence engine cross-references planning data, construction cost indices, comparable sales, and overlay interactions to produce a feasibility assessment with accuracy no manual process can match. Contact us for a proposal tailored to your site.',
    features: feasibilityFeatures,
    cta: 'Request a Quote',
    ctaHref: '/contact',
    highlight: false,
  },
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
                <Brand>Intelligence</Brand>-powered
                <br />
                <span className="text-white/60">property services</span>
              </h1>
            </FadeIn>
            <FadeIn delay={0.2}>
              <p className="text-lg md:text-xl text-white/50 leading-relaxed max-w-2xl">
                From a quick feasibility check to end-to-end subdivision delivery. Every service
                is backed by our proprietary <Brand>intelligence</Brand> engine that analyses hundreds of
                data points across South East Queensland.
              </p>
            </FadeIn>
          </div>
        </Container>
      </section>

      {/* Pricing cards */}
      <section className="section-padding bg-canvas">
        <Container variant="wide">
          <SectionHeading
            badge="Pricing"
            title="Choose your service"
            subtitle="Start with a Preliminary Report to understand your site, then upgrade to a full package if the numbers work."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {services.map((service, index) => (
              <FadeIn key={service.id} delay={index * 0.1}>
                <div
                  className={`rounded-2xl border p-6 md:p-8 h-full flex flex-col ${
                    service.highlight
                      ? 'bg-casa-navy text-white border-casa-navy shadow-elevated relative'
                      : 'bg-surface border-border/50'
                  }`}
                >
                  {service.highlight && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-semibold tracking-wider uppercase px-3 py-1 rounded-full bg-gold text-white">
                      Most Popular
                    </span>
                  )}

                  <div className="flex items-start gap-3 mb-4">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        service.highlight ? 'bg-white/10' : 'bg-casa-navy/5'
                      }`}
                    >
                      <service.icon
                        className={`w-5 h-5 ${service.highlight ? 'text-white' : 'text-casa-navy'}`}
                      />
                    </div>
                    <div>
                      <h3
                        className={`font-serif text-xl ${
                          service.highlight ? 'text-white' : 'text-text-primary'
                        }`}
                      >
                        {service.name}
                      </h3>
                      <p
                        className={`text-xs mt-0.5 ${
                          service.highlight ? 'text-white/60' : 'text-text-tertiary'
                        }`}
                      >
                        {service.tagline}
                      </p>
                    </div>
                  </div>

                  <p
                    className={`text-2xl font-serif font-bold mb-4 ${
                      service.highlight ? 'text-white' : 'text-casa-navy'
                    }`}
                  >
                    {service.price}
                  </p>

                  <p
                    className={`text-sm leading-relaxed mb-6 ${
                      service.highlight ? 'text-white/70' : 'text-text-secondary'
                    }`}
                  >
                    {service.description}
                  </p>

                  <ul className="space-y-2.5 mb-8 flex-1">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2.5">
                        <CheckCircle2
                          className={`w-4 h-4 flex-shrink-0 mt-0.5 ${
                            service.highlight ? 'text-emerald-400' : 'text-emerald-500'
                          }`}
                        />
                        <span
                          className={`text-sm ${
                            service.highlight ? 'text-white/90' : 'text-text-secondary'
                          }`}
                        >
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    href={service.ctaHref}
                    size="lg"
                    className={`w-full justify-center ${
                      service.highlight
                        ? 'bg-white text-casa-navy hover:bg-white/90'
                        : ''
                    }`}
                  >
                    {service.cta}
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </FadeIn>
            ))}
          </div>
        </Container>
      </section>

      {/* For Agents */}
      <section className="section-padding bg-surface" id="for-agents">
        <Container variant="wide">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            <FadeIn direction="left">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-casa-navy/5 flex items-center justify-center">
                    <Users className="w-6 h-6 text-casa-navy" />
                  </div>
                  <h2 className="font-serif text-2xl md:text-3xl">
                    For Real Estate Agents
                  </h2>
                </div>

                <p className="text-sm font-semibold text-casa-navy mb-4">
                  White-label intelligence tools for your agency
                </p>

                <p className="text-text-secondary leading-relaxed mb-4">
                  Embed <Brand>Casa Intelligence</Brand> subdivision and development feasibility tools
                  directly on your agency website. Every property listing becomes a lead generation
                  opportunity when vendors and buyers can instantly check development potential.
                </p>

                <p className="text-text-secondary leading-relaxed mb-4">
                  Available as a fully white-labelled solution with your agency branding, or
                  as a co-branded tool that connects your clients directly to our services.
                  Either way, you generate qualified leads that no other agency in your market
                  can offer.
                </p>

                <p className="text-text-secondary leading-relaxed mb-8">
                  Setup takes less than a day. We handle all the technical integration and
                  provide dedicated onboarding for your team.
                </p>

                <Button href="/for-agents" size="lg">
                  Learn More
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </div>
            </FadeIn>

            <FadeIn direction="right" delay={0.15}>
              <Card className="p-8">
                <div className="flex items-center gap-2 mb-6">
                  <ShieldCheck className="w-5 h-5 text-casa-navy" />
                  <h3 className="font-semibold">What Your Agency Gets</h3>
                </div>
                <ul className="space-y-3">
                  {agentFeatures.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-text-secondary">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="mt-6 pt-6 border-t border-border/50">
                  <p className="text-sm text-text-secondary">
                    Contact us for agency pricing. Volume discounts available for multi-office
                    deployments.
                  </p>
                </div>
              </Card>
            </FadeIn>
          </div>
        </Container>
      </section>

      {/* How it works */}
      <section className="section-padding bg-canvas">
        <Container variant="wide">
          <SectionHeading
            badge="Process"
            title="How it works"
            subtitle="From first search to final report, our process is designed for speed and clarity."
          />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              {
                step: '01',
                title: 'Search your property',
                description:
                  'Use our free tool to instantly check any SEQ address for subdivision or development potential.',
              },
              {
                step: '02',
                title: 'Order a report',
                description:
                  'Choose a Preliminary Report ($1,500) to confirm the opportunity before committing further.',
              },
              {
                step: '03',
                title: 'Get your assessment',
                description:
                  'Receive a comprehensive, data-driven assessment within 5-7 business days.',
              },
              {
                step: '04',
                title: 'Move forward',
                description:
                  'Upgrade to a full Subdivision Package or Development Feasibility if the numbers work.',
              },
            ].map((item, i) => (
              <FadeIn key={item.step} delay={i * 0.1}>
                <div className="text-center">
                  <span className="inline-block text-3xl font-serif font-bold text-casa-navy/10 mb-2">
                    {item.step}
                  </span>
                  <h3 className="font-semibold text-text-primary mb-2">{item.title}</h3>
                  <p className="text-sm text-text-secondary leading-relaxed">{item.description}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </Container>
      </section>

      <ContactCTA />
    </>
  );
}
