import { getServerAuthSession } from '@repo/auth/server';
import { redirect } from 'next/navigation';
import { isBetaUser } from '~/utils/server/is-beta-user';
import { withUnstableCache } from '~/utils/withUnstableCache';
import { TrackDetail } from '../_components/track-details';
import { getTrackDetails } from '../_components/track.action';

export const dynamic = 'force-dynamic';

interface Props {
  params: {
    slug: string;
  };
}

// todo: write a suspense skeleton...
export default async function Page({ params }: Props) {
  const session = await getServerAuthSession();
  const isBeta = await isBetaUser(session);

  if (!isBeta) {
    return redirect('/claim');
  }

  return <TrackDetail slug={params.slug} />;
}

export async function generateMetadata({ params: { slug } }: Props) {
  const track = await withUnstableCache({
    fn: getTrackDetails,
    args: [slug],
    keys: [`track-${slug}-detail`],
    tags: [`track-${slug}-detail`],
  });

  if (!track) {
    return {
      title: 'Track | TypeHero',
      description: 'View the details of this track on TypeHero.',
    };
  }

  return {
    title: `${track.name} Track | TypeHero`,
    description: `View the details of the ${track.name} track on TypeHero. ${track.description}`,
  };
}
