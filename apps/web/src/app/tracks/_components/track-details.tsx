import { getServerAuthSession } from '@repo/auth/server';
import Link from 'next/link';

import { EnrollButton } from './enroll-button';
import { TrackChallenge } from './track-challenge-card';
import { TrackProgress } from './track-progress';
import {
  enrollUserInTrack,
  getTrackDetails,
  unenrollUserFromTrack,
} from './track.action';

interface TrackDetailProps {
  // trackid
  slug: string;
}

const difficultyToNumber = {
  BEGINNER: 0,
  EASY: 1,
  MEDIUM: 2,
  HARD: 3,
  EXTREME: 4,
} as const;

export async function TrackDetail({ slug }: TrackDetailProps) {
  const session = await getServerAuthSession();
  const trackId = parseInt(slug);
  const track = await getTrackDetails(trackId);
  const challenges = track?.trackChallenges.map(x => x.challenge) ?? []
  const isEnrolled = track?.enrolledUsers.findIndex(
    (user) => user.id === session?.user.id,
  );
  // Calculates the total number of successful challenges.
  function calulcateCompletedChallenges(): number {
    let completedChallenges = 0;
    for (const trackChallenge of track!.trackChallenges) {
      for (const submission of trackChallenge.challenge.submission) {
        if (submission.isSuccessful) {
          completedChallenges++;
        }
      }
    }
    return completedChallenges;
  }

  return (
    <div className="container flex flex-col items-center gap-8 py-5 md:gap-16 md:pb-20">
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
        {isEnrolled !== -1 && <div className="my-3">
          <TrackProgress
            completedChallenges={calulcateCompletedChallenges()}
            totalChallenges={challenges.length}
          />
        </div>}
        {isEnrolled === -1 ? (
          <EnrollButton action={enrollUserInTrack} trackId={trackId} text="Enroll" />
        ) : (
          <EnrollButton action={unenrollUserFromTrack} trackId={trackId} text="Unenroll" />
        )}
      </div>
      <div className="flex flex-col min-w-[50%] max-w-xl">
        {challenges
            .sort((a, b) =>
              difficultyToNumber[a.difficulty] !== difficultyToNumber[b.difficulty]
                ? difficultyToNumber[a.difficulty] - difficultyToNumber[b.difficulty]
                : a.name.localeCompare(b.name),
            )
            .map((challenge) => (
              <Link  key={challenge.id} href={`/challenge/${challenge.id}`}>
                <TrackChallenge challenge={challenge} challengeInProgress={challenge.submission.length > 0 && !challenge.submission.some(submission => submission.isSuccessful)} mock showDescriptionOnHover/></Link>
            ))}
      </div>
    </div>
  );
}
