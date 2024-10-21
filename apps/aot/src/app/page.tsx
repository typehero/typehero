// import { CodeXml, ExternalLink } from 'lucide-react';
import Snowfall from '../components/Snowfall';

export default function Home() {
  return (
    <div className="grid min-h-screen place-content-center overflow-hidden bg-gradient-to-b from-emerald-400/40 to-transparent to-50%">
      <Snowfall />
      <div className="container relative flex flex-col font-black italic">
        <div className="h-full w-full bg-red-500">
          <div className="animate-rotate absolute right-0 top-0 -z-10 flex w-full origin-top-right justify-end ">
            <div className="animate-rotate-reverse h-24 w-72 rounded-xl border border-white/30 bg-white/10 p-4 font-mono text-sm font-normal not-italic backdrop-blur">
              some typescript code here
            </div>
          </div>
          <div className="animate-rotate absolute bottom-0 left-0 -z-10 flex w-full origin-bottom-left justify-start ">
            <div className="animate-rotate-reverse h-24 w-72 rounded-xl border border-white/30 bg-white/10 p-4 font-mono text-sm font-normal not-italic backdrop-blur">
              some typescript code here
            </div>
          </div>
        </div>
        <div className="w-56 text-4xl leading-5 sm:w-[40rem] sm:text-8xl sm:leading-10">Advent</div>
        <div className="z-10 mx-auto w-56 text-center text-2xl leading-5 text-rose-400 sm:w-[40rem] sm:text-6xl sm:leading-10">
          of
        </div>
        <div className="ml-auto w-56 text-right text-4xl leading-5 sm:w-[40rem] sm:text-8xl sm:leading-10">
          TypeScript
        </div>
      </div>
    </div>
  );
}
