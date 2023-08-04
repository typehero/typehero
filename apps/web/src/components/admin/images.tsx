'use client';
import Image from 'next/image';
import type { getUploadedImages } from './admin.actions';

export type ImageUpload = Awaited<ReturnType<typeof getUploadedImages>>;

interface ImageUploadProps {
  data: ImageUpload;
}

export const ImageUploadReport = ({ data }: ImageUploadProps) => {
  return (
    <div className="flex flex-col gap-2">
      <div>
        {data.map((image) => (
          <Image
            key={image.id}
            src={image.url}
            width="300"
            height="300"
            alt={`${image.id}`}
            className="rounded-lg"
          />
        ))}
      </div>
    </div>
  );
};
