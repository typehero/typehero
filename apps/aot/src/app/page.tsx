// import { CodeXml, ExternalLink } from 'lucide-react';
import Snowfall from '../components/Snowfall';


export default function Home() {
  return <div className="grid place-content-center min-h-screen border bg-gradient-to-b from-emerald-400/40 to-transparent to-50%">
    <Snowfall />
    <div className="flex flex-col container font-black italic relative border border-red-500">
      <div className="absolute -z-10 flex justify-end top-0 right-0 w-full origin-top-right border border-green-500 animate-rotate">
        <div className="h-24 w-72 p-4 font-mono not-italic font-normal text-sm rounded-xl bg-white/10 backdrop-blur border border-white/30 animate-rotate-reverse">
         some typescript code here
        </div>
      </div>
      <div className="absolute -z-10 flex justify-start bottom-0 left-0 w-full origin-bottom-left border border-green-500 animate-rotate">
        <div className="h-24 w-72 p-4 font-mono not-italic font-normal text-sm rounded-xl bg-white/10 backdrop-blur border border-white/30 animate-rotate-reverse">
         some typescript code here
        </div>
      </div>
      <div className="text-4xl sm:text-8xl leading-5 sm:leading-10 w-56 sm:w-[40rem]">Advent</div>
      <div className="text-2xl sm:text-6xl mx-auto text-center text-rose-400 leading-5 sm:leading-10 z-10 w-56 sm:w-[40rem]">of</div>
      <div className="text-4xl sm:text-8xl ml-auto text-right leading-5 sm:leading-10 w-56 sm:w-[40rem]">TypeScript</div>
    </div>
  </div>;
}
