import { Skeleton } from '../ui/skeleton';
import { ExploreCardSkeleton } from './explore-card-skeleton';

export function ExploreSectionSkeleton() {
  return (
    <div className="w-full py-5">
      <div className="flex items-center justify-between">
        <div className="ml-4 w-16"></div>
        <Skeleton className="my-4 h-10 w-1/3 rounded-lg bg-zinc-300 dark:bg-zinc-700" />
        <Skeleton className="my-4 mr-4 h-4 w-16 rounded-lg bg-zinc-300 dark:bg-zinc-700" />
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
