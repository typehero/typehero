import { ImageResponse } from '@vercel/og';
import { userParam } from 'utils/zodParams';
import { fetchFont } from 'utils/fetchFont';
import { Grid } from 'app/components/grid';
import { Logo } from 'app/components/logo';

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
      <div tw="bg-black h-full w-full text-white bg-cover flex flex-col px-32 py-14">
        <Grid />
        <div tw="flex flex-col justify-center items-center text-center h-full w-full">
          <Logo />
          <h1 tw="text-6xl pt-3 font-bold mt-6">{props.username}</h1>
          <p tw="text-3xl text-zinc-300">
            A user that we can prolly pull data from the db or at least their avatar maybe?
          </p>
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
