import { ImageResponse } from '@vercel/og';
import OG from 'app/assets/og.png';
import Image from 'next/image';

export const runtime = 'edge';

export async function GET() {
  return new ImageResponse(
    (
      <>
        <h1 tw="text-red-500 font-bold text-3xl">test</h1>
        {/* <Image alt="typehero" tw="w-full h-full" src={OG} /> */}
        {/* <img alt="typehero" tw="w-full h-full" src="../og.png" /> */}
      </>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
