import { Github, Sparkle, Twitter, Compass } from '@repo/ui/icons';
import Link from 'next/link';
import { Balancer } from 'react-wrap-balancer';
import { Button } from '@repo/ui/components/button';
import { HeroIllustration, BackgroundGrid } from './hero-illustration';
import { auth } from '~/server/auth';

function TypeHeroLogo3D() {
  return (
    <svg
      className="h-28 w-28 sm:h-44 sm:w-44"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 633 633"
      fill="none"
    >
      <g className="dark:hidden">
        <path
          d="M0 74.9605C0 33.561 33.561 0 74.9605 0H558.039C599.439 0 633 33.561 633 74.9605V558.039C633 599.439 599.439 633 558.039 633H74.9605C33.561 633 0 599.439 0 558.039V74.9605Z"
          fill="#3178C6"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M261.441 348.724H333.158V299.842H133.263V348.724H204.629V566.368H261.441V348.724Z"
          fill="white"
        />
        <path
          d="M366.474 566.368V299.842H423.962V410.298H508.741V299.842H566.368V566.368H508.741V455.523H423.962V566.368H366.474Z"
          fill="white"
        />
      </g>
      <g className="animate-logo-light hidden dark:block">
        <path
          d="M0 74.9605C0 33.561 33.561 0 74.9605 0H558.039C599.439 0 633 33.561 633 74.9605V558.039C633 599.439 599.439 633 558.039 633H74.9605C33.561 633 0 599.439 0 558.039V74.9605Z"
          fill="#3178C6"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M261.441 348.724H333.158V299.842H133.263V348.724H204.629V566.368H261.441V348.724Z"
          fill="white"
        />
        <path
          d="M366.474 566.368V299.842H423.962V410.298H508.741V299.842H566.368V566.368H508.741V455.523H423.962V566.368H366.474Z"
          fill="white"
        />
      </g>
      <g className="animate-3d-logo hidden dark:block" filter="url(#filter0_ii_1050_32)">
        <path
          d="M0 74.9605C0 33.561 33.561 0 74.9605 0H558.039C599.439 0 633 33.561 633 74.9605V558.039C633 599.439 599.439 633 558.039 633H74.9605C33.561 633 0 599.439 0 558.039V74.9605Z"
          fill="#3178C6"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M261.441 348.724H333.158V299.842H133.263V348.724H204.629V566.368H261.441V348.724Z"
          fill="white"
        />
        <path
          d="M366.474 566.368V299.842H423.962V410.298H508.741V299.842H566.368V566.368H508.741V455.523H423.962V566.368H366.474Z"
          fill="white"
        />
      </g>
      <defs>
        <filter
          id="filter0_ii_1050_32"
          x="-49"
          y="-49"
          width="732"
          height="732"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dx="-49" dy="-49" />
          <feGaussianBlur stdDeviation="74.5" />
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.5 0" />
          <feBlend mode="normal" in2="shape" result="effect1_innerShadow_1050_32" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dx="50" dy="50" />
          <feGaussianBlur stdDeviation="57.5" />
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
          <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.12 0" />
          <feBlend
            mode="normal"
            in2="effect1_innerShadow_1050_32"
            result="effect2_innerShadow_1050_32"
          />
        </filter>
      </defs>
    </svg>
  );
}
function BeamOfLight() {
  return (
    <svg
      className="animate-beam pointer-events-none absolute left-0 top-0 z-[-1] h-[169%] w-[138%] lg:w-[84%]"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 3787 2842"
      fill="none"
    >
      <g filter="url(#filter0_f_1065_8)">
        <ellipse
          cx="1924.71"
          cy="273.501"
          rx="1924.71"
          ry="273.501"
          transform="matrix(-0.822377 -0.568943 -0.568943 0.822377 3631.88 2291.09)"
          fill="white"
          fillOpacity="0.21"
        />
      </g>
      <defs>
        <filter
          id="filter0_f_1065_8"
          x="0.860352"
          y="0.838989"
          width="3785.16"
          height="2840.26"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur stdDeviation="151" result="effect1_foregroundBlur_1065_8" />
        </filter>
      </defs>
    </svg>
  );
}

