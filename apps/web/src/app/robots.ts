import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/api/og/*',
      disallow: '/private/',
    },
    // TODO: add a sitemap
    // sitemap: 'https://typehero.dev/sitemap.xml',
  };
}
