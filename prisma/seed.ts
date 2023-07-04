import { type Difficulty, type Prisma, PrismaClient } from '@prisma/client';
import uuidByString from 'uuid-by-string';
import { CHALLENGE_MAP } from './challenges.mock';

const prisma = new PrismaClient();
const CHALLENGES_TO_CREATE = 50;
const DIFFICULTIES = ['BEGINNER', 'EASY', 'MEDIUM', 'HARD', 'EXTREME'];
const randomDifficulty = (): Difficulty => {
  return DIFFICULTIES[Math.floor(Math.random() * DIFFICULTIES.length)] as Difficulty;
};

// TODO: make this deterministic as the seed should always have the same difficulty 
const challenges = (): Prisma.ChallengeCreateNestedManyWithoutUserInput => ({
  create: Array.from({ length: CHALLENGES_TO_CREATE }, (_, challengeIndex) =>
    CHALLENGE_MAP[randomDifficulty()](challengeIndex),
  ),
});

export const trashId = uuidByString('trash');
export const gId = uuidByString('g');
async function main() {
  await prisma.user.upsert({
    where: { id: trashId },
    update: {},
    create: {
      id: trashId,
      email: 'chris@typehero.dev',
      name: 'chris',
      Challenge: challenges(),
    },
  });
  await prisma.user.upsert({
    where: { id: gId },
    update: {},
    create: {
      id: gId,
      email: 'g@typehero.dev',
      name: 'g',
      Challenge: challenges(),
    },
  });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
