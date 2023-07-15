import { type Difficulty, PrismaClient } from "@prisma/client";
import uuidByString from "uuid-by-string";
import { loadChallengesFromTypeChallenge } from "./challenges.mock";
import { faker } from "@faker-js/faker";
import UserMock from "./user.mock";


const prisma = new PrismaClient();
if(process.env.STAGE === 'local') {

  const usersToBeMade = Array.from({ length: 15 }, () => UserMock());

  await prisma.user.createMany({
    data: usersToBeMade
  });

  // Load the challenges.
  const data = await loadChallengesFromTypeChallenge();
  const users = await prisma.user.findMany({
    select: {
      id: true
    }
  }).then(r => r.map(u => u.id));

  await prisma.challenge.createMany({
    data: data.map(challenge => ({
      ...challenge,
      userId: faker.helpers.arrayElement(users)
    }))
  });
}


const DIFFICULTIES = ["BEGINNER", "EASY", "MEDIUM", "HARD", "EXTREME"];
const randomDifficulty = (): Difficulty => {
  return DIFFICULTIES[
    Math.floor(Math.random() * DIFFICULTIES.length)
  ] as Difficulty;
};

export const trashId = uuidByString("trash");
export const gId = uuidByString("g");

// NOTE: we can use top-level await because we are in a module
try {

  // await prisma.user.upsert({
  //   where: { id: trashId },
  //   update: {},
  //   create: {
  //     id: trashId,
  //     email: "chris@typehero.dev",
  //     name: "chris",
  //     challenge: challenges(),
  //   },
  // });

  // await prisma.user.upsert({
  //   where: { id: gId },
  //   update: {},
  //   create: {
  //     id: gId,
  //     email: "g@typehero.dev",
  //     name: "g",
  //     challenge: challenges(),
  //     solution: {
  //       create: {
  //         code: 'const a: string = "hello world"',
  //         isSuccessful: true,
  //         challengeId: 1,
  //       },
  //     },
  //     sharedSolution: {
  //       create: {
  //         challengeId: 1,
  //         title: faker.lorem.words(7),
  //         description: faker.lorem.words({ min: 5, max: 25 }),
  //       },
  //     },
  //   },
  // });

  await prisma.$disconnect();
} catch (e) {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
}
