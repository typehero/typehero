import type { Metadata } from 'next';
import CheckoutForm from './_components/checkout-form';
import { auth } from '~/server/auth';

export const metadata: Metadata = {
  title: 'Donate with hosted Checkout | Next.js + TypeScript Example',
};

export default async function DonatePage() {
  const session = await auth();
  return (
    <div className="container h-full p-4">
      <div className="gap-6 md:grid lg:max-w-none lg:grid-cols-2">
        <div className="max-w-[69ch] text-lg leading-9 text-neutral-600 dark:text-white/50">
          <p className="mb-6">
            <span className="text-primary">TypeHero</span> and{' '}
            <span className="text-red-600">Advent of TypeScript</span> will always be{' '}
            <span className="font-semibold dark:text-neutral-200">free</span> platforms to use.
          </p>
          <p className="mb-6">
            Contributions will go towards server costs, time spent maintaining the platform, Advent
            of TypeScript, and future development.
          </p>
          {session ? (
            <p className="mb-6">
              Since you are logged in you will see a "Supporter" badge appear next to your name on
              both the TypeHero and Advent of TypeScript platforms.
            </p>
          ) : (
            <p className="mb-6">
              <span className="font-semibold dark:text-neutral-200">You are not logged in!</span> If
              you would like to receive "Supporter" badge on both the TypeHero and Advent of
              TypeScript platforms, please log in, otherise, your donation will be anonymous.
            </p>
          )}
        </div>
        <CheckoutForm />
      </div>
    </div>
  );
}
