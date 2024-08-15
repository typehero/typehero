'use server';

import { prisma } from '@repo/db';
import { RoleTypes, type Role } from '@repo/db/types';
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
      roles: true,
    },
  });
  if (user === null) {
    throw new Error('User not found');
  }
  const badges = await getBadges(user.id);
  const titles = getTitles({
    roles: user.roles,
    isSupporter: true,
    isContributor: true,
  });
  return {
    ...user,
    titles,
    badges: badges.slice(0, 3),
  };
}

export type TitleInfo = ReturnType<typeof getTitles>[number];
function getTitles(user: { roles: Role[]; isContributor: boolean; isSupporter: boolean }) {
  const flairs = [];
  if (user.roles.find((r) => r.role === RoleTypes.ADMIN)) {
    flairs.push({ type: 'admin', label: 'Admin' } as const);
  }
  if (user.isContributor) {
    flairs.push({ type: 'contributor', label: 'Wizard' } as const);
  }
  if (user.isSupporter) {
    flairs.push({ type: 'supporter', label: 'Hero' } as const);
  }
  return flairs;
}
