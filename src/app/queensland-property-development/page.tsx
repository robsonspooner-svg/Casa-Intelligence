import Brand from '@/components/brand/Brand';
import { Metadata } from 'next';
import Container from '@/components/layout/Container';
import FadeIn from '@/components/ui/FadeIn';
import Button from '@/components/ui/Button';
import ContactCTA from '@/components/sections/ContactCTA';
import { articles } from '@/lib/articles';
import Link from 'next/link';
import { ArrowRight, Clock, MapPin } from 'lucide-react';

export const metadata: Metadata = {
  title:
    'Queensland Property Development | Feasibility & Advisory | Casa Intelligence',
  description:
    'Development feasibility and advisory services for South East Queensland. Data-driven site assessment, planning analysis, and pre-development management for the Sunshine Coast and SEQ corridor.',
  keywords: [
    'queensland property development',
    'queensland development',
    'property development queensland',
    'SEQ property development',
    'south east queensland development',
    'queensland development feasibility',
    'queensland development advisory',
    'queensland planning assessment',
    'queensland development consultant',
    'queensland feasibility report',
    'SEQ development advisory',
    'queensland infill development',
    'queensland medium density development',
    'queensland development approval',
    'queensland planning scheme',
    'queensland property development consultant',
  ],
  alternates: {
    canonical:
      'https://casaintelligence.com.au/queensland-property-development',
  },
  openGraph: {
    title: 'Queensland Property Development | Feasibility & Advisory',
    description:
      'Development intelligence for South East Queensland. Feasibility reports, planning analysis, and advisory from Sunshine Coast specialists.',
    type: 'website',
    url: 'https://casaintelligence.com.au/queensland-property-development',
  },
};

const regions = [
  {
    name: 'Sunshine Coast',
    description:
      'Our home base. Deep knowledge of the Sunshine Coast Planning Scheme, council processes, local construction costs, and buyer markets. From Caloundra to Noosa.',
    highlight: true,
  },
  {
    name: 'Moreton Bay',
    description:
      'Rapid growth corridor north of Brisbane. Increasing development activity in Caboolture, Morayfield, and the Redcliffe peninsula.',
    highlight: false,
  },
  {
    name: 'Brisbane',
    description:
      'Queensland capital with diverse development opportunity across inner-city infill, suburban medium density, and emerging growth corridors.',
    highlight: false,
  },
  {
    name: 'Gold Coast',
    description:
      'Mature development market with high-density coastal opportunities and emerging suburban infill in the western corridor.',
    highlight: false,
  },
];

