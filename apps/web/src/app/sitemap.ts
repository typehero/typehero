import type { MetadataRoute } from 'next';
import { prisma } from '@repo/db';

const URL = 'https://typehero.dev';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const allChallenges = await prisma.challenge.findMany();

  return [
    {
      url: `${URL}/`,
      lastModified: new Date(),
    },
    {
      url: `${URL}/explore`,
      lastModified: new Date(),
    },
    {
      url: `${URL}/tracks`,
      lastModified: new Date(),
    },
    {
      url: `${URL}/tos`,
      lastModified: new Date(),
    },
    {
      url: `${URL}/privacy`,
      lastModified: new Date(),
    },
    ...allChallenges.map((challenge) => ({
      url: `${URL}/challenges/${challenge.slug}`,
      lastModified: new Date(challenge.updatedAt),
    })),
  ];
}
