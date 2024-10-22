// import { CodeXml, ExternalLink } from 'lucide-react';
import Snowfall from '../components/Snowfall';

export default function Home() {
  return (
    <div className="grid min-h-screen place-content-center overflow-hidden bg-gradient-to-b from-emerald-400/40 to-transparent to-50%">
      <Snowfall />
      {/* background timer */}
      <div className="absolute bottom-0 left-1/2 z-30 flex -translate-x-1/2 gap-2 not-italic">
        <div className="h-32 w-24 origin-bottom-right scale-75 rounded-[1.125rem] bg-white/30 p-1 backdrop-blur">
          <div className="grid h-full w-full place-items-center rounded-2xl bg-gradient-to-b from-white/30 to-black/30 text-4xl font-black text-white">
            0
          </div>
        </div>
        <div className="h-32 w-24 rounded-[1.125rem] bg-white/30 p-1 backdrop-blur">
          <div className="grid h-full w-full place-items-center rounded-2xl bg-gradient-to-b from-white/30 to-black/30 text-4xl font-black text-white">
            69
          </div>
        </div>
        <div className="h-32 w-24 rounded-[1.125rem] bg-white/30 p-1 backdrop-blur">
          <div className="grid h-full w-full place-items-center rounded-2xl bg-gradient-to-b from-white/30 to-black/30 text-4xl font-black text-white">
            69
          </div>
        </div>
        <div className="h-32 w-24 origin-bottom-left scale-75 rounded-[1.125rem] bg-white/30 p-1 backdrop-blur">
          <div className="grid h-full w-full animate-pulse place-items-center rounded-2xl bg-gradient-to-b from-white/30 to-black/30 text-4xl font-black text-white">
            69
          </div>
        </div>
      </div>
      <div className="container relative flex flex-col font-black italic">
        <div className="animate-rotate absolute -left-12 -top-24 -z-10 origin-[45%] md:-left-32 md:-top-24">
          <div
            className="animate-rotate-reverse h-16 w-56 rounded-xl border border-white/30 bg-white/10 p-3 font-mono text-[0.69rem] font-normal not-italic opacity-70 backdrop-blur md:h-24 md:w-72 md:rounded-3xl md:p-6 md:text-sm"
            style={{
              rotate: '-12deg',
            }}
          >
            <span className="text-blue-400">type</span> <span className="text-teal-400">arr1</span>{' '}
            = [<span className="text-orange-400">'a'</span>,{' '}
            <span className="text-orange-400">'b'</span>,{' '}
            <span className="text-orange-400">'c'</span>]
            <div className="h-1.5" />
            <span className="text-blue-400">type</span> <span className="text-teal-400">arr2</span>{' '}
            = [<span className="text-green-400">3</span>, <span className="text-green-400">2</span>,{' '}
            <span className="text-green-400">1</span>]
          </div>
        </div>
        <div className="animate-rotate-reverse absolute -bottom-28 -right-24 z-10 origin-[55%] md:-bottom-28 md:-right-32">
          <div
            className="animate-rotate h-16 w-56 rounded-xl border border-white/30 bg-white/10 p-3 font-mono text-[0.69rem] font-normal not-italic backdrop-blur md:h-24 md:w-72 md:rounded-3xl md:p-6 md:text-sm"
            style={{
              rotate: '12deg',
            }}
          >
            <span className="text-blue-400">type</span> <span className="text-teal-400">head1</span>{' '}
            = <span className="text-teal-400">First</span>&lt;
            <span className="text-teal-400">arr1</span>&gt;
            <div className="h-1.5" />
            <span className="text-blue-400">type</span> <span className="text-teal-400">head2</span>{' '}
            = <span className="text-teal-400">First</span>&lt;
            <span className="text-teal-400">arr2</span>&gt;
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
    </div>
  );
}
