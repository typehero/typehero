'use client';

import { DifficultyBadge } from '@repo/ui';
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  type MotionStyle,
  type MotionValue,
} from 'framer-motion';
import { Check, Minus, Triangle, X } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState, type MouseEvent } from 'react';

type WrapperStyle = MotionStyle & {
  '--x': MotionValue<string>;
  '--y': MotionValue<string>;
};

export function FeatureCard4({
  title,
  description,
  classNameBG,
}: {
  title: string;
  description: string;
  classNameBG?: string;
}) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();

    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <motion.div
      className="animated-feature-cards relative w-full drop-shadow-[0_0_15px_rgba(49,49,49,0.2)] dark:drop-shadow-[0_0_15px_rgba(49,49,49,0.2)]"
      onMouseMove={handleMouseMove}
      style={
        {
          '--x': useMotionTemplate`${mouseX}px`,
          '--y': useMotionTemplate`${mouseY}px`,
        } as WrapperStyle
      }
    >
      <motion.div
        className={`group relative w-full overflow-hidden rounded-3xl border bg-gradient-to-b from-neutral-50/90 to-neutral-100/90 backdrop-blur-2xl transition duration-300 hover:border-transparent dark:from-neutral-950/90 dark:to-neutral-800/90 ${classNameBG}`}
      >
        <div className="mx-10 my-10 min-h-[450px] w-full">
          <div className="flex w-4/6 flex-col gap-3">
            <h2 className="text-xl font-bold tracking-tight md:text-xl">{title}</h2>
            <p className="text-base leading-7 text-zinc-600 dark:text-zinc-400">{description}</p>
          </div>
          {mounted ? (
            <>
              <div className="absolute inset-0 top-[38%] flex flex-col items-center justify-center gap-1">
                <div className="flex w-[69%] items-center justify-between gap-3 rounded-b-lg rounded-t-2xl bg-neutral-500/10 p-2 pl-3">
                  <span className="text-sm font-medium">Track name</span>
                  <div className="flex items-center gap-3">
                    <Minus className="h-3 w-3" />
                    <Triangle className="h-3 w-3" />
                    <X className="h-3 w-3" />
                  </div>
                </div>
                <input className="peer/1 appearance-none" type="checkbox" id="toggle" />
                <label
                  htmlFor="toggle"
                  className="flex w-[69%] cursor-pointer items-center justify-between gap-3 rounded-lg bg-neutral-500/10 p-4 text-zinc-700 duration-300 hover:scale-105 hover:rounded-xl active:scale-100 active:duration-75 group-hover:hover:bg-neutral-500/20 peer-checked/1:bg-pink-300/50 
                  peer-checked/1:hover:bg-pink-300/50 dark:text-zinc-300 peer-checked/1:dark:text-white"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-4 w-4 rounded-lg">
                      <Check className="h-3 w-3" />
                    </div>
                    Awaited
                  </div>
                  <div className="group">
                    <DifficultyBadge difficulty="BEGINNER" />
                  </div>
                </label>

                <input className="peer/2 appearance-none" type="checkbox" id="toggle2" />
                <label
                  htmlFor="toggle2"
                  className="flex w-[69%] cursor-pointer items-center justify-between gap-3 rounded-lg bg-neutral-500/10 p-4 text-zinc-700 duration-300 hover:scale-105 hover:rounded-xl active:scale-100 active:duration-75 group-hover:hover:bg-neutral-500/20 peer-checked/2:bg-emerald-300/50 peer-checked/2:hover:bg-emerald-300/50 dark:text-zinc-300"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-4 w-4 rounded-lg">
                      <Check className="h-3 w-3" />
                    </div>
                    Unshift
                  </div>
                  <div className="group">
                    <DifficultyBadge difficulty="EASY" />
                  </div>
                </label>

                <input className="peer/3 appearance-none" type="checkbox" id="toggle3" />
                <label
                  htmlFor="toggle3"
                  className="flex w-[69%] cursor-pointer items-center justify-between gap-3 rounded-lg bg-neutral-500/10 p-4 text-zinc-700 duration-300 hover:scale-105 hover:rounded-xl active:scale-100 active:duration-75 group-hover:hover:bg-neutral-500/20 peer-checked/3:bg-yellow-300/50 peer-checked/3:hover:bg-yellow-300/50 dark:text-zinc-300"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-4 w-4 rounded-lg">
                      <Check className="h-3 w-3" />
                    </div>
                    Append Argument
                  </div>
                  <div className="group">
                    <DifficultyBadge difficulty="MEDIUM" />
                  </div>
                </label>

                <input className="peer/4 appearance-none" type="checkbox" id="toggle4" />
                <label
                  htmlFor="toggle4"
                  className="flex w-[69%] cursor-pointer items-center justify-between gap-3 rounded-lg bg-neutral-500/10 p-4 text-zinc-700 duration-300 hover:scale-105 hover:rounded-xl active:scale-100 active:duration-75 group-hover:hover:bg-neutral-500/20 peer-checked/4:bg-red-300/50 peer-checked/4:hover:bg-red-300/50 dark:text-zinc-300"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-4 w-4 rounded-lg">
                      <Check className="h-3 w-3" />
                    </div>
                    CamelCase
                  </div>
                  <div className="group">
                    <DifficultyBadge difficulty="HARD" />
                  </div>
                </label>

                <input className="peer/5 appearance-none" type="checkbox" id="toggle5" />
                <label
                  htmlFor="toggle5"
                  className="flex w-[69%] cursor-pointer items-center justify-between gap-3 rounded-lg bg-neutral-500/10 p-4 text-zinc-700 duration-300 hover:scale-105 hover:rounded-xl active:scale-100 active:duration-75 group-hover:hover:bg-neutral-500/20 peer-checked/5:bg-orange-300/50 peer-checked/5:hover:bg-orange-300/50 dark:text-zinc-300"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-4 w-4 rounded-lg">
                      <Check className="h-3 w-3" />
                    </div>
                    Get Readonly Keys
                  </div>
                  <div className="group">
                    <DifficultyBadge difficulty="EXTREME" />
                  </div>
                </label>
              </div>
            </>
          ) : null}
        </div>
      </motion.div>
    </motion.div>
  );
}
