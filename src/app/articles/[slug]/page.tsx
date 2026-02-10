import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Container from '@/components/layout/Container';
import FadeIn from '@/components/ui/FadeIn';
import ContactCTA from '@/components/sections/ContactCTA';
import ArticleSignature from '@/components/brand/ArticleSignature';
import { articles, getArticleBySlug } from '@/lib/articles';
import { articleContent } from '@/lib/article-content';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Clock } from 'lucide-react';

interface PageProps {
  params: { slug: string };
}

export function generateStaticParams() {
  return articles.map((article) => ({ slug: article.slug }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const article = getArticleBySlug(params.slug);
  if (!article) return {};

  return {
    title: article.title,
    description: article.description,
    keywords: article.keywords,
    openGraph: {
      title: article.title,
      description: article.description,
      type: 'article',
      publishedTime: article.date,
      authors: [article.author],
    },
  };
}

function renderInlineMarkdown(text: string): (string | JSX.Element)[] {
  const parts: (string | JSX.Element)[] = [];
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  let lastIndex = 0;
  let inlineKey = 0;
  let match;

  while ((match = linkRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    const isInternal = match[2].startsWith('/');
    if (isInternal) {
      parts.push(
        <Link key={`link-${inlineKey++}`} href={match[2]} className="text-casa-navy hover:underline font-medium">
          {match[1]}
        </Link>
      );
    } else {
      parts.push(
        <a key={`link-${inlineKey++}`} href={match[2]} className="text-casa-navy hover:underline font-medium" target="_blank" rel="noopener noreferrer">
          {match[1]}
        </a>
      );
    }
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? parts : [text];
}

function renderMarkdown(content: string) {
  const lines = content.trim().split('\n');
  const elements: JSX.Element[] = [];
  let key = 0;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      continue;
    }
    if (trimmed.startsWith('## ')) {
      elements.push(
        <h2 key={key++} className="font-serif text-2xl md:text-3xl text-text-primary mt-12 mb-4">
          {trimmed.replace('## ', '')}
        </h2>
      );
    } else if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
      elements.push(
        <p key={key++} className="text-text-primary font-semibold leading-relaxed mb-4">
          {trimmed.replace(/\*\*/g, '')}
        </p>
      );
    } else if (trimmed.startsWith('**')) {
      const boldEnd = trimmed.indexOf('**', 2);
      if (boldEnd > 0) {
        const boldText = trimmed.slice(2, boldEnd);
        const rest = trimmed.slice(boldEnd + 2);
        elements.push(
          <p key={key++} className="text-text-secondary leading-relaxed mb-4">
            <strong className="text-text-primary">{boldText}</strong>{...renderInlineMarkdown(rest)}
          </p>
        );
      } else {
        elements.push(
          <p key={key++} className="text-text-secondary leading-relaxed mb-4">{...renderInlineMarkdown(trimmed)}</p>
        );
      }
    } else {
      elements.push(
        <p key={key++} className="text-text-secondary leading-relaxed mb-4">{...renderInlineMarkdown(trimmed)}</p>
      );
    }
  }

  return elements;
}

export default function ArticlePage({ params }: PageProps) {
  const article = getArticleBySlug(params.slug);
  const content = articleContent[params.slug];

  if (!article || !content) {
    notFound();
  }

  // Find related articles (same category, excluding current)
  const related = articles
    .filter((a) => a.category === article.category && a.slug !== article.slug)
    .slice(0, 2);

  // If not enough from same category, fill from other articles
  if (related.length < 2) {
    const others = articles.filter((a) => a.slug !== article.slug && !related.includes(a));
    related.push(...others.slice(0, 2 - related.length));
  }

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    datePublished: article.date,
    author: {
      '@type': 'Person',
      name: article.author,
      jobTitle: article.authorRole,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Casa Intelligence',
      url: 'https://casaintelligence.com.au',
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://casaintelligence.com.au/articles/${article.slug}`,
    },
    keywords: article.keywords.join(', '),
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://casaintelligence.com.au',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Articles',
        item: 'https://casaintelligence.com.au/articles',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: article.title,
        item: `https://casaintelligence.com.au/articles/${article.slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {/* Article Header */}
      <section className="gradient-hero pt-32 pb-16 md:pt-40 md:pb-20">
        <Container variant="wide">
          <div className="max-w-3xl mx-auto">
            <FadeIn>
              <Link
                href="/articles"
                className="inline-flex items-center gap-1.5 text-sm text-white/40 hover:text-white/70 transition-colors mb-8"
              >
                <ArrowLeft className="w-4 h-4" />
                All articles
              </Link>
            </FadeIn>
            <FadeIn delay={0.1}>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-[10px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full bg-white/10 text-white/60">
                  {article.category}
                </span>
                <span className="flex items-center gap-1 text-xs text-white/40">
                  <Clock className="w-3 h-3" />
                  {article.readTime}
                </span>
              </div>
            </FadeIn>
            <FadeIn delay={0.15}>
              <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl text-white leading-[1.15] mb-6">
                {article.title}
              </h1>
            </FadeIn>
            <FadeIn delay={0.2}>
              <div className="flex items-center gap-3 text-sm text-white/50">
                <span>{article.author}</span>
                <span className="text-white/20">&middot;</span>
                <span>{article.authorRole}</span>
                <span className="text-white/20">&middot;</span>
                <time dateTime={article.date}>
                  {new Date(article.date).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })}
                </time>
              </div>
            </FadeIn>
          </div>
        </Container>
      </section>

      {/* Article Body */}
      <section className="section-padding bg-canvas">
        <Container variant="wide">
          <FadeIn>
            <article className="max-w-3xl mx-auto prose-lg">
              {renderMarkdown(content)}
              <ArticleSignature
                author={article.author}
                authorRole={article.authorRole}
                date={article.date}
              />
            </article>
          </FadeIn>
        </Container>
      </section>

      {/* Related Articles */}
      {related.length > 0 && (
        <section className="section-padding bg-surface">
          <Container variant="wide">
            <h2 className="font-serif text-2xl text-text-primary mb-8">Related articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/articles/${r.slug}`}
                  className="group block bg-canvas rounded-card border border-border/50 p-6 hover:shadow-card-hover transition-shadow"
                >
                  <span className="text-[10px] font-semibold tracking-wider uppercase text-casa-navy">{r.category}</span>
                  <h3 className="font-serif text-lg text-text-primary mt-2 mb-2 group-hover:text-casa-navy transition-colors">
                    {r.title}
                  </h3>
                  <p className="text-sm text-text-secondary leading-relaxed mb-3 line-clamp-2">
                    {r.description}
                  </p>
                  <span className="inline-flex items-center gap-1 text-sm font-medium text-casa-navy">
                    Read article <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </Link>
              ))}
            </div>
          </Container>
        </section>
      )}

      <ContactCTA />
    </>
  );
}
