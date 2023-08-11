'use server';

import { getServerAuthSession } from '@repo/auth/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@repo/db';
import type { FormSchema } from '.';

/**
 * This will only let you update your own profile
 * @param profileData
 */
// TODO: add transactions to this update #GFI
export async function updateProfile(profileData: FormSchema) {
  const session = await getServerAuthSession();

  // 1. Checks that the user is logged in
  if (!session?.user.id) return 'unauthorized';

  // 2. Update the user bio field in the db
  await prisma.user.update({
    where: { id: session.user.id },
    data: { bio: profileData.bio },
  });

  // 3. Update the users links in the db if the url is not empty
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

  // do this after we do the shit
  revalidatePath('/settings');
}
