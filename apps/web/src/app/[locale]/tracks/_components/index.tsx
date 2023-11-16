import { auth } from '@repo/auth/server';
import { redirect } from 'next/navigation';
import { isBetaUser } from '~/utils/server/is-beta-user';
import { EnrolledTrackSection } from './track-enrolled-section';
import { TrackGrid } from './track-grid';
import { Footsies } from '~/components/footsies';
import { Suspense } from 'react';
import { AllTracksCardSkeleton } from './enrolled-track-card-skeleton';

export async function Tracks() {
  // early acces you must be authorized
  const session = await auth();
  const isBeta = await isBetaUser(session);

  if (!isBeta) {
    return redirect('/claim');
  }

  return (
    <>
      <div className="flex flex-col gap-5 pb-8 md:gap-10 md:py-5">
        <EnrolledTrackSection />

        <div className="container">
          <h1 className="mb-8 text-4xl font-bold tracking-tight text-neutral-900 dark:text-white sm:px-8 md:px-0">
            Tracks
          </h1>
          <p className="max-w-[69ch] text-lg leading-10 text-neutral-600 dark:text-white/50 sm:px-8 md:px-0">
            TypeHero provides a curated collection of diverse coding challenges grouped into
            different tracks, offering a dynamic learning path for developers to enhance their
            skills.
          </p>
        </div>
        <Suspense fallback={<AllTracksCardSkeleton />}>
          <TrackGrid />
        </Suspense>
      </div>
      <Footsies />
    </>
  );
}
