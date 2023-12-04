'use server';
import { auth, type Session } from '@repo/auth/server';
import { prisma } from '@repo/db';
import { redirect } from 'next/navigation';
import { claimFormSchema } from './_schema';
import { type FormSchema } from './claim-form';

export async function validateToken(claimFormData: FormSchema) {
  claimFormSchema.parse(claimFormData);

  const session = await auth();

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
      user: { connect: { id: session?.user?.id } },
    },
  });

  redirect('/explore');
}

export async function isValidToken(session: Session, claimFormData: FormSchema) {
  try {
    claimFormSchema.parse(claimFormData);

    await prisma.betaTokens.update({
      where: {
        token: claimFormData.code,
        AND: {
          userId: null,
        },
      },
      data: {
        user: { connect: { id: session?.user?.id } },
      },
    });
    return true;
  } catch (e) {
    return false;
  }
}
