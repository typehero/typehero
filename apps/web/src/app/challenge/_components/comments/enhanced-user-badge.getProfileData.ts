'use server';

import { prisma } from '@repo/db';
import { getBadges } from '~/app/(profile)/[username]/_components/dashboard/_actions';

export async function getProfileData(username: string) {
  const user = await prisma.user.findFirst({
    where: {
      name: username,
    },
    select: {
      image: true,
      bio: true,
      id: true,
      name: true,
    },
  });
  if (user === null) {
    throw new Error('User not found');
  }
  const badges = await getBadges(user.id);
  return {
    ...user,
    badges: badges.slice(0, 3),
  };
}
