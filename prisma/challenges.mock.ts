import type { Difficulty, Prisma } from '@prisma/client';
import { gId, trashId } from './seed';

import fs from 'fs';
import path from 'path';

function randomTrueOrFalse() {
  return Math.random() > 0.5;
}

/**
 * Load markdown file synchronously from the __seed__
 */
function loadChallenegeSync(challengeSlug: string) {
  // read from the __seed__ folder all the markdown files
  const dirname = path.dirname(new URL(import.meta.url).pathname);
  const filePath = path.join(dirname, `../__seed__/${challengeSlug}.md`);
  return fs.readFileSync(filePath, 'utf8');
}

const shortDescription = `This is a typescript challenge short description area in which we can place text.

  In this challenge you will learn how to do something or at the least you learn how to use \`any\``;

export const CHALLENGE_MAP: Record<
  Difficulty,
  (v: number) => Prisma.ChallengeCreateWithoutUserInput
> = {
  BEGINNER: (challengeIndex: number) => ({
    name: `Beginner Challenge ${challengeIndex + 1}`,
    createdAt: new Date(),
    updatedAt: new Date(),
    Bookmark: randomTrueOrFalse()
      ? {
          create: {
            userId: randomTrueOrFalse() ? trashId : gId,
          },
        }
      : undefined,
    description: loadChallenegeSync('beginner/desc'),
    shortDescription,
    prompt: loadChallenegeSync('beginner/prompt'),
    difficulty: 'BEGINNER',
  }),
  EASY: (challengeIndex: number) => ({
    name: `Easy Challenge ${challengeIndex + 1}`,
    createdAt: new Date(),
    updatedAt: new Date(),
    description: loadChallenegeSync('easy/desc'),
    shortDescription,
    prompt: loadChallenegeSync('easy/prompt'),
    difficulty: 'EASY',
  }),
  MEDIUM: (challengeIndex: number) => ({
    name: `Medium Challenge ${challengeIndex + 1}`,
    createdAt: new Date(),
    updatedAt: new Date(),
    description: loadChallenegeSync('medium/desc'),
    shortDescription,
    prompt: loadChallenegeSync('medium/prompt'),
    difficulty: 'MEDIUM',
  }),
  HARD: (challengeIndex: number) => ({
    name: `Hard Challenge ${challengeIndex + 1}`,
    createdAt: new Date(),
    updatedAt: new Date(),
    description: loadChallenegeSync('hard/desc'),
    shortDescription,
    prompt: loadChallenegeSync('hard/prompt'),
    difficulty: 'HARD',
  }),
  EXTREME: (challengeIndex: number) => ({
    name: `Extreme Challenge ${challengeIndex + 1}`,
    createdAt: new Date(),
    updatedAt: new Date(),
    description: loadChallenegeSync('extreme/desc'),
    shortDescription,
    prompt: loadChallenegeSync('extreme/prompt'),
    difficulty: 'EXTREME',
  }),
};
