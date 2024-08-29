import { NextResponse, type NextRequest } from 'next/server';
import { prisma } from '@repo/db';

import { contributors } from '../../../../../public/contributors';
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

  const MAX_PARTITION_SIZE = 60;

  const contributorRole = await prisma.role.findFirst({
    where: {
      role: RoleTypes.CONTRIBUTOR,
    },
  });

  if (!contributorRole) {
    return new NextResponse('No contributor role 💀', {
      status: 500,
    });
  }

  const contributorIds = contributors.map((c) => c.id);

  let updateCount = 0;

  while (contributorIds.length) {
    const contributorsPartition = contributorIds.splice(0, MAX_PARTITION_SIZE);

    const values = contributorsPartition.map(
      (contributorId) => `('${contributorRole.id}', '${contributorId}')`,
    );
    updateCount +=
      await prisma.$executeRaw`insert ignore into "_RoleToUser" ("A", "B") values ${values.join(
        ',',
      )}`;
  }

  return Response.json({ success: true, updateCount });
}
