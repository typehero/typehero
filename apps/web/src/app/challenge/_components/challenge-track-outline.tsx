'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { type ReactNode } from 'react';

import type { getTrackDetails } from '~/app/tracks/_components/track.action';
import { TrackChallenge } from '~/app/tracks/_components/track-challenge-card';
import { TrackProgress } from '~/app/tracks/_components/track-progress';

import { Button } from '@repo/ui/components/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@repo/ui/components/sheet';
import type { Challenge } from '@repo/db/types';
import { ChevronRight } from '@repo/ui/icons';

interface ChallengeTrackOutlineProps {
  children: ReactNode;
  challenge: Challenge;
  track: NonNullable<Awaited<ReturnType<typeof getTrackDetails>>>;
  asChild?: boolean;
}

export function ChallengeTrackOutline({
  children,
  challenge,
  track,
  asChild = false,
}: ChallengeTrackOutlineProps) {
  const router = useRouter();

  const trackChallenges = track?.trackChallenges ?? [];
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

  return (
    <Sheet>
      <SheetTrigger asChild={asChild}>{children}</SheetTrigger>
      <SheetContent
        className="flex w-full flex-col gap-8 overflow-y-scroll sm:max-w-[400px] md:max-w-[540px]"
        side="left"
      >
        <SheetHeader>
          <SheetTitle>
            <Button
              variant="ghost"
              className="text-foreground flex max-w-full justify-start gap-4 text-lg font-semibold"
              onClick={() => router.push(`/tracks/${track.slug}`)}
            >
              <span className="overflow-hidden text-ellipsis whitespace-nowrap">{track.name}</span>
              <ChevronRight className="h-4 w-4 shrink-0" />
            </Button>
          </SheetTitle>
        </SheetHeader>
        <TrackProgress
          completedChallenges={completedTrackChallenges.length}
          totalChallenges={trackChallenges.length}
        />
        <div className="flex flex-col">
          {track.trackChallenges.map((trackChallenge) => {
            return (
              <Link
                key={trackChallenge.challenge.id}
                href={`/challenge/${trackChallenge.challenge.slug}`}
              >
                <TrackChallenge
                  challenge={trackChallenge.challenge}
                  isCompleted={completedTrackChallenges.includes(trackChallenge.id)}
                  isInProgress={inProgressTrackChallenges.includes(trackChallenge.id)}
                  isSelected={trackChallenge.challengeId === challenge.id}
                  isCompact
                />
              </Link>
            );
          })}
        </div>
      </SheetContent>
    </Sheet>
  );
}
