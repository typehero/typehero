import { Footsies } from '~/components/footsies';
import { EnrolledTrackSection } from './track-enrolled-section';
import { TrackGrid } from './track-grid';

export async function Tracks() {
  return (
    <>
      <div className="flex flex-col gap-5 pb-8 md:gap-10 md:py-5">
        <EnrolledTrackSection />
        <div className="container">
          <h1 className="mb-8 font-bold text-4xl text-neutral-900 tracking-tight sm:px-8 md:px-0 dark:text-white">
            Tracks
          </h1>
          <p className="max-w-[69ch] text-lg text-neutral-600 leading-10 sm:px-8 md:px-0 dark:text-white/50">
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
