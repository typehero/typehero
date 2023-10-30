import path from 'node:path';
import { fileURLToPath } from 'node:url';
import uuidByString from 'uuid-by-string';
import { ingestChallenges } from '../seed/data/challenge-ingest';
import { prisma } from '../src';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const challengePath = path.join(__dirname, '../../../challenges');

export const slugify = (str: string) => str.toLowerCase().replace(/\s/g, '-');
const TYPEHERO_ID = uuidByString('typehero');

try {
  const typeHeroUser = await prisma.user.findFirstOrThrow({
    where: { id: TYPEHERO_ID },
  });

  const challengesToUpdateOrCreate = await ingestChallenges(challengePath);

  const transactions = [];
  for (const challenge of challengesToUpdateOrCreate) {
    transactions.push(
      prisma.challenge.upsert({
        where: {
          slug: challenge.slug,
        },
        update: {
          ...challenge,
        },
        create: {
          ...challenge,
          userId: typeHeroUser.id,
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
