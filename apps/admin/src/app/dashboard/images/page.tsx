import { auth } from '~/server/auth';
import { prisma } from '@repo/db';
import { assertAdmin } from '~/utils/auth-guards';
import { ImageList } from './image-list';

export default async function ImagesPage() {
  const session = await auth();
  assertAdmin(session);

  const data = await getUploadedImages();
  return <ImageList images={data} />;
}

export type UploadedImages = Awaited<ReturnType<typeof getUploadedImages>>;
/**
 * The function fetches the last 100 uploaded images.
 */
export async function getUploadedImages() {
  const session = await auth();
  assertAdmin(session);

  return prisma.imageUpload.findMany({
    take: 100,
    orderBy: {
      createdAt: 'desc',
    },
  });
}
