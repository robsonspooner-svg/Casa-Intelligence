import Brand from '@/components/brand/Brand';
import dynamic from 'next/dynamic';
import Container from '@/components/layout/Container';
import Link from 'next/link';
import { ArrowRight, BarChart3, Building2, Layers, MapPin, Scissors } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free Site Analyser | Development Feasibility Tool',
  description:
    'Instantly analyse any Sunshine Coast property: zoning, overlays, 3D massing, and preliminary feasibility. Free development intelligence tool powered by live government data.',
  keywords: [
    'site analyser sunshine coast',
    'development feasibility tool',
    'property zoning check sunshine coast',
    'free feasibility tool queensland',
    'development site analysis',
    'sunshine coast zoning map',
    'planning overlay check',
    'property development calculator',
    'sunshine coast development potential',
    '3D massing study',
    'development yield analysis',
    'feasibility sunshine coast',
    'property feasibility tool',
    'development feasibility sunshine coast',
  ],
  alternates: {
    canonical: 'https://casaintelligence.com.au/site-analyser',
  },
  openGraph: {
    title: 'Free Site Analyser | Sunshine Coast Development Feasibility Tool',
    description:
      'Analyse any Sunshine Coast property instantly: zoning, overlays, 3D massing, and preliminary feasibility. Powered by live government data.',
    type: 'website',
    url: 'https://casaintelligence.com.au/site-analyser',
  },
};

const webAppJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Casa Intelligence Site Analyser',
  url: 'https://casaintelligence.com.au/site-analyser',
  description:
    'Free development feasibility tool for the Sunshine Coast. Queries live government databases for zoning, overlays, height limits, and generates 3D massing studies with preliminary financial feasibility.',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Any',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'AUD',
  },
  provider: {
    '@type': 'Organization',
    name: 'Casa Intelligence',
    url: 'https://casaintelligence.com.au',
  },
  featureList: [
    'Real-time zoning analysis from Sunshine Coast Planning Scheme',
    'Planning overlay detection (flood, bushfire, heritage, height limits)',
    'Interactive 3D building massing study',
    'Preliminary development feasibility and financial analysis',
    'Parcel boundary and cadastral data from Queensland Government',
    'Slope and topography assessment',
  ],
};

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What does the Site Analyser do?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The Site Analyser queries live Queensland Government and Sunshine Coast Council databases to fetch the parcel boundary, zoning classification, planning overlays, and height limits for any Sunshine Coast address. It then generates an interactive 3D massing study and preliminary financial feasibility assessment.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is the Site Analyser free?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, the Site Analyser is completely free to use. It provides a preview of our full intelligence engine. For comprehensive analysis across hundreds of additional data points, we recommend a formal Casa Intelligence feasibility assessment.',
      },
    },
    {
      '@type': 'Question',
      name: 'What areas does the Site Analyser cover?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The Site Analyser currently covers all addresses within the Sunshine Coast Council local government area, from Caloundra in the south to Noosa in the north. Our full feasibility service covers all of South East Queensland.',
      },
    },
    {
      '@type': 'Question',
      name: 'How accurate is the feasibility estimate?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The Site Analyser provides indicative estimates based on publicly available data. Construction costs, sale prices, and development parameters are modelled from regional averages. A formal Casa Intelligence feasibility report uses significantly more granular data and site-specific analysis for investment-grade accuracy.',
      },
    },
  ],
};

const SiteAnalyserTabs = dynamic(() => import('@/components/analyser/SiteAnalyserTabs'), {
  ssr: false,
});

const capabilities = [
  {
    icon: Scissors,
    title: 'Subdivision analysis',
    description:
      'Instant subdivision eligibility check for any SEQ address. Our system checks zoning, minimum lot sizes, and planning overlays to determine if your land can be subdivided.',
  },
  {
    icon: MapPin,
    title: 'Cadastral intelligence',
    description:
      'Real-time parcel boundary, lot plan, and land area data queried directly from Queensland Government spatial databases.',
  },
  {
    icon: Layers,
    title: 'Constraint detection',
    description:
      'Automatic identification of flood, bushfire, heritage, acid sulfate, landslide, and building height overlays across SEQ planning schemes.',
  },
  {
    icon: Building2,
    title: '3D massing study',
    description:
      'Interactive building mass model calibrated to your site geometry, setbacks, and height limits. Adjust storeys, unit count, roof style, and product type in real time.',
  },
  {
    icon: BarChart3,
    title: 'Financial feasibility',
    description:
      'Preliminary development pro forma including construction costs, professional fees, infrastructure charges, finance costs, and estimated profit margin.',
  },
];

