import { ImageResponse } from '@vercel/og';

export const runtime = 'edge';

export async function GET() {
  return new ImageResponse(
    (
      <div tw="relative flex flex-col">
        <img
          src="https://utfs.io/f/7d4db93c-176d-4f25-b82d-8517f6bd053c-5juvoi.png"
          tw="w-full"
          alt="gg"
        />
        <div tw="absolute font-semibold flex-grow h-full text-5xl text-red-600 flex w-full justify-end">
          {/* //Todo: Can change to other status programmatically or hardcoded */}
          {/* <div tw="absolute bottom-0 p-5 px-10">Coming December 1st</div> */}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      // fonts: [{ name: 'Inter', data: inter700, weight: 700 }],
    },
  );
}
