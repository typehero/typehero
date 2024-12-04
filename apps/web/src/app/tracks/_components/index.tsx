import { EnrolledTrackSection } from './track-enrolled-section';
import { TrackGrid } from './track-grid';
import { Footsies } from '~/components/footsies';

export function Tracks() {
  return (
    <>
      <div className="flex flex-col gap-5 pb-8 md:gap-10 md:py-5">
        <EnrolledTrackSection />
        <div className="container">
          <h1 className="mb-8 text-4xl font-bold tracking-tight text-neutral-900 sm:px-8 md:px-0 dark:text-white">
            Tracks
          </h1>
          <p className="max-w-[69ch] text-lg leading-10 text-neutral-600 sm:px-8 md:px-0 dark:text-white/50">
            TypeHero provides a curated collection of diverse coding challenges grouped into
            different tracks, offering a dynamic learning path for developers to enhance their
            skills.
          </p>
        </div>
        <TrackGrid />
      </div>
      <Footsies />
    </>
  );
}
