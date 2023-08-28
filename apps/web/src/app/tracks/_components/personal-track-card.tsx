import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/ui';
import { TrendingUpIcon } from '@repo/ui/icons';
import clsx from 'clsx';
import type { EnrolledTracks } from '.';
import { TrackProgress } from './track-progress';

interface PersonalTrackCardProps {
  track: EnrolledTracks[number];
}

export function PersonalTrackCard({ track }: PersonalTrackCardProps) {
  // Calculates the total number of successful challenges.
  function calulcateCompletedChallenges(): number {
    let completedChallenges = 0;
    for (const trackChallenge of track.trackChallenges) {
      for (const submission of trackChallenge.challenge.submission) {
        if (submission.isSuccessful) {
          completedChallenges++;
        }
      }
    }
    return completedChallenges;
  }

  return (
    <Card
      className={clsx(
        'group/card bg-background hover:bg-card-hovered relative overflow-hidden duration-300 sm:min-w-[300px] xl:min-w-[333px]',
        'dark:group-focus:blue-blue-300 hover:border-blue-500 group-focus:border-blue-500 dark:hover:border-blue-300',
        'hover:shadow-[0_0_1rem_-0.15rem_#a7d8f9] group-focus:shadow-[0_0_1rem_-0.15rem_#a7d8f9]',
      )}
    >
      <CardHeader className="relative flex flex-col items-start gap-1 pb-0">
        <CardTitle className="max-w-[75%] truncate text-2xl duration-300">{track.title}</CardTitle>
        <div className="flex items-center gap-6 text-center duration-300">
          <div className="flex items-center gap-2 text-sm">
            <TrendingUpIcon size={18} />
            {track._count.enrolledUsers}
          </div>
        </div>
        <TrackProgress
          completedChallenges={calulcateCompletedChallenges()}
          totalChallenges={track.trackChallenges.length}
        />
      </CardHeader>
      <CardContent className="relative flex flex-col justify-between gap-2 rounded-xl p-6 pb-0 duration-300">
        <CardDescription className="relative h-20 w-fit overflow-hidden pb-4">
          <div className="pointer-events-none absolute inset-0 h-full w-full shadow-[inset_0_-1.5rem_1rem_-0.5rem_hsl(var(--card))] duration-300 group-hover/card:shadow-[inset_0_-1.5rem_1rem_-0.5rem_hsl(var(--card-hovered))] group-focus:shadow-[inset_0_-1.5rem_1rem_-0.5rem_hsl(var(--card-hovered))]" />
          {track.description}
        </CardDescription>
      </CardContent>
    </Card>
  );
}
