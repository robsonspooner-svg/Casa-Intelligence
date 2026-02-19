import { NextRequest, NextResponse } from 'next/server';
import { getStripe, validateServicePriceId, SERVICE_TIERS, type ServiceKey } from '@/lib/stripe';
import { logCheckout } from '@/lib/db';

/**
 * Creates a Stripe Checkout Session for one-time service payments.
 * Accepts: { service: 'preliminary' | 'subdivision' | 'feasibility', email: string, address: string }
 * Returns: { url: string } — the Stripe hosted checkout URL
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { service, email, address } = body;

    if (!service || !email) {
      return NextResponse.json(
        { error: 'service and email are required' },
        { status: 400 }
      );
    }

    // Feasibility is custom-quoted — should go through contact form
    if (service === 'feasibility') {
      return NextResponse.json(
        { error: 'Development Feasibility requires a custom quote. Please contact us directly.' },
        { status: 400 }
      );
    }

    const priceId = validateServicePriceId(service);
    const stripe = getStripe();

    const origin = request.nextUrl.origin;

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      customer_email: email,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      metadata: {
        service,
        address: address || '',
      },
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/?cancelled=true`,
    });

    // Log checkout attempt to database (fire-and-forget)
    const tier = SERVICE_TIERS[service as ServiceKey];
    logCheckout({
      email,
      service,
      address: address || null,
      stripe_session_id: session.id,
      amount_cents: tier ? tier.price * 100 : null,
      referrer: request.headers.get('referer') || null,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Checkout session creation error:', error);
    const message = error instanceof Error ? error.message : 'Failed to create checkout session';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
