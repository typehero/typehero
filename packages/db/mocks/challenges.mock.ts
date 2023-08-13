import url from 'node:url';
import { readdir, readFile, rm } from 'node:fs/promises';
import fs from 'node:fs';
import { resolve } from 'node:path';
import { parse } from 'yaml';
import { faker } from '@faker-js/faker';
import { simpleGit } from 'simple-git';
import { ChallengeStatus, type Difficulty, type Prisma } from '@prisma/client';
import { gId, trashId } from '../seed';

export interface InfoFile {
  title: string;
  author: {
    name: string;
    email: string;
    github: string;
  };
  tags: string;
  difficulty: 'easy' | 'extreme' | 'hard' | 'medium' | 'warm';
}

/**
 * @description clones the type-challenges repo and extracts our necessary data from them
 * @returns an array of data for the type challenges from the repo
 */
export async function loadChallengesFromTypeChallenge() {
  // Clone Repo
  const git = simpleGit();
  await git.clone('https://github.com/type-challenges/type-challenges.git', 'tmp/type-challenges');
  const QUESTIONS_PATH = './tmp/type-challenges/questions';
  const folders = await readdir(QUESTIONS_PATH, { withFileTypes: true }).then((f) =>
    f.filter((a) => a.isDirectory),
  );

  const arr: Omit<Prisma.ChallengeCreateManyInput, 'userId'>[] = [];

  for (const dir of folders) {
    const infoFile = resolve('./tmp/type-challenges/questions', dir.name, 'info.yml');
    const contents = await readFile(infoFile).then((r) => r.toString());
    const { title, difficulty } = parse(contents) as InfoFile;

    const README = await readFile(resolve(QUESTIONS_PATH, dir.name, 'README.md')).then((r) =>
      r.toString().replace(/<!--info-(header|footer)-start-->.*?<!--info-\1-end-->/g, ''),
    );

    const prompt = await readFile(resolve(QUESTIONS_PATH, dir.name, 'template.ts')).then((f) =>
      f.toString(),
    );

    const testData = await readFile(resolve(QUESTIONS_PATH, dir.name, 'test-cases.ts')).then((f) =>
      f
        .toString()
        .replace(/import .* from '@type-challenges\/utils';?/g, '')
        .trim(),
    );

    const [selfId] = dir.name.split('-');

    const idNum = Number(selfId);
    if (isNaN(idNum)) {
      console.info('Skipping ', dir.name, 'due to bad ID parse');
      continue;
    }

    arr.push({
      id: idNum,
      name: title,
      description: README,
      status: ChallengeStatus.ACTIVE,
      code: prompt,
      tests: testData,
      // prompt: `// TEST CASE START\n${testData}\n\n// CODE START\n${prompt}`,
      difficulty: difficulty === 'warm' ? 'BEGINNER' : (difficulty.toUpperCase() as Difficulty),
      shortDescription: README.slice(0, 100),
    });
  }

  // Cleanup
  await rm('./tmp', {
    recursive: true,
    force: true,
  });

  return arr;
}

/**
 * Load markdown file synchronously from the __seed__
 */
function loadChallengeSync(challengeSlug: string) {
  // read from the __seed__ folder all the markdown files
  const filePath = new URL(`../__seed__/${challengeSlug}.md`, import.meta.url);
  // return the file contents
  return fs.readFileSync(url.fileURLToPath(filePath), 'utf8');
}

export const CHALLENGE_MAP: Record<
  Difficulty,
  (v: number) => Prisma.ChallengeCreateWithoutUserInput
> = {
  BEGINNER: () => ({
    name: faker.hacker.phrase(),
    createdAt: faker.date.between({ from: '2022-01-01', to: new Date() }),
    updatedAt: faker.date.between({ from: '2023-05-01', to: new Date() }),
    bookmark: faker.datatype.boolean()
      ? {
          create: {
            userId: faker.datatype.boolean() ? trashId : gId,
          },
        }
      : undefined,
    description: loadChallengeSync('beginner/desc'),
    shortDescription: faker.lorem.lines({ min: 1, max: 2 }),
    tests: '',
    code: '',
    difficulty: 'BEGINNER',
  }),
  EASY: () => ({
    name: faker.hacker.phrase(),
    createdAt: faker.date.between({ from: '2022-01-01', to: new Date() }),
    updatedAt: faker.date.between({ from: '2023-05-01', to: new Date() }),
    description: loadChallengeSync('easy/desc'),
    shortDescription: faker.lorem.lines({ min: 1, max: 2 }),
    tests: loadChallengeSync('easy/prompt'),
    code: '',
    difficulty: 'EASY',
  }),
  MEDIUM: () => ({
    name: faker.hacker.phrase(),
    createdAt: faker.date.between({ from: '2022-01-01', to: new Date() }),
    updatedAt: faker.date.between({ from: '2023-05-01', to: new Date() }),
    description: loadChallengeSync('medium/desc'),
    shortDescription: faker.lorem.lines({ min: 1, max: 2 }),
    prompt: loadChallengeSync('medium/prompt'),
    tests: '',
    code: '',
    difficulty: 'MEDIUM',
  }),
  HARD: () => ({
    name: faker.hacker.phrase(),
    createdAt: faker.date.between({ from: '2022-01-01', to: new Date() }),
    updatedAt: faker.date.between({ from: '2023-05-01', to: new Date() }),
    description: loadChallengeSync('hard/desc'),
    shortDescription: faker.lorem.lines({ min: 1, max: 2 }),
    tests: loadChallengeSync('hard/prompt'),
    code: '',
    difficulty: 'HARD',
  }),
  EXTREME: () => ({
    name: faker.hacker.phrase(),
    createdAt: faker.date.between({ from: '2022-01-01', to: new Date() }),
    updatedAt: faker.date.between({ from: '2023-05-01', to: new Date() }),
    description: loadChallengeSync('extreme/desc'),
    shortDescription: faker.lorem.lines({ min: 1, max: 2 }),
    tests: '',
    code: '',
    difficulty: 'EXTREME',
  }),
};
