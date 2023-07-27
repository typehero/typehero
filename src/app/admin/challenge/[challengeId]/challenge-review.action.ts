'use server';

import { RoleTypes } from '@prisma/client';

import { prisma } from '~/server/db';

export async function approveChallenge(challengeId: number, userId: string) {
  return prisma.$transaction([
    prisma.challenge.update({
      where: {
        id: challengeId,
      },
      data: {
        status: 'ACTIVE',
      },
    }),
    prisma.user.update({
      where: { id: userId },
      data: {
        roles: {
          connectOrCreate: {
            create: {
              id: userId,
              role: RoleTypes.CREATOR,
            },
            where: {
              // user: how do i fix this?!
              role: RoleTypes.CREATOR,
            },
          },
        },
      },
    }),
    // this will fail on subsequent approvals since CREATOR was added for the given user
    // how can i just create when it doesnt exist
    // looking at connectOrCreate and upsert but cant figure it out
    // prisma.role.create({
    //   data: {
    //     user: {
    //       connect: {
    //         id: userId,
    //       },
    //     },
    //     role: RoleTypes.CREATOR,
    //   },
    // }),
    // prisma.role.upsert({
    //   where: {},
    //   update: {},
    //   create: {
    //     role: RoleTypes.CREATOR,
    //     user: {
    //       connect: {
    //         id: userId,
    //       },
    //     },
    //   },
    // }),
    // prisma.role.create({
    //   data: {
    //     user: {
    //       connectOrCreate: {
    //         create: {
    //           id: userId,
    //           name
    //         },
    //         where: {
    //           user: <----- huh?
    //         },
    //       },
    //     },
    //     role: RoleTypes.CREATOR,
    //   },
    // }),
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
