import { ExploreCardSkeleton } from './explore-card-skeleton';

export function ExploreSectionSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
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
