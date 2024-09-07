'use server';
import { auth } from '~/server/auth';
import { prisma } from '@repo/db';
import { getBaseUrl } from '~/utils/getBaseUrl';
import { THREE_MONTHS } from '../increment-time';
import { isAdmin } from '~/utils/auth-guards';

export async function createShortURLWithSlug(
  url: string,
  slug: string,
  expiresAt = new Date(Date.now() + THREE_MONTHS),
  overwrite = false,
): Promise<string | null> {
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

  if (existingSlug && !overwrite) {
    return null;
  }

  await prisma.shortURL.upsert({
    where: {
      shortUrlSlug: slug,
    },
    update: {
      originalUrl: url,
      expiresAt,
    },
    create: {
      shortUrlSlug: slug,
      originalUrl: url,
      expiresAt,
    },
  });

  const newURL = `${baseURL}/share/${slug}`;
  return newURL;
}
