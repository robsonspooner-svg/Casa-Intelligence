'use client';

import { cn } from '@/lib/utils';
import Link from 'next/link';
import { forwardRef } from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', href, children, ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium transition-all duration-200 rounded-button focus:outline-none focus:ring-2 focus:ring-casa-navy/20 focus:ring-offset-2 disabled:opacity-40 disabled:cursor-not-allowed';

    const variants = {
      primary:
        'bg-casa-navy text-white hover:bg-casa-navy-light active:bg-casa-navy-dark shadow-sm hover:shadow-md',
      secondary:
        'bg-white text-casa-navy border-[1.5px] border-casa-navy hover:bg-casa-navy hover:text-white',
      outline:
        'bg-transparent text-white border-[1.5px] border-white/30 hover:bg-white/10 hover:border-white/60',
      ghost:
        'bg-transparent text-text-secondary hover:text-casa-navy hover:bg-subtle',
    };

    const sizes = {
      sm: 'text-sm px-4 py-2 gap-1.5',
      md: 'text-[15px] px-6 py-3 gap-2',
      lg: 'text-base px-8 py-4 gap-2.5',
    };

    const classes = cn(baseStyles, variants[variant], sizes[size], className);

    if (href) {
      // Use Next.js Link for internal routes (prefetching + client-side nav)
      // Use plain <a> for external URLs and tel:/mailto: links
      const isInternal = href.startsWith('/');
      if (isInternal) {
        return (
          <Link href={href} className={classes} prefetch={true}>
            {children}
          </Link>
        );
      }
      return (
        <a href={href} className={classes}>
          {children}
        </a>
      );
    }

    return (
      <button
        ref={ref}
        className={classes}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
