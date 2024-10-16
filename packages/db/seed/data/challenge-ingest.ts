import { type Prisma } from '@prisma/client';
import fs from 'node:fs';
import path from 'node:path';

const defaultExcludes = ['blank', 'solutions', 'aot'];

export async function ingestChallenges(
  challengePath: string,
  excludes = defaultExcludes,
): Promise<(Prisma.ChallengeCreateManyInput & { author: string })[]> {
  const challengesToCreate: (Prisma.ChallengeCreateManyInput & { author: string })[] = [];

  try {
    const items = await fs.promises.readdir(challengePath);

    for (const item of items) {
      const itemPath = path.join(challengePath, item);

      // Skip items that are excluded.
      if (excludes.some((x) => itemPath.includes(x))) {
        console.log('Skipping:', itemPath);
        continue;
      }

      const stats = await fs.promises.stat(itemPath);

      if (stats.isDirectory()) {
        // Recursively ingest challenges from subdirectories.
        const nestedChallenges = await ingestChallenges(itemPath, excludes);
        challengesToCreate.push(...nestedChallenges);
      } else if (stats.isFile()) {
        // Process individual files as part of a challenge.
        const challengeToCreate = await buildChallenge(challengePath, excludes);
        // only valid challenges will have a slug
        if (challengeToCreate?.slug) {
          challengesToCreate.push(challengeToCreate);
        }
        break; // Exit after processing files for a challenge.
      }
    }
  } catch (error) {
    console.error('Error:', error);
  }

  return challengesToCreate;
}

async function buildChallenge(
  pathToDirectory: string,
  excludes: string[],
): Promise<(Prisma.ChallengeCreateManyInput & { author: string }) | null> {
  const challengeToCreate: Prisma.ChallengeCreateManyInput & { author: string } = {
    status: 'ACTIVE',
  } as Prisma.ChallengeCreateManyInput & { author: string };

  try {
    const files = await fs.promises.readdir(pathToDirectory);
    console.log(files);

    for (const file of files) {
      const itemPath = path.join(pathToDirectory, file);
      console.log('buildChallenge Processing:', itemPath);

      // Skip excluded files.
      if (excludes.some((x) => itemPath.includes(x))) {
        console.log('Skipping:', itemPath);
        continue;
      }

      const stats = await fs.promises.stat(itemPath);

      if (stats.isFile()) {
        const fileName = path.parse(itemPath).name;

        try {
          const fileContents = await fs.promises.readFile(itemPath, 'utf8');
          if (fileName === 'prompt') {
            challengeToCreate.description = fileContents;
          }
          if (fileName === 'user') {
            challengeToCreate.code = fileContents;
          }
          if (fileName === 'tests') {
            challengeToCreate.tests = fileContents;
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
            if (jsonData.compilerOptions != null) {
              challengeToCreate.tsconfig = jsonData.compilerOptions;
            }
          }
        } catch (jsonError) {
          console.error(`Error reading or parsing ${fileName}:`, jsonError);
        }
      }
    }
    return challengeToCreate;
  } catch (error) {
    console.error('Error reading directory:', error);
    return null;
  }
}
