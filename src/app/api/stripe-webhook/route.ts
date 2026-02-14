import { NextRequest, NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import { getSupabaseAdmin } from '@/lib/supabase-admin';
import type Stripe from 'stripe';

// Disable Next.js body parsing for webhooks (we need the raw body for signature verification)
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET_WEB;

  if (!webhookSecret) {
    console.error('STRIPE_WEBHOOK_SECRET_WEB is not set');
    return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 });
  }

  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    const stripe = getStripe();
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('Webhook signature verification failed:', message);
    return NextResponse.json({ error: `Webhook Error: ${message}` }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;

        if (session.mode === 'subscription') {
          // Handle subscription checkout completion
          const userId = session.metadata?.casa_user_id;
          const tier = session.metadata?.casa_tier;

          if (userId && tier) {
            // Get the subscription to find trial end
            const stripe = getStripe();
            const subscription = await stripe.subscriptions.retrieve(
              session.subscription as string
            );

            await supabase.from('profiles').update({
              subscription_tier: tier,
              subscription_status: subscription.status === 'trialing' ? 'trialing' : 'active',
              trial_ends_at: subscription.trial_end
                ? new Date(subscription.trial_end * 1000).toISOString()
                : null,
            }).eq('id', userId);
          }
        }
        // Payment-mode sessions: payment_intent.succeeded will handle the payment record update
        // (handled by the Edge Function webhook which already has this logic)
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata?.casa_user_id;

        if (userId) {
          const statusMap: Record<string, string> = {
            active: 'active',
            trialing: 'trialing',
            past_due: 'past_due',
            canceled: 'cancelled',
            unpaid: 'past_due',
          };

          await supabase.from('profiles').update({
            subscription_status: statusMap[subscription.status] || subscription.status,
          }).eq('id', userId);
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata?.casa_user_id;

        if (userId) {
          await supabase.from('profiles').update({
            subscription_status: 'cancelled',
            subscription_tier: 'starter',
          }).eq('id', userId);
        }
        break;
      }

      default:
        // Unhandled event type — acknowledge receipt
        break;
    }
  } catch (err) {
    console.error(`Error processing webhook event ${event.type}:`, err);
    // Return 200 to prevent Stripe from retrying — we'll handle the error internally
    return NextResponse.json({ received: true, error: 'Processing error' }, { status: 200 });
  }

  return NextResponse.json({ received: true });
}
