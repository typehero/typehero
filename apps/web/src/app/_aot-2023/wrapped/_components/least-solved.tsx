'use client';

import { CheckCheck } from '@repo/ui/icons';
import { motion, type Variants } from 'framer-motion';
import Link from 'next/link';
import type { AotChallengeData } from '../page';
import Image from 'next/image';

interface Props {
  leastSolved: AotChallengeData[];
}
export function LeastSolved({ leastSolved }: Props) {
  const variants: Variants = {
    offscreen: {
      opacity: 0,
      y: -100,
    },
    onscreen: (delay: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay,
        duration: 0.5,
      },
    }),
  };

  return (
    <div className="flex h-screen w-full justify-center gap-2 bg-gradient-to-l from-red-100 to-30% dark:from-red-950">
      <div className="flex flex-col items-center justify-center gap-4 pt-20">
        <div className="relative">
          <p className="mb-10 text-5xl font-bold tracking-tighter text-red-950 sm:mx-[-130px] sm:text-8xl dark:text-red-50">
            LEAST SOLVED
          </p>
          <Image
            src="/aot/santa_dead.png"
            width={200}
            height={200}
            alt=""
            className="absolute hidden -scale-x-100 sm:-bottom-7 sm:-left-44 sm:block"
          />
          <Image
            src="/aot/santa_dead.png"
            width={100}
            height={100}
            alt=""
            className="absolute -left-10 bottom-1 -scale-x-100 sm:hidden"
          />
        </div>
        <div className="flex flex-col gap-10">
          {leastSolved.map((s, i) => {
            return (
              <Link key={s.slug} href={`/challenge/${s.slug}`} target="_blank">
                <motion.div
                  initial="offscreen"
                  variants={variants}
                  whileInView="onscreen"
                  viewport={{ once: false }}
                  custom={0}
                  className="flex items-center gap-4"
                >
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-500 text-3xl font-semibold  text-white">
                    {i + 1}
                  </div>
                  <div className="flex flex-col items-start justify-start gap-1 text-left">
                    <p className="text-xl font-semibold">{s.name}</p>
                    <p className="flex items-center gap-1 text-sm text-neutral-500">
                      <CheckCheck className="h-4 w-4" />
                      {s.userCount} Successful Submissions
                    </p>
                  </div>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
