'use client';

import Snowfall from '~/components/landing/Snowfall';
import { Button } from '@repo/ui/components/button';
import { useEffect } from 'react';

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error('Global Error:', error);
  }, [error]);

  return (
    <div className="-mt-14 flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-transparent to-transparent to-50% dark:from-emerald-400/40">
      <div className="absolute right-[10%] top-1/2 -z-10 hidden h-48 w-[32rem] -translate-y-1/2 rotate-45 animate-pulse rounded-full bg-red-900 blur-3xl xl:block dark:bg-transparent" />
      <div className="animate-pulse-alternate absolute bottom-1/2 left-[10%] -z-10 hidden h-48 w-[32rem] translate-y-1/2 rotate-45 rounded-full bg-rose-200 blur-3xl xl:block dark:bg-transparent" />
      <Snowfall />
      <h1 className="text-center text-3xl font-black lg:text-6xl">Something Went Wrong</h1>
      <p className="mt-2 text-center text-lg font-medium lg:text-xl">
        We encountered an unexpected error. Please try refreshing the page.
      </p>
      <Button variant="destructive" onClick={reset} className="mt-4">
        Retry
      </Button>
    </div>
  );
}
