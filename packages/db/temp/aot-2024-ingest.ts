import { type Prisma } from '@prisma/client';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { rm } from 'node:fs/promises';
import path from 'node:path';
import { simpleGit } from 'simple-git';
import { prisma } from '../src';

const token = process.env.MY_PAT;
const repoOwner = 'dimitropoulos';
const repoName = 'advent-of-typescript-2024';
const repoUrl = `https://${token}:x-oauth-basic@github.com/${repoOwner}/${repoName}.git`;
const localDir = './.tmp/aot-2024';

async function loadChallengesFromRepo() {
  const git = simpleGit();
  await git.clone(repoUrl, localDir, ['--depth', '1']);

  const daysDir = path.join(localDir, 'days');

  if (!existsSync(daysDir)) {
    console.error(`The 'days' directory does not exist in the repository.`);
    return;
  }

  const challengesToCreate: (Prisma.ChallengeCreateManyInput & { author: string })[] = [];

  // Iterate through each subdirectory inside 'days'
  const dayDirectories = readdirSync(daysDir).filter((item) => {
    const itemPath = path.join(daysDir, item);
    return statSync(itemPath).isDirectory();
  });

  for (const dayDir of dayDirectories) {
    const dayPath = path.join(daysDir, dayDir);
    const challengeToCreate: Prisma.ChallengeCreateManyInput & { author: string } = {
      status: 'ACTIVE',
    } as Prisma.ChallengeCreateManyInput & { author: string };

    console.log(`\nContents of ${dayPath}:`);

    // List all files in each day subdirectory
    const files = readdirSync(dayPath);
    files.forEach((file) => {
      const filePath = path.join(dayPath, file);
      const fileName = path.parse(filePath).name;
      const fileContents = readFileSync(filePath, 'utf8');

      console.log(`- ${fileName}:`);
      console.log(fileContents);
      console.log('---');
      if (fileName === 'prompt') {
        challengeToCreate.description = fileContents;
      }
      if (fileName === 'start') {
        // replace the word export with nothing in fileContents
        challengeToCreate.code = fileContents.replace('export ', '');
      }
      if (fileName === 'test') {
        const filteredSolutionImport = fileContents
          .split('\n')
          .filter((line) => !line.includes('./solution'))
          .join('\n');
        challengeToCreate.tests = filteredSolutionImport;
      }
      if (fileName === 'metadata') {
        const jsonData = JSON.parse(fileContents);
        challengeToCreate.difficulty = jsonData.difficulty.toUpperCase();
        challengeToCreate.name = jsonData.label;
        challengeToCreate.slug = jsonData.id;
        challengeToCreate.shortDescription = jsonData.description;
        challengeToCreate.author = jsonData.author;
      }
      if (fileName === 'tsconfig') {
        const jsonData = JSON.parse(fileContents);
        console.log({ jsonData });
        if (jsonData.compilerOptions != null) {
          challengeToCreate.tsconfig = jsonData.compilerOptions;
        }
      }
    });
    challengesToCreate.push(challengeToCreate);
  }

  return challengesToCreate;
}

async function ingest() {
  try {
    const challengesToUpdateOrCreate = await loadChallengesFromRepo();

    if (!challengesToUpdateOrCreate) {
      console.error('No challenges to ingest.');
      return;
    }

    const transactions = [];
    for (const challenge of challengesToUpdateOrCreate) {
      const author = await prisma.user.findFirstOrThrow({
        where: {
          name: challenge.author,
        },
      });
      const { author: _, ...challengeWithoutAuthor } = challenge;
      transactions.push(
        prisma.challenge.upsert({
          where: {
            slug: challenge.slug,
          },
          update: {
            ...challengeWithoutAuthor,
            userId: author.id,
          },
          create: {
            ...challengeWithoutAuthor,
            userId: author.id,
          },
        }),
      );
    }

    await prisma.$transaction(transactions);

    await prisma.$disconnect();
  } catch (error) {
    console.error(error);
    await prisma.$disconnect();
  } finally {
    await rm('./.tmp', {
      recursive: true,
      force: true,
    });
  }
}

ingest();
