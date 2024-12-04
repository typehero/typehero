import { prisma } from '../src';

async function generateMockUsers() {
  const users = [];
  for (let i = 0; i < 200; i++) {
    users.push({
      name: `User ${i}`,
      email: `user${i}@example.com`,
    });
  }

  try {
    await prisma.user.createMany({ data: users });
    console.log('Generated 200 mock users');
  } catch {
    console.log('mock users already generated');
  }
}

function getRandomTimeAfterFive(day: number) {
  const date = new Date(`2024-01-${String(day).padStart(2, '0')}T06:00:00.000Z`);

  const maxAdditionalTime = 18 * 60 * 60 * 1000 - 1;
  const randomAdditionalTime = Math.floor(Math.random() * maxAdditionalTime);

  const randomTime = new Date(date.getTime() + randomAdditionalTime);
  return randomTime;
}

async function generateMockSubmissions() {
  const users = await prisma.user.findMany();
  const challenges = Array.from({ length: 25 }, (_, i) => i + 1);
  const submissions = [];

  for (const user of users) {
    for (const challengeId of challenges) {
      submissions.push({
        code: '',
        createdAt: getRandomTimeAfterFive(challengeId).toISOString(),
        isSuccessful: true,
        userId: user.id,
        challengeId,
      });
    }
  }

  await prisma.submission.createMany({ data: submissions });
  console.log('Generated random submissions for each user for each challenge');
}

try {
  await generateMockUsers();
  await generateMockSubmissions();
} catch (e) {
  console.error(e);
  process.exit(1);
} finally {
  await prisma.$disconnect();
}
