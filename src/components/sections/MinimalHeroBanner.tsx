import Brand from '@/components/brand/Brand';
import Container from '@/components/layout/Container';

export default function MinimalHeroBanner() {
  return (
    <section className="gradient-hero pt-28 pb-10 md:pt-36 md:pb-14">
      <Container variant="wide">
        <div className="max-w-3xl mx-auto text-center">
          <span className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-white/50 mb-4">
            South East Queensland Property <Brand>Intelligence</Brand>
          </span>
          <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl text-white leading-tight mb-4">
            Know what your property is really worth
          </h1>
          <p className="text-sm md:text-base text-white/60 leading-relaxed max-w-2xl mx-auto">
            Subdivision eligibility, development feasibility, zoning analysis, and uplift
            estimates — powered by live government data across all of South East Queensland.
            From preliminary reports to full project delivery.
          </p>
        </div>
      </Container>
    </section>
  );
}
