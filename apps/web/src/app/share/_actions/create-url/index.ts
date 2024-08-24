'use server';
import { auth } from '~/server/auth';
import { newShortURLSlug } from '../shortUrlSlug';
import { prisma } from '@repo/db';
import { getBaseUrl } from '~/utils/getBaseUrl';

export async function createShortURL(url: string): Promise<string | null> {
  const session = await auth();
  const baseURL = getBaseUrl();
  if (!session) {
    return null;
  }
  const slug = newShortURLSlug();

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

  const newURL = `${baseURL}/share/${slug}`;
  return newURL;
}
