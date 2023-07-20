import React from 'react';
import { prisma } from '~/server/db';
import { ReportType } from '@prisma/client';
import Text from '~/components/ui/typography/typography';
import { cva } from 'class-variance-authority';

export const dynamic = 'force-dynamic';

async function getReports() {
  return prisma.report.findMany({
    include: {
      challenge: true,
      user: true,
      reporter: true,
      issues: true,
      comment: true,
      solution: true,
    },
    take: 25,
  });
}

const f = cva('border p-4 rounded-xl', {
  variants: {
    type: {
      [ReportType.CHALLENGE]: 'border-orange-400',
      [ReportType.USER]: 'border-green-300',
      [ReportType.COMMENT]: 'border-yellow-400',
      [ReportType.SOLUTION]: 'border-pink-300',
    },
  },
  defaultVariants: {
    type: 'USER',
  },
});

export default async function ReportPage() {
  const reports = await getReports();

  const bob = reports.reduce((all, cur) => {
    if (!all[cur.type]) all[cur.type] = [];
    all[cur.type].push(cur);
    return all;
  }, {} as Record<ReportType, (typeof reports)[0][]>);

  return (
    <div className="container">
      {Object.entries(bob).map(([key, reports]) => {
        return (
          <div key={`types-${key}`}>
            <header className="mb-4">
              <Text intent="h1">{key}</Text>
            </header>
            <section>
              {reports.map((report) => (
                <div className={f({ type: report.type })} key={`report-${report.id}`}>
                  Reported By:
                  {report.reporter.name} <br />
                  {report.type === 'CHALLENGE' && report.challenge && report.challenge.name}
                  <br />
                  User being reported:
                  {report.type === 'USER' && report.user && report.user.name}
                  <br />
                </div>
              ))}
            </section>
          </div>
        );
      })}
    </div>
  );
}
