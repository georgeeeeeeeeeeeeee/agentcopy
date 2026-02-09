import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-12-18.acacia",
});

// Price in cents (NZD)
export const CREDITS_PRICE = 9900; // $99.00 NZD
export const CREDITS_AMOUNT = 100;
