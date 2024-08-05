'use client';

import { CheckCheck } from '@repo/ui/icons';
import { motion, type Variants } from 'framer-motion';
import Link from 'next/link';
import type { AotChallengeData } from '../page';
import Image from 'next/image';

interface Props {
  mostSolved: AotChallengeData[];
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
    <div className="flex h-screen w-full justify-center gap-2 bg-gradient-to-l from-green-100 to-30% dark:from-green-950">
      <div className="flex flex-col items-center justify-center gap-4 pt-20">
        <div className="relative">
          <p className="mb-10 text-5xl font-bold tracking-tighter text-green-950 sm:mx-[-130px] sm:text-8xl dark:text-green-50">
            MOST SOLVED
          </p>
          <Image
            src="/aot/sunglasses2.png"
            width={150}
            height={150}
            alt=""
            className="absolute hidden -scale-x-100 sm:-bottom-24 sm:-left-36 sm:block"
          />
          <Image
            src="/aot/sunglasses2.png"
            width={100}
            height={100}
            alt=""
            className="absolute -bottom-10 -left-14 -scale-x-100 sm:hidden"
          />
        </div>
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
