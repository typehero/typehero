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
  
  // This throws an error to reflect the behavior of findFirstOrThrow, ideally we will move this to notFound()
  if(username === undefined) throw new Error("[ERROR]: Username not found, accessed profile page without @");

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
