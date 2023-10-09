import { buildMetaForDefault, buildMetaForUser } from '~/app/metadata';
import { Profile } from './_components/profile';

interface Props {
  params: {
    username: string;
  };
}

export default function Page({ params }: Props) {
  return <Profile username={params.username} />;
}

export async function generateMetadata({ params: { username: usernameFromQuery } }: Props) {
  const [, username] = decodeURIComponent(usernameFromQuery).split('@');

  if (!username) return {};

  if (username)
    return buildMetaForUser({
      username,
      title: `${username}'s profile | TypeHero`,
      description: `View the profile of ${username} on TypeHero.`,
    });
  return buildMetaForDefault({
    title: 'Profile | TypeHero',
    description: 'View the profile of a user on TypeHero.',
  });
}
