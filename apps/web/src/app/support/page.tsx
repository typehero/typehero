import type { Metadata } from 'next';
import { auth } from '~/server/auth';
import { Button } from '@repo/ui/components/button';
import styles from './support.module.css';
import { HeartHandshake } from '@repo/ui/icons';
// import { HandHeart } from '@repo/ui/icons/hand-heart';

export const metadata: Metadata = {
  title: 'Support the Platform | TypeHero',
};

export default async function DonatePage() {
  const session = await auth();
  return (
    // 3.5rem is the height of the navbar, thus -7rem to center vertically
    <div className="container relative flex min-h-[calc(100lvh-7rem)] flex-col p-4 py-8 sm:items-center sm:justify-center sm:text-center">
      <div className={`${styles.supportBackground} fixed left-0 -z-10 h-full w-full`} />
      <div className="mx-auto max-w-[69ch] text-lg leading-9 text-neutral-600 dark:text-white/50">
        <div className="mb-8 flex items-center gap-4 sm:flex-col">
          <div className="hidden h-12 w-12 place-items-center rounded-full bg-black/10 sm:grid dark:bg-gradient-to-b dark:from-white/10 dark:to-[#bea74b44]">
            <HeartHandshake className="h-8 w-8 stroke-1 text-neutral-900 dark:text-white" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-neutral-900 dark:text-white">
            Support
          </h1>
        </div>
        <p className="mb-6 text-balance">
          <span className="bg-gradient-to-br from-blue-400 to-blue-600 bg-clip-text font-bold text-transparent duration-300 hover:underline">
            TypeHero
          </span>{' '}
          and{' '}
          <span className="bg-gradient-to-br from-rose-400 to-rose-600 bg-clip-text font-bold text-transparent duration-300 hover:underline">
            Advent of TypeScript
          </span>{' '}
          will always be <span className="font-semibold dark:text-neutral-200">free</span> platforms
          to use.
        </p>
        <p className="mb-6 text-balance">
          Contributions will go towards server costs, time spent maintaining the platform, Advent of
          TypeScript, and future development.
        </p>
        <Button
          asChild
          className={`${styles.donateStripeLinkBtn} group relative w-fit overflow-hidden rounded-xl border-none p-0 font-bold !ring-0 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0 active:duration-75 dark:p-[1px]`}
          variant="outline"
        >
          <a href="https://donate.stripe.com/7sIdR1c992mdf1m000">
            <span className="inline-flex h-full w-fit items-center gap-2 rounded-xl bg-black px-4 py-2 text-white transition-all duration-300 dark:bg-neutral-900 dark:text-white">
              Click to Donate
            </span>
          </a>
        </Button>
        {session ? (
          <p className="mb-6 mt-8 max-w-[42ch] text-balance text-sm sm:mx-auto">
            Since you are logged in you will see a "Supporter" badge appear next to your name on
            both the TypeHero and Advent of TypeScript platforms.
          </p>
        ) : (
          <p className="mb-6 mt-8 max-w-[42ch] text-balance text-sm sm:mx-auto">
            <span className="font-semibold dark:text-neutral-200">You are not logged in!</span> If
            you would like to receive "Supporter" badge on both the TypeHero and Advent of
            TypeScript platforms, please log in, otherwise, your donation will be anonymous.
          </p>
        )}
      </div>
    </div>
  );
}
