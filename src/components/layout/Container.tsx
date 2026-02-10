import { cn } from '@/lib/utils';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'wide' | 'full';
}

const variantClasses = {
  default: 'max-w-7xl',
  wide: 'max-w-[1600px]',
  full: '',
};

export default function Container({ children, className, variant = 'default' }: ContainerProps) {
  return (
    <div className={cn('mx-auto w-full px-6 md:px-8', variantClasses[variant], className)}>
      {children}
    </div>
  );
}
