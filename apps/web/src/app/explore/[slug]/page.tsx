import { ExploreSlug } from '~/components/explore/explore-slug';

export const dynamic = 'force-dynamic';

interface Props {
  params: {
    slug: string;
  };
}

// accepts both difficulty & tags as slug.
// ex: `/explore/easy`, `explore/popular`
export default function Page({ params }: Props) {
  return <ExploreSlug slug={params.slug} />;
}
