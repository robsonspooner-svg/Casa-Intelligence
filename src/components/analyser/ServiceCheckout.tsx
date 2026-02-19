'use client';

import { useState } from 'react';
import { ArrowRight, Check, Loader2, MessageSquare } from 'lucide-react';
import Brand from '@/components/brand/Brand';
import Link from 'next/link';
import type { ServiceKey, ServiceTier } from '@/lib/stripe';

interface ServiceCheckoutProps {
  /** Which services to show */
  services: ServiceKey[];
  /** The address being analysed (stored as Stripe metadata) */
  address?: string;
}

const SERVICE_DATA: Record<ServiceKey, ServiceTier> = {
  preliminary: {
    id: 'preliminary',
    name: 'Preliminary Report',
    price: 1500,
    priceFormatted: '$1,500 + GST',
    description: 'Desktop assessment with zoning confirmation and lot yield estimate',
    features: [
      'Zoning & overlay confirmation',
      'Lot yield estimate',
      'High-level feasibility summary',
      'Delivered within 5 business days',
    ],
  },
  subdivision: {
    id: 'subdivision',
    name: 'Subdivision Consulting',
    price: 10000,
    priceFormatted: '$10,000 + GST',
    description: 'Expert consulting from DA strategy to title registration',
    features: [
      'Everything in Preliminary Report',
      'DA strategy & lodgement support',
      'Council liaison & negotiation',
      'End-to-end consulting to completion',
    ],
  },
  feasibility: {
    id: 'feasibility',
    name: 'Development Feasibility',
    price: 0,
    priceFormatted: 'Custom quote',
    description: 'Comprehensive feasibility study tailored to your project',
    features: [
      'Detailed yield study & massing',
      'Financial modelling & sensitivity',
      'Infrastructure assessment',
      'Go / no-go recommendation',
    ],
  },
};

export default function ServiceCheckout({ services, address }: ServiceCheckoutProps) {
  const [email, setEmail] = useState('');
  const [loadingService, setLoadingService] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async (serviceKey: ServiceKey) => {
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    setLoadingService(serviceKey);
    setError(null);

    try {
      const res = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service: serviceKey,
          email,
          address: address || '',
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setLoadingService(null);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h4 className="font-serif text-lg text-text-primary mb-1">
          Take the next step
        </h4>
        <p className="text-sm text-text-secondary leading-relaxed">
          Choose a <Brand>Casa Intelligence</Brand> service to unlock the full potential of your property.
        </p>
      </div>

      {/* Email input */}
      <div>
        <label htmlFor="checkout-email" className="block text-xs font-medium text-text-secondary mb-1.5">
          Your email address
        </label>
        <input
          id="checkout-email"
          type="email"
          value={email}
          onChange={(e) => { setEmail(e.target.value); setError(null); }}
          placeholder="you@example.com"
          className="w-full px-4 py-2.5 rounded-xl border border-border/50 bg-surface text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-casa-navy/20 focus:border-casa-navy/40 transition-colors"
        />
        {error && (
          <p className="text-xs text-red-600 mt-1.5">{error}</p>
        )}
      </div>

      {/* Service cards */}
      <div className={`grid gap-3 ${services.length > 1 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'}`}>
        {services.map((key) => {
          const service = SERVICE_DATA[key];
          const isLoading = loadingService === key;
          const isPrimary = key !== 'preliminary';

          return (
            <div
              key={key}
              className={`rounded-xl border p-4 flex flex-col ${
                isPrimary
                  ? 'bg-casa-navy text-white border-casa-navy'
                  : 'bg-surface border-border/50'
              }`}
            >
              <div className="mb-3">
                <p className={`text-xs font-medium uppercase tracking-wider mb-1 ${isPrimary ? 'text-white/60' : 'text-text-tertiary'}`}>
                  {service.name}
                </p>
                <p className={`text-xl font-serif font-bold ${isPrimary ? 'text-white' : 'text-casa-navy'}`}>
                  {service.priceFormatted}
                </p>
              </div>

              <ul className="space-y-1.5 mb-4 flex-1">
                {service.features.map((feat) => (
                  <li key={feat} className="flex items-start gap-2">
                    <Check className={`w-3.5 h-3.5 flex-shrink-0 mt-0.5 ${isPrimary ? 'text-emerald-400' : 'text-emerald-600'}`} />
                    <span className={`text-xs leading-relaxed ${isPrimary ? 'text-white/85' : 'text-text-secondary'}`}>
                      {feat}
                    </span>
                  </li>
                ))}
              </ul>

              {/* Feasibility = custom quote → link to contact form instead of Stripe */}
              {key === 'feasibility' ? (
                <Link
                  href={`/contact?service=feasibility${address ? `&address=${encodeURIComponent(address)}` : ''}`}
                  className={`w-full py-2.5 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-colors ${
                    isPrimary
                      ? 'bg-white text-casa-navy hover:bg-white/90'
                      : 'bg-casa-navy text-white hover:bg-casa-navy-light'
                  }`}
                >
                  Request a Quote <MessageSquare className="w-4 h-4" />
                </Link>
              ) : (
                <button
                  onClick={() => handleCheckout(key)}
                  disabled={isLoading || !!loadingService}
                  className={`w-full py-2.5 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-50 ${
                    isPrimary
                      ? 'bg-white text-casa-navy hover:bg-white/90'
                      : 'bg-casa-navy text-white hover:bg-casa-navy-light'
                  }`}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Redirecting...
                    </>
                  ) : (
                    <>
                      Get Started <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              )}
            </div>
          );
        })}
      </div>

      <p className="text-[10px] text-text-tertiary leading-relaxed">
        Secure payment processed by Stripe. Your payment details are never stored by <Brand>Casa Intelligence</Brand>.
      </p>
    </div>
  );
}
