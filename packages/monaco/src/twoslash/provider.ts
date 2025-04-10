// based on: https://github.com/microsoft/TypeScript-Website/blob/v2/packages/playground/src/twoslashInlays.ts
import type * as monaco_editor from 'monaco-editor/esm/vs/editor/editor.api';
import { getHintsFromQueries } from './queries';

export const TWOSLASH_INLAY_HINTS_PROVIDER = 'twoslash inlay hints provider';

export const createTwoslashInlayProvider = (
  m: typeof monaco_editor,
  worker: monaco_editor.languages.typescript.TypeScriptWorker,
) => {
  const provider: monaco_editor.languages.InlayHintsProvider = {
    displayName: TWOSLASH_INLAY_HINTS_PROVIDER,
    provideInlayHints: async (model, range, cancel) => {
      return await getHintsFromQueries({ model, range, cancel, monaco: m, worker });
    },
  };

  return provider;
};
