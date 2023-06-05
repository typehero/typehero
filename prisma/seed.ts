import { PrismaClient } from '@prisma/client';
import uuidByString from 'uuid-by-string';

const prisma = new PrismaClient();
async function main() {
  const trashId = uuidByString('trash');
  await prisma.user.upsert({
    where: { id: trashId },
    update: {},
    create: {
      email: 'chris@typehero.dev',
      name: 'chris',
      Challenge: {
        create: {
          createdAt: new Date(),
          updatedAt: new Date(),
          name: "chris's first challenge",
          prompt: `Extends<HelloWorld, \`Hello, \${string}\`>()

Extends<HelloWorld, \`\${string}!\`>()

type HelloWorld =`,
          difficulty: 'EASY',
          upvotes: 69,
        },
      },
    },
  });
  const gId = uuidByString('g');
  await prisma.user.upsert({
    where: { id: gId },
    update: {},
    create: {
      email: 'g@typehero.dev',
      name: 'g',
      Challenge: {
        create: {
          createdAt: new Date(),
          updatedAt: new Date(),
          name: "g's first challenge",
          prompt: `Equal<T, 1>();

type T =`,
          difficulty: 'EASY',
          upvotes: 420,
        },
      },
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
