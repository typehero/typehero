import { ImageResponse } from '@vercel/og';
import { challengeParam } from 'utils/zodParams';
import { fetchFont } from 'utils/fetchFont';
import { Logo3d } from 'app/components/logo3d';
import { Grid } from 'app/components/grid';

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

  const COLORS_BY_DIFFICULTY = {
    BEGINNER: 'bg-[#86cae9]',
    EASY: 'bg-[#85efac]',
    MEDIUM: 'bg-[#f19c41]',
    HARD: 'bg-[#f87272]',
    EXTREME: 'bg-[#d8b4fe]',
  };

  const HOST =
    process.env.NODE_ENV === 'production' ? 'https://og.typehero.dev' : 'http://localhost:4200';

  return new ImageResponse(
    (
      <div tw="bg-black h-full w-full text-white bg-cover flex flex-col pt-14 px-32">
        <Grid />
        <img
          tw="absolute right-16 -bottom-10 h-32 opacity-30"
          style={{ transform: 'rotate(30deg)' }}
          src={`${HOST}/amoguwuowoaahhh.png?cache-bust=${new Date().getDate()}`}
          alt="OG"
        />
        <div tw="flex flex-col items-start h-full overflow-hidden rounded-t-[3.5rem] border-zinc-700 border-2 border-b-0 to-black relative">
          <svg
            // @ts-ignore
            tw="absolute h-full w-full"
            viewBox="0 0 512 512"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="512" height="512" fill="url(#paint0_linear_970_280)" />
            <defs>
              <linearGradient
                id="paint0_linear_970_280"
                x1="4.54647"
                y1="-5.28981e-05"
                x2="616.249"
                y2="213.967"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="#27272A" />
                <stop offset="1" stop-color="#0E0E0F" />
              </linearGradient>
            </defs>
          </svg>
          <div tw="flex flex-col p-10 w-full">
            <div tw="flex absolute top-10 right-10">
              <Logo3d />
            </div>

            <p tw="flex items-center -mt-3">
              <p tw="text-2xl font-bold bg-zinc-600 rounded-full px-3 py-1.5">
                <span>@</span>
                <span>{props.username}</span>
              </p>
              <p tw="text-2xl ml-4">{props.date}</p>
            </p>
            <h1
              tw="text-7xl font-bold truncate pr-48 -mt-2 overflow-ellipsis"
              style={{ fontWeight: '800 !important' }}
            >
              {props.title === null ? null : props.title.split(" | ")[0]}
            </h1>
            <p tw="flex items-center -mt-3">
              <p
                tw={`${
                  COLORS_BY_DIFFICULTY[props.difficulty]
                } text-black font-bold text-2xl px-6 py-1.5 rounded-full`}
              >
                {props.difficulty}
              </p>
            </p>
            <p tw="text-3xl text-zinc-300">{props.description}</p>
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
