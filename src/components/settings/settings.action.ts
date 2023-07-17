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
  userLinks: { id: string; url: string };
}) {
  console.log(profileData);
  const session = await getServerSession(authOptions);

  // 1. Checks.
  if (!session?.user.id) return 'unauthorized';

  // 2. if the link they have is not in the database, create it.
  const userLink = await prisma.userLink.findUniqueOrThrow({
    where: {
      id: profileData.userLinks.id,
    },
  });

  console.log(userLink);

  // if (!userLink) {
  //   await prisma.userLink.create({
  //     data: {
  //       url: profileData.userLinks.url,
  //       user: {
  //         connect: {
  //           id: session?.user.id,
  //         },
  //       },
  //     },
  //   });
  // }
  //
  // // 3. Update the users link
  // await prisma.userLink.update({
  //   where: {
  //     id: profileData.userLinks.id,
  //   },
  //   data: {
  //     url: profileData.userLinks.url,
  //   },
  // });
}
