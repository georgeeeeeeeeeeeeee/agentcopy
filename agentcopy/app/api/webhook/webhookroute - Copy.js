import { stripe, CREDITS_AMOUNT } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase-admin";
import { headers } from "next/headers";

export async function POST(request) {
  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature");

  if (!signature) {
    console.error("No stripe-signature header");
    return Response.json({ error: "No signature" }, { status: 400 });
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return Response.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const userId = session.metadata?.user_id;
    const creditsAmount = parseInt(session.metadata?.credits_amount) || CREDITS_AMOUNT;

    if (!userId) {
      console.error("No user_id in session metadata");
      return Response.json({ error: "No user_id" }, { status: 400 });
    }

    // Use admin client to bypass RLS
    const supabase = createAdminClient();

    // Add credits using our helper function
    const { data, error } = await supabase.rpc("add_credits", {
      user_id: userId,
      amount: creditsAmount,
    });

    if (error) {
      console.error("Failed to add credits:", error);
      return Response.json({ error: "Failed to add credits" }, { status: 500 });
    }

    console.log(`Added ${creditsAmount} credits to user ${userId}. New total: ${data}`);
  }

  return Response.json({ received: true });
}
