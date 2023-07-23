import React from 'react';
import { prisma } from '~/server/db';
import { ReportType } from '@prisma/client';
import Text from '~/components/ui/typography/typography';
import { cva } from 'class-variance-authority';
import Reports2 from '~/components/admin/reports2';

export const dynamic = 'force-dynamic';

export type ReportsData = Awaited<ReturnType<typeof getReports>>;

export async function getReports(lastCursor?: number) {
  return prisma.report.findMany({
    include: {
      challenge: true,
      user: true,
      reporter: true,
      issues: true,
      comment: true,
      solution: true,
    },
    ...(lastCursor && {
      cursor: {
        id: lastCursor,
      },
      skip: 1,
    }),
    take: 25,
    orderBy: [
      {
        status: 'asc',
      },
      {
        type: 'desc',
      },
    ],
  });
}

// const f = cva('border p-4 rounded-xl', {
//   variants: {
//     type: {
//       [ReportType.CHALLENGE]: 'border-orange-400',
//       [ReportType.USER]: 'border-green-300',
//       [ReportType.COMMENT]: 'border-yellow-400',
//       [ReportType.SOLUTION]: 'border-pink-300',
//     },
//   },
//   defaultVariants: {
//     type: 'USER',
//   },
// });

export default async function ReportPage() {
  const reports = await getReports();

  return (
    <div className="container">
      <Text intent="h1">Reports</Text>
      <React.Suspense fallback={<>Loading...</>}>
        <Reports2 reports={reports} />
      </React.Suspense>
    </div>
  );
}
