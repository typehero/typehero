import { type Prisma } from '@prisma/client';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const challengePath = path.join(__dirname, '../../../challenges');

export async function ingestChallenges(challengePath: string) {
  const challengesToCreate: Prisma.ChallengeCreateManyInput[] = [];
  try {
    const items = await fs.promises.readdir(challengePath);
    console.log('Items:', items);

    for (const item of items) {
      const itemPath = path.join(challengePath, item);

      if (itemPath.includes('blank') || itemPath.includes('solutions')) {
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
  const challengeToCreate: Prisma.ChallengeCreateManyInput = {
    status: 'ACTIVE',
  } as Prisma.ChallengeCreateManyInput;

  const files = await fs.promises.readdir(pathToDirectory);

  for (const file of files) {
    const itemPath = path.join(pathToDirectory, file);

    if (itemPath.includes('blank') || itemPath.includes('solutions')) {
      continue;
    }

    const stats = await fs.promises.stat(itemPath);

    if (stats.isDirectory()) {
      // await ingestChallenges(itemPath, userId);
    } else if (stats.isFile()) {
      const fileExtension = path.extname(itemPath);
      const fileName = path.parse(itemPath).name;

      if (fileName === 'prompt') {
        try {
          const fileContents = await fs.promises.readFile(itemPath, 'utf8');
          challengeToCreate.description = fileContents;
          challengeToCreate.shortDescription = fileContents.slice(0, 100);
          // console.log('Parsed ts:', fileContents);
        } catch (jsonError) {
          console.error('Error parsing JSON:', jsonError);
        }
      }
      if (fileName === 'user') {
        try {
          const fileContents = await fs.promises.readFile(itemPath, 'utf8');
          challengeToCreate.code = fileContents;
          // console.log('Parsed ts:', fileContents);
        } catch (jsonError) {
          console.error('Error parsing JSON:', jsonError);
        }
      }
      if (fileName === 'tests') {
        try {
          const fileContents = await fs.promises.readFile(itemPath, 'utf8');
          challengeToCreate.tests = fileContents;
          // console.log('Parsed ts:', fileContents);
        } catch (jsonError) {
          console.error('Error parsing JSON:', jsonError);
        }
      }
      if (fileName === 'metadata') {
        try {
          const fileContents = await fs.promises.readFile(itemPath, 'utf8');
          const jsonData = JSON.parse(fileContents);
          challengeToCreate.difficulty = jsonData.difficulty.toUpperCase();
          challengeToCreate.name = hyphenatedToPascalCase(jsonData.id);
          challengeToCreate.slug = jsonData.id;
          // console.log('Parsed JSON:', jsonData);
        } catch (jsonError) {
          console.error('Error parsing JSON:', jsonError);
        }
      }
      const isWithinSolutionsDirectory = challengePath.split('/').at(-1) === 'solutions';

      if (isWithinSolutionsDirectory) {
        if (fileExtension === '.ts') {
          try {
            const fileContents = await fs.promises.readFile(itemPath, 'utf8');
            // console.log('Parsed ts:', fileContents);
          } catch (jsonError) {
            console.error('Error parsing JSON:', jsonError);
          }
        }
      } else {
        // console.log(`File: ${itemPath} (Extension: ${fileExtension})`);
      }
    }
  }

  return challengeToCreate;
}

function hyphenatedToPascalCase(input: string): string {
  const words = input.split('-');
  const pascalWords = words.map((word) => word.charAt(0).toUpperCase() + word.slice(1));
  return pascalWords.join(' ');
}
