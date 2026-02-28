import Stripe from 'stripe';
import { headers } from 'next/headers';
import { addCredits } from '@/lib/db';
import { VALID_CREDIT_AMOUNTS } from '@/lib/config';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error('STRIPE_WEBHOOK_SECRET is not configured');
    return Response.json({ error: 'Webhook secret not configured' }, { status: 500 });
  }

  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get('stripe-signature');

  if (!signature) {
    return Response.json({ error: 'Missing stripe-signature header' }, { status: 400 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return Response.json({ error: 'Invalid signature' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const userId = session.metadata?.user_id;
    const creditsRaw = session.metadata?.credits_amount;
    const amountPaidCents = parseInt(session.metadata?.amount_paid_cents, 10);

    if (!userId || typeof userId !== 'string') {
      console.error('Webhook: missing or invalid user_id in metadata');
      return Response.json({ error: 'Invalid metadata' }, { status: 400 });
    }

    // Validate credits amount against whitelist — prevent metadata tampering
    const creditsAmount = parseInt(creditsRaw, 10);
    if (!VALID_CREDIT_AMOUNTS.has(creditsAmount)) {
      console.error(`Webhook: invalid credits_amount in metadata: ${creditsRaw}`);
      return Response.json({ error: 'Invalid credits amount' }, { status: 400 });
    }

    if (!Number.isFinite(amountPaidCents) || amountPaidCents <= 0) {
      console.error(`Webhook: invalid amount_paid_cents: ${session.metadata?.amount_paid_cents}`);
      return Response.json({ error: 'Invalid payment amount' }, { status: 400 });
    }

    try {
      const newBalance = await addCredits(userId, creditsAmount, session.id, amountPaidCents);
      console.log(`Added ${creditsAmount} credits to user ${userId}. New balance: ${newBalance}`);
    } catch (error) {
      console.error('Failed to add credits:', error);
      return Response.json({ error: 'Failed to add credits' }, { status: 500 });
    }
  }

  return Response.json({ received: true });
}
