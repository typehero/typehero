import { ImageResponse } from '@vercel/og';
import { Logo } from 'app/components/logo';

export const runtime = 'edge';

export async function GET() {
  return new ImageResponse(
    (
      <div tw="bg-zinc-900 h-full w-full text-white flex flex-col">
        <img
          tw="w-full h-full"
          src="https://media.discordapp.net/attachments/1124722250294243428/1144691954257510460/image.png?width=2592&height=1397"
        />
        {/* <div tw="flex flex-col justify-center items-center w-full h-full">
          <Logo />
          <h1 tw="text-6xl pt-3">Typehero</h1>
          <p tw="text-center text-3xl text-zinc-300">
            Level up your typescript skills with interactive exercises
          </p>
        </div> */}
      </div>
    ),
    {
      width: 1200,
      height: 647,
    },
  );
}
