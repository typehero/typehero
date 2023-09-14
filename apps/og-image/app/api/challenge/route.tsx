import { ImageResponse } from '@vercel/og';
import { challengeParam } from 'utils/zodParams';
import { fetchFont } from 'utils/fetchFont';
import { Logo } from 'app/components/logo';

export const runtime = 'edge';

export async function GET(req: Request) {
  const [inter900, inter700, inter400] = await Promise.all([
    fetchFont('Inter', 900),
    fetchFont('Inter', 700),
    fetchFont('Inter', 400),
  ]);

  const parsed = challengeParam.decodeRequest(req);

  if (!parsed.success) {
    return new Response(parsed.error.toString(), { status: 400 });
  }

  const props = parsed.data.input;

  return new ImageResponse(
    (
      <div tw="bg-black h-full w-full text-white bg-cover flex flex-col pt-14 px-24">
        <div tw="flex flex-col items-start h-full px-10 py-4 rounded-t-3xl border border-b-none border-zinc-700 bg-zinc-800">
          {/* <Logo /> */}
          <h1 tw="text-6xl font-bold truncate" style={{ fontWeight: '800 !important' }}>
            {props.title}
          </h1>
          <p tw="flex items-center">
            <p tw="text-3xl font-bold bg-zinc-600 rounded-full px-3 py-1.5">
              <span>@</span>
              <span>{props.username}</span>
            </p>
            {/* TODO: replace with date posted */}
            <p tw="text-3xl ml-4">x days ago</p>
          </p>
          <p tw="flex items-center">
            {/* TODO: replace with props.difficulty */}
            <p tw="bg-blue-400 text-black font-bold text-2xl px-3 py-1.5 rounded-full">BEGINNER</p>
          </p>
          <p tw="text-center text-3xl text-zinc-300">{props.description}</p>
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
