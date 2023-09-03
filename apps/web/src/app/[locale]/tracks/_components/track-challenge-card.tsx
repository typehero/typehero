'use client';

import { Check } from '@repo/ui/icons';
import clsx from 'clsx';
import { useIsMobile } from '~/utils/useIsMobile';
import type { Tracks } from './track-grid';

interface TrackChallengeProps {
  challenge: Tracks[number]['trackChallenges'][number]['challenge'];
  className?: string;
  mock?: boolean;
}

const COLORS_BY_DIFFICULTY = {
  BEGINNER: 'text-difficulty-beginner dark:text-difficulty-beginner-dark',
  EASY: 'text-difficulty-easy dark:text-difficulty-easy-dark',
  MEDIUM: 'text-difficulty-medium dark:text-difficulty-medium-dark',
  HARD: 'text-difficulty-hard dark:text-difficulty-hard-dark',
  EXTREME: 'text-difficulty-extreme dark:text-difficulty-extreme-dark',
} as const;

const BGS_BY_DIFFICULTY = {
  BEGINNER: 'to-difficulty-beginner/20 dark:to-difficulty-beginner-dark/20',
  EASY: 'to-difficulty-easy/20 dark:to-difficulty-easy-dark/20',
  MEDIUM: 'to-difficulty-medium/20 dark:to-difficulty-medium-dark/20',
  HARD: 'to-difficulty-hard/20 dark:to-difficulty-hard-dark/20',
  EXTREME: 'to-difficulty-extreme/20 dark:to-difficulty-extreme-dark/20',
} as const;

export function TrackChallenge({ challenge, className, mock }: TrackChallengeProps) {
  const isMobile = useIsMobile();
  return (
    <label
      htmlFor={challenge.id.toString()}
      className="group/challenge flex cursor-pointer flex-col items-center pt-2"
    >
      <div
        className={clsx(
          `flex w-full items-center justify-between gap-3 overflow-hidden rounded-lg`,
          `bg-gradient-to-r from-neutral-500/10 from-70% ${
            BGS_BY_DIFFICULTY[challenge.difficulty]
          } to-100% dark:from-neutral-500/20`,
          ` p-4 py-2 text-black/90 duration-300 group-active/challenge:bg-neutral-500/40 group-active/challenge:duration-75 dark:text-white/90 sm:py-4`,
          className,
          !isMobile &&
            'group-hover/challenge:scale-105 group-hover/challenge:rounded-xl group-hover/challenge:bg-neutral-500/20',
        )}
      >
        <div className="relative flex items-center gap-3 text-xs sm:text-base">
          {mock == true && (
            <>
              <input
                className="peer hidden appearance-none"
                type="checkbox"
                id={challenge.id.toString()}
              />
              <div className="h-5 w-5 rounded-full border border-black/70 bg-black/10 duration-75 peer-checked:border-transparent peer-checked:bg-green-600/80 dark:border-white/50 dark:bg-white/10 peer-checked:dark:bg-green-300/80" />
              <Check className="absolute left-1 my-auto h-3 w-3 scale-0 stroke-[4] text-white duration-300 peer-checked:scale-100 dark:text-black" />
            </>
          )}
          {challenge.name}
        </div>
        <div
          className={`relative text-xs font-medium tracking-wide ${
            COLORS_BY_DIFFICULTY[challenge.difficulty]
          } text-background`}
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
