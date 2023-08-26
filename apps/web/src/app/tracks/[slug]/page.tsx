import { TrackDetail } from '../_components/track-details';

export const dynamic = 'force-dynamic';

interface Props {
  params: {
    slug: string;
  };
}

export default function Page({ params }: Props) {
  return <TrackDetail slug={params.slug} />;
}
