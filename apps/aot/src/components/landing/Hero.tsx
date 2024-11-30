import { LandingStartExploringButton } from './LandingStartExploringButton';

export default function Hero() {
  return (
    <div className="container relative flex flex-col font-black italic">
      <div className="animate-rotate absolute -left-12 -top-28 origin-[45%] md:-left-24 md:-top-20">
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
      <LandingStartExploringButton />
    </div>
  );
}
