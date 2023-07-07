'use server';

import { prisma } from '~/server/db';
import type { FormValues } from './left-panel';

export async function doTheThing() {
  await Promise.resolve(0);
  return 'done';
}

export async function addReport(challengeId: number, userId: string, data: FormValues) {
  if (userId === undefined) return 'not_logged_in';

  const report = await prisma.report.findMany({
    where: {
      challengeId,
      userId,
    },
  });
  if (report.length > 0) {
    console.info(report);
    return 'report_already_made';
  }

  await prisma.report.create({
    data: {
      challengeId,
      userId,
      text: data.comments,
      unclear: data.examples,
      derogatory: data.derogatory,
    },
  });

  return 'created';
}
