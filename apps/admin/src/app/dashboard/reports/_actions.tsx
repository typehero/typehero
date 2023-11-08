'use server';

import { prisma } from '@repo/db';

export type AdminReport = NonNullable<Awaited<ReturnType<typeof getReports>>>[0];
export type Reports = Awaited<ReturnType<typeof getReports>>;
export async function getReports() {
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
