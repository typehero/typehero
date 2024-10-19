import 'server-only';

import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  // https://github.com/stripe/stripe-node#configuration
  // apiVersion: '2023-10-16',
  appInfo: {
    name: 'Typhero',
    url: 'https://typehero.dev',
  },
});
