'use server';

import { getServerSession } from 'next-auth';

import { prisma } from '~/server/db';
import { authOptions } from '~/server/auth';
import type { UserLinkType } from '.';
import { revalidatePath } from 'next/cache';

/**
 * This will only let you update your own profile
 * @param profileData
 */
// TODO: add transactions to this update #GFI
export async function updateProfile(profileData: { bio: string; userLinks: UserLinkType[] }) {
  const session = await getServerSession(authOptions);

  // 1. Checks that the user is logged in
  if (!session?.user.id) return 'unauthorized';

  // 2. Update the user bio field in the db
  await prisma.user.update({
    where: { id: session?.user.id },
    data: { bio: profileData.bio },
  });

  // 3. Update the users links in the db if the url is not empty
  await prisma.$transaction(
    profileData.userLinks
      .map((link) =>
        prisma.userLink.upsert({
          where: { id: link.id ?? '' },
          update: { url: link.url },
          create: {
            url: link.url,
            user: { connect: { id: session?.user.id } },
          },
        }),
      ),
  );

  // // 4. Filter for all links that are empty string and delete from db
  // const emptyLinks = profileData.userLinks.filter((link) => link.url === '');
  // await prisma.userLink.deleteMany({
  //   where: {
  //     id: {
  //       in: emptyLinks.map((link) => link.id ?? '-1'),
  //     },
  //   },
  // });

  // do this after we do the shit
  revalidatePath('/settings');
}
