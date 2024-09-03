import { ImageResponse } from '@vercel/og';
import { fetchFont, userParam } from '@repo/og-utils';
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
      <div tw="bg-black h-full w-full text-white bg-cover flex flex-col px-14 py-10">
        <Grid />
        <div tw="flex flex text-center h-full w-full gap-4 justify-between">
          <div tw="flex items-center">
            {props.avatar ? (
              <img src={props.avatar} tw="object-cover h-68 w-68 rounded-full" />
            ) : null}
            <div tw="flex flex-col ml-10">
              <h1 tw="text-8xl font-bold">{props.username}</h1>
              <p tw="text-4xl -mt-6 font-medium">Member Since: {props.dateSince}</p>
            </div>
          </div>
          <div tw="flex relative right-0">
            <Logo />
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
