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
  TrendingUp,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Services',
  description:
    'Development feasibility reports, pre-development management, and proprietary development services on the Sunshine Coast.',
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

const managementServices = [
  'Town planner engagement and management',
  'Architectural design coordination',
  'Engineering consultant procurement',
  'Council pre-lodgement meetings',
  'Development application preparation',
  'DA lodgement and tracking',
  'Builder tendering and selection',
  'Financial structuring and capital advisory',
  'Timeline management and milestone tracking',
  'Stakeholder communication and reporting',
];

export default function ServicesPage() {
  return (
    <>
      {/* Hero */}
      <section className="gradient-hero pt-32 pb-20 md:pt-40 md:pb-28">
        <Container>
          <div className="max-w-3xl">
            <FadeIn>
              <span className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-white/40 mb-4">
                Our Services
              </span>
            </FadeIn>
            <FadeIn delay={0.1}>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white leading-[1.1] mb-6">
                From feasibility
                <br />
                <span className="text-white/60">to finished development</span>
              </h1>
            </FadeIn>
            <FadeIn delay={0.2}>
              <p className="text-lg md:text-xl text-white/50 leading-relaxed max-w-2xl">
                Three integrated service tiers designed to take your site from question
                mark to development pathway. Start with the intelligence you need today.
              </p>
            </FadeIn>
          </div>
        </Container>
      </section>

      {/* Service 1: Feasibility Reports */}
      <section className="section-padding bg-canvas" id="feasibility">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            <FadeIn direction="left">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-casa-navy/5 flex items-center justify-center">
                    <ClipboardCheck className="w-6 h-6 text-casa-navy" />
                  </div>
                  <div>
                    <h2 className="font-serif text-2xl md:text-3xl">
                      Development Feasibility Reports
                    </h2>
                  </div>
                </div>

                <p className="text-sm font-semibold text-casa-navy mb-4">From $8,000 — delivered in 5–7 business days</p>

                <p className="text-text-secondary leading-relaxed mb-6">
                  Our flagship service. A single, integrated report that covers planning
                  analysis, architectural yield, and financial modelling. This is the work
                  that traditionally requires three separate consultants, $30,000–$50,000,
                  and four to eight weeks of coordination.
                </p>

                <p className="text-text-secondary leading-relaxed mb-8">
                  We deliver it in one report, in under a week, for a fraction of the
                  cost. The result is a clear, actionable assessment of your site&apos;s
                  development potential — with a recommendation you can act on.
                </p>

                <Button href="/contact" size="lg">
                  Request a Feasibility Report
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </div>
            </FadeIn>

            <FadeIn direction="right" delay={0.15}>
              <Card className="p-8">
                <div className="flex items-center gap-2 mb-6">
                  <FileText className="w-5 h-5 text-casa-navy" />
                  <h3 className="font-semibold">What&apos;s Included</h3>
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
        <Container>
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

                <p className="text-sm font-semibold text-casa-navy mb-4">3–5% of total development cost</p>

                <p className="text-text-secondary leading-relaxed mb-6">
                  For sites that proceed past feasibility, we manage the entire
                  pre-construction process. From consultant procurement through to DA
                  approval and builder tendering, we act as your development manager
                  — coordinating the complexity so you can focus on the opportunity.
                </p>

                <p className="text-text-secondary leading-relaxed mb-8">
                  On a typical $5M townhouse development, this generates $150,000–$250,000
                  in management fees. For you, it means a single point of accountability
                  for the most complex phase of any development.
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
                  <FileText className="w-5 h-5 text-casa-navy" />
                  <h3 className="font-semibold">Services Included</h3>
                </div>
                <ul className="space-y-3">
                  {managementServices.map((item) => (
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

      {/* Service 3: Proprietary Development */}
      <section className="section-padding bg-canvas" id="development">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <FadeIn>
              <div className="w-12 h-12 rounded-xl bg-casa-navy/5 flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="w-6 h-6 text-casa-navy" />
              </div>
              <span className="inline-block text-[10px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full bg-gold/10 text-gold mb-4">
                Coming 2027
              </span>
              <h2 className="font-serif text-2xl md:text-3xl mb-4">
                Proprietary Development
              </h2>
              <p className="text-text-secondary leading-relaxed mb-6">
                Our advisory work gives us unique visibility into the development pipeline.
                From 2027, Casa Intelligence will participate directly in high-potential
                developments — as joint venture partners or sole developers — capturing
                the full development margin rather than advisory fees.
              </p>
              <p className="text-text-secondary leading-relaxed mb-8">
                If you have a site with strong fundamentals and are looking for a development
                partner with deep local expertise, we&apos;d like to hear from you.
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
