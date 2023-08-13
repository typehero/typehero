'use client';
import Image from 'next/image';
import type { getUploadedImages } from './admin.actions';

export type ImageUpload = Awaited<ReturnType<typeof getUploadedImages>>;

interface ImageUploadProps {
  data: ImageUpload;
}

export function ImageUploadReport({ data }: ImageUploadProps) {
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
