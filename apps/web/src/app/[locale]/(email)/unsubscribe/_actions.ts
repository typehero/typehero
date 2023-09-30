'use server';

import { prisma } from '@repo/db';

export async function removeFromWaitlist(email: string) {
  // lul we didnt put a unique constraint on the email column
  // we enforce it on the client at least and this table is being deleted anyways
  return prisma.waitlist.deleteMany({
    where: {
      email,
    },
  });
}
