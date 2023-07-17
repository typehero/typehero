import { Github } from "lucide-react"
import FakeChallengeCard from "./fake-challeng-card"

const Hero = () => (
  <div className="mb-[56px] container items-center grid grid-cols-2 min-h-[calc(100lvh_-_112px)]">
    {/* background film grain noise effect */}
    {/* <svg className="pointer-events-none mix-blend-soft-light opacity-50 z-10 fixed left-0 top-0 h-full w-full" id="grain">
      <filter id="noise">
        <feTurbulence type="fractalNoise" baseFrequency="1" numOctaves="5" stitchTiles="stitch"></feTurbulence>
      </filter>
      <rect width="100%" height="100%" filter="url(#noise)"></rect>
    </svg> */}
    <div className="flex h-full flex-col justify-center gap-10 overflow-visible">
      <div className="relative mr-auto flex items-center gap-5">
        <div className="absolute left-1/2 top-1/2 -z-10 hidden h-56 w-56 -translate-x-[15%] -translate-y-1/2 rounded-full bg-white/10 blur-2xl dark:block lg:h-96 lg:w-96 lg:blur-3xl"></div>
        <div className="absolute right-1/2 top-1/2 -z-10 hidden h-56 w-56 -translate-y-1/2 translate-x-[15%] rounded-full bg-[#3178c6]/20 blur-2xl dark:block lg:h-96 lg:w-96 lg:blur-3xl"></div>
        <svg
          className="h-44 w-44 rounded-[2rem] dark:bg-[#3178C6] bg-[#3178C6] p-[2px]"
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
        <h1 className="bg-gradient-to-r from-[#3178c6] dark:from-[#3178c6] from-30% to-black bg-clip-text text-7xl font-black text-transparent dark:to-white md:text-8xl">
          type
          <br />
          hero
        </h1>
      </div>
      <p className="max-w-[50ch] bg-transparent leading-9 text-black/50 dark:text-white/50">
        Connect, collaborate, and grow with a community of TypeScript developers. Elevate your skills trough interactive coding challenges, discussions, and knowledge sharing
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
    

    <div className="relative md:block hidden rounded-full w-full h-3/4">
      <div
        className="movingbackground absolute -z-30 -inset-40 top-1/2 -translate-y-1/2 rounded-full aspect-square shadow-[inset_0_0_5rem_5rem] shadow-background"
        style={{
          backgroundSize: '3.5rem 3.5rem',
          backgroundImage: 'linear-gradient(to right, #8888 1px, transparent 1px), linear-gradient(to bottom, #8888 1px, transparent 1px)',
        }}
      >

      </div>
      <div className="relative mx-auto w-4/5 h-full">
        <FakeChallengeCard />
      </div>
    </div>
  </div>
)
export default Hero