'use server';

import { getServerSession } from 'next-auth';

import { prisma } from '~/server/db';
import { authOptions } from '~/server/auth';

/**
 * This will only let you update your own profile
 * @param profileData
 */
export async function updateProfile(socialUrls: string[]) {
  const session = await getServerSession(authOptions);

  // 1. Checks.
  if (!session?.user.id) return 'unauthorized';

  // update the profile
  await prisma.user.update({
    where: { id: session?.user.id },
    data: {
      socialUrls,
    },
  });
}
