import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Dashboard from './dashboard';
import { prisma } from '~/server/db';

interface Props {
  username: string;
}

export const metadata: Metadata = {
  title: 'Profile',
  description: 'A users profile',
};

export async function Profile({ username: usernameFromQuery }: Props) {
  const [, username] = decodeURIComponent(usernameFromQuery).split('@');
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

  if (!user || !username) {
    notFound();
  }

  return <Dashboard user={user} />;
}
