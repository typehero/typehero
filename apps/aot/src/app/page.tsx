import Snowfall from '../components/Snowfall';
import Image from 'next/image';
import { CountdownTimer } from '~/components/useCountdown';
import FrontendMasters from '../../public/frontend-masters.svg';
import TypeHeroDark from '../../public/typehero-dark.svg';
import TypeHero from '../../public/typehero.svg';

export default function Home() {
  return (
    <div className="-mt-14 grid min-h-screen grid-rows-3 place-content-center place-items-center overflow-hidden bg-gradient-to-b from-transparent to-transparent to-50% dark:from-emerald-400/40">
      <div className="absolute right-[10%] top-1/2 -z-10 hidden h-48 w-[32rem] -translate-y-1/2 rotate-45 animate-pulse rounded-full bg-emerald-200 blur-3xl xl:block dark:bg-transparent" />
      <div className="animate-pulse-alternate absolute bottom-1/2 left-[10%] -z-10 hidden h-48 w-[32rem] translate-y-1/2 rotate-45 rounded-full bg-rose-200 blur-3xl xl:block dark:bg-transparent" />
      <Snowfall />
      {/* background timer */}
      <CountdownTimer />

      {/* hero text */}
      <div className="container relative flex flex-col font-black italic">
        <div className="animate-rotate absolute -left-12 -top-28 -z-10 origin-[45%] md:-left-24 md:-top-20">
          <div
            className="animate-rotate-reverse h-16 w-52 rounded-xl border border-black/30 bg-white/50 p-2.5 font-mono text-[0.69rem] font-normal not-italic opacity-70 shadow-lg blur-[0.5px] backdrop-blur md:h-24 md:w-72 md:rounded-3xl md:p-6 md:text-sm dark:border-white/30 dark:bg-white/10"
            style={{
              rotate: '-12deg',
            }}
          >
            <span className="text-blue-600 dark:text-blue-400">type</span>{' '}
            <span className="text-teal-600 dark:text-teal-400">Arr1</span> = [
            <span className="text-orange-600 dark:text-orange-400">'a'</span>,{' '}
            <span className="text-orange-600 dark:text-orange-400">'b'</span>,{' '}
            <span className="text-orange-600 dark:text-orange-400">'c'</span>]
            <div className="h-1.5" />
            <span className="text-blue-600 dark:text-blue-400">type</span>{' '}
            <span className="text-teal-600 dark:text-teal-400">Arr2</span> = [
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
            <span className="text-teal-600 dark:text-teal-400">Tail</span> ={' '}
            <span className="text-teal-600 dark:text-teal-400">Last</span>&lt;
            <span className="text-teal-600 dark:text-teal-400">Arr1</span>&gt;
            <div className="h-1.5" />
            <span className="text-blue-600 dark:text-blue-400">type</span>{' '}
            <span className="text-teal-600 dark:text-teal-400">Head</span> ={' '}
            <span className="text-teal-600 dark:text-teal-400">First</span>&lt;
            <span className="text-teal-600 dark:text-teal-400">Arr2</span>&gt;
          </div>
        </div>

        <div className="w-56 text-4xl leading-5 drop-shadow-2xl sm:w-[40rem] sm:text-8xl sm:leading-10">
          Advent
        </div>
        <div className="z-10 mx-auto -mb-1 w-56 text-center text-2xl leading-5 text-rose-700 drop-shadow-2xl sm:w-[40rem] sm:text-6xl sm:leading-10 md:-mb-2.5 dark:text-rose-400">
          of
        </div>
        <div className="-mr-0.5 ml-auto w-56 text-right text-4xl leading-5 drop-shadow-2xl sm:w-[40rem] sm:text-8xl sm:leading-10">
          TypeScript
        </div>
      </div>
      {/* Partners */}
      <div className="flex w-36 flex-col text-center [mask-image:linear-gradient(to_bottom,red_calc(100%-2rem),transparent)] md:w-96">
        <div className="text-xs font-extralight opacity-70 sm:text-sm md:text-base dark:opacity-30">
          Partners
        </div>
        <div className="mt-4 h-[1px] w-full bg-black/40 [mask-image:linear-gradient(to_right,transparent,red,transparent)] dark:bg-white/30" />
        <div className="-mx-[50%] w-[200%] overflow-hidden [mask-image:linear-gradient(to_right,transparent,red_20%,red_80%,transparent)] md:mx-0 md:w-auto">
          <div className="infinite-scroll-x-fast flex w-[200%] items-center">
            <a
              href="https://frontendmasters.com/learn/typescript/"
              target="_blank"
              rel="noreferrer"
              className="group relative border-r border-black/10 px-6 pb-6 pt-3 duration-300 hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/5"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-external-link absolute right-1 top-1 -translate-x-full translate-y-full opacity-0 duration-300 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-50"
              >
                <path d="M15 3h6v6" />
                <path d="M10 14 21 3" />
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              </svg>
              <Image src={FrontendMasters} alt="FrontendMasters" className="h-12 w-fit" />
            </a>
            <a
              href="https://typehero.dev/"
              target="_blank"
              rel="noreferrer"
              className="group relative border-r border-black/10 px-6 pb-6 pt-3 duration-300 hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/5"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-external-link absolute right-1 top-1 -translate-x-full translate-y-full opacity-0 duration-300 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-50"
              >
                <path d="M15 3h6v6" />
                <path d="M10 14 21 3" />
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              </svg>
              <Image src={TypeHeroDark} alt="TypeHero" className="hidden h-12 w-fit dark:block" />
              <Image src={TypeHero} alt="TypeHero" className="h-12 w-fit dark:hidden" />
            </a>
            <a
              href="https://frontendmasters.com/learn/typescript/"
              target="_blank"
              rel="noreferrer"
              className="group relative border-r border-black/10 px-6 pb-6 pt-3 duration-300 hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/5"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-external-link absolute right-1 top-1 -translate-x-full translate-y-full opacity-0 duration-300 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-50"
              >
                <path d="M15 3h6v6" />
                <path d="M10 14 21 3" />
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              </svg>
              <Image src={FrontendMasters} alt="FrontendMasters" className="h-12 w-fit" />
            </a>
            <a
              href="https://typehero.dev/"
              target="_blank"
              rel="noreferrer"
              className="group relative border-r border-black/10 px-6 pb-6 pt-3 duration-300 hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/5"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-external-link absolute right-1 top-1 -translate-x-full translate-y-full opacity-0 duration-300 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-50"
              >
                <path d="M15 3h6v6" />
                <path d="M10 14 21 3" />
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              </svg>
              <Image src={TypeHeroDark} alt="TypeHero" className="hidden h-12 w-fit dark:block" />
              <Image src={TypeHero} alt="TypeHero" className="h-12 w-fit dark:hidden" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
