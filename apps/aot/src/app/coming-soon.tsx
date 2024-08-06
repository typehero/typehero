// import { CodeXml, ExternalLink } from 'lucide-react';

export function ComingSoon() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 p-8">
      {/* bottom light */}
      <div className="fixed bottom-0 h-12 w-screen translate-y-1/2 animate-pulse rounded-[100%] bg-white/50 blur-3xl" />
      {/* background timer */}
      <div className="absolute left-1/2 top-1/2 grid -translate-x-1/2 -translate-y-1/2 grid-cols-4 opacity-30">
        <div className="h-48 w-36 rounded-3xl bg-white/30 p-1">
          <div className="grid h-full w-full place-items-center rounded-2xl bg-gradient-to-b from-white/30 to-black/30 text-7xl font-black text-neutral-300">
            0
          </div>
        </div>
        <div className="h-48 w-36 rounded-3xl bg-white/30 p-1">
          <div className="grid h-full w-full place-items-center rounded-2xl bg-gradient-to-b from-white/30 to-black/30 text-7xl font-black text-neutral-300">
            69
          </div>
        </div>
        <div className="h-48 w-36 rounded-3xl bg-white/30 p-1">
          <div className="grid h-full w-full place-items-center rounded-2xl bg-gradient-to-b from-white/30 to-black/30 text-7xl font-black text-neutral-300">
            69
          </div>
        </div>
        <div className="h-48 w-36 rounded-3xl bg-white/30 p-1">
          <div className="grid h-full w-full place-items-center rounded-2xl bg-gradient-to-b from-white/30 to-black/30 text-7xl font-black text-neutral-300">
            69
          </div>
        </div>
      </div>

      <div className="z-10 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 p-[1px]">
        <div className="rounded-full bg-black">
          <div className="rounded-full bg-gradient-to-r from-blue-300/40 to-blue-500/40 px-3 py-1">
            <div className="flex items-center gap-2 bg-gradient-to-r from-blue-300 to-blue-500 bg-clip-text text-transparent">
              {/* <CodeXml className="h-4 w-4 stroke-blue-300" /> */}
              AoT 2024
            </div>
          </div>
        </div>
      </div>
      <h1 className="z-10 my-12 text-4xl sm:text-6xl">Coming Soon</h1>
      <p className="z-10 font-mono text-lg font-light text-white/50">
        Practice on{' '}
        <a
          href="https://typehero.dev"
          className="group inline-flex items-center gap-2 duration-300 hover:text-blue-400 hover:underline"
        >
          TypeHero.dev
          {/* <ExternalLink className="h-4 w-4 opacity-0 -translate-x-1 translate-y-1 scale-75 duration-300 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:scale-100" /> */}
        </a>
      </p>
    </main>
  );
}
