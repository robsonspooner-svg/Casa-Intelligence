import { NextRequest, NextResponse } from 'next/server';
import { getStripe, validatePriceId } from '@/lib/stripe';
import { getSupabaseAdmin, verifyToken } from '@/lib/supabase-admin';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tier, token } = body;

    if (!tier || !token) {
      return NextResponse.json(
        { error: 'Missing required fields: tier, token' },
        { status: 400 }
      );
    }

    // Valid tiers
    const validTiers = ['starter', 'pro', 'hands_off'];
    if (!validTiers.includes(tier)) {
      return NextResponse.json(
        { error: `Invalid tier: ${tier}` },
        { status: 400 }
      );
    }

    // Verify the JWT token
    const user = await verifyToken(token);
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid or expired authentication token' },
        { status: 401 }
      );
    }

    const supabase = getSupabaseAdmin();
    const stripe = getStripe();

    // Get the user's profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, email, full_name, stripe_customer_id, subscription_tier, subscription_status, role')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }

    if (profile.role !== 'owner') {
      return NextResponse.json(
        { error: 'Only property owners can subscribe' },
        { status: 403 }
      );
    }

    // Get or create Stripe customer
    let customerId = profile.stripe_customer_id;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: profile.email || user.email || '',
        name: profile.full_name || undefined,
        metadata: { casa_user_id: user.id },
      });

      customerId = customer.id;

      await supabase
        .from('profiles')
        .update({ stripe_customer_id: customerId })
        .eq('id', user.id);
    }

    // Create Stripe Checkout Session for subscription
    const priceId = validatePriceId(tier);

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer: customerId,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      subscription_data: {
        trial_period_days: 14,
        metadata: {
          casa_user_id: user.id,
          casa_tier: tier,
        },
      },
      success_url: `casa-owner://subscription?success=true&tier=${tier}`,
      cancel_url: `casa-owner://subscription?cancelled=true`,
      metadata: {
        casa_user_id: user.id,
        casa_tier: tier,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Error creating subscription checkout:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
