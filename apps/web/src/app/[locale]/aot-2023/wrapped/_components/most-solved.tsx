'use client';

import { CheckCheck } from '@repo/ui/icons';
import { motion, type Variants } from 'framer-motion';
import Link from 'next/link';

interface Props {
  mostSolved: {
    id?: number | undefined;
    name?: string | undefined;
    slug?: string | undefined;
    challengeId: number;
    _count: {
      challengeId: number;
    };
  }[];
}
export function MostSolved({ mostSolved }: Props) {
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
    <div className="flex h-screen w-full items-center justify-between gap-2 bg-gradient-to-l from-green-100 to-30% dark:from-green-950">
      <div className="container flex flex-col-reverse items-center justify-between gap-4 sm:flex-row-reverse">
        <div className="flex flex-col gap-10">
          {mostSolved.map((s, i) => {
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
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-500 text-3xl font-semibold  text-white">
                    {i + 1}
                  </div>
                  <div className="flex flex-col items-start justify-start gap-1 text-left">
                    <p className="text-xl font-semibold">{s.name}</p>
                    <p className="flex items-center gap-1 text-sm text-neutral-500">
                      <CheckCheck className="h-4 w-4" />
                      {s._count.challengeId} Successful Submissions
                    </p>
                  </div>
                </motion.div>
              </Link>
            );
          })}
        </div>
        <p className="mb-10 text-4xl font-bold tracking-tighter text-green-950 dark:text-green-50 sm:mx-[-130px] sm:mb-0 sm:-rotate-90 sm:text-6xl">
          MOST SOLVED
        </p>
      </div>
    </div>
  );
}
