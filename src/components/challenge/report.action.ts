'use server';

import { prisma } from '~/server/db';
import type { FormValues } from './description-panel';

export async function doTheThing() {
  await Promise.resolve(0);
  return 'done';
}

export async function addReport(challengeId: number, userId: string, data: FormValues) {
  const something = await prisma.report.findMany({
    where: {
      challengeId,
      userId,
    }
  });
  if(something.length > 0) {
    return 'report_already_made';
  }
  
  await prisma.report.upsert({
    where: {
      id: 1
    },
    update:{},
    create: {
      challengeId,
      userId,
      // TODO(jim): Determine best way to update the db model. Quick and dirty for now
      text: JSON.stringify(data)
    }
  })

  return 'created';
}