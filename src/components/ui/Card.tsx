import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
}

export default function Card({ className, hover = false, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'bg-surface rounded-card p-6 shadow-card border border-border/50',
        hover && 'transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
