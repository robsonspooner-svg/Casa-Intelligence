import { LogoMark } from './Logo';

interface BrandDividerProps {
  variant?: 'light' | 'dark';
}

export default function BrandDivider({ variant = 'dark' }: BrandDividerProps) {
  return (
    <div className="flex items-center justify-center gap-4 py-2">
      <div
        className={`flex-1 max-w-[60px] h-px ${
          variant === 'light' ? 'bg-white/10' : 'bg-border/50'
        }`}
      />
      <LogoMark size="sm" variant={variant} />
      <div
        className={`flex-1 max-w-[60px] h-px ${
          variant === 'light' ? 'bg-white/10' : 'bg-border/50'
        }`}
      />
    </div>
  );
}
