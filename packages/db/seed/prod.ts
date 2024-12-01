// if you want a similar db to what prod looks like.
// this should never be run on prod directly
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import uuidByString from 'uuid-by-string';
import { prisma } from '../src';
import { ingestChallenges } from './data/challenge-ingest';
import { loadChallengesFromTypeChallenge } from '../mocks/challenges.mock';
import { tracks } from './data/tracks';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const challengePath = path.join(__dirname, '../../../challenges');

const slugify = (str: string) => str.toLowerCase().replace(/\s/g, '-');
const TYPE_CHALLENGE_ID = uuidByString('type-challenges');
const TYPEHERO_ID = uuidByString('typehero');

try {
  const typeHeroUser = await prisma.user.upsert({
    where: { id: TYPEHERO_ID },
    update: {},
    create: {
      id: TYPEHERO_ID,
      email: 'typeherapp@gmail.com',
      name: 'TypeHero',
      userLinks: {
        create: {
          url: 'https://typehero.dev',
        },
      },
    },
  });
  const typeChallengeUser = await prisma.user.upsert({
    where: { id: TYPE_CHALLENGE_ID },
    update: {},
    create: {
      id: TYPE_CHALLENGE_ID,
      email: 'fake@email.com',
      name: 'type-challenges',
      userLinks: {
        create: {
          url: 'https://tsch.js.org/',
        },
      },
    },
  });

  const challengesFromTypeChallenges = await loadChallengesFromTypeChallenge(true);
  const challengesToCreate = await ingestChallenges(challengePath);
  await prisma.challenge.createMany({
    data: challengesFromTypeChallenges.map((challenge) => ({
      ...challenge,
      userId: typeChallengeUser.id,
    })),
  });
  await prisma.challenge.createMany({
    data: challengesToCreate.map(({ author: _author, ...challenge }) => ({
      ...challenge,
      userId: typeHeroUser.id,
    })),
  });

  for (const track of tracks) {
    const createdTrack = await prisma.track.create({
      data: {
        name: track.name,
        slug: slugify(track.name),
        description: track.description,
        visible: true,
        isComingSoon: track.name !== 'TypeScript Foundations',
      },
    });

    if (track.name === 'Advent of TypeScript 2023') {
      const challengesForTrack = await prisma.challenge.findMany({
        where: {
          slug: {
            in: [
              '2023-1',
              '2023-2',
              '2023-3',
              '2023-4',
              '2023-5',
              '2023-6',
              '2023-7',
              '2023-8',
              '2023-9',
              '2023-10',
              '2023-11',
              '2023-12',
              '2023-13',
              '2023-14',
              '2023-15',
              '2023-16',
              '2023-17',
              '2023-18',
              '2023-19',
              '2023-20',
              '2023-21',
              '2023-22',
              '2023-23',
              '2023-24',
              '2023-25',
            ],
          },
        },
      });
      await prisma.trackChallenge.createMany({
        data: challengesForTrack.map((challenge, index) => ({
          challengeId: challenge.id,
          trackId: createdTrack.id,
          orderId: index,
        })),
      });
    }

    if (track.name === 'Advent of TypeScript 2024') {
      const challengesForTrack = await prisma.challenge.findMany({
        where: {
          slug: {
            in: [
              '2024-1',
              '2024-2',
              '2024-3',
              '2024-4',
              '2024-5',
              '2024-6',
              '2024-7',
              '2024-8',
              '2024-9',
              '2024-10',
              '2024-11',
              '2024-12',
              '2024-13',
              '2024-14',
              '2024-15',
              '2024-16',
              '2024-17',
              '2024-18',
              '2024-19',
              '2024-20',
              '2024-21',
              '2024-22',
              '2024-23',
              '2024-24',
              '2024-25',
            ],
          },
        },
      });
      await prisma.trackChallenge.createMany({
        data: challengesForTrack.map((challenge, index) => ({
          challengeId: challenge.id,
          trackId: createdTrack.id,
          orderId: index,
        })),
      });
    }

    if (track.name === 'TypeScript Foundations') {
      const challengesForTrack = await prisma.challenge.findMany({
        where: {
          slug: {
            in: [
              'generic-function-arguments',
              'generic-type-arguments',
              'generic-type-constraints',
              'index-signatures',
              'indexed-types',
              'keyof',
              'literal-types',
              'mapped-object-types',
              'primitive-data-types',
              'type-aliases',
              'type-unions',
              'typeof',
            ],
          },
        },
      });
      await prisma.trackChallenge.createMany({
        data: challengesForTrack.map((challenge, index) => ({
          challengeId: challenge.id,
          trackId: createdTrack.id,
          orderId: index,
        })),
      });
    }
  }

  await prisma.$disconnect();
} catch (e) {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
}
