import { Skeleton } from '@repo/ui/components/skeleton';
import { AllTracksCardSkeleton, EnrolledTrackCardSkeleton } from './enrolled-track-card-skeleton';

export function EnrolledTracksSkeleton() {
  return (
    <div className="sm:px-8 md:px-0">
      <div className="container p-4">
        {/* TITLE  */}
        <div className="mb-2 mt-8">
          <Skeleton className="h-8 w-20 rounded-lg bg-zinc-300 dark:bg-zinc-700" />
        </div>

        {/* CARDS */}
        <div className="flex flex-row gap-5 pb-8 md:gap-10 md:py-5">
          <EnrolledTrackCardSkeleton />
        </div>
      </div>

      {/* All Tracks List */}
      <div className="container p-4">
        {/* TITLE  */}
        <div className="mb-8 mt-8">
          <Skeleton className="h-8 w-20 rounded-lg bg-zinc-300 dark:bg-zinc-700" />
        </div>

        {/* Description */}
        <div className="mb-8 flex flex-col gap-6">
          <Skeleton className="h-3 w-3/6 rounded-lg bg-zinc-300 dark:bg-zinc-700" />
          <Skeleton className="h-3 w-4/6 rounded-lg bg-zinc-300 dark:bg-zinc-700" />
        </div>

        {/* CARDS */}
        <div className="container mb-6 grid grid-cols-1 gap-3 sm:px-8 md:-mx-16 md:grid-cols-2 md:px-0 lg:mx-0 lg:w-full xl:grid-cols-3 2xl:gap-8">
          {Array.from({ length: 3 }, (_, idx) => (
            <AllTracksCardSkeleton key={idx} />
          ))}
        </div>
      </div>
    </div>
  );
}
