'use server';

import { RoleTypes } from '@prisma/client';
import { prisma } from '@repo/db';

export async function approveChallenge(
  challengeId: number,
  userId: string,
  isUserACreator: boolean,
) {
  return prisma.$transaction([
    prisma.challenge.update({
      where: {
        id: challengeId,
      },
      data: {
        status: 'ACTIVE',
      },
    }),
    ...(isUserACreator
      ? [
          prisma.role.create({
            data: {
              user: {
                connect: {
                  id: userId,
                },
              },
              role: RoleTypes.ADMIN,
            },
          }),
        ]
      : []),
  ]);
}

export async function denyChallenge(challengeId: number) {
  return prisma.challenge.update({
    where: {
      id: challengeId,
    },
    data: {
      status: 'DECLINED',
    },
  });
}
