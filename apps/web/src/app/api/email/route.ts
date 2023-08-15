// TODO: fix the import paths
import { UserSignupEmail } from '@repo/emails/emails/index';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// TODO: this is awaiting trash to setup on vercel
const resend = new Resend(process.env.RESEND_API_KEY);

// TODO: THIS HAS TO BE REMOVED
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  // TODO: remove this default email
  const to = searchParams.get('to') ?? 'sean@boult.me';

  try {
    return NextResponse.json(sendUserSignupEmail(to));
  } catch (error) {
    return NextResponse.json({ error });
  }
}

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
