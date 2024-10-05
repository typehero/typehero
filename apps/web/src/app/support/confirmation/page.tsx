import type { Stripe } from 'stripe';
import { stripe } from '../_utils/stripe';
import { auth } from '~/server/auth';
import { prisma } from '@repo/db';

export default async function ResultPage({
  searchParams,
}: {
  searchParams: { session_id: string };
}) {
  if (!searchParams.session_id)
    throw new Error('Please provide a valid session_id (`cs_test_...`)');

  const session = await auth();
  if (session) {
    await prisma.user.update({
      where: { id: session?.user.id },
      data: {
        roles: {
          connectOrCreate: {
            where: { role: 'SUPPORTER' },
            create: { role: 'SUPPORTER' },
          },
        },
      },
    });
  }

  const checkoutSession: Stripe.Checkout.Session = await stripe.checkout.sessions.retrieve(
    searchParams.session_id,
    {
      expand: ['line_items', 'payment_intent'],
    },
  );

  const paymentIntent = checkoutSession.payment_intent as Stripe.PaymentIntent;

  return (
    <>
      <h2>Status: {paymentIntent.status}</h2>
      <h3>Checkout Session response:</h3>
      <pre>{JSON.stringify(checkoutSession, null, 2)}</pre>
      <pre>{JSON.stringify(session, null, 2)}</pre>
    </>
  );
}
