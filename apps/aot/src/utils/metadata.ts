import type { Metadata } from 'next';
import { challengeParam, userParam } from '@repo/og-utils';

export const OG_URL =
  process.env.NODE_ENV !== 'production' ? 'http://localhost:4200' : 'https://og.typehero.dev';

export const tagline = 'Level up and learn TypeScript with interactive exercises';
export const baseMetadata: Metadata = {
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

// TODO: infer from ZOD
interface MetaParamsForChallenge {
  title: string;
  description: string;
  username: string;
  difficulty: 'BEGINNER' | 'EASY' | 'EVENT' | 'EXTREME' | 'HARD' | 'MEDIUM';
  date: string;
}

interface MetaParamsForUser {
  title: string;
  description: string;
  username: string;
  avatar: string;
  dateSince: string;
}
/** Helper to build opengraph metadata for a user, you should call this in generateMetadata() next function */
export const buildMetaForUser = async ({
  title,
  description,
  username,
  dateSince,
  avatar,
}: MetaParamsForUser): Promise<Metadata> => {
  const params = `${userParam.toSearchString({
    username,
    avatar,
    dateSince,
  })}`;

  const ogImageUrl = `${OG_URL}/api/user?${params}`;

  return buildMeta({
    ogImageUrl,
    title,
    description,
  });
};

/** Helper to build opengraph metadata for a challenge, you should call this in generateMetadata() next function */
export const buildMetaForChallenge = async ({
  title,
  description,
  username,
  difficulty,
  date,
}: MetaParamsForChallenge): Promise<Metadata> => {
  const params = `${challengeParam.toSearchString({
    description,
    title,
    username,
    difficulty,
    date,
  })}`;

  const ogImageUrl = `${OG_URL}/api/challenge?${params}`;

  return buildMeta({
    ogImageUrl,
    title,
    description,
  });
};

/** Helper to build opengraph metadata with defaults, you should call this in generateMetadata() next function */
export const buildMetaForDefault = async ({
  title,
  description,
}: {
  title?: string;
  description?: string;
}): Promise<Metadata> => {
  return buildMeta({
    ogImageUrl: `${OG_URL}/api/default?cache-bust=${new Date().getDate()}`,
    title,
    description,
  });
};

export const buildMetaForEventPage = async ({
  title,
  description,
}: {
  title?: string;
  description?: string;
}): Promise<Metadata> => {
  return buildMeta({
    ogImageUrl: `${OG_URL}/api/aot-2023`,
    title,
    description,
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
