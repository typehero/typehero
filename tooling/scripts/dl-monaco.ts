import url from 'node:url';
import fs from 'node:fs/promises';
import path from 'node:path';
import fetch from 'node-fetch';

/** @link https://typescript.azureedge.net/indexes/releases.json */
const TYPESCRIPT_VERSION = '5.1.6';

/** @link https://github.com/microsoft/TypeScript-Make-Monaco-Builds */
const TS_CDN_BASE_URL = `https://typescript.azureedge.net/cdn/${TYPESCRIPT_VERSION}/monaco`;

async function fetchFile({
  url,
  options,
  retries,
}: {
  url: URL;
  options?: object;
  retries: number;
}): Promise<Response> {
  const fileResponse = await fetch(url, options);

  if (!fileResponse.ok && retries > 0) {
    const persistentRetryValue = retries - 1;
    return fetchFile({ url, options, retries: persistentRetryValue });
  }

  // @ts-expect-error Dunno why but it runs so who cares.
  return fileResponse;
}

async function downloadAndSaveFile([remoteUrl, diskPath, appendToStart = '']: readonly [
  remoteUrl: string,
  diskPath: string,
  appendToStart?: string,
]) {
  const textToWrite = await (
    await fetchFile({
      url: new URL(TS_CDN_BASE_URL + remoteUrl),
      retries: 5,
    })
  ).text();

  const pathToSave = url.fileURLToPath(path.join(import.meta.url, '../../../apps/web', diskPath));
  const dir = path.join(pathToSave, '../');
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(pathToSave, `${appendToStart}\n${textToWrite}`, {});
}

const files = [
  [
    '/esm/vs/editor/editor.api.d.ts',
    './monaco-editor.d.ts',
    `// GENERATED WITH TS: ${TYPESCRIPT_VERSION}\n`,
  ],
  ['/min/vs/loader.js', './public/vs/loader.js'],
  ['/min/vs/editor/editor.main.js', './public/vs/editor/editor.main.js'],
  ['/min/vs/editor/editor.main.css', './public/vs/editor/editor.main.css'],
  ['/min/vs/editor/editor.main.nls.js', './public/vs/editor/editor.main.nls.js'],
  [
    '/min/vs/basic-languages/typescript/typescript.js',
    './public/vs/basic-languages/typescript/typescript.js',
  ],
  ['/min/vs/language/typescript/tsMode.js', './public/vs/language/typescript/tsMode.js'],
  ['/min/vs/base/worker/workerMain.js', './public/vs/base/worker/workerMain.js'],
  [
    '/min/vs/base/common/worker/simpleWorker.nls.js',
    './public/vs/base/common/worker/simpleWorker.nls.js',
  ],
  ['/min/vs/language/typescript/tsWorker.js', './public/vs/language/typescript/tsWorker.js'],
  [
    '/min/vs/base/common/worker/simpleWorker.nls.js',
    './public/vs/base/common/worker/simpleWorker.nls.js',
  ],
  [
    './vs/base/browser/ui/codicons/codicon/codicon.ttf',
    './public/vs/base/browser/ui/codicons/codicon/codicon.ttf',
  ],
] as const;

async function isTSversionCorrect(path: string) {
  try {
    const f = await fs.open(path, 'r');

    const fileReadBuffer = (await f.read({ length: files[0][2].length })).buffer;
    await f.close();

    return fileReadBuffer.toString().startsWith(files[0][2]);
  } catch {
    return false;
  }
}

// check if the force flag is present
const force = process.argv.includes('--force');

// get the path to the root monaco-editor.d.ts file
const dTSPath = url.fileURLToPath(path.join(import.meta.url, '../../', files[0][1]));

// is the version existing && correct
const isCorrectVersionInstalled = await isTSversionCorrect(dTSPath);

if (force || !isCorrectVersionInstalled) {
  if (force) {
    console.log(`🚨 Using force overwrites public/vs and monaco-editor.d.ts`);
  }
  console.log(`🌍 Downloading monaco-editor with typescript: ${TYPESCRIPT_VERSION}`);
  await Promise.all(files.map(downloadAndSaveFile));
  process.exit(0);
}

console.log(`✅ monaco-editor with typescript: ${TYPESCRIPT_VERSION} already installed`);
