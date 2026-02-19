'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import Brand from '@/components/brand/Brand';
import Link from 'next/link';

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6">
      <div className="w-full max-w-md text-center">
        <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-emerald-600" />
        </div>

        <h1 className="text-2xl font-serif font-bold text-text-primary mb-3">
          Payment Received
        </h1>

        <p className="text-base text-text-secondary leading-relaxed mb-6">
          Thank you for choosing <Brand>Casa Intelligence</Brand>. Our team will review
          your property details and be in touch within 24 hours to get started.
        </p>

        <div className="bg-surface rounded-xl border border-border/50 p-5 mb-6 text-left">
          <h2 className="text-sm font-semibold text-text-primary mb-3">What happens next</h2>
          <ol className="space-y-3 text-sm text-text-secondary">
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-casa-navy/10 flex items-center justify-center text-xs font-semibold text-casa-navy">1</span>
              <span>We review your property data and planning scheme requirements</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-casa-navy/10 flex items-center justify-center text-xs font-semibold text-casa-navy">2</span>
              <span>A <Brand>Casa Intelligence</Brand> specialist contacts you to discuss your goals</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-casa-navy/10 flex items-center justify-center text-xs font-semibold text-casa-navy">3</span>
              <span>We deliver your assessment and next steps</span>
            </li>
          </ol>
        </div>

        <p className="text-xs text-text-tertiary mb-6">
          A confirmation email has been sent to your email address.
          {sessionId && (
            <span className="block mt-1">Reference: {sessionId.slice(0, 20)}...</span>
          )}
        </p>

        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-casa-navy hover:underline"
        >
          Back to home <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin h-8 w-8 border-2 border-casa-navy border-t-transparent rounded-full" />
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
