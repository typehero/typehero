import Hero from '~/components/landing/Hero';
import Partners from '~/components/landing/Partners';
import { CountdownTimer } from '~/components/landing/useCountdown';
import Snowfall from '../components/landing/Snowfall';
import { buildMetaForEventPage } from '~/utils/metadata';

export async function generateMetadata() {
  return buildMetaForEventPage({
    title: 'Advent of Typescript',
    description: 'Advent of Typescript',
  });
}
export default function Home() {
  return (
    <div className="-mt-14 grid min-h-screen grid-rows-3 place-content-center place-items-center overflow-hidden bg-gradient-to-b from-transparent to-transparent to-50% dark:from-emerald-400/40">
      {/* light-mode-only desktop-only background decorations */}
      <div className="absolute right-[10%] top-1/2 -z-10 hidden h-48 w-[32rem] -translate-y-1/2 rotate-45 animate-pulse rounded-full bg-emerald-200 blur-3xl xl:block dark:bg-transparent" />
      <div className="animate-pulse-alternate absolute bottom-1/2 left-[10%] -z-10 hidden h-48 w-[32rem] translate-y-1/2 rotate-45 rounded-full bg-rose-200 blur-3xl xl:block dark:bg-transparent" />
      <Snowfall />

      <CountdownTimer />
      <Hero />
      <Partners />
      {/* looks bad on desktop and mobile */}
      {/* <Footsies /> */}
    </div>
  );
}
