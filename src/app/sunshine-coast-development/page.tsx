import Brand from '@/components/brand/Brand';
import { Metadata } from 'next';
import Container from '@/components/layout/Container';
import FadeIn from '@/components/ui/FadeIn';
import Button from '@/components/ui/Button';
import ContactCTA from '@/components/sections/ContactCTA';
import { articles } from '@/lib/articles';
import Link from 'next/link';
import {
  ArrowRight,
  BarChart3,
  Building2,
  CheckCircle2,
  Clock,
  Layers,
  MapPin,
  TrendingUp,
} from 'lucide-react';

export const metadata: Metadata = {
  title:
    'Sunshine Coast Development | Feasibility, Planning & Advisory | Casa Intelligence',
  description:
    'Expert development intelligence for the Sunshine Coast. Feasibility reports, planning assessment, overlay analysis, and pre-development advisory. Data-driven insights from $8,000 in 5-7 days.',
  keywords: [
    'sunshine coast development',
    'sunshine coast property development',
    'development sunshine coast',
    'sunshine coast development advisory',
    'sunshine coast feasibility',
    'sunshine coast planning',
    'sunshine coast zoning',
    'sunshine coast overlays',
    'sunshine coast infill development',
    'sunshine coast medium density',
    'sunshine coast townhouse development',
    'sunshine coast apartment development',
    'development approval sunshine coast',
    'sunshine coast council planning',
    'sunshine coast development consultant',
    'property development sunshine coast queensland',
  ],
  alternates: {
    canonical: 'https://casaintelligence.com.au/sunshine-coast-development',
  },
  openGraph: {
    title: 'Sunshine Coast Development | Casa Intelligence',
    description:
      'Data-driven development intelligence for the Sunshine Coast. Feasibility reports, planning analysis, and advisory from local specialists.',
    type: 'website',
    url: 'https://casaintelligence.com.au/sunshine-coast-development',
  },
};

const stats = [
  { value: '84,800', label: 'New dwellings needed by 2046' },
  { value: '60%', label: 'Required as infill development' },
  { value: '76%', label: 'House price growth over 5 years' },
  { value: '5-7', label: 'Business days for our reports' },
];

const corridors = [
  {
    name: 'Caloundra to Maroochydore Coastal Strip',
    description:
      'Medium density residential zoning permits townhouses and low-rise apartments. Strong buyer demand from lifestyle purchasers and downsizers.',
    zoning: 'Medium Density Residential',
  },
  {
    name: 'Maroochydore City Centre',
    description:
      'Local plan anticipates significant density increases. High-rise mixed-use development supported by new transport infrastructure.',
    zoning: 'Principal Centre / Mixed Use',
  },
  {
    name: 'Buderim, Sippy Downs & Palmview',
    description:
      'Larger lots in established suburbs becoming viable for subdivision and multi-dwelling development. Growing family market.',
    zoning: 'Low-Medium Density Residential',
  },
  {
    name: 'Nambour & Hinterland Towns',
    description:
      'Emerging affordability corridor with increasing interest from first-home buyers. Council supportive of appropriate infill.',
    zoning: 'Low Density Residential / Centre',
  },
];

