import type { Metadata } from 'next';
import { challengeParam } from '@repo/og-image';

const OG_URL =
  process.env.NODE_ENV !== 'production' ? 'http://localhost:4200' : 'https://og.typehero.dev';

const tagline = 'Level up your typescript skills with interactive exercises';
const baseMetadata: Metadata = {
  metadataBase: new URL(OG_URL),
  title: {
    default: 'TypeHero',
    template: '%s',
  },
  robots: {
    index: true,
    follow: true,
  },
  description: tagline,
  openGraph: {
    title: 'TypeHero',
    description: tagline,
    siteName: 'TypeHero',
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
    title: 'TypeHero',
    card: 'summary_large_image',
    images: [
      {
        url: `${OG_URL}/api/default`,
        width: 1920,
        height: 1080,
      },
    ],
  },
  icons: {
    shortcut: '/favicon.ico',
  },
};

interface MetaParamsForChallenge {
  title: string;
  description: string;
  username: string;
}

/** Helper to build opengraph metadata for a challenge, you should call this in generateMetadata() next function */
export const buildMetaForChallenge = async ({
  title,
  description,
  username,
}: MetaParamsForChallenge): Promise<Metadata> => {
  const params = `${challengeParam.toSearchString({
    description,
    title,
    username,
  })}`;

  const ogImageUrl = `${OG_URL}/api/challenge?${params}`;

  return buildMeta({
    ogImageUrl,
    title,
    description,
  });
};

/** Helper to build opengraph metadata with defaults, you should call this in generateMetadata() next function */
export const buildMetaForDefault = async (): Promise<Metadata> => {
  return buildMeta({
    ogImageUrl: `${OG_URL}/api/default?cache-bust=${new Date().getDate()}`,
  });
};

/** update the metadata for og */
const buildMeta = async ({
  ogImageUrl,
  description,
  title,
}: {
  ogImageUrl: string;
  description?: string;
  title?: string;
}): Promise<Metadata> => {
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
