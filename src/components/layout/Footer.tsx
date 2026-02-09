import { Mail, MapPin, Phone } from 'lucide-react';
import Link from 'next/link';
import Container from './Container';

const footerLinks = {
  services: [
    { name: 'Feasibility Reports', href: '/services#feasibility' },
    { name: 'Pre-Development Management', href: '/services#management' },
    { name: 'Proprietary Development', href: '/services#development' },
  ],
  company: [
    { name: 'About Us', href: '/about' },
    { name: 'Contact', href: '/contact' },
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-casa-navy-dark text-white/70">
      <Container className="py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                <span className="text-white font-serif text-sm font-bold">C</span>
              </div>
              <span className="font-serif text-lg text-white">Casa Intelligence</span>
            </div>
            <p className="text-sm leading-relaxed mb-6">
              Development intelligence and advisory for the Sunshine Coast.
              Planning, architecture, and financial feasibility in one integrated report.
            </p>
            <div className="space-y-3 text-sm">
              <a
                href="tel:+61400000000"
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <Phone className="w-4 h-4 flex-shrink-0" />
                0400 000 000
              </a>
              <a
                href="mailto:hello@casaintelligence.com.au"
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <Mail className="w-4 h-4 flex-shrink-0" />
                hello@casaintelligence.com.au
              </a>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                Sunshine Coast, Queensland
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              Services
            </h3>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              Company
            </h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Get Started */}
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              Get Started
            </h3>
            <p className="text-sm leading-relaxed mb-6">
              Wondering what your site can do? Get in touch for a free initial consultation.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center px-5 py-2.5 text-sm font-medium rounded-button bg-white/10 text-white hover:bg-white/20 transition-colors border border-white/10"
            >
              Book a Consultation
            </Link>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-white/40">
            &copy; {new Date().getFullYear()} Casa Intelligence Pty Ltd. All rights reserved.
          </p>
          <p className="text-xs text-white/40">
            Part of Casa Group
          </p>
        </div>
      </Container>
    </footer>
  );
}
