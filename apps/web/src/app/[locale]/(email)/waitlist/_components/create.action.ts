'use server';

import { UserSignupEmail } from '@repo/emails/emails/index';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const baseUrl =
  process.env.NODE_ENV === 'production' ? `https://typehero.dev` : 'http://localhost:3000';

/**
 * send a signup email that will use resend to send an email
 * using the template from the app/email package
 */
export const sendUserSignupEmail = async (to: string) => {
  const data = await resend.emails.send({
    from: 'TypeHero <noreply@email.typehero.dev>',
    to: [to],
    subject: '🔥 Thanks for signing up to TypeHero!',
    react: UserSignupEmail({ to }),
    headers: {
      'List-Unsubscribe': `${baseUrl}/unsubscribe?email=${to}`,
    },
  });

  return {
    emailId: data.id,
    to,
  };
};
