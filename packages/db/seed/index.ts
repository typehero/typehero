import { faker } from '@faker-js/faker';
import { PrismaClient, type Challenge, type Prisma } from '@prisma/client';
import uuidByString from 'uuid-by-string';
import { loadChallengesFromTypeChallenge } from '../mocks/challenges.mock';
import CommentMock from '../mocks/comment.mock';
import UserMock from '../mocks/user.mock';

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

await prisma.challenge.createMany({
  data: data.map((challenge) => ({
    ...challenge,
    userId: faker.helpers.arrayElement(users),
  })),
});

export const trashId = uuidByString('trash');
export const gId = uuidByString('g');

const tracks = [
  {
    name: 'Crafting TypeScript Utility Types',
    description:
      "This collection guides you through hands-on exercises to recreate Typescript's built-in utility types.",
  },
  {
    name: 'Typescript Wizardry',
    description:
      "Dive into the elite realm of TypeScript mastery with our 'Pro-Level TypeScript Challenges.' Designed for seasoned professionals, this collection offers a formidable gauntlet of intricate exercises, pushing the boundaries of your TypeScript expertise to the limit.",
  },
  {
    name: 'Javascript Built in Methods',
    description:
      "This collection of challenges equips you to develop and enhance standard JavaScript methods, all while harnessing TypeScript's advanced type system to achieve a fully typesafe developer experience.",
  },
  {
    name: 'Understanding Typescript Syntax',
    description:
      'A collection of challenging exercises that dive into type annotations, generics, and more to level up your typescript abilities.',
  },
  {
    name: 'Typescript Foundations',
    description:
      "'Typescript Foundations' is a curated set of challenges designed to build a strong foundation. From basic syntax to advanced concepts, this collection offers hands-on exercises to help you become a TypeScript Hero.",
  },
];

for (const [index, track] of tracks.entries()) {
  const challenges = await getRandomChallenges(index);

  const createdTrack = await prisma.track.create({
    data: {
      title: track.name,
      description: track.description,
      visible: true,
    },
  });

  await prisma.trackChallenge.createMany({
    data: challenges.map((challenge, index) => ({
      challengeId: challenge.id,
      trackId: createdTrack.id,
      orderId: index,
    })),
  });
}

try {
  const someChallenge = await prisma.challenge.findFirst({
    where: {
      status: 'ACTIVE',
    },
  });

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

  let commentNum = 0;
  const comments = Array.from({ length: 50 }, () => CommentMock(++commentNum));

  const replies: Prisma.CommentCreateManyInput[] = [];

  const { comment: createdComments } = await prisma.challenge.update({
    where: { id: someChallenge?.id },
    include: {
      comment: true,
    },
    data: {
      comment: {
        create: comments,
      },
    },
  });

  for (const comment of createdComments) {
    replies.push(CommentMock(++commentNum, comment.id), CommentMock(++commentNum, comment.id));
  }

  await prisma.challenge.update({
    where: { id: someChallenge?.id },
    data: {
      comment: {
        create: replies,
      },
    },
  });

  await prisma.$disconnect();
} catch (e) {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
}

async function getRandomChallenges(iteration: number): Promise<Challenge[]> {
  const challenges = await prisma.challenge.findMany({
    take: 10,
    skip: 10 * iteration,
  });
  return challenges;
}
