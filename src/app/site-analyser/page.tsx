import Brand from '@/components/brand/Brand';
import dynamic from 'next/dynamic';
import Container from '@/components/layout/Container';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Site Analyser | Free Development Feasibility Tool | Sunshine Coast',
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

const SiteAnalyser = dynamic(() => import('@/components/analyser/SiteAnalyser'), {
  ssr: false,
});

export default function SiteAnalyserPage() {
  return (
    <>
      {/* Header */}
      <section className="gradient-hero pt-28 pb-10 md:pt-36 md:pb-14">
        <Container variant="wide">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-white/50 mb-3">
              <Brand>Intelligence</Brand> Preview
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

      {/* Analyser */}
      <section className="py-6 bg-canvas">
        <Container variant="full">
          <SiteAnalyser />
        </Container>
      </section>

      {/* Disclaimer */}
      <section className="pb-12 bg-canvas">
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
