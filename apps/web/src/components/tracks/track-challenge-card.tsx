'use client';

import { Check } from '@repo/ui/icons';
import clsx from 'clsx';
import type { Tracks } from '~/app/tracks/_components';
import { useIsMobile } from '~/utils/useIsMobile';

interface TrackChallengeProps {
  challenge: Tracks[number]['trackChallenges'][number]['challenge'];
  className?: string;
  mock?: boolean;
}

const COLORS_BY_DIFFICULTY = {
  BEGINNER: 'text-pink-600 dark:text-pink-300',
  EASY: 'text-emerald-600 dark:text-emerald-300',
  MEDIUM: 'text-yellow-600 dark:text-yellow-300',
  HARD: 'text-red-600 dark:text-red-300',
  EXTREME: 'text-orange-600 dark:text-orange-300',
};

const BGS_BY_DIFFICULTY = {
  BEGINNER: 'bg-pink-600 dark:bg-pink-300',
  EASY: 'bg-emerald-600 dark:bg-emerald-300',
  MEDIUM: 'bg-yellow-600 dark:bg-yellow-300',
  HARD: 'bg-red-600 dark:bg-red-300',
  EXTREME: 'bg-orange-600 dark:bg-orange-300',
};

export function TrackChallenge({ challenge, className }: TrackChallengeProps) {
  const isMobile = useIsMobile();
  return (
    <label
      htmlFor={challenge.id.toString()}
      className="group/challenge flex cursor-pointer flex-col items-center pt-2"
    >
      <div
        className={clsx(
          'flex w-full cursor-pointer items-center justify-between gap-3 overflow-hidden rounded-lg bg-neutral-500/10 p-4 py-2 text-black/90 duration-300 group-active/challenge:bg-neutral-500/40 group-active/challenge:duration-75 dark:text-white/90 sm:py-4',
          className,
          !isMobile &&
            'group-hover/challenge:scale-105 group-hover/challenge:rounded-xl group-hover/challenge:bg-neutral-500/20',
        )}
      >
        <div className="relative flex items-center gap-3 text-xs sm:text-base">
          <input
            className="peer hidden appearance-none"
            type="checkbox"
            id={challenge.id.toString()}
          />
          <div className="h-5 w-5 rounded-full border border-black/70 bg-black/10 duration-75 peer-checked:border-transparent peer-checked:bg-green-600/80 dark:border-white/50 dark:bg-white/10 peer-checked:dark:bg-green-300/80" />
          <Check className="absolute left-1 my-auto h-3 w-3 scale-0 stroke-[4] text-white duration-300 peer-checked:scale-100 dark:text-black" />
          {challenge.name}
        </div>
        <div
          className={`relative text-xs font-medium tracking-wide ${
            COLORS_BY_DIFFICULTY[challenge.difficulty]
          }`}
        >
          <div
            className={`absolute right-0 top-1/2 h-12 w-12 -translate-y-1/2 blur-3xl ${
              BGS_BY_DIFFICULTY[challenge.difficulty]
            }`}
          />
          {challenge.difficulty[0]}
          {challenge.difficulty.substring(1, challenge.difficulty.length).toLowerCase()}
        </div>
      </div>
    </label>
  );
}
