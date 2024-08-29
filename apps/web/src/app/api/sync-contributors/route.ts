import type { NextRequest } from 'next/server';
import { prisma } from '@repo/db';

import { contributors } from '../../../../public/contributors';
import { RoleTypes } from '@repo/db/types';

export const dynamic = 'force-dynamic';

// NOTE: this is called on cron job
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}` && process.env.NODE_ENV === 'production') {
    return new Response('Unauthorized', {
      status: 401,
    });
  }

  const allUsers = contributors.map((contributor) => ({ id: `${contributor.id}`, name: contributor.login }));

  const usersToUpdate = await prisma.user.findMany({
    where: {
      id : {
        in: allUsers.map((user) => user.id),
      },
      roles: {
        none: {
          role: RoleTypes.CONTRIBUTOR,
        },
      }
    },
  });

  for (const user of usersToUpdate) {
    console.log(`Adding contributor role to: ${user.name} (${user.id})`);

    await prisma.user.update({
      where: { id: `${user.id}` },
      data: {
        roles: {
          connectOrCreate: {
            create: {
              role: RoleTypes.CONTRIBUTOR,
            },
            where: { role: RoleTypes.CONTRIBUTOR },
          },
        },
      },
      include: {
        roles: true,
      },
    });
  }

  return Response.json({ success: true, updateCount: usersToUpdate.length });
}
