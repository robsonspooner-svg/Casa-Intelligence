import { NextRequest, NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import { getSupabaseAdmin, verifyToken } from '@/lib/supabase-admin';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tenancyId, amount, token, description, rentScheduleId } = body;

    if (!tenancyId || !amount || !token) {
      return NextResponse.json(
        { error: 'Missing required fields: tenancyId, amount, token' },
        { status: 400 }
      );
    }

    if (typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json(
        { error: 'Amount must be a positive number (in cents)' },
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

    // Verify tenant belongs to tenancy
    const { data: tenancyTenant, error: tenancyError } = await supabase
      .from('tenancy_tenants')
      .select('tenancy_id, tenancies!inner(id, property_id, properties!inner(owner_id))')
      .eq('tenant_id', user.id)
      .eq('tenancy_id', tenancyId)
      .single();

    if (tenancyError || !tenancyTenant) {
      return NextResponse.json(
        { error: 'Tenancy not found or access denied' },
        { status: 404 }
      );
    }

    // Get or create Stripe customer for tenant
    const { data: tenantStripeCustomer } = await supabase
      .from('tenant_stripe_customers')
      .select('stripe_customer_id')
      .eq('tenant_id', user.id)
      .single();

    let stripeCustomerId: string;

    if (!tenantStripeCustomer) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('email, full_name')
        .eq('id', user.id)
        .single();

      const customer = await stripe.customers.create({
        email: profile?.email || user.email,
        name: profile?.full_name || undefined,
        metadata: { casa_user_id: user.id },
      });

      stripeCustomerId = customer.id;

      await supabase.from('tenant_stripe_customers').insert({
        tenant_id: user.id,
        stripe_customer_id: stripeCustomerId,
      });
    } else {
      stripeCustomerId = tenantStripeCustomer.stripe_customer_id;
    }

    // Get owner's Stripe Connect account
    const ownerId = (tenancyTenant as Record<string, any>).tenancies.properties.owner_id;
    const { data: ownerStripeAccount } = await supabase
      .from('owner_stripe_accounts')
      .select('stripe_account_id, charges_enabled')
      .eq('owner_id', ownerId)
      .single();

    if (!ownerStripeAccount?.charges_enabled) {
      return NextResponse.json(
        { error: 'Your landlord has not yet set up their payment account. Please contact them to enable rent payments.' },
        { status: 400 }
      );
    }

    // Calculate Stripe fee (1.75% + 30c)
    const stripeFee = Math.round(amount * 0.0175 + 30);
    const lineItemDescription = description || 'Rent payment';

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer: stripeCustomerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'aud',
            product_data: {
              name: lineItemDescription,
              description: 'Payment via Casa',
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      payment_intent_data: {
        application_fee_amount: 0,
        transfer_data: {
          destination: ownerStripeAccount.stripe_account_id,
        },
        metadata: {
          casa_tenancy_id: tenancyId,
          casa_tenant_id: user.id,
          casa_payment_type: 'rent',
          casa_rent_schedule_id: rentScheduleId || '',
        },
      },
      success_url: `casa-tenant://payments?success=true`,
      cancel_url: `casa-tenant://payments?cancelled=true`,
      metadata: {
        casa_user_id: user.id,
        casa_tenancy_id: tenancyId,
        casa_payment_type: 'rent',
      },
    });

    // Create pending payment record
    await supabase.from('payments').insert({
      tenancy_id: tenancyId,
      tenant_id: user.id,
      payment_type: 'rent',
      amount,
      currency: 'aud',
      description: lineItemDescription,
      stripe_payment_intent_id: (session.payment_intent as string) || null,
      stripe_fee: stripeFee,
      platform_fee: 0,
      net_amount: amount - stripeFee,
      status: 'pending',
      due_date: rentScheduleId ? new Date().toISOString().split('T')[0] : null,
      metadata: {
        rent_schedule_id: rentScheduleId || null,
        checkout_session_id: session.id,
        source: 'web',
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Error creating payment checkout:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
