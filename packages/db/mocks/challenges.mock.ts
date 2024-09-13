import { ChallengeStatus, type Difficulty, type Prisma } from '@prisma/client';
import { readdir, readFile, rm } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { simpleGit } from 'simple-git';
import { parse } from 'yaml';
import type { CompilerOptions } from 'typescript';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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
  tsconfig?: CompilerOptions;
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
    const { title, difficulty, author, tsconfig } = parse(contents) as InfoFile;

    const README = await readFile(resolve(QUESTIONS_PATH, dir.name, 'README.md')).then((r) =>
      r.toString().replace(/<!--info-(header|footer)-start-->.*?<!--info-\1-end-->/g, ''),
    );

    const descriptionWithCredit = `${README}${creditLine(author.github)}`;

    const [selfId] = dir.name.split('-');

    const idNum = Number(selfId);
    if (isNaN(idNum)) {
      console.info('Skipping ', dir.name, 'due to bad ID parse');
      continue;
    }

    const prompt = await readFile(resolve(QUESTIONS_PATH, dir.name, 'template.ts')).then((f) =>
      f.toString(),
    );

    // Check if we have an override for the tests
    const overridePath = resolve(__dirname, 'test-overrides', `${idNum}.ts`);
    const testFilePath = existsSync(overridePath)
      ? overridePath
      : resolve(QUESTIONS_PATH, dir.name, 'test-cases.ts');

    const testData = await readFile(testFilePath).then((f) => f.toString().trim());

    const slug = slugify(title);

    if ((isProd && !redundantChallenges.includes(slug)) || !isProd) {
      arr.push({
        ...(isProd ? {} : { id: idNum }),
        name: title,
        slug,
        description: descriptionWithCredit,
        status: ChallengeStatus.ACTIVE,
        code: prompt,
        tests: testData,
        difficulty: difficulty === 'warm' ? 'BEGINNER' : (difficulty.toUpperCase() as Difficulty),
        shortDescription: README.slice(0, 100),
        ...(tsconfig != null && { tsconfig: tsconfig as Prisma.InputJsonValue }),
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
