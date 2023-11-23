import { ChallengeStatus, type Difficulty, type Prisma } from '@prisma/client';
import { readdir, readFile, rm } from 'node:fs/promises';
import { resolve } from 'node:path';
import { simpleGit } from 'simple-git';
import { parse } from 'yaml';

const slugify = (str: string) => str.toLowerCase().replace(/\s/g, '-').replace(/\./g, '-');
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

const redundantChallenges = ['pick', 'flatten'];

const creditLine = (author: string) =>
  `\n\n\nThis challenge was ported from [Type Challenges](https://tsch.js.org/) and was authored by [${author}](https://www.github.com/${author})`;

/**
 * @description clones the type-challenges repo and extracts our necessary data from them
 * @returns an array of data for the type challenges from the repo
 */
export async function loadChallengesFromTypeChallenge(isProd = false) {
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
    const { title, difficulty, author } = parse(contents) as InfoFile;

    const README = await readFile(resolve(QUESTIONS_PATH, dir.name, 'README.md')).then((r) =>
      r.toString().replace(/<!--info-(header|footer)-start-->.*?<!--info-\1-end-->/g, ''),
    );

    const descriptionWithCredit = `${README}${creditLine(author.github)}`;

    const prompt = await readFile(resolve(QUESTIONS_PATH, dir.name, 'template.ts')).then((f) =>
      f.toString(),
    );

    const testData = await readFile(resolve(QUESTIONS_PATH, dir.name, 'test-cases.ts')).then((f) =>
      f.toString().trim(),
    );

    const [selfId] = dir.name.split('-');

    const idNum = Number(selfId);
    if (isNaN(idNum)) {
      console.info('Skipping ', dir.name, 'due to bad ID parse');
      continue;
    }

    if ((isProd && !redundantChallenges.includes(title.toLowerCase())) || !isProd) {
      arr.push({
        ...(isProd ? {} : { id: idNum }),
        name: title,
        slug: slugify(title),
        description: descriptionWithCredit,
        status: ChallengeStatus.ACTIVE,
        code: prompt,
        tests: testData,
        difficulty: difficulty === 'warm' ? 'BEGINNER' : (difficulty.toUpperCase() as Difficulty),
        shortDescription: README.slice(0, 100),
      });
    }
  }

  // Cleanup
  await rm('./tmp', {
    recursive: true,
    force: true,
  });

  return arr;
}
