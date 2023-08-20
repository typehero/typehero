import type { Metadata } from 'next';
import { headers } from 'next/headers';

const tagline = 'Level up your typescript skills with interactive exercises';
const baseMetadata: Metadata = {
  metadataBase: process.env.VERCEL_URL
    ? new URL(`https://${process.env.VERCEL_URL}`)
    : new URL(`http://localhost:${process.env.PORT ?? 3000}`),
  title: {
    default: 'Typehero',
    template: '%s | TypeHero',
  },
  robots: {
    index: true,
    follow: true,
  },
  description: tagline,
  openGraph: {
    title: 'Typehero',
    description: tagline,
    siteName: 'Typehero',
    images: [
      {
        url: encodeURI(`https://${process.env.VERCEL_URL}/api/og?desc=Testing`),
        width: 1920,
        height: 1080,
      },
    ],
    locale: 'en-US',
    type: 'website',
  },
  twitter: {
    title: 'Typehero',
    card: 'summary_large_image',
    images: [
      {
        url: encodeURI(`https://${process.env.VERCEL_URL}/api/og?desc=Testing`),
        width: 1920,
        height: 1080,
      },
    ],
  },
  icons: {
    shortcut: '/favicon.ico',
  },
};

interface BuildMetaParams {
  title: string;
  description?: string;
  ogImage?: NonNullable<NonNullable<Metadata['openGraph']>['images']>;
}

/** Helper to build opengraph metadata with defaults, you can override the defaults by passing in the params */
export const buildMeta = async ({ title, description }: BuildMetaParams): Promise<Metadata> => {
  const headersList = headers();
  const host = headersList.get('host');
  const appUrl = process.env.VERCEL_URL ?? host;
  const ogImageUrl = `https://${appUrl}/api/og?title=${title}`;

  baseMetadata.openGraph!.images = ogImageUrl;
  baseMetadata.twitter!.images = ogImageUrl;

  if (description) {
    baseMetadata.description = description;
    baseMetadata.twitter!.description = description;
    baseMetadata.openGraph!.description = description;
  }

  if (title) {
    baseMetadata.title = title;
    baseMetadata.twitter!.title = title;
    baseMetadata.openGraph!.title = title;
  }

  return baseMetadata;
};

export default baseMetadata;
