import { getServerAuthSession } from '@repo/auth/server';
import { EnrolledTrackSection } from './track-enrolled-section';
import { TrackGrid } from './track-grid';
import { getAllFlags } from '~/utils/feature-flags';
import { redirect } from 'next/navigation';

export async function Tracks() {
  // early acces you must be authorized
  const session = await getServerAuthSession();
  const flags = await getAllFlags();

  if (!session && flags.enableEarlyAccess) {
    return redirect('/waitlist');
  }

  return (
    <div className="flex flex-col gap-5 py-8 md:gap-10 md:py-10">
      <div className="container">
        <h1 className="mb-8 text-4xl font-bold tracking-tight text-neutral-900 dark:text-white">
          Tracks
        </h1>
        <p className=" max-w-[69ch] text-lg leading-10 text-neutral-600 dark:text-white/50">
          TypeHero provides a curated collection of diverse coding challenges grouped into different
          tracks, offering a dynamic learning path for developers to enhance their skills.
        </p>
      </div>
      {session ? <EnrolledTrackSection /> : null}
      <TrackGrid />
    </div>
  );
}
