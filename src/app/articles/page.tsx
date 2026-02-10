import { Metadata } from 'next';
import Container from '@/components/layout/Container';
import FadeIn from '@/components/ui/FadeIn';
import { articles } from '@/lib/articles';
import Link from 'next/link';
import { ArrowRight, Clock } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Articles | Development Intelligence for Queensland',
  description:
    'Insights on property development feasibility, planning intelligence, and market analysis for the Sunshine Coast and South East Queensland. Written by local development specialists.',
  keywords: [
    'property development articles',
    'sunshine coast development insights',
    'queensland development feasibility',
    'development planning advice',
    'SEQ property market analysis',
    'sunshine coast property intelligence',
    'development feasibility queensland',
  ],
  alternates: {
    canonical: 'https://casaintelligence.com.au/articles',
  },
  openGraph: {
    title: 'Articles | Development Intelligence for Queensland',
    description:
      'Insights on property development feasibility, planning intelligence, and market analysis for the Sunshine Coast.',
    type: 'website',
    url: 'https://casaintelligence.com.au/articles',
  },
};

export default function ArticlesPage() {
  const featured = articles[0];
  const rest = articles.slice(1);

  return (
    <>
      {/* Hero */}
      <section className="gradient-hero pt-32 pb-20 md:pt-40 md:pb-28">
        <Container variant="wide">
          <div className="max-w-3xl">
            <FadeIn>
              <span className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-white/40 mb-4">
                Articles
              </span>
            </FadeIn>
            <FadeIn delay={0.1}>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white leading-[1.1] mb-6">
                Development intelligence,
                <br />
                <span className="text-white/60">written by practitioners</span>
              </h1>
            </FadeIn>
            <FadeIn delay={0.2}>
              <p className="text-lg md:text-xl text-white/50 leading-relaxed max-w-2xl">
                Insights from the people who actually run the numbers, assess the sites, and
                navigate the planning schemes. No theory. No filler. Just what we see on the
                ground in South East Queensland.
              </p>
            </FadeIn>
          </div>
        </Container>
      </section>

      {/* Featured Article */}
      <section className="section-padding bg-canvas">
        <Container variant="wide">
          <FadeIn>
            <Link
              href={`/articles/${featured.slug}`}
              className="group block bg-surface rounded-card border border-border/50 p-8 md:p-12 hover:shadow-card-hover transition-shadow"
            >
              <div className="max-w-3xl">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-[10px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full bg-casa-navy/5 text-casa-navy">
                    {featured.category}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-text-tertiary">
                    <Clock className="w-3 h-3" />
                    {featured.readTime}
                  </span>
                </div>
                <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl text-text-primary mb-4 group-hover:text-casa-navy transition-colors">
                  {featured.title}
                </h2>
                <p className="text-text-secondary leading-relaxed mb-6 text-lg">
                  {featured.description}
                </p>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-text-tertiary">
                    {featured.author} &middot; {new Date(featured.date).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-sm font-medium text-casa-navy group-hover:gap-2.5 transition-all">
                    Read article
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </Link>
          </FadeIn>
        </Container>
      </section>

      {/* Article Grid */}
      <section className="section-padding bg-surface">
        <Container variant="wide">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rest.map((article, i) => (
              <FadeIn key={article.slug} delay={i * 0.1}>
                <Link
                  href={`/articles/${article.slug}`}
                  className="group block bg-canvas rounded-card border border-border/50 p-6 hover:shadow-card-hover transition-shadow h-full"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-[10px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full bg-casa-navy/5 text-casa-navy">
                      {article.category}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-text-tertiary">
                      <Clock className="w-3 h-3" />
                      {article.readTime}
                    </span>
                  </div>
                  <h3 className="font-serif text-lg text-text-primary mb-2 group-hover:text-casa-navy transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-sm text-text-secondary leading-relaxed mb-4">
                    {article.description}
                  </p>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-xs text-text-tertiary">
                      {new Date(article.date).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                    <ArrowRight className="w-4 h-4 text-casa-navy/40 group-hover:text-casa-navy transition-colors" />
                  </div>
                </Link>
              </FadeIn>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
