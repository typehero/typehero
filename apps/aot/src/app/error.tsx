'use client';

import Snowfall from '~/components/landing/Snowfall';
import { useEffect } from 'react';

export default function Error({ error }: { error: Error }) {
  useEffect(() => {
    console.error(error);
  }, [error]);
  return (
    <div className="-mt-14 flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-transparent to-transparent to-50% dark:from-emerald-400/40">
      <div className="absolute right-[10%] top-1/2 -z-10 hidden h-48 w-[32rem] -translate-y-1/2 rotate-45 animate-pulse rounded-full bg-red-900 blur-3xl xl:block dark:bg-transparent" />
      <div className="animate-pulse-alternate absolute bottom-1/2 left-[10%] -z-10 hidden h-48 w-[32rem] translate-y-1/2 rotate-45 rounded-full bg-rose-200 blur-3xl xl:block dark:bg-transparent" />
      <Snowfall />
      <h1 className="text-center text-6xl font-black text-white">500</h1>
      <p className="mt-2 text-center text-xl font-medium text-white">
        An error occurred, maybe refresh?
      </p>
    </div>
  );
}
