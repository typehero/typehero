import { ImageResponse } from '@vercel/og';
import { challengeParam } from 'utils/zodParams';
import { Logo } from 'app/components/logo';

export const runtime = 'edge';

export async function GET(req: Request) {
  const parsed = challengeParam.decodeRequest(req);

  if (!parsed.success) {
    return new Response(parsed.error.toString(), { status: 400 });
  }

  const props = parsed.data.input;

  return new ImageResponse(
    (
      <div tw="bg-zinc-900 h-full w-full text-white bg-cover flex flex-col p-14">
        <div tw="flex flex-col justify-center items-center w-full h-full">
          <Logo />
          <h1 tw="text-6xl pt-3">{props.title}</h1>
          <p tw="text-center text-3xl text-zinc-300">{props.description}</p>
          <p tw="text-3xl">
            <span tw="mr-2">created by</span>
            <span tw="text-blue-500">{props.username}</span>
          </p>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 600,
    },
  );
}
