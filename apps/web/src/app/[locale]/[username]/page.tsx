import { buildMetaForDefault, buildMetaForUser } from '~/app/metadata';
import { Profile } from './_components/profile';
import { prisma } from '@repo/db';

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

  const user = await prisma.user.findFirst({
    where: {
      name: {
        equals: username,
      },
    },
    select: {
      id: true,
      createdAt: true,
      bio: true,
      image: true,
      name: true,
    },
  });

  const bio = user ? user.bio : '';
  const avatar = user && user.image ? user.image : '';

  if (username)
    return buildMetaForUser({
      username,
      title: `${username}'s profile | TypeHero`,
      description: `View the profile of ${username} on TypeHero.`,
      bio,
      avatar,
    });
  return buildMetaForDefault({
    title: 'Profile | TypeHero',
    description: 'View the profile of a user on TypeHero.',
  });
}
