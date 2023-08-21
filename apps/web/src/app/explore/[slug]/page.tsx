import { Suspense } from 'react';
import { ExploreSlugSkeleton } from '../_components/explore-slug-skeleton';
import { ExploreSlug } from '../_components/explore-slug';

export const dynamic = 'force-dynamic';

interface Props {
  params: {
    slug: string;
  };
}

// accepts both difficulty & tags as slug.
// ex: `/explore/easy`, `explore/popular`
export default function Page({ params }: Props) {
  return (
    <Suspense fallback={<ExploreSlugSkeleton />}>
      <ExploreSlug slug={params.slug} />
    </Suspense>
  );
}
