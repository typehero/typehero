import { prisma } from '@repo/db';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Dashboard } from './dashboard';
import { auth } from '@repo/auth/server';

interface Props {
  username: string;
  children: React.ReactNode;
}

export const metadata: Metadata = {
  title: 'Profile | TypeHero',
  description: 'View this profile on TypeHero.',
};

export async function Profile({ username: usernameFromQuery, children }: Props) {
  const [, username] = decodeURIComponent(usernameFromQuery).split('@');
  if (!username) return notFound();

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
      userLinks: true,
    },
  });

  if (!user) return notFound();

  const session = await auth();
  const isOwnProfile = session?.user.id === user.id;

  return (
    <Dashboard user={user} isOwnProfile={isOwnProfile}>
      {children}
    </Dashboard>
  );
}
