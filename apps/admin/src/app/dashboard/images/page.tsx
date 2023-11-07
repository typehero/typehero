import { prisma } from '@repo/db';
import Image from 'next/image';

export default async function ImagesPage() {
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
  return prisma.imageUpload.findMany({
    take: 100,
    orderBy: {
      createdAt: 'asc',
    },
  });
}
