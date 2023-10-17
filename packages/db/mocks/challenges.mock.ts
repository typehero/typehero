import { ChallengeStatus, type Difficulty, type Prisma } from '@prisma/client';
import { readdir, readFile, rm } from 'node:fs/promises';
import { resolve } from 'node:path';
import { simpleGit } from 'simple-git';
import { parse } from 'yaml';

const slugify = (str: string) => str.toLowerCase().replace(/\s/g, '-');
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
      slug: slugify(title),
      description: README,
      status: ChallengeStatus.ACTIVE,
      code: prompt,
      tests: testData,
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
