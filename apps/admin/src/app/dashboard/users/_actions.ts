'use server';

import { auth } from '@repo/auth/server';
import { prisma } from '@repo/db';
import { revalidatePath } from 'next/cache';

export type BannedUsers = NonNullable<Awaited<ReturnType<typeof getBannedUsers>>>;
export async function getBannedUsers() {
  return prisma.user.findMany({
    where: {
      status: 'BANNED',
    },
  });
}
/**
 * The function updates the user to indicate a status
 * of `BANNED`.
 * @param userId The id of the user.
 * @param reportId The id of the report.
 * @returns
 */
export async function banUser(userId: string, reportId: number, banReason?: string) {
  const session = await auth();

  await prisma.$transaction([
    prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        status: 'BANNED',
        banReason,
      },
    }),
    prisma.challenge.updateMany({
      where: {
        userId,
      },
      data: {
        status: 'BANNED',
      },
    }),
    prisma.session.deleteMany({
      where: {
        userId,
      },
    }),
    prisma.report.update({
      where: {
        id: reportId,
      },
      data: {
        status: 'CLEARED',
        moderatorId: session?.user.id,
        updatedAt: new Date(),
      },
    }),
    prisma.comment.updateMany({
      where: {
        userId,
      },
      data: {
        visible: false,
      },
    }),
  ]);
}
/**
 * The function lifts the ban off the user i.e. updates
 * the status to `ACTIVE`.
 * @param userId The id of the user.
 * @returns
 */
export async function unbanUser(userId: string) {
  revalidatePath('/');
  return prisma.$transaction([
    prisma.challenge.updateMany({
      where: {
        userId,
      },
      data: {
        status: 'ACTIVE',
      },
    }),
    prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        status: 'ACTIVE',
      },
    }),
  ]);
}
