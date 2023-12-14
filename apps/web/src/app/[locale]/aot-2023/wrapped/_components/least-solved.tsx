'use client';

import { Calendar, CheckCheck } from '@repo/ui/icons';
import { motion, type Variants } from 'framer-motion';

export function LeastSolved() {
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
    <div className="flex h-screen w-full items-center justify-between gap-2 bg-gradient-to-l from-red-100 to-30% dark:from-red-950">
      <div className="container flex flex-col-reverse items-center justify-between gap-4 sm:flex-row-reverse">
        <div className="flex flex-col gap-10">
          <motion.div
            initial="offscreen"
            variants={variants}
            whileInView="onscreen"
            viewport={{ once: false }}
            custom={0}
            className="flex items-center gap-4"
          >
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-500 text-3xl font-semibold  text-white">
              1
            </div>
            <div className="flex flex-col items-start justify-start gap-1 text-left">
              <p className="flex items-center gap-1 text-xs text-neutral-500">
                <Calendar className="h-4 w-4" />
                Day One
              </p>
              <p className="text-xl font-semibold">Christmas Cookies</p>
              <p className="flex items-center gap-1 text-sm text-neutral-500">
                <CheckCheck className="h-4 w-4" />
                8246 Successful Submissions
              </p>
            </div>
          </motion.div>
          <motion.div
            initial="offscreen"
            variants={variants}
            whileInView="onscreen"
            viewport={{ once: false }}
            custom={0.3}
            className="flex items-center gap-4"
          >
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-500 text-3xl font-semibold  text-white">
              2
            </div>
            <div className="flex flex-col items-start justify-start gap-1 text-left">
              <p className="flex items-center gap-1 text-xs text-neutral-500">
                <Calendar className="h-4 w-4" />
                Day Two
              </p>
              <p className="text-xl font-semibold">Christmas Cookie Inventory</p>
              <p className="flex items-center gap-1 text-sm text-neutral-500">
                <CheckCheck className="h-4 w-4" />
                3223 Successful Submissions
              </p>
            </div>
          </motion.div>
          <motion.div
            initial="offscreen"
            variants={variants}
            whileInView="onscreen"
            viewport={{ once: false }}
            custom={0.6}
            className="flex items-center gap-4"
          >
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-500 text-3xl font-semibold  text-white">
              3
            </div>
            <div className="flex flex-col items-start justify-start gap-1 text-left">
              <p className="flex items-center gap-1 text-xs text-neutral-500">
                <Calendar className="h-4 w-4" />
                Day Three
              </p>
              <p className="text-xl font-semibold">The Gift Wrapper</p>
              <p className="flex items-center gap-1 text-sm text-neutral-500">
                <CheckCheck className="h-4 w-4" />
                1246 Successful Submissions
              </p>
            </div>
          </motion.div>
        </div>
        <p className="mb-10 text-4xl font-bold tracking-tighter text-green-950 dark:text-green-50 sm:mx-[-130px] sm:mb-0 sm:-rotate-90 sm:text-6xl">
          LEAST SOLVED
        </p>
      </div>
    </div>
  );
}
