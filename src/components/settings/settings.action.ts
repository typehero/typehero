'use server';

import { getServerSession } from 'next-auth';

import { prisma } from '~/server/db';
import { authOptions } from '~/server/auth';

import { UserLink } from '@prisma/client';
/**
 * This will only let you update your own profile
 * @param profileData
 */
export async function updateProfile(profileData: {
  bio: string;
  userLinks: { id: string | null; url: string }[];
}) {
  const session = await getServerSession(authOptions);

  // 1. Checks.
  if (!session?.user.id) return 'unauthorized';

  // 2. Update the users links
  await prisma.$transaction(
    profileData.userLinks.map((link) =>
      prisma.userLink.upsert({
        where: { id: link.id ?? '-1' },
        update: { url: link.url },
        create: {
          url: link.url,
          user: { connect: { id: session?.user.id } },
        },
      }),
    ),
  );

  // filter for all links that are empty string and dlete from db
  const emptyLinks = profileData.userLinks.filter((link) => link.url === '');
  await prisma.userLink.deleteMany({
    where: {
      id: {
        in: emptyLinks.map((link) => link.id ?? '-1'),
      },
    },
  });
}
