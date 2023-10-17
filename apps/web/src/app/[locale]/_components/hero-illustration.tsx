'use client';

import { motion } from 'framer-motion';
import { useIsMobile } from '~/utils/useIsMobile';
import { HeroChallengeCard } from './hero-challenge-card';

export function BackgroundGrid() {
  return (
    <div className="relative h-full w-full">
      <motion.div
        animate={{ opacity: 1 }}
        className="moving-grid-background absolute h-[200%] w-full"
        initial={{ opacity: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      />
      <div className="shadow-background absolute h-full w-full rounded-full shadow-[inset_0_0_5rem_3rem]" />
    </div>
  );
}

export function HeroIllustration() {
  const isMobile = useIsMobile();

  if (isMobile) {
    return null;
  }

  return (
    <div className="relative hidden h-[800px] overflow-visible rounded-full lg:block">
      <div className="absolute -inset-40 top-1/2 -z-30 -translate-y-1/2 translate-x-[-30px] overflow-hidden rounded-full">
        <BackgroundGrid />
      </div>

      <motion.div
        animate={{
          y: 140,
          opacity: 1,
          transition: {
            duration: 0.4,
          },
        }}
        className="group"
        initial={{
          y: 150,
          x: 180,
          opacity: 0,
        }}
      >
        <HeroChallengeCard
          username="bigmang"
          className="absolute"
          difficulty="EASY"
          prompt="Implement a union type of number and string"
          title="Implement a union type of number and string"
        />
      </motion.div>
      <motion.div
        animate={{
          y: 260,
          opacity: 1,
          transition: {
            duration: 0.4,
            delay: 0.1,
          },
        }}
        className="group"
        initial={{
          opacity: 0,
          y: 270,
          x: 80,
        }}
      >
        <HeroChallengeCard
          username="matt"
          className="absolute"
          difficulty="HARD"
          prompt="Convert a string literal to a number"
          title="String to Number"
        />
      </motion.div>
    </div>
  );
}
