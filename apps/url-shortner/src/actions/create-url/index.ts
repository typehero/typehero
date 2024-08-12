'use server';
import { auth } from '~/server/auth';
import { newSlug } from '~/utils/slug';
import { prisma } from '@repo/db';

export async function createShortURL(url: string): Promise<string | null> {
  const session = await auth();
  if (!session) {
    return null;
  }
  const slug = newSlug();

  await prisma.shortURL.create({
    data: {
      shortUrlSlug: slug,
      originalUrl: url,
      user: {
        connect: {
          id: session.user.id,
        },
      },
    },
  });

  const newURL = `${process.env.NEXT_PUBLIC_SHORT_URL_LINK || 'http://localhost:3030'}/${slug}`;
  return newURL;
}
