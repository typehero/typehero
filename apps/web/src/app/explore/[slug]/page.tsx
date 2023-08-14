import { Suspense } from 'react';
import { ExploreSlug } from '~/components/explore/explore-slug';
import { ExploreSlugSkeleton } from '~/components/explore/explore-slug-skeleton';

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
