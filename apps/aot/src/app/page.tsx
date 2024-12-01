import Hero from '~/components/landing/Hero';
import Partners from '~/components/landing/Partners';
import { LandingCountdownTimer } from '~/components/landing/LandingCountdownTimer';
import Snowfall from '../components/landing/Snowfall';
import { buildMetaForEventPage } from '~/utils/metadata';
import { Footsies } from '~/components/footsies';

export async function generateMetadata() {
  return buildMetaForEventPage({
    title: 'Advent of Typescript',
    description: 'Advent of Typescript',
  });
}
export default function Home() {
  return (
    <>
      <div className="z-10 -mt-14 grid min-h-screen grid-rows-3 place-content-center place-items-center overflow-hidden border-b border-neutral-300 bg-gradient-to-b from-white to-white to-50% dark:border-neutral-700 dark:from-emerald-400/40 dark:to-black">
        {/* light-mode-only desktop-only background decorations */}
        <div className="absolute right-[10%] top-1/2 -z-10 hidden h-48 w-[32rem] -translate-y-1/2 rotate-45 animate-pulse rounded-full bg-emerald-200 blur-3xl xl:block dark:bg-transparent" />
        <div className="animate-pulse-alternate absolute bottom-1/2 left-[10%] -z-10 hidden h-48 w-[32rem] translate-y-1/2 rotate-45 rounded-full bg-rose-200 blur-3xl xl:block dark:bg-transparent" />
        <Snowfall />
        <LandingCountdownTimer />
        <Hero />
        <Partners />
      </div>
      <div className="sticky bottom-0 -z-10 w-full">
        <Footsies />
      </div>
    </>
  );
}
