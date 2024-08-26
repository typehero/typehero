'use server';

import { prisma } from '@repo/db';
import { getBadges } from '~/app/(profile)/[username]/_components/dashboard/_actions';
import { getTitles } from './enhanced-user-badge.getTitles';

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
    // badges: [...badges, ...badges],
    badges: badges.slice(0, 3),
  };
}
