import Brand from './Brand';
import { LogoMark } from './Logo';
import Link from 'next/link';

interface ArticleSignatureProps {
  author: string;
  authorRole: string;
  date: string;
}

export default function ArticleSignature({ author, authorRole, date }: ArticleSignatureProps) {
  return (
    <div className="mt-16 pt-10 border-t border-border/50">
      {/* Signature line */}
      <div className="flex items-start gap-4">
        <LogoMark size="sm" variant="dark" />
        <div className="flex-1">
          <p className="font-logo text-lg text-text-primary leading-tight">
            {author}
          </p>
          <p className="text-sm text-text-tertiary mt-0.5">
            {authorRole}
          </p>
          <time
            dateTime={date}
            className="block text-xs text-text-tertiary mt-2"
          >
            {new Date(date).toLocaleDateString('en-AU', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </time>
        </div>
      </div>

      {/* CTA strip */}
      <div className="mt-8 p-5 rounded-card bg-subtle border border-border/50">
        <p className="text-sm text-text-secondary leading-relaxed">
          <Brand>Casa Intelligence</Brand> provides proprietary development feasibility analysis for the Sunshine Coast and South East Queensland.
          If you have a site you are considering,{' '}
          <Link href="/contact" className="text-casa-navy font-medium hover:underline">
            get in touch
          </Link>{' '}
          for a free initial consultation.
        </p>
      </div>
    </div>
  );
}