export async function Hero() {
  const session = await auth();
  return (
    <section className="pointer-events-none min-h-screen lg:min-h-0 lg:pt-[3.5rem]">
      <div className="absolute inset-10 -z-30 overflow-hidden rounded-full opacity-70 lg:hidden">
        <BackgroundGrid />
      </div>
      <div className="container relative -mt-[3rem] grid min-h-screen items-center justify-center py-24 lg:min-h-0 lg:grid-cols-2 lg:py-0 [&>*]:pointer-events-auto">
        <BeamOfLight />
        <div className="flex w-full flex-col items-center justify-center gap-10 lg:items-start">
          <a
            target="_blank"
            rel="noreferrer"
            href="https://github.com/typehero/typehero"
            className="animate-bg-gradient-to-center group rounded-full bg-gradient-to-r from-yellow-600 via-[#3178c6] to-[#3178c6] to-70% bg-[length:420%_420%] bg-right-bottom p-[1px] brightness-90 contrast-150 duration-500 hover:bg-left-top hover:shadow-[0_0_2rem_-0.5rem_#3178c6] dark:from-yellow-500 dark:via-white dark:to-[#3178c6] dark:brightness-125 dark:contrast-100 dark:hover:shadow-[0_0_2rem_-0.5rem_#fff8]"
          >
            <div className="rounded-full bg-white/80 px-3 py-1 dark:bg-black/80">
              <span className="animate-bg-gradient-to-center relative flex select-none items-center bg-gradient-to-r to-70% bg-[length:420%_420%] bg-clip-text bg-right-bottom text-transparent duration-500 group-hover:bg-left-top dark:from-yellow-500 dark:via-white dark:to-[#3178c6]">
                <Sparkle className="animate-oldstar absolute  -left-1 top-0.5 mr-2 h-5 w-5 translate-x-0.5 stroke-[#3178c6] stroke-2 duration-500 group-hover:rotate-180 group-hover:scale-110 group-hover:stroke-yellow-600 dark:duration-500  " />
                <Sparkle className="animate-newstar mr-2 h-4 w-4 stroke-[#3178c6] stroke-2 duration-500 group-hover:rotate-180 group-hover:scale-110 group-hover:fill-[#3178c6] dark:stroke-white dark:duration-500 dark:group-hover:fill-white" />{' '}
                Star us on GitHub
              </span>
            </div>
          </a>
          <div className="relative flex w-full items-center justify-center gap-4 lg:justify-start">
            <div className="absolute left-1/2 top-1/2 -z-10 hidden h-56 w-56 -translate-x-[15%] -translate-y-[50%] rounded-full bg-slate-400/10 blur-3xl dark:block" />
            <div className="absolute right-1/2 top-1/2 -z-10 hidden h-56 w-56 -translate-y-[40%] rounded-full bg-[#3178c6]/20 blur-3xl dark:block" />
            <TypeHeroLogo3D />
            <h1 className="animate-bg-gradient-to-center-title dark:to-69% select-none bg-gradient-to-br from-[#3178c6] from-[69%] to-black/0 bg-clip-text bg-right-bottom text-6xl font-extrabold text-transparent sm:text-8xl sm:leading-[5.5rem] dark:from-white dark:from-30% dark:via-[#3178c6] dark:to-[#3178c6] dark:bg-[length:300%_300%]">
              type
              <br />
              hero
            </h1>
          </div>

          <p className="max-w-[55ch] bg-transparent text-center font-medium leading-8 text-black/60 sm:px-8 lg:px-0 lg:text-left dark:text-white/50">
            <Balancer>
              Connect, collaborate, and grow with a community of TypeScript developers. Elevate your
              skills through interactive coding challenges, discussions, and knowledge sharing
            </Balancer>
          </p>
          <div className="flex flex-col-reverse gap-3 md:flex-row">
            <Button
              asChild
              className="hero-join-button-dark group relative mx-auto hidden w-fit overflow-hidden rounded-xl p-[1px] font-bold transition-all duration-300 md:mr-0 lg:mr-auto dark:block dark:hover:shadow-[0_0_2rem_-0.5rem_#fff8]"
              variant="outline"
            >
              <Link href="/explore">
                <span className="inline-flex h-full w-fit items-center gap-2 rounded-xl px-4 py-2 transition-all duration-300 dark:bg-neutral-900 dark:text-white group-hover:dark:bg-black">
                  <Compass className="h-4 w-4" />
                  {session ? 'Explore' : 'Start exploring'}
                </span>
              </Link>
            </Button>
            <div className="flex gap-3">
              <Button
                asChild
                className="flex items-center gap-2 rounded-xl border-2 px-4 py-2 dark:text-white"
                variant="outline"
              >
                <a
                  target="_blank"
                  rel="noreferrer"
                  className="gap-1 md:inline-flex"
                  href="https://github.com/typehero/typehero"
                >
                  <Github className="h-4 w-4" />
                  GitHub
                </a>
              </Button>
              <Button
                asChild
                className="flex items-center gap-2 rounded-xl border-2 px-4 py-2 dark:text-white"
                variant="outline"
              >
                <a
                  target="_blank"
                  rel="noreferrer"
                  className="gap-1 md:inline-flex"
                  href="https://twitter.com/typeheroapp"
                >
                  <Twitter className="h-4 w-4" />
                  Twitter
                </a>
              </Button>
            </div>
          </div>
        </div>

        <HeroIllustration />
      </div>
    </section>
  );
}
