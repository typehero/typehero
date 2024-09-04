'use server';
import { auth } from '~/server/auth';
import { prisma } from '@repo/db';
import { getBaseUrl } from '~/utils/getBaseUrl';
import { THREE_MONTHS } from '../increment-time';
import { isAdmin } from '~/utils/auth-guards';

export async function createShortURLWithSlug(url: string, slug: string): Promise<string | null> {
  const session = await auth();
  const baseURL = getBaseUrl();
  if (!session) {
    return null;
  }

  // check for admin role to create a short URL with a custom slug
  if (!isAdmin(session)) {
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
      expiresAt: new Date(Date.now() + THREE_MONTHS),
      user: {
        connect: {
          id: session.user.id,
        },
      },
    },
  });

  const newURL = `${baseURL}/share/${slug}`;
  return newURL;
}
