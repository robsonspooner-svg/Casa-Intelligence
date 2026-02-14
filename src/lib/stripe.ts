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
