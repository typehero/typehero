import { buildMetaForDefault, buildMetaForUser } from '~/app/metadata';
import { notFound } from 'next/navigation';
import { getServerAuthSession } from '@repo/auth/server';
import { getPrivateProfile, getPublicProfile, type UserPrivateProfile } from './_components/profile.actions';
import { Dashboard } from './_components/dashboard';

interface Props {
  params: {
    username: string;
  };
}

export default async function Page({ params }: Props) {
  const username = decodeURIComponent(params.username).substring(1);
  const user = await getPublicProfile(username);
  if (!user) return notFound();

  let privateProfile: UserPrivateProfile = null;
  const auth = await getServerAuthSession();
  if(auth?.user.name === username) {
    privateProfile = await getPrivateProfile();
  }

  return <Dashboard publicUser={user} privateUser={privateProfile} />;
}

export async function generateMetadata({ params: { username } }: Props) {
  const name = decodeURIComponent(username).substring(1);
  if (name)
    return buildMetaForUser({
      username: name,
      title: `${name}'s profile | TypeHero`,
      description: `View the profile of ${name} on TypeHero.`,
    });
  return buildMetaForDefault({
    title: 'Profile | TypeHero',
    description: 'View the profile of a user on TypeHero.',
  });
}
