import { Github } from "lucide-react"
import FakeChallengeCards from "./fake-challeng-card"

const Hero = () => (
  <div className="mb-[56px] container items-center justify-center grid lg:grid-cols-2 min-h-[calc(100lvh_-_112px)]">
    {/* background film grain noise effect */}
    {/* <svg className="pointer-events-none mix-blend-soft-light opacity-50 z-10 fixed left-0 top-0 h-full w-full" id="grain">
      <filter id="noise">
        <feTurbulence type="fractalNoise" baseFrequency="1" numOctaves="5" stitchTiles="stitch"></feTurbulence>
      </filter>
      <rect width="100%" height="100%" filter="url(#noise)"></rect>
    </svg> */}
    <div className="flex h-full flex-col justify-center items-center lg:items-start gap-10 overflow-visible text-white">
      <div className="relative lg:mr-auto flex items-center gap-5">
        <div className="absolute left-1/2 top-1/2 -z-10 hidden h-56 w-56 -translate-x-[15%] -translate-y-1/2 rounded-full bg-white/10 blur-2xl dark:block lg:h-96 lg:w-96 lg:blur-3xl"></div>
        <div className="absolute right-1/2 top-1/2 -z-10 hidden h-56 w-56 -translate-y-1/2 translate-x-[15%] rounded-full bg-[#3178c6]/20 blur-2xl dark:block lg:h-96 lg:w-96 lg:blur-3xl"></div>
        <svg
          className="h-28 sm:h-44 w-28 sm:w-44 rounded-3xl sm:rounded-[2rem] dark:bg-[#3178C6] bg-[#3178C6] p-[2px]"
          viewBox="0 0 512 512"
          xmlns="http://www.w3.org/2000/svg"
          >
          <g clipPath="url(#clip0_1_2)">
            <path
              d="M462 0H50C22.3858 0 0 22.3858 0 50V462C0 489.614 22.3858 512 50 512H462C489.614 512 512 489.614 512 462V50C512 22.3858 489.614 0 462 0Z"
              className="fill-[#3178C6] dark:fill-[#3178C6]"
              />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M239.78 284.082H304V243H125V284.082H188.906V467H239.78V284.082Z"
              fill="white"
              />
            <path
              d="M303.13 466.986V242.986H349.72V335.818H418.427V242.986H465.13V466.986H418.427V373.827H349.72V466.986H303.13Z"
              fill="white"
              />
          </g>
          <defs>
            <clipPath id="clip0_1_2">
              <rect width="512" height="512" fill="white" />
            </clipPath>
          </defs>
        </svg>
        <h1 className="bg-gradient-to-r from-[#3178c6] dark:from-[#3178c6] from-30% to-black bg-clip-text font-black text-transparent dark:to-white text-6xl sm:text-8xl">
          type
          <br />
          hero
        </h1>
      </div>
      <p className="max-w-[50ch] bg-transparent leading-9 text-center lg:text-left text-black/50 dark:text-white/50">
        Connect, collaborate, and grow with a community of TypeScript developers. Elevate your skills through interactive coding challenges, discussions, and knowledge sharing
        {/* Connect and collaborate with a community of TypeScript developers on Type Hero.
        Engage in discussions, create challenges, and share insights with fellow typescript
        enthusiasts. Type Hero has collaborative coding challenges that foster a supportive and
        inspiring environment, where you can learn from others and showcase your expertise. */}
      </p>
      <div className="flex gap-5">
        <button className="dark:bg-white bg-black text-background py-2 px-4 rounded-xl">Explore Challenges</button>
        <button className="border-2 py-2 px-4 rounded-xl flex items-center gap-2">
          <Github className="h-4 w-4" />
          Github
        </button>
      </div>
    </div>
    

    <div className="relative lg:block overflow-visible hidden rounded-full w-full h-3/4">
      <div
        className="movingbackground absolute -z-30 -inset-40 top-1/2 -translate-y-1/2 rounded-full aspect-square shadow-[inset_0_0_5rem_5rem] shadow-background"
        style={{
          backgroundSize: '3.5rem 3.5rem',
          backgroundImage: 'linear-gradient(to right, #8888 1px, transparent 1px), linear-gradient(to bottom, #8888 1px, transparent 1px)',
        }}
      >

      </div>
      <FakeChallengeCards />
    </div>
  </div>
)
export default Hero
// import Link from 'next/link';

