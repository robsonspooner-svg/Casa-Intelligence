'use client';

import Logo from '@/components/brand/Logo';
import { cn } from '@/lib/utils';
import { Menu, Phone, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Services', href: '/services' },
  { name: 'Site Analyser', href: '/site-analyser' },
  { name: 'Articles', href: '/articles' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-border/50'
          : 'bg-transparent'
      )}
    >
      <div className="mx-auto max-w-[1600px] px-6 md:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Logo
            variant={isScrolled ? 'dark' : 'light'}
            size="sm"
            showSubtext={false}
          />

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'text-sm font-medium transition-colors duration-200',
                  pathname === item.href
                    ? isScrolled
                      ? 'text-casa-navy'
                      : 'text-white'
                    : isScrolled
                    ? 'text-text-secondary hover:text-casa-navy'
                    : 'text-white/70 hover:text-white'
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-4">
            <a
              href="tel:+61400000000"
              className={cn(
                'flex items-center gap-2 text-sm font-medium transition-colors',
                isScrolled
                  ? 'text-text-secondary hover:text-casa-navy'
                  : 'text-white/70 hover:text-white'
              )}
            >
              <Phone className="w-4 h-4" />
              <span>0400 000 000</span>
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center px-5 py-2.5 text-sm font-medium rounded-button bg-casa-navy text-white hover:bg-casa-navy-light transition-colors shadow-sm"
            >
              Get in Touch
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className={cn(
              'md:hidden p-2 rounded-lg transition-colors',
              isScrolled ? 'text-text-primary' : 'text-white'
            )}
          >
            {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileOpen && (
        <div className="md:hidden bg-white border-t border-border/50 shadow-lg">
          <div className="px-6 py-4 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'block py-3 text-base font-medium transition-colors',
                  pathname === item.href
                    ? 'text-casa-navy'
                    : 'text-text-secondary hover:text-casa-navy'
                )}
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-4 border-t border-border/50 space-y-3">
              <a
                href="tel:+61400000000"
                className="flex items-center gap-2 py-2 text-base text-text-secondary"
              >
                <Phone className="w-5 h-5" />
                0400 000 000
              </a>
              <Link
                href="/contact"
                className="block w-full text-center py-3 text-base font-medium rounded-button bg-casa-navy text-white"
              >
                Get in Touch
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
