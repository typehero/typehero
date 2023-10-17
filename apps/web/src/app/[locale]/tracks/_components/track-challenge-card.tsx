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
}

const BGS_BY_DIFFICULTY = {
  BEGINNER: 'to-difficulty-beginner/20 dark:to-difficulty-beginner-dark/20',
  EASY: 'to-difficulty-easy/20 dark:to-difficulty-easy-dark/20',
  MEDIUM: 'to-difficulty-medium/20 dark:to-difficulty-medium-dark/20',
  HARD: 'to-difficulty-hard/20 dark:to-difficulty-hard-dark/20',
  EXTREME: 'to-difficulty-extreme/20 dark:to-difficulty-extreme-dark/20',
} as const;

// million-ignore
export function TrackChallenge({
  challenge,
  isInProgress,
  isCompleted,
  isSelected = false,
  isCompact = false,
}: TrackChallengeProps) {
  const isMobile = useIsMobile();

  return (
    <label
      htmlFor={challenge.id.toString()}
      className="group/challenge flex cursor-pointer flex-col items-center pt-2"
    >
      <div
        className={cn(
          BGS_BY_DIFFICULTY[challenge.difficulty],
          'flex w-full items-center justify-between gap-3 rounded-lg',
          'bg-gradient-to-r from-neutral-500/10 from-70% to-100% dark:from-neutral-500/20',
          'p-4 py-2 text-black/90 duration-300 group-active/challenge:bg-neutral-500/40 group-active/challenge:duration-75 dark:text-white/90 sm:py-4',
          {
            'group-hover/challenge:scale-105 group-hover/challenge:rounded-xl group-hover/challenge:bg-neutral-500/20':
              !isMobile,
          },
        )}
      >
        <div className="w-full flex-col space-y-2">
          <div className="flex flex-row justify-between">
            <div className="flex flex-row gap-3">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="relative hidden items-center gap-3 md:flex md:flex-row ">
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
                        {
                          'peer-checked:bg-green-600/80 peer-checked:dark:bg-green-300/80':
                            isCompleted,
                          'peer-checked:bg-orange-600/80 peer-checked:dark:bg-orange-300/80':
                            isInProgress,
                        },
                      )}
                    />
                    {isCompleted ? (
                      <Check className="absolute left-1 my-auto h-3 w-3 scale-0 stroke-[4] text-white duration-300 peer-checked:scale-100 dark:text-black" />
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
              <div className="flex flex-col items-start gap-3 md:flex-row">
                <div className="flex flex-col gap-2">
                  <span className={cn({ 'text-primary': isSelected })}>{challenge.name}</span>
                  <div className="flex flex-row gap-3 md:hidden">
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
            <div className="hidden md:block">
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
    <label
      htmlFor={challenge.id.toString()}
      className="group/challenge flex cursor-pointer flex-col items-center pt-2"
    >
      <div
        className={cn(
          BGS_BY_DIFFICULTY[challenge.difficulty],
          'flex w-full items-center justify-between gap-3 overflow-hidden rounded-lg',
          'bg-gradient-to-r from-neutral-500/10 from-70% to-100% dark:from-neutral-500/20',
          'p-4 py-2 text-black/90 duration-300 group-active/challenge:bg-neutral-500/40 group-active/challenge:duration-75 dark:text-white/90 sm:py-4',
          {
            'group-hover/challenge:scale-105 group-hover/challenge:rounded-xl group-hover/challenge:bg-neutral-500/20':
              !isMobile,
          },
        )}
      >
        <div className="relative flex flex-row items-center gap-3">
          <input
            className="peer absolute appearance-none"
            type="checkbox"
            id={challenge.id.toString()}
          />
          <div className="h-5 w-5 rounded-full border border-black/70 bg-black/10 duration-75 peer-checked:border-transparent peer-checked:bg-green-600/80 dark:border-white/50 dark:bg-white/10 peer-checked:dark:bg-green-300/80" />
          <Check className="absolute left-1 my-auto h-3 w-3 scale-0 stroke-[4] text-white duration-300 peer-checked:scale-100 dark:text-black" />
          {challenge.name}
        </div>
        <div className="hidden md:block">
          <DifficultyBadge difficulty={challenge.difficulty} />
        </div>
      </div>
    </label>
  );
}
