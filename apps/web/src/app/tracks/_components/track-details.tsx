import { getServerAuthSession } from '@repo/auth/server';
import { EnrollButton } from './enroll-button';
import { enrollUserInTrack, getTrackDetails, unenrollUserFromTrack } from './track.action';
import { TrackChallenge } from './track-challenge-card';

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
  const trackChallenge = await getTrackDetails(trackId);
  const challenges = trackChallenge?.trackChallenges.map(x => x.challenge) ?? []
  const isEnrolled = trackChallenge?.enrolledUsers.findIndex(
    (user) => user.id === session?.user.id,
  );

  return (
    <div className="container flex flex-col gap-8 py-5 md:gap-16 md:pb-20">
      <div className="container">
        <div className="flex flex-row justify-between w-full">
          <div className="container">
            <h3 className="mb-1 text-2xl font-bold tracking-wide text-neutral-900/40 dark:text-white/40">
              Track
            </h3>
            <h1 className="mb-8 text-4xl font-bold tracking-tight text-neutral-900 dark:text-white">
              {trackChallenge?.title}
            </h1>
            <p className=" max-w-[69ch] text-lg leading-10 text-neutral-600 dark:text-white/50">
              {trackChallenge?.description}
            </p>
          </div>
          <div className="flex flex-row items-center">
            {isEnrolled === -1 ? (
              <EnrollButton action={enrollUserInTrack} trackId={trackId} text="Enroll" />
            ) : (
              <EnrollButton action={unenrollUserFromTrack} trackId={trackId} text="Unenroll" />
            )}
          </div>
      </div>
        <div className="flex flex-col w-full">
        {challenges
            .sort((a, b) =>
              difficultyToNumber[a.difficulty] !== difficultyToNumber[b.difficulty]
                ? difficultyToNumber[a.difficulty] - difficultyToNumber[b.difficulty]
                : a.name.localeCompare(b.name),
            )
            .map((challenge) => (
                <TrackChallenge challenge={challenge} key={challenge.id} mock/>
            ))}
        </div>
      </div>

    </div>
  );
}
