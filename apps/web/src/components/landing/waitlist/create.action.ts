'use server';

import { prisma } from '@repo/db';
import { Resend } from 'resend';
import { UserSignupEmail } from '@repo/emails/emails/index';
import { type WaitlistFormSchema } from '~/components/landing/waitlist/waitlist-form';

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * send a signup email that will use resend to send an email
 * using the template from the app/email package
 */
export const sendUserSignupEmail = async (to: string) => {
  const data = await resend.emails.send({
    from: 'Typehero <noreply@email.typehero.dev>',
    to: [to],
    subject: '🔥 Thanks for signing up to Typehero!',
    react: UserSignupEmail(),
  });

  return {
    emailId: data.id,
    to,
  };
};

export async function uploadWaitlistEntry(data: WaitlistFormSchema) {
  const isUser = data.intention === 'user';
  const isBuilder = data.intention === 'builder';
  const ref = data.ref;

  const existingEntry = await prisma.waitlist.findFirst({
    where: {
      email: data.email,
    },
  });

  if (existingEntry) {
    throw new Error('You are already on the waitlist!');
  }

  await prisma.waitlist.create({
    data: {
      name: data.name,
      email: data.email,
      intention: isUser ? 'USER' : isBuilder ? 'BUILDER' : 'BOTH',
      referrer: ref,
    },
  });

  await sendUserSignupEmail(data.email);
}
