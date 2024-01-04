'use server';

import { auth } from '@repo/auth/server';
import { prisma } from '@repo/db';
import { assertAdmin } from '~/utils/auth-guards';

export type AdminReport = NonNullable<Awaited<ReturnType<typeof getReports>>>[0];
export type Reports = Awaited<ReturnType<typeof getReports>>;
export async function getReports() {
  const session = await auth();
  assertAdmin(session);

  const reports = await prisma.report.findMany({
    select: {
      id: true,
      type: true,
      reporter: {
        select: {
          name: true,
        },
      },
      status: true,
      text: true,
      issues: true,
      createdAt: true,
    },
    orderBy: [
      {
        status: 'asc',
      },
    ],
  });

  return reports;
}
