import { notFound } from 'next/navigation';
import { prisma } from '~/server/db';
import Dashboard from './dashboard';
import { Metadata } from 'next';

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
  });

  if (!user || !username) {
    notFound();
  }

  return <Dashboard user={user} />;
}
