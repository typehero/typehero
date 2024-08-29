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

  // TODO: is there a way to do this in a single update query?
  for (const contributor of contributors) {
    console.log(`Adding contributor: ${contributor.login} (${contributor.id})`);

    // NOTE: this is because you might only have yourself in the local db so you can't update others
    const hasUser = await prisma.user.findUnique({
      where: { id: `${contributor.id}` },
    });

    if (!hasUser) {
      console.log('user not in db skipping');
      continue;
    }

    // add CONTRIBUTORS role to the user
    await prisma.user.update({
      where: { id: `${contributor.id}` },
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

  return Response.json({ success: true });
}
