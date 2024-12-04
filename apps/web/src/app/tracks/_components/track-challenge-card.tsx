'use client';

import { Check, PieChart } from '@repo/ui/icons';
import { useIsMobile } from '~/utils/useIsMobile';

import type { Challenge, Submission } from '@repo/db/types';
import { Badge } from '@repo/ui/components/badge';
import { DifficultyBadge } from '@repo/ui/components/difficulty-badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@repo/ui/components/tooltip';
import { cn } from '@repo/ui/cn';

interface TrackChallengeProps {
  challenge: Challenge & {
    submission: Submission[];
  };
  isInProgress: boolean;
  isCompleted: boolean;
  isSelected?: boolean;
  /* Hide short description in a compact view like the in-challenge track overview */
  isCompact?: boolean;
  /* Hide submission status */
  hideSubmissionStatus?: boolean;
  className?: string;
}

const BGS_BY_DIFFICULTY = {
  BEGINNER: 'to-difficulty-beginner/20 dark:to-difficulty-beginner-dark/20',
  EASY: 'to-difficulty-easy/20 dark:to-difficulty-easy-dark/20',
  MEDIUM: 'to-difficulty-medium/20 dark:to-difficulty-medium-dark/20',
  HARD: 'to-difficulty-hard/20 dark:to-difficulty-hard-dark/20',
  EXTREME: 'to-difficulty-extreme/20 dark:to-difficulty-extreme-dark/20',
  // this will never actually be used
  EVENT: 'to-difficulty-extreme/20 dark:to-difficulty-extreme-dark/20',
} as const;

// million-ignore
export function TrackChallenge({
  challenge,
  isInProgress,
  isCompleted,
  isSelected = false,
  isCompact = false,
  hideSubmissionStatus = false,
  className,
}: TrackChallengeProps) {
  const isMobile = useIsMobile();
  const backgroundColor = isCompleted
    ? 'peer-checked:bg-green-600/80 peer-checked:dark:bg-green-300/80'
    : isInProgress
      ? 'peer-checked:bg-orange-600/80 peer-checked:dark:bg-orange-300/80'
      : '';

  return (
    // TODO: Fix this accessibility issue!
    // eslint-disable-next-line jsx-a11y/label-has-associated-control
    <label
      htmlFor={challenge.id.toString()}
      className="group/challenge flex cursor-pointer flex-col items-center pt-2"
    >
      <div
        className={cn(
          BGS_BY_DIFFICULTY[challenge.difficulty],
          'flex w-full items-center justify-between gap-3 rounded-3xl lg:rounded-lg',
          'bg-gradient-to-r from-neutral-500/10 from-70% to-100% dark:from-neutral-900/70',
          'p-4 text-black/90 duration-300 group-active/challenge:bg-neutral-500/40 group-active/challenge:duration-75 dark:text-white/90',
          {
            'from-blue-600/30 from-10% dark:from-neutral-500/30': isSelected,
          },
          {
            'group-hover/challenge:scale-[1.025] group-hover/challenge:bg-neutral-500/20 lg:group-hover/challenge:rounded-xl':
              !isMobile,
          },
          className,
        )}
      >
        <div className="w-full space-y-2">
          <div className="flex w-full flex-row justify-between">
            <div className="flex w-full flex-row gap-3">
              {!hideSubmissionStatus && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="relative hidden gap-3 pr-1.5 pt-2 md:flex md:flex-row lg:items-center lg:pr-0 lg:pt-0">
                      <input
                        className="peer hidden appearance-none"
                        type="checkbox"
                        id={challenge.id.toString()}
                        checked={isCompleted || isInProgress}
                        readOnly
                      />
                      <div
                        className={cn(
                          'h-5 w-5 rounded-full border border-black/70 bg-black/10 duration-75 peer-checked:border-transparent dark:border-white/50 dark:bg-white/10',
                          backgroundColor,
                        )}
                      />
                      {isCompleted ? (
                        <Check className="absolute left-1 my-auto h-3.5 w-3.5 scale-0 stroke-[4] text-white duration-300 peer-checked:scale-100 dark:text-black" />
                      ) : null}
                      {isInProgress ? (
                        <PieChart className="absolute left-1 my-auto h-3 w-3 scale-0 stroke-[4] text-white duration-300 peer-checked:scale-100 dark:text-black" />
                      ) : null}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{isCompleted ? 'Completed' : isInProgress ? 'Attempted' : 'Todo'}</p>
                  </TooltipContent>
                </Tooltip>
              )}
              <div className="flex w-full flex-col items-start gap-3 lg:flex-row">
                <div className="flex w-full justify-between gap-2 text-lg font-bold lg:w-auto lg:text-base lg:font-normal">
                  <span className={cn({ 'font-bold': isSelected })}>{challenge.name}</span>
                  <div className="flex flex-row items-start gap-3 lg:hidden">
                    <DifficultyBadge difficulty={challenge.difficulty} />
                    {isCompleted && isMobile ? <Badge variant="outline">Completed</Badge> : null}
                  </div>
                </div>
                {Boolean(!isCompact) && (
                  <span className="text-muted-foreground">
                    {challenge.shortDescription.substring(0, 60).concat('...')}
                  </span>
                )}
              </div>
            </div>
            <div className="hidden items-center lg:flex">
              <DifficultyBadge difficulty={challenge.difficulty} />
            </div>
          </div>
        </div>
      </div>
    </label>
  );
}

// million-ignore
export function MockTrackChallenge({ challenge }: { challenge: Challenge }) {
  const isMobile = useIsMobile();
  return (
    // TODO: Fix this accessibility issue!
    // eslint-disable-next-line jsx-a11y/label-has-associated-control
    <label
      htmlFor={challenge.id.toString()}
      className="group/challenge flex cursor-pointer flex-col items-center pt-2"
    >
      <div
        className={cn(
          BGS_BY_DIFFICULTY[challenge.difficulty],
          'flex w-full items-center justify-between gap-3 overflow-hidden rounded-lg',
          'bg-gradient-to-r from-neutral-500/10 from-70% to-100% dark:from-neutral-500/20',
          'p-2 pl-3 text-black/90 duration-300 group-active/challenge:bg-neutral-500/40 group-active/challenge:duration-75 md:p-4 dark:text-white/90',
          {
            'group-hover/challenge:scale-105 group-hover/challenge:rounded-xl group-hover/challenge:bg-neutral-500/20':
              !isMobile,
          },
        )}
      >
        <div className="relative flex flex-row items-center gap-3 text-sm sm:text-base">
          <input
            className="peer absolute appearance-none"
            type="checkbox"
            id={challenge.id.toString()}
            tabIndex={-1}
          />
          <div className="h-4 w-4 rounded-full border border-black/70 bg-black/10 duration-75 peer-checked:border-transparent peer-checked:bg-green-600/80 sm:h-5 sm:w-5 dark:border-white/50 dark:bg-white/10 peer-checked:dark:bg-green-300/80" />
          <Check className="absolute left-1 my-auto h-2 w-2 scale-0 stroke-[4] text-white duration-300 peer-checked:scale-100 sm:h-3 sm:w-3 dark:text-black" />
          {challenge.name}
        </div>
        <div className="translate-x-1 scale-75 sm:translate-x-0 sm:scale-100">
          <DifficultyBadge difficulty={challenge.difficulty} />
        </div>
      </div>
    </label>
  );
}
