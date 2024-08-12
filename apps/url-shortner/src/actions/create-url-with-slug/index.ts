'use server';
import { auth } from '~/server/auth';
import { prisma } from '@repo/db';

export async function createShortURLWithSlug(url: string, slug: string): Promise<string | null> {
  const session = await auth();
  if (!session) {
    return null;
  }

  // check for admin role to create a short URL with a custom slug
  if (!session.user.role.includes('ADMIN')) {
    return null;
  }

  const existingSlug = await prisma.shortURL.findUnique({
    where: {
      shortUrlSlug: slug,
    },
  });

  if (existingSlug) {
    return null;
  }

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
