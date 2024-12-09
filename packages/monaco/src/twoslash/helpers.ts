import type * as monaco from 'monaco-editor';

interface InlayHintInfo {
  hint: QuickInfoResponse | undefined;
  monaco: typeof monaco;
  position: monaco.Position;
}

type QuickInfoResponse = Awaited<ReturnType<typeof quickInfoRequest>>;
/** Leverages the `tsserver` protocol to try to get the type info at the given `position`. */
export async function quickInfoRequest({
  fileName,
  offset,
  worker,
}: {
  fileName: string;
  offset: number;
  worker: monaco.languages.typescript.TypeScriptWorker;
}) {
  return (await worker.getQuickInfoAtPosition(fileName, offset)) as {
    displayParts: { text: string }[];
  };
}

export function createInlayHint({ hint, monaco, position }: InlayHintInfo) {
  if (!hint?.displayParts) return;
  // Make a one-liner
  let text = hint.displayParts
    .map((d: { text: string }) => d.text)
    .join('')
    .replace(/\r?\n\s*/g, ' ');
  if (text.length > 120) text = `${text.slice(0, 119)}...`;

  const inlay: monaco.languages.InlayHint = {
    // @ts-expect-error undocumented kind
    kind: 0,
    position: new monaco.Position(position.lineNumber, position.column + 1),
    label: text,
    paddingLeft: true,
  };

  return inlay;
}

const range = (num: number) => [...Array(num).keys()];
interface LineInfo {
  model: monaco.editor.ITextModel;
  position: monaco.Position;
  lineLength: number;
  worker: monaco.languages.typescript.TypeScriptWorker;
  monaco: typeof monaco;
}
/** Gets the first `QuickInfo` response in a given line, if available. */
export async function getLeftMostHintOfLine({
  model,
  position,
  lineLength,
  monaco,
  worker,
}: LineInfo) {
  for (const i of range(lineLength)) {
    const newPosition: monaco.Position = new monaco.Position(position.lineNumber + 1, i);
    const offset = model.getOffsetAt(newPosition);

    const hint = await quickInfoRequest({
      fileName: model.uri.toString(),
      offset,
      worker,
    });

    if (!hint?.displayParts) {
      continue;
    }

    return hint;
  }
}
