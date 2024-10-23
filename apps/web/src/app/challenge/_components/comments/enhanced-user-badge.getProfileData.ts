'use server';

import { prisma } from '@repo/db';
import { getTitles } from './enhanced-user-badge.getTitles';
import { getBadges } from '~/app/(profile)/[username]/user-info';

export async function getProfileData(username: string) {
  const user = await prisma.user.findFirstOrThrow({
    where: {
      name: username,
    },
    select: {
      image: true,
      bio: true,
      id: true,
      name: true,
      roles: true,
    },
  });

  const badges = await getBadges(user.id);
  const titles = getTitles(user.roles);
  return {
    ...user,
    titles,
    badges: badges.slice(0, 3),
  };
}
