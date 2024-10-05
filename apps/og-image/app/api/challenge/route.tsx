import { ImageResponse } from '@vercel/og';
import { fetchFont, challengeParam } from '@repo/og-utils';
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
    // should never actually be used
    EVENT: 'bg-[#d8b4fe]',
  };

  const GRADIENT_BY_DIFFICULTY = {
    BEGINNER: '#366175',
    EASY: '#2a4734',
    MEDIUM: '#66421b',
    HARD: '#5c2020',
    EXTREME: '#48345c',
    // should never actually be used
    EVENT: '#48345c',
  };

  const mogus_coords = Array.from(
    new Set([
      ['right-16 -bottom-10', 'rotate(50deg)'],
      ['left-8 -bottom-16', 'scaleX(-1)'],
      ['top-0 left-100', 'scaleX(1)'],
    ]),
  );

  const mogus_roll = Math.floor(1 + Math.random() * 9);
  const random_mogus_coord = mogus_coords[Math.floor(Math.random() * mogus_coords.length)] ?? '';
  let title = props.title === null ? null : props.title.split(' | ')[0]?.trim();
  if (title && title?.length > 45) {
    title = `${title.slice(0, 40)}…`;
  }

  const HOST =
    process.env.NODE_ENV === 'production' ? 'https://og.typehero.dev' : 'http://localhost:4200';

  return new ImageResponse(
    (
      <div tw="bg-black h-full w-full text-white bg-cover justify-center flex flex-col  pt-10 pb-10 px-16">
        <Grid />
        {mogus_roll === 8 && (
          <img
            tw={`absolute h-32 opacity-30 ${random_mogus_coord[0]}`}
            style={{ transform: random_mogus_coord[1] }}
            src={`${HOST}/amoguwuowoaahhh.png?cache-bust=${new Date().getDate()}`}
            alt="OG"
          />
        )}
        <div tw="flex items-start min-h-[350px] overflow-hidden rounded-[3.5rem] border-zinc-700 border-2 to-black relative">
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
                <stop offset="1" stop-color={GRADIENT_BY_DIFFICULTY[props.difficulty]} />
              </linearGradient>
            </defs>
          </svg>
          <div tw="flex h-full flex-col p-10 w-full">
            <div tw="flex absolute top-10 right-10">
              <Logo3d />
            </div>
            <h1
              tw="-mt-2 text-7xl pr-48 truncate overflow-ellipsis"
              style={{ fontWeight: '800 !important' }}
            >
              {title}
            </h1>
            <div tw="flex absolute bottom-10 left-10 flex-row items-center">
              <p
                tw={`${
                  COLORS_BY_DIFFICULTY[props.difficulty]
                } text-black font-bold text-2xl rounded-full px-6 py-1.5 mb-0 mt-0`}
              >
                {props.difficulty}
              </p>
              <p tw="bg-zinc-600 font-bold text-2xl rounded-full px-3 pt-1.5 pb-2 mt-0 ml-4 mb-0">
                <span>@</span>
                <span>{props.username}</span>
              </p>
              <p tw="text-2xl ml-4 mb-0 mt-0">{props.date}</p>
            </div>
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
