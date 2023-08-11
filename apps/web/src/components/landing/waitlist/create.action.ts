'use server';

import { prisma } from '@repo/db';
import { type WaitlistFormSchema } from '~/components/landing/waitlist/waitlist-form';

export async function uploadWaitlistEntry(data: WaitlistFormSchema) {
  const isUser = data.intention === 'user';
  const isBuilder = data.intention === 'builder';

  const existingEntry = await prisma.waitlist.findFirst({
    where: {
      email: data.email,
    },
  });

  if (existingEntry) {
    throw new Error('You are already on the waitlist!');
  }

  return await prisma.waitlist.create({
    data: {
      name: data.name,
      email: data.email,
      intention: isUser ? 'USER' : isBuilder ? 'BUILDER' : 'BOTH',
    },
  });
}
