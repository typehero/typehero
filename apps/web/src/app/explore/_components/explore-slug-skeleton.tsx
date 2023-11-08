import { Skeleton } from '@repo/ui/components/skeleton';
import { ExploreCardSkeleton } from './explore-card-skeleton';

export function ExploreSlugSkeleton() {
  return (
    <div className="container flex flex-col items-center gap-8 py-5 md:gap-16 md:pb-20">
      <div className="flex space-y-2">
        <Skeleton className="h-8 w-20 rounded-lg bg-zinc-300 dark:bg-zinc-700" />
      </div>
      <div className="flex w-full flex-wrap justify-center gap-6">
        <ExploreCardSkeleton />
        <ExploreCardSkeleton />
        <ExploreCardSkeleton />
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
