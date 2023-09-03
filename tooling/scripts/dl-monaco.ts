import url from 'node:url';
import fs from 'node:fs/promises';
import path from 'node:path';
import fetch from 'node-fetch';

/** @link https://typescript.azureedge.net/indexes/releases.json */
const TYPESCRIPT_VERSION = '5.2.2';

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

async function downloadAndSaveFile([remoteUrl, diskPath = remoteUrl, appendToStart]: readonly [
  remoteUrl: string,
  diskPath?: string,
  appendToStart?: (dl: string) => string,
]) {
  const textToWrite = await (
    await fetchFile({
      url: new URL(TS_CDN_BASE_URL + remoteUrl),
      retries: 5,
    })
  ).text();

  const pathToSave = url.fileURLToPath(
    path.join(import.meta.url, '../../../apps/web/public', diskPath),
  );
  const dir = path.join(pathToSave, '../');
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(pathToSave, appendToStart?.(textToWrite) ?? textToWrite, {});
}

const files = [
  [
    '/esm/vs/editor/editor.api.d.ts',
    '../../../packages/monaco/monaco-editor.d.ts',
    (file) => {
      // removes the global scope modifications since they need to be changed
      const module = file.slice(837);

      // adds back the global modifications
      return `// GENERATED WITH TS: ${TYPESCRIPT_VERSION}
/*!-----------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Type definitions for monaco-editor
 * Released under the MIT license
*-----------------------------------------------------------*/
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
${/* needs to import from monaco-editor to access the Environment type */ ''}
declare let MonacoEnvironment: import("monaco-editor").Environment | undefined;


interface Window {
    MonacoEnvironment?: import("monaco-editor").Environment | undefined;
}

declare module "monaco-editor" {
${module}
}
`;
    },
  ],

  ['/min/vs/loader.js'],
  ['/min-maps/vs/loader.js.map'],

  ['/min/vs/editor/editor.main.js'],
  ['/min-maps/vs/editor/editor.main.js.map'],

  ['/min/vs/editor/editor.main.css'],

  ['/min/vs/editor/editor.main.nls.js'],
  ['/min-maps/vs/editor/editor.main.nls.js.map'],

  ['/min/vs/basic-languages/typescript/typescript.js'],
  ['/min-maps/vs/basic-languages/typescript/typescript.js.map'],

  ['/min/vs/language/typescript/tsMode.js'],
  ['/min-maps/vs/language/typescript/tsMode.js.map'],

  ['/min/vs/base/worker/workerMain.js'],
  ['/min-maps/vs/base/worker/workerMain.js.map'],

  ['/min/vs/base/common/worker/simpleWorker.nls.js'],
  ['/min-maps/vs/base/common/worker/simpleWorker.nls.js.map'],

  ['/min/vs/language/typescript/tsWorker.js'],
  ['/min-maps/vs/language/typescript/tsWorker.js.map'],

  ['/min/vs/base/common/worker/simpleWorker.nls.js'],
  ['/min-maps/vs/base/common/worker/simpleWorker.nls.js.map'],

  ['/min/vs/base/browser/ui/codicons/codicon/codicon.ttf'],
] as const satisfies readonly Parameters<typeof downloadAndSaveFile>[0][];

console.log(`🌍 Downloading monaco-editor with typescript: ${TYPESCRIPT_VERSION}`);
await Promise.all(files.map(downloadAndSaveFile));
process.exit(0);
