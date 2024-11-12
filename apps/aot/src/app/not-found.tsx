import { Compass, CornerDownLeft } from 'lucide-react';
import Snowfall from '../components/landing/Snowfall';
import { Button } from '@repo/ui/components/button';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Not Found | Advent of TypeScript 2024',
  description: "Couldn't find the requested resource",
};

export default function Custom404() {
  return (
    <div className="-mt-14 flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-transparent to-transparent to-50% dark:from-emerald-400/40">
      <div className="absolute right-[10%] top-1/2 -z-10 hidden h-48 w-[32rem] -translate-y-1/2 rotate-45 animate-pulse rounded-full bg-red-900 blur-3xl xl:block dark:bg-transparent" />
      <div className="animate-pulse-alternate absolute bottom-1/2 left-[10%] -z-10 hidden h-48 w-[32rem] translate-y-1/2 rotate-45 rounded-full bg-rose-200 blur-3xl xl:block dark:bg-transparent" />
      <Snowfall />
      <h1 className="text-center text-6xl font-black text-white">404</h1>
      <p className="mt-2 text-center text-xl font-medium text-white">
        Couldn't find the requested resource
      </p>
      <div className="mt-8 flex flex-row gap-x-2">
        <Link href="/events">
          <Button variant="outline">
            <Compass className="mr-2 size-4" />
            Explore Challenges
          </Button>
        </Link>
        <Link href="/">
          <Button>
            Return Home
            <CornerDownLeft className="ml-2 size-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
