import type { Metadata } from 'next';

export const OG_URL =
  process.env.NODE_ENV !== 'production' ? 'http://localhost:4200' : 'https://og.typehero.dev';

export const tagline = 'Advent of TypeScript';
export const baseMetadata: Metadata = {
  metadataBase: new URL(OG_URL),
  title: {
    default: 'Advent of TypeScript',
    template: '%s',
  },
  robots: {
    index: true,
    follow: true,
  },
  description: tagline,
  openGraph: {
    title: 'Advent of TypeScript',
    images: [
      {
        url: `${OG_URL}/api/default`,
        width: 1920,
        height: 1080,
      },
    ],
    locale: 'en-US',
    type: 'website',
  },
  twitter: {
    title: 'Advent of TypeScript',
    card: 'summary_large_image',
    images: [
      {
        url: `${OG_URL}/api/aot-2024`,
        width: 1920,
        height: 1080,
      },
    ],
  },
  icons: {
    shortcut: '/favicon.ico',
  },
};

export const buildMetaForEventPage = () => {
  return buildMeta({
    ogImageUrl: `${OG_URL}/api/aot-2024`,
  });
};

/** update the metadata for og */
const buildMeta = ({ ogImageUrl }: { ogImageUrl: string }) => {
  baseMetadata.openGraph!.images = ogImageUrl;
  baseMetadata.twitter!.images = ogImageUrl;

  return baseMetadata;
};

export default baseMetadata;
