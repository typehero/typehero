import { PrismaClient } from '@prisma/client';
import uuidByString from 'uuid-by-string';
import { loadChallengesFromTypeChallenge } from '../mocks/challenges.mock';

const prisma = new PrismaClient();

export const slugify = (str: string) => str.toLowerCase().replace(/\s/g, '-');
const TYPE_CHALLENGE_ID = uuidByString('type-challenges');

try {
  const typeChallengeUser = await prisma.user.upsert({
    where: { id: TYPE_CHALLENGE_ID },
    update: {},
    create: {
      id: TYPE_CHALLENGE_ID,
      email: 'fake@email.com',
      name: 'Type Challenges',
      userLinks: {
        create: {
          url: 'https://tsch.js.org/',
        },
      },
    },
  });

  const data = await loadChallengesFromTypeChallenge();

  await prisma.challenge.createMany({
    data: data.map((challenge) => ({
      ...challenge,
      userId: typeChallengeUser.id,
    })),
  });

  await prisma.$disconnect();
} catch (e) {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
}
