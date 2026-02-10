import { cn } from '@/lib/utils';

interface SectionHeadingProps {
  badge?: React.ReactNode;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  align?: 'left' | 'center';
  light?: boolean;
}

export default function SectionHeading({
  badge,
  title,
  subtitle,
  align = 'center',
  light = false,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        'max-w-3xl mb-16',
        align === 'center' && 'mx-auto text-center',
        align === 'left' && 'text-left'
      )}
    >
      {badge && (
        <span
          className={cn(
            'inline-block text-xs font-semibold tracking-[0.15em] uppercase mb-4 px-3 py-1 rounded-full',
            light
              ? 'text-white/70 bg-white/10'
              : 'text-casa-navy bg-casa-navy/5'
          )}
        >
          {badge}
        </span>
      )}
      <h2
        className={cn(
          'font-serif text-3xl md:text-4xl lg:text-[42px] leading-tight text-balance',
          light ? 'text-white' : 'text-text-primary'
        )}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={cn(
            'mt-4 text-lg md:text-xl leading-relaxed',
            light ? 'text-white/70' : 'text-text-secondary'
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
