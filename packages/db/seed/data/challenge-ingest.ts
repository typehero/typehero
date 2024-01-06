import { type Prisma } from '@prisma/client';
import fs from 'node:fs';
import path from 'node:path';

export async function ingestChallenges(challengePath: string) {
  const challengesToCreate: (Prisma.ChallengeCreateManyInput & { author: string })[] = [];
  try {
    const items = await fs.promises.readdir(challengePath);

    for (const item of items) {
      const itemPath = path.join(challengePath, item);

      if (
        itemPath.includes('blank') ||
        itemPath.includes('solutions')
        // itemPath.includes('aot')
      ) {
        continue;
      }

      const stats = await fs.promises.stat(itemPath);

      if (stats.isDirectory()) {
        const challengeToCreate = await buildChallenge(itemPath);
        challengesToCreate.push(challengeToCreate);
      }
    }
  } catch (error) {
    console.error('Error:', error);
  }

  return challengesToCreate;
}

async function buildChallenge(pathToDirectory: string) {
  const challengeToCreate: Prisma.ChallengeCreateManyInput & { author: string } = {
    status: 'ACTIVE',
  } as Prisma.ChallengeCreateManyInput & { author: string };

  const files = await fs.promises.readdir(pathToDirectory);

  for (const file of files) {
    const itemPath = path.join(pathToDirectory, file);

    if (itemPath.includes('blank') || itemPath.includes('solutions')) {
      continue;
    }

    const stats = await fs.promises.stat(itemPath);

    if (stats.isFile()) {
      const fileName = path.parse(itemPath).name;

      if (fileName === 'prompt') {
        try {
          const fileContents = await fs.promises.readFile(itemPath, 'utf8');
          challengeToCreate.description = fileContents;
        } catch (jsonError) {
          console.error('Error parsing JSON:', jsonError);
        }
      }
      if (fileName === 'user') {
        try {
          const fileContents = await fs.promises.readFile(itemPath, 'utf8');
          challengeToCreate.code = fileContents;
        } catch (jsonError) {
          console.error('Error parsing JSON:', jsonError);
        }
      }
      if (fileName === 'tests') {
        try {
          const fileContents = await fs.promises.readFile(itemPath, 'utf8');
          challengeToCreate.tests = fileContents;
        } catch (jsonError) {
          console.error('Error parsing JSON:', jsonError);
        }
      }
      if (fileName === 'metadata') {
        try {
          const fileContents = await fs.promises.readFile(itemPath, 'utf8');
          const jsonData = JSON.parse(fileContents);
          challengeToCreate.difficulty = jsonData.difficulty.toUpperCase();
          challengeToCreate.name = jsonData.label;
          challengeToCreate.slug = jsonData.id;
          challengeToCreate.shortDescription = jsonData.description;
          challengeToCreate.author = jsonData.author;
        } catch (jsonError) {
          console.error('Error parsing JSON:', jsonError);
        }
      }
      if (fileName === 'tsconfig') {
        try {
          const fileContents = await fs.promises.readFile(itemPath, 'utf8');
          const jsonData = JSON.parse(fileContents);
          if (jsonData.compilerOptions != null) {
            challengeToCreate.tsconfig = jsonData.compilerOptions;
          }
        } catch (jsonError) {
          console.error('Error parsing JSON:', jsonError);
        }
      }
      // @TODO: we'll ingest solutions later
      // const isWithinSolutionsDirectory = challengePath.split('/').at(-1) === 'solutions';
      //
      // if (isWithinSolutionsDirectory) {
      //   if (fileExtension === '.ts') {
      //     try {
      //       const fileContents = await fs.promises.readFile(itemPath, 'utf8');
      //       // console.log('Parsed ts:', fileContents);
      //     } catch (jsonError) {
      //       console.error('Error parsing JSON:', jsonError);
      //     }
      //   }
      // } else {
      //   // console.log(`File: ${itemPath} (Extension: ${fileExtension})`);
      // }
    }
  }

  return challengeToCreate;
}

function hyphenatedToPascalCase(input: string): string {
  const words = input.split('-');
  const pascalWords = words.map((word) => word.charAt(0).toUpperCase() + word.slice(1));
  return pascalWords.join(' ');
}
