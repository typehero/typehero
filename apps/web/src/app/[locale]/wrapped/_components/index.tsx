'use client';
import * as React from 'react';
import { useState } from 'react';
import { motion, AnimatePresence, type Variants, animate } from 'framer-motion';
import { GeneralOverview } from './general-overview';
import { Welcome } from './welcome';
import { SpecificOverview } from './specific-overview';
import { Button } from '@repo/ui/components/button';
import { ChevronLeft, ChevronRight } from '@repo/ui/icons';

export async function TypeHeroWrapped() {
  const textVariants: Variants = {
    offscreen: ({ direction }: { direction: -1 | 1 }) => ({
      opacity: 0,
      y: -100 * direction,
    }),
    onscreen: ({ delay }: { delay: number }) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay,
        duration: 0.5,
      },
    }),
  };

  function Counter({
    from,
    to,
    delay = 0,
    className = '',
  }: {
    from: number;
    to: number;
    delay?: number;
    className?: string;
  }) {
    const ref = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
      const controls = animate(from, to, {
        duration: 1,
        delay,
        onUpdate(value) {
          ref && ref.current && (ref.current.textContent = value.toFixed());
        },
      });
      return () => controls.stop();
    }, [from, to, delay]);

    return <div className={className} ref={ref} />;
  }

  const AnimatedText = ({
    children,
    delay = 0,
    direction = 1,
  }: {
    children: React.ReactNode;
    delay?: number;
    direction?: -1 | 1;
  }) => (
    <motion.div
      initial="offscreen"
      className="flex flex-col items-center"
      variants={textVariants}
      whileInView="onscreen"
      viewport={{ once: false }}
      custom={{ delay, direction }}
    >
      {children}
    </motion.div>
  );

  return (
    <div className="h-full w-full ">
      <div className="flex h-[calc(100vh)] flex-col items-center justify-center">
        <AnimatedText>
          <h1 className="mb-10 text-center text-4xl font-bold tracking-tighter text-black dark:text-white sm:text-8xl">
            <span>Advent</span> of <span className="text-red-600">TypeScript</span>
          </h1>
          <div className="text-6xl font-bold">Wrapped 2023 🎉</div>
        </AnimatedText>
      </div>
      <div className="flex h-[calc(100vh)] flex-col items-center justify-center gap-2">
        <AnimatedText>
          <h2 className="text-3xl font-semibold">Hello, zaCKoZack0 👋</h2>
        </AnimatedText>
        <AnimatedText delay={0.5}>
          <div className="text-xl">Let's wrap this year with some TypeScript and Cookies.</div>
        </AnimatedText>
        <AnimatedText direction={-1} delay={1}>
          <div className="text-xl font-semibold">Are you ready??</div>
        </AnimatedText>
      </div>
      <div className="flex h-[calc(100vh)] flex-col items-center justify-center gap-4">
        <AnimatedText>
          <h2 className="text-5xl font-semibold">You are a real Type Hero, we got.</h2>
        </AnimatedText>
        <AnimatedText direction={-1} delay={2}>
          <div className="flex items-center rounded-full border bg-gradient-to-b from-gray-100/50 px-4 py-2 text-4xl shadow">
            <Counter from={0} to={4300} delay={2.7} />+ Total Submissions
          </div>
        </AnimatedText>
        <AnimatedText direction={-1} delay={1}>
          <div className="flex items-center rounded-full border border-green-200/50 bg-gradient-to-b from-green-200/50 px-4 py-2 text-4xl shadow">
            <Counter from={0} to={1000} delay={1.5} />+ Accepted Submissions
          </div>
        </AnimatedText>
      </div>
      <div className="flex h-[calc(100vh)] flex-col items-center justify-center gap-4">
        <div className="flex items-center gap-4">
          <AnimatedText>
            <div>
              <h2 className="bg-gradient-to-b from-black to-gray-300 bg-clip-text p-1 text-5xl font-semibold text-transparent dark:from-white dark:to-gray-700">
                TypeScript Titans
              </h2>
              <p className="py-1 text-neutral-500">
                Users who solved every challenge, yes all 25 of them.
              </p>
            </div>
          </AnimatedText>
          <div className="relative w-40">
            <AnimatedText direction={-1}>
              <div className="bg-background/50 border-foreground/50 z-[2] flex w-full flex-col   items-center rounded-lg border-2">
                <Counter
                  className="text-foreground/75 w-full text-center text-9xl text-gray-700"
                  from={0}
                  to={7}
                  delay={1}
                />{' '}
                <div className="text-neutral-500">Users</div>
              </div>
              <div className="absolute h-40 w-40 bg-blue-500/50 blur-2xl" />
            </AnimatedText>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <AnimatedText delay={0.5}>
            <div>
              <h2 className="bg-gradient-to-b from-black to-gray-300 bg-clip-text p-1 text-5xl font-semibold text-transparent dark:from-white dark:to-gray-700">
                TypeScript Gurus
              </h2>
              <p className="py-1 text-neutral-500">Users who solved 20+ challenges, excellent.</p>
            </div>
          </AnimatedText>
          <div className="relative w-40">
            <AnimatedText direction={-1} delay={1}>
              <div className="bg-background/50 border-foreground/50 z-[2] flex w-full flex-col   items-center rounded-lg border-2">
                <Counter
                  className="text-foreground/75 w-full text-center text-9xl"
                  from={0}
                  to={18}
                  delay={1}
                />{' '}
                <div className="text-neutral-500">Users</div>
              </div>
              <div className="absolute h-40 w-40 bg-blue-500/50 blur-2xl" />
            </AnimatedText>
          </div>
        </div>
      </div>
    </div>
  );
}
