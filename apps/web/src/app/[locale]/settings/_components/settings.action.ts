'use server';

import { getServerAuthSession } from '@repo/auth/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@repo/db';
import type { ProfileSchema } from './schema';
import { profileSchema } from './schema';

/**
 * This will only let you update your own profile
 * @param profileData
 */
export async function updateProfile(profileData: ProfileSchema) {
  const session = await getServerAuthSession();

  // 1. Checks that the user is logged in
  if (!session?.user.id) return { error: 'unauthorized' };

  // 2. test schema validation with zod
  profileSchema.parse(profileData);

  // 3. Update the user bio field in the db
  await prisma.user.update({
    where: { id: session.user.id },
    data: { bio: profileData.bio },
  });

  // 4. Update the users links in the db if the url is not empty
  await prisma.$transaction(
    profileData.userLinks.map((link) =>
      prisma.userLink.upsert({
        where: { id: link.id ?? '' },
        update: { url: link.url },
        create: {
          url: link.url,
          user: { connect: { id: session.user.id } },
        },
      }),
    ),
  );

  return { success: true };

  // do this after we do the shit
  revalidatePath('/settings');
}
