import type { Difficulty } from '@repo/db/types';
import { clsx } from 'clsx';
import { motion, type SVGMotionProps } from 'framer-motion';
import type { ReactNode } from 'react';
import { useScopedI18n } from '~/locales/client';

function getRandomWidth() {
  const min = 100;
  const range = 240 - min;
  let rand = Math.random();
  rand = Math.floor(Math.random() * range);
  rand = rand + min;

  return rand;
}

export interface FakeChallengeCardProps {
  username: string;
  title: string;
  className?: string;
  difficulty: Difficulty;
  prompt: ReactNode;
}

const COLORS_BY_DIFFICULTY = {
  BEGINNER: 'dark:bg-pink-300 bg-pink-600',
  EASY: 'dark:bg-green-300 bg-green-600',
  MEDIUM: 'dark:bg-yellow-300 bg-yellow-600',
  HARD: 'dark:bg-red-300 bg-red-600',
  EXTREME: 'dark:bg-orange-300 bg-orange-600',
  // this will never actually be used
  EVENT: 'dark:bg-orange-300 bg-orange-600',
};

const codeLineProps = {
  width: 0,
  rx: '4.5',
  height: 10,
  initial: { width: 0 },
  transition: { duration: 0.5, delay: 0.15 },
} as SVGMotionProps<SVGRectElement>;

export function HeroChallengeCard({
  username,
  prompt,
  title,
  className,
  difficulty = 'HARD',
}: FakeChallengeCardProps) {
  const t = useScopedI18n('general');

  return (
    <div
      className={clsx(className, {
        'group/card flex w-[320px] flex-col gap-3 rounded-2xl border border-neutral-300 bg-zinc-100 p-7 drop-shadow-[0_0_15px_rgba(49,49,49,0.2)] duration-300 hover:-skew-x-3 hover:scale-105 hover:shadow-[2rem_2rem_2rem_-1rem_#0004,inset_1rem_1rem_4rem_-1rem_#fff1] dark:border-zinc-800 dark:bg-zinc-900 dark:drop-shadow-[0_0_15px_rgba(49,49,49,0.35)] dark:hover:border-zinc-600':
          true,
      })}
    >
      <p className="translate-x-1 text-lg font-medium">{title}</p>
      <div className="flex gap-3">
        <div
          className={`inline-flex w-fit translate-x-1 items-center rounded-full border border-transparent px-2.5 py-0.5 text-xs font-semibold text-white duration-300 group-hover/card:-translate-x-0 group-hover/card:-translate-y-1 group-hover/card:shadow-[0.5rem_0.5rem_0.25rem_-0.25rem_#0004] dark:text-black ${COLORS_BY_DIFFICULTY[difficulty]}`}
        >
          {t(`difficulty.${difficulty}`).toUpperCase()}
        </div>
        <div className="flex w-fit items-center justify-center rounded-full bg-transparent bg-zinc-600 px-2.5 py-1 pl-1.5 pr-2 text-xs font-bold text-neutral-50 duration-300 group-hover/card:-translate-x-1 group-hover/card:-translate-y-1 group-hover/card:shadow-[0.5rem_0.5rem_0.25rem_-0.25rem_#0004] dark:bg-zinc-700 dark:text-white">
          @{username}
        </div>
      </div>
      <div className="translate-x-1 text-xs">{prompt}</div>
      <div className="mt-4 h-56 flex-grow rounded-xl bg-zinc-300/70 p-4 duration-300 group-hover/card:-translate-x-1 group-hover/card:-translate-y-3 group-hover/card:shadow-[1rem_1rem_2.5rem_-1rem_#0008] dark:bg-zinc-800/70">
        <svg
          fill="none"
          height="193"
          viewBox="0 0 256 193"
          width="256"
          xmlns="http://www.w3.org/2000/svg"
        >
          <motion.rect
            {...codeLineProps}
            animate={{ width: getRandomWidth() }}
            className="fill-[#ABABB2] dark:fill-neutral-700"
            y="0"
          />
          <motion.rect
            {...codeLineProps}
            animate={{ width: getRandomWidth() }}
            className="fill-[#A48088] dark:fill-[#544048]"
            y="19"
          />
          <motion.rect
            {...codeLineProps}
            animate={{ width: getRandomWidth() }}
            className="fill-[#A48088] dark:fill-[#544048]"
            y="38"
          />
          <motion.rect
            {...codeLineProps}
            animate={{ width: getRandomWidth() }}
            className="fill-[#809F94] dark:fill-[#404F54]"
            y="57"
          />
          <motion.rect
            {...codeLineProps}
            animate={{ width: getRandomWidth() }}
            className="fill-[#ABABB2] dark:fill-neutral-700"
            y="90"
          />
          <motion.rect
            {...codeLineProps}
            animate={{ width: getRandomWidth() }}
            className="fill-[#ABABB2] dark:fill-neutral-700"
            y="109"
          />
          <motion.rect
            {...codeLineProps}
            animate={{ width: getRandomWidth() }}
            className="fill-[#A48088] dark:fill-[#544048]"
            transition={{ delay: 0.3, duration: 0.5 }}
            y="128"
          />
          <motion.rect
            {...codeLineProps}
            animate={{ width: getRandomWidth() }}
            className="fill-[#A48088] dark:fill-[#544048]"
            y="147"
          />
          <motion.rect
            {...codeLineProps}
            animate={{ width: getRandomWidth() }}
            className="fill-[#809F94] dark:fill-[#404F54]"
            y="166"
          />
          <motion.rect
            {...codeLineProps}
            animate={{ width: getRandomWidth() }}
            className="fill-[#809F94] dark:fill-[#404F54]"
            y="184"
          />
        </svg>
      </div>
    </div>
  );
}
