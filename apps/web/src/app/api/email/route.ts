// TODO: fix the import paths
import { UserSignupEmail } from '@repo/emails/emails/index';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// TODO: this is awaiting trash to setup on vercel
const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const to = searchParams.get('to') ?? 'test@example.com';

  // TODO: this is not working yet but we can do this once resend supports CID
  // const imageData = await fetch('https://email.typehero.dev/signup.gif').then((res) => res.arrayBuffer());

  try {
    const data = await resend.emails.send({
      from: 'Typehero <noreply@email.typehero.dev>',
      to: [to],
      subject: '🔥 Thanks for signing up to Typehero!',
      // attachments: [
      //   {
      //     filename: 'signup.gif',
      //     content: Buffer.from(imageData),
      //   },
      // ],
      react: UserSignupEmail(),
    });

    return NextResponse.json({
      emailId: data.id,
      to,
    });
  } catch (error) {
    return NextResponse.json({ error });
  }
}
