import type { Metadata } from 'next';
import { auth } from '~/server/auth';
import { Button } from '@repo/ui/components/button';

export const metadata: Metadata = {
  title: 'Support the Platform | TypeHero',
};

export default async function DonatePage() {
  const session = await auth();
  return (
    <div className="container h-full p-4">
      <div className="max-w-[69ch] text-lg leading-9 text-neutral-600 dark:text-white/50">
        <p className="mb-6">
          <span className="text-primary">TypeHero</span> and{' '}
          <span className="text-red-600">Advent of TypeScript</span> will always be{' '}
          <span className="font-semibold dark:text-neutral-200">free</span> platforms to use.
        </p>
        <p className="mb-6">
          Contributions will go towards server costs, time spent maintaining the platform, Advent of
          TypeScript, and future development.
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
      <Button
        asChild
        className="donate-stripe-link-btn group relative w-fit overflow-hidden rounded-xl p-[1px] font-bold transition-all duration-300 md:mr-0 lg:mr-auto"
        variant="outline"
      >
        <a href="https://donate.stripe.com/7sIdR1c992mdf1m000">
          <span className="inline-flex h-full w-fit items-center gap-2 rounded-xl bg-white px-4 py-2 text-black transition-all duration-300 dark:bg-neutral-900 dark:text-white">
            Click to Donate
          </span>
        </a>
      </Button>
    </div>
  );
}
