import { Difficulty, Prisma, PrismaClient } from '@prisma/client';
import uuidByString from 'uuid-by-string';

const prisma = new PrismaClient();
const CHALLENGES_TO_CREATE = 50;
const DIFFICULTIES = ['BEGINNER', 'EASY', 'MEDIUM', 'HARD', 'EXTREME'];
const randomDifficulty = (): Difficulty => {
  return DIFFICULTIES[Math.floor(Math.random() * DIFFICULTIES.length)] as Difficulty;
};

const challenges = (who: string): Prisma.ChallengeCreateNestedManyWithoutUserInput => ({
  create: Array.from({ length: CHALLENGES_TO_CREATE }, (_, challengeIndex) => ({
    name: `Challenge ${challengeIndex + 1}`,
    createdAt: new Date(),
    updatedAt: new Date(),
    description: `### ${who} is a cool guy
          - he likes to eat ${who}
          - he likes to sleep in ${who}
          - he likes to be ${who}
          `,
    prompt: `/* _____________ Test Cases _____________ */
Extends<HelloWorld, \`Hello, \${string}\`>()

Extends<HelloWorld, \`\${string}!\`>()

/* _____________ Your Code Here _____________ */
type HelloWorld =`,
    difficulty: randomDifficulty(),
  })),
});

async function main() {
  const trashId = uuidByString('trash');
  await prisma.user.upsert({
    where: { id: trashId },
    update: {},
    create: {
      id: trashId,
      email: 'chris@typehero.dev',
      name: 'chris',
      Challenge: challenges('trash'),
    },
  });
  const gId = uuidByString('g');
  await prisma.user.upsert({
    where: { id: gId },
    update: {},
    create: {
      id: gId,
      email: 'g@typehero.dev',
      name: 'g',
      Challenge: challenges('g'),
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
