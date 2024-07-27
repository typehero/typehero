'use server';

import { auth } from '@repo/auth/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@repo/db';
import type { ProfileSchema } from './schema';
import { profileSchema } from './schema';

/**
 * This will only let you update your own profile
 * @param profileData
 */
export async function updateProfile(profileData: ProfileSchema) {
  const session = await auth();

  // 1. Checks that the user is logged in
  if (!session?.user?.id) return { error: 'unauthorized' };

  // 2. test schema validation with zod
  profileSchema.parse(profileData);

  // 3. Update the user bio field in the db
  await prisma.user.update({
    where: { id: session.user.id },
    data: { bio: profileData.bio },
  });

  // Create an array of user links to create
  const userLinksToCreate = profileData.userLinks.map((link) => ({
    url: link.url,
    user: {
      connect: { id: session.user?.id },
    },
  }));

  try {
    await prisma.$transaction([
      // 4. Delete all existing user links for the user
      prisma.userLink.deleteMany({
        where: {
          user: {
            some: {
              id: session.user.id,
            },
          },
        },
      }),

      // 5. Insert the new user links
      ...userLinksToCreate.map((userLink) =>
        prisma.userLink.create({
          data: userLink,
        }),
      ),
    ]);
  } catch (error) {
    // Handle the error, and possibly log it
    console.error('Transaction error:', error);
    throw error; // Re-throw the error if needed
  } finally {
    await prisma.$disconnect();
  }

  // do this after we do the shit
  revalidatePath('/settings');

  return { success: true };
}