export default function QueenslandPropertyDevelopmentPage() {
  const relatedArticles = articles.filter(
    (a) =>
      a.keywords.some(
        (k) => k.includes('queensland') || k.includes('SEQ')
      )
  ).slice(0, 3);

  return (
    <>
      {/* Hero */}
      <section className="gradient-hero pt-32 pb-20 md:pt-40 md:pb-28">
        <Container variant="wide">
          <div className="max-w-3xl">
            <FadeIn>
              <span className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-white/40 mb-4">
                Queensland Development
              </span>
            </FadeIn>
            <FadeIn delay={0.1}>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white leading-[1.1] mb-6">
                Queensland property development
                <br />
                <span className="text-white/60"><Brand>intelligence</Brand> and advisory</span>
              </h1>
            </FadeIn>
            <FadeIn delay={0.2}>
              <p className="text-lg md:text-xl text-white/50 leading-relaxed max-w-2xl mb-10">
                South East Queensland is one of Australia&apos;s fastest-growing
                development corridors. Our intelligence system and local expertise help
                you navigate Queensland&apos;s planning frameworks, identify viable sites,
                and make data-driven development decisions.
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
                  Book a Free Consultation
                  <ArrowRight className="w-5 h-5" />
                </Button>
                <Button variant="outline" size="lg" href="/services">
                  View Our Services
                </Button>
              </div>
            </FadeIn>
          </div>
        </Container>
      </section>

      {/* Queensland Development Landscape */}
      <section className="section-padding bg-canvas">
        <Container variant="wide">
          <div className="max-w-3xl mx-auto">
            <FadeIn>
              <h2 className="font-serif text-2xl md:text-3xl text-text-primary mb-6 text-center">
                The Queensland development landscape
              </h2>
            </FadeIn>
            <FadeIn delay={0.1}>
              <div className="text-text-secondary leading-relaxed space-y-4">
                <p>
                  Queensland&apos;s development market is shaped by sustained population
                  growth, significant infrastructure investment, and planning frameworks
                  that are increasingly encouraging higher-density infill development across
                  established urban areas.
                </p>
                <p>
                  South East Queensland alone is expected to accommodate an additional 2
                  million residents by 2046. This growth is concentrated along the coastal
                  corridor from the Gold Coast through Brisbane to the Sunshine Coast, with
                  each region presenting distinct planning controls, market dynamics, and
                  development economics.
                </p>
                <p>
                  Understanding these differences is critical. A development approach that
                  works in one Queensland council area may not translate to another. Planning
                  schemes, overlay frameworks, infrastructure charging regimes, and council
                  assessment cultures all vary significantly.
                </p>
              </div>
            </FadeIn>
          </div>
        </Container>
      </section>

      {/* Regions */}
      <section className="section-padding bg-surface">
        <Container variant="wide">
          <FadeIn>
            <h2 className="font-serif text-2xl md:text-3xl text-text-primary mb-8 text-center">
              SEQ development regions we service
            </h2>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {regions.map((region, i) => (
              <FadeIn key={region.name} delay={i * 0.1}>
                <div
                  className={`rounded-card border p-6 h-full ${
                    region.highlight
                      ? 'bg-casa-navy/5 border-casa-navy/20'
                      : 'bg-canvas border-border/50'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <MapPin
                      className={`w-4 h-4 ${
                        region.highlight ? 'text-casa-navy' : 'text-text-tertiary'
                      }`}
                    />
                    <h3 className="font-serif text-lg text-text-primary">
                      {region.name}
                    </h3>
                    {region.highlight && (
                      <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-casa-navy/10 text-casa-navy">
                        Specialist
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {region.description}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </Container>
      </section>

      {/* Queensland planning complexity */}
      <section className="section-padding bg-canvas">
        <Container variant="wide">
          <div className="max-w-3xl mx-auto">
            <FadeIn>
              <h2 className="font-serif text-2xl md:text-3xl text-text-primary mb-6 text-center">
                Why Queensland development requires specialist knowledge
              </h2>
            </FadeIn>
            <FadeIn delay={0.1}>
              <div className="text-text-secondary leading-relaxed space-y-4">
                <p>
                  Queensland&apos;s planning framework operates under the Planning Act
                  2016 and the Planning Regulation 2017, but each local government
                  area has its own planning scheme with distinct zoning categories,
                  overlay frameworks, and assessment criteria.
                </p>
                <p>
                  The Sunshine Coast Planning Scheme alone is a 3,000+ page document
                  with multiple layers of controls that interact in complex ways. A site
                  can look viable based on the zoning map but become financially unworkable
                  once you account for overlay requirements, infrastructure charges, and
                  council assessment expectations.
                </p>
                <p>
                  Our system cross-references planning provisions, overlay interactions,
                  construction cost benchmarks, comparable sales data, and council
                  decision patterns to produce assessments that account for these
                  complexities. It is the difference between a desktop review and genuine
                  development <Brand>intelligence</Brand>.
                </p>
              </div>
            </FadeIn>
            <FadeIn delay={0.2}>
              <div className="text-center mt-10">
                <Button href="/contact" size="lg">
                  Discuss Your Queensland Development
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </div>
            </FadeIn>
          </div>
        </Container>
      </section>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <section className="section-padding bg-surface">
          <Container variant="wide">
            <FadeIn>
              <h2 className="font-serif text-2xl text-text-primary mb-6 text-center">
                Queensland development insights
              </h2>
            </FadeIn>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {relatedArticles.map((article, i) => (
                <FadeIn key={article.slug} delay={i * 0.1}>
                  <Link
                    href={`/articles/${article.slug}`}
                    className="group block bg-canvas rounded-card border border-border/50 p-5 hover:shadow-card-hover transition-shadow h-full"
                  >
                    <span className="text-[10px] font-semibold tracking-wider uppercase text-casa-navy">
                      {article.category}
                    </span>
                    <h3 className="font-serif text-base text-text-primary mt-2 mb-2 group-hover:text-casa-navy transition-colors">
                      {article.title}
                    </h3>
                    <span className="flex items-center gap-1 text-xs text-text-tertiary">
                      <Clock className="w-3 h-3" /> {article.readTime}
                    </span>
                  </Link>
                </FadeIn>
              ))}
            </div>
          </Container>
        </section>
      )}

      <ContactCTA />
    </>
  );
}
