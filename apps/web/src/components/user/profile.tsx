import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { prisma } from '@repo/db';
import Dashboard from './dashboard';

interface Props {
  username: string;
}

export const metadata: Metadata = {
  title: 'Profile',
  description: 'A users profile',
};

export async function Profile({ username: usernameFromQuery }: Props) {
  const [, username] = decodeURIComponent(usernameFromQuery).split('@');

  if (!username) return notFound();

  const user = await prisma.user.findFirst({
    where: {
      name: {
        equals: username,
      },
    },
    include: {
      userLinks: true,
    },
  });

  if (!user) return notFound();
  return <Dashboard user={user} />;
}
