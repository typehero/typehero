import uuidByString from 'uuid-by-string';
import { loadChallengesFromTypeChallenge } from '../mocks/challenges.mock';
import { prisma } from '../src';

export const slugify = (str: string) => str.toLowerCase().replace(/\s/g, '-');
const TYPE_CHALLENGE_ID = uuidByString('type-challenges');

try {
  const transactions = [];
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
  const challengesFromTypeChallenges = await loadChallengesFromTypeChallenge(true);

  const typeChallengeAccount = await prisma.user.findFirstOrThrow({
    where: {
      id: typeChallengeUser.id,
    },
  });
  for (const portedChallenge of challengesFromTypeChallenges) {
    // transactions.push(
    await prisma.challenge.upsert({
      where: {
        slug: portedChallenge.slug,
      },
      update: {
        ...portedChallenge,
      },
      create: {
        ...portedChallenge,
        userId: typeChallengeAccount.id,
      },
    });
    // );
  }

  // await prisma.$transaction(transactions);
  await prisma.$disconnect();
} catch (e) {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
}
