import { faker } from '@faker-js/faker';
import { PrismaClient } from '.';
import uuidByString from 'uuid-by-string';
import { loadChallengesFromTypeChallenge } from './mocks/challenges.mock';
import UserMock from './mocks/user.mock';

const prisma = new PrismaClient();

const usersToBeMade = Array.from({ length: 15 }, () => UserMock());
const alotOfSharedSolutions = (challengeId: number) =>
  Array.from({ length: 50 }, () => ({
    challengeId,
    title: faker.lorem.words(7),
    description: faker.lorem.words({ min: 5, max: 25 }),
  }));

await prisma.user.createMany({
  data: usersToBeMade,
});

// Load the challenges.
const data = await loadChallengesFromTypeChallenge();
const users = await prisma.user
  .findMany({
    select: {
      id: true,
    },
  })
  .then((r) => r.map((u) => u.id));

  // TODO: PLS FIX :(
// await prisma.challenge.createMany({
//   data: data.map((challenge) => ({
//     ...challenge,
//     userId: faker.helpers.arrayElement(users),
//   })),
// });

export const trashId = uuidByString('trash');
export const gId = uuidByString('g');

try {
  const someChallenge = await prisma.challenge.findFirst();

  await prisma.user.upsert({
    where: { id: trashId },
    update: {},
    create: {
      id: trashId,
      email: 'chris@typehero.dev',
      name: 'chris',
      sharedSolution: {
        create: alotOfSharedSolutions(someChallenge?.id ?? 2),
      },
    },
  });

  await prisma.challenge.update({
    where: { id: someChallenge?.id },
    data: {
      comment: {
        create: Array.from({ length: 50 }, () => ({
          text: 'here is a comment',
          userId: trashId,
        })),
      },
    },
  });

  await prisma.$disconnect();
} catch (e) {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
}
