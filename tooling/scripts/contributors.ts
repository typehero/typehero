import 'dotenv/config';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Octokit } from 'octokit';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function getOcto() {
  if (!process.env.GITHUB_TOKEN) {
    console.error('No GitHub token provided. Please set GITHUB_TOKEN env var.');
    return [];
  }
  const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
  const response = await octokit.request('GET /repos/{owner}/{repo}/contributors', {
    owner: 'bautistaaa',
    repo: 'typehero',
  });
  // put all avatar urls in a list
  return response.data.map((contributor) => contributor);
}

async function start() {
  const contributors = await getOcto();

  const text = [
    `// prettier-ignore`,
    `// eslint-disable`,
    `export const contributors = ${JSON.stringify(contributors, null, 4)}`,
    ``,
  ].join('\n');

  const dir = path.join(__dirname, '../../../apps/web/public');
  await fs.writeFile(`${dir}/contributors.ts`, text);
}

start();
