import { ImageResponse } from '@vercel/og';
import { Logo } from 'app/components/logo';
import { userParam } from 'utils/zodParams';

export const runtime = 'edge';

export async function GET(req: Request) {
  const parsed = userParam.decodeRequest(req);

  if (!parsed.success) {
    return new Response(parsed.error.toString(), { status: 400 });
  }

  const props = parsed.data.input;

  return new ImageResponse(
    (
      <div tw="bg-zinc-900 h-full w-full text-white flex flex-col p-14">
        <div tw="flex flex-col justify-center items-center w-full h-full">
          <Logo />
          <h1 tw="text-6xl pt-3">{props.username}</h1>
          <p tw="text-center text-3xl text-zinc-300">
            A user that we can prolly pull data from the db or at least their avatar maybe?
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
