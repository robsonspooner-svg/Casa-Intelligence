export interface Article {
  slug: string;
  title: string;
  description: string;
  date: string;
  author: string;
  authorRole: string;
  readTime: string;
  category: string;
  keywords: string[];
}

export const articles: Article[] = [
  {
    slug: 'most-development-mistakes-happen-before-you-break-ground',
    title: 'Most development mistakes happen before you break ground',
    description: 'The biggest losses in property development rarely come from construction blowouts. They come from decisions made months earlier, when developers commit to sites without understanding what the numbers actually say.',
    date: '2026-02-10',
    author: 'Robert Spooner',
    authorRole: 'Co-Founder, Casa Intelligence',
    readTime: '6 min read',
    category: 'Development Strategy',
    keywords: ['property development mistakes', 'development feasibility', 'sunshine coast development', 'pre-development risk', 'site feasibility analysis'],
  },
  {
    slug: 'sunshine-coast-planning-scheme-what-developers-miss',
    title: 'What most developers miss about the Sunshine Coast Planning Scheme',
    description: 'The Sunshine Coast Planning Scheme is one of the most layered planning instruments in Queensland. Developers who treat it as a simple zoning check are the ones who get caught out.',
    date: '2026-02-08',
    author: 'Robert Spooner',
    authorRole: 'Co-Founder, Casa Intelligence',
    readTime: '8 min read',
    category: 'Planning Intelligence',
    keywords: ['sunshine coast planning scheme', 'queensland development approval', 'planning overlays', 'development assessment', 'council approval process'],
  },
  {
    slug: 'queensland-development-feasibility-what-the-numbers-need-to-show',
    title: 'Queensland development feasibility: what the numbers actually need to show',
    description: 'A feasibility study that only tells you the profit margin is missing the point. The real value is in what it tells you about risk, timing, and whether the project can survive a bad quarter.',
    date: '2026-02-05',
    author: 'Robert Spooner',
    authorRole: 'Co-Founder, Casa Intelligence',
    readTime: '7 min read',
    category: 'Feasibility Analysis',
    keywords: ['development feasibility queensland', 'feasibility report', 'property development finance', 'development pro forma', 'queensland property development'],
  },
  {
    slug: 'sunshine-coast-infill-development-the-next-five-years',
    title: 'Sunshine Coast infill development: what the next five years look like',
    description: 'With 84,800 new dwellings needed by 2046 and 60% mandated as infill, the maths is simple. The window for acquiring well-zoned sites at reasonable prices is closing faster than most people realise.',
    date: '2026-02-01',
    author: 'Finlay Schulz',
    authorRole: 'Co-Founder, Casa Intelligence',
    readTime: '7 min read',
    category: 'Market Intelligence',
    keywords: ['sunshine coast infill development', 'sunshine coast property market', 'SEQ property development', 'sunshine coast housing supply', 'medium density development queensland'],
  },
  {
    slug: 'why-three-consultants-cost-more-than-one-integrated-assessment',
    title: 'Why three consultants cost you more than one integrated assessment',
    description: 'Hiring a planner, architect, and QS separately sounds thorough. In practice, it produces three reports that do not talk to each other, and the gaps between them are where the real risk lives.',
    date: '2026-01-28',
    author: 'Robert Spooner',
    authorRole: 'Co-Founder, Casa Intelligence',
    readTime: '5 min read',
    category: 'Development Strategy',
    keywords: ['development consultants', 'feasibility assessment', 'pre-development costs', 'development advisory sunshine coast', 'integrated feasibility analysis'],
  },
  {
    slug: 'how-overlays-quietly-kill-development-margins',
    title: 'How overlays quietly kill development margins on the Sunshine Coast',
    description: 'A site can look perfect on paper: good zoning, reasonable price, strong demand. Then you discover the flood overlay, the bushfire management area, or the heritage constraint that nobody mentioned.',
    date: '2026-01-24',
    author: 'Robert Spooner',
    authorRole: 'Co-Founder, Casa Intelligence',
    readTime: '6 min read',
    category: 'Planning Intelligence',
    keywords: ['planning overlays sunshine coast', 'flood overlay development', 'bushfire overlay queensland', 'heritage overlay property', 'development constraints queensland'],
  },
  {
    slug: 'sunshine-coast-townhouse-development-what-you-need-to-know',
    title: 'Sunshine Coast townhouse development: what you need to know in 2026',
    description: 'Townhouses are the dominant product type for infill development on the Sunshine Coast. But the economics are tighter than most people expect, and getting the product mix right is the difference between a strong return and a marginal one.',
    date: '2026-01-20',
    author: 'Robert Spooner',
    authorRole: 'Co-Founder, Casa Intelligence',
    readTime: '7 min read',
    category: 'Market Intelligence',
    keywords: ['sunshine coast townhouse development', 'townhouse feasibility', 'townhouse development queensland', 'medium density sunshine coast', 'townhouse construction cost sunshine coast'],
  },
  {
    slug: 'infrastructure-charges-sunshine-coast-the-hidden-cost',
    title: 'Infrastructure charges on the Sunshine Coast: the cost developers underestimate',
    description: 'Infrastructure charges on the Sunshine Coast can run $28,000 to $35,000 per dwelling. On a six-unit project, that is over $200,000 before you have built anything. Yet they are routinely underestimated in early-stage feasibility.',
    date: '2026-01-16',
    author: 'Robert Spooner',
    authorRole: 'Co-Founder, Casa Intelligence',
    readTime: '5 min read',
    category: 'Feasibility Analysis',
    keywords: ['infrastructure charges sunshine coast', 'sunshine coast council charges', 'development contributions queensland', 'infrastructure charges queensland', 'development cost sunshine coast'],
  },
  {
    slug: 'buying-a-development-site-sunshine-coast-due-diligence-checklist',
    title: 'Buying a development site on the Sunshine Coast: due diligence checklist',
    description: 'A practical checklist for anyone considering purchasing a development site on the Sunshine Coast. What to verify, what to question, and what the contract conditions should look like before you commit.',
    date: '2026-01-12',
    author: 'Finlay Schulz',
    authorRole: 'Co-Founder, Casa Intelligence',
    readTime: '8 min read',
    category: 'Development Strategy',
    keywords: ['buying development site sunshine coast', 'development site due diligence', 'property development checklist', 'site acquisition sunshine coast', 'development land purchase queensland'],
  },
  {
    slug: 'da-approval-sunshine-coast-what-to-expect',
    title: 'DA approval on the Sunshine Coast: timelines, costs, and what to expect',
    description: 'The development application process on the Sunshine Coast is longer and more complex than most developers anticipate. Understanding the process, typical timelines, and common pitfalls can save you months and tens of thousands of dollars.',
    date: '2026-01-08',
    author: 'Robert Spooner',
    authorRole: 'Co-Founder, Casa Intelligence',
    readTime: '7 min read',
    category: 'Planning Intelligence',
    keywords: ['DA approval sunshine coast', 'development application queensland', 'sunshine coast council DA', 'development approval process', 'DA timeline sunshine coast', 'council approval sunshine coast'],
  },
];

export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}

export function getArticlesByCategory(category: string): Article[] {
  return articles.filter((a) => a.category === category);
}
