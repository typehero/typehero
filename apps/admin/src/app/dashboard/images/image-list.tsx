'use client';
import { type ImageUpload } from '@repo/db/types';

// million-ignore
export const ImageList = ({ images }: { images: ImageUpload[] }) => {
  return (
    <div className="flex flex-row flex-wrap gap-4">
      {images.map((image) => (
        <a href={image.url} key={image.id} target="_blank" rel="noreferrer">
          {/*  eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt={image.id}
            className="bg-blue-300"
            height="auto"
            onError={(e) => {
              // BUG: doesnt work cause UT doesnt throw 404
              e.currentTarget.src = '/failed.jpeg';
              e.currentTarget.alt = 'Failed to load image';
            }}
            src={image.url}
            width="300"
          />
        </a>
      ))}
    </div>
  );
};
