import { Skeleton } from '@repo/ui/components/skeleton';
import { ExploreCardSkeleton } from './explore-card-skeleton';

export function ExploreSectionSkeleton() {
  return (
    <div className="w-full py-5">
      <div className="container flex items-center justify-between">
        <Skeleton className="my-4 h-10 w-1/3 rounded-lg bg-zinc-300 dark:bg-zinc-700" />
        <Skeleton className="my-4 mr-4 h-4 w-16 rounded-lg bg-zinc-300 dark:bg-zinc-700" />
      </div>
      <div className="flex w-full flex-nowrap gap-4 overflow-x-hidden px-4 md:px-20">
        <ExploreCardSkeleton />
        <ExploreCardSkeleton />
        <ExploreCardSkeleton />
        <ExploreCardSkeleton />
        <ExploreCardSkeleton />
      </div>
    </div>
  );
}
