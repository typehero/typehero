import { ChallengeStatus, type Difficulty } from '@prisma/client';
import { gId, trashId } from './seed';
import url from 'url';
import { parse } from 'yaml';
import { readdir, readFile, rm } from 'fs/promises';
import fs from 'fs';
import { faker } from '@faker-js/faker';
import { simpleGit } from 'simple-git';
import { resolve } from 'path';

export type InfoFile = {
  title: string;
  author: {
    name: string;
    email: string;
    github: string;
  };
  difficulty: 'easy' | 'medium' | 'warm' | 'hard' | 'extreme';
  // tags: string;
  tagtypes: 'generics' | 'unions' | 'transformations'
};

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

  const arr = [];
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
      status: Math.floor(Math.random() * 2) > 0 ? ChallengeStatus.PENDING : ChallengeStatus.ACTIVE,
      prompt: `// TEST CASE START\n${testData}\n\n// CODE START\n${prompt}`,
      difficulty: difficulty === 'warm' ? 'BEGINNER' : (difficulty.toUpperCase() as Difficulty),
      shortDescription: README.slice(0, 100),
      tagtypes: 'GENERICS',
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
};
