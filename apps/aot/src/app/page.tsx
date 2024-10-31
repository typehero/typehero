import Snowfall from '../components/Snowfall';
import { CountdownTimer } from '../components/countdown';
import Image from 'next/image';
import FrontendMasters from '../../public/frontend-masters.svg';

export default function Home() {
  return (
    <div className="-mt-14 grid min-h-screen grid-rows-3 place-content-center place-items-center overflow-hidden bg-gradient-to-b from-transparent to-transparent to-50% dark:from-emerald-400/40">
      <div className="absolute right-1/4 top-1/2 -z-10 hidden h-48 w-[32rem] translate-y-1/2 -rotate-45 animate-pulse rounded-full bg-emerald-200 blur-3xl xl:block dark:bg-transparent" />
      <div className="animate-pulse-alternate absolute bottom-1/2 left-1/4 -z-10 hidden h-48 w-[32rem] -translate-y-1/2 rotate-12 rounded-full bg-rose-200 blur-3xl xl:block dark:bg-transparent" />
      <Snowfall />
      {/* background timer */}
      <CountdownTimer />

      {/* hero text */}
      <div className="container relative flex flex-col font-black italic">
        <div className="animate-rotate absolute -left-12 -top-28 -z-10 origin-[45%] md:-left-24 md:-top-20">
          <div
            className="animate-rotate-reverse h-16 w-52 rounded-xl border border-black/30 bg-white/50 p-2.5 font-mono text-[0.69rem] font-normal not-italic opacity-70 shadow-lg backdrop-blur md:h-24 md:w-72 md:rounded-3xl md:p-6 md:text-sm dark:border-white/30 dark:bg-white/10"
            style={{
              rotate: '-12deg',
            }}
          >
            <span className="text-blue-600 dark:text-blue-400">type</span>{' '}
            <span className="text-teal-600 dark:text-teal-400">arr1</span> = [
            <span className="text-orange-600 dark:text-orange-400">'a'</span>,{' '}
            <span className="text-orange-600 dark:text-orange-400">'b'</span>,{' '}
            <span className="text-orange-600 dark:text-orange-400">'c'</span>]
            <div className="h-1.5" />
            <span className="text-blue-600 dark:text-blue-400">type</span>{' '}
            <span className="text-teal-600 dark:text-teal-400">arr2</span> = [
            <span className="text-green-400">3</span>, <span className="text-green-400">2</span>,{' '}
            <span className="text-green-400">1</span>]
          </div>
        </div>
        <div className="animate-rotate-reverse absolute -bottom-28 -right-12 z-10 origin-[55%] md:-bottom-28 md:-right-32">
          <div
            className="animate-rotate h-16 w-48 rounded-xl border border-black/30 bg-white/50 p-2.5 font-mono text-[0.69rem] font-normal not-italic shadow-xl backdrop-blur md:h-24 md:w-72 md:rounded-3xl md:p-6 md:text-sm dark:border-white/30 dark:bg-white/10"
            style={{
              rotate: '12deg',
            }}
          >
            <span className="text-blue-600 dark:text-blue-400">type</span>{' '}
            <span className="text-teal-600 dark:text-teal-400">head1</span> ={' '}
            <span className="text-teal-600 dark:text-teal-400">First</span>&lt;
            <span className="text-teal-600 dark:text-teal-400">arr1</span>&gt;
            <div className="h-1.5" />
            <span className="text-blue-600 dark:text-blue-400">type</span>{' '}
            <span className="text-teal-600 dark:text-teal-400">head2</span> ={' '}
            <span className="text-teal-600 dark:text-teal-400">First</span>&lt;
            <span className="text-teal-600 dark:text-teal-400">arr2</span>&gt;
          </div>
        </div>

        <div className="w-56 text-4xl leading-5 drop-shadow-2xl sm:w-[40rem] sm:text-8xl sm:leading-10">
          Advent
        </div>
        <div className="z-10 mx-auto -mb-1 w-56 text-center text-2xl leading-5 text-rose-400 drop-shadow-2xl sm:w-[40rem] sm:text-6xl sm:leading-10 md:-mb-2.5">
          of
        </div>
        <div className="-mr-0.5 ml-auto w-56 text-right text-4xl leading-5 drop-shadow-2xl sm:w-[40rem] sm:text-8xl sm:leading-10">
          TypeScript
        </div>
      </div>
      {/* sponsors */}
      <div className="flex w-36 flex-col gap-4 text-center md:w-96">
        <div className="text-xs font-light opacity-50 sm:text-sm md:text-base">Sponsors</div>
        <div className="h-[1px] w-full bg-black/30 [mask-image:linear-gradient(to_right,transparent,red,transparent)] dark:bg-white/30" />
        <div className="flex items-center gap-4">
          <a href="https://frontendmasters.com/" target="_blank" rel="noreferrer">
            <Image src={FrontendMasters} alt="FrontendMasters" />
          </a>
        </div>
      </div>
    </div>
  );
}
