import { Metadata } from 'next';
import Brand from '@/components/brand/Brand';
import Container from '@/components/layout/Container';
import SectionHeading from '@/components/ui/SectionHeading';
import FadeIn from '@/components/ui/FadeIn';
import ContactCTA from '@/components/sections/ContactCTA';

export const metadata: Metadata = {
  title: 'About Us | Sunshine Coast Development Specialists',
  description:
    'Casa Intelligence combines deep local expertise with proprietary data analysis to deliver development feasibility and advisory services across the Sunshine Coast and South East Queensland.',
  keywords: [
    'development intelligence sunshine coast',
    'property development specialists queensland',
    'sunshine coast development advisory',
    'development feasibility consultants',
    'SEQ property development team',
    'sunshine coast property experts',
    'development advisory firm queensland',
  ],
  alternates: {
    canonical: 'https://casaintelligence.com.au/about',
  },
  openGraph: {
    title: 'About Casa Intelligence | Development Intelligence Specialists',
    description:
      'Deep Sunshine Coast expertise combined with proprietary data analysis. Development feasibility and advisory for SEQ.',
    type: 'website',
    url: 'https://casaintelligence.com.au/about',
  },
};

const founders = [
  {
    initials: 'FS',
    name: 'Finlay Schulz',
    role: 'Co-Founder & Director',
    focus: 'Distribution, Relationships & Deal Origination',
    bio: 'Finlay brings unmatched distribution capability to Casa Intelligence. With over $20 million in residential property sales in the past 12 months alone, he has established deep relationships with real estate agents, developers, and builders across the Sunshine Coast. His understanding of buyer psychology, market positioning, and negotiation dynamics means he identifies high-potential development sites before they ever reach the open market.',
    credentials: [
      '$20M+ in residential property sales',
      'Established agent and developer network across SEQ',
      'Deep understanding of buyer psychology and market positioning',
      'Identifies high-potential sites before they hit the market',
    ],
  },
  {
    initials: 'RS',
    name: 'Robert Spooner',
    role: 'Co-Founder & Director',
    focus: 'Product, Intelligence & Technical Analysis',
    bio: 'Robert brings rare technical depth to development advisory. With a Master of Architecture and intimate knowledge of Sunshine Coast construction costs and timelines, he produces the kind of integrated analysis (planning, architecture, and financial modelling) that normally requires three separate consultants. His ability to combine these disciplines into one cohesive deliverable is Casa Intelligence\'s core technical advantage.',
    credentials: [
      'Master of Architecture',
      'Planning, architectural, and financial feasibility specialist',
      'Intimate knowledge of Sunshine Coast construction costs',
      'Integrates multiple disciplines into one cohesive deliverable',
    ],
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="gradient-hero pt-32 pb-20 md:pt-40 md:pb-28">
        <Container variant="wide">
          <div className="max-w-3xl">
            <FadeIn>
              <span className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-white/40 mb-4">
                About Us
              </span>
            </FadeIn>
            <FadeIn delay={0.1}>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white leading-[1.1] mb-6">
                Sunshine Coast development
                <br />
                <span className="text-white/60">intelligence specialists</span>
              </h1>
            </FadeIn>
            <FadeIn delay={0.2}>
              <p className="text-lg md:text-xl text-white/50 leading-relaxed max-w-2xl">
                <Brand>Casa Intelligence</Brand> was founded on a simple observation: the gap between
                a landowner who doesn&apos;t know their site&apos;s potential and a developer who needs
                viable sites is where the most value is created, and where the least
                intelligence currently exists. We built the technology to close that gap.
              </p>
            </FadeIn>
          </div>
        </Container>
      </section>

      {/* Vision */}
      <section className="section-padding bg-canvas">
        <Container variant="wide">
          <div className="max-w-3xl mx-auto">
            <FadeIn>
              <SectionHeading
                badge="Our Vision"
                title="Intelligence that moves markets"
                subtitle="We believe every property decision should be informed by deep, integrated analysis. Not guesswork, not gut feel, and not the fragmented advice of three separate consultants who never talk to each other."
                align="center"
              />
            </FadeIn>
            <FadeIn delay={0.1}>
              <div className="prose prose-lg mx-auto text-text-secondary leading-relaxed space-y-6">
                <p>
                  Traditional feasibility assessment is broken. A landowner considering
                  development must separately engage a town planner, an architect, and a
                  quantity surveyor, spending $30,000 to $50,000 over four to eight weeks
                  just to understand whether their site has potential.
                </p>
                <p>
                  <Brand>Casa Intelligence</Brand> built a proprietary intelligence engine that brings all three
                  disciplines together, continuously ingesting planning data, market
                  transactions, construction costs, and council decision patterns. The
                  result is a single, integrated assessment delivered in five to seven
                  business days, for a fraction of the cost.
                </p>
                <p>
                  This isn&apos;t just integration. It&apos;s intelligence. Our system learns
                  from every assessment, every council outcome, every market shift. The
                  result is analysis that gets more accurate over time. Based on the
                  Sunshine Coast, we have deep local knowledge that no interstate firm
                  and no generic model can replicate.
                </p>
              </div>
            </FadeIn>
          </div>
        </Container>
      </section>

      {/* Team */}
      <section className="section-padding bg-surface">
        <Container variant="wide">
          <SectionHeading
            badge="Our Team"
            title="Complementary expertise"
            subtitle="Development advisory requires both deal-making instinct and technical depth. Our founders bring both."
          />

          <div className="space-y-12 max-w-4xl mx-auto">
            {founders.map((person, index) => (
              <FadeIn key={person.name} delay={index * 0.15}>
                <div className="bg-canvas rounded-card p-8 md:p-10 border border-border/50">
                  <div className="flex flex-col md:flex-row md:items-start gap-6 md:gap-8">
                    <div className="w-20 h-20 rounded-2xl gradient-navy flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-serif text-2xl">
                        {person.initials}
                      </span>
                    </div>

                    <div className="flex-1">
                      <h3 className="font-serif text-2xl mb-1">{person.name}</h3>
                      <p className="text-sm text-text-tertiary mb-1">{person.role}</p>
                      <p className="text-sm font-medium text-casa-navy mb-4">{person.focus}</p>

                      <p className="text-text-secondary leading-relaxed mb-6">
                        {person.bio}
                      </p>

                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {person.credentials.map((credential) => (
                          <li
                            key={credential}
                            className="flex items-start gap-2.5 text-sm text-text-secondary"
                          >
                            <div className="w-1.5 h-1.5 rounded-full bg-casa-navy/30 mt-1.5 flex-shrink-0" />
                            {credential}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </Container>
      </section>

      {/* Approach */}
      <section className="section-padding bg-canvas">
        <Container variant="wide">
          <div className="max-w-3xl mx-auto text-center">
            <FadeIn>
              <SectionHeading
                badge="Our Approach"
                title="Technology-amplified expertise"
              />
            </FadeIn>
            <FadeIn delay={0.1}>
              <div className="text-text-secondary leading-relaxed space-y-6">
                <p>
                  Most firms rely on experience alone. We built a proprietary analytical
                  engine that processes hundreds of data points per site assessment,
                  then apply deep local expertise to produce insights no other firm can
                  replicate.
                </p>
                <p>
                  When we assess a site, our engine has already cross-referenced the
                  planning provisions, overlay interactions, comparable transactions, and
                  construction cost benchmarks. Our analysts then apply the local knowledge
                  that data alone can&apos;t capture: council tendencies, market timing,
                  design nuances. The result is intelligence that is genuinely decisive.
                </p>
              </div>
            </FadeIn>
          </div>
        </Container>
      </section>

      <ContactCTA />
    </>
  );
}
