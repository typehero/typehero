import { getServerAuthSession } from '@repo/auth/server';
import Link from 'next/link';

import { EnrollButton } from './enroll-button';
import { TrackChallenge } from './track-challenge-card';
import { TrackProgress } from './track-progress';
import { enrollUserInTrack, getTrackDetails, unenrollUserFromTrack } from './track.action';

interface TrackDetailProps {
  // trackid
  slug: string;
}

export async function TrackDetail({ slug }: TrackDetailProps) {
  const session = await getServerAuthSession();
  const trackId = parseInt(slug);
  const track = await getTrackDetails(trackId);
  const trackChallenges = track?.trackChallenges ?? [];
  const isEnrolled = track?.enrolledUsers.findIndex((user) => user.id === session?.user.id);
  // Calculates the total number of successful challenges.
  function calulcateCompletedChallenges(): number {
    let completedChallenges = 0;
    for (const trackChallenge of trackChallenges) {
      for (const submission of trackChallenge.challenge.submission) {
        if (submission.isSuccessful) {
          completedChallenges++;
        }
      }
    }
    return completedChallenges;
  }

  return (
    <div className="container flex min-h-screen flex-col items-center gap-8 py-5 md:gap-16 md:pb-20">
      <div className="container">
        <h3 className="mb-1 text-2xl font-bold tracking-wide text-neutral-900/40 dark:text-white/40">
          Track
        </h3>
        <h1 className="mb-8 text-4xl font-bold tracking-tight text-neutral-900 dark:text-white">
          {track?.title}
        </h1>
        <p className=" max-w-[69ch] text-lg leading-10 text-neutral-600 dark:text-white/50">
          {track?.description}
        </p>
        {isEnrolled !== -1 && (
          <div className="my-3">
            <TrackProgress
              completedChallenges={calulcateCompletedChallenges()}
              totalChallenges={trackChallenges.length}
            />
          </div>
        )}
        {isEnrolled === -1 ? (
          <EnrollButton action={enrollUserInTrack} trackId={trackId} text="Enroll" />
        ) : (
          <EnrollButton action={unenrollUserFromTrack} trackId={trackId} text="Unenroll" />
        )}
      </div>
      <div className="grid-col grid grid-cols-1 gap-x-4 self-stretch md:grid-cols-2">
        {trackChallenges
          .sort((a, b) => a.orderId - b.orderId)
          .map((x) => x.challenge)
          .map((challenge) => (
            <Link key={challenge.id} href={`/challenge/${challenge.id}`}>
              <TrackChallenge
                className="max-w-lg"
                challenge={challenge}
                challengeCompleted={
                  challenge.submission.length > 0 &&
                  challenge.submission.some((submission) => submission.isSuccessful)
                }
                challengeInProgress={
                  challenge.submission.length > 0 &&
                  !challenge.submission.some((submission) => submission.isSuccessful)
                }
              />
            </Link>
          ))}
      </div>
    </div>
  );
}
