'use client';

import { Github } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '~/components/ui/button';
import { FakeChallengeCard } from '~/components/landing/fake-challenge-card';
import Link from 'next/link';

const TypeHeroLogo = () => {
  return (
    <svg
      fill="none"
      viewBox="0 0 164 164"
      className="h-28 w-28 rounded-3xl sm:h-44 sm:w-44 sm:rounded-[2rem]"
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
    <div className="container mb-[56px] grid min-h-[calc(100lvh_-_112px)] items-center justify-center lg:grid-cols-2">
      <div className="flex w-full flex-col items-center justify-center gap-10 lg:items-start">
        <div className="relative flex w-full items-center justify-center gap-4 lg:justify-start">
          <div className="absolute left-1/2 top-1/2 -z-10 hidden h-56 w-56 -translate-x-[15%] -translate-y-[50%] rounded-full bg-slate-400/10 blur-3xl dark:block"></div>
          <div className="absolute right-1/2 top-1/2 -z-10 hidden h-56 w-56 -translate-y-[40%] rounded-full bg-[#3178c6]/20 blur-3xl dark:block"></div>
          <TypeHeroLogo />
          <h1 className="bg-gradient-to-r from-[#3178c6] to-black bg-clip-text text-6xl font-extrabold text-transparent dark:to-white sm:text-8xl sm:leading-[5.5rem]">
            type
            <br />
            hero
          </h1>
        </div>

        <p className="max-w-[50ch] bg-transparent px-8 text-center leading-8 text-black/50 dark:text-white/50 lg:px-0 lg:text-left">
          Connect, collaborate, and grow with a community of TypeScript developers. Elevate your
          skills trough interactive coding challenges, discussions, and knowledge sharing
        </p>
        <div className="flex gap-3">
          <Button
            className="relative flex items-center gap-2 overflow-hidden rounded-xl px-4 py-2 font-bold"
            asChild
          >
            <Link href="/explore">Explore challenges</Link>
          </Button>
          <Button
            className="flex items-center gap-2 rounded-xl border-2 px-4 py-2 dark:text-white"
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

      <div className="relative hidden h-[800px] overflow-visible rounded-full lg:block">
        <div className="absolute -inset-40 top-1/2 -z-30 aspect-square -translate-y-1/2 translate-x-[-30px] overflow-hidden rounded-full">
          <div className="relative h-full w-full">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="moving-grid-background absolute h-full w-[200%]"
            />
            <div className="absolute h-full w-full rounded-full shadow-[inset_0_0_5rem_3rem] shadow-background" />
          </div>
        </div>
        <motion.div
          initial={{
            y: 80,
            x: 140,
            opacity: 0,
          }}
          animate={{
            y: 70,
            opacity: 1,
          }}
          className="group"
        >
          <FakeChallengeCard
            difficulty="EASY"
            className="absolute"
            title="Implement a generic type"
          />
        </motion.div>
        <motion.div
          initial={{
            opacity: 0,
            y: 270,
            x: 20,
          }}
          animate={{
            y: 260,
            opacity: 1,
            transition: {
              duration: 0.5,
            },
          }}
          className="group"
        >
          <FakeChallengeCard className="absolute" title="Implement a JSON parser type" />
        </motion.div>
      </div>
    </div>
  </section>
);
export default Hero;
