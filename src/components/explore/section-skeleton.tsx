import { Skeleton } from '../ui/skeleton';
import { ExploreCardSkeleton } from './explore-card-skeleton';

export function ExploreSectionSkeleton() {
  return (
    <div className="container p-5  ">
      <div className="flex items-center justify-center">
        <Skeleton className="my-4 h-10 w-1/3 rounded-lg bg-zinc-300 dark:bg-zinc-700" />
      </div>
      <div className="grid w-full gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <ExploreCardSkeleton />
        <ExploreCardSkeleton />
        <ExploreCardSkeleton />
        <ExploreCardSkeleton />
        <ExploreCardSkeleton />
        <ExploreCardSkeleton />
      </div>
    </div>
  );
}