export default function SiteAnalyserPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* Header */}
      <section className="gradient-hero pt-28 pb-10 md:pt-36 md:pb-14">
        <Container variant="wide">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-white/50 mb-3">
              Free Development <Brand>Intelligence</Brand> Tool
            </span>
            <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl text-white leading-tight mb-3">
              Site Analyser
            </h1>
            <p className="text-sm md:text-base text-white/60 leading-relaxed max-w-2xl mx-auto">
              Search any Sunshine Coast address to access real-time planning data, overlay
              detection, 3D massing, and preliminary feasibility, powered by our proprietary
              <Brand>intelligence</Brand> engine.
            </p>
          </div>
        </Container>
      </section>

      {/* Analyser with Tabs (client-side only) */}
      <section className="py-6 bg-canvas">
        <Container variant="full">
          <SiteAnalyserTabs />
        </Container>
      </section>

      {/* SSR content — visible to crawlers even though the interactive tool is client-only */}
      <section className="py-12 bg-surface">
        <Container variant="wide">
          <div className="max-w-5xl mx-auto">
            <h2 className="font-serif text-2xl md:text-3xl text-text-primary text-center mb-3">
              What the Site Analyser does
            </h2>
            <p className="text-sm text-text-secondary text-center max-w-2xl mx-auto mb-10 leading-relaxed">
              Our free tool queries live government databases and applies a subset of our
              proprietary intelligence models to any Sunshine Coast property.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {capabilities.map((cap) => (
                <div key={cap.title} className="bg-canvas rounded-xl border border-border/50 p-5">
                  <div className="w-10 h-10 rounded-lg bg-casa-navy/5 flex items-center justify-center mb-3">
                    <cap.icon className="w-5 h-5 text-casa-navy" />
                  </div>
                  <h3 className="text-sm font-semibold text-text-primary mb-1.5">{cap.title}</h3>
                  <p className="text-xs text-text-secondary leading-relaxed">{cap.description}</p>
                </div>
              ))}
            </div>

            <div className="mt-10 bg-canvas rounded-xl border border-border/50 p-6 md:p-8">
              <h3 className="font-serif text-lg text-text-primary mb-3">
                How it works
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-text-secondary leading-relaxed">
                <div>
                  <p className="font-semibold text-text-primary mb-1">1. Search an address</p>
                  <p>
                    Enter any Sunshine Coast address. We geocode it and identify the cadastral
                    parcel from Queensland Government spatial databases.
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-text-primary mb-1">2. Analyse planning controls</p>
                  <p>
                    We query the Sunshine Coast Planning Scheme for zoning, overlays, height
                    limits, and development assessment levels applicable to your site.
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-text-primary mb-1">3. Generate feasibility</p>
                  <p>
                    An interactive 3D massing study and preliminary financial pro forma are
                    generated based on the site constraints and your development parameters.
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center mt-8">
              <p className="text-sm text-text-secondary mb-4">
                This tool shows a fraction of our full intelligence system. For investment-grade
                analysis across hundreds of additional data points, talk to us.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 text-sm font-medium text-casa-navy hover:underline"
              >
                Book a free consultation <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* Disclaimer */}
      <section className="pb-12 bg-surface">
        <Container variant="wide">
          <div className="max-w-3xl mx-auto bg-warm border border-gold/20 rounded-card p-5 md:p-6">
            <h3 className="font-serif text-base text-text-primary mb-2">Important Disclaimer</h3>
            <div className="space-y-1.5 text-[11px] text-text-secondary leading-relaxed">
              <p>
                This tool provides indicative assessments only, based on publicly available data from
                the Sunshine Coast Council and Queensland Government spatial databases. It does not
                constitute professional planning, architectural, or financial advice.
              </p>
              <p>
                Site-specific conditions, local plan provisions, overlay interactions, and recent
                planning scheme amendments may significantly affect development potential and feasibility.
              </p>
              <p>
                This tool exposes a subset of our full intelligence system. A formal <Brand>Casa
                Intelligence</Brand> assessment deploys significantly deeper analysis across hundreds
                of additional data points.
              </p>
              <p>
                We strongly recommend engaging <Brand>Casa Intelligence</Brand> for a formal feasibility assessment
                before making any development decisions or financial commitments.
              </p>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
