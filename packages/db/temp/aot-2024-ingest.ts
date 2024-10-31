import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { rm } from 'node:fs/promises';
import path from 'node:path';
import { simpleGit } from 'simple-git';

const token = process.env.MY_PAT;
const repoOwner = 'dimitropoulos';
const repoName = 'advent-of-typescript-2024';
const repoUrl = `https://${token}:x-oauth-basic@github.com/${repoOwner}/${repoName}.git`;
const localDir = './.tmp/aot-2024';

export async function loadChallengesFromRepo() {
  const git = simpleGit();
  await git.clone(repoUrl, localDir, ['--depth', '1']);

  const daysDir = path.join(localDir, 'days');

  if (!existsSync(daysDir)) {
    console.error(`The 'days' directory does not exist in the repository.`);
    return;
  }

  // Iterate through each subdirectory inside 'days'
  const dayDirectories = readdirSync(daysDir).filter((item) => {
    const itemPath = path.join(daysDir, item);
    return statSync(itemPath).isDirectory();
  });

  for (const dayDir of dayDirectories) {
    const dayPath = path.join(daysDir, dayDir);
    console.log(`\nContents of ${dayPath}:`);

    // List all files in each day subdirectory
    const files = readdirSync(dayPath);
    files.forEach((file) => {
      const filePath = path.join(dayPath, file);
      const fileContent = readFileSync(filePath, 'utf8');
      console.log(`- ${file}:`);
      console.log(fileContent);
      console.log('---');
    });
  }

  // Cleanup
  await rm('./.tmp', {
    recursive: true,
    force: true,
  });
}

loadChallengesFromRepo();
