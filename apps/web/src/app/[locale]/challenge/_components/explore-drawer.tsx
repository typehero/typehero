'use client';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@repo/ui/components/sheet';
import { ChevronRight } from '@repo/ui/icons';
import type { ReactNode } from 'react';
import { TrackProgress } from '../../tracks/_components/track-progress';
import Link from 'next/link';
import { TrackChallenge } from '../../tracks/_components/track-challenge-card';
import { type getChallengesByTagOrDifficultyType } from '../../explore/_components/explore.action';
import { Checkbox } from '@repo/ui/components/checkbox';

interface Props {
  children: ReactNode;
  asChild?: boolean;
  tagOrDifficulty: string;
  popularChallenges: getChallengesByTagOrDifficultyType;
}

export function ExploreDrawer({ children, asChild = false, popularChallenges }: Props) {
  const challenges = popularChallenges;
  const completedChallenges = challenges
    .filter((challenge) => {
      return (
        challenge.submission.length &&
        challenge.submission.some((submission) => submission.isSuccessful)
      );
    })
    .map((challenge) => challenge.id);

  const inProgressChallenges = challenges
    .filter((challenge) => {
      return (
        challenge.submission.length &&
        challenge.submission.every((submission) => !submission.isSuccessful)
      );
    })
    .map((challenge) => challenge.id);

  return (
    <Sheet>
      <SheetTrigger asChild={asChild}>{children}</SheetTrigger>
      <SheetContent
        className="flex w-full flex-col gap-8 overflow-y-scroll sm:max-w-[400px] md:max-w-[540px]"
        side="left"
      >
        <SheetHeader>
          <SheetTitle>
            <Link
              href="/explore"
              className="text-foreground flex max-w-full items-center justify-start gap-4 text-lg font-semibold"
            >
              <span className="overflow-hidden text-ellipsis whitespace-nowrap">
                Explore all challenges
              </span>
              <ChevronRight className="h-4 w-4 shrink-0" />
            </Link>
            <div className="mt-8 flex flex-col gap-4 text-base">
              <div>Recommended</div>
              <div className="flex justify-between text-xs">
                <div className="text-muted-foreground ">
                  Recent hot questions we've picked for you.
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox /> <span>Show Engagements</span>
                </div>
              </div>
            </div>
          </SheetTitle>
        </SheetHeader>
        <TrackProgress
          completedChallenges={completedChallenges.length}
          totalChallenges={challenges.length}
        />
        <div className="flex flex-col">
          {challenges.map((challenge) => {
            return (
              <Link key={challenge.id} href={`/challenge/${challenge.slug}`}>
                <TrackChallenge
                  challenge={challenge}
                  isCompleted={completedChallenges.includes(challenge.id)}
                  isInProgress={inProgressChallenges.includes(challenge.id)}
                  // isSelected={challenge.id === challengeId}
                  isCompact
                />
              </Link>
            );
          })}
        </div>
        <SheetHeader>
          <SheetTitle>
            <Link
              href="/explore/easy"
              className="text-foreground flex max-w-full items-center justify-start gap-4 text-lg font-semibold"
            >
              <span className="overflow-hidden text-ellipsis whitespace-nowrap">
                Explore easy challenges
              </span>
              <ChevronRight className="h-4 w-4 shrink-0" />
            </Link>
          </SheetTitle>
        </SheetHeader>
        <SheetHeader>
          <SheetTitle>
            <Link
              href="/explore/medium"
              className="text-foreground flex max-w-full items-center justify-start gap-4 text-lg font-semibold"
            >
              <span className="overflow-hidden text-ellipsis whitespace-nowrap">
                Explore medium challenges
              </span>
              <ChevronRight className="h-4 w-4 shrink-0" />
            </Link>
          </SheetTitle>
        </SheetHeader>
        <SheetHeader>
          <SheetTitle>
            <Link
              href="/explore/hard"
              className="text-foreground flex max-w-full items-center justify-start gap-4 text-lg font-semibold"
            >
              <span className="overflow-hidden text-ellipsis whitespace-nowrap">
                Explore hard challenges
              </span>
              <ChevronRight className="h-4 w-4 shrink-0" />
            </Link>
          </SheetTitle>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}
