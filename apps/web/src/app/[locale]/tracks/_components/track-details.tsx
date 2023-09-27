import { getServerAuthSession } from '@repo/auth/server';
import Link from 'next/link';

import { Swords } from '@repo/ui/icons';
import { clsx } from 'clsx';
import { ActionButton } from './enroll-button';
import { TrackChallenge } from './track-challenge-card';
import { TrackProgress } from './track-progress';
import { enrollUserInTrack, getTrackDetails, unenrollUserFromTrack } from './track.action';

interface TrackDetailProps {
  slug: string;
}

// The color for track.
export const BGS_BY_TRACK: Record<number, string> = {
  0: 'to-difficulty-beginner/30 dark:to-difficulty-beginner-dark/20',
  1: 'to-difficulty-easy/30 dark:to-difficulty-easy-dark/20',
  2: 'to-difficulty-medium/30 dark:to-difficulty-medium-dark/20',
  3: 'to-difficulty-hard/30 dark:to-difficulty-hard-dark/20',
  4: 'to-difficulty-extreme/30 dark:to-difficulty-extreme-dark/20',
} as const;
export const bgsArray = Object.values(BGS_BY_TRACK);

export async function TrackDetail({ slug }: TrackDetailProps) {
  const trackId = parseInt(slug);
  const track = await getTrackDetails(trackId);

  const trackChallenges = track?.trackChallenges ?? [];
  const isEnrolled = Boolean(track?.enrolledUsers?.length);

  const completedTrackChallenges = trackChallenges
    .filter((trackChallenge) => {
      return (
        trackChallenge.challenge.submission.length &&
        trackChallenge.challenge.submission.some((submission) => submission.isSuccessful)
      );
    })
    .map((trackChallenge) => trackChallenge.id);
  const inProgressTrackChallenges = trackChallenges
    .filter((trackChallenge) => {
      return (
        trackChallenge.challenge.submission.length &&
        trackChallenge.challenge.submission.every((submission) => !submission.isSuccessful)
      );
    })
    .map((trackChallenge) => trackChallenge.id);

  return (
    <div className="container flex min-h-screen flex-col items-center gap-4 py-5 md:gap-8 md:pb-20">
      <div className="flex flex-col items-center space-y-4">
        <div
          className={clsx(
            `bg-gradient-to-r from-neutral-500/10 from-10% ${
              BGS_BY_TRACK[trackId % bgsArray.length]
            } relative to-100% dark:from-neutral-500/20`,
            'flex h-24 w-24 flex-none items-center justify-center rounded-2xl',
          )}
        >
          <Swords
            size={50}
            className={clsx(
              'transition-opacity duration-300',
              !isEnrolled && 'opacity-50 group-hover:opacity-100 group-focus:opacity-100',
            )}
          />
        </div>
        <div className="flex flex-col items-center space-y-2">
          <h1 className="text-center text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
            {track?.title}
          </h1>
          <p className="text-md max-w-[69ch] text-center text-neutral-600 dark:text-white/50">
            {track?.description}
          </p>
        </div>
        {isEnrolled ? (
          <ActionButton action={unenrollUserFromTrack} trackId={trackId} text="Unenroll" />
        ) : (
          <ActionButton action={enrollUserInTrack} trackId={trackId} text="Enroll" />
        )}
      </div>
      {isEnrolled ? (
        <div className="w-full md:w-3/4 ">
          <TrackProgress
            completedChallenges={completedTrackChallenges.length}
            totalChallenges={trackChallenges.length}
          />
        </div>
      ) : null}
      <div className="flex w-full flex-row justify-around gap-8">
        <div className="flex flex-col space-y-2 md:w-3/4">
          <div className="grid-col grid grid-cols-1 gap-2 self-stretch">
            {trackChallenges.map((trackChallenge) => (
              <Link
                key={trackChallenge.challenge.id}
                href={`/challenge/${trackChallenge.challenge.id}`}
              >
                <TrackChallenge
                  challenge={trackChallenge.challenge}
                  isCompleted={completedTrackChallenges.includes(trackChallenge.id)}
                  isInProgress={inProgressTrackChallenges.includes(trackChallenge.id)}
                />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
