// based on: https://github.com/microsoft/TypeScript-Website/blob/v2/packages/playground/src/twoslashInlays.ts
import type * as monaco from 'monaco-editor';
import { getHintsFromQueries } from './queries';

export const TWOSLASH_INLAY_HINTS_PROVIDER = 'twoslash inlay hints provider';

export const createTwoslashInlayProvider = (
  m: typeof monaco,
  worker: monaco.languages.typescript.TypeScriptWorker,
) => {
  const provider: monaco.languages.InlayHintsProvider = {
    displayName: TWOSLASH_INLAY_HINTS_PROVIDER,
    provideInlayHints: async (model, range, cancel) => {
      return await getHintsFromQueries({ model, range, cancel, monaco: m, worker });
    },
  };

  return provider;
};
