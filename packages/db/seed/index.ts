import { faker } from '@faker-js/faker';
import { PrismaClient, type Challenge, type Prisma, ReportType } from '@prisma/client';
import uuidByString from 'uuid-by-string';
import { loadChallengesFromTypeChallenge } from '../mocks/challenges.mock';
import CommentMock from '../mocks/comment.mock';
import UserMock from '../mocks/user.mock';
import { ReportMock } from '../mocks/report.mock';

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

const TRACK_AMOUNT = 10;
for (let i = 0; i < TRACK_AMOUNT; i++) {
  const challenges = await getRandomChallenges(i);

  const track = await prisma.track.create({
    data: {
      title: faker.lorem.words(2),
      description: faker.lorem.sentences(1),
      visible: true,
    },
  });

  await prisma.trackChallenge.createMany({
    data: challenges.map((challenge, index) => ({
      challengeId: challenge.id,
      trackId: track.id,
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

  const allUsers = await prisma.user.findMany({
    select: {
      id: true,
    },
    where: {
      status: 'ACTIVE'
    }
  }).then(r => r.map(v => v.id ));

  const user = faker.helpers.arrayElement(allUsers);

  const allVisibleChallenges = await prisma.challenge.findMany({
    select: {
      id: true
    }, 
    where: {
      status: {
        notIn: ['BANNED', 'DECLINED']
      }
    }
  }).then(r => r.map(v => v.id));

  await prisma.sharedSolution.createMany({
    data: alotOfSharedSolutions(faker.helpers.arrayElement(allVisibleChallenges)).map(c => ({
      ...c,
      userId: faker.helpers.arrayElement(allUsers)
    }) as Prisma.SharedSolutionCreateManyInput)
  })

  await prisma.user.upsert({
    where: { id: user },
    update: {},
    create: {
      id: user,
      email: 'chris@typehero.dev',
      name: 'chris',
      sharedSolution: {
        create: alotOfSharedSolutions(someChallenge?.id ?? 2),
      },
    },
  });

  let commentNum = 0;
  const comments = Array.from({ length: 50 }, () => CommentMock(++commentNum, undefined, faker.helpers.arrayElement(allUsers)));

  const replies: Prisma.CommentCreateManyInput[] = [];
  
  const sc = faker.helpers.arrayElement(allVisibleChallenges);

  const { comment: createdComments } = await prisma.challenge.update({
    where: { id: sc },
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
    replies.push(CommentMock(++commentNum, comment.id, faker.helpers.arrayElement(allUsers)), CommentMock(++commentNum, comment.id, faker.helpers.arrayElement(allUsers)));
  }

  await prisma.challenge.update({
    where: { id: sc},
    data: {
      comment: {
        create: replies,
      },
    },
  });

  const allComments = await prisma.comment.findMany({
    select: {
      id: true,
    },
  }).then(r => r.map(v=> v.id));

  const allSolutions = await prisma.comment.findMany({
    select: {
      id: true,
    },
    where: {
      visible: true,
    }
  }).then(r => r.map(v => v.id));

  const reports = Array.from({ length: 50 }, (_, i) => {
    const bob = faker.helpers.enumValue(ReportType);
    let id: number | string = 0;
    switch(bob) {
      case 'CHALLENGE':
        id = faker.helpers.arrayElement(allVisibleChallenges);
        id satisfies number;
        break;
      case 'COMMENT':
        id = faker.helpers.arrayElement(allComments)
        id satisfies number;
        break;
      case 'SOLUTION':
        id = faker.helpers.arrayElement(allSolutions)
        id satisfies number;
        break;
      case 'USER':
        id = faker.helpers.arrayElement(allUsers);
        id satisfies string;
        break;
    }

    return ReportMock(faker.helpers.arrayElement(allUsers), bob, id);

  });

  await prisma.report.createMany({
    data: reports,
  })

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
