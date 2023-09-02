import { ImageResponse } from '@vercel/og';

export const runtime = 'edge';

const HOST =
  process.env.NODE_ENV === 'production' ? 'https://og.typehero.dev' : 'http://localhost:4200';
export async function GET() {
  return new ImageResponse(
    (
      <div style={{ display: 'flex' }}>
        <img src={`${HOST}/og.png?cache-bust=${new Date().getDate()}`} alt="OG" />
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
