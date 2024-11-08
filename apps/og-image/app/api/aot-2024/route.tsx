import { ImageResponse } from '@vercel/og';

export const runtime = 'edge';

export async function GET() {
  return new ImageResponse(
    (
      <div tw="relative flex flex-col">
        <img
          src="https://utfs.io/f/8G81upehgowlBVbY7JPrNSbxC8KMGVhPpRDmrdWQ7L53ai6s"
          tw="w-full"
          alt="gg"
        />
        <div tw="absolute font-semibold flex-grow h-full text-5xl text-red-600 flex w-full justify-end" />
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
