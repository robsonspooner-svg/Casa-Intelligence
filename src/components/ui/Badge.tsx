import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'gold' | 'navy';
  className?: string;
}

export default function Badge({ children, variant = 'default', className }: BadgeProps) {
  const variants = {
    default: 'bg-casa-navy/5 text-casa-navy',
    gold: 'bg-gold/10 text-gold',
    navy: 'bg-white/10 text-white',
  };

  return (
    <span
      className={cn(
        'inline-block text-xs font-semibold tracking-wider uppercase px-3 py-1 rounded-full',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
