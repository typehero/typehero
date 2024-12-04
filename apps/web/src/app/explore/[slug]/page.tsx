import { Suspense } from 'react';
import { ExploreSlugSkeleton } from '../_components/explore-slug-skeleton';
import { ExploreSlug } from '../_components/explore-slug';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: {
    slug: string;
  };
}

export const metadata: Metadata = {
  title: 'Explore Challenges | TypeHero',
};

// accepts both difficulty & tags as slug.
// ex: `/explore/easy`, `explore/popular`
export default function Page({ params }: PageProps) {
  return (
    <Suspense fallback={<ExploreSlugSkeleton />}>
      <ExploreSlug slug={params.slug} />
    </Suspense>
  );
}
