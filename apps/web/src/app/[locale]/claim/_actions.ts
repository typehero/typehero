'use server';

import { getServerAuthSession } from '@repo/auth/server';
import { prisma } from '@repo/db';
import { redirect } from 'next/navigation';
import { claimFormSchema } from './_schema';
import { type FormSchema } from './claim-form';

export async function validateToken(claimFormData: FormSchema) {
  claimFormSchema.parse(claimFormData);

  const session = await getServerAuthSession();

  if (!session) {
    throw new Error('Not authenticated');
  }

  await prisma.betaTokens.update({
    where: {
      token: claimFormData.code,
      AND: {
        userId: null,
      },
    },
    data: {
      user: { connect: { id: session?.user.id } },
    },
  });

  redirect('/explore');
}
