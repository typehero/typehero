// based on: https://github.com/microsoft/TypeScript-Website/blob/v2/packages/playground/src/twoslashInlays.ts
import type * as monaco from 'monaco-editor';

export const createTwoslashInlayProvider = (
  m: typeof monaco,
  worker: monaco.languages.typescript.TypeScriptWorker,
) => {
  const provider: monaco.languages.InlayHintsProvider = {
    provideInlayHints: async (model, _, cancel) => {
      const text = model.getValue();
      const queryRegex = /^\s*\/\/\s*\^\?$/gm;
      let match;
      const results: monaco.languages.InlayHint[] = [];
      if (model.isDisposed()) {
        return {
          hints: [],
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          dispose: () => {},
        };
      }

      while ((match = queryRegex.exec(text)) !== null) {
        const end = match.index + match[0].length - 1;
        const endPos = model.getPositionAt(end);
        const inspectionPos = new m.Position(endPos.lineNumber - 1, endPos.column);
        const inspectionOff = model.getOffsetAt(inspectionPos);

        if (cancel.isCancellationRequested) {
          return {
            hints: [],
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            dispose: () => {},
          };
        }

        const hint = (await worker.getQuickInfoAtPosition(model.uri.toString(), inspectionOff)) as {
          displayParts: { text: string }[];
        };
        if (!hint || !hint.displayParts) continue;

        // Make a one-liner
        let text = hint.displayParts
          .map((d: { text: string }) => d.text)
          .join('')
          .replace(/\r?\n\s*/g, ' ');
        if (text.length > 120) text = text.slice(0, 119) + '...';

        const inlay: monaco.languages.InlayHint = {
          // @ts-expect-error undocumented kind
          kind: 0,
          position: new m.Position(endPos.lineNumber, endPos.column + 1),
          label: text,
          paddingLeft: true,
        };

        results.push(inlay);
      }

      return {
        hints: results,
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        dispose: () => {},
      };
    },
  };

  return provider;
};
