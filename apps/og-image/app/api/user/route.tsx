import { ImageResponse } from '@vercel/og';
import { userParam } from 'utils/zodParams';
import { fetchFont } from 'utils/fetchFont';
import { Grid } from 'app/components/grid';
import { Logo } from 'app/components/logo';
import Image from 'next/image';

export const runtime = 'edge';

export async function GET(req: Request) {
  const [inter900, inter700, inter400] = await Promise.all([
    fetchFont('Inter', 900),
    fetchFont('Inter', 700),
    fetchFont('Inter', 400),
  ]);

  const parsed = userParam.decodeRequest(req);

  if (!parsed.success) {
    return new Response(parsed.error.toString(), { status: 400 });
  }

  const props = parsed.data.input;

  return new ImageResponse(
    (
      <div tw="bg-black h-full w-full text-white bg-cover flex flex-col px-14 py-10">
        <Grid />
        <div tw="flex flex-col text-center h-full w-full gap-4 justify-between">
          <div tw="flex justify-between">
            {props.avatar ? (
              <img src={props.avatar} tw="object-cover h-36 w-36 rounded-full" />
            ) : null}
            <Logo />
          </div>
          <div tw="flex flex-col text-left">
            <h1 tw="text-6xl font-bold">{props.username}</h1>
            {props.bio ? <p tw="text-4xl text-zinc-300">{props.bio}</p> : null}
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 600,
      fonts: [
        { name: 'Inter', data: inter900, weight: 900 },
        { name: 'Inter', data: inter700, weight: 700 },
        { name: 'Inter', data: inter400, weight: 400 },
      ],
    },
  );
}
