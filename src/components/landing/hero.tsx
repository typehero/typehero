import { Github } from "lucide-react"
import { Button } from '~/components/ui/button';
import { FakeChallengeCard } from '~/components/landing/fake-challenge-card';
import Link from 'next/link';


const TypeHeroLogo = () => {
  return (
    <svg
      fill="none"
      viewBox="0 0 164 164"
      className="h-28 sm:h-44 w-28 sm:w-44 rounded-3xl sm:rounded-[2rem]"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0 29.8182C0 13.3501 13.3501 0 29.8182 0H134.182C150.65 0 164 13.3501 164 29.8182V134.182C164 150.65 150.65 164 134.182 164H29.8182C13.3501 164 0 150.65 0 134.182V29.8182Z"
        fill="#3178C6"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M71.4351 80.307H91.9394V67.0909H34.7879V80.307H55.1919V139.152H71.4351V80.307Z"
        fill="white"
      />
      <path
        d="M91.9394 139.152V67.0909H106.946V96.9549H129.078V67.0909H144.121V139.152H129.078V109.182H106.946V139.152H91.9394Z"
        fill="white"
      />
    </svg>
  );
};

const Hero = () => (
<section className="lg:overflow-x-hidden">
  {/* <svg className="pointer-events-none mix-blend-soft-light opacity-50 z-10 absolute left-0 top-0 h-full w-full" id="grain">
    <filter id="noise">
      <feTurbulence type="fractalNoise" baseFrequency="1" numOctaves="5" stitchTiles="stitch"></feTurbulence>
    </filter>
    <rect width="100%" height="100%" filter="url(#noise)"></rect>
  </svg> */}
  <div className="mb-[56px] container md:px-24 items-center justify-center grid lg:grid-cols-2 min-h-[calc(100lvh_-_112px)]">
    <div className="flex w-full flex-col justify-center items-center lg:items-start gap-10">
        <div className="relative flex w-full items-center justify-center lg:justify-start gap-4">
          <div className="absolute left-1/2 top-1/2 -z-10 hidden h-56 w-56 -translate-x-[15%] -translate-y-[50%] rounded-full bg-slate-400/10 blur-3xl dark:block"></div>
          <div className="absolute right-1/2 top-1/2 -z-10 hidden h-56 w-56 -translate-y-[40%] rounded-full bg-[#3178c6]/20 blur-3xl dark:block"></div>
          <TypeHeroLogo />
          <h1 className="bg-gradient-to-r from-[#3178c6] to-black bg-clip-text text-6xl sm:text-8xl font-extrabold sm:leading-[5.5rem] text-transparent dark:to-white">
            type
            <br />
            hero
          </h1>
        </div>
        
        <p className="max-w-[50ch] bg-transparent leading-9 px-8 lg:px-0 text-center lg:text-left text-black/50 dark:text-white/50">
          Connect, collaborate, and grow with a community of TypeScript developers. Elevate your
          skills trough interactive coding challenges, discussions, and knowledge sharing
        </p>
        <div className="flex gap-3">
          <Button className="font-bold rounded-xl py-2 px-4 flex items-center gap-2" asChild>
            <Link href="/explore">Explore challenges</Link>
          </Button>
          <Button
            className="border-2 rounded-xl py-2 px-4 flex items-center gap-2 dark:text-white"
            asChild
            variant="outline"
          >
            <a className="inline-flex gap-1" href="https://github.com/">
              <Github className="h-4 w-4" />
              GitHub
            </a>
          </Button>
        </div>
      </div>
    
    <div className="relative h-[800px] group rounded-full lg:block overflow-visible hidden">
        <div className="moving-grid-background top-1/2 -translate-y-1/2 rounded-full -inset-40 absolute -z-30 aspect-square translate-x-[-30px] shadow-[inset_0_0_5rem_3rem] shadow-background" />
        <FakeChallengeCard
          className="absolute group-hover:z-10 group-hover:translate-x-[27px] group-hover:translate-y-[256px] xl:group-hover:translate-x-[77px] translate-x-[100px] xl:translate-x-[190px] translate-y-[116px]"
          title="Implement a JSON parser type"
        />
        <FakeChallengeCard
          difficulty="EASY"
          className="absolute group-hover:translate-x-[100px] group-hover:translate-y-[116px] xl:group-hover:translate-x-[190px] translate-x-[27px] xl:translate-x-[77px] translate-y-[256px]"
          title="Implement a generic type"
        />
      </div>
    </div>
  </section>
)
export default Hero
