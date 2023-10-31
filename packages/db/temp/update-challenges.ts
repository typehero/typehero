import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ingestChallenges } from '../seed/data/challenge-ingest';
import { prisma } from '../src';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const challengePath = path.join(__dirname, '../../../challenges');

export const slugify = (str: string) => str.toLowerCase().replace(/\s/g, '-');

try {
  const challengesToUpdateOrCreate = await ingestChallenges(challengePath);

  const transactions = [];
  for (const challenge of challengesToUpdateOrCreate) {
    const author = await prisma.user.findFirstOrThrow({
      where: {
        name: challenge.author,
      },
    });
    const { author: _, ...challengeWithoutAuthor } = challenge;
    transactions.push(
      prisma.challenge.upsert({
        where: {
          slug: challenge.slug,
        },
        update: {
          ...challengeWithoutAuthor,
          userId: author.id,
        },
        create: {
          ...challengeWithoutAuthor,
          userId: author.id,
        },
      }),
    );
  }
  await prisma.$transaction(transactions);

  await prisma.$disconnect();
} catch (e) {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
}