export default function SunshineCoastDevelopmentPage() {
  const relatedArticles = articles.slice(0, 3);

  return (
    <>
      {/* Hero */}
      <section className="gradient-hero pt-32 pb-20 md:pt-40 md:pb-28">
        <Container variant="wide">
          <div className="max-w-3xl">
            <FadeIn>
              <span className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-white/40 mb-4">
                Sunshine Coast Development
              </span>
            </FadeIn>
            <FadeIn delay={0.1}>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white leading-[1.1] mb-6">
                Sunshine Coast development <Brand>intelligence</Brand>
                <br />
                <span className="text-white/60">from local specialists</span>
              </h1>
            </FadeIn>
            <FadeIn delay={0.2}>
              <p className="text-lg md:text-xl text-white/50 leading-relaxed max-w-2xl mb-10">
                The Sunshine Coast is one of Australia&apos;s fastest-growing regions.
                Understanding what your site can deliver requires deep local knowledge of
                planning schemes, overlay interactions, construction costs, and market
                dynamics. That is exactly what we provide.
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
                <Button variant="outline" size="lg" href="/site-analyser">
                  Try the Free Site Analyser
                </Button>
              </div>
            </FadeIn>
          </div>
        </Container>
      </section>

      {/* Stats */}
      <section className="section-padding bg-canvas">
        <Container variant="wide">
          <FadeIn>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="font-serif text-3xl md:text-4xl text-casa-navy mb-2">
                    {stat.value}
                  </p>
                  <p className="text-sm text-text-secondary">{stat.label}</p>
                </div>
              ))}
            </div>
          </FadeIn>
        </Container>
      </section>

      {/* Why Sunshine Coast */}
      <section className="section-padding bg-surface">
        <Container variant="wide">
          <div className="max-w-3xl mx-auto">
            <FadeIn>
              <h2 className="font-serif text-2xl md:text-3xl text-text-primary mb-6 text-center">
                Why the Sunshine Coast is Australia&apos;s most compelling development market
              </h2>
            </FadeIn>
            <FadeIn delay={0.1}>
              <div className="text-text-secondary leading-relaxed space-y-4">
                <p>
                  The Sunshine Coast Council&apos;s planning documents anticipate 84,800
                  additional dwellings by 2046, with approximately 60% mandated as infill
                  development on existing urban land. Population growth is not a projection.
                  It is already happening, driven by genuine lifestyle demand and supported
                  by major infrastructure investment.
                </p>
                <p>
                  This creates a clear window for developers and landowners who understand
                  the planning controls. Sites that are well-zoned, well-located, and
                  properly assessed represent genuine opportunities. But the Sunshine Coast
                  Planning Scheme is one of the most layered planning instruments in
                  Queensland. Getting it right requires more than a desktop review.
                </p>
              </div>
            </FadeIn>
          </div>
        </Container>
      </section>

      {/* Development Corridors */}
      <section className="section-padding bg-canvas">
        <Container variant="wide">
          <FadeIn>
            <h2 className="font-serif text-2xl md:text-3xl text-text-primary mb-8 text-center">
              Key development corridors on the Sunshine Coast
            </h2>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {corridors.map((corridor, i) => (
              <FadeIn key={corridor.name} delay={i * 0.1}>
                <div className="bg-surface rounded-card border border-border/50 p-6 h-full">
                  <div className="flex items-center gap-2 mb-3">
                    <MapPin className="w-4 h-4 text-casa-navy" />
                    <h3 className="font-serif text-lg text-text-primary">
                      {corridor.name}
                    </h3>
                  </div>
                  <p className="text-sm text-text-secondary leading-relaxed mb-3">
                    {corridor.description}
                  </p>
                  <span className="text-xs text-casa-navy/60 font-medium">
                    Typical zoning: {corridor.zoning}
                  </span>
                </div>
              </FadeIn>
            ))}
          </div>
        </Container>
      </section>

      {/* Services for SC */}
      <section className="section-padding bg-surface">
        <Container variant="wide">
          <FadeIn>
            <h2 className="font-serif text-2xl md:text-3xl text-text-primary mb-4 text-center">
              Our Sunshine Coast development services
            </h2>
            <p className="text-text-secondary text-center max-w-2xl mx-auto mb-10">
              Every service is powered by deep local knowledge of Sunshine Coast planning
              schemes, construction costs, and market dynamics.
            </p>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <FadeIn delay={0.1}>
              <div className="bg-canvas rounded-card border border-border/50 p-6">
                <BarChart3 className="w-8 h-8 text-casa-navy mb-4" />
                <h3 className="font-serif text-lg mb-2">Feasibility Reports</h3>
                <p className="text-sm text-text-secondary leading-relaxed mb-4">
                  Integrated planning, architectural, and financial analysis for any
                  Sunshine Coast site. From $8,000 in 5-7 business days.
                </p>
                <Link
                  href="/services#feasibility"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-casa-navy"
                >
                  Learn more <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </FadeIn>
            <FadeIn delay={0.2}>
              <div className="bg-canvas rounded-card border border-border/50 p-6">
                <Layers className="w-8 h-8 text-casa-navy mb-4" />
                <h3 className="font-serif text-lg mb-2">
                  Pre-Development Management
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed mb-4">
                  Single point of accountability from feasibility through to DA approval.
                  Council liaison with local decision pattern intelligence.
                </p>
                <Link
                  href="/services#management"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-casa-navy"
                >
                  Learn more <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </FadeIn>
            <FadeIn delay={0.3}>
              <div className="bg-canvas rounded-card border border-border/50 p-6">
                <Building2 className="w-8 h-8 text-casa-navy mb-4" />
                <h3 className="font-serif text-lg mb-2">Free Site Analyser</h3>
                <p className="text-sm text-text-secondary leading-relaxed mb-4">
                  Instantly check zoning, overlays, and development potential for any
                  Sunshine Coast address. Powered by live government data.
                </p>
                <Link
                  href="/site-analyser"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-casa-navy"
                >
                  Try it free <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </FadeIn>
          </div>
        </Container>
      </section>

      {/* Related Articles */}
      <section className="section-padding bg-canvas">
        <Container variant="wide">
          <FadeIn>
            <h2 className="font-serif text-2xl md:text-3xl text-text-primary mb-8 text-center">
              Sunshine Coast development insights
            </h2>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {relatedArticles.map((article, i) => (
              <FadeIn key={article.slug} delay={i * 0.1}>
                <Link
                  href={`/articles/${article.slug}`}
                  className="group block bg-surface rounded-card border border-border/50 p-6 hover:shadow-card-hover transition-shadow h-full"
                >
                  <span className="text-[10px] font-semibold tracking-wider uppercase text-casa-navy">
                    {article.category}
                  </span>
                  <h3 className="font-serif text-lg text-text-primary mt-2 mb-2 group-hover:text-casa-navy transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-sm text-text-secondary leading-relaxed mb-3 line-clamp-2">
                    {article.description}
                  </p>
                  <span className="flex items-center gap-1 text-xs text-text-tertiary">
                    <Clock className="w-3 h-3" />
                    {article.readTime}
                  </span>
                </Link>
              </FadeIn>
            ))}
          </div>
          <FadeIn delay={0.3}>
            <div className="text-center mt-8">
              <Link
                href="/articles"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-casa-navy hover:gap-2.5 transition-all"
              >
                View all articles <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </FadeIn>
        </Container>
      </section>

      <ContactCTA />
    </>
  );
}
