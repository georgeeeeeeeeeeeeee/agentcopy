import Stripe from 'stripe';
import { getSessionUserId } from '@/lib/auth';
import { getUserById } from '@/lib/db';
import { CREDIT_PACKS, APP_URL } from '@/lib/config';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  try {
    const userId = await getSessionUserId();
    if (!userId) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await getUserById(userId);
    if (!user) {
      return Response.json({ error: 'User not found' }, { status: 404 });
    }

    // Parse requested pack (default to 'standard')
    let packId = 'standard';
    try {
      const body = await request.json();
      if (body?.packId) packId = body.packId;
    } catch { /* body is optional */ }

    const pack = CREDIT_PACKS.find(p => p.id === packId);
    if (!pack) {
      return Response.json({ error: 'Invalid credit pack' }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'nzd',
            product_data: {
              name: `AgentCopy ${pack.label} Pack`,
              description: `${pack.credits} AI generations for your real estate writing`,
            },
            unit_amount: pack.amount_paid_cents,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${APP_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}&min_credits=${user.credits + pack.credits}`,
      cancel_url: `${APP_URL}/pricing`,
      metadata: {
        user_id: userId,
        pack_id: pack.id,
        credits_amount: String(pack.credits),
        amount_paid_cents: String(pack.amount_paid_cents),
      },
      customer_email: user.email,
    });

    return Response.json({ url: session.url });
  } catch (error) {
    console.error('Checkout error:', error);
    return Response.json({ error: 'Failed to create checkout session' }, { status: 500 });
  }
}
