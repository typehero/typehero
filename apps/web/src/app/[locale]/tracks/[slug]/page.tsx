import { getServerAuthSession } from '@repo/auth/server';
import { TrackDetail } from '../_components/track-details';
import { getTrackDetails } from '../_components/track.action';
import { getAllFlags } from '~/utils/feature-flags';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

interface Props {
  params: {
    slug: string;
  };
}

// todo: write a suspense skeleton...
export default async function Page({ params }: Props) {
  const session = await getServerAuthSession();
  const flags = await getAllFlags();

  if (!session && flags.enableEarlyAccess) {
    return redirect('/waitlist');
  }
  return <TrackDetail slug={params.slug} />;
}

export async function generateMetadata({ params: { slug } }: Props) {
  const track = await getTrackDetails(parseInt(slug));

  if (!track) {
    return {
      title: 'Track | TypeHero',
      description: 'View the details of this track on TypeHero.',
    };
  }

  return {
    title: `${track.title} Track | TypeHero`,
    description: `View the details of the ${track.title} track on TypeHero. ${track.description}`,
  };
}
