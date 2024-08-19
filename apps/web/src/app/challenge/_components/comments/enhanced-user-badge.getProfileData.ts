'use server';

import { prisma } from '@repo/db';
import { RoleTypes, type Role } from '@repo/db/types';
import { getBadges } from '~/app/(profile)/[username]/_components/dashboard/_actions';

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

export type TitleInfo = ReturnType<typeof getTitles>[number];
function getTitles(roles: Role[]) {
  const flairs: { type: 'admin' | 'contributor' | 'supporter'; label: string }[] = [];
  if (roles.find((r) => r.role === RoleTypes.ADMIN)) {
    flairs.push({ type: 'admin', label: 'Admin' });
  }
  if (roles.find((r) => r.role === RoleTypes.CONTRIBUTOR)) {
    flairs.push({ type: 'contributor', label: 'Contributor' });
  }
  if (roles.find((r) => r.role === RoleTypes.SUPPORTER)) {
    flairs.push({ type: 'supporter', label: 'Hero' });
  }
  return flairs;
}
