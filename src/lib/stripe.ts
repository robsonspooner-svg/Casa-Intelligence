import Stripe from 'stripe';

let stripeInstance: Stripe | null = null;

export function getStripe(): Stripe {
  if (!stripeInstance) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      throw new Error('STRIPE_SECRET_KEY is not set');
    }
    stripeInstance = new Stripe(key, {
      typescript: true,
    });
  }
  return stripeInstance;
}

// Stripe price IDs — set via environment variables
export const PRICE_MAP: Record<string, string> = {
  starter: process.env.STRIPE_PRICE_STARTER || 'price_starter',
  pro: process.env.STRIPE_PRICE_PRO || 'price_pro',
  hands_off: process.env.STRIPE_PRICE_HANDS_OFF || 'price_hands_off',
};

export function validatePriceId(tier: string): string {
  const priceId = PRICE_MAP[tier];
  if (!priceId) {
    throw new Error(`Unknown tier: ${tier}`);
  }
  return priceId;
}

// Tier display info (matches packages/api/src/constants/subscriptions.ts)
export const TIERS = {
  starter: {
    id: 'starter',
    name: 'Starter',
    price: 49,
    priceFormatted: '$49/mo',
    maxProperties: 3,
    features: [
      'AI property assistant',
      'Rent collection',
      'Maintenance requests',
      'Basic reporting',
      'Up to 3 properties',
    ],
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    price: 89,
    priceFormatted: '$89/mo',
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
  hands_off: {
    id: 'hands_off',
    name: 'Hands-Off',
    price: 149,
    priceFormatted: '$149/mo',
    maxProperties: Infinity,
    features: [
      'Everything in Pro',
      'Professional inspections',
      'Unlimited properties',
      'Priority support',
    ],
  },
} as const;

export type TierKey = keyof typeof TIERS;

// ---------------------------------------------------------------------------
// One-time service pricing (subdivision, feasibility, preliminary)
// ---------------------------------------------------------------------------

export const SERVICE_PRICE_MAP: Record<string, string> = {
  preliminary: process.env.STRIPE_PRICE_PRELIMINARY || 'price_preliminary',
  subdivision: process.env.STRIPE_PRICE_SUBDIVISION || 'price_subdivision',
  feasibility: process.env.STRIPE_PRICE_FEASIBILITY || 'price_feasibility',
};

export type ServiceKey = 'preliminary' | 'subdivision' | 'feasibility';

export interface ServiceTier {
  id: ServiceKey;
  name: string;
  price: number;
  priceFormatted: string;
  description: string;
  features: string[];
}

export const SERVICE_TIERS: Record<ServiceKey, ServiceTier> = {
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

export function validateServicePriceId(service: string): string {
  const priceId = SERVICE_PRICE_MAP[service];
  if (!priceId) {
    throw new Error(`Unknown service: ${service}`);
  }
  // Detect placeholder/unconfigured price IDs
  if (priceId.startsWith('price_') && !priceId.startsWith('price_1')) {
    throw new Error(
      `Stripe is not yet configured for ${SERVICE_TIERS[service as ServiceKey]?.name || service}. Please contact us directly to get started.`
    );
  }
  return priceId;
}
