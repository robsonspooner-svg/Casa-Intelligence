'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import { Check } from 'lucide-react';

const TIERS = [
  {
    id: 'starter',
    name: 'Starter',
    price: 49,
    priceFormatted: '$49',
    maxProperties: 3,
    features: [
      'AI property assistant',
      'Rent collection',
      'Maintenance requests',
      'Basic reporting',
      'Up to 3 properties',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 89,
    priceFormatted: '$89',
    maxProperties: 10,
    popular: true,
    features: [
      'Everything in Starter',
      'Tenant finding',
      'Full lease management',
      'Full communications',
      'Full arrears management',
      'Up to 10 properties',
    ],
  },
  {
    id: 'hands_off',
    name: 'Hands-Off',
    price: 149,
    priceFormatted: '$149',
    maxProperties: Infinity,
    features: [
      'Everything in Pro',
      'Professional inspections',
      'Unlimited properties',
      'Priority support',
    ],
  },
];

function SubscribeContent() {
  const searchParams = useSearchParams();
  const preselectedTier = searchParams.get('tier');
  const token = searchParams.get('token');

  const [selectedTier, setSelectedTier] = useState(preselectedTier || 'pro');
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    if (!token) {
      setIsAuthenticated(false);
      return;
    }
    // Token will be validated server-side when they click subscribe
    setIsAuthenticated(true);
  }, [token]);

  const handleSubscribe = async (tier: string) => {
    if (!token) {
      setError('Authentication required. Please open this page from the Casa app.');
      return;
    }

    setLoading(tier);
    setError(null);

    try {
      const response = await fetch('/api/create-subscription-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier, token }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(null);
    }
  };

  if (isAuthenticated === false) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.072 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="text-xl font-semibold text-text-primary mb-2">Authentication Required</h1>
          <p className="text-text-secondary">
            Please open this page from the Casa app to subscribe. This link requires authentication.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-lg font-logo tracking-wide text-text-secondary mb-1">Casa</p>
          <h1 className="text-3xl sm:text-4xl font-semibold text-text-primary mb-3">
            Choose your plan
          </h1>
          <p className="text-text-secondary max-w-lg mx-auto">
            All plans include a 14-day free trial. No credit card required to start.
          </p>
        </div>

        {error && (
          <div className="max-w-lg mx-auto mb-6 bg-red-50 border border-red-200 rounded-card px-4 py-3 text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TIERS.map((tier) => {
            const isSelected = selectedTier === tier.id;
            const isLoading = loading === tier.id;
            const isPopular = 'popular' in tier && tier.popular;

            return (
              <div
                key={tier.id}
                className={`relative bg-surface rounded-card p-6 border-2 transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'border-casa-navy shadow-elevated'
                    : 'border-border/50 shadow-card hover:shadow-card-hover hover:border-border'
                }`}
                onClick={() => setSelectedTier(tier.id)}
              >
                {isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-casa-navy text-white text-xs font-medium px-3 py-1 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-text-primary">{tier.name}</h3>
                  <div className="mt-2">
                    <span className="text-3xl font-bold text-text-primary">{tier.priceFormatted}</span>
                    <span className="text-text-secondary text-sm">/month</span>
                  </div>
                </div>

                <ul className="space-y-3 mb-6">
                  {tier.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                      <span className="text-sm text-text-secondary">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSubscribe(tier.id);
                  }}
                  disabled={!!loading}
                  className={`w-full py-3 px-4 rounded-button font-medium text-sm transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed ${
                    isSelected
                      ? 'bg-casa-navy text-white hover:bg-casa-navy-light shadow-sm hover:shadow-md'
                      : 'bg-white text-casa-navy border-[1.5px] border-casa-navy hover:bg-casa-navy hover:text-white'
                  }`}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    `Start free trial`
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* Footer note */}
        <div className="text-center mt-8">
          <p className="text-xs text-text-tertiary">
            Your trial starts immediately. Cancel anytime during the trial period at no cost.
            <br />
            After your trial, you&apos;ll be billed monthly. All prices in AUD.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SubscribePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-2 border-casa-navy border-t-transparent rounded-full" />
      </div>
    }>
      <SubscribeContent />
    </Suspense>
  );
}
