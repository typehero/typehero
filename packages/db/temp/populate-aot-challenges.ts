import path from 'node:path';
import uuidByString from 'uuid-by-string';
import { fileURLToPath } from 'node:url';
import { ingestChallenges } from '../seed/data/challenge-ingest';
import { prisma } from '../src';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const challengePath = path.join(__dirname, '../../../challenges/aot');

const excludes = ['blank', 'solutions', 'metadata.schema.json'];
export const slugify = (str: string) => str.toLowerCase().replace(/\s/g, '-');

const TYPEHERO_ID = uuidByString('typehero');

try {
  await prisma.user.upsert({
    where: { id: TYPEHERO_ID },
    update: {},
    create: {
      id: TYPEHERO_ID,
      email: 'typeherapp@gmail.com',
      name: 'TypeHero',
      userLinks: {
        create: {
          url: 'https://typehero.dev',
        },
      },
    },
  });
  const challengesToUpdateOrCreate = await ingestChallenges(challengePath, excludes);

  const transactions = [];
  for (const challenge of challengesToUpdateOrCreate) {
    const author = await prisma.user.findFirstOrThrow({
      where: {
        name: challenge.author,
      },
    });
    const { author: _, description, ...challengeWithoutAuthor } = challenge;
    transactions.push(
      prisma.challenge.upsert({
        where: {
          slug: challenge.slug,
        },
        update: {
          ...challengeWithoutAuthor,
          userId: author.id,
          description: `${description} \n\n <sub>prompt by [Dimitri Mitropoulos](https://github.com/dimitropoulos) of [MiTS](https://michigantypescript.com)</sub>`,
        },
        create: {
          ...challengeWithoutAuthor,
          userId: author.id,
          description: `${description} \n\n <sub>prompt by [Dimitri Mitropoulos](https://github.com/dimitropoulos) of [MiTS](https://michigantypescript.com)</sub>`,
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
