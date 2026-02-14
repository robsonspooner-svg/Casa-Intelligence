'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';

function PayContent() {
  const searchParams = useSearchParams();
  const tenancyId = searchParams.get('tenancy');
  const amountParam = searchParams.get('amount');
  const token = searchParams.get('token');
  const description = searchParams.get('description');
  const rentScheduleId = searchParams.get('schedule');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isValid, setIsValid] = useState<boolean | null>(null);

  const amountCents = amountParam ? parseInt(amountParam, 10) : 0;
  const amountDollars = (amountCents / 100).toFixed(2);

  useEffect(() => {
    if (!token || !tenancyId || !amountCents) {
      setIsValid(false);
      return;
    }
    setIsValid(true);
  }, [token, tenancyId, amountCents]);

  const handlePay = async () => {
    if (!token || !tenancyId || !amountCents) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/create-payment-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenancyId,
          amount: amountCents,
          token,
          description: description || 'Rent payment',
          rentScheduleId: rentScheduleId || undefined,
        }),
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
      setLoading(false);
    }
  };

  if (isValid === false) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.072 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="text-xl font-semibold text-text-primary mb-2">Invalid Payment Link</h1>
          <p className="text-text-secondary">
            This payment link is missing required information. Please open this page from the Casa app.
          </p>
        </div>
      </div>
    );
  }

  if (isValid === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-2 border-casa-navy border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <p className="text-lg font-logo tracking-wide text-text-secondary mb-1">Casa</p>
          <h1 className="text-2xl font-semibold text-text-primary">
            Make a Payment
          </h1>
        </div>

        {/* Payment Card */}
        <div className="bg-surface rounded-card p-6 shadow-card border border-border/50">
          <div className="text-center mb-6">
            <p className="text-sm text-text-secondary mb-1">
              {description || 'Rent payment'}
            </p>
            <p className="text-4xl font-bold text-text-primary">
              ${amountDollars}
            </p>
            <p className="text-xs text-text-tertiary mt-1">AUD</p>
          </div>

          <div className="border-t border-border/50 pt-4 mb-6">
            <div className="flex items-center gap-3 text-sm text-text-secondary">
              <svg className="w-4 h-4 text-green-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span>Secure payment processed by Stripe</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-text-secondary mt-2">
              <svg className="w-4 h-4 text-green-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              <span>Card or bank transfer accepted</span>
            </div>
          </div>

          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-red-700 text-sm">
              {error}
            </div>
          )}

          <button
            onClick={handlePay}
            disabled={loading}
            className="w-full py-3.5 px-4 rounded-button font-medium text-sm bg-casa-navy text-white hover:bg-casa-navy-light shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Processing...
              </span>
            ) : (
              `Pay $${amountDollars}`
            )}
          </button>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-text-tertiary mt-6">
          Payments are processed securely. Your payment details are never stored by Casa.
        </p>
      </div>
    </div>
  );
}

export default function PayPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-2 border-casa-navy border-t-transparent rounded-full" />
      </div>
    }>
      <PayContent />
    </Suspense>
  );
}
