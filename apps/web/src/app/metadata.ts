import type { Metadata } from 'next';
import { challengeParam } from '@repo/og-image';

const OG_URL =
  process.env.NODE_ENV !== 'production' ? 'https://og.typehero.dev' : 'http://localhost:4200';

const tagline = 'Level up your typescript skills with interactive exercises';
const baseMetadata: Metadata = {
  metadataBase: new URL(OG_URL),
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
        url: `${OG_URL}/api/default`,
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

interface BuildMetaParams {
  title: string;
  description: string;
  ogImage?: NonNullable<NonNullable<Metadata['openGraph']>['images']>;
  /** we can update this so that we chose a diff template to render */
  route?: string;
}

/* a list of the og image endpoints to hit based on current route
/@Hacksore - /api/user
/challenge - /api/challenge
/          - /api/default
*/

/**
 * Helper to build opengraph metadata with defaults, you can override the defaults by passing in the params
 * @example
 * ```
 * const meta = await buildMeta({
 *   title: 'My title',
 *   description: 'My description',
 *   route: 'challenge'
 * });
 * ```
 */
export const buildMeta = async ({
  title,
  description,
  route = 'default',
}: BuildMetaParams): Promise<Metadata> => {
  const appUrl =
    process.env.NODE_ENV !== 'production' ? 'http://localhost:4200' : 'https://og.typehero.dev';

  // TODO: we need a typesafe way to map to each template to the zod schema in the future
  // maybe what we do is have methods for each card like buildMetaforChallenge, buildMetaForUser, etc
  const params = `${challengeParam.toSearchString({
    description,
    title,
    // TODO: get author from db
    username: 'Hacksore',
    // TODO: get date from db
    date: new Date().toISOString(),
  })}`;

  const ogImageUrl = `${appUrl}/api/${route}?${params}`;

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
