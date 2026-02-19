'use client';

import ServiceCheckout from './ServiceCheckout';

interface CTAPromptProps {
  address?: string;
}

export default function CTAPrompt({ address }: CTAPromptProps) {
  return (
    <div className="bg-surface rounded-card border border-border/50 p-5 md:p-6">
      <ServiceCheckout
        services={['preliminary', 'feasibility']}
        address={address}
      />
    </div>
  );
}
