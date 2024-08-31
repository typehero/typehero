import { prisma } from '@repo/db';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}` && process.env.NODE_ENV === 'production') {
    return new Response('Unauthorized', {
      status: 401,
    });
  }

  try {
    await prisma.shortURL.deleteMany({
      where: {
        expiresAt: {
          lte: new Date(),
        },
      },
    });
  } catch (error) {
    console.log(error);
    return new Response('Internal Server Error', {
      status: 500,
    });
  }

  return Response.json({ success: true });
}
