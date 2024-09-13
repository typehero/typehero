import { fontParams } from './zodParams';

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:4200';
// process.env.NODE_ENV === 'production' ? 'https://og.typehero.dev' : 'http://localhost:4200';

export const fetchFont = (family: string, weight?: number, text?: string) =>
  fetch(
    `${baseUrl}/api/font?${fontParams.toSearchString({
      family,
      weight,
      text,
    })}`,
  ).then((res) => res.arrayBuffer());
