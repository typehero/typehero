import { auth } from '@repo/auth/server';
import { prisma } from '@repo/db';
import Image from 'next/image';
import { assertAdmin } from '~/utils/auth-guards';

export default async function ImagesPage() {
  const session = await auth();
  assertAdmin(session);

  const data = await getUploadedImages();
  return (
    <div className="flex flex-col gap-2">
      <div>
        {data.map((image) => (
          <Image
            alt={`${image.id}`}
            className="rounded-lg"
            height="300"
            key={image.id}
            src={image.url}
            width="300"
          />
        ))}
      </div>
    </div>
  );
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
      createdAt: 'asc',
    },
  });
}