// import { Github as GitHubIcon } from 'lucide-react';

// import { Button } from '~/components/ui/button';
// import { FakeChallengeCard } from '~/components/landing/fake-challenge-card';

// const TypeHeroLogo = () => {
//   return (
//     <svg
//       width="164"
//       height="164"
//       viewBox="0 0 164 164"
//       fill="none"
//       xmlns="http://www.w3.org/2000/svg"
//     >
//       <path
//         d="M0 29.8182C0 13.3501 13.3501 0 29.8182 0H134.182C150.65 0 164 13.3501 164 29.8182V134.182C164 150.65 150.65 164 134.182 164H29.8182C13.3501 164 0 150.65 0 134.182V29.8182Z"
//         fill="#3178C6"
//       />
//       <path
//         fillRule="evenodd"
//         clipRule="evenodd"
//         d="M71.4351 80.307H91.9394V67.0909H34.7879V80.307H55.1919V139.152H71.4351V80.307Z"
//         fill="white"
//       />
//       <path
//         d="M91.9394 139.152V67.0909H106.946V96.9549H129.078V67.0909H144.121V139.152H129.078V109.182H106.946V139.152H91.9394Z"
//         fill="white"
//       />
//     </svg>
//   );
// };

// export const Hero = () => {
//   return (
//     <section className="flex justify-center" id="hero">
//       <div className="flex w-full max-w-6xl flex-col items-center px-8">
//         <div className="flex flex-row">
//           <div className="flex w-full flex-col justify-center gap-10">
//             <div className="relative flex w-full items-center justify-start gap-4">
//               <div className="absolute left-1/2 top-1/2 -z-10 hidden h-64 w-64 -translate-x-[30%] -translate-y-[50%] rounded-full bg-slate-400/20 blur-3xl dark:block lg:h-96 lg:w-96"></div>
//               <div className="absolute right-1/2 top-1/2 -z-10 hidden h-64 w-64 -translate-y-[40%] rounded-full bg-[#3178c6]/20 blur-3xl dark:block lg:h-96 lg:w-96"></div>
//               <TypeHeroLogo />
//               <h1 className="bg-gradient-to-r from-[#3178c6] to-black bg-clip-text text-8xl font-extrabold leading-[78px] text-transparent dark:to-white">
//                 type
//                 <br />
//                 hero
//               </h1>
//             </div>
//             <p className="text-base font-medium leading-7 text-neutral-700 dark:text-neutral-300">
//               Connect, collaborate, and grow with a community of TypeScript developers. Elevate your
//               skills trough interactive coding challenges, discussions, and knowledge sharing
//             </p>
//             <div className="flex gap-3">
//               <Button className="font-bold" asChild>
//                 <Link href="/explore">Explore challenges</Link>
//               </Button>
//               <Button
//                 className="border-2 border-black font-bold dark:border-white dark:text-white"
//                 asChild
//                 variant="outline"
//               >
//                 <a className="inline-flex gap-1" href="https://github.com/">
//                   <GitHubIcon />
//                   GitHub
//                 </a>
//               </Button>
//             </div>
//           </div>

//           <div className="relative h-[800px] w-full">
//             <div className="background absolute -z-30 aspect-square h-[750px] w-[650px] translate-x-[-30px] shadow-[inset_0_0_5rem_3rem] shadow-background"></div>
//             <FakeChallengeCard
//               className="absolute z-10 translate-x-[77px] translate-y-[258px]"
//               title="Implement a generic type"
//             />
//             <FakeChallengeCard
//               className="absolute translate-x-[190px] translate-y-[116px]"
//               title="Implement a JSON parser type"
//             />
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };
