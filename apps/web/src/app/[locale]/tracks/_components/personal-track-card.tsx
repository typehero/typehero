import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/card';
import clsx from 'clsx';
import type { EnrolledTracks } from './track-enrolled-section';
import { TrackProgress } from './track-progress';
import { useMemo } from 'react';

interface PersonalTrackCardProps {
  track: EnrolledTracks[number];
}

export function PersonalTrackCard({ track }: PersonalTrackCardProps) {
  const completedChallenges = useMemo(
    () =>
      track?.trackChallenges.filter((trackChallenge) =>
        trackChallenge.challenge.submission.some((submission) => submission.isSuccessful),
      ).length ?? 0,
    [track],
  );

  return (
    <Card
      className={clsx(
        'group/card bg-background hover:bg-card-hovered relative overflow-hidden duration-300 sm:min-w-[300px] xl:min-w-[333px]',
        'dark:group-focus:blue-blue-300 hover:border-blue-500 group-focus:border-blue-500 dark:hover:border-blue-300',
        'hover:shadow-[0_0_1rem_-0.15rem_#a7d8f9] group-focus:shadow-[0_0_1rem_-0.15rem_#a7d8f9]',
      )}
    >
      <CardHeader className="relative flex flex-col items-start gap-1 pb-0">
        <CardTitle className="max-w-[90%] truncate text-xl duration-300">{track.name}</CardTitle>
      </CardHeader>
      <CardContent className="relative flex flex-col justify-between gap-2 rounded-xl p-6 pb-0 duration-300">
        <CardDescription className="relative h-20 overflow-hidden pb-4">
          <TrackProgress
            completedChallenges={completedChallenges}
            totalChallenges={track.trackChallenges.length}
          />
        </CardDescription>
      </CardContent>
    </Card>
  );
}
