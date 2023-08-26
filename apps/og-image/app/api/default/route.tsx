import { ImageResponse } from '@vercel/og';
import { Logo } from 'app/components/logo';

export const runtime = 'edge';

export async function GET() {
  return new ImageResponse(
    (
      <img
        tw="w-full h-full"
        src="https://media.discordapp.net/attachments/1124722250294243428/1144691954257510460/image.png?width=2592&height=1397"
      />
    ),
    {
      width: 1200,
      height: 647,
    },
  );
}
