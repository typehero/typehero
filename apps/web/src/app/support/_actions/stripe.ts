'use server';

import type { Stripe } from 'stripe';

import { headers } from 'next/headers';

import { CURRENCY } from '../_utils/config';
import { formatAmountForStripe } from '../_utils/stripe-helpers';
import { stripe } from '../_utils/stripe';

export async function createCheckoutSession(
  amount: number,
): Promise<{ client_secret: string | null; url: string | null }> {
  const origin: string = headers().get('origin')!;

  const checkoutSession: Stripe.Checkout.Session = await stripe.checkout.sessions.create({
    mode: 'payment',
    submit_type: 'donate',
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: CURRENCY,
          product_data: {
            name: 'Custom amount donation',
          },
          unit_amount: formatAmountForStripe(amount, CURRENCY),
        },
      },
    ],
    success_url: `${origin}/support/confirmation?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/support`,
  });

  return {
    client_secret: checkoutSession.client_secret,
    url: checkoutSession.url,
  };
}

export async function createPaymentIntent(data: FormData): Promise<{ client_secret: string }> {
  const paymentIntent: Stripe.PaymentIntent = await stripe.paymentIntents.create({
    amount: formatAmountForStripe(Number(data.get('customDonation') as string), CURRENCY),
    automatic_payment_methods: { enabled: true },
    currency: CURRENCY,
  });

  return { client_secret: paymentIntent.client_secret! };
}
