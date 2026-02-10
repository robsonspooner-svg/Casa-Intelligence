import { cn } from '@/lib/utils';
import Link from 'next/link';

interface LogoProps {
  variant?: 'light' | 'dark';
  showSubtext?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  linked?: boolean;
}

/**
 * Casa Intelligence logo.
 *
 * Pure typographic wordmark -- no icon, no symbol, no container.
 * The logo IS the name set in Cormorant Garamond. Premium brands
 * don't need a glyph. The typography does the work.
 *
 * For contexts that need a standalone mark (favicon, app icon),
 * the LogoMark component renders a single typographic "C" on
 * a navy background.
 */
function LogoMark({ size, variant }: { size: 'sm' | 'md' | 'lg'; variant: 'light' | 'dark' }) {
  const dimensions = {
    sm: 30,
    md: 36,
    lg: 46,
  };
  const d = dimensions[size];

  const bgFill = variant === 'light' ? 'rgba(255,255,255,0.08)' : '#1B1464';
  const bgStroke = variant === 'light' ? 'rgba(255,255,255,0.12)' : 'none';
  const textFill = 'white';

  // Font sizes relative to the container
  const fontSize = {
    sm: 20,
    md: 24,
    lg: 30,
  };

  return (
    <svg
      width={d}
      height={d}
      viewBox="0 0 44 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="flex-shrink-0"
    >
      <rect
        x="0.5"
        y="0.5"
        width="43"
        height="43"
        rx="10"
        fill={bgFill}
        stroke={bgStroke}
      />
      <text
        x="22"
        y="23"
        textAnchor="middle"
        dominantBaseline="central"
        fill={textFill}
        fontFamily="Georgia, 'Times New Roman', serif"
        fontSize={fontSize[size]}
        fontWeight="400"
        letterSpacing="-0.02em"
      >
        C
      </text>
    </svg>
  );
}

export default function Logo({
  variant = 'dark',
  showSubtext = false,
  size = 'md',
  className,
  linked = true,
}: LogoProps) {
  const textSizes = {
    sm: 'text-[17px]',
    md: 'text-xl',
    lg: 'text-3xl',
  };

  const subtextSizes = {
    sm: 'text-[7px] tracking-[0.18em]',
    md: 'text-[9px] tracking-[0.2em]',
    lg: 'text-[10px] tracking-[0.2em]',
  };

  const content = (
    <div className={cn('flex items-center', className)}>
      <span
        className={cn(
          'font-logo leading-none font-medium tracking-[0.02em]',
          textSizes[size],
          variant === 'light' ? 'text-white' : 'text-casa-navy'
        )}
      >
        Casa Intelligence
      </span>
      {showSubtext && (
        <span
          className={cn(
            'uppercase ml-3 font-sans border-l pl-3',
            subtextSizes[size],
            variant === 'light'
              ? 'text-white/35 border-white/15'
              : 'text-text-tertiary border-border'
          )}
        >
          Development Intelligence
        </span>
      )}
    </div>
  );

  if (linked) {
    return (
      <Link href="/" className="hover:opacity-90 transition-opacity">
        {content}
      </Link>
    );
  }

  return content;
}

export { LogoMark };
