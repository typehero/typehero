'use client';

import type { Challenge } from '@repo/db/types';

import { Progress } from '@repo/ui/components/progress';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@repo/ui/components/sheet';

import { TrackChallenge } from '~/app/[locale]/tracks/_components/track-challenge-card';

import type { getTrackDetails } from '../../tracks/_components/track.action';

interface Props {
  children: React.ReactNode;
  challenge: Challenge;
  track: NonNullable<Awaited<ReturnType<typeof getTrackDetails>>>; // TODO: cleanup maybe?
  asChild?: boolean;
}

export function ChallengeTrackOutline({ children, challenge, track, asChild = false }: Props) {
  const completedTrackChallenges = track.trackChallenges
    .filter((trackChallenge) => {
      return (
        trackChallenge.challenge.submission.length &&
        trackChallenge.challenge.submission.some((submission) => submission.isSuccessful)
      );
    })
    .map((trackChallenge) => trackChallenge.id);
  const inProgressTrackChallenges = track.trackChallenges
    .filter((trackChallenge) => {
      return (
        trackChallenge.challenge.submission.length &&
        trackChallenge.challenge.submission.every((submission) => !submission.isSuccessful)
      );
    })
    .map((trackChallenge) => trackChallenge.id);

  const numberCompleted = completedTrackChallenges.length;
  const totalChallenges = track.trackChallenges.length;

  const progress = (numberCompleted / totalChallenges) * 100;

  return (
    <Sheet>
      <SheetTrigger asChild={asChild}>{children}</SheetTrigger>
      <SheetContent
        className="flex w-full flex-col gap-8 sm:max-w-[400px] md:max-w-[540px]"
        side="left"
      >
        <SheetHeader>
          <SheetTitle>
            <span>{track.title}</span>
          </SheetTitle>
        </SheetHeader>
        <div className="flex flex-col">
          <span className="font-medium">Progress</span>
          <div className="flex items-center gap-4">
            <Progress value={progress} className="w-1/2" />
            <span>
              {numberCompleted} <span className="text-muted-foreground">/ {totalChallenges}</span>
            </span>
          </div>
        </div>
        <div className="flex flex-col overflow-y-scroll">
          {track.trackChallenges.map((trackChallenge) => {
            /* TODO: challenges in the track should probably be links to those challenges */
            return (
              <TrackChallenge
                key={trackChallenge.id}
                challenge={trackChallenge.challenge}
                isCompleted={completedTrackChallenges.includes(trackChallenge.id)}
                isInProgress={inProgressTrackChallenges.includes(trackChallenge.id)}
                isCompact
              />
            );
          })}
        </div>
      </SheetContent>
    </Sheet>
  );
}
